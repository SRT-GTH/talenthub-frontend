import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  EXPERIENCE_FILTER,
  LOCATION_FILTER,
  MORE_FILTERS,
  SKILLS_FILTER,
  SORT_MENU,
} from './talentSearchFilterData.js';
import { RESULT_TABS } from './talentSearchData.js';

/*
 * useTalentSearchState — the whole talent-search screen state, kept in the URL query string (reload, deep link and back all work).
 * Defaults are omitted from the URL so the plain /recruiter/talent-search is TS-01.
 *
 *   tab=top-matches | available-now    result tab (default all-matches)                                       existing key
 *   q=<text>                           the committed search (Enter, a suggestion or a popular search)         existing key
 *   typed=<text>                       the text being typed in the search field (draft, before it is committed)  TS-02 (with menu=search)
 *   filters=open                       phone filters sheet open (same as menu=more-filters)                   existing key
 *   menu=search|skills|experience|location|sort|more-filters   which dropdown / drawer is open                 TS-02 search, TS-03 skills, TS-04 experience,
 *                                                                                                              TS-05 location, TS-07 sort, TS-06 more-filters
 *   skills=React,Python,AWS | none     must-have skills (default React,Python,AWS; none = cleared)            TS-01 / TS-03
 *   exp=0-2|2-5|5-plus|10-plus|any     experience (default 5-plus; any = cleared; 10-plus returns no one)      TS-04 / TS-09
 *   location=accra|kumasi|tema|takoradi|any   city (default accra; any = cleared)                              TS-05
 *   remote=0                           "Include remote talent" off (default on)                               TS-05
 *   radius=1                           "Within 50 km" on (default off)                                        TS-05
 *   sort=best-match|recently-active|assessment-score|available-soonest|open-to-work-first   (default best-match)  TS-07
 *   availability=<ids>|none, setup=<ids>|none, education=, score=, pay=, verified=0, adult=0, hidePipeline=1       More filters drawer values (TS-06)
 *   state=loading | empty | first-visit   pins the loading skeleton (TS-08), the no-results state (TS-09) or the first-visit screen (TS-10)
 *   job=<id>                           the role the matches are for (default senior-product-engineer)
 */
const csv = (value, fallback) => {
  if (value === null) return fallback;
  if (value === 'none' || value === '') return [];
  return value.split(',');
};

export const useTalentSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = useCallback(
    (changes) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') next.delete(key);
            else next.set(key, String(value));
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const get = (key) => searchParams.get(key);
  const tabParam = get('tab');
  const menuParam = get('menu');
  const stateParam = get('state');
  const expParam = get('exp');
  const locationParam = get('location');
  const sortParam = get('sort');

  const menu = menuParam ?? (get('filters') === 'open' ? 'more-filters' : null);

  const value = useMemo(
    () => ({
      tabId: RESULT_TABS.some((tab) => tab.id === tabParam) ? tabParam : RESULT_TABS[0].id,
      query: get('q') ?? '',
      typed: get('typed'),
      menu,
      pageState: ['loading', 'empty', 'first-visit'].includes(stateParam) ? stateParam : null,
      jobId: get('job'),
      skills: csv(get('skills'), SKILLS_FILTER.defaultSkills),
      expId:
        expParam === 'any' || EXPERIENCE_FILTER.options.some((o) => o.id === expParam)
          ? expParam
          : EXPERIENCE_FILTER.defaultId,
      locationId:
        locationParam === 'any' || LOCATION_FILTER.options.some((o) => o.id === locationParam)
          ? locationParam
          : LOCATION_FILTER.defaultId,
      remote: get('remote') !== '0',
      radius: get('radius') === '1',
      sortId: SORT_MENU.options.some((o) => o.id === sortParam) ? sortParam : SORT_MENU.defaultId,
      availability: csv(get('availability'), MORE_FILTERS.defaultAvailability),
      workSetup: csv(get('setup'), MORE_FILTERS.defaultWorkSetup),
      education: get('education') ?? MORE_FILTERS.education.defaultId,
      minScore: get('score') ?? MORE_FILTERS.minScore.defaultId,
      pay: get('pay') ?? MORE_FILTERS.pay.defaultId,
      verified: get('verified') !== '0',
      adult: get('adult') !== '0',
      hidePipeline: get('hidePipeline') === '1',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  return { ...value, update };
};

/* URL writers shared by the controls: a value equal to its default is removed from the URL. */
export const listParam = (ids, defaults) => {
  if (ids.length === 0) return 'none';
  return ids.join(',') === defaults.join(',') ? null : ids.join(',');
};
