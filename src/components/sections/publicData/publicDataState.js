import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('publicDataState');

/*
 * publicDataState — the URL is the state of every Theme 8 public-data screen (Figma canvas 8477:209484, 99 frames).
 * Routes live under /data (see PublicDataApp.jsx). Query keys, shared by all sections:
 *
 *   rail=collapsed          icon rail on desktop (tablet 768-1279 always draws the rail)
 *   drawer=1                mobile navigation drawer open (8.9.2 · Mobile · Navigation drawer open)
 *   modal=<name>            share | download | digest | region | compare | filters | consent ... (owned by the section that draws it)
 *   state=<name>            loading | error | offline | empty | low-data | suppressed ...   (edge states, 8.9.3 and the section frames)
 *   region=  edu=  interest=  age=  gender=      the five overview filters (value = the option id; absent = all)
 *   q=                      search text
 *   tab=  view=  range=     section-specific (trends range 90d | 1y | all, showcase grid view ...)
 *
 * Every Figma frame is a URL: sections add their own keys but never reuse the ones above for something else.
 * Returns the parsed values, `params` (the raw URLSearchParams) and update(patch): null / false / '' remove a key.
 */

export const FILTER_KEYS = ['region', 'edu', 'interest', 'age', 'gender'];

export const usePublicDataState = () => {
  const [params, setParams] = useSearchParams();

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      log('update', patch);
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === undefined || value === false || value === '') {
              next.delete(key);
            } else {
              next.set(key, value === true ? '1' : String(value));
            }
          });
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  return useMemo(() => {
    const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k)]));
    const activeFilters = FILTER_KEYS.filter((k) => filters[k]);
    return {
      params,
      update,
      rail: params.get('rail') === 'collapsed' ? 'collapsed' : null,
      drawer: params.get('drawer') === '1',
      modal: params.get('modal'),
      state: params.get('state'),
      q: params.get('q') ?? '',
      tab: params.get('tab'),
      view: params.get('view'),
      filters,
      activeFilters,
    };
  }, [params, update]);
};
