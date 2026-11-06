import { useLiveStreak } from '../talentStreak/useLiveStreak.js';
import { useLiveXp } from '../talentXp/useLiveXp.js';
import { HEADER } from './talentLearningHubData.js';

/*
 * The My Learning header's streak sticker ("12-day streak") and the Playful header art's "+120 XP this week" sticker.
 * Live (LearningDataProvider `live`): the talent's current streak (GET /streak) and this week's XP from the XP ledger
 * (GET /xp `thisWeek`); each is null (hidden) at 0 or until it loads. Courses themselves award no XP. Mock / demo keeps
 * the drawn values (`fallback` overrides the drawn XP line, e.g. the Explore header's copy).
 */
export const useLearningHeaderStats = (live, fallback = {}) => {
  const xp = useLiveXp({ enabled: live });
  const streak = useLiveStreak({ enabled: live });
  if (!live) {
    return { streak: fallback.streak ?? HEADER.streak, xpWeek: fallback.xpWeek ?? HEADER.art.xp };
  }
  const days = streak.data?.summary?.current ?? 0;
  const week = xp.data?.thisWeek ?? 0;
  return {
    streak: days ? `${days}-day streak` : null,
    xpWeek: week > 0 ? `+${Number(week).toLocaleString('en-GB')} XP this week` : null,
  };
};
