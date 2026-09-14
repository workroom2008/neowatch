import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ScrollText, ShieldCheck } from 'lucide-react';
import { useI18n, useT } from '@/lib/i18n';

// Terms of use + privacy policy, on one page with anchors (#cgu / #confidentialite).
// ZH/EN copy; identifiers (emails, product names) stay as-is.
export function Legal() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const zh = lang === 'zh';

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash]);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[860px] px-5 py-8 text-[13.5px] leading-relaxed text-ink-2">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-ink-2 hover:border-accent hover:text-accent">
          <ArrowLeft size={14} /> {t('detail.back')}
        </button>

        <section id="cgu" className="mb-12 scroll-mt-6">
          <h1 className="mb-1 flex items-center gap-2 text-[24px] font-extrabold text-ink"><ScrollText size={22} className="text-accent" /> {zh ? '使用条款' : 'Terms of Use'}</h1>
          <p className="mb-5 font-mono text-[11px] text-ink-3">{zh ? '最后更新:2026 年 6 月' : 'Last updated: June 2026'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">1. {zh ? '服务' : 'The service'}</h2>
          <p>{zh ? <>NEOWATCH 是一个聚合器与播放器,收录对公众免费开放的视听直播流:由社区目录 <a href="https://iptv-org.github.io" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">iptv-org</a> 收录的电视频道、由 <a href="https://www.radio-browser.info" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">radio-browser</a> 收录的电台,以及由 <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Internet Archive</a> 托管的公有领域电影。NEOWATCH 不托管、不制作、不修改任何视听内容:本服务仅索引由各播出方公开发布的直播流,并直接从源地址播放。</> : <>NEOWATCH is an aggregator and player for freely available audiovisual streams: TV channels indexed by the community directory <a href="https://iptv-org.github.io" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">iptv-org</a>, radios indexed by <a href="https://www.radio-browser.info" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">radio-browser</a>, and public-domain films hosted by <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Internet Archive</a>. NEOWATCH hosts, produces and modifies no audiovisual content: the service indexes streams published and made publicly accessible by their respective broadcasters, and plays them from their source.</>}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">2. {zh ? '第三方内容' : 'Third-party content'}</h2>
          <p>{zh ? <>所收录的直播流归其播出方所有。其可用性、质量与合法性由发布方负责。如果您是被收录内容的权利人并希望下架,请与我们联系(第 6 条):该直播流将被尽快移出目录。高级会员订阅仅用于支付本服务的软件功能(多画面、电视节目单、去广告、同步、个人播放列表),绝不涉及对第三方内容的访问收费。</> : <>The indexed streams belong to their broadcasters. Their availability, quality and lawfulness are the responsibility of their publishers. If you are a rights holder of indexed content and wish it removed, contact us (section 6): the stream will be de-indexed promptly. The Premium subscription exclusively pays for software features of the service (multi-view, TV guide, no ads, sync, personal playlists) and never for access to third-party content.</>}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">3. {zh ? '合理使用' : 'Acceptable use'}</h2>
          <p>{zh ? '您承诺在遵守您所在国家/地区适用法律的前提下使用 NEOWATCH,不转售服务访问权限,不试图绕过其技术限制,且不将其用于侵犯第三方权利。' : 'You agree to use NEOWATCH in compliance with the law applicable in your country, not to resell access to the service, not to attempt to circumvent its technical limitations, and not to use it to infringe third-party rights.'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">4. {zh ? '订阅与付款' : 'Subscription and payment'}</h2>
          <p>{zh ? '高级会员按 Premium 页面显示的价格与时长收费,不含任何隐藏自动续订。可随时在账户中取消;Premium 权益保留至已付费周期结束。支付由第三方服务商(Stripe)处理;NEOWATCH 不存储任何银行卡数据。' : 'The Premium subscription is billed at the price shown on the Premium page, for the stated duration, with no hidden renewal. It can be cancelled at any time from the account; Premium access stays active until the end of the paid period. Payment is processed by a third-party provider (Stripe); NEOWATCH stores no banking data.'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">5. {zh ? '免责声明与责任' : 'Warranties and liability'}</h2>
          <p>{zh ? '本服务按“现状”提供。不保证第三方直播流的可用性。NEOWATCH 不对服务中断、第三方频道播出的内容,或因使用本服务产生的间接损失承担责任。' : 'The service is provided "as is". The availability of third-party streams is not guaranteed. NEOWATCH cannot be held liable for interruptions, for content broadcast by third-party channels, or for indirect damages related to the use of the service.'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">6. {zh ? '联系方式' : 'Contact'}</h2>
          <p>{zh ? '如有任何问题、下架请求或投诉:' : 'For any question, takedown request or complaint:'} <span className="font-mono text-accent">sin.soclose@gmail.com</span>.</p>
        </section>

        <section id="confidentialite" className="scroll-mt-6">
          <h1 className="mb-1 flex items-center gap-2 text-[24px] font-extrabold text-ink"><ShieldCheck size={22} className="text-accent" /> {zh ? '隐私政策' : 'Privacy Policy'}</h1>
          <p className="mb-5 font-mono text-[11px] text-ink-3">{zh ? '最后更新:2026 年 6 月' : 'Last updated: June 2026'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">1. {zh ? '收集的数据' : 'Data collected'}</h2>
          <p>{zh ? '账户:邮箱地址、可选昵称、密码(使用 bcrypt 哈希存储,绝不明文)、订阅套餐、收藏以及多画面配置(仅在你选择同步时)。NEOWATCH 不存储任何银行卡数据(支付由 Stripe 处理)。本服务不使用第三方广告跟踪器,也不转售数据。' : 'Account: email address, optional name, password (stored hashed with bcrypt, never in plain text), subscription plan, favorites and multi-view configuration if you choose to sync them. No banking data is stored by NEOWATCH (payment handled by Stripe). The service uses no third-party ad trackers and resells no data.'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">2. {zh ? '本地存储' : 'Local storage'}</h2>
          <p>{zh ? '应用会在你的浏览器(localStorage)中记录显示偏好、主题、本地收藏、最近搜索和会话令牌。这些数据只保存在你的设备上,可通过清除该网站数据来删除。' : 'The app stores in your browser (localStorage) your display preferences, theme, local favorites, recent searches and session token. This data stays on your device and can be erased by clearing the site data.'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">3. {zh ? '技术日志' : 'Technical logs'}</h2>
          <p>{zh ? '服务器仅保存维护安全与正常运行所需的最少技术日志(错误、按 IP 限流),并定期清理。' : 'The server keeps minimal technical logs (errors, per-IP rate limiting) required for security and proper operation, purged regularly.'}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">4. {zh ? '你的权利(GDPR)' : 'Your rights (GDPR)'}</h2>
          <p>{zh ? <>你可以随时查看、更正或删除你的数据:账户删除功能直接位于“我的账户”面板,并立即清除所有相关数据(邮箱、收藏、配置)。其他请求请联系: <span className="font-mono text-accent">sin.soclose@gmail.com</span>.</> : <>You can view, correct or delete your data at any time: account deletion is available directly in the "My account" panel and immediately erases all associated data (email, favorites, configuration). For any other request: <span className="font-mono text-accent">sin.soclose@gmail.com</span>.</>}</p>

          <h2 className="mb-1.5 mt-6 text-[16px] font-bold text-ink">5. {zh ? '播放原理' : 'Reading streams'}</h2>
          <p>{zh ? '播放优先直接连接播出方源地址:此时你的 IP 对播出方可见,与任何网页播放相同。当某个直播流需要 NEOWATCH 服务器中转(技术兼容性)时,源地址看到的是服务器地址。' : 'Playback happens directly from the broadcaster source first: your IP is then visible to that broadcaster, as with any web playback. When a stream requires relaying through the NEOWATCH server (technical compatibility), the source sees the server address instead.'}</p>
        </section>
      </div>
    </main>
  );
}
