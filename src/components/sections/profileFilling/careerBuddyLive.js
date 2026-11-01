/*
 * Career Buddy live mode - pure mapping helpers (no React).
 *
 * The agent returns a reply as typed blocks (agent prose-blocks.ts):
 *   { type: 'text', text } | { type: 'list', items } | { type: 'facts', items }
 * plus optional extras:
 *   card         { section, title, kind: 'single'|'entry', fields: [{key, label, value}] }
 *                a pending confirm - reviewed in the Talent Profile Panel
 *                (Figma 5132:46916 Modify / Confirm), not as chat bullets
 *   sectionState { section, state: 'in-progress'|'awaiting-review'|'saved' }
 *   report       { assessmentType, title, summary, code?, bars: [{label, value}] }
 *   opportunities [{ opportunityId, title, company, logo, type, workMode, city, salary, deadline, matchScore,
 *                  keySkills: {have, total}, skills: [{name, have}], matchReason }]
 *                the talent's matched postings, drawn as the Figma match cards (opportunityMatchView below)
 *   careerPosts  [{ id, title, type: 'article'|'video'|'qa', authorName, community, communityUrl, career, why }]
 *                GTH posts about a career (career exposure), drawn as post cards (careerPostView below)
 *   courses      [{ courseId, title, provider, source: 'microsoft_learn'|'curated_youtube'|'curated'|'gth_native',
 *                  free, durationMinutes, level, skills: [string], career, status: 'not_started'|'started'|'done',
 *                  needsGuardianConsent, url: '/learning?view=course&course=<courseId>' }]
 *                recommended GTH courses for the talent's skill gaps (learning guidance), drawn as course cards
 *                (courseCardView below, learningGuidance/CourseRecommendationCards.jsx); the text blocks no
 *                longer list them
 *   searchResults [{ type, id, title, snippet, facts, link, ask, why, score, subtype?, logo? }]
 *                Career Buddy search (backend gthSearch.query), drawn by search/SearchResultCards.jsx
 *
 * ChatThread renders a bubble as `text`, then `bullets`, then `followUp`, so
 * blocks are packed into as few bubbles as that shape allows.
 */
import {
  readEducationEntry,
  classYearLabel,
  overallResultLabel,
} from '../../../utils/education.js';

let seq = 0;
const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(seq += 1)}`;

const newBubble = () => ({
  id: nextId('cb'),
  sender: 'bot',
  personaLabel: 'Career Buddy',
  text: '',
  bullets: [],
  followUp: '',
});

const tidy = (b) => {
  const out = { ...b };
  if (!out.bullets.length) delete out.bullets;
  if (!out.followUp) delete out.followUp;
  return out;
};

const firstLine = (text) =>
  String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .find(Boolean) || '';

// ---- opportunity match cards (Figma 9053:80615 / 9222:118005) ----
const JOB_TYPE_LABEL = {
  internship: 'Internship',
  'full-time-job': 'Full-time',
  'training-program': 'Training',
  'government-program': 'Government programme',
  'international-opportunity': 'International',
};
const WORK_MODE_LABEL = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' };
const PAY_PERIOD = {
  monthly: '/ mo',
  yearly: '/ yr',
  hourly: '/ hr',
  'project-based': 'per project',
};
const DAY_MS = 24 * 60 * 60 * 1000;

const titleCase = (s) =>
  String(s || '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());

/** "Closes 04 Nov" / "Closes today" / "Closes tomorrow"; '' when unknown or past. */
export function closesLabel(deadline, now = new Date()) {
  const d = deadline ? new Date(deadline) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(d) - startOf(now)) / DAY_MS);
  if (days < 0) return '';
  if (days === 0) return 'Closes today';
  if (days === 1) return 'Closes tomorrow';
  return `Closes ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
}

/** "GHS 2,500–3,500 / mo"; '' when the posting gives no pay. */
export function payLabel(salary) {
  if (!salary) return '';
  const n = (v) => (typeof v === 'number' && Number.isFinite(v) ? v.toLocaleString('en-US') : null);
  const min = n(salary.min);
  const max = n(salary.max);
  const cur = salary.currency || 'GHS';
  const period = PAY_PERIOD[salary.type] ? ` ${PAY_PERIOD[salary.type]}` : '';
  if (min && max && min !== max) return `${cur} ${min}–${max}${period}`;
  if (min || max) return `${cur} ${max || min}${period}`;
  return salary.negotiable ? 'Pay negotiable' : '';
}

