/*
 * My Assessment on the six server-scored assessments (2026-10-19, owner decision: personality + aptitude
 * instead of the per-skill mock). Templates come from GET /engagement/assessments/templates (answer keys
 * stripped server-side), results from GET /engagement/assessments/results/me, scoring from
 * POST /engagement/assessments/score. This file maps them onto GubliAS's existing shapes so the MA-04 intro,
 * MA-05 run, MA-06/MA-10 result dialog and MA-09 library render unchanged:
 *   buildLiveFlow(template)        -> FULL_ASSESSMENT_* flow + `questions` (FullQuestion shape) + `live: true`
 *   toRawResponses(flow, answers)  -> { [question.key]: answer } in the format each scorer expects
 *   buildLiveResult(flow, data)    -> FullResultDialog view-model from the server's score
 *   buildLiveLibrary(templates, results) -> ASSESSMENT_LIBRARY shape
 * Copy with no Figma source is marked ⚠️ ASSUMPTION.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** URL slug <-> backend assessmentType, plus per-type presentation (⚠️ ASSUMPTION copy). */
export const LIVE_TYPES = {
  'big-five': {
    type: 'big_five',
    kind: 'personality',
    name: 'Big Five personality',
    icon: 'compass',
    lede: 'How you tend to think, feel and work, across five traits. There are no right or wrong answers.',
    card: 'Your trait scores and archetype',
    groups: {
      O: 'Openness',
      C: 'Conscientiousness',
      E: 'Extraversion',
      A: 'Agreeableness',
      N: 'Emotional range',
    },
  },
  mbti: {
    type: 'mbti',
    kind: 'personality',
    name: 'Personality type (MBTI-style)',
    icon: 'chat',
    lede: 'Pick the option that sounds more like you. You get a four-letter type. There are no right or wrong answers.',
    card: 'Your four-letter type',
    groups: { EI: 'Energy', SN: 'Information', TF: 'Decisions', JP: 'Structure' },
  },
  riasec: {
    type: 'riasec',
    kind: 'personality',
    name: 'Career interests (RIASEC)',
    icon: 'star',
    lede: 'Rate how much you would enjoy each activity. You get a three-letter interest code that points to careers.',
    card: 'Your career-interest code',
    groups: {
      R: 'Realistic',
      I: 'Investigative',
      A: 'Artistic',
      S: 'Social',
      E: 'Enterprising',
      C: 'Conventional',
    },
  },
  'numerical-reasoning': {
    type: 'numerical_reasoning',
    kind: 'aptitude',
    name: 'Numerical reasoning',
    icon: 'function',
    lede: 'Percentages, ratios, sequences and reading numbers in context. One correct answer per question.',
    card: 'Your numerical reasoning score',
    groups: { easy: 'Warm-up', medium: 'Core', hard: 'Stretch' },
  },
  'logical-reasoning': {
    type: 'logical_reasoning',
    kind: 'aptitude',
    name: 'Logical reasoning',
    icon: 'list-bullet',
    lede: 'Deductions, syllogisms and patterns. One correct answer per question.',
    card: 'Your logical reasoning score',
    groups: { easy: 'Warm-up', medium: 'Core', hard: 'Stretch' },
  },
  'situational-judgement': {
    type: 'situational_judgement',
    kind: 'aptitude',
    name: 'Situational judgement',
    icon: 'shield',
    lede: 'Real workplace moments. Pick what you would actually do; some answers are better than others.',
    card: 'Your workplace judgement score',
    groups: { easy: 'Everyday', medium: 'Tricky', hard: 'Tough calls' },
  },
};
export const SLUG_BY_TYPE = Object.fromEntries(
  Object.entries(LIVE_TYPES).map(([slug, m]) => [m.type, slug])
);
export const LIVE_ORDER = Object.keys(LIVE_TYPES);

const APTITUDE_BLURB = {
  easy: 'Get into the rhythm',
  medium: 'The heart of the test',
  hard: 'One to stretch you',
};

const LIKERT = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
const isLikert = (q) => !Array.isArray(q.options) || q.options.length === 0;

/** Template -> run questions in FullQuestion's shape ({ n, topic, title, prompt, code, options }). */
const toQuestions = (template, meta) =>
  (template.questions || []).map((q, i) => {
    const likert = isLikert(q);
    const topic = q.dimension || q.difficulty || 'general';
    return {
      n: i + 1,
      key: q.key,
      topic,
      topicLabel: meta.groups[topic] || topic,
      title: [[q.text, false]],
      prompt: likert
        ? 'How much does this sound like you?'
        : meta.kind === 'personality'
          ? 'Pick the one that fits you better.'
          : 'Pick one answer.',
      code: [],
      options: likert ? LIKERT : q.options,
      likert,
    };
  });

