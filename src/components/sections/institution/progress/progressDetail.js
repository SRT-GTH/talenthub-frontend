/*
 * progressDetail — turns GET /institution/progress/students/:id into the shape the student progress page draws (hero, About, Top skills, Experience,
 * Portfolio, the term rail). Cards with nothing behind them are left out (empty arrays / null). Students not linked yet or waiting for a guardian's
 * consent get `hidden` and only their name.
 */

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const dayFmt = (d) =>
  d ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(d)) : '';
const monthYear = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(d))
    : '';
const SKILL_ICONS = ['bar', 'dns', 'func', 'voice'];
const COVERS = ['bars', 'line', 'dots'];
const LEVEL_PCT = { basic: 40, beginner: 40, intermediate: 65, advanced: 85, expert: 95 };
const SOURCE_TONE = { test: 'green', game: 'white', conversation: 'white' };

const activity = (s) =>
  s.inactiveDays == null ? 'Not active yet' : s.inactiveDays === 0 ? 'Today' : dayFmt(s.lastActive);

export const buildDetail = (api) => {
  const base = {
    id: api.id,
    name: api.name,
    first: api.first,
    initials: api.initials,
    flag: api.flag ?? null,
  };
  if (!api.visible) {
    return {
      ...base,
      hidden: api.hiddenReason,
      headline: [api.formLabel, api.programme, api.school].filter(Boolean).join(' · '),
    };
  }
  const p = api.profile;
  const st = api.stats;
  const supported = api.status === 'support' || api.status === 'flagged';
  const statusWord =
    api.status === 'flagged' ? 'flagged for coaching' : supported ? 'needs support' : 'on track';
  const vibe = [
    ...p.goals.map((g) => ({ label: g, icon: 'target' })),
    ...p.interests.map((i) => ({ label: i, icon: 'heart' })),
  ].slice(0, 4);
  return {
    ...base,
    verified: 'On GTH',
    handle: api.joinedAt ? `linked to your school ${monthYear(api.joinedAt)}` : '',
    headline: [api.formLabel, api.programme, api.school, api.town].filter(Boolean).join(' · '),
    chips: [
      ...p.goals.slice(0, 1).map((g) => ({ label: g, icon: 'target', tone: 'green' })),
      ...(p.location ? [{ label: p.location, icon: 'pin', tone: 'white' }] : []),
      ...(p.languages.length
        ? [{ label: p.languages.join(' · '), icon: 'lang', tone: 'white' }]
        : []),
    ],
    stats: [
      { value: String(st.skills), label: 'skills evidenced' },
      { value: String(st.games), label: 'Skills Lab games' },
      { value: activity(st), label: 'last active' },
    ],
    bar: {
      title: `${api.name} · progress`,
      sub: `${st.inactiveDays == null ? 'No activity yet.' : st.inactiveDays >= 30 ? `No activity for ${st.inactiveDays} days.` : `Active ${st.inactiveDays === 0 ? 'today' : `${st.inactiveDays} days ago`}.`} Profile ${p.completion}% complete. Only your school’s staff see this view.`,
    },
    about: p.about || vibe.length ? { text: p.about || 'No About text yet.', vibe } : null,
    skills: api.evidence.slice(0, 4).map((e, i) => ({
      key: `${e.skill}-${i}`,
      icon: SKILL_ICONS[i % SKILL_ICONS.length],
      name: e.skill,
      chip: { label: e.sourceLabel, tone: SOURCE_TONE[e.source] || 'white' },
      pct: e.score ?? LEVEL_PCT[String(e.level).toLowerCase()] ?? 50,
      note: [e.score != null ? `score ${e.score}` : e.level, dayFmt(e.at)]
        .filter(Boolean)
        .join(' · '),
    })),
    skillsTotal: st.evidence,
    experience: p.experience.map((x, i) => ({
      key: `${x.title}-${i}`,
      icon: i % 2 ? 'grad' : 'trend',
      iconBg: i % 2 ? '#faf4e8' : '#eaeffb',
      title: x.title || 'Experience',
      meta: [
        x.org,
        [monthYear(x.from), x.current ? 'now' : monthYear(x.to)].filter(Boolean).join(' – '),
      ]
        .filter(Boolean)
        .join('  ·  '),
      text: x.text,
      tags: x.tags,
    })),
    portfolio: p.portfolio.map((x, i) => ({
      key: `${x.title}-${i}`,
      cover: COVERS[i % COVERS.length],
      tag: x.kind,
      title: x.title || 'Untitled',
      meta: x.year ? String(x.year) : '',
    })),
    rail: {
      sticker: api.status === 'flagged' ? 'Flagged for coaching' : 'This term',
      title: `${p.completion}% · ${statusWord}`,
      text: `${plural(st.skills, 'skill')} evidenced, ${plural(st.games, 'Skills Lab game')}, ${plural(st.applications, 'application')}${st.placed ? ` (${st.placed} placed)` : ''}.`,
      termTitle: 'At a glance',
      rows: [
        {
          icon: 'video',
          text: `Profile ${p.completion}% · ${api.formLabel} average ${api.classAverage}%`,
        },
        { icon: 'target', text: `${plural(st.evidence, 'piece')} of skill evidence` },
        { icon: 'file', text: `${st.gamesPassed} of ${st.games} Skills Lab games passed` },
        {
          icon: 'voice',
          text: `${plural(st.applications, 'application')}${st.placed ? ` · ${st.placed} placed` : ''}`,
        },
        { icon: 'phone', text: `${plural(st.activeDays30, 'active day')} in the last 30 days` },
        {
          icon: 'wallet',
          text: api.flag
            ? `Flagged by ${api.flag.by} · ${dayFmt(api.flag.at)}`
            : 'Not flagged for coaching',
        },
      ],
    },
  };
};