/** Agent OpportunityCard -> the props OpportunityMatchCard draws. */
export function opportunityMatchView(card, now = new Date()) {
  const mode = WORK_MODE_LABEL[card?.workMode] || (card?.workMode ? titleCase(card.workMode) : '');
  const place = [card?.city, mode].filter(Boolean).join(' · ');
  const type = JOB_TYPE_LABEL[card?.type] || (card?.type ? titleCase(card.type) : '');
  const facts = [place, type, payLabel(card?.salary)].filter(Boolean);
  const score = Math.max(0, Math.min(100, Math.round(Number(card?.matchScore) || 0)));
  const ks = card?.keySkills;
  return {
    id: card.opportunityId,
    opportunityId: card.opportunityId,
    company: card.company || '',
    logo: card.logo || null,
    title: card.title,
    closes: closesLabel(card.deadline, now),
    facts,
    placeFirst: Boolean(place),
    match: score,
    meter: score / 100,
    // Same count as the job page's "Skills N of M": every skill the posting lists.
    keySkills: ks?.total ? `${ks.have} of ${ks.total} skills` : '',
    skills: Array.isArray(card.skills) ? card.skills.filter((s) => s?.name) : [],
    detailPath: `/job-postings?job=${encodeURIComponent(card.opportunityId)}`,
  };
}

const POST_TYPE = {
  article: { tag: 'Article', open: 'Read article' },
  video: { tag: 'Video', open: 'Watch video' },
  qa: { tag: 'Q&A', open: 'See the question' },
};

/** Agent CareerPostCard -> the props CareerPostCard draws (2026-10-27, career exposure as cards). */
export function careerPostView(card) {
  const kind = POST_TYPE[card?.type] || POST_TYPE.article;
  return {
    id: card.id,
    title: card.title,
    type: POST_TYPE[card?.type] ? card.type : 'article',
    tag: card.community ? `${kind.tag} · ${card.community}` : `${kind.tag} · GTH feed`,
    openLabel: kind.open,
    facts: [
      `by ${card.authorName || 'a GTH member'}`,
      card.career ? `About ${card.career}` : null,
    ].filter(Boolean),
    why: [
      card.why,
      card.community
        ? `Posted in ${card.community}, a community you're in.`
        : 'Shared publicly on the GTH feed.',
    ]
      .filter(Boolean)
      .join(' '),
    detailPath: `/career-content/${encodeURIComponent(card.id)}`,
  };
}

const COURSE_SOURCE = {
  microsoft_learn: { tag: 'Course', provider: 'Microsoft Learn' },
  curated_youtube: { tag: 'Video course', provider: 'YouTube', video: true },
  curated: { tag: 'Course', provider: null },
  gth_native: { tag: 'Course', provider: 'GTH' },
};
const COURSE_STATUS = { done: 'Done', started: 'Started' };

/** "45 min" / "about 1 h" / "about 2.5 h"; '' when unknown. */
export function courseDurationLabel(minutes) {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) return '';
  if (m < 60) return `${Math.max(1, Math.round(m))} min`;
  const h = Math.round((m / 60) * 2) / 2;
  return `about ${h} h`;
}

const joinList = (items) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** Agent CourseCard -> the props CourseRecommendationCard draws (2026-10-31, learning guidance as cards). */
export function courseCardView(card) {
  const source = COURSE_SOURCE[card?.source] || null;
  const isVideo = Boolean(source?.video) || /youtube/i.test(String(card?.provider || ''));
  const kind = isVideo ? 'Video course' : source?.tag || 'Course';
  // "CrashCourse (YouTube)" -> tag "Video course · YouTube", fact "by CrashCourse".
  const rawProvider = String(card?.provider || '').trim();
  const channel = isVideo ? rawProvider.replace(/\s*\(youtube\)\s*$/i, '').trim() : '';
  const provider = isVideo ? 'YouTube' : rawProvider || source?.provider || '';
  const skills = Array.isArray(card?.skills) ? card.skills.filter(Boolean).map(String) : [];
  const status = COURSE_STATUS[card?.status] ? card.status : 'not_started';
  const why = skills.length
    ? `Builds ${joinList(skills)}${card?.career ? ` for ${card.career}` : ''}.`
    : card?.career
      ? `Helps you get ready for ${card.career}.`
      : '';
  const url = typeof card?.url === 'string' && card.url.startsWith('/') ? card.url : '';
  return {
    id: card.courseId,
    courseId: card.courseId,
    title: card.title,
    isVideo,
    tag: provider ? `${kind} · ${provider}` : kind,
    facts: [
      card?.free ? 'Free' : null,
      courseDurationLabel(card?.durationMinutes) || null,
      card?.level ? titleCase(card.level) : null,
      channel && channel.toLowerCase() !== 'youtube' ? `by ${channel}` : null,
    ].filter(Boolean),
    why,
    status,
    // 2026-11-01: 'related' courses (a broader skill only) are drawn as a secondary row.
    match: card?.match === 'related' ? 'related' : 'close',
    statusLabel: COURSE_STATUS[status] || '',
    openLabel:
      status === 'done'
        ? 'Review course'
        : status === 'started'
          ? 'Continue course'
          : isVideo
            ? 'Watch course'
            : 'Open course',
    guardianNote: card?.needsGuardianConsent
      ? "You'll need a parent or guardian's OK before you start this one."
      : '',
    detailPath: url || `/learning?view=course&course=${encodeURIComponent(card.courseId)}`,
  };
}

