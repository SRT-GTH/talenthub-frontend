/*
 * /my-assessment/skills/:skillId from live data (MA-03 / MA-03b shapes, see SKILL_EVIDENCE in assessmentData.js).
 *
 * Sources (all already loaded by useAssessmentHome): the profile's technical + soft skills, the talent's skill
 * verifications (GET /engagement/skills/verifications/me) and Skills Lab game sessions (GET /engagement/games/sessions/me).
 * The skill id is the slug of the skill's name. Topic breakdowns are only drawn for the mock (no per-topic data).
 */
import { slugify } from './liveOverview.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
const titleCase = (s) => String(s || '').replace(/\b\w/g, (c) => c.toUpperCase());

const BUDDY = '/profile/filling/career-buddy';
const LAB = '/skills-lab';
const RUNGS = ['self', 'ai', 'game', 'assessment'];
const LABEL = {
  self: 'Self-reported',
  ai: 'AI-validated',
  game: 'Game-evidenced',
  assessment: 'Assessment-evidenced',
};
const BADGE_TONE = { self: 'pending', ai: 'outline', game: 'soft', assessment: 'strong' };

/** Same rules as talentHomeLive's evidenceOf, so the overview and the detail agree. */
export const evidenceOf = (v) => {
  if (!v) return 'self';
  const type = String(v.evidenceType || '').toLowerCase();
  const status = String(v.validationStatus || '').toLowerCase();
  if (type.includes('game') || v.gameSessionId) return 'game';
  if (type.includes('assessment') || type.includes('certificate')) return 'assessment';
  if (status.includes('conversation') || type.includes('conversation')) return 'ai';
  if (status === 'verified') return 'assessment';
  return 'self';
};

const skillNames = (assessment) => {
  const out = [];
  const seen = new Set();
  for (const s of [...(assessment?.technicalSkills || []), ...(assessment?.softSkills || [])]) {
    const name = typeof s === 'string' ? s : s?.name;
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    out.push(name);
  }
  return out;
};

const gameMentions = (g, name) => {
  const key = name.toLowerCase();
  const fields = [g.skillKey, g.skill, ...(Array.isArray(g.skills) ? g.skills : [])]
    .map((x) => String((x && (x.name || x)) || '').toLowerCase())
    .filter(Boolean);
  return fields.some((f) => f === key || f === slugify(name));
};

