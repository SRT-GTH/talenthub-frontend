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
 *
 * ChatThread renders a bubble as `text`, then `bullets`, then `followUp`, so
 * blocks are packed into as few bubbles as that shape allows.
 */

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

/** Agent turn -> plain-data bot bubbles (serializable; no React nodes). */
export function turnToBubbles(turn) {
  const meta = {
    routedTo: turn?.routedTo ?? null,
    routeReason: turn?.routeReason ?? null,
    intent: turn?.classification?.intent ?? null,
    section: turn?.classification?.section ?? null,
  };
  const blocks = Array.isArray(turn?.blocks) && turn.blocks.length ? turn.blocks : null;
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
      entries: edu.map((e, i) =>
        entry(
          `edu-${i}`,
          e.institution,
          rows(
            row('Level', e.educationLevel),
            row('Programme', e.fieldOfStudy || e.degree),
            row('Year / grade', e.grade),
            row(
              'Years',
              [e.startYear, e.isCurrent ? 'Present' : e.endYear].filter(Boolean).join(' - ')
            )
          )
        )
      ),
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
    chips: last.chips || [],
    chipActions: last.chipActions || [],
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
  if (latest.mbti?.mbtiType) out.mbti = [{ label: 'MBTI type', value: latest.mbti.mbtiType }];
  return out;
}
