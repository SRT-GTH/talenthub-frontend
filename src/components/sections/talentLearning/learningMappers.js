/*
 * My Learning — backend course / enrolment / bookmark -> the shapes the Figma-built screens render
 * (talentLearningHubData.js: COURSES[*], CONTINUE, ALSO_IN_PROGRESS, SAVED.items, CERTS).
 * Wording that has no Figma source is marked ⚠️ ASSUMPTION.
 */

const idOf = (x) => String(x?._id || x?.id || '');

// Cover art: the Figma set only has 8 illustrations, so a real course gets the closest one by topic.
const COVER_RULES = [
  [/\bsql\b|database/i, 'sql'],
  [/excel|spreadsheet|pivot/i, 'excel'],
  [/python|data science|machine learning|pandas/i, 'python'],
  [/power ?bi|dashboard|analytics|tableau/i, 'powerBi'],
  [/figma|ux|ui design|product design|design/i, 'figma'],
  [/statistic|math|probability/i, 'statistics'],
  [/interview|communicat|presentation|public speaking|soft skill|professional/i, 'interview'],
  [/web|front.?end|javascript|react|software|cyber|network|it\b/i, 'frontend'],
];
const FALLBACK_COVERS = [
  'sql',
  'frontend',
  'excel',
  'powerBi',
  'figma',
  'statistics',
  'interview',
  'python',
];

export const coverFor = (course) => {
  const hay = [course?.title, ...(course?.categories || []), ...(course?.skillsAddressed || [])]
    .filter(Boolean)
    .join(' ');
  const hit = COVER_RULES.find(([re]) => re.test(hay));
  if (hit) return hit[1];
  const id = idOf(course);
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return FALLBACK_COVERS[h % FALLBACK_COVERS.length];
};

/** "15 hours" -> { label: '15h', minutes: 900 }; "45 min" -> 45m; "4 weeks" stays as written. */
export const parseDuration = (raw) => {
  const s = String(raw || '').trim();
  if (!s) return { label: '', minutes: null };
  const n = parseFloat(s);
  if (/hour|hr|\bh\b/i.test(s) && !Number.isNaN(n)) return { label: `${n}h`, minutes: n * 60 };
  if (/min/i.test(s) && !Number.isNaN(n)) return { label: `${n} min`, minutes: n };
  return { label: s, minutes: null };
};

const costLabel = (cost) => (!cost ? 'Free' : `GHS ${cost}`);

/** GTH-native courses issue a GTH certificate (training.markComplete) ⚠️ ASSUMPTION for external ones. */
const hasCertificate = (course) => course?.providerType === 'gth_native';

const chipFor = (course) => {
  const gaps = Number(course?.skillGapIndicator) || 0;
  if (gaps > 0) {
    // ⚠️ ASSUMPTION: Figma's "+6% on Data Analyst" needs a per-role readiness delta the API doesn't give.
    const text = `Builds ${gaps} skill${gaps === 1 ? '' : 's'} you’re missing`;
    return { kind: 'gap', text, pick: text };
  }
  const bits = [course?.provider, course?.rating ? `★ ${course.rating}` : null].filter(Boolean);
  return { kind: 'social', text: bits.join(' · ') || 'Open course' };
};

/** Backend course -> COURSES[*] shape (+ the raw fields the live screens need). */
export const toCourseCard = (course) => {
  const dur = parseDuration(course?.duration);
  const cert = hasCertificate(course);
  const modules = Number(course?.totalModules) || 0;
  const head = [dur.label, costLabel(course?.cost)].filter(Boolean);
  return {
    id: idOf(course),
    title: course?.title || 'Course',
    cover: coverFor(course),
    provider: course?.provider || '',
    totalModules: modules,
    metaShort: [...head, cert ? 'Certificate' : null].filter(Boolean).join(' · '),
    metaFull: [
      dur.label,
      modules ? `${modules} module${modules === 1 ? '' : 's'}` : null,
      costLabel(course?.cost),
      cert ? 'Certificate' : null,
    ]
      .filter(Boolean)
      .join(' · '),
    metaPick: head.join(' · '),
    chip: chipFor(course),
    tags: {
      certificate: cert,
      matches: (Number(course?.skillGapIndicator) || 0) > 0,
      underTwoHours: dur.minutes !== null && dur.minutes < 120,
      popular: (Number(course?.rating) || 0) >= 4.5,
      free: !course?.cost,
    },
    blurb: course?.description || '',
    skills: course?.skillsAddressed || [],
    categories: course?.categories || [],
    level: course?.level || '',
    externalUrl: course?.externalUrl || null,
    raw: course,
  };
};

