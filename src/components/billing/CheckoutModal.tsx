import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CreditCardIcon, ExternalLinkIcon, LockIcon, ShieldCheckIcon, SparklesIcon, XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../utils/api';
import { toast } from 'sonner';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: 'pro' | 'business';
}

export function CheckoutModal({ isOpen, onClose, initialPlan = 'pro' }: CheckoutModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>(initialPlan);
  const [gateway, setGateway] = useState<'stripe' | 'mercadopago'>('stripe');
  const [cycle, setCycle] = useState<'one_time' | 'monthly'>('one_time');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.mapflex.app';
      let res: { url: string; isDemo?: boolean };

      if (gateway === 'stripe') {
        res = await api.billing.checkoutStripe({
          planId: selectedPlan,
          billingCycle: selectedPlan === 'business' ? 'monthly' : cycle,
          origin
        });
      } else {
        res = await api.billing.checkoutMercadoPago({
          planId: selectedPlan,
          billingCycle: selectedPlan === 'business' ? 'monthly' : cycle,
          origin
        });
      }

      if (res.url) {
        if (res.isDemo) {
          toast.info('Modo demo de pagos activado. Redirigiendo a confirmación...');
        }
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'No se pudo conectar con la pasarela de pagos.');
    } finally {
      setLoading(false);
    }
  };

  const isPro = selectedPlan === 'pro';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-subtle/40">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                <CreditCardIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">
                  {isPro ? 'Activar Plan Pro' : 'Activar Plan Business'}
                </h3>
                <p className="text-xs text-muted">Pago 100% seguro con activación inmediata</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-subtle hover:text-ink transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Plan Summary Card */}
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-emerald-500/10 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isPro ? 'Plan Pro' : 'Plan Business'}
                  </span>
                  <div className="mt-1 text-2xl font-extrabold text-ink">
                    {gateway === 'stripe' ? (
                      isPro ? (cycle === 'one_time' ? '$29 USD' : '$19 USD/mes') : '$59 USD/mes'
                    ) : (
                      isPro ? (cycle === 'one_time' ? '$35.000 ARS' : '$24.000 ARS/mes') : '$75.000 ARS/mes'
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-muted">
                  {user?.email && <span className="block truncate max-w-[180px] font-mono text-[11px] text-ink">{user.email}</span>}
                  <span>Activación en segundos</span>
                </div>
              </div>

              {/* Key Features included */}
              <ul className="mt-3 space-y-1.5 text-xs text-ink/90 border-t border-amber-500/20 pt-3">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{isPro ? 'Hasta 5 planos activos en la nube' : 'Hasta 20 planos activos en la nube'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Incrustar con iFrame (1 clic) en tu web o WordPress</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Descarga de códigos QR vectoriales para cartelería física</span>
                </li>
              </ul>
            </div>

            {/* Billing Cycle Option for Pro */}
            {isPro && (
              <div>
                <label className="text-xs font-semibold text-ink block mb-2">Modalidad de pago</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCycle('one_time')}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      cycle === 'one_time'
                        ? 'border-amber-500 bg-amber-500/10 text-ink ring-1 ring-amber-500'
                        : 'border-line bg-surface hover:bg-subtle text-muted'
                    }`}
                  >
                    <span className="text-xs font-bold text-ink">Pago Único</span>
                    <span className="text-[11px] text-muted mt-0.5">Por evento / proyecto</span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                      {gateway === 'stripe' ? '$29 USD' : '$35.000 ARS'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCycle('monthly')}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      cycle === 'monthly'
                        ? 'border-amber-500 bg-amber-500/10 text-ink ring-1 ring-amber-500'
                        : 'border-line bg-surface hover:bg-subtle text-muted'
                    }`}
                  >
                    <span className="text-xs font-bold text-ink">Suscripción</span>
                    <span className="text-[11px] text-muted mt-0.5">Mensual recurrente</span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                      {gateway === 'stripe' ? '$19 USD/mes' : '$24.000 ARS/mes'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Gateway Selection */}
            <div>
              <label className="text-xs font-semibold text-ink block mb-2">Selecciona tu método de pago</label>
              <div className="space-y-2">
                {/* Stripe Option */}
                <button
                  type="button"
                  onClick={() => setGateway('stripe')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                    gateway === 'stripe'
                      ? 'border-ink bg-subtle text-ink ring-1 ring-ink'
                      : 'border-line bg-surface hover:bg-subtle/50 text-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-12 place-items-center rounded-lg bg-indigo-600 text-white font-extrabold text-xs tracking-wider">
                      Stripe
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <span>Tarjetas Internacionales / Apple Pay / Google Pay</span>
                        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          USD
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">Acepta Visa, Mastercard, Amex de cualquier país</p>
                    </div>
                  </div>
                  <div className={`h-4 w-4 rounded-full border grid place-items-center ${gateway === 'stripe' ? 'border-ink bg-ink' : 'border-line'}`}>
                    {gateway === 'stripe' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Mercado Pago Option */}
                <button
                  type="button"
                  onClick={() => setGateway('mercadopago')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                    gateway === 'mercadopago'
                      ? 'border-[#009ee3] bg-[#009ee3]/10 text-ink ring-1 ring-[#009ee3]'
                      : 'border-line bg-surface hover:bg-subtle/50 text-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-12 place-items-center rounded-lg bg-[#009ee3] text-white font-extrabold text-[11px] tracking-tight">
                      MPago
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <span>Mercado Pago Argentina & LATAM</span>
                        <span className="rounded bg-[#009ee3]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#009ee3]">
                          ARS
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">Débito, crédito local o dinero en cuenta</p>
                    </div>
                  </div>
                  <div className={`h-4 w-4 rounded-full border grid place-items-center ${gateway === 'mercadopago' ? 'border-[#009ee3] bg-[#009ee3]' : 'border-line'}`}>
                    {gateway === 'mercadopago' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-muted bg-subtle/50 p-2.5 rounded-lg border border-line/60">
              <LockIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span>Transacción encriptada con SSL de 256 bits y certificación PCI-DSS Nivel 1.</span>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleCheckout}
              className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-bold text-on-ink shadow-md transition-all hover:bg-ink/90 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Conectando con la pasarela...</span>
              ) : (
                <>
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
                  <span>
                    Continuar a pagar con {gateway === 'stripe' ? 'Stripe (USD)' : 'Mercado Pago (ARS)'}
                  </span>
                  <ExternalLinkIcon className="h-3.5 w-3.5 opacity-70" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
