import { debug } from '../../../utils/debug.js';
import { OPPORTUNITIES, PARTNERS } from './directory/data/directoryData.js';
import { DATA_BASE } from './publicDataNav.js';
import { REGIONS } from './regionsList.js';

const log = debug('publicDataSearch');

/*
 * publicDataSearch — where "Search regions, partners, opportunities" (top bar, 404 page) leads when the visitor presses Enter.
 * Figma draws no results page, so the search reuses the screens that already exist (⚠️ ASSUMPTION):
 *   a region name (e.g. "Ashanti")            -> that region's page        /data/regions/:id
 *   matches a partner (name, focus, region)   -> the partner directory     /data/partners?q=…
 *   matches an opportunity (title, partner …) -> the opportunity directory /data/opportunities?q=…
 *   nothing matches                           -> the partner directory with the query (it shows its own "no results" state)
 * An empty query goes to the landing page.
 */

const has = (values, needle) => values.some((v) => String(v).toLowerCase().includes(needle));

export const searchDestination = (query) => {
  const q = String(query ?? '').trim();
  const needle = q.toLowerCase();
  if (!needle) return DATA_BASE;
  const region = REGIONS.find((r) => r.name.toLowerCase() === needle || r.id === needle);
  let to;
  if (region) to = `${DATA_BASE}/regions/${region.id}`;
  else if (PARTNERS.some((p) => has([p.name, ...p.focus, p.regionLabel], needle)))
    to = `${DATA_BASE}/partners?q=${encodeURIComponent(q)}`;
  else if (
    OPPORTUNITIES.some((o) => has([o.title, o.partnerName, o.regionLabel, o.eligibility], needle))
  )
    to = `${DATA_BASE}/opportunities?q=${encodeURIComponent(q)}`;
  else to = `${DATA_BASE}/partners?q=${encodeURIComponent(q)}`;
  log('destination', { length: q.length, to: to.split('?')[0] });
  return to;
};
