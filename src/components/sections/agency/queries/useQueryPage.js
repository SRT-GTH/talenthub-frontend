import { useCallback, useEffect, useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  parseQueryFilters,
  runQuery,
  serialiseExtras,
  QUERY_FILTER_KEYS,
} from '../data/queriesData.js';

const log = debug('useQueryPage');

/*
 * useQueryPage — URL <-> query for the agency Queries page (11.5.1). The URL is the state:
 *   region=<id>[,<id>]  edu= interest= age= gender=   the five shared filter keys (Theme 8 names; region may list several ids)
 *   x=field~a~b;field2~c      extra profile filters of the "More filters" drawer (queriesData DRAWER_GROUPS)
 *   profile=1                 preset of frame 11.5.1g (TVET/HND · Internship · Ready now · certificate · Builders) when ?x= is absent
 *   by=<view>                 "View by" of the Breakdown card (interest | education | region | age | gender | capability)
 *   state=results|zero        results = the query was built (summary pills); zero = the forced "no results" frame
 *   menu=region               the Region menu is open (so the frame 11.5.1a is a URL)
 *   modal=save-query|export|filters
 * Returns { filters, result, announce, actions }.
 */

const CLEAR_ALL = {
  ...Object.fromEntries(QUERY_FILTER_KEYS.map((k) => [k, null])),
  x: null,
  profile: null,
  by: null,
  state: null,
  menu: null,
};

export const useQueryPage = (data) => {
  const { params, update, state } = data;
  const filters = useMemo(() => parseQueryFilters(params), [params]);
  const result = useMemo(
    () => runQuery(filters, { forceZero: state === 'zero' }),
    [filters, state]
  );

  useEffect(() => {
    log('result', { status: result.status, count: result.count });
  }, [result.status, result.count]);

  /** The effective state written back to the URL as soon as the user edits something (the preset becomes explicit ?x=). */
  const freeze = useCallback(
    () => ({
      x: serialiseExtras(filters.extras) || null,
      profile: null,
      interest: filters.interest || null,
      age: filters.age || null,
    }),
    [filters]
  );

  const actions = useMemo(
    () => ({
      setFilter: (key, id) => {
        log('filter', key, id);
        update({ ...freeze(), [key]: id || null, state: 'results' });
      },
      setRegions: (ids) => {
        log('regions', ids);
        update({
          ...freeze(),
          region: ids.length ? ids.join(',') : null,
          state: 'results',
          menu: null,
        });
      },
      setExtra: (id, values) => {
        log('extra', id, values);
        const next = { ...filters.extras };
        if (values?.length) next[id] = values;
        else delete next[id];
        update({ ...freeze(), x: serialiseExtras(next) || null, state: 'results' });
      },
      clearExtras: () => update({ ...freeze(), x: null, state: 'results' }),
      clearAll: () => {
        log('clear all');
        update(CLEAR_ALL);
      },
      applyDraft: (draft) => {
        log('apply draft');
        update({
          region: draft.region.length ? draft.region.join(',') : null,
          edu: draft.edu || null,
          interest: draft.interest || null,
          age: draft.age || null,
          gender: draft.gender || null,
          x: serialiseExtras(draft.extras) || null,
          profile: null,
          state: 'results',
          modal: null,
          menu: null,
        });
      },
      setView: (by) => update({ by, state: 'results' }, { replace: true }),
      openMenu: (name) => update({ menu: name }, { replace: true }),
      closeMenu: () => update({ menu: null }, { replace: true }),
      openModal: (name) => update({ modal: name }),
      closeModal: () => update({ modal: null }, { replace: true }),
    }),
    [filters, freeze, update]
  );

  return { filters, result, actions };
};
