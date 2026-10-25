import { LAB_DETAILS, buildFallbackDetail } from './skillsLabData.js';

/*
 * The lab details page (/skills-lab/lab/:labId) for the signed-in talent: the lab's copy (LAB_DETAILS, or the generic
 * fallback) with everything about THIS talent replaced by live data — sticker, "Your attempts", the start card
 * (resume | ready) and the recruiter line. `card` = the lab from GET /skills-lab/labs, `attempts` = GET /skills-lab/attempts.
 */
const RESULT_TEXT = {
  verified: 'Verified',
  perfect: 'Verified · perfect',
  not_yet: 'Not yet · practice run',
};

export const liveLabDetail = (labId, card, attempts) => {
  if (!card) return null;
  const base = LAB_DETAILS[labId] ?? buildFallbackDetail(card);
  const verified = card.status === 'verified' || card.status === 'cooldown';
  const p = card.progress;
  const rows = (attempts ?? [])
    .filter((a) => a.labId === labId)
    .map((a) => ({
      date: a.date,
      result:
        a.result === 'in_progress'
          ? `In progress · challenge ${p?.answered ?? 1}`
          : (RESULT_TEXT[a.result] ?? a.result),
      score: a.score.replace(' / ', ' of '),
      status: a.result === 'in_progress' ? 'Resume' : a.onProfile ? 'Shown' : 'Private',
    }));
  const start =
    card.status === 'in_progress' && p
      ? {
          kind: 'resume',
          eyebrow: 'PICK UP WHERE YOU LEFT OFF',
          title: `Challenge ${p.answered} of ${p.total}`,
          body:
            p.correct >= p.needed
              ? `${p.correct} correct so far. Finish to get ${card.title} Verified.`
              : `${p.correct} correct so far. ${p.needed - p.correct} more and ${card.title} is Verified.`,
          primary: 'Resume lab',
          secondary: 'Start over',
        }
      : {
          kind: 'ready',
          eyebrow: verified ? 'VERIFIED · RETAKE ANY TIME' : 'READY WHEN YOU ARE',
          title: `About ${card.minutes} minutes`,
          body: verified
            ? 'Your best score counts. A retake never lowers it.'
            : 'You can pause any time. Progress saves after every answer.',
          primary: verified ? 'Retake lab' : 'Start lab',
          secondary: null,
        };
  return {
    ...base,
    sticker: verified
      ? `Verified · ${card.score}`
      : card.status === 'in_progress'
        ? 'In progress'
        : 'Ready to verify',
    attempts: rows,
    attemptsEmpty: 'No attempts yet. Your first try is private, pass or not.',
    start,
    recruiters: {
      ...base.recruiters,
      line: verified
        ? `Verified in Skills Lab · ${card.score.replace('/', ' of ')}`
        : `Verified in Skills Lab · ${card.count} of ${card.count}`,
    },
  };
};