/** "Why this match?" on card i: the auto bubble text plus the chip action that asks the agent for that posting. */
export function whyThisMatchAction(card, index) {
  const label = `Card ${index + 1} - Why this match?`;
  return {
    label,
    chipAction: {
      label,
      intent: 'opportunity_detail',
      slots: [
        { name: 'opportunityId', value: String(card.opportunityId) },
        { name: 'title', value: String(card.title || '') },
        { name: 'focus', value: 'why' },
      ],
    },
  };
}

/**
 * The thread's chips after a turn. When the turn drew match cards, the per-posting chips (one per listed role) would
 * repeat the cards - the cards' own buttons cover them - so only the forward chips (readiness, learning path) stay.
 */
export function cardChips(turn) {
  const chips = turn?.chips || [];
  const chipActions = turn?.chipActions || [];
  if (!turn?.opportunities?.length) return { chips, chipActions };
  const titles = new Set(turn.opportunities.map((o) => o.title));
  const keep = (label) => {
    const action = chipActionFor(label, chipActions);
    return !(action?.intent === 'opportunity_detail' || titles.has(label));
  };
  return {
    chips: chips.filter(keep),
    chipActions: chipActions.filter((a) => keep(a.label)),
  };
}

/** Agent turn -> plain-data bot bubbles (serializable; no React nodes). */
export function turnToBubbles(turn) {
  const meta = {
    routedTo: turn?.routedTo ?? null,
    routeReason: turn?.routeReason ?? null,
    intent: turn?.classification?.intent ?? null,
    section: turn?.classification?.section ?? null,
  };
  let blocks = Array.isArray(turn?.blocks) && turn.blocks.length ? turn.blocks : null;
  // 2026-10-21: an interview review card carries the scores, feedback and "stronger way to say it" itself; the text
  // report the agent also sends would repeat them (with raw "[experience]" placeholders). Keep its first line only.
  if (turn?.practiceReview?.items?.length) {
    const lead = firstLine(turn?.reply) || firstLine(blocks?.[0]?.text ?? blocks?.[0]?.items?.[0]);
    blocks = [{ type: 'text', text: lead }];
  }
  // 2026-10-25: matched postings are drawn as cards; the numbered list of the same postings would repeat them.
  const opportunities = Array.isArray(turn?.opportunities)
    ? turn.opportunities.filter((o) => o?.opportunityId && o?.title)
    : [];
  // The lead line stays above the cards; any other prose (career tracks that fit) goes under them.
  let afterCards = '';
  if (opportunities.length) {
    const texts = blocks
      ? blocks
          .flatMap((b) =>
            b.type === 'text' ? [b.text] : b.type === 'facts' ? (b.items || []).map(String) : []
          )
          .filter(Boolean)
      : String(turn?.reply ?? '')
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l && !/^\d+[.)]\s/.test(l));
    blocks = [{ type: 'text', text: texts[0] || '' }];
    afterCards = texts.slice(1).join('\n');
  }
  const bubbles = [];
  let cur = null;
  const open = () => {
    cur = newBubble();
    bubbles.push(cur);
    return cur;
  };
  if (!blocks) {
    open();
    cur.text = String(turn?.reply ?? '');
  } else {
    for (const block of blocks) {
      if (block.type === 'text') {
        if (!cur) open();
        if (!cur.bullets.length) cur.text = cur.text ? `${cur.text}\n${block.text}` : block.text;
        else if (!cur.followUp) cur.followUp = block.text;
        else {
          open();
          cur.text = block.text;
        }
      } else if (block.type === 'list' || block.type === 'facts') {
        if (!cur || cur.followUp) open();
        cur.bullets.push(...(block.items || []));
      }
    }
  }
  if (!cur) open();
  if (turn?.card?.fields?.length) {
    // The values live in the profile panel (Figma) - the chat points there.
    cur.reviewSection = turn.card.section;
    cur.followUp =
      cur.followUp ||
      'Check the details in your profile panel, then tap Confirm - or Modify to change something.';
  }
  if (turn?.report) cur.report = turn.report;
  // 2026-10-17 (practice interview Phase B): the review card.
  if (turn?.practiceReview?.items?.length) cur.practiceReview = turn.practiceReview;
  if (opportunities.length) {
    cur.opportunities = opportunities;
    if (afterCards) cur.afterCards = afterCards;
  }
  const careerPosts = Array.isArray(turn?.careerPosts)
    ? turn.careerPosts.filter((p) => p?.id && p?.title)
    : [];
  if (careerPosts.length) cur.careerPosts = careerPosts;
  // 2026-10-31: recommended courses as cards (learning guidance).
  const courses = Array.isArray(turn?.courses)
    ? turn.courses.filter((c) => c?.courseId && c?.title)
    : [];
  if (courses.length) cur.courses = courses;
  const searchResults = Array.isArray(turn?.searchResults)
    ? turn.searchResults.filter((r) => r?.id && r?.title && r?.type)
    : [];
  if (searchResults.length) cur.searchResults = searchResults;
  const last = bubbles[bubbles.length - 1];
  last.meta = meta;
  last.showActions = true;
  return bubbles.map(tidy);
}

