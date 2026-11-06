import { useCallback, useEffect, useMemo, useState } from 'react';
import { agencyOverview } from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import {
  parseQueryFilters,
  queryApiParams,
  serialiseExtras,
  toQueryResult,
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
 * The figures are live: GET /agency/overview with the five keys and ?x= (the server applies the extras it can; groups under 5 come back
 * suppressed). The previous result stays on screen while a new one loads.
 * Returns { filters, result, loading, error, retry, actions }.
 */

const EMPTY_OVERVIEW = {
  count: 0,
  state: 'loading',
  regions: [],
  interests: { aside: '', rows: [] },
  education: [],
  ages: [],
  capabilities: [],
  gender: [],
  kpis: {},
};

/** Live overview of a filter set ({ overview, loading, error, retry }). */
export const useLiveOverview = (filters) => {
  const params = queryApiParams(filters);
  const key = JSON.stringify(params);
  const [res, setRes] = useState({ key: null, overview: null, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    agencyOverview(JSON.parse(key))
      .then((overview) => live && setRes({ key, overview, error: null }))
      .catch((error) => {
        log.error('overview failed', error?.response?.status || error?.message);
        if (live) setRes((r) => ({ ...r, key, error }));
      });
    return () => {
      live = false;
    };
  }, [key, attempt]);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return {
    overview: res.overview || EMPTY_OVERVIEW,
    loading: res.key !== key,
    first: !res.overview,
    error: res.key === key ? res.error : null,
    retry,
  };
};

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
  const live = useLiveOverview(filters);
  const result = useMemo(
    () => toQueryResult(filters, live.overview, { forceZero: state === 'zero' }),
    [filters, live.overview, state]
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

  return {
    filters,
    result,
    loading: live.loading,
    first: live.first,
    error: live.error,
    retry: live.retry,
    overview: live.overview,
    actions,
  };
};
