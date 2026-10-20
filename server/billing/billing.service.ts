import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { StorageService } from '../storage/storage.service';

export interface CreateCheckoutDto {
  userId: string;
  email: string;
  planId: 'pro' | 'business';
  billingCycle?: 'monthly' | 'one_time';
  origin?: string;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripeClient: Stripe | null = null;
  private mpClient: MercadoPagoConfig | null = null;

  constructor(@Inject(StorageService) private readonly storage: StorageService) {
    this.initStripe();
    this.initMercadoPago();
  }

  private initStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && !key.startsWith('pk_')) {
      try {
        this.stripeClient = new Stripe(key, {
          apiVersion: '2025-02-24.acacia' as any
        });
        this.logger.log('Stripe client initialized successfully.');
      } catch (err) {
        this.logger.warn('Failed to initialize Stripe client:', err);
      }
    } else {
      this.logger.log('STRIPE_SECRET_KEY not provided. Stripe checkout will run in demo/configuration mode.');
    }
  }

  private initMercadoPago() {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (token) {
      try {
        this.mpClient = new MercadoPagoConfig({
          accessToken: token,
          options: { timeout: 10000 }
        });
        this.logger.log('Mercado Pago client initialized successfully.');
      } catch (err) {
        this.logger.warn('Failed to initialize Mercado Pago client:', err);
      }
    } else {
      this.logger.log('MERCADOPAGO_ACCESS_TOKEN not provided. Mercado Pago will run in demo/configuration mode.');
    }
  }

  getGatewayStatus() {
    return {
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      mercadopagoConfigured: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
      mercadopagoWebhookConfigured: Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET)
    };
  }

  /**
   * Create Stripe Checkout Session
   */
  async createStripeCheckout(dto: CreateCheckoutDto): Promise<{ url: string; sessionId?: string; isDemo?: boolean }> {
    const origin = dto.origin || 'https://www.mapflex.app';
    const plan = dto.planId;
    const cycle = dto.billingCycle || (plan === 'business' ? 'monthly' : 'one_time');

    if (!this.stripeClient) {
      // Return a simulated/preview checkout URL if key is not yet set in environment
      return {
        isDemo: true,
        url: `${origin}/planes?payment=demo_preview&plan=${plan}&cycle=${cycle}&gateway=stripe`
      };
    }

    try {
      // Pricing in USD (amounts in cents)
      let unitAmount = 2900; // $29 USD default for Pro one-time
      let productName = 'FlexMap Plan Pro — Acceso Permanente';
      let productDesc = 'Hasta 5 planos activos en la nube, incrustación iFrame y recorridos virtuales 360°.';
      let mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment';

      if (plan === 'pro') {
        if (cycle === 'monthly') {
          unitAmount = 1900; // $19 USD / month
          productName = 'FlexMap Plan Pro — Suscripción Mensual';
          mode = 'subscription';
        } else {
          unitAmount = 2900; // $29 USD one-time
          productName = 'FlexMap Plan Pro — Pago Único por Evento';
          mode = 'payment';
        }
      } else if (plan === 'business') {
        unitAmount = 5900; // $59 USD / month
        productName = 'FlexMap Plan Business — Para Desarrollos & Equipos';
        productDesc = 'Hasta 20 planos en la nube, recorridos ilimitados y soporte prioritario directo.';
        mode = 'subscription';
      }

      const session = await this.stripeClient.checkout.sessions.create({
        customer_email: dto.email,
        client_reference_id: dto.userId,
        metadata: {
          userId: dto.userId,
          planId: plan,
          billingCycle: cycle
        },
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
                description: productDesc,
                images: [`${origin}/images/hero-map-qr.jpg`]
              },
              unit_amount: unitAmount,
              ...(mode === 'subscription' ? { recurring: { interval: 'month' } } : {})
            },
            quantity: 1
          }
        ],
        mode,
        success_url: `${origin}/planes?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
        cancel_url: `${origin}/#precios`
      });

      return {
        url: session.url || `${origin}/planes?payment=success`,
        sessionId: session.id
      };
    } catch (err: any) {
      this.logger.error('Error creating Stripe session:', err);
      throw new BadRequestException(err?.message || 'Error al conectar con Stripe');
    }
  }

  /**
   * Handle Stripe Webhooks
   */
  async handleStripeWebhook(signature: string, rawBody: Buffer): Promise<{ received: boolean }> {
    if (!this.stripeClient) {
      this.logger.warn('Stripe webhook received but Stripe client is not initialized.');
      return { received: false };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      if (webhookSecret) {
        event = this.stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } else {
        // Fallback for development if secret not set
        event = JSON.parse(rawBody.toString('utf-8')) as Stripe.Event;
      }
    } catch (err: any) {
      this.logger.error(`Stripe signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    this.logger.log(`Processing Stripe webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        const planId = (session.metadata?.planId as 'pro' | 'business') || 'pro';
        if (userId) {
          await this.storage.updateUser(userId, {
            tier: planId,
            stripeCustomerId: String(session.customer || ''),
            stripeSubscriptionId: String(session.subscription || ''),
            billingProvider: 'stripe'
          });
          this.logger.log(`User ${userId} successfully upgraded to tier ${planId} via Stripe checkout.`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = String(subscription.customer);
        // Find user by stripeCustomerId
        const allUsers = Object.values(this.storage.store?.users || {});
        const user = allUsers.find((u) => u.stripeCustomerId === customerId);
        if (user) {
          await this.storage.updateUser(user.id, {
            tier: 'free'
          });
          this.logger.log(`User ${user.id} reverted to free tier due to subscription cancellation.`);
        }
        break;
      }

      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Create Mercado Pago Checkout Preference
   */
  async createMercadoPagoPreference(dto: CreateCheckoutDto): Promise<{ url: string; preferenceId?: string; isDemo?: boolean }> {
    const origin = dto.origin || 'https://www.mapflex.app';
    const plan = dto.planId;
    const cycle = dto.billingCycle || 'one_time';

    if (!this.mpClient) {
      return {
        isDemo: true,
        url: `${origin}/planes?payment=demo_preview&plan=${plan}&cycle=${cycle}&gateway=mercadopago`
      };
    }

    try {
      const preference = new Preference(this.mpClient);

      // Price in Argentine Pesos (ARS) or configured equivalent
      let unitPrice = 35000;
      let title = 'FlexMap Plan Pro — Acceso Permanente';

      if (plan === 'pro') {
        if (cycle === 'monthly') {
          unitPrice = Number(process.env.MP_PRICE_PRO_MONTHLY_ARS || 24000);
          title = 'FlexMap Plan Pro — Mensual';
        } else {
          unitPrice = Number(process.env.MP_PRICE_PRO_ARS || 35000);
          title = 'FlexMap Plan Pro — Pago Único por Evento';
        }
      } else if (plan === 'business') {
        unitPrice = Number(process.env.MP_PRICE_BUSINESS_ARS || 75000);
        title = 'FlexMap Plan Business — Mensual';
      }

      const res = await preference.create({
        body: {
          items: [
            {
              id: `flexmap_${plan}_${cycle}`,
              title,
              quantity: 1,
              unit_price: unitPrice,
              currency_id: 'ARS',
              description: 'Plataforma interactiva FlexMap para trazado y recorridos virtuales 360°.'
            }
          ],
          payer: {
            email: dto.email
          },
          metadata: {
            user_id: dto.userId,
            plan_id: plan,
            billing_cycle: cycle
          },
          back_urls: {
            success: `${origin}/planes?payment=success&provider=mercadopago&plan=${plan}`,
            failure: `${origin}/#precios`,
            pending: `${origin}/planes?payment=pending&provider=mercadopago&plan=${plan}`
          },
          auto_return: 'approved',
          notification_url: `${origin}/api/billing/webhook/mercadopago`,
          statement_descriptor: 'FLEXMAP'
        }
      });

      return {
        url: res.init_point || res.sandbox_init_point || `${origin}/planes?payment=success`,
        preferenceId: res.id
      };
    } catch (err: any) {
      this.logger.error('Error creating Mercado Pago preference:', err);
      throw new BadRequestException(err?.message || 'Error al conectar con Mercado Pago');
    }
  }

  /**
   * Handle Mercado Pago Webhook / IPN
   */
  async handleMercadoPagoWebhook(body: any, query: any): Promise<{ received: boolean }> {
    if (!this.mpClient) {
      this.logger.warn('Mercado Pago webhook received but client is not initialized.');
      return { received: false };
    }

    try {
      const topic = query?.topic || query?.type || body?.type || body?.topic;
      const paymentId = query?.id || query?.['data.id'] || body?.data?.id || body?.id;

      if ((topic === 'payment' || body?.action === 'payment.created' || body?.action === 'payment.updated') && paymentId) {
        const paymentApi = new Payment(this.mpClient);
        const paymentData = await paymentApi.get({ id: String(paymentId) });

        this.logger.log(`Mercado Pago payment status for ${paymentId}: ${paymentData.status}`);

        if (paymentData.status === 'approved') {
          const userId = paymentData.metadata?.user_id;
          const planId = (paymentData.metadata?.plan_id as 'pro' | 'business') || 'pro';

          if (userId) {
            await this.storage.updateUser(userId, {
              tier: planId,
              mpPaymentId: String(paymentId),
              billingProvider: 'mercadopago'
            });
            this.logger.log(`User ${userId} successfully upgraded to tier ${planId} via Mercado Pago.`);
          }
        }
      }

      return { received: true };
    } catch (err: any) {
      this.logger.error('Error handling Mercado Pago webhook:', err);
      return { received: false };
    }
  }
}
