import { useState, useEffect, useCallback } from 'react';
import {
  Search, RefreshCw, Trash2, Loader2,
  ChevronLeft, ChevronRight, Filter,
  LogIn, LogOut, Plus, Pencil, Trash,
  UserCheck, Activity, Shield, Key,
  ClipboardList, UserRound, Syringe, Dog, Users,
} from 'lucide-react';
import apiClient from '../api/client';
import useThemeStore from '../store/themeStore';

/* ─── Config ─── */
const ACTION_CONFIG = {
  CREATE:         { label: 'Created',        color: 'bg-emerald-500', icon: Plus },
  UPDATE:         { label: 'Updated',        color: 'bg-blue-500',    icon: Pencil },
  DELETE:         { label: 'Deleted',        color: 'bg-red-500',     icon: Trash },
  LOGIN:          { label: 'Login',          color: 'bg-indigo-500',  icon: LogIn },
  LOGOUT:         { label: 'Logout',         color: 'bg-slate-500',   icon: LogOut },
  ASSIGN:         { label: 'Assigned',       color: 'bg-purple-500',  icon: UserCheck },
  STATUS_CHANGE:  { label: 'Status Change',  color: 'bg-amber-500',   icon: Activity },
  PASSWORD_RESET: { label: 'Password Reset', color: 'bg-orange-500',  icon: Key },
};

const MODULE_CONFIG = {
  Case:        { label: 'Case',        icon: ClipboardList, color: 'text-blue-600',    bg: 'bg-blue-50'    },
  Patient:     { label: 'Patient',     icon: UserRound,     color: 'text-teal-600',    bg: 'bg-teal-50'    },
  Vaccination: { label: 'Vaccination', icon: Syringe,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Animal:      { label: 'Animal',      icon: Dog,           color: 'text-amber-600',   bg: 'bg-amber-50'   },
  User:        { label: 'User',        icon: Users,         color: 'text-purple-600',  bg: 'bg-purple-50'  },
  Auth:        { label: 'Auth',        icon: Shield,        color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
};

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  staff: 'bg-blue-100 text-blue-700',
  user:  'bg-slate-100 text-slate-600',
};

/* ─── Helpers ─── */
const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    + ' · '
    + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const timeAgo = (d) => {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hrs   = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hrs  < 24)  return `${hrs}h ago`;
  return `${days}d ago`;
};

