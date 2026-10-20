import React from 'react';
import { CheckIcon, MinusIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PricingSectionProps {
  onCreateFree?: () => void;
  onSelectPro?: () => void;
  onSelectBusiness?: () => void;
}

export function PricingSection({ onCreateFree, onSelectPro, onSelectBusiness }: PricingSectionProps) {
  const { t } = useLanguage();

  const handleProClick = () => {
    if (onSelectPro) {
      onSelectPro();
    } else {
      window.location.href = 'mailto:dmarinobata@gmail.com?subject=Consulta%20Plan%20Pro%20MapFlex';
    }
  };

  const handleBusinessClick = () => {
    if (onSelectBusiness) {
      onSelectBusiness();
    } else {
      window.location.href = 'mailto:dmarinobata@gmail.com?subject=Consulta%20Plan%20Business%20MapFlex';
    }
  };

  return (
    <section id="precios" aria-labelledby="pricing-heading" className="scroll-mt-16 relative overflow-hidden py-16 sm:py-24 border-t border-line bg-surface/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 id="pricing-heading" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('pricingTitle')}
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            {t('pricingSubtitle')}
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 items-stretch">
          {/* Card 1: Gratuito ($0) */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-ink/20">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-ink">{t('pricingFreeName')}</h3>
                <span className="rounded-full bg-subtle px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {t('pricingFreeBadge')}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                {t('pricingFreeDesc')}
              </p>

              <div className="mt-6 flex items-baseline gap-1 border-b border-line pb-6">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
                  {t('pricingFreePrice')}
                </span>
                <span className="text-xs sm:text-sm font-medium text-muted">
                  / {t('pricingFreePeriod')}
                </span>
              </div>

              {/* Feature List */}
              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">{t('pricingFeat1MapCloud')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatLocalUnlimited')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatDrawingTools')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatMetrics')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatStreetView')}</span>
                </li>
                {/* AI feature temporarily commented out
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatAi')}</span>
                </li>
                */}
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('pricingFeatPublicShare')}</span>
                </li>
                <li className="flex items-start gap-2.5 text-muted/70 line-through">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-subtle text-muted/50 mt-0.5">
                    <MinusIcon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatNoIframe')}</span>
                </li>
                <li className="flex items-start gap-2.5 text-muted/70 line-through">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-subtle text-muted/50 mt-0.5">
                    <MinusIcon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatNoGeojson')}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={onCreateFree}
                className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-line bg-surface text-sm font-semibold text-ink shadow-2xs hover:bg-subtle active:scale-98 transition-all"
              >
                {t('pricingFreeCta')}
              </button>
            </div>
          </div>

          {/* Card 2: Pro ($29) - Highlighted */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-amber-500/70 bg-gradient-to-b from-surface via-surface to-amber-500/5 p-6 sm:p-8 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30">
            {/* Top pill badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1 text-xs font-bold text-black shadow-md">
                <SparklesIcon className="h-3.5 w-3.5" />
                {t('pricingProBadge')}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-ink">{t('pricingProName')}</h3>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                {t('pricingProDesc')}
              </p>

              <div className="mt-6 flex flex-col border-b border-line pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
                    {t('pricingProPrice')}
                  </span>
                  <span className="text-xs font-bold uppercase text-accent tracking-wider ml-1">USD</span>
                </div>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted">
                  {t('pricingProPeriod')}
                </span>
              </div>

              {/* Feature List */}
              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">{t('pricingFeat5Cloud')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {t('pricingFeatIframe')}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatPublicShare5')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">{t('pricingFeatGeojson')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{t('pricingFeatQr')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatStreetView5')}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={handleProClick}
                className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-bold text-black shadow-md hover:from-amber-400 hover:to-orange-400 active:scale-98 transition-all"
              >
                {t('pricingProCta')}
              </button>
            </div>
          </div>

          {/* Card 3: Business ($59) */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-ink/20">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-ink">{t('pricingBusinessName')}</h3>
                <span className="rounded-full bg-subtle px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {t('pricingBusinessBadge')}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                {t('pricingBusinessDesc')}
              </p>

              <div className="mt-6 flex flex-col border-b border-line pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
                    {t('pricingBusinessPrice')}
                  </span>
                  <span className="text-xs font-bold uppercase text-accent tracking-wider ml-1">USD</span>
                </div>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted">
                  {t('pricingBusinessPeriod')}
                </span>
              </div>

              {/* Feature List */}
              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {t('pricingFeatBusinessCloud')}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">{t('pricingFeatUnlimitedStreetView')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{t('pricingFeatIframe')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">{t('pricingFeatMultiCollab')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('pricingFeatCustomFeatures')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">{t('pricingFeatPrioritySupport')}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={handleBusinessClick}
                className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-line bg-surface text-sm font-semibold text-ink shadow-2xs hover:bg-subtle active:scale-98 transition-all"
              >
                {t('pricingBusinessCta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