export const userBubble = (text) => ({ id: nextId('me'), sender: 'user', text });

/** Figma 5132:47342 auto-confirmation bubble ("[Auto] ... confirmed ✅"). */
export const autoBubble = (text) => ({ id: nextId('auto'), sender: 'user', auto: true, text });

export const fileBubble = (file) => ({
  id: nextId('file'),
  sender: 'user',
  file: { name: file.name, size: file.sizeLabel || '' },
});

export const localBotBubble = (text) => ({ ...tidy(newBubble()), text });

/**
 * Read-aloud text for the voice call: "(2/5)" -> "Question 2 of 5.",
 * no list dashes or markdown symbols.
 */
export const speakable = (text) =>
  String(text || '')
    .replace(/\((\d+)\/(\d+)\)/g, 'Question $1 of $2.')
    .replace(/^\s*[-\u2022]\s+/gm, '')
    .replace(/[*_#>]/g, '');

/** True while a practice / mock interview is waiting for an answer (its Stop chip is showing). */
export const isPracticeTurn = (turn) =>
  (turn?.chipActions || []).some((c) =>
    (c.slots || []).some((s) => s.name === 'practice_interview' && s.value === 'stop')
  );

/** The chipAction to send for a tapped label (null = send as plain text). */
export const chipActionFor = (label, chipActions = []) =>
  chipActions.find((c) => c.label === label) || null;

/* ---- sections: agent keys <-> panel stages -------------------------------- */

/**
 * Panel stage ids are the scripted screen's (Figma) ids so the shared
 * TalentProfilePanel / EngagementTopBar render identically. Agent section keys
 * (canonical and wire aliases) map onto them.
 */
export const SECTION_TO_STAGE = {
  personal_info: 'personal-info',
  education_background: 'educational-background',
  interests: 'personal-interests',
  personality: 'personality',
  psychometric: 'personality',
  skills: 'skills',
  work_experience: 'work-experience',
  project_portfolio: 'project-portfolio',
  portfolio: 'project-portfolio',
  certifications: 'certifications',
  career_goals: 'desired-career',
  career_aspirations: 'desired-career',
  professional_summary: 'talent-pitch',
  talent_pitch: 'talent-pitch',
};

export const stageForSection = (section) => (section ? (SECTION_TO_STAGE[section] ?? null) : null);

const names = (list, key = 'name') =>
  (Array.isArray(list) ? list : [])
    .map((x) => (typeof x === 'string' ? x : x?.[key]))
    .filter(Boolean);

const monthYear = (v) => {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

const range = (a, b, current) => {
  const from = monthYear(a);
  const to = current ? 'Present' : monthYear(b);
  return [from, to].filter(Boolean).join(' - ');
};

const row = (label, value) => (value ? { label, value: String(value) } : null);
const rows = (...r) => r.filter(Boolean);

const entry = (id, title, fields) => ({ id, title, fields: fields.length ? fields : undefined });

/** Saved profile data per stage (fields for single sections, entries for collections). */
export function savedStageData(p, extras = {}) {
  if (!p) return {};
  const out = {};
  const personal = rows(
    row('Name', [p.firstName, p.lastName].filter(Boolean).join(' ')),
    row('Gender', p.gender),
    row('Date of birth', p.dateOfBirth ? monthYear(p.dateOfBirth) : ''),
    row('Location', p.location?.city || p.city || p.location?.region || ''),
    row('Phone', p.phoneNumber || p.phone)
  );
  if (personal.length) out['personal-info'] = { fields: personal };

  const edu = (Array.isArray(p.education) ? p.education : []).filter(
    (e) => e?.institution && e.institution !== 'Not provided'
  );
  if (edu.length) {
    out['educational-background'] = {
      entries: edu.map((raw, i) => {
        // Education v2: read classYear/qualification/subjects with v1 fallbacks.
        const e = readEducationEntry(raw);
        return entry(
          `edu-${i}`,
          e.institution,
          rows(
            row('Level', e.levelLabel),
            row('Programme', e.fieldOfStudy),
            row('Class', e.isCurrent ? classYearLabel(e.classYear) : null),
            row('Qualification', e.qualification),
            row('Subjects', e.subjects.map((s) => (s.enjoys ? `${s.name} ★` : s.name)).join(', ')),
            row('Result', overallResultLabel(e.overallResult)),
            row(
              'Years',
              [e.startYear, e.isCurrent ? 'Present' : e.endYear].filter(Boolean).join(' - ')
            )
          )
        );
      }),
    };
  }

  const interests = names(p.interests);
  if (interests.length)
    out['personal-interests'] = { fields: rows(row('Interests', interests.join(', '))) };

  if (extras.personality?.length) out.personality = { fields: extras.personality };

  const skills = rows(
    row('Technical & trade skills', names(p.technicalSkills).join(', ')),
    row('People skills', names(p.softSkills).join(', ')),
    row('Languages', names(p.languages).join(', '))
  );
  if (skills.length) out.skills = { fields: skills };

  const work = Array.isArray(p.workExperience) ? p.workExperience : [];
  if (work.length) {
    out['work-experience'] = {
      entries: work.map((w, i) =>
        entry(
          `work-${i}`,
          [w.position, w.company].filter(Boolean).join(' at ') || `Experience ${i + 1}`,
          rows(
            row('Company', w.company),
            row('Role', w.position),
            row('Dates', range(w.startDate, w.endDate, w.isCurrent)),
            row('What you did', w.description)
          )
        )
      ),
    };
  }

  const projects = Array.isArray(p.portfolio) ? p.portfolio : [];
  if (projects.length) {
    out['project-portfolio'] = {
      entries: projects.map((x, i) =>
        entry(
          `proj-${i}`,
          x.title || `Project ${i + 1}`,
          rows(
            row('Description', x.description),
            row(
              'Skills used',
              names(x.skillsUsed).join(', ') ||
                (Array.isArray(x.skillsUsed) ? x.skillsUsed.join(', ') : '')
            ),
            row('Dates', range(x.startDate, x.endDate, false)),
            row('Link', x.url)
          )
        )
      ),
    };
  }

  const certs = Array.isArray(p.certifications) ? p.certifications : [];
  if (certs.length) {
    out.certifications = {
      entries: certs.map((c, i) =>
        entry(
          `cert-${i}`,
          c.name || `Certificate ${i + 1}`,
          rows(
            row('Issued by', c.issuingOrganization),
            row('Issued', monthYear(c.issueDate)),
            row('Expires', monthYear(c.expirationDate)),
            row('Credential ID', c.credentialID || c.credentialId)
          )
        )
      ),
    };
  }

  const careers = names(p.desiredCareers, 'careerName');
  const goals = p.careerGoals && typeof p.careerGoals === 'object' ? p.careerGoals : null;
  const careerRows = rows(
    row('Careers I want', careers.join(', ')),
    row('Short-term goal', goals?.shortTerm),
    row('Long-term goal', goals?.longTerm)
  );
  if (careerRows.length) out['desired-career'] = { fields: careerRows };

  if (p.professionalBio)
    out['talent-pitch'] = { fields: rows(row('Talent pitch', p.professionalBio)) };
  return out;
}

/**
 * Build TalentProfilePanel stages: saved data (read-only, 100%) overlaid with
 * this conversation's live state - in progress, or awaiting review with the
 * pending card's fields (Modify / Confirm).
 */
/**
 * Personality completion against the tests the backend requires
 * (2026-10-17: PERSONALITY_ASSESSMENTS). { done, total } or null when the
 * backend didn't say which tests are required.
 */
export function personalityProgress(results = [], required = null) {
  if (!Array.isArray(required) || required.length === 0) return null;
  const taken = new Set(results.map((r) => r?.assessmentType).filter(Boolean));
  return { done: required.filter((t) => taken.has(t)).length, total: required.length };
}

export function buildPanelStages(baseStages, profile, live = {}, extras = {}) {
  const saved = savedStageData(profile, extras);
  return baseStages
    .filter((s) => s.panelLabel)
    .map((s) => {
      const data = saved[s.id];
      const hasData = Boolean(data);
      const liveState = live.states?.[s.id];
      const pending = live.card && stageForSection(live.card.section) === s.id ? live.card : null;
      if (pending) {
        return {
          ...s,
          status: 'awaiting-review',
          completionPct: hasData ? 100 : 0,
          fields: pending.fields.map((f) => ({ key: f.key, label: f.label, value: f.value })),
          entries: undefined,
          readOnly: false,
        };
      }
      // Personality is complete only when every required test is taken - a
      // newly enabled test shows as in progress until the talent takes it.
      const req = s.id === 'personality' ? extras.personalityProgress : null;
      if (req && req.total > 0) {
        const pct = Math.round((req.done / req.total) * 100);
        return {
          ...s,
          status:
            liveState === 'in-progress' || (req.done > 0 && req.done < req.total)
              ? 'in-progress'
              : req.done >= req.total
                ? 'done'
                : 'not-started',
          completionPct: pct,
          fields: data?.fields,
          entries: data?.entries,
          readOnly: true,
        };
      }
      return {
        ...s,
        status: liveState === 'in-progress' ? 'in-progress' : hasData ? 'done' : 'not-started',
        completionPct: hasData ? 100 : 0,
        fields: data?.fields,
        entries: data?.entries,
        readOnly: true,
      };
    });
}

/** Fields the talent changed in the panel, keyed by agent field key. */
export function changedCardFields(card, updatedFields) {
  const before = Object.fromEntries((card?.fields || []).map((f) => [f.key, f.value]));
  const edits = {};
  for (const f of updatedFields || []) {
    if (f?.key && before[f.key] !== undefined && String(f.value) !== String(before[f.key]))
      edits[f.key] = f.value;
  }
  return edits;
}

/* ---- conversation history (per talent, this browser) ---------------------- */

const THREADS_KEY = (entityId) => `careerBuddy.threads.${entityId}`;
const MAX_THREADS = 20;

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function loadThreads(entityId) {
  try {
    const raw = storage()?.getItem(THREADS_KEY(entityId));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveThread(entityId, thread) {
  try {
    const others = loadThreads(entityId).filter((t) => t.id !== thread.id);
    const next = [{ ...thread, updatedAt: new Date().toISOString() }, ...others].slice(
      0,
      MAX_THREADS
    );
    storage()?.setItem(THREADS_KEY(entityId), JSON.stringify(next));
    return next;
  } catch {
    return loadThreads(entityId);
  }
}

export const newThread = () => ({
  id: nextId('thread'),
  title: 'New conversation',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [],
  history: [],
  chips: [],
  chipActions: [],
});

/** Thread title = the first thing the talent said (or the first section touched). */
export function threadTitle(thread) {
  const firstUser = thread.messages.find((m) => m.sender === 'user' && !m.auto && m.text);
  if (firstUser)
    return firstUser.text.length > 40 ? `${firstUser.text.slice(0, 37)}...` : firstUser.text;
  return thread.title || 'New conversation';
}

/** Group threads like Figma 5132:45345 ("Today", "Yesterday", "2 Days Ago", "15 May"). */
export function historyGroups(threads, now = new Date()) {
  const day = (d) => Math.floor(new Date(d).setHours(0, 0, 0, 0) / 86400000);
  const today = day(now);
  const groups = [];
  for (const t of threads.filter((x) => x.messages?.some((m) => m.sender === 'user' && !m.auto))) {
    const diff = today - day(t.updatedAt);
    const label =
      diff <= 0
        ? 'Today'
        : diff === 1
          ? 'Yesterday'
          : diff < 7
            ? `${diff} Days Ago`
            : new Date(t.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    let g = groups.find((x) => x.label === label);
    if (!g) groups.push((g = { label, entries: [] }));
    g.entries.push({ id: t.id, label: threadTitle(t) });
  }
  return groups;
}
/* ---- server history (agent GET /career-buddy/history) --------------------- */

/** One server session -> a thread the chat can show and continue. */
export function threadFromSession(session) {
  const messages = [];
  const history = [];
  for (const t of session.turns || []) {
    if (!t.opener) messages.push(userBubble(t.message));
    // Old review cards are history, not pending actions on this screen.
    messages.push(...turnToBubbles(t.result).map((b) => ({ ...b, reviewSection: undefined })));
    history.push(
      { role: 'user', content: t.message },
      { role: 'assistant', content: String(t.result?.reply ?? '') }
    );
  }
  const last = session.turns?.[session.turns.length - 1]?.result || {};
  return {
    id: `srv-${session.id}`,
    serverId: session.id,
    title: session.title,
    createdAt: session.startedAt,
    updatedAt: session.updatedAt,
    messages,
    history,
    ...cardChips(last),
    live: { states: {}, card: null },
  };
}

/** Is `session` the conversation currently open in `thread`? */
export function sessionMatchesThread(session, thread) {
  if (!session || !thread) return false;
  if (thread.serverId) return thread.serverId === session.id;
  const start = Date.parse(session.startedAt);
  const end = Date.parse(session.updatedAt) + 60_000;
  const tStart = Date.parse(thread.createdAt);
  const tEnd = Date.parse(thread.updatedAt);
  return tStart <= end && tEnd >= start;
}

/** Server sessions -> history drawer groups (same Figma grouping as local). */
export const sessionGroups = (sessions, now = new Date()) =>
  historyGroups(
    sessions.map((s) => ({
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt,
      messages: [{ sender: 'user', text: s.title }],
    })),
    now
  );
/* ---- personality panel rows from saved assessment results ---------------- */

// Same 1-5 -> 0-100% scale the agent's report card uses (assessment.ts).
const likertPct = (v) =>
  typeof v === 'number' && Number.isFinite(v)
    ? Math.max(0, Math.min(100, Math.round(((v - 1) / 4) * 100)))
    : null;
const BIG_FIVE_LABELS = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Emotional sensitivity',
};
const RIASEC_LABELS = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

/** Saved results -> { big_five: rows, riasec: rows } (latest result per type). */
export function personalityFromResults(results = []) {
  const latest = {};
  for (const r of results) {
    const t = r?.assessmentType;
    if (!t) continue;
    if (!latest[t] || Date.parse(r.createdAt) > Date.parse(latest[t].createdAt)) latest[t] = r;
  }
  const out = {};
  const bf = latest.big_five?.bigFiveScores;
  if (bf) {
    const rows = Object.keys(BIG_FIVE_LABELS)
      .map((k) => ({ label: BIG_FIVE_LABELS[k], value: likertPct(bf[k]) }))
      .filter((r) => r.value !== null)
      .map((r) => ({ label: r.label, value: `${r.value}%` }));
    if (rows.length) out.big_five = rows;
  }
  const rs = latest.riasec?.riasecScores;
  if (rs) {
    const inner = rs.scores || rs;
    const bars = Object.keys(RIASEC_LABELS)
      .map((k) => ({ label: RIASEC_LABELS[k], value: likertPct(inner[k]) }))
      .filter((r) => r.value !== null)
      .sort((a, b) => b.value - a.value)
      .map((r) => ({ label: r.label, value: `${r.value}%` }));
    const code = rs.code || latest.riasec.interpretation?.code;
    if (bars.length)
      out.riasec = [...(code ? [{ label: 'Career-interest code', value: code }] : []), ...bars];
  }
  if (latest.mbti?.mbtiType)
    out.mbti = [{ label: 'Personality type', value: latest.mbti.mbtiType }];
  return out;
}