/* ─── Main ─── */
export default function ActivityLogs() {
  const { dark } = useThemeStore();

  const [logs,       setLogs]       = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [clearing,   setClearing]   = useState(false);
  const [showClear,  setShowClear]  = useState(false);
  const [detailLog,  setDetailLog]  = useState(null);

  // Filters
  const [search,   setSearch]   = useState('');
  const [action,   setAction]   = useState('All');
  const [module,   setModule]   = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');

  const LIMIT = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: LIMIT,
        ...(action   !== 'All' && { action   }),
        ...(module   !== 'All' && { module   }),
        ...(search   && { search   }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo   && { dateTo   }),
      });
      const res = await apiClient.get(`/activity?${params}`);
      setLogs(res.data.logs);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, action, module, search, dateFrom, dateTo]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [action, module, search, dateFrom, dateTo]);

  const handleClear = async () => {
    setClearing(true);
    try {
      await apiClient.delete('/activity');
      setShowClear(false);
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear logs');
    } finally {
      setClearing(false);
    }
  };

  /* ── tokens ── */
  const bg       = dark ? 'bg-[#070d1a]'              : 'bg-slate-50';
  const cardBg   = dark ? 'bg-[#0f1f45] border-[#1e3a6e]' : 'bg-white border-slate-200';
  const headText = dark ? 'text-slate-100'             : 'text-slate-800';
  const subText  = dark ? 'text-slate-400'             : 'text-slate-500';
  const inputCls = `w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all ${dark ? 'bg-[#0d1b3e] border-[#1e3a6e] text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'}`;
  const selectCls = `${inputCls} cursor-pointer appearance-none`;

  return (
    <div className={`min-h-full -m-6 lg:-m-8 p-6 lg:p-8 transition-colors duration-300 ${bg}`}>

      {/* ── Confirm Clear Modal ── */}
      {showClear && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border ${cardBg}`}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className={`text-base font-bold mb-2 ${headText}`}>Clear All Logs?</h3>
            <p className={`text-sm mb-6 ${subText}`}>This will permanently delete all activity records. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClear(false)} disabled={clearing}
                className={`flex-1 py-2.5 border rounded-xl text-sm font-medium transition-colors ${dark ? 'border-[#1e3a6e] text-slate-300 hover:bg-[#0d1b3e]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                Cancel
              </button>
              <button onClick={handleClear} disabled={clearing}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
                {clearing && <Loader2 size={14} className="animate-spin" />} Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {detailLog && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setDetailLog(null)}>
          <div className={`rounded-2xl shadow-2xl p-6 max-w-md w-full border transition-colors ${cardBg}`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {(() => { const ac = ACTION_CONFIG[detailLog.action] || { label: detailLog.action, color: 'bg-slate-400', icon: Activity }; const ActionIcon = ac.icon; return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${ac.color}`}>
                    <ActionIcon size={10} />{ac.label}
                  </span>
                ); })()}
                {(() => { const mc = MODULE_CONFIG[detailLog.module] || { label: detailLog.module, icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' }; const ModuleIcon = mc.icon; return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${dark ? 'bg-[#1e3a6e] text-slate-300' : `${mc.bg} ${mc.color}`}`}>
                    <ModuleIcon size={10} />{mc.label}
                  </span>
                ); })()}
              </div>
              <button onClick={() => setDetailLog(null)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${dark ? 'text-slate-400 hover:text-slate-200 hover:bg-[#1e3a6e]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                ×
              </button>
            </div>

            {/* Description */}
            <p className={`text-sm font-medium leading-relaxed mb-4 ${headText}`}>{detailLog.description}</p>

            {/* Meta info */}
            <div className={`rounded-xl p-3 space-y-2 ${dark ? 'bg-[#0d1b3e]' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${subText}`}>Performed by</span>
                <span className={`text-xs font-semibold ${headText}`}>{detailLog.performedByName} · {detailLog.performedByRole}</span>
              </div>
              {detailLog.targetName && (
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${subText}`}>Target</span>
                  <span className={`text-xs font-semibold ${headText}`}>{detailLog.targetName}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${subText}`}>Time</span>
                <span className={`text-xs font-semibold ${headText}`}>{fmtDate(detailLog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${headText}`}>Activity Logs</h1>
          <p className={`text-sm mt-1 ${subText}`}>
            {total} total records · All system actions and events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchLogs}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${dark ? 'bg-[#0f1f45] border-[#1e3a6e] text-slate-300 hover:bg-[#0d1b3e]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} shadow-sm`}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={() => setShowClear(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5">
            <Trash2 size={14} /> Clear Logs
          </button>
        </div>
      </div>

 {/* ── Filters ── */}
<div className={`rounded-2xl border p-5 mb-5 transition-colors ${cardBg}`}>
  <div className="flex items-center gap-2 mb-4">
    <Filter size={13} className={subText} />
    <span className={`text-xs font-bold uppercase tracking-widest ${subText}`}>Filters</span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {/* Search */}
    <div className="lg:col-span-2 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input type="text" placeholder="Search by user, action, target..."
        value={search} onChange={e => setSearch(e.target.value)}
        className={`${inputCls} pl-9`} />
    </div>

    {/* Action */}
    <select value={action} onChange={e => setAction(e.target.value)} className={selectCls}>
      <option value="All">All Actions</option>
      {Object.entries(ACTION_CONFIG).map(([k, v]) => (
        <option key={k} value={k}>{v.label}</option>
      ))}
    </select>

    {/* Module */}
    <select value={module} onChange={e => setModule(e.target.value)} className={selectCls}>
      <option value="All">All Modules</option>
      {Object.keys(MODULE_CONFIG).map(k => (
        <option key={k} value={k}>{k}</option>
      ))}
    </select>

    {/* Date From */}
    <div className="space-y-1">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>From</p>
      <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
        className={selectCls} />
    </div>

    {/* Date To */}
    <div className="space-y-1">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>To</p>
      <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
        className={selectCls} />
    </div>

    {/* Clear button — only show when filters are active */}
    {(action !== 'All' || module !== 'All' || search || dateFrom || dateTo) && (
      <div className="lg:col-span-2 flex items-end">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs ${subText}`}>Active:</span>
          {action !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {ACTION_CONFIG[action]?.label}
              <button onClick={() => setAction('All')} className="ml-1 hover:text-blue-900">×</button>
            </span>
          )}
          {module !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {module}
              <button onClick={() => setModule('All')} className="ml-1 hover:text-purple-900">×</button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
              "{search}"
              <button onClick={() => setSearch('')} className="ml-1 hover:text-slate-800">×</button>
            </span>
          )}
          <button
            onClick={() => { setAction('All'); setModule('All'); setSearch(''); setDateFrom(''); setDateTo(''); }}
            className={`text-xs font-medium underline ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
            Clear all
          </button>
        </div>
      </div>
    )}
  </div>
</div>

      {/* ── Table ── */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b-2 ${dark ? 'bg-[#0d1b3e] border-[#1e3a6e]' : 'bg-slate-50 border-slate-100'}`}>
                {['Action', 'Module', 'Description', 'Performed By', 'Target', 'Time'].map(h => (
                  <th key={h} className={`px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${dark ? 'text-blue-400' : 'text-blue-600'} whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-400" />
                    <p className={`text-sm ${subText}`}>Loading activity logs...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Activity className={`w-12 h-12 mx-auto mb-3 opacity-10 ${headText}`} />
                    <p className={`text-sm font-medium ${subText}`}>No activity logs found</p>
                    <p className={`text-xs mt-1 ${subText}`}>Actions will appear here once users interact with the system</p>
                  </td>
                </tr>
              ) : logs.map((log, i) => {
                const ac  = ACTION_CONFIG[log.action]  || { label: log.action,  color: 'bg-slate-400', icon: Activity };
                const mc  = MODULE_CONFIG[log.module]  || { label: log.module,  icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' };
                const ActionIcon = ac.icon;
                const ModuleIcon = mc.icon;
                const isEven = i % 2 === 1;

                return (
                  <tr key={log.id}
                    onClick={() => setDetailLog(log)}
                    className={`cursor-pointer border-b transition-colors ${dark
                      ? `border-[#1e3a6e] hover:bg-[#0f2354] ${isEven ? 'bg-[#0d1b3e]/40' : ''}`
                      : `border-slate-100 hover:bg-blue-50/40 ${isEven ? 'bg-slate-50/50' : 'bg-white'}`}`}>

                    {/* Action */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${ac.color}`}>
                        <ActionIcon size={10} />
                        {ac.label}
                      </span>
                    </td>

                    {/* Module */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${dark ? 'bg-[#1e3a6e] text-slate-300' : `${mc.bg} ${mc.color}`}`}>
                        <ModuleIcon size={10} />
                        {mc.label}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className={`text-sm truncate ${headText}`}>{log.description}</p>
                    </td>

                    {/* Performed By */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)' }}>
                          {log.performedByName?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${headText}`}>{log.performedByName}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${ROLE_COLORS[log.performedByRole] || 'bg-slate-100 text-slate-500'}`}>
                            {log.performedByRole}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Target */}
                    <td className="px-5 py-3.5">
                      <p className={`text-xs ${log.targetName ? (dark ? 'text-slate-300' : 'text-slate-600') : (dark ? 'text-slate-600' : 'text-slate-300')}`}>
                        {log.targetName || '—'}
                      </p>
                    </td>

                    {/* Time */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className={`text-xs font-medium ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{timeAgo(log.createdAt)}</p>
                      <p className={`text-[10px] mt-0.5 ${subText}`}>{fmtDate(log.createdAt)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-between px-5 py-4 border-t ${dark ? 'border-[#1e3a6e]' : 'border-slate-100'}`}>
          <p className={`text-sm ${subText}`}>
            Showing <span className={`font-semibold ${headText}`}>{Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)}</span> of <span className={`font-semibold ${headText}`}>{total}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 ${dark ? 'border-[#1e3a6e] text-slate-300 hover:bg-[#0d1b3e]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <ChevronLeft size={15} />
            </button>
            <span className={`text-sm font-medium px-2 ${headText}`}>{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 ${dark ? 'border-[#1e3a6e] text-slate-300 hover:bg-[#0d1b3e]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}