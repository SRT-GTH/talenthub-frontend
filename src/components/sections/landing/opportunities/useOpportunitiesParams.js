import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FILTER_GROUPS } from './OpportunitiesData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useOpportunitiesParams');

const LIST_KEYS = FILTER_GROUPS.map((g) => g.key);

/*
 * P-03 "frame as URL" — every state the Figma frames draw lives in the query string:
 *   ?q=&loc=            search fields
 *   ?type=<id>          type chip (absent = "all")
 *   ?level=a,b&style=&region=   filter groups (param absent = the options drawn checked in Figma; present-but-empty = none)
 *   ?filters=1          mobile / tablet filters bottom sheet open (frame 7815:306490)
 * update(patch): { key: value } — string sets, array joins with ",", null/undefined removes the key.
 */
export const useOpportunitiesParams = () => {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    const lists = {};
    FILTER_GROUPS.forEach((g) => {
      lists[g.key] = params.has(g.key) ? params.get(g.key).split(',').filter(Boolean) : g.defaults;
    });
    return {
      q: params.get('q') ?? '',
      loc: params.get('loc') ?? '',
      type: params.get('type') ?? 'all',
      sheetOpen: params.get('filters') === '1',
      ...lists,
    };
  }, [params]);

  const update = useCallback(
    (patch) => {
      log('update', patch);
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === undefined || (key === 'type' && value === 'all')) {
              next.delete(key);
            } else if (Array.isArray(value)) {
              next.set(key, value.join(','));
            } else if (key === 'filters' && !value) {
              next.delete(key);
            } else if (LIST_KEYS.includes(key) || value !== '') {
              next.set(key, String(value));
            } else {
              next.delete(key);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  return { state, update };
};
