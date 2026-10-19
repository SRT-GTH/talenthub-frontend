/*
 * My Assessment overview (MA-01 / MA-01b) and personality detail (MA-02) from live data. The talent-home builder
 * (talentHomeLive.buildAssessmentContent, already used by Home → My Assessment) does the interpretation; this file only
 * reshapes it into GubliAS's ASSESSMENT_OVERVIEW / PERSONALITY_DETAIL shapes (assessmentData.js) so the cards render
 * unchanged. Steps follow the 2026-10-19 scope: Personality · Skills added · Skills Lab · Assessments (the six
 * server-scored tests in the library), not the per-skill TypeScript mock.
 */
import { buildAssessmentContent } from '../talentHome/talentHomeLive.js';
import { LIVE_TYPES, SLUG_BY_TYPE, summaryOf } from './liveAssessments.js';
import { ASSESSMENT_OVERVIEW, FIRST_VISIT, PERSONALITY_DETAIL } from './assessmentData.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const APTITUDE = ['numerical_reasoning', 'logical_reasoning', 'situational_judgement'];
const LIBRARY = '/my-assessment/library';
const fullPath = (type) => `/my-assessment/full/${SLUG_BY_TYPE[type]}`;

const latestByType = (results) => {
  const out = {};
  (results || []).forEach((r) => {
    const at = (x) => new Date(x.completedAt || x.createdAt).getTime() || 0;
    if (!out[r.assessmentType] || at(r) > at(out[r.assessmentType])) out[r.assessmentType] = r;
  });
  return out;
};

