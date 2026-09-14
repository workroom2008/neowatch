import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { X, Check, Crown, Loader2, Sparkles } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/store/authStore';
import { useUI } from '@/store/uiStore';
import { useCatalog } from '@/store/catalogStore';
import { useEscapeClose } from './ui';
import { useI18n, useT } from '@/lib/i18n';
import type { Plan } from '@/types';

export function Pricing() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const open = useUI((s) => s.pricingOpen);
  const setPricing = useUI((s) => s.setPricing);
  const setLogin = useUI((s) => s.setLogin);
  const { user, refresh, isPremium } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setMsg(null);
    api.get<{ plans: Plan[] }>(`/billing/plans?lang=${lang}`).then((r) => setPlans(r.plans)).catch(() => {});
  }, [open]);
  useEscapeClose(open, () => setPricing(false));

  if (!open) return null;

  const upgrade = async () => {
    if (!user) {
      setPricing(false);
      setLogin(true);
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const r = await api.post<{ activated?: boolean; url?: string }>('/billing/checkout', { plan: 'premium' });
      if (r.url) {
        // Stripe: redirect to hosted checkout (premium granted by the webhook).
        window.location.href = r.url;
        return;
      }
      if (r.activated) {
        await refresh();
        await useCatalog.getState().loadMeta();
        await useCatalog.getState().loadChannels();
        setMsg(lang === 'zh' ? '🎉 高级会员已开通!广告关闭、扩展多画面和同步已启用。' : '🎉 Premium activated! No ads, extended multi-view and sync enabled.');
        setTimeout(() => setPricing(false), 1200);
      }
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : t('pricing.unavailable'));
    } finally {
      setBusy(false);
    }
  };

  const premium = plans.find((p) => p.id === 'premium');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/80 p-4" onClick={() => setPricing(false)}>
      <div className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center gap-2">
          <Crown className="text-amber-400" size={20} />
          <h2 className="text-lg font-bold text-ink">{t('pricing.upgradeTitle')}</h2>
          <button onClick={() => setPricing(false)} className="ml-auto rounded-lg p-1.5 text-ink/50 hover:bg-white/5">
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-ink/50">{t('pricing.description')}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.id}
              className={clsx(
                'relative flex flex-col rounded-2xl border p-4',
                p.id === 'premium'
                  ? 'border-accent/50 bg-gradient-to-b from-accent/[0.12] to-accent/[0.02] shadow-xl shadow-accent/10 ring-1 ring-accent/20'
                  : 'border-white/[0.08] bg-white/[0.02]'
              )}
            >
              {p.id === 'premium' && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-black shadow-lg">
                  {lang === 'zh' ? '推荐' : 'RECOMMENDED'}
                </span>
              )}
              <div className="flex items-center gap-2">
                {p.id === 'premium' ? <Crown size={16} className="text-amber-400" /> : <Sparkles size={16} className="text-ink/50" />}
                <h3 className="font-semibold text-ink">{p.name}</h3>
              </div>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-ink">{p.price === 0 ? t('pricing.free') : `${p.price} ${p.currency}`}</span>
                {p.period && <span className="text-xs text-ink/40">/{p.period}</span>}
              </div>
              <ul className="mb-4 flex-1 space-y-1.5">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-ink/70">
                    <Check size={13} className={clsx('mt-0.5 shrink-0', p.id === 'premium' ? 'text-accent' : 'text-ink/40')} />
                    {f}
                  </li>
                ))}
              </ul>
              {p.id === 'premium' ? (
                <button
                  onClick={upgrade}
                  disabled={busy || isPremium()}
                  className="flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Crown size={16} />}
                  {isPremium() ? (lang === 'zh' ? '已是高级会员' : 'Already Premium') : user ? t('home.goPremium') : (lang === 'zh' ? '登录后订阅' : 'Sign in to subscribe')}
                </button>
              ) : (
                <div className="rounded-lg border border-white/10 py-2.5 text-center text-xs text-ink/40">{t('pricing.currentPlan')}</div>
              )}
            </div>
          ))}
        </div>

        {msg && <p className="mt-4 rounded-lg bg-white/[0.04] px-3 py-2 text-center text-sm text-ink/80">{msg}</p>}
        {premium && (
          <p className="mt-3 text-center text-[11px] text-ink/30">
            {lang === 'zh' ? '你付费的是服务本身(精选、EPG、多画面、去广告),而不是公开的直播流。可随时取消。' : 'You pay for the service (curation, EPG, multi-view, no ads), not for the public streams themselves. Cancel anytime.'}
          </p>
        )}
      </div>
    </div>
  );
}
