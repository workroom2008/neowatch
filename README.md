<div align="center">

# 📺 NEOWATCH

### 可自托管的全球免费直播电视、电台与公版电影聚合器。

全球数千个免费直播频道、网络电台和公版电影 —— 集成一个快速、可安装的应用,带 HLS 播放器、多画面宫格、电视节目单和完整的 SaaS 层。**所有频道全部免费。**

[![Live demo](https://img.shields.io/badge/demo-neowatch.soclose.co-22d3ee?style=flat-square)](https://neowatch.soclose.co)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-installable-7c5cfc?style=flat-square)](https://neowatch.soclose.co)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20+-3c873a?style=flat-square&logo=node.js&logoColor=white)

**[▶ 在线演示](https://neowatch.soclose.co)** · [功能](#-功能) · [快速开始](#-快速开始) · [架构](#-架构) · [法律与内容模式](#-法律与内容模式) · [参与贡献](CONTRIBUTING.md)

<br>

<a href="https://neowatch.soclose.co"><img src="docs/screenshots/home.jpg" alt="NEOWATCH -- 直播首页" width="820"></a>

### 👉 在线体验:**[neowatch.soclose.co](https://neowatch.soclose.co)**

</div>

---

## NEOWATCH 是什么?

NEOWATCH 是一个**聚合器与播放器**,只收录公开发布的媒体。它不托管任何内容:只索引并播放播出方已公开的直播流 —— 来自 [iptv-org](https://github.com/iptv-org/iptv) 目录的直播电视、来自 [radio-browser](https://www.radio-browser.info) 的网络电台,以及来自 [Internet Archive](https://archive.org) 的公版电影。前端为快速 React PWA,后端为轻量 Node/Express API,可在小型 VPS 上以单进程部署。

它以"**任何设备都能用**"为目标 —— 手机、电脑,尤其是电视(遥控器/方向键导航、可安装 APK)—— 并保持**快速与合规**:优先直连播放让主机带宽占用更低,变现只卖*功能*,绝不出售第三方内容的访问权。

## ✨ 功能

**内容**
- 🌍 **约 12000 个全球直播频道**(覆盖 iptv-org 全部分类),标准化包含 Logo、国家、语言、画质 —— **全部免费观看**。
- 📻 **网络电台** —— 来自 radio-browser 目录的 800+ 电台,带常驻音频播放器。
- 🎬 **公版电影** —— 来自 Internet Archive 的可浏览 VOD 目录(经典、邪典、纪录片),原生播放。
- 📅 **电视节目单(EPG)** —— 导入 XMLTV 数据源,查看每个频道的正在播出/接下来 + "按节目搜索"。

**播放器**
- ⚡ **调优的 hls.js** —— 快速起播、自适应码率、低延迟;支持 YouTube 嵌入。
- 🔁 **高韧性播放** —— 自动降级链:直连 → 代理 → 备用信号源,带卡顿看门狗。主源失效时自动切换到可用备源。
- 🎚️ **画质、音轨与字幕**选择;画中画;全屏。
- 🟢 **真实"直播中"标记** —— 后台健康巡检会做*真实分片下载*,"在线"意味着真的能播,而不是仅仅清单响应。

**体验**
- 🪟 **多画面宫格** —— 同时观看 1-9 个频道(适合同时关注多场比赛),音频跟随其中一个,配置跨设备漫游。
- 🔎 **相关度排序搜索** —— 多关键词、不区分重音、最佳名称匹配优先,带最近搜索建议。
- 📱 **可安装 PWA** + **Android TV APK** —— 响应式、离线壳、完整键盘/方向键导航。
- 📲 **扫码登录** —— 在电视上扫码,用手机登录(免去遥控器输入)。
- 🌐 **i18n** —— 完整中文 / 英文。
- 🎨 主题、主题色、网格密度、收藏与历史。

**SaaS 层**
- 🔐 JWT 认证、`admin`/`user` 角色、管理后台(用户、目录刷新、健康、下架黑名单)。
- 💳 **严谨的免费增值模式** —— 每个频道都免费;Premium 只卖*功能*(去广告、扩展多画面、跨设备同步、自己的 M3U 播放列表、个性化 EPG)。内置订阅码/QQ 号验证,**Stripe 就绪**(结算 + 签名 webhook)。
- 🛡️ 安全优先 —— 所有用户输入 URL 路径均有 SSRF 防护、限流、原子写入、签名代理 URL、GDPR 账户删除、法律页面。

## 🖼️ 截图

<i>点击任意截图打开在线应用 → **[neowatch.soclose.co](https://neowatch.soclose.co)**</i>

<table>
  <tr>
    <td width="50%"><a href="https://neowatch.soclose.co/films"><img src="docs/screenshots/films.jpg" alt="公版电影 (Internet Archive)"></a><br><sub><b>🎬 电影</b> -- 公版 VOD</sub></td>
    <td width="50%"><a href="https://www.radio-browser.info"><img src="docs/screenshots/radios.jpg" alt="网络电台(radio-browser)"></a><br><sub><b>📻 电台</b> -- 800+ 直播电台</sub></td>
  </tr>
  <tr>
    <td width="50%"><a href="https://neowatch.soclose.co/programme-tv"><img src="docs/screenshots/programme.jpg" alt="电视节目单(EPG 宫格)"></a><br><sub><b>📅 电视节目单</b> -- 正在播出 EPG</sub></td>
    <td width="50%"><a href="https://neowatch.soclose.co"><img src="docs/screenshots/channel.jpg" alt="带节目单的频道页"></a><br><sub><b>📺 频道页</b> -- 详情 + 节目单</sub></td>
  </tr>
</table>

品牌与社媒素材见 [`web/public/social/`](web/public/social)。

## 🏗️ 架构

Monorepo(npm workspaces):

```
server/   Node 20 (ESM) · Express 4 -- API、HLS 代理、目录缓存、认证、EPG、订阅
web/      React 18 · Vite 6 · Tailwind 3 · Zustand 5 · hls.js -- SPA / PWA
```

- **开发:** Vite 在 `:5273`,API 在 `:8787`(Vite 代理 `/api`)。
- **生产:** `npm run build` → `web/dist`;Express 在同一端口同时提供静态包**和** `/api`。
- **数据:** iptv-org API 拉取后按 TTL 缓存到磁盘,在内存中归一化一次,再按请求查询/分页。无数据库 —— 用户数据用 JSON 文件持久化。
- **播放:** 应用**优先直连**播放,仅对 CORS/地区限制/混合内容的直播流回退到内置 HLS 代理 —— 降低共享部署的主机带宽消耗。

详细模块地图:[`CLAUDE.md`](CLAUDE.md)。

## 🚀 快速开始

```bash
npm install       # 同时安装两个 workspace
npm run dev       # web → http://localhost:5273 · api → http://localhost:8787
```

首次启动时,服务器会缓存 iptv-org 目录(几秒)并创建**管理员**账号 —— 邮箱和随机密码只在日志中打印**一次**(可通过 `.env` 固定)。

### 生产模式(单进程)

```bash
npm run build     # 类型检查 + 把 SPA 构建到 web/dist
npm start         # Express 同时提供 web/dist + /api,端口 $PORT(8787)
```

### Docker

```bash
docker compose up --build -d
```

## ⚙️ 配置

复制 `.env.example` → `.env`。关键变量(完整列表见示例文件):

| 变量 | 默认值 | 用途 |
|---|---|---|
| `PORT` | `8787` | 服务端口 |
| `CATALOG_TTL_HOURS` | `12` | 目录缓存有效期 |
| `HIDE_NSFW` | `true` | 隐藏成人频道 |
| `REQUIRE_AUTH` | `false` | `true` = 观看需要账号(SaaS 模式) |
| `JWT_SECRET` | *(开发时自动生成)* | **生产环境务必设置长随机值** |
| `HEALTH_SWEEP` | `false` | 后台可用性巡检 |
| `BILLING_PROVIDER` | `mock` | `mock`(即时开通)或 `stripe` |
| `SUBSCRIBE_CODE` | `29595662` | Premium 订阅码(QQ 号),输入正确才能订阅 |
| `STRIPE_SECRET` / `STRIPE_PRICE_ID` / `STRIPE_WEBHOOK_SECRET` | — | 真实支付(留空则用 mock) |
| `ALLOWED_ORIGINS` | — | CORS 白名单(部署实例用) |

> **不提交任何机密。** `.env`、用户数据、缓存和签名材料已全部 git-ignore。`.env.example` 只含空占位符。

### 💳 Premium 订阅

Premium 弹窗中输入订阅码(即站长 QQ 号 **29595662**)即可当场开通。可用环境变量 `SUBSCRIBE_CODE` 修改订阅码。Stripe 渠道不受订阅码限制。

## 🧭 验证可用

```bash
curl localhost:8787/api/health                       # { ok: true }
curl "localhost:8787/api/catalog/meta"               # total 非零
curl "localhost:8787/api/catalog/channels?category=sports&limit=3"
npm run typecheck && npm run build                   # 必须通过
```

另有集成测试(`tasks/integration-test.mjs`)和端到端冒烟测试(`tasks/e2e-smoke.mjs`)。

## ⚖️ 法律与内容模式

NEOWATCH 的设计目标是合法运行:

- **不托管任何内容。** 只索引已公开发布的直播流并从源地址播放。电台(radio-browser)和电影(Internet Archive 公版)是经过筛选、可自由分发的目录。
- **变现卖的是功能,而非内容。** 每个频道都可免费观看。Premium 解锁的是*软件功能*(去广告、扩展多画面、同步、自己的播放列表、EPG)—— 绝不出售第三方内容的访问权。
- **即时下架。** 站长可通过管理后台的**黑名单**(`/api/admin/blocklist`)立即隐藏任何直播流 —— 这是响应权利人请求的标准机制。
- **不要**为付费或盗版内容添加爬虫,也不要在第三方直播流旁投放广告。

各第三方直播流的可用性、质量和许可由其播出方负责。权利人可通过应用法律页面的联系方式请求移除。

## 🤝 参与贡献

欢迎贡献 —— 见 [CONTRIBUTING.md](CONTRIBUTING.md)。发现安全问题见 [SECURITY.md](SECURITY.md)。

## 📄 许可证

[MIT](LICENSE) © SoClose Society. 由 SoClose 开发社区构建。

<div align="center"><sub>NEOWATCH 聚合公开发布的免费直播流。与任何播出方均无关联。</sub></div>