/** Overview data (ASSESSMENT_OVERVIEW shape) + `first` (nothing done yet → MA-01b). */
export const buildLiveOverview = (live, assessment) => {
  const c = buildAssessmentContent({ ...live, assessment });
  const latest = latestByType(assessment.results);
  const personalityDone = Boolean(latest.big_five || latest.riasec || latest.mbti);
  const skillsCount = c.skillsEvidence.skills.length + (c.skillsEvidence.more ? parseInt(c.skillsEvidence.more, 10) || 0 : 0);
  const verified = (c.skillsEvidence.skills || []).filter((s) => s.evidence !== 'self').length;
  const gamesCount = (assessment.games || []).length;
  const aptitudeDone = APTITUDE.filter((t) => latest[t]).length;

  const steps = [
    {
      id: 'personality',
      icon: 'compass',
      title: 'Personality',
      sub: personalityDone
        ? [c.personality?.type?.replace(/\.$/, ''), shortDate((latest.big_five || latest.riasec || latest.mbti)?.completedAt)]
            .filter(Boolean)
            .join(' · ')
        : 'Big Five, type and career interests',
      status: personalityDone ? 'done' : 'not-started',
      statusLabel: personalityDone ? undefined : 'Not started',
      cta: personalityDone ? undefined : 'Start',
      to: personalityDone ? 'personality' : fullPath('big_five'),
    },
    {
      id: 'skills-added',
      icon: 'list',
      title: 'Skills added',
      sub: skillsCount ? `${skillsCount} skill${skillsCount === 1 ? '' : 's'} on your card` : 'No skills yet',
      status: skillsCount ? 'done' : 'not-started',
      statusLabel: skillsCount ? undefined : 'Not started',
      cta: skillsCount ? undefined : 'Add skills',
      to: 'skills',
    },
    {
      id: 'labs',
      icon: 'check',
      title: 'Skills Lab and games',
      sub: gamesCount ? `${gamesCount} played · ${verified} skill${verified === 1 ? '' : 's'} proven` : 'Prove a skill in a short game',
      status: gamesCount ? 'done' : 'not-started',
      statusLabel: gamesCount ? undefined : 'Not started',
      cta: gamesCount ? undefined : 'Open Skills Lab',
      to: 'skillsLab',
    },
    {
      id: 'full',
      icon: 'clipboard',
      title: 'Aptitude assessments',
      sub: `${aptitudeDone} of ${APTITUDE.length} done · numerical, logical, judgement`,
      status: aptitudeDone === APTITUDE.length ? 'done' : 'not-started',
      statusLabel: aptitudeDone ? `${aptitudeDone} of ${APTITUDE.length}` : 'Not started',
      cta: aptitudeDone === APTITUDE.length ? undefined : aptitudeDone ? 'Continue' : 'Start',
      to: LIBRARY,
    },
  ];
  const done = steps.filter((s) => s.status === 'done').length;

  const personality = c.personality
    ? {
        ...ASSESSMENT_OVERVIEW.personality,
        lead: c.personality.lead,
        type: c.personality.type,
        meta: c.personality.sub,
        blurb: c.personality.body || '',
        affinityLabel: c.personality.affinityLabel,
        affinity: c.personality.affinity,
        traits: (c.personality.traits || []).map((t) => ({
          id: slugify(t.name),
          name: t.name,
          label: t.label,
          value: Math.round(t.pct),
          // GubliAS draws overview bars at half scale (Figma, kept as drawn): fill = value / 2.
          fill: Math.round(t.pct) / 2,
          tone: t.strong ? 'green' : 'muted',
        })),
        note: c.personality.lock,
      }
    : null;

  const nextType = !latest.big_five ? 'big_five' : !latest.riasec ? 'riasec' : APTITUDE.find((t) => !latest[t]) || (!latest.mbti ? 'mbti' : null);
  const nextMeta = nextType ? LIVE_TYPES[SLUG_BY_TYPE[nextType]] : null;
  const next = nextMeta
    ? {
        skillId: SLUG_BY_TYPE[nextType],
        title: `Take the ${nextMeta.name} assessment`,
        meta: nextMeta.kind === 'aptitude' ? 'About 12 minutes · timed' : 'About 10 minutes · no right answers',
        body: nextMeta.lede,
        cta: 'Start',
        sticker: nextType === 'big_five' ? 'BIGGEST BOOST' : 'NEXT UP',
      }
    : null;

  const history = Object.values(latest)
    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
    .slice(0, 6)
    .map((r) => {
      const slug = SLUG_BY_TYPE[r.assessmentType];
      const meta = LIVE_TYPES[slug];
      return meta
        ? {
            id: r.id || r._id || r.assessmentType,
            date: shortDate(r.completedAt || r.createdAt),
            title: meta.name,
            sub: summaryOf(meta, r),
            chip: { kind: 'tag', label: meta.kind === 'personality' ? 'Personality' : 'Aptitude' },
            to: meta.kind === 'personality' ? 'personality' : LIBRARY,
          }
        : null;
    })
    .filter(Boolean);

  return {
    first: done === 0,
    overview: {
      ...ASSESSMENT_OVERVIEW,
      summary: {
        done,
        total: 4,
        sticker: `${done} of 4 done`,
        numberCaption: 'OF 4 DONE',
        headline: c.summary.title,
        body: c.summary.body,
        percent: done * 25,
      },
      steps,
      personality,
      skillsEvidence: {
        ...ASSESSMENT_OVERVIEW.skillsEvidence,
        chip: c.skillsEvidence.count,
        sub: c.skillsEvidence.intro,
        skills: (c.skillsEvidence.skills || []).map((s) => ({
          id: null,
          to: '/profile',
          name: s.name,
          level: s.level,
          kind: s.evidence,
        })),
        more: c.skillsEvidence.more,
      },
      next,
      skillsLab: {
        ...ASSESSMENT_OVERVIEW.skillsLab,
        games: (c.lab.games || []).map((g, i) => ({ id: `g${i}`, ...g })),
        empty: c.lab.empty,
      },
      history: {
        ...ASSESSMENT_OVERVIEW.history,
        rows: history,
      },
    },
    firstVisit: {
      ...FIRST_VISIT,
      steps: FIRST_VISIT.steps.map((s) =>
        s.id === 'personality' ? { ...s, to: fullPath('big_five') } : s.id === 'full' ? { ...s, to: LIBRARY } : s
      ),
    },
  };
};

