import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { fetchEnrolments } from '../../../services/learning.api.js';
import { fetchTalentJobs } from '../../../services/talentJobs.api.js';
import { fetchCommunities } from '../../../services/community.api.js';

const log = debug('useLiveMoreForYou');

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
// The feed's closesInDays (null when there is no deadline): only a close deadline is worth a chip.
const closesText = (days) => {
  if (!Number.isFinite(days) || days < 0) return null;
  if (days <= 1) return 'Closes tomorrow';
  return days <= 7 ? `Closes in ${days} days` : null;
};

/*
 * Home "More for you" (Complete / Top Talent) from real data, loaded once:
 *   learning   GET /guidance/training/history   the course in progress with the most done
 *   saved      GET /guidance/jobs               saved roles, the next one to close
 *   community  GET /community                   the communities the talent joined
 * Each card is null when there is nothing to show (or its call failed), and the section hides it.
 * Evaluations and badges have no backend yet, so they are not shown for real talents.
 */
export const useLiveMoreForYou = (enabled) => {
  const [more, setMore] = useState(null);
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    const safe = (label, p) =>
      p.catch((err) => {
        log.error(`${label} failed:`, err?.response?.status || err?.message);
        return null;
      });
    Promise.all([
      safe('learning', fetchEnrolments({ status: 'all', pageSize: 20 })),
      safe('saved', fetchTalentJobs()),
      safe('communities', fetchCommunities()),
    ]).then(([enrolments, feed, communities]) => {
      if (!alive) return;
      const active = (enrolments || [])
        .filter((e) => e.status !== 'completed')
        .sort((a, b) => (Number(b.progressPercent) || 0) - (Number(a.progressPercent) || 0))[0];
      const pct = active
        ? Math.max(0, Math.min(100, Math.round(Number(active.progressPercent) || 0)))
        : 0;
      const saved = (feed?.jobs || []).filter((j) => j.saved && !j.closed);
      const soonest = [...saved]
        .filter((j) => Number.isFinite(j.closesInDays))
        .sort((a, b) => a.closesInDays - b.closesInDays)[0];
      const closes = soonest ? closesText(soonest.closesInDays) : null;
      const joined = (communities || []).filter((c) => c.isMember);
      const next = {
        learning: active
          ? {
              title: 'My learning',
              pct,
              row: [active.courseName || active.course?.title || 'Your course', `${pct}% done`],
              link: 'Resume',
              to: '/learning',
            }
          : null,
        saved: saved.length
          ? {
              title: 'Saved roles',
              chip: closes,
              row: [
                `${saved.length} saved`,
                closes
                  ? `${closes}: ${soonest.title}${soonest.company?.name ? ` · ${soonest.company.name}` : ''}`
                  : saved[0].title,
              ],
              link: 'View saved',
              to: '/job-postings?tab=saved',
            }
          : null,
        community: joined.length
          ? {
              title: 'Community',
              row: [
                joined[0].name,
                joined.length > 1
                  ? `and ${plural(joined.length - 1, 'more community')}`
                  : 'Your community',
              ],
              link: 'Open community',
              to: '/community',
            }
          : null,
      };
      log('more', { learning: Boolean(next.learning), saved: saved.length, joined: joined.length });
      setMore(next);
    });
    return () => {
      alive = false;
    };
  }, [enabled]);
  return more;
};
