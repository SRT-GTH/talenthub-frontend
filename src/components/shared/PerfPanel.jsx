import { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import {
  clearPerf,
  disablePerf,
  exportPerf,
  getPages,
  getVersion,
  markNavigation,
  perfEnabled,
  subscribe,
} from '../../utils/perf.js';

/*
 * PerfPanel — floating load-time panel, shown only with ?perf=1 (see utils/perf.js).
 *
 * Collapsed: a pill with the current page's time to data and call count.
 * Open: a waterfall of the page's API calls. Each bar is the browser-side time;
 * its dark part is the time the backend spent (Server-Timing total), so the
 * light remainder is network + queueing. Click a row for the backend breakdown
 * (route action, db queries, auth calls, slowest service calls).
 */

const fmt = (ms) =>
  ms == null ? '—' : ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;

const tone = (ms) =>
  ms == null
    ? 'text-slate-500'
    : ms < 400
      ? 'text-emerald-600'
      : ms < 1200
        ? 'text-amber-600'
        : 'text-red-600';

const bar = (ms) =>
  ms == null
    ? 'bg-slate-300'
    : ms < 400
      ? 'bg-emerald-200'
      : ms < 1200
        ? 'bg-amber-200'
        : 'bg-red-200';
const barDark = (ms) =>
  ms == null
    ? 'bg-slate-500'
    : ms < 400
      ? 'bg-emerald-600'
      : ms < 1200
        ? 'bg-amber-600'
        : 'bg-red-600';

export default function PerfPanel() {
  const location = useLocation();
  // Runs before the page's own effects, so its API calls land on the new page.
  useLayoutEffect(() => {
    markNavigation(location.pathname);
  }, [location.pathname]);

  const version = useSyncExternalStore(subscribe, getVersion);
  const pages = getPages();
  const [open, setOpen] = useState(false);
  const [pickedId, setPickedId] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(false);

  const page = pages.find((p) => p.id === pickedId) || pages[0];
  if (!page || !perfEnabled() || version < 0) return null;

  const span = Math.max(1, page.settledAt ?? 0, ...page.calls.map((c) => c.end));

  const loading = page.settledAt == null;
  const headline =
    page.settledAt ?? (page.calls.length ? Math.max(...page.calls.map((c) => c.end)) : null);
  const serverSum = page.calls.reduce((s, c) => s + (c.server?.totalMs || 0), 0);
  const slowest = [...page.calls].sort((a, b) => b.ms - a.ms)[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(exportPerf(), null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked */
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        data-perf-pill
        onClick={() => setOpen(true)}
        className="fixed bottom-3 left-3 z-[9999] flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 font-mono text-xs shadow-lg backdrop-blur"
        title="Page load timing (?perf=0 to turn off)"
      >
        <span aria-hidden>⏱</span>
        <span className={`font-semibold ${tone(headline)}`}>
          {loading && page.calls.length === 0 ? '…' : fmt(headline)}
          {loading && page.calls.length > 0 ? '…' : ''}
        </span>
        <span className="text-slate-500">· {page.calls.length} calls</span>
      </button>
    );
  }

  return (
    <div
      data-perf-panel
      className="fixed bottom-3 left-3 z-[9999] flex max-h-[70vh] w-[min(560px,calc(100vw-24px))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-800 shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span aria-hidden>⏱</span>
        <select
          aria-label="Page"
          className="min-w-0 flex-1 truncate rounded border border-slate-200 bg-white px-1 py-0.5"
          value={page.id}
          onChange={(e) => {
            setPickedId(Number(e.target.value));
            setExpanded(null);
          }}
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.path} — {p.settledAt != null ? fmt(p.settledAt) : 'loading'}
            </option>
          ))}
        </select>
        <button type="button" onClick={copy} className="rounded px-1.5 py-0.5 hover:bg-slate-200">
          {copied ? 'copied' : 'copy'}
        </button>
        <button
          type="button"
          onClick={clearPerf}
          className="rounded px-1.5 py-0.5 hover:bg-slate-200"
        >
          clear
        </button>
        <button
          type="button"
          onClick={disablePerf}
          className="rounded px-1.5 py-0.5 hover:bg-slate-200"
          title="Turn off (same as ?perf=0)"
        >
          off
        </button>
        <button
          type="button"
          aria-label="Minimise"
          onClick={() => setOpen(false)}
          className="rounded px-1.5 py-0.5 hover:bg-slate-200"
        >
          ▾
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 border-b border-slate-100 px-3 py-2">
        <Stat
          label="time to data"
          value={fmt(headline)}
          cls={tone(headline)}
          hint={loading ? 'loading…' : ''}
        />
        <Stat
          label="api calls"
          value={String(page.calls.length)}
          hint={`backend Σ ${fmt(serverSum)}`}
        />
        <Stat
          label="slowest"
          value={slowest ? fmt(slowest.ms) : '—'}
          cls={tone(slowest?.ms)}
          hint={slowest ? slowest.url : ''}
        />
      </div>

      {page.nav && (
        <div className="border-b border-slate-100 px-3 py-1.5 text-slate-500">
          first load · ttfb {fmt(page.nav.ttfb)} · DOM ready {fmt(page.nav.domContentLoaded)}
          {page.nav.transferKb != null ? ` · html ${page.nav.transferKb}kB` : ''}
        </div>
      )}

      <ol className="min-h-0 flex-1 overflow-auto">
        {page.calls.length === 0 && (
          <li className="px-3 py-3 text-slate-500">No API calls on this page yet.</li>
        )}
        {page.calls.map((c, i) => {
          const left = (c.start / span) * 100;
          const width = Math.max(0.8, (c.ms / span) * 100);
          const serverShare =
            c.server?.totalMs != null ? Math.min(1, c.server.totalMs / Math.max(1, c.ms)) : 0;
          const isOpen = expanded === i;
          return (
            <li key={`${c.url}-${i}`} className="border-b border-slate-50">
              <button
                type="button"
                data-perf-call
                onClick={() => setExpanded(isOpen ? null : i)}
                className="grid w-full grid-cols-[minmax(0,1fr)_44px_52px] items-center gap-2 px-3 py-1 text-left hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <div
                    className="truncate"
                    title={`${c.method} ${c.url}${c.params ? `?${c.params}` : ''}`}
                  >
                    <span className="text-slate-400">{c.method}</span> {c.url}
                  </div>
                  <div className="relative mt-0.5 h-1.5 rounded bg-slate-100">
                    <div
                      className={`absolute top-0 h-1.5 overflow-hidden rounded ${bar(c.ms)}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <div
                        className={`absolute right-0 top-0 h-1.5 ${barDark(c.ms)}`}
                        style={{ width: `${serverShare * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span
                  className={
                    typeof c.status === 'number' && c.status < 400
                      ? 'text-slate-500'
                      : 'text-red-600'
                  }
                >
                  {c.status}
                </span>
                <span className={`text-right font-semibold ${tone(c.ms)}`}>{fmt(c.ms)}</span>
              </button>
              {isOpen && <CallDetail call={c} />}
            </li>
          );
        })}
      </ol>

      {page.chunks.length > 0 && (
        <details className="border-t border-slate-100 px-3 py-1.5 text-slate-500">
          <summary className="cursor-pointer">
            {page.chunks.length} code chunks · {page.chunks.reduce((s, c) => s + c.kb, 0)}kB ·
            longest {fmt(Math.max(...page.chunks.map((c) => c.ms)))}
          </summary>
          <ul className="mt-1 max-h-28 overflow-auto">
            {page.chunks.map((ch, i) => (
              <li key={`${ch.name}-${i}`} className="flex justify-between gap-2">
                <span className="truncate">{ch.name}</span>
                <span>
                  {ch.kb}kB · {fmt(ch.ms)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-3 py-1 text-[10px] text-slate-400">
        bar = browser time · dark part = backend (Server-Timing) · rest = network/queue
      </div>
    </div>
  );
}

function Stat({ label, value, cls = '', hint = '' }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`text-sm font-semibold ${cls}`} data-perf-stat={label}>
        {value}
      </div>
      {hint && <div className="truncate text-[10px] text-slate-400">{hint}</div>}
    </div>
  );
}

function CallDetail({ call }) {
  const s = call.server;
  if (!s) {
    return (
      <div className="px-3 pb-2 text-slate-500">
        No Server-Timing header (backend not deployed with timing, or the header was blocked by
        CORS).
      </div>
    );
  }
  const network = s.totalMs != null ? call.ms - s.totalMs : null;
  return (
    <dl
      className="grid grid-cols-[90px_minmax(0,1fr)] gap-x-2 gap-y-0.5 bg-slate-50 px-3 pb-2 pt-1"
      data-perf-detail
    >
      <dt className="text-slate-400">action</dt>
      <dd className="truncate">
        {s.action || '—'}{' '}
        {s.actionMs != null && <span className="text-slate-500">({fmt(s.actionMs)})</span>}
      </dd>
      <dt className="text-slate-400">backend</dt>
      <dd>{fmt(s.totalMs)}</dd>
      <dt className="text-slate-400">network/queue</dt>
      <dd>{fmt(network)}</dd>
      <dt className="text-slate-400">db</dt>
      <dd>
        {fmt(s.dbMs)} {s.dbDesc && <span className="text-slate-500">· {s.dbDesc}</span>}
      </dd>
      <dt className="text-slate-400">auth</dt>
      <dd>
        {fmt(s.authMs)} {s.authDesc && <span className="text-slate-500">· {s.authDesc}</span>}
      </dd>
      {s.slowest.length > 0 && (
        <>
          <dt className="text-slate-400">slowest</dt>
          <dd>
            {s.slowest.map((x) => (
              <div key={x.name} className="truncate">
                {x.name} <span className="text-slate-500">{fmt(x.ms)}</span>
              </div>
            ))}
          </dd>
        </>
      )}
      {call.requestId && (
        <>
          <dt className="text-slate-400">request id</dt>
          <dd className="truncate">{call.requestId}</dd>
        </>
      )}
    </dl>
  );
}
