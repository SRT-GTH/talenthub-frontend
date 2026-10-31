import { publicOverview } from '../../../../services/publicData.api.js';
import { useAgencyOverview } from '../../agency/useAgencyOverview.js';

/*
 * useOverviewData — the page's view of GET /api/public-data/overview (backend publicData.service → the agency figures,
 * national and regional only). Same contract as before: { status, overview, retry, forced }.
 *   status  'loading' first load (or ?state=loading in development) · 'error' · 'zero' (no talent matches) ·
 *           'suppressed' (1-4 talents match, sent as 0) · 'ready'
 * A filter change keeps the previous numbers on screen until the new ones arrive (no skeleton flash).
 */

export const useOverviewData = (filters, state, update) =>
  useAgencyOverview(filters, state, update, publicOverview);