/** Template -> flow (same shape as FULL_ASSESSMENT_TYPESCRIPT, see assessmentData.js). */
export const buildLiveFlow = (template, slug, latest = null) => {
  const meta = LIVE_TYPES[slug];
  const questions = toQuestions(template, meta);
  const total = questions.length;
  const minutes = Number(template.estimatedMinutes) || Math.max(5, Math.round(total * 0.6));
  const aptitude = meta.kind === 'aptitude';
  const counts = {};
  questions.forEach((q) => {
    counts[q.topic] = (counts[q.topic] || 0) + 1;
  });
  return {
    id: slug,
    live: true,
    type: meta.type,
    kind: meta.kind,
    title: meta.name,
    headerTitle: `${aptitude ? 'Assessment' : 'Personality'} · ${meta.name}`,
    total,
    questions,
    passMark: null,
    // Aptitude is timed (the template's estimate); personality is untimed: the clock is only a guide there.
    timed: aptitude,
    totalSeconds: minutes * 60 * (aptitude ? 1 : 3),
    resumeWindowSeconds: 30 * 60,
    retakeDays: 30,
    hintCost: null,
    startXp: null,
    streakDays: null,
    subtitle: `${total} questions · About ${minutes} min${aptitude ? ' · Timed' : ' · No right answers'}`,
    intro: {
      back: 'My Assessment',
      title: meta.name,
      sticker: latest ? null : aptitude ? null : 'Recruiters see this',
      lede: meta.lede,
      stats: [
        { value: String(total), label: 'questions' },
        { value: `~${minutes} min`, label: aptitude ? 'timed' : 'no rush' },
        { value: aptitude ? '1 answer' : 'No wrong', label: aptitude ? 'per question' : 'answers' },
        {
          value: latest ? shortDate(latest.completedAt || latest.createdAt) : 'New',
          label: latest ? 'last taken' : 'not taken yet',
        },
      ],
      coversTitle: aptitude ? 'What it covers' : 'What it measures',
      topics: Object.entries(counts).map(([id, count]) => ({
        id,
        label: meta.groups[id] || id,
        blurb: aptitude ? APTITUDE_BLURB[id] || 'Questions' : `How strongly this shows up in you`,
        count,
      })),
      rulesTitle: 'Before you start',
      rules: [
        aptitude
          ? {
              icon: 'clock',
              title: 'One sitting',
              text: 'The timer keeps running if you leave the tab.',
            }
          : {
              icon: 'clock',
              title: 'Go with your first instinct',
              text: 'Answer for how you are, not how you think you should be.',
            },
        {
          icon: 'wifi',
          title: 'Stable connection',
          text: 'Answers save after every question on this device. Your result is scored when you submit.',
        },
        aptitude
          ? {
              icon: 'book',
              title: 'Rough work is fine',
              text: 'Use paper or a calculator. Copy-pasting questions into AI tools is not allowed.',
            }
          : {
              icon: 'book',
              title: 'Be honest',
              text: 'Recruiters see your profile, never your individual answers.',
            },
        {
          icon: 'refresh',
          title: 'Retake any time',
          text: 'Your latest result is the one that shows.',
        },
      ],
      start: {
        title: 'Ready when you are',
        body: aptitude
          ? `Pick a quiet ${minutes} minutes. You can also do this with Career Buddy in a chat.`
          : 'Find a calm moment. Prefer to talk it through? Career Buddy can run it as a chat instead.',
        primary: latest ? 'Retake' : 'Start',
        secondary: 'Do it with Career Buddy',
      },
      card: {
        title: 'What changes on your card',
        nowLabel: 'Now',
        now: latest
          ? `Taken ${shortDate(latest.completedAt || latest.createdAt)}`
          : 'Not shared yet',
        afterLabel: 'After you finish',
        after: meta.card,
        note: aptitude
          ? 'Recruiters see your band (for example Proficient), not your answers.'
          : 'Recruiters see the summary on your assessment profile, not your answers.',
      },
    },
    copy: {
      countLabel: 'Question {n} of {total}',
      summary: aptitude ? '{answered} answered · {left} left' : '{answered} answered',
      timedSticker: aptitude ? 'TIMED · {left} LEFT' : 'NO RIGHT ANSWERS',
      passMark: null,
      doneLabel: 'All {total} done',
      doneSummary: 'Scored on GTH',
      doneSubtitle: `${total} questions · Completed in {min} min`,
      stickerPass: 'COMPLETE',
      stickerFail: 'COMPLETE',
      next: 'Next question',
      submit: 'Submit answers',
      checkDisabled: 'Submitted',
      eyebrow: 'QUESTION {n} · {topic}',
    },
    resume: {
      title: 'You dropped off. No stress.',
      body: `Your {answered} answers are saved on this device.${aptitude ? ' The clock paused at {left}.' : ''} Pick up within 30 minutes to continue.`,
      window: 'Resume window: {window} left',
      secondary: 'Save and exit',
      primary: 'Resume question {n}',
    },
    timeUp: {
      title: "Time's up.",
      body: `You answered {answered} of ${total}. Unanswered questions count as wrong, and we are scoring the rest now.`,
      progress: 'Scoring your answers',
      eta: 'A few seconds',
      primary: 'See my result',
    },
    leave: {
      title: 'Leave the assessment?',
      body: aptitude
        ? 'The timer keeps running while you are away. Your answers stay on this device until you submit.'
        : 'Your answers stay on this device. Come back within 30 minutes to finish.',
      secondary: 'Leave anyway',
      primary: 'Keep going',
    },
  };
};

