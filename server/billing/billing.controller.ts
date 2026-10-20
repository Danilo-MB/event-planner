import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { AuthService } from '../auth/auth.service';

@Controller('billing')
export class BillingController {
  constructor(
    @Inject(BillingService) private readonly billingService: BillingService,
    @Inject(AuthService) private readonly authService: AuthService
  ) {}

  @Get('status')
  async getStatus(@Headers('authorization') authHeader?: string) {
    const gatewayStatus = this.billingService.getGatewayStatus();
    let userTier = 'free';

    if (authHeader) {
      try {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        const profile = await this.authService.getProfile(token);
        if (profile?.user?.tier) {
          userTier = profile.user.tier;
        }
      } catch {
        // Ignore auth error for public status check
      }
    }

    return {
      status: 'ok',
      currentTier: userTier,
      gateways: gatewayStatus
    };
  }

  @Post('checkout/stripe')
  async createStripeCheckout(
    @Body() body: { planId?: 'pro' | 'business'; billingCycle?: 'monthly' | 'one_time'; origin?: string },
    @Headers('authorization') authHeader?: string,
    @Headers('origin') headerOrigin?: string
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Debes iniciar sesión para suscribirte o adquirir un plan.');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const profile = await this.authService.getProfile(token);
    if (!profile?.user?.id) {
      throw new UnauthorizedException('Token de sesión inválido o expirado.');
    }

    const planId = body.planId || 'pro';
    const origin = body.origin || headerOrigin || 'https://www.mapflex.app';

    return this.billingService.createStripeCheckout({
      userId: profile.user.id,
      email: profile.user.email,
      planId,
      billingCycle: body.billingCycle,
      origin
    });
  }

  @Post('checkout/mercadopago')
  async createMercadoPagoCheckout(
    @Body() body: { planId?: 'pro' | 'business'; billingCycle?: 'monthly' | 'one_time'; origin?: string },
    @Headers('authorization') authHeader?: string,
    @Headers('origin') headerOrigin?: string
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Debes iniciar sesión para suscribirte o adquirir un plan.');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const profile = await this.authService.getProfile(token);
    if (!profile?.user?.id) {
      throw new UnauthorizedException('Token de sesión inválido o expirado.');
    }

    const planId = body.planId || 'pro';
    const origin = body.origin || headerOrigin || 'https://www.mapflex.app';

    return this.billingService.createMercadoPagoPreference({
      userId: profile.user.id,
      email: profile.user.email,
      planId,
      billingCycle: body.billingCycle,
      origin
    });
  }

  @Post('webhook/stripe')
  async stripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
    @Body() body: any
  ) {
    if (!signature && !body) {
      throw new BadRequestException('Invalid Stripe webhook request');
    }

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(body || {}));
    return this.billingService.handleStripeWebhook(signature || '', rawBody);
  }

  @Post('webhook/mercadopago')
  async mercadoPagoWebhook(@Body() body: any, @Query() query: any) {
    return this.billingService.handleMercadoPagoWebhook(body, query);
  }
}