/** The SkillEvidence data for one of the talent's skills, or null when the slug is not one of them. */
export const buildLiveSkillEvidence = (skillId, assessment) => {
  const names = skillNames(assessment);
  const name = names.find((n) => slugify(n) === skillId);
  if (!name) return null;
  const v = (assessment.verifications || []).find(
    (x) => String(x.skillKey || '').toLowerCase() === name.toLowerCase()
  );
  const evidence = evidenceOf(v);
  const at = RUNGS.indexOf(evidence);
  const level = v?.claimedLevel ? titleCase(v.claimedLevel) : '';
  const provenOn =
    v && evidence !== 'self' ? shortDate(v.verifiedAt || v.updatedAt || v.createdAt) : '';
  const games = (assessment.games || []).filter((g) => gameMentions(g, name));

  const rungSub = {
    self: 'Added by you',
    ai:
      at >= 1 && evidence === 'ai' && provenOn
        ? `Checked by Career Buddy · ${provenOn}`
        : 'Chat with Buddy · ~5 min',
    game:
      evidence === 'game' && provenOn ? `Skills Lab · ${provenOn}` : 'Skills Lab or game · ~6 min',
    assessment:
      evidence === 'assessment' && provenOn
        ? `Verified · ${provenOn}`
        : 'Assessment or certificate',
  };
  const rungs = RUNGS.map((id, i) => ({
    id,
    icon: { self: 'edit', ai: 'chat', game: 'check-circle', assessment: 'shield' }[id],
    title: id === 'ai' ? 'AI-validated in chat' : LABEL[id],
    // A step below the current one is covered by the stronger proof, not something left to do.
    sub: i < at && id !== 'self' ? 'Covered by a stronger proof' : rungSub[id],
    state: i < at ? 'done' : i === at ? 'current' : 'next',
    chip: i < at ? 'Done' : i === at ? 'You are here' : i === at + 1 ? 'Next' : 'Later',
  }));

  const rows = [];
  if (v && evidence !== 'self') {
    rows.push({
      id: `verification-${v._id || v.id || 'x'}`,
      date: provenOn,
      title:
        evidence === 'ai'
          ? 'Chat with Career Buddy'
          : { game: 'Skills Lab game', test: 'Skills test', certificate: 'Certificate' }[
              String(v.evidenceType || '').toLowerCase()
            ] || LABEL[evidence],
      sub: level ? `${level} level` : 'Proven',
      chip: { label: LABEL[evidence], tone: evidence === 'ai' ? 'outline' : 'dark' },
      to: null,
    });
  }
  games.forEach((g, i) => {
    const score = Math.round(g.score ?? g.normalizedScore ?? g.result?.score ?? 0);
    rows.push({
      id: `game-${g._id || g.id || i}`,
      date: shortDate(g.completedAt || g.createdAt),
      title: g.gameName || g.title || g.gameKey || 'Skills Lab game',
      sub: Number.isFinite(score) && score > 0 ? `${score} / 100` : 'Played',
      chip: { label: 'Played', tone: 'soft' },
      to: LAB,
    });
  });

  const proven = evidence !== 'self';
  return {
    id: skillId,
    back: { label: 'My Assessment · Skills evidence', to: '/my-assessment' },
    title: name,
    badge: {
      label: LABEL[evidence],
      tone: BADGE_TONE[evidence],
      icon: proven ? 'check-circle-fill' : null,
    },
    subtitle: [
      level,
      proven
        ? `${LABEL[evidence]}${provenOn ? ` on ${provenOn}` : ''}.`
        : 'Added by you. Not proven yet.',
    ]
      .filter(Boolean)
      .join(' · '),
    cta:
      evidence === 'self'
        ? { label: 'Validate with Career Buddy', to: BUDDY }
        : { label: 'Prove it in Skills Lab', to: LAB },
    ladder: {
      title: `How strong is your ${name} evidence?`,
      step: `Step ${at + 1} of 4`,
      rungs,
      tip:
        evidence === 'self'
          ? `A 5-minute chat with Career Buddy moves ${name} up one step. Recruiters trust proven skills more.`
          : 'Assessment-evidenced skills appear first in recruiter search.',
      tipStyle: evidence === 'self' ? 'strong' : 'muted',
    },
    attempts: {
      title: 'Every attempt',
      note: 'Only your best result shows to recruiters. Failed attempts never appear on your card.',
      rows,
      empty: rows.length
        ? null
        : {
            title: 'No attempts yet',
            body: `Prove ${name} in the way that suits you.`,
            secondary: { label: 'Chat with Buddy', to: BUDDY },
            primary: { label: 'Open Skills Lab', to: LAB },
          },
    },
    topics: null,
    recruiterPreview: {
      title: `How recruiters see ${name}`,
      skill: [name, level].filter(Boolean).join(' · '),
      line: proven
        ? `${LABEL[evidence]}${provenOn ? ` · ${provenOn}` : ''}`
        : 'Added by you · not proven',
      chip: { label: LABEL[evidence], tone: proven ? 'strong' : 'review' },
    },
    practice: {
      title: proven ? 'Keep it sharp' : 'Start proving it',
      gap: 12,
      rows: [
        {
          id: 'learn',
          icon: 'book',
          title: `Learn more ${name}`,
          sub: 'My Learning · free',
          to: '/learning',
        },
        proven
          ? {
              id: 'lab',
              icon: 'function',
              title: 'Play a Skills Lab game',
              sub: 'Skills Lab · ~6 min',
              to: LAB,
            }
          : {
              id: 'buddy',
              icon: 'function',
              title: 'Ask Buddy to validate it',
              sub: 'Chat · ~5 min',
              to: BUDDY,
            },
      ],
    },
    otherSkills: {
      title: 'Other skills',
      skills: names
        .filter((n) => n !== name)
        .slice(0, 6)
        .map((n) => ({ id: slugify(n), label: n })),
    },
  };
};