/** Run answers (option indexes) -> what each backend scorer reads (engagement.assessment.mixin.js). */
export const toRawResponses = (flow, committed) => {
  const raw = {};
  flow.questions.forEach((q, i) => {
    const pick = committed[i];
    if (pick === null || pick === undefined) return;
    if (q.likert) {
      raw[q.key] = pick + 1; // 1-5 (Big Five reverses R-suffixed keys server-side)
    } else if (flow.type === 'mbti') {
      // Options read "Many people (E)"; scoreMBTI counts letters.
      const m = /\(([A-Z])\)\s*$/.exec(q.options[pick] || '');
      raw[q.key] = m ? m[1] : q.options[pick];
    } else {
      raw[q.key] = q.options[pick]; // reasoning: compared to correctAnswer; SJT: key of the scoring map
    }
  });
  return raw;
};

const pct = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
const BAND_LABEL = (band) =>
  band ? band.charAt(0).toUpperCase() + band.slice(1).replace(/_/g, ' ') : '';

/** Server score -> FullResultDialog view-model. */
export const buildLiveResult = (flow, data) => {
  const scores = data?.scores || data?.data?.scores || {};
  const interp = data?.interpretation || data?.data?.interpretation || {};
  const meta = LIVE_TYPES[flow.id];
  const base = {
    id: 'pass',
    tone: 'pass',
    medallion: 'check',
    confetti: 'verified',
    dots: [],
    refresher: null,
    actions: { secondary: 'Back to My Assessment', primary: 'See my results' },
  };

  if (flow.kind === 'aptitude') {
    const percent = pct(scores.percentCorrect ?? scores.percentOfMax);
    const band = BAND_LABEL(scores.band);
    return {
      ...base,
      sticker: band ? band.toUpperCase() : 'SCORED',
      eyebrow: 'ASSESSMENT COMPLETE',
      heading: [
        [`${meta.name} `, false],
        ['done.', true],
      ],
      body: interp.summary || `You scored ${percent}%.`,
      stats: [
        {
          value: `${percent}%`,
          label: flow.type === 'situational_judgement' ? 'OF MAX' : 'CORRECT',
          tone: 'green',
        },
        {
          value:
            flow.type === 'situational_judgement'
              ? `${scores.rawScore ?? '–'}/${scores.maxScore ?? '–'}`
              : `${scores.rawScore ?? '–'}/${scores.maxScore ?? flow.total}`,
          label: flow.type === 'situational_judgement' ? 'POINTS' : 'QUESTIONS',
          tone: 'plain',
        },
        { value: band || '–', label: 'BAND', tone: 'gold' },
      ],
      topics: [],
    };
  }

  // Personality: trait rows instead of topic rows.
  let topics = [];
  let headline = 'Your results are in.';
  if (flow.type === 'big_five') {
    const p = scores.percentiles || {};
    const keys = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    topics = keys
      .filter((k) => scores[k] !== undefined || p[k] !== undefined)
      .map((k) => {
        const value = p[k] !== undefined ? pct(p[k]) : pct(((Number(scores[k]) - 1) / 4) * 100);
        return {
          label: k === 'neuroticism' ? 'Emotional range' : k[0].toUpperCase() + k.slice(1),
          qs: `${value}%`,
          strong: value >= 50,
        };
      });
    const dominant = (interp.dominantTraits || [])[0];
    if (dominant) headline = `Mostly ${String(dominant).toLowerCase()}.`;
  } else if (flow.type === 'riasec') {
    const code = scores.code || interp.code;
    topics = Object.entries(meta.groups)
      .filter(([k]) => scores[k] !== undefined)
      .map(([k, label]) => {
        const value = pct(((Number(scores[k]) - 1) / 4) * 100);
        return { label, qs: `${value}%`, strong: (code || '').includes(k) };
      })
      .sort((a, b) => parseInt(b.qs, 10) - parseInt(a.qs, 10));
    if (code) headline = `Your code is ${code}.`;
  } else if (flow.type === 'mbti') {
    const type = scores.type || data?.mbtiType;
    if (type) headline = `You are ${type}.`;
    // scoreMBTI: strengths { EI: { preference: 'I', strength: 0-100 } } (how clear the preference is).
    const LETTER = {
      E: 'Extravert',
      I: 'Introvert',
      S: 'Sensing',
      N: 'Intuition',
      T: 'Thinking',
      F: 'Feeling',
      J: 'Judging',
      P: 'Perceiving',
    };
    topics = Object.entries(scores.strengths || scores.dichotomies || {}).map(([k, v]) => {
      const pref = typeof v === 'object' && v ? v.preference : null;
      const strength = typeof v === 'object' && v ? v.strength : v;
      return {
        label: `${meta.groups[k] || k}${pref ? ` · ${LETTER[pref] || pref} (${pref})` : ''}`,
        qs: Number.isFinite(Number(strength)) ? `${pct(strength)}% clear` : '',
        strong: Number(strength) >= 40,
      };
    });
  }
  const tagOf = (qs) => {
    const v = parseInt(qs, 10);
    return Number.isFinite(v) ? (v >= 65 ? 'High' : v >= 35 ? 'Moderate' : 'Low') : '';
  };
  topics = topics.map((t) => ({
    ...t,
    tag: flow.type === 'mbti' ? (t.strong ? 'Clear' : 'Slight') : tagOf(t.qs),
  }));
  return {
    ...base,
    sticker: 'SAVED',
    eyebrow: 'PERSONALITY · SAVED',
    heading: [[headline, true]],
    body: interp.summary || 'Your result is saved to your profile.',
    stats: [],
    topics,
  };
};

