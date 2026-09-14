import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'zh' | 'en';

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

// UI string dictionary. Keys are dot-namespaced; every key has zh/en.
type Tr = Record<Lang, string>;
const DICT: Record<string, Tr> = {
  // TopBar
  'search.placeholder': { zh: '搜索频道、比赛、节目…', en: 'Search a channel, a match, a show…' },
  'search.clear': { zh: '清除', en: 'Clear' },
  'search.recent': { zh: '最近搜索', en: 'Recent searches' },
  'top.online': { zh: '直播中', en: 'ONLINE' },
  'top.premium': { zh: '高级会员', en: 'Premium' },
  'top.install': { zh: '安装', en: 'Install' },
  'top.installTv': { zh: '安装（电视 / 手机）', en: 'Install (TV / mobile)' },
  'top.settings': { zh: '设置', en: 'Settings' },
  'top.multi': { zh: '多画面', en: 'Multi-view' },
  'top.login': { zh: '登录', en: 'Sign in' },
  'top.account': { zh: '我的账户', en: 'My account' },
  'top.admin': { zh: '管理', en: 'Admin' },
  // Promo strip
  'promo.offer': { zh: '优惠', en: 'OFFER' },
  'promo.tip': { zh: '小贴士', en: 'TIP' },
  'promo.premiumMsg': { zh: '高级会员：无广告、扩展多画面、专属播放列表与同步', en: 'Premium: ad-free, extended multi-view, your playlists & sync' },
  'promo.installMsg': { zh: '把 NEOWATCH 安装到电视、手机和电脑', en: 'Install NEOWATCH on your TV, phone and computer' },
  'promo.discover': { zh: '了解更多', en: 'Discover' },
  // Home
  'home.live': { zh: '直播', en: 'Live' },
  'home.heroTitle1': { zh: '直播，', en: 'Live TV,' },
  'home.heroTitle2': { zh: '无界限', en: 'unlimited' },
  'home.heroTagline': { zh: '体育、新闻、电影、剧集、音乐、少儿……全球数千个频道，一键即看。', en: 'Sport & football, news, movies, series, music, kids… thousands of channels worldwide, one click away.' },
  'home.watch': { zh: '观看', en: 'Watch' },
  'home.myList': { zh: '我的列表', en: 'My list' },
  'home.inMyList': { zh: '已在列表中', en: 'In my list' },
  'home.browseCategories': { zh: '按分类浏览', en: 'Browse by category' },
  'home.liveNow': { zh: '正在直播', en: 'Live now' },
  'home.favorites': { zh: '我的收藏', en: 'My favorites' },
  'home.resume': { zh: '继续观看', en: 'Resume' },
  'home.seeAll': { zh: '查看全部', en: 'See all' },
  'home.channelsCount': { zh: '个频道', en: 'channels' },
  'home.freeBannerTitle': { zh: '你正在使用免费版', en: "You're watching on the free plan" },
  'home.freeBannerSub': { zh: '整个目录都已免费。升级高级会员即可去除广告、解锁扩展多画面、自定义 M3U 播放列表和跨设备同步。', en: 'The whole catalog is already free. Go Premium to remove ads, get extended multi-view, your M3U playlists and sync.' },
  'home.goPremium': { zh: '升级高级会员', en: 'Go Premium' },
  // FilterBar
  'filter.allCategories': { zh: '全部分类', en: 'All categories' },
  'filter.allCountries': { zh: '所有国家', en: 'All countries' },
  'filter.allLanguages': { zh: '所有语言', en: 'All languages' },
  'filter.online': { zh: '在线', en: 'Online' },
  'filter.noGeo': { zh: '无地区限制', en: 'No geo-block' },
  'filter.check': { zh: '检测', en: 'Check' },
  'filter.sortSmart': { zh: '排序：相关度', en: 'Sort: relevance' },
  'filter.sortName': { zh: '排序：A→Z', en: 'Sort: A→Z' },
  'filter.sortLatency': { zh: '排序：最快', en: 'Sort: fastest' },
  'filter.allChannels': { zh: '全部频道', en: 'All channels' },
  // Settings
  'set.title': { zh: '外观与播放', en: 'Appearance & playback' },
  'set.language': { zh: '语言', en: 'Language' },
  'set.accent': { zh: '主题色', en: 'Accent color' },
  'set.theme': { zh: '背景主题', en: 'Background theme' },
  'set.density': { zh: '网格密度', en: 'Grid density' },
  'set.playback': { zh: '播放', en: 'Playback' },
  'set.defaultMuted': { zh: '默认静音', en: 'Muted by default' },
  'set.autoplay': { zh: '自动播放', en: 'Autoplay' },
  'set.preferProxy': { zh: '始终走代理', en: 'Always use the proxy' },
  'set.preferProxyHint': { zh: '适用于屏蔽直播流的网络', en: 'Useful on networks that block streams' },
  'set.showOffline': { zh: '显示离线频道', en: 'Show offline channels' },
  'set.reduceMotion': { zh: '减少动画', en: 'Reduce motion' },
  // Player
  'player.interrupted': { zh: '播放中断', en: 'Playback interrupted' },
  'player.retry': { zh: '重试', en: 'Retry' },
  'player.forceProxy': { zh: '强制代理', en: 'Force proxy' },
  'player.connecting': { zh: '连接中…', en: 'Connecting…' },
  'player.viaProxy': { zh: '正在通过代理连接…', en: 'Connecting via proxy…' },
  'player.retrying': { zh: '正在重试…', en: 'Retrying…' },
  'player.buffering': { zh: '缓冲中…', en: 'Buffering…' },
  'player.audioTrack': { zh: '音轨', en: 'Audio' },
  'player.subtitles': { zh: '字幕', en: 'Subtitles' },
  'player.off': { zh: '关闭', en: 'Off' },
  // Home misc
  'home.adLabel': { zh: '广告', en: 'AD' },
  'home.loading': { zh: '目录加载中…', en: 'Loading the catalog…' },
  'home.heroClip': { zh: '数千个频道，一键即看。', en: 'thousands of channels, one click away.' },
  'home.international': { zh: '国际', en: 'International' },
  // QR / device pairing (sign in a TV by scanning with the phone)
  'qr.connectPhone': { zh: '用手机登录', en: 'Sign in with my phone' },
  'qr.title': { zh: '扫码登录', en: 'Sign in by QR' },
  'qr.scan': { zh: '用已登录 NEOWATCH 的手机扫描这个二维码。', en: 'Scan this QR with your phone already signed in to NEOWATCH.' },
  'qr.orCode': { zh: '或访问 neowatch.soclose.co/link 并输入代码：', en: 'Or go to neowatch.soclose.co/link and enter the code:' },
  'qr.waiting': { zh: '等待手机确认…', en: 'Waiting for confirmation on your phone…' },
  'qr.expired': { zh: '代码已过期。', en: 'Code expired.' },
  'qr.retry': { zh: '新代码', en: 'New code' },
  'qr.back': { zh: '返回', en: 'Back' },
  // Phone-side approval page (/link)
  'link.title': { zh: '连接电视', en: 'Connect a TV' },
  'link.prompt': { zh: '把这台电视连接到你的 NEOWATCH 账户？', en: 'Connect this TV to your NEOWATCH account?' },
  'link.confirm': { zh: '是，连接电视', en: 'Yes, connect the TV' },
  'link.needLogin': { zh: '请先登录，然后再来扫码。', en: 'Sign in first, then scan again.' },
  'link.signin': { zh: '登录', en: 'Sign in' },
  'link.done': { zh: '电视已连接！请回到电视上。', en: 'TV connected! Head back to your TV.' },
  'link.invalid': { zh: '代码无效或已过期。', en: 'Code invalid or expired.' },
  'link.noCode': { zh: '未提供代码。', en: 'No code provided.' },
  // Player controls & status
  'player.errorHint': { zh: '直播流可能被地区屏蔽、离线或暂时不可用。请重试、强制走代理，或换个频道。', en: 'The stream may be geo-blocked, offline or temporarily unavailable. Try again, force the proxy, or pick another channel.' },
  'player.play': { zh: '播放（空格）', en: 'Play (Space)' },
  'player.pause': { zh: '暂停（空格）', en: 'Pause (Space)' },
  'player.mute': { zh: '静音（M）', en: 'Mute (M)' },
  'player.quality': { zh: '画质', en: 'Quality' },
  'player.pip': { zh: '画中画', en: 'Picture-in-picture' },
  'player.fullscreen': { zh: '全屏（F）', en: 'Fullscreen (F)' },
  'player.live': { zh: '直播中', en: 'LIVE' },
  'player.loading': { zh: '加载中', en: 'LOADING' },
  'player.error': { zh: '错误', en: 'ERROR' },
  'player.onNow': { zh: '正在播出', en: 'ON NOW' },
  'player.nextUp': { zh: '接下来', en: 'Next' },
  'player.proxyTitle': { zh: '强制代理（受限网络）', en: 'Force the proxy (blocked networks)' },
  'player.volume': { zh: '音量', en: 'Volume' },
  // Shared card / control actions
  'common.favorite': { zh: '收藏', en: 'Favorite' },
  'common.addMulti': { zh: '加入多画面', en: 'Add to multi-view' },
  'common.info': { zh: '信息与节目单', en: 'Info & guide' },
  'common.prev': { zh: '上一个', en: 'Previous' },
  'common.next': { zh: '下一个', en: 'Next' },
  // Grid empty states
  'grid.noFav': { zh: '暂无收藏', en: 'No favorites yet' },
  'grid.noFavHint': { zh: '点频道卡片上的心形图标收藏，就能在这里找到。', en: 'Add channels with the heart to find them here.' },
  'grid.noMatch': { zh: '没有匹配的频道', en: 'No channels match' },
  'grid.noMatchHint': { zh: '试试扩大搜索范围或调整筛选条件。', en: 'Broaden the search or change the filters.' },
  // Auth gate + login form
  'gate.body': { zh: '登录后可观看所有直播频道。', en: 'Sign in to access all live channels.' },
  'login.title': { zh: '登录 NEOWATCH', en: 'NEOWATCH sign-in' },
  'login.name': { zh: '昵称（可选）', en: 'Name (optional)' },
  'login.email': { zh: '邮箱', en: 'Email' },
  'login.password': { zh: '密码', en: 'Password' },
  'login.showPw': { zh: '显示', en: 'Show' },
  'login.hidePw': { zh: '隐藏', en: 'Hide' },
  'login.signIn': { zh: '登录', en: 'Sign in' },
  'login.create': { zh: '创建我的账户', en: 'Create my account' },
  'login.noAccount': { zh: '还没有账户？', en: 'No account yet?' },
  'login.register': { zh: '注册', en: 'Sign up' },
  'login.tagline': { zh: '免费 · 体育与电影尽在高级会员', en: 'Free · sport & movies with Premium' },
  'login.welcomeBack': { zh: '欢迎回来', en: 'Good to see you again' },
  'login.welcomeNew': { zh: '数千个直播频道等着你', en: 'Thousands of live channels are waiting for you' },
  'login.tabLogin': { zh: '登录', en: 'Sign in' },
  'login.tabRegister': { zh: '注册', en: 'Create account' },
  // Account panel
  'account.email': { zh: '邮箱', en: 'Email' },
  'account.role': { zh: '角色', en: 'Role' },
  'account.plan': { zh: '订阅', en: 'Plan' },
  'account.free': { zh: '免费版', en: 'Free' },
  'account.expires': { zh: '到期于', en: 'Expires on' },
  'account.cancel': { zh: '取消高级会员', en: 'Cancel Premium' },
  'account.upgrade': { zh: '升级高级会员', en: 'Go Premium' },
  'account.password': { zh: '密码', en: 'Password' },
  'account.currentPw': { zh: '当前密码', en: 'Current password' },
  'account.newPw': { zh: '新密码（至少 6 位）', en: 'New (min 6)' },
  'account.update': { zh: '更新', en: 'Update' },
  'account.logout': { zh: '退出登录', en: 'Sign out' },
  'account.prefs': { zh: '观看偏好', en: 'Viewing preferences' },
  'account.delete': { zh: '删除我的账户', en: 'Delete my account' },
  'account.deleteWarn': { zh: '永久删除：账户、收藏和配置将立即清空。', en: 'Permanent deletion: account, favorites and configuration are erased immediately.' },
  'account.deleteConfirm': { zh: '确认永久删除', en: 'Delete permanently' },
  // Programme search strip
  'progsearch.onAir': { zh: '正在播出 · 节目', en: 'On air · shows' },
  // Internet radio
  'radio.title': { zh: '电台', en: 'Radio' },
  'radio.subtitle': { zh: '全球电台直播 -- 来自社区目录 radio-browser。', en: 'Live radio from around the world -- community radio-browser directory.' },
  'radio.search': { zh: '搜索电台、国家、类型…', en: 'Search a station, a country, a genre…' },
  'radio.empty': { zh: '未找到电台。', en: 'No stations found.' },
  'radio.playing': { zh: '正在收听', en: 'Now playing' },
  'radio.connecting': { zh: '连接中…', en: 'Connecting…' },
  'radio.error': { zh: '直播流不可用 -- 试试其他电台。', en: 'Stream unavailable -- try another station.' },
  'radio.stop': { zh: '停止', en: 'Stop' },
  // Multi-view
  'multi.focus': { zh: '聚焦', en: 'Focus' },
  'multi.mosaic': { zh: '宫格', en: 'Mosaic' },
  'multi.title': { zh: '多画面', en: 'Multi-view' },
  'multi.hint': { zh: '点按一个画面收听它的声音。适合同时看多场比赛。', en: 'Tap a tile to hear its audio. Great for following several matches.' },
  'multi.clear': { zh: '清空', en: 'Clear' },
  'multi.audio': { zh: '使用此声音', en: 'Use this audio' },
  'multi.remove': { zh: '移除', en: 'Remove' },
  'multi.layout': { zh: '布局', en: 'Layout' },
  'multi.emptyBody': { zh: '还没有频道。打开一个频道后加入多画面，即可同时观看多个直播（最多 9 个）。', en: 'No channels yet. Open a channel, then add it to multi-view to watch several streams at once (up to 9).' },
  'multi.browse': { zh: '浏览频道', en: 'Browse channels' },
  'common.close': { zh: '关闭', en: 'Close' },
  // Programme TV (EPG grid page)
  'programme.title': { zh: '电视节目单', en: 'TV guide' },
  'programme.subtitle': { zh: '直播节目时间表', en: 'Live schedule grid' },
  'programme.empty': { zh: '该筛选条件下暂无节目。', en: 'No guide available for this filter.' },
  'programme.allCountries': { zh: '所有国家', en: 'All countries' },
  'programme.allCategories': { zh: '全部分类', en: 'All categories' },
  'programme.now': { zh: '现在', en: 'Now' },
  'home.surprise': { zh: '随便看看', en: 'Surprise me' },
  // Films (public-domain VOD)
  'films.title': { zh: '电影', en: 'Movies' },
  'films.subtitle': { zh: '公有领域经典与邪典电影，免费观看', en: 'Public-domain classics & cult films, free to watch' },
  'films.search': { zh: '搜索电影…', en: 'Search a movie…' },
  'films.empty': { zh: '没有匹配的电影。', en: 'No movie for this search.' },
  'films.unavailable': { zh: '电影目录暂时不可用。', en: 'Movie catalog unavailable right now.' },
  'films.note': { zh: '公有领域 · 来自 Internet Archive', en: 'Public domain via Internet Archive' },
  // Footer
  'footer.tagline': { zh: '直播无界限。全球数千个频道，聚合自公开免费的直播流。', en: 'Live TV, unlimited. Thousands of channels worldwide, aggregated from freely available streams.' },
  'footer.explore': { zh: '浏览', en: 'EXPLORE' },
  'footer.account': { zh: '账户', en: 'ACCOUNT' },
  'footer.legal': { zh: '法律', en: 'LEGAL' },
  'footer.liveNow': { zh: '直播', en: 'Live now' },
  'footer.programmeTv': { zh: '电视节目单', en: 'TV guide' },
  'footer.favorites': { zh: '收藏', en: 'Favorites' },
  'footer.importPlaylist': { zh: '导入播放列表', en: 'Import a playlist' },
  'footer.installApp': { zh: '安装应用', en: 'Install the app' },
  'footer.terms': { zh: '使用条款', en: 'Terms' },
  'footer.privacy': { zh: '隐私政策', en: 'Privacy' },
  'footer.source': { zh: 'iptv-org 数据源', en: 'iptv-org source' },
  // Pricing
  'pricing.description': { zh: '所有频道永久免费。高级会员提升体验：无广告、扩展多画面、同步、你的 IPTV 播放列表和个性化节目单。', en: 'Every channel is free. Premium upgrades the experience: no ads, extended multi-view, sync, your IPTV playlists and a personalized EPG.' },
  // Install modal
  'install.title': { zh: '安装到电视、手机和电脑', en: 'Install on TV, phone & computer' },
  'install.phone': { zh: '手机 / 平板', en: 'Phone / tablet' },
  'install.phoneBody': { zh: '扫描二维码（或打开链接），然后在浏览器菜单里选「添加到主屏幕」-> 即刻全屏启动。', en: 'Scan the QR (or open the link), then "Add to Home Screen" in the browser menu -> instant, full-screen launch.' },
  'install.tv': { zh: 'Android TV / 智能电视', en: 'Android TV / Smart TV' },
  'install.tvBody': { zh: '在电视浏览器打开链接。内置遥控器（方向键）导航。可把页面固定到桌面方便直达。', en: 'Open the TV browser and go to the link. Remote (D-pad) navigation is built in. Pin the page for direct access.' },
  'install.pc': { zh: '电脑', en: 'Computer' },
  'install.pcBody': { zh: '点击浏览器地址栏的「安装」图标（Chrome/Edge）即可安装独立应用。', en: 'Click the Install icon in the browser bar (Chrome/Edge) for the dedicated app.' },
  // Preferences (premium)
  'prefs.title': { zh: '我的观看偏好', en: 'My viewing preferences' },
  'prefs.upsellBody': { zh: '按需定制目录：隐藏不看的大类、置顶喜欢的、设置默认主页。', en: 'Tailor and optimize the catalog to your needs: hide categories you never watch, pin your favorites, set your home page.' },
  'prefs.unlock': { zh: '用高级会员解锁', en: 'Unlock with Premium' },
  'prefs.homeDefault': { zh: '默认主页', en: 'Default home page' },
  'prefs.catAll': { zh: '分类：全部', en: 'Category: all' },
  'prefs.countryAll': { zh: '国家：全部', en: 'Country: all' },
  'prefs.langAll': { zh: '语言：全部', en: 'Language: all' },
  'prefs.curate': { zh: '分类：置顶 / 隐藏', en: 'Categories: pin / hide' },
  'prefs.pin': { zh: '置顶', en: 'Pin' },
  'prefs.show': { zh: '显示', en: 'Show' },
  'prefs.hide': { zh: '隐藏', en: 'Hide' },
  // Channel detail page
  'detail.back': { zh: '返回', en: 'Back' },
  'detail.notFound': { zh: '找不到这个频道。', en: 'Channel not found.' },
  'detail.share': { zh: '分享', en: 'Share' },
  'detail.programme': { zh: '节目单', en: 'Schedule' },
  'detail.onNow': { zh: '正在播出', en: 'ON NOW' },
  'detail.noProgramme': { zh: '该频道暂无节目单。', en: 'No schedule available for this channel.' },
  'detail.similar': { zh: '相似频道', en: 'Similar channels' },
  'detail.info': { zh: '信息与节目单', en: 'Info & schedule' },
  // Common
  'common.premium': { zh: '高级会员', en: 'Premium' },
  // Shared misc
  'top.home': { zh: '首页 -- 所有频道', en: 'Home -- all channels' },
  'top.installTvTitle': { zh: '安装到电视 / 手机', en: 'Install on TV / mobile' },
  'filter.cat': { zh: '分类', en: 'Category' },
  'filter.country': { zh: '国家', en: 'Country' },
  'filter.lang': { zh: '语言', en: 'Language' },
  'filter.sort': { zh: '排序', en: 'Sort' },
  'filter.recheck': { zh: '重新检测频道在线状态', en: 'Re-check channel status' },
  'pricing.unavailable': { zh: '支付不可用', en: 'Payment unavailable' },
  'pricing.upgradeTitle': { zh: '升级 NEOWATCH 高级会员', en: 'Go NEOWATCH Premium' },
  'pricing.free': { zh: '免费', en: 'Free' },
  'pricing.currentPlan': { zh: '当前默认套餐', en: 'Default current plan' },
  'account.fail': { zh: '操作失败', en: 'Action failed' },
  'account.cancelFail': { zh: '取消高级会员失败', en: 'Failed to cancel Premium' },
  'account.pwUpdated': { zh: '密码已更新。', en: 'Password updated.' },
  'account.cancelOk': { zh: '高级会员已取消。', en: 'Premium cancelled.' },
  'filter.results': { zh: '搜索结果', en: 'Results for' },
  'pricing.qqCode': { zh: '订阅码', en: 'Subscription code' },
  'pricing.qqPlaceholder': { zh: '请输入 QQ 订阅码', en: 'Enter your subscription code' },
  'pricing.qqButton': { zh: '订阅', en: 'Subscribe' },
};

interface I18nState {
  lang: Lang;
  setLang: (l: Lang) => void;
}
export const useI18n = create<I18nState>()(
  persist((set) => ({ lang: 'zh', setLang: (lang) => set({ lang }) }), { name: 'neowatch.lang' })
);
// Drop persisted pre-fork langs (fr/ru) so the selector always matches.
if (!['zh', 'en'].includes(useI18n.getState().lang)) useI18n.setState({ lang: 'zh' });

// Reactive translator hook. Usage: const t = useT(); t('home.watch')
export function useT() {
  const lang = useI18n((s) => s.lang);
  return (key: string) => DICT[key]?.[lang] ?? DICT[key]?.en ?? key;
}

// Number/date locale for the current UI language.
export function numLocale() {
  return useI18n.getState().lang === 'zh' ? 'zh-CN' : 'en';
}

// Set <html lang> for accessibility/SEO.
export function applyLang() {
  if (typeof document !== 'undefined') document.documentElement.lang = useI18n.getState().lang;
}
useI18n.subscribe(applyLang);