/** Backend enrolment (+ its course card) -> an in-progress row (CONTINUE / ALSO_IN_PROGRESS items). */
export const toProgressItem = (enrolment, card) => {
  const pct = Math.max(0, Math.min(100, Math.round(Number(enrolment?.progressPercent) || 0)));
  const total = card?.totalModules || 0;
  const done = total ? Math.min(total, Math.round((pct / 100) * total)) : 0;
  const next = total ? Math.min(total, done + 1) : null;
  return {
    id: idOf(enrolment),
    enrolmentId: idOf(enrolment),
    courseId: String(enrolment?.courseId || card?.id || ''),
    title: card?.title || enrolment?.courseName || 'Course',
    cover: card?.cover || 'sql',
    pct,
    nextModule: next,
    totalModules: total,
    completedCount: done,
    meta: next ? `Module ${next} of ${total}` : card?.metaShort || '',
    provider: card?.provider || '',
    status: enrolment?.status,
    completedAt: enrolment?.completedAt || null,
  };
};

const DAY = 24 * 60 * 60 * 1000;
/** "Saved just now" / "Saved 2 days ago" / "Saved last week" — the three Figma wordings, extended. */
export const savedWhen = (createdAt, now = Date.now()) => {
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return '';
  const days = Math.floor((now - t) / DAY);
  if (days < 1) return 'Saved just now';
  if (days === 1) return 'Saved yesterday';
  if (days < 7) return `Saved ${days} days ago`;
  if (days < 14) return 'Saved last week';
  return `Saved ${Math.floor(days / 7)} weeks ago`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const upper = (s) => String(s || '').toUpperCase();
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');

/**
 * Course card (+ the talent's enrolment, if any) -> the COURSE shape CourseDetail renders
 * (talentLearningCourseData.js). Modules have no titles on the backend (courses carry only
 * `totalModules`), so rows read "Module n" ⚠️ ASSUMPTION; Figma-only blocks with no data behind them
 * (role readiness deltas, points, social proof) are dropped (`why`/`proof` null).
 */
export const toCourseView = (card, enrolment, mock) => {
  const total = card.totalModules || 1;
  const done = enrolment?.completedCount || 0;
  const current = enrolment ? Math.min(total, done + 1) : 1;
  const finished = enrolment?.status === 'completed' || (enrolment && done >= total);
  const dur = parseDuration(card.raw?.duration);
  const startLabel = finished
    ? 'Course complete'
    : enrolment
      ? `Resume module ${current}`
      : mock.start;
  return {
    ...mock,
    provider: [upper(card.provider), upper(card.level)].filter(Boolean).join(' · '),
    sticker: card.tags.matches ? mock.sticker : null,
    title: card.title,
    blurb:
      card.blurb ||
      (card.skills.length
        ? `Builds ${card.skills.slice(0, 3).join(', ')}.`
        : card.categories.join(' · ')),
    crumb: `·  Recommended / ${card.title}`,
    meta: [
      dur.label && { id: 'hours', label: card.raw?.duration, icon: 'clock' },
      { id: 'modules', label: `${total} module${total === 1 ? '' : 's'}`, icon: 'layers' },
      card.level && { id: 'level', label: cap(card.level), icon: 'signal' },
      { id: 'price', label: card.tags.free ? 'Free' : `GHS ${card.raw?.cost}`, icon: 'gift' },
      card.tags.certificate && { id: 'cert', label: 'Certificate', icon: 'award' },
    ].filter(Boolean),
    start: startLabel,
    finished,
    enrolled: Boolean(enrolment),
    pace: enrolment
      ? `${enrolment.pct}% done · ${done} of ${total} modules`
      : 'Learn at your own pace.',
    insideMeta: [`${total} module${total === 1 ? '' : 's'}`, dur.label].filter(Boolean).join(' · '),
    modules: Array.from({ length: total }, (_, i) => {
      const n = i + 1;
      const isDone = n <= done;
      const isCurrent = !finished && n === current;
      return {
        n,
        title: `Module ${n}`,
        meta: isDone ? 'Completed' : isCurrent ? 'Up next' : 'Video + practice',
        icon: 'play',
        tag: isCurrent ? (enrolment ? 'Continue' : 'Start here') : undefined,
        current: isCurrent,
      };
    }),
    why: card.skills.length
      ? {
          eyebrow: mock.why.eyebrow,
          title: 'The skills it builds', // ⚠️ ASSUMPTION: no per-role readiness delta from the API
          roles: card.skills
            .slice(0, 3)
            .map((s, i) => ({ title: s, delta: '', mark: i % 2 ? 'chat' : 'hex' })),
        }
      : null,
    earn: {
      title: mock.earn.title,
      items: [
        card.skills[0] && {
          ...mock.earn.items[0],
          title: `${card.skills[0]} · verified skill`,
          sub: 'Shows on your profile as training-evidenced',
        },
        card.tags.certificate && mock.earn.items[1],
      ].filter(Boolean),
    },
    proof: null,
  };
};