/** Templates + my results -> ASSESSMENT_LIBRARY shape (MA-09). Tabs: to take / done / all. */
export const buildLiveLibrary = (templates, results, base) => {
  const latest = {};
  results.forEach((r) => {
    const prev = latest[r.assessmentType];
    if (
      !prev ||
      new Date(r.completedAt || r.createdAt) > new Date(prev.completedAt || prev.createdAt)
    ) {
      latest[r.assessmentType] = r;
    }
  });
  const byType = Object.fromEntries(templates.map((t) => [t.assessmentType, t]));
  const cards = LIVE_ORDER.filter((slug) => byType[LIVE_TYPES[slug].type]).map((slug) => {
    const meta = LIVE_TYPES[slug];
    const t = byType[meta.type];
    const done = latest[meta.type];
    const n = t.questions?.length || 0;
    const mins = t.estimatedMinutes || '';
    const resultLine = done ? summaryOf(meta, done) : null;
    return {
      id: slug,
      tabs: done ? ['done', 'all'] : ['todo', 'all'],
      icon: meta.icon,
      tile: done ? 'green' : 'amber',
      emphasis: !done && meta.type === 'big_five',
      status: done
        ? {
            label: `Done · ${shortDate(done.completedAt || done.createdAt)}`,
            tone: 'dark',
            icon: 'check-circle-fill',
          }
        : { label: meta.kind === 'personality' ? 'Personality' : 'Aptitude', tone: 'soft' },
      name: meta.name,
      meta: `${n} questions · ~${mins} min${meta.kind === 'aptitude' ? ' · timed' : ''}`,
      body: resultLine || meta.lede,
      action: {
        label: done ? 'Retake' : 'Start',
        kind: done ? 'secondary' : 'primary',
        to: `/my-assessment/full/${slug}`,
      },
    };
  });
  const doneCount = cards.filter((c) => c.tabs.includes('done')).length;
  return {
    ...base,
    title: 'Assessments',
    subtitle:
      'Personality and aptitude assessments, scored on GTH. Do them here, or with Career Buddy in a chat.',
    tabs: [
      { id: 'todo', label: 'To take', count: String(cards.length - doneCount) },
      { id: 'done', label: 'Done', count: String(doneCount) },
      { id: 'all', label: 'All assessments', count: String(cards.length) },
    ],
    cards,
    note: 'Recruiters see your results summary, never your individual answers. Your latest result is the one that shows.',
  };
};

/** One line for a finished assessment card. */
export const summaryOf = (meta, r) => {
  if (meta.type === 'big_five') {
    const d = r.interpretation?.dominantTraits;
    return d?.length ? `Strongest: ${d.slice(0, 2).join(', ')}.` : 'Trait profile saved.';
  }
  if (meta.type === 'riasec') {
    const code = r.riasecScores?.code || r.interpretation?.code;
    return code ? `Interest code ${code}.` : 'Interest profile saved.';
  }
  if (meta.type === 'mbti') return r.mbtiType ? `Type ${r.mbtiType}.` : 'Type saved.';
  const s = r.cognitiveScores || r.sjtScores || {};
  const v = s.percentCorrect ?? s.percentOfMax;
  return v !== undefined
    ? `Scored ${pct(v)}%${s.band ? ` · ${BAND_LABEL(s.band)}` : ''}.`
    : 'Result saved.';
};
