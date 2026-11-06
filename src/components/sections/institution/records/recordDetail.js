/*
 * recordDetail — turns GET /institution/records/:id (the record, its checks and file, and the student's Progress detail) into the shape the record
 * page draws (hero, About, Top skills, Experience, Portfolio, the right rail). Cards with nothing behind them are empty arrays / null and are not drawn.
 * A student who isn't visible to the school's staff (not linked, or an under-18 waiting for guardian consent) shows the record and their roster line only.
 */

const monthYear = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(d))
    : '';
const SKILL_ICONS = ['chartbar', 'dns', 'func', 'voice'];
const COVERS = ['bars', 'line', 'dots'];
const LEVEL_PCT = { basic: 40, beginner: 40, intermediate: 65, advanced: 85, expert: 95 };
const CHECK_ICONS = {
  name: null,
  enrolled: 'target',
  index: 'file',
  file: 'voice',
  source: 'phone',
};

export const buildRecordDetail = (api) => {
  const s = api.profile && api.profile.visible !== false ? api.profile : null;
  const p = s?.profile;
  const roster = api.roster;
  const location = [roster?.formLabel, roster?.programme, s?.school, s?.town]
    .filter(Boolean)
    .join(' · ');
  const skills = (s?.evidence ?? []).slice(0, 4).map((e, i) => ({
    id: `${e.skill}-${i}`,
    name: e.skill,
    icon: SKILL_ICONS[i % SKILL_ICONS.length],
    badge: e.sourceLabel,
    strong: e.source === 'test',
    fill: Math.round(((e.score ?? LEVEL_PCT[String(e.level).toLowerCase()] ?? 50) / 100) * 300),
    note: [e.score != null ? `score ${e.score}` : e.level].filter(Boolean).join(' · '),
  }));
  return {
    open: api.status === 'pending' || api.status === 'needs-info',
    heading: `${api.kindLabel} to verify`,
    tagline: s
      ? [s.joinedAt ? `linked to your school ${monthYear(s.joinedAt)}` : null]
          .filter(Boolean)
          .join(' · ')
      : 'Not visible to staff yet (not linked, or waiting for guardian consent)',
    location: location || 'On your roster',
    onGth: Boolean(s),
    chips: [
      ...(p?.goals ?? [])
        .slice(0, 1)
        .map((g) => ({ id: 'goal', label: g, icon: 'target', tone: 'green' })),
      ...(p?.location ? [{ id: 'place', label: p.location, icon: 'pin' }] : []),
      ...(p?.languages?.length
        ? [{ id: 'lang', label: p.languages.join(' · '), icon: 'voice' }]
        : []),
    ],
    stats: s
      ? [
          { id: 'skills', value: String(s.stats.skills), label: 'skills evidenced' },
          { id: 'profile', value: `${p.completion}%`, label: 'profile complete' },
          { id: 'records', value: String((api.others ?? []).length + 1), label: 'records sent' },
        ]
      : [{ id: 'records', value: String((api.others ?? []).length + 1), label: 'records sent' }],
    tabs: [
      { id: 'overview', label: 'Overview' },
      ...(skills.length
        ? [{ id: 'skills', label: 'Skills', count: String(s.stats.evidence) }]
        : []),
      ...(p?.experience?.length
        ? [{ id: 'experience', label: 'Experience', count: String(p.experience.length) }]
        : []),
      ...(p?.portfolio?.length
        ? [{ id: 'portfolio', label: 'Portfolio', count: String(p.portfolio.length) }]
        : []),
      ...(p?.about ? [{ id: 'about', label: 'About me' }] : []),
    ],
    about: p?.about || '',
    vibe: [
      ...(p?.goals ?? []).map((g, i) => ({ id: `g${i}`, label: g, icon: 'target' })),
      ...(p?.interests ?? []).map((g, i) => ({ id: `i${i}`, label: g, icon: 'heart' })),
    ].slice(0, 4),
    skills,
    experience: (p?.experience ?? []).map((x, i) => ({
      id: `exp-${i}`,
      icon: i % 2 ? 'grad' : 'trend',
      tone: i % 2 ? 'cream' : 'blue',
      role: x.title || 'Experience',
      meta: [
        x.org,
        [monthYear(x.from), x.current ? 'now' : monthYear(x.to)].filter(Boolean).join(' – '),
      ]
        .filter(Boolean)
        .join('  ·  '),
      body: x.text,
      tags: x.tags ?? [],
    })),
    portfolio: (p?.portfolio ?? []).map((x, i) => ({
      id: `p-${i}`,
      cover: COVERS[i % COVERS.length],
      title: x.title || 'Untitled',
      meta: [x.kind, x.year].filter(Boolean).join(' · '),
    })),
    checks: (api.checks ?? []).map((c) => ({ ...c, icon: CHECK_ICONS[c.id] ?? null })),
    summaryTitle: [api.title, api.issuedOn].filter(Boolean).join(' · '),
    summaryBody: [
      api.details ||
        `Sent by ${api.profile?.first || String(api.student || '').split(' ')[0] || 'the student'} on ${api.submittedOn}${api.file ? ` with ${api.file.name}` : ' without a file'}.`,
      api.answer ? `You asked for more; they answered: “${api.answer}”` : null,
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
};
