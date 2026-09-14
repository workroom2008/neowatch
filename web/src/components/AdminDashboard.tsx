import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowLeft, RefreshCw, UserPlus, Trash2, ShieldCheck, Ban, Loader2, ListVideo, Plus, AlertCircle, Crown, CalendarClock, Wifi } from 'lucide-react';
import { api } from '@/lib/api';
import { useI18n, numLocale } from '@/lib/i18n';
import { useAuth } from '@/store/authStore';
import { useCatalog } from '@/store/catalogStore';
import type { User } from '@/types';

interface Source {
  id: string;
  name: string;
  url: string | null;
  count: number;
  lastError: string | null;
  lastFetched: number | null;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const zh = useI18n((s) => s.lang) === 'zh';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [err, setErr] = useState<string | null>(null);
  // Run a mutation, surface its error, and refresh.
  const act = async (fn: () => Promise<unknown>) => {
    setErr(null);
    try {
      await fn();
    } catch (e: any) {
      setErr(e?.message || (zh ? '操作失败' : 'Action failed'));
    }
    load();
  };

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get<{ users: User[] }>('/admin/users');
      setUsers(r.users);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await act(async () => {
      await api.post('/admin/users', form);
      setForm({ email: '', password: '', role: 'user' });
    });
  };

  const patch = (id: string, body: Partial<User>) => act(() => api.patch(`/admin/users/${id}`, body));
  const remove = (id: string) => act(() => api.del(`/admin/users/${id}`));
  const setUserPlan = (id: string, plan: 'free' | 'premium') => act(() => api.post(`/admin/users/${id}/plan`, { plan }));

  const refreshCatalog = async () => {
    setRefreshing(true);
    await api.post('/catalog/refresh').catch(() => {});
    setRefreshing(false);
  };

  const [sweep, setSweep] = useState<string | null>(null);
  const runSweep = async () => {
    setSweep(zh ? '正在启动全部频道检测…' : 'Starting the test of every channel…');
    try {
      const r = await api.post<{ started: boolean; checked: number; online: number; offline: number }>('/admin/health/sweep');
      setSweep(r.started
        ? zh
          ? `检测已在后台启动(已测 ${r.checked} 个 · ${r.online} 个在线)。`
          : `Sweep started in background (already ${r.checked} checked · ${r.online} online).`
        : zh ? '检测已在进行中。' : 'Sweep already running.');
    } catch {
      setSweep(zh ? '检测功能不可用。' : 'Sweep unavailable.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="rounded-lg border border-white/10 p-2 text-ink/60 hover:text-ink">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-semibold text-ink">{zh ? '管理后台' : 'Administration'}</h1>
        <button
          onClick={refreshCatalog}
          disabled={refreshing}
          className="ml-auto flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent hover:bg-accent/20"
        >
          {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {zh ? '刷新目录' : 'Refresh catalog'}
        </button>
        <button
          onClick={runSweep}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-ink/70 hover:border-accent/30 hover:text-accent"
          title={zh ? '在后台测试所有频道的可用性' : 'Test the availability of all channels in the background'}
        >
          <Wifi size={14} /> {zh ? '测试频道' : 'Test channels'}
        </button>
      </div>
      {sweep && <p className="mb-4 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-ink/70">{sweep}</p>}

      {err && (
        <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          <AlertCircle size={13} /> {err}
        </p>
      )}

      {/* Create user */}
      <form onSubmit={createUser} className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-white/[0.06] bg-panel/60 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink/80">
          <UserPlus size={16} className="text-accent" /> {zh ? '新建用户' : 'New user'}
        </div>
        <input required type="email" placeholder={zh ? '邮箱' : 'Email'} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input flex-1" />
        <input required type="password" minLength={6} placeholder={zh ? '密码(至少 6 位)' : 'Password (min 6)'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input flex-1" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
          {zh ? '创建' : 'Create'}
        </button>
      </form>

      {/* User list */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] font-mono text-[10px] uppercase tracking-wider text-ink/40">
            <tr>
              <th className="px-4 py-2">{zh ? '邮箱' : 'Email'}</th>
              <th className="px-4 py-2">{zh ? '角色' : 'Role'}</th>
              <th className="px-4 py-2">{zh ? '状态' : 'Status'}</th>
              <th className="px-4 py-2 text-right">{zh ? '操作' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink/40">
                  <Loader2 className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-white/[0.04]">
                  <td className="px-4 py-2.5 text-ink/80">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <span className={clsx('rounded px-1.5 py-0.5 font-mono text-[10px]', u.role === 'admin' ? 'bg-accent/15 text-accent' : 'bg-white/5 text-ink/50')}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={clsx('font-mono text-[10px]', u.status === 'active' ? 'text-emerald-400' : 'text-rose-400')}>{u.status}</span>
                    <span className={clsx('ml-2 rounded px-1.5 py-0.5 font-mono text-[9px]', u.plan === 'premium' || u.premium ? 'bg-amber-500/15 text-amber-300' : 'bg-white/5 text-ink/40')}>
                      {u.plan === 'premium' || u.premium ? 'premium' : 'free'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setUserPlan(u.id, u.plan === 'premium' ? 'free' : 'premium')} title={zh ? '切换 Premium' : 'Toggle Premium'} className={clsx('rounded p-1.5 hover:text-amber-300', u.plan === 'premium' ? 'text-amber-400' : 'text-ink/50')}>
                        <Crown size={14} />
                      </button>
                      <button onClick={() => patch(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })} title={zh ? '切换管理员' : 'Toggle admin'} className="rounded p-1.5 text-ink/50 hover:text-accent">
                        <ShieldCheck size={14} />
                      </button>
                      <button onClick={() => patch(u.id, { status: u.status === 'active' ? 'disabled' : 'active' })} title={zh ? '启用/禁用' : 'Enable/Disable'} className="rounded p-1.5 text-ink/50 hover:text-amber-400">
                        <Ban size={14} />
                      </button>
                      <button onClick={() => remove(u.id)} disabled={u.id === user?.id} title={zh ? '删除' : 'Delete'} className="rounded p-1.5 text-ink/50 hover:text-rose-400 disabled:opacity-30">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AuditPanel />
      <SourcesManager />
      <EpgManager />
    </div>
  );
}

interface ConfigAudit { billingProvider: string; stripeConfigured: boolean; adsenseConfigured: boolean; jwtSecretExplicit: boolean; warnings: { level: string; key: string; msg: string }[]; }
interface ChannelAudit { total: number; online: number; offline: number; unchecked: number; byCategory: Record<string, { total: number; online: number; offline: number; unchecked: number }>; }

function AuditPanel() {
  const zh = useI18n((s) => s.lang) === 'zh';
  const on = zh ? '在线' : 'online';
  const off = zh ? '离线' : 'offline';
  const unch = zh ? '未测试' : 'unchecked';
  const [cfg, setCfg] = useState<ConfigAudit | null>(null);
  const [ch, setCh] = useState<ChannelAudit | null>(null);
  const load = async () => {
    setCfg(await api.get<ConfigAudit>('/admin/config').catch(() => null));
    setCh(await api.get<ChannelAudit>('/admin/channels/audit').catch(() => null));
  };
  useEffect(() => { load(); }, []);

  const lvlColor: Record<string, string> = { error: 'text-rose-400', warn: 'text-amber-400', info: 'text-ink/50' };
  const pct = ch && ch.total ? Math.round((ch.online / ch.total) * 100) : 0;

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck size={18} className="text-accent" />
        <h2 className="text-base font-semibold text-ink">{zh ? '系统审计' : 'System audit'}</h2>
        <button onClick={load} className="ml-auto rounded-lg border border-white/10 p-1.5 text-ink/50 hover:text-accent" title={zh ? '刷新' : 'Refresh'}><RefreshCw size={13} /></button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Config audit */}
        <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-4">
          <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/40">{zh ? '配置' : 'Configuration'}</h3>
          {cfg ? (
            <>
              <div className="mb-2 flex flex-wrap gap-2 text-[11px]">
                <Chip ok={cfg.jwtSecretExplicit}>JWT secret</Chip>
                <Chip ok={cfg.billingProvider === 'stripe' ? cfg.stripeConfigured : true}>{zh ? '计费' : 'Billing'}: {cfg.billingProvider}</Chip>
                <Chip ok={cfg.adsenseConfigured}>AdSense</Chip>
              </div>
              {cfg.warnings.length === 0 ? (
                <p className="text-xs text-emerald-400">{zh ? '未检测到问题。' : 'No problems detected.'}</p>
              ) : (
                <ul className="space-y-1">
                  {cfg.warnings.map((w, i) => (
                    <li key={i} className={clsx('text-[11px]', lvlColor[w.level])}>• <b>{w.key}</b>: {w.msg}</li>
                  ))}
                </ul>
              )}
            </>
          ) : <p className="text-xs text-ink/40">…</p>}
        </div>

        {/* Channel health audit */}
        <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-4">
          <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/40">{zh ? '频道健康' : 'Channel health'}</h3>
          {ch ? (
            <>
              <div className="mb-2 flex h-2 overflow-hidden rounded-full bg-white/5">
                <span className="bg-emerald-500" style={{ width: `${(ch.online / ch.total) * 100}%` }} />
                <span className="bg-rose-500/70" style={{ width: `${(ch.offline / ch.total) * 100}%` }} />
              </div>
              <p className="text-xs text-ink/70">
                <span className="text-emerald-400">{ch.online.toLocaleString(numLocale())} {on}</span> ·{' '}
                <span className="text-rose-400">{ch.offline.toLocaleString(numLocale())} {off}</span> ·{' '}
                <span className="text-ink/40">{ch.unchecked.toLocaleString(numLocale())} {unch}</span>
              </p>
              <p className="mt-1 text-[11px] text-ink/40">{zh ? `${pct}% 可播放 · 点“测试频道”可审计其余频道。` : `${pct}% playable overall · run "Test channels" to audit the rest.`}</p>

              {/* Per-category playability bars */}
              <div className="mt-4 space-y-1.5">
                <h4 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/40">{zh ? '按分类(前 12)' : 'By category (top 12)'}</h4>
                {Object.entries(ch.byCategory)
                  .map(([k, v]) => ({ k, ...v }))
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 12)
                  .map((c) => (
                    <div key={c.k} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 truncate text-[10px] text-ink/55" title={c.k}>{c.k === 'undefined' ? (zh ? '其他' : 'Others') : c.k}</span>
                      <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-white/5" title={`${c.online} ${on} · ${c.offline} ${off} · ${c.unchecked} ${unch}`}>
                        <span className="bg-emerald-500" style={{ width: `${c.total ? (c.online / c.total) * 100 : 0}%` }} />
                        <span className="bg-rose-500/60" style={{ width: `${c.total ? (c.offline / c.total) * 100 : 0}%` }} />
                      </div>
                      <span className="w-12 shrink-0 text-right font-mono text-[9px] text-ink/40">{c.total.toLocaleString(numLocale())}</span>
                    </div>
                  ))}
              </div>
            </>
          ) : <p className="text-xs text-ink/40">…</p>}
        </div>
      </div>
    </div>
  );
}

