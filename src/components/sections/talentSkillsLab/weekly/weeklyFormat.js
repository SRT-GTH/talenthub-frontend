import { SKILLS_LAB_WEEKLY } from '../skillsLabData.js';

/*
 * Weekly challenge view-models: turn the API shape (services/skillsLabWeekly.api.js) into what the hub WeeklyCard and
 * the SL-M4 WeeklyDialog draw. The drawn mock (SKILLS_LAB_WEEKLY / HUB_LABS_RESPONSE.weekly) already has these shapes,
 * so demo frames and live data render through the same components.
 */
const count = (n, one, many) => `${Number(n || 0).toLocaleString('en-GB')} ${n === 1 ? one : many}`;

/** "3:12" */
export const clockLabel = (sec) => {
  const s = Math.max(0, Math.round(sec || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Hub card ({ title, xp, detail }), or null when there is no challenge this week. */
export const weeklyCardFrom = (w) => {
  if (!w?.available) return null;
  const playing = count(w.playing, 'talent playing', 'talents playing');
  const mine = w.myAttempt;
  let lead = `${w.questionCount} quick questions · ends Sunday`;
  if (mine?.status === 'finished')
    lead = `You scored ${mine.correct}/${mine.total} in ${clockLabel(mine.timeSec)}`;
  else if (mine?.status === 'in_progress')
    lead = `In progress · ${mine.answered} of ${mine.total} answered`;
  return { title: w.title, xp: w.xp, detail: `${lead} · ${playing}` };
};

const NOT_PLAYED = SKILLS_LAB_WEEKLY.board.rows.at(-1).score;

/**
 * Board rows as the dialog draws them: the top rows, then the viewer's own "You" row when it is not already there.
 * `board` = the API board; returns { title, rows, notice }.
 */
export const boardView = (board) => {
  const rows = (board?.rows ?? []).map((r) => ({
    rank: r.rank ? String(r.rank) : '—',
    name: r.name,
    score: r.score,
    you: Boolean(r.you),
  }));
  if (!rows.some((r) => r.you)) {
    const you = board?.you ?? {};
    rows.push({
      rank: you.rank ? String(you.rank) : '—',
      name: 'You',
      score: you.played ? you.score : NOT_PLAYED,
      you: true,
    });
  }
  return {
    title: board?.title ?? 'Ghana this week',
    rows,
    notice: board?.hidden ? board.notice : null,
  };
};

/** SL-M4 copy from the live challenge (same keys as SKILLS_LAB_WEEKLY). `{unit}` stays a token (XP / pts). */
export const weeklyDialogCopy = (w) => ({
  ...SKILLS_LAB_WEEKLY,
  id: w.id,
  title: w.title,
  chips: [
    `${w.questionCount} questions`,
    `${Math.round(w.secondsPerQuestion / 60)} min per question`,
    'Ends Sunday 11:59 pm',
    `+${w.xp} {unit}`,
  ],
  body: w.body,
  board: {
    ...boardView(w.board),
    playing: `${Number(w.playing || 0).toLocaleString('en-GB')} playing`,
  },
});
