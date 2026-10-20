import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { getStreakPageData } from './talentStreakData.js';
import { useLiveStreak } from './useLiveStreak.js';
import { isLoggedIn } from '../../../services/auth.api.js';

const log = debug('streakPageState');

/*
 * `/streak` URL state. Live by default for a signed-in talent (GET /streak via useLiveStreak: `streakLive` = { status,
 * data, reload }, `data` = the page payload in the same shape as the mock); `?demo=1` or `?milestone=15` keep the drawn mock:
 *   /streak                 S-07 Your streak (full page, streak 12)
 *   /streak?milestone=15    S-08 the 15-day modal over the page (streak 15)
 *   /streak?rail=collapsed  icon rail     /streak?help=1  help pop-over     /streak?search=1  global search
 * The returned object doubles as the `talentHome` the shared talent chrome reads
 * (`update`, `stateKey`, `a11yMode`, `searchOpen`, `navStreak`, …), so the nav pill shows the page's streak.
 */
export const useStreakPageState = () => {
  const [params, setParams] = useSearchParams();
  const milestone = params.get('milestone') === '15' ? '15' : null;
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';
  const searchOpen = params.get('search') === '1';
  const liveOn = isLoggedIn() && params.get('demo') !== '1' && !milestone;
  const live = useLiveStreak({ enabled: liveOn });

  return useMemo(() => {
    const data = live.data ?? getStreakPageData({ milestone });
    log('state', { milestone, rail, streak: data.summary.current });
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false) next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      stateKey: 'top',
      milestone,
      rail,
      help,
      a11yMode: a11yParam,
      a11yParam,
      searchOpen,
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
      navStreak: data.summary.navStreak,
      data,
      // Not `live`: the shared talent chrome reads talentHome.live as the home-page payload.
      streakLive: liveOn ? live : null,
      update,
    };
  }, [params, setParams, milestone, rail, help, a11yParam, searchOpen, live, liveOn]);
};