function Chip({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span className={clsx('rounded px-1.5 py-0.5 font-mono', ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-ink/40')}>
      {ok ? '✓' : '·'} {children}
    </span>
  );
}

function SourcesManager() {
  const loadMeta = useCatalog((s) => s.loadMeta);
  const loadChannels = useCatalog((s) => s.loadChannels);
  const zh = useI18n((s) => s.lang) === 'zh';
  const [sources, setSources] = useState<Source[]>([]);
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [form, setForm] = useState({ name: '', url: '', text: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const r = await api.get<{ sources: Source[] }>('/sources');
      setSources(r.sources);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refreshCatalog = async () => {
    await loadMeta();
    await loadChannels();
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = mode === 'url' ? { name: form.name, url: form.url } : { name: form.name, text: form.text };
      const r = await api.post<{ sources: Source[] }>('/admin/sources', body);
      setSources(r.sources);
      setForm({ name: '', url: '', text: '' });
      refreshCatalog();
    } catch (err: any) {
      setError(err?.message || (zh ? '导入失败' : 'Import failed'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const r = await api.del<{ sources: Source[] }>(`/admin/sources/${id}`).catch(() => null);
    if (r) setSources(r.sources);
    refreshCatalog();
  };

  const refresh = async () => {
    setBusy(true);
    const r = await api.post<{ sources: Source[] }>('/admin/sources/refresh').catch(() => null);
    if (r) setSources(r.sources);
    await refreshCatalog();
    setBusy(false);
  };

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <ListVideo size={18} className="text-accent" />
        <h2 className="text-base font-semibold text-ink">{zh ? 'M3U / IPTV 源' : 'M3U / IPTV sources'}</h2>
        <span className="text-[11px] text-ink/40">{zh ? '导入你自己的播放列表(服务商、订阅、个人文件)。' : 'Import your own playlist (provider, subscription, personal file).'}</span>
        {sources.length > 0 && (
          <button onClick={refresh} disabled={busy} className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-ink/60 hover:text-accent">
            <RefreshCw size={13} className={clsx(busy && 'animate-spin')} /> {zh ? '刷新' : 'Refresh'}
          </button>
        )}
      </div>

      <form onSubmit={add} className="mb-4 rounded-xl border border-white/[0.06] bg-panel/60 p-4">
        <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border border-white/10 p-1 sm:max-w-xs">
          {(['url', 'text'] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={clsx('rounded-md py-1.5 text-xs', mode === m ? 'bg-accent/15 text-accent' : 'text-ink/50')}>
              {m === 'url' ? (zh ? '从 URL 导入' : 'From a URL') : (zh ? '粘贴 M3U' : 'Paste M3U')}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input required placeholder={zh ? '名称(如:我的服务商)' : 'Name (e.g. My provider)'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input sm:w-56" />
          {mode === 'url' ? (
            <input required type="url" placeholder="https://.../playlist.m3u" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="input flex-1" />
          ) : (
            <textarea required placeholder="#EXTM3U&#10;#EXTINF:-1 ...,Name&#10;https://..." value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="input min-h-[80px] flex-1 font-mono text-[11px]" />
          )}
          <button type="submit" disabled={busy} className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} {zh ? '导入' : 'Import'}
          </button>
        </div>
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
            <AlertCircle size={13} /> {error}
          </p>
        )}
      </form>

      {sources.length > 0 && (
        <div className="space-y-1.5">
          {sources.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-panel/40 px-3 py-2">
              <ListVideo size={15} className="shrink-0 text-accent/70" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-ink/80">{s.name}</div>
                <div className="truncate text-[10px] text-ink/40">{s.url || (zh ? '粘贴的播放列表' : 'pasted playlist')}</div>
              </div>
              {s.lastError ? (
                <span className="shrink-0 font-mono text-[10px] text-rose-400">{s.lastError}</span>
              ) : (
                <span className="shrink-0 font-mono text-[10px] text-emerald-400">{s.count} {zh ? '个频道' : 'channels'}</span>
              )}
              <button onClick={() => remove(s.id)} className="shrink-0 rounded p-1.5 text-ink/50 hover:text-rose-400" aria-label={zh ? '删除' : 'Delete'}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface EpgSource {
  id: string;
  name: string;
  url: string;
  count: number;
  lastError: string | null;
}

function EpgManager() {
  const zh = useI18n((s) => s.lang) === 'zh';
  const [sources, setSources] = useState<EpgSource[]>([]);
  const [form, setForm] = useState({ name: '', url: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const r = await api.get<{ sources: EpgSource[] }>('/epg/sources');
      setSources(r.sources);
    } catch {
      /* ignore */
    }
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api.post<{ sources: EpgSource[] }>('/admin/epg', form);
      setSources(r.sources);
      setForm({ name: '', url: '' });
    } catch (err: any) {
      setError(err?.message || (zh ? 'EPG 导入失败' : 'EPG import failed'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await api.del(`/admin/epg/${id}`).catch(() => {});
    load();
  };

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <CalendarClock size={18} className="text-accent" />
        <h2 className="text-base font-semibold text-ink">{zh ? '电视节目单(EPG / XMLTV)' : 'TV guide (EPG / XMLTV)'}</h2>
        <span className="text-[11px] text-ink/40">{zh ? '添加服务商的 XMLTV 地址(epg.xml / .gz),即可使用正在播出/接下来与按节目搜索。' : 'Add your provider XMLTV URL (epg.xml / .gz) for now/next and show search.'}</span>
      </div>

      <form onSubmit={add} className="mb-4 flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-panel/60 p-4 sm:flex-row sm:items-end">
        <input required placeholder={zh ? '名称(如:服务商 EPG)' : 'Name (e.g. Provider EPG)'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input sm:w-56" />
        <input required type="url" placeholder="https://.../epg.xml(.gz)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="input flex-1" />
        <button type="submit" disabled={busy} className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} {zh ? '导入' : 'Import'}
        </button>
      </form>
      {error && (
        <p className="mb-3 flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {sources.length > 0 && (
        <div className="space-y-1.5">
          {sources.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-panel/40 px-3 py-2">
              <CalendarClock size={15} className="shrink-0 text-accent/70" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-ink/80">{s.name}</div>
                <div className="truncate text-[10px] text-ink/40">{s.url}</div>
              </div>
              {s.lastError ? (
                <span className="shrink-0 font-mono text-[10px] text-rose-400">{s.lastError}</span>
              ) : (
                <span className="shrink-0 font-mono text-[10px] text-emerald-400">{s.count.toLocaleString(numLocale())} {zh ? '个节目' : 'programmes'}</span>
              )}
              <button onClick={() => remove(s.id)} className="shrink-0 rounded p-1.5 text-ink/50 hover:text-rose-400" aria-label={zh ? '删除' : 'Delete'}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