/* One line per Big Five trait (⚠️ ASSUMPTION copy; high / low reading of the percentile). */
const TRAIT_TEXT = {
  Openness: ['Curious about new ideas and comfortable with change.', 'You prefer the familiar and proven ways of doing things.'],
  Conscientiousness: ['Organised and follows through. You finish what you start.', 'Flexible and spontaneous; structure is not your default.'],
  Extraversion: ['You get energy from people and like to think out loud.', 'You recharge alone and prefer small groups.'],
  Agreeableness: ['Cooperative and easy to work with.', 'Direct; you push back when it matters.'],
  'Emotional stability': ['Calm under pressure, especially near deadlines.', 'You feel pressure strongly; clear plans help you.'],
};
const levelOf = (p) => (p >= 75 ? 'Strong' : p >= 60 ? 'Above average' : p >= 40 ? 'Balanced' : 'Lower');
const toneOf = (p) => (p >= 60 ? 'green' : p >= 40 ? 'amber' : 'grey');

/** Personality detail (MA-02 shape: PERSONALITY_DETAIL) from the latest Big Five / RIASEC / MBTI. */
export const buildLivePersonalityDetail = (live, assessment) => {
  const c = buildAssessmentContent({ ...live, assessment });
  const latest = latestByType(assessment.results);
  if (!c.personality) return null;
  const p = c.personality;
  const bf = latest.big_five;
  const rs = latest.riasec;
  const code = rs?.riasecScores?.code || rs?.interpretation?.code || null;
  const when = shortDate((bf || rs)?.completedAt || (bf || rs)?.createdAt);
  const sources = [bf && 'Big Five', rs && 'career interests', latest.mbti && 'personality type'].filter(Boolean);
  const items = (p.traits || []).map((t) => {
    const v = Math.round(t.pct);
    const name = t.name === 'Stability' ? 'Emotional stability' : t.name;
    const text = TRAIT_TEXT[name] || ['', ''];
    return {
      id: slugify(name),
      name,
      percentile: v,
      percentileLabel: t.label,
      text: v >= 50 ? text[0] : text[1],
      level: levelOf(v),
      tone: toneOf(v),
    };
  });
  return {
    ...PERSONALITY_DETAIL,
    subtitle: `Measured${when ? ` on ${when}` : ''} from your ${sources.join(', ') || 'assessment'} answers. Recruiters see your summary and trait scores, never your answers.`,
    retake: { label: bf ? 'Retake Big Five' : 'Take Big Five', to: '/my-assessment/full/big-five' },
    archetype: {
      ...PERSONALITY_DETAIL.archetype,
      eyebrow: code ? `CAREER INTERESTS · ${code}` : 'YOUR PROFILE',
      lead: p.lead,
      name: p.type,
      summary: p.body || p.sub,
      affinityLabel: p.affinityLabel,
      affinity: p.affinity?.length ? p.affinity : ['—'],
    },
    measured: {
      title: 'How it was measured',
      rows: [
        bf && { icon: 'list-bullet', text: `Big Five questionnaire · ${shortDate(bf.completedAt || bf.createdAt)}` },
        rs && { icon: 'list-bullet', text: `Career interests (RIASEC)${code ? ` · ${code}` : ''} · ${shortDate(rs.completedAt || rs.createdAt)}` },
        latest.mbti && { icon: 'list-bullet', text: `Personality type · ${latest.mbti.mbtiType}` },
        { icon: 'refresh', text: 'Retake any time; the latest result shows' },
      ].filter(Boolean),
      link: latest.mbti
        ? { label: 'Retake career interests', to: '/my-assessment/full/riasec' }
        : { label: 'Add your personality type (MBTI)', to: '/my-assessment/full/mbti' },
    },
    traits: items.length
      ? {
          title: `Your ${items.length === 5 ? 'five' : items.length} traits`,
          chip: 'Percentiles from your answers',
          items,
        }
      : { title: 'Your traits', chip: 'Take the Big Five to see them', items: [] },
    bestWork: null, // no data behind it yet (Figma copy was illustrative)
    recruiters: {
      ...PERSONALITY_DETAIL.recruiters,
      rows: [
        { label: 'Profile summary', chip: p.type.replace(/\.$/, ''), tone: 'soft', icon: 'eye' },
        { label: 'Trait scores', chip: 'Percentiles only', tone: 'soft', icon: 'eye' },
        { label: 'Your answers', chip: 'Never shared', tone: 'neutral', icon: 'lock' },
      ],
      note: 'Results are system-generated and cannot be edited. Retake any time; the latest result shows.',
    },
  };
};
