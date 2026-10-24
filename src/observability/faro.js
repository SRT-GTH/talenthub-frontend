/**
 * Grafana Faro real-user monitoring (Grafana Cloud Frontend Observability).
 *
 * Off unless VITE_FARO_URL is set; then the SDK is fetched as its own chunk
 * after the app has started, so it never delays the first render. It records
 * web vitals, errors, page loads and API calls, and adds `traceparent` to API
 * requests so a slow call opens its backend trace in Tempo.
 *
 * It also sends one `page_data` measurement per page from the same recorder
 * the ?perf=1 panel uses (utils/perf.js): time to data, API call count and
 * the backend's share of it.
 *
 *   VITE_FARO_URL           collector URL from Grafana Cloud > Frontend Observability
 *   VITE_FARO_SAMPLE_RATE   share of sessions recorded (default 1)
 *   VITE_DEPLOY_ENV         environment label (default: Vite mode)
 */
import { setRumSink } from '../utils/perf.js';

export const faroEnabled = () => Boolean(import.meta.env.VITE_FARO_URL);

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Origins whose requests get `traceparent` (the API; same-origin requests always do). */
function apiOrigins() {
  const out = [];
  for (const base of [import.meta.env.VITE_API_BASE_URL, import.meta.env.VITE_AGENT_BASE_URL]) {
    if (!base) continue;
    try {
      const { origin } = new URL(base, window.location.origin);
      if (origin !== window.location.origin) out.push(new RegExp(`^${escapeRegExp(origin)}`));
    } catch {
      /* not a URL */
    }
  }
  return out;
}

/** Page -> Faro measurement (numbers only; the path goes in the context). */
export function pageMeasurement(page) {
  const backend = page.calls.reduce((s, c) => s + (c.server?.totalMs || 0), 0);
  const slowest = page.calls.reduce((m, c) => Math.max(m, c.ms || 0), 0);
  return {
    type: 'page_data',
    values: {
      time_to_data: Math.round(page.settledAt ?? 0),
      api_calls: page.calls.length,
      backend_ms: Math.round(backend),
      slowest_call_ms: Math.round(slowest),
    },
    context: { path: page.path, first_load: String(page.start === 0) },
  };
}

let started = false;

export async function initFaro() {
  const url = import.meta.env.VITE_FARO_URL;
  if (!url || started || typeof window === 'undefined') return null;
  started = true;
  try {
    const [{ initializeFaro, getWebInstrumentations }, { TracingInstrumentation }] =
      await Promise.all([import('@grafana/faro-web-sdk'), import('@grafana/faro-web-tracing')]);
    const rate = Number(import.meta.env.VITE_FARO_SAMPLE_RATE ?? 1);
    const faro = initializeFaro({
      url,
      app: {
        name: 'talenthub-frontend',
        version: import.meta.env.VITE_APP_VERSION || 'dev',
        environment: import.meta.env.VITE_DEPLOY_ENV || import.meta.env.MODE,
      },
      sessionTracking: { samplingRate: Number.isFinite(rate) ? rate : 1 },
      instrumentations: [
        ...getWebInstrumentations({ captureConsole: false }),
        new TracingInstrumentation({
          instrumentationOptions: { propagateTraceHeaderCorsUrls: apiOrigins() },
        }),
      ],
    });
    setRumSink((page) => {
      const { type, values, context } = pageMeasurement(page);
      faro.api.pushMeasurement({ type, values }, { context });
    });
    return faro;
  } catch (err) {
    console.warn('[faro] not started:', err?.message || err);
    return null;
  }
}
