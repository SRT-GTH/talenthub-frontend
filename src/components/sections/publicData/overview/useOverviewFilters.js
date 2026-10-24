import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { FILTER_KEYS } from '../publicDataState.js';
import { getOverview } from './data/overviewData.js';

const log = debug('useOverviewFilters');

const RESULT_STATES = ['zero', 'suppressed'];

/*
 * useOverviewFilters — what the filter bar, the empty states and the mobile sheet do to the URL (publicDataState.js).
 *   onChange(key, id)   one filter changed (desktop menus); a forced ?state=zero|suppressed is dropped, the numbers decide again
 *   onClearAll()        removes all five filter keys (and a forced result state)
 *   onRemoveLast()      "Remove last filter" (8.2.3d): ⚠️ ASSUMPTION the URL keeps no order, so the last of region · edu · interest · age · gender goes
 *   onSaveLink()        copies the current URL; the share package's "Link copied" toast (?toast=copied) confirms; when the clipboard is
 *                       refused the share package's manual-copy dialog (?modal=share&state=fallback, 8.1.2c) opens instead
 *   sheet               { isOpen, open, close, apply, countFor } for the mobile bottom sheet (?modal=filters)
 * `announce` is a polite status message ("All filters cleared") for a live region on the page.
 */

export const useOverviewFilters = (data) => {
  const { filters, activeFilters, state, modal, update } = data;
  const [announce, setAnnounce] = useState('');

  const resultPatch = RESULT_STATES.includes(state) ? { state: null } : {};

  const onChange = useCallback(
    (key, id) => {
      log('change', key, id);
      update({ [key]: id, ...resultPatch });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [update, state]
  );

  const onClearAll = useCallback(() => {
    log('clear all');
    update({ ...Object.fromEntries(FILTER_KEYS.map((k) => [k, null])), ...resultPatch });
    setAnnounce('All filters cleared');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, state]);

  const onRemoveLast = useCallback(() => {
    const last = [...activeFilters].pop();
    log('remove last', last);
    if (last) update({ [last]: null, ...resultPatch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, activeFilters, state]);

  const onSaveLink = useCallback(async () => {
    const url = window.location.href;
    log('save link', url);
    try {
      await navigator.clipboard.writeText(url);
      update({ toast: 'copied' }, { replace: true });
      setAnnounce('Link copied');
    } catch (error) {
      log('clipboard refused → share fallback dialog', error);
      update({ modal: 'share', state: 'fallback' });
    }
  }, [update]);

  const sheet = {
    isOpen: modal === 'filters',
    open: () => update({ modal: 'filters' }),
    close: () => update({ modal: null }, { replace: true }),
    apply: (draft) => {
      log('apply sheet', draft);
      update({
        ...Object.fromEntries(FILTER_KEYS.map((k) => [k, draft?.[k] || null])),
        ...resultPatch,
        modal: null,
      });
    },
    countFor: (draft) => getOverview(draft).count,
  };

  return { filters, onChange, onClearAll, onRemoveLast, onSaveLink, sheet, announce };
};
