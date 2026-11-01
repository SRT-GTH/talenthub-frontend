import {
  readEducationEntry,
  educationTitle,
  classYearLabel,
  overallResultLabel,
} from '../../../utils/education.js';

/*
 * talentProfileLive.js (2026-10-18) - turns the real profile (services/talentProfile.api.js)
 * into the same shapes the /profile tabs render (talentProfileTabsData.js), so the Figma layout
 * is unchanged. Rule (same as talentHomeLive.js): real data or an honest empty state, never the
 * Figma demo numbers. Sections with no backend yet (badges, endorsement faces, recruiter skill
 * demand, in-progress certs) come back empty / null and the components hide them.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthYear = (d) => {
  if (!d) return null;
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : `${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
};
const monthsBetween = (a, b) => {
  const s = new Date(a);
  const e = b ? new Date(b) : new Date();
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
  return m > 0 ? m : null;
};
const durationLabel = (m) => {
  if (!m) return '';
  if (m < 12) return `${m} mo${m === 1 ? '' : 's'}`;
  const y = Math.floor(m / 12);
  const r = m % 12;
  return `${y} yr${y === 1 ? '' : 's'}${r ? ` ${r} mo${r === 1 ? '' : 's'}` : ''}`;
};
const titleCase = (s) => String(s || '').replace(/\b([a-z])/g, (c) => c.toUpperCase());
const nameOf = (x) => (typeof x === 'string' ? x : x?.name || x?.careerName || x?.title || '');
const article = (w) => (/^[aeiou]/i.test(String(w || '').trim()) ? 'an' : 'a');
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const list = (v) => (Array.isArray(v) ? v : []);
const keyOf = (s, i) =>
  `${String(s || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}-${i}`;

const LEVEL_PCT = { beginner: 35, basic: 35, intermediate: 62, advanced: 82, expert: 92 };
const VERIFIED = new Set([
  'training_evidenced',
  'game_evidenced',
  'assessment_verified',
  'verified',
]);
const skillBadge = (v) => {
  const s = v?.validationStatus;
  // Passed in Skills Lab (a lab or a skill game, srt-backend skillsLab.service): badge says where it was proven.
  const fromLab = String(v?.metadata?.source || '').startsWith('skills_lab');
  if (fromLab && (s === 'verified' || s === 'game_evidenced'))
    return { group: 'verified', chip: { label: 'Skills Lab', tone: 'white' } };
  if (s === 'game_evidenced')
    return { group: 'verified', chip: { label: 'Skills Lab', tone: 'white' } };
  if (VERIFIED.has(s)) return { group: 'verified', chip: { label: 'Assessed', tone: 'green' } };
  if (s === 'peer_verified' || s === 'endorsed')
    return { group: 'endorsed', chip: { label: 'Endorsed', tone: 'white' } };
  return { group: 'self', chip: { label: 'Self-added', tone: 'white' } };
};
const SKILL_ICONS = ['bar', 'dns', 'func', 'voice', 'trend', 'table'];

const STAGE_STEP = {
  avatar: 'Add a profile photo or avatar',
  personal_info: 'Fill in your personal details',
  education: 'Add your education',
  interests: 'Tell us what you’re into',
  personality: 'Take the personality quiz',
  skills: 'Add your skills',
  work: 'Add work, gigs or volunteering',
  portfolio: 'Add a project to your portfolio',
  certs: 'Add a certificate',
  goals: 'Set your career goal',
  pitch: 'Record your 60-sec pitch',
};
const MILESTONE_LABEL = {
  discoverable: 'Discoverable',
  top_20: 'Top 20%',
  top_talent: 'Top Talent',
};

// Big Five -> "How I work" sliders (left label = high score).
const TRAITS = [
  ['openness', 'Curious', 'Practical'],
  ['conscientiousness', 'Organised', 'Flexible'],
  ['extraversion', 'Outgoing', 'Reserved'],
  ['agreeableness', 'Team player', 'Independent'],
  ['neuroticism', 'Sensitive', 'Calm'],
];
const VIBE = {
  openness: 'Curious',
  conscientiousness: 'Organised',
  extraversion: 'Outgoing',
  agreeableness: 'Team player',
  neuroticism: 'Feels deeply',
};
const VIBE_ICON = {
  openness: 'analytical',
  conscientiousness: 'analytical',
  extraversion: 'team',
  agreeableness: 'team',
  neuroticism: 'calm',
};
const INTEREST_ICON = {
  hobby: 'heart',
  professional: 'data',
  entrepreneurial: 'fintech',
  educational: 'data',
  extracurricular: 'mic',
};

const viewTrend = (v) => {
  if (!v) return '';
  const cur = v.uniqueViewers || 0;
  const prev = v.previousPeriod || 0;
  if (!prev) return cur ? 'New this week' : '';
  const pct = Math.round(((cur - prev) / prev) * 100);
  return `${pct >= 0 ? '↑' : '↓'} ${Math.abs(pct)}% vs last week`;
};

export const buildProfileData = (raw) => {
  const p = raw?.profile || {};
  const user = raw?.user || {};
  const j = raw?.journey || null;
  const views = raw?.views || null;

  const name = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your name';
  const careers = list(p.desiredCareers).map(nameOf).filter(Boolean);
  const target = p.careerGoals?.targetCareer || careers[0] || null;
  const edu = list(p.education)
    .filter((e) => e?.institution && e.institution !== 'Not provided')
    .map(readEducationEntry);
  const current = edu.find((e) => e.isCurrent) || edu[0] || null;
  const place = p.locality || p.district || p.region || user.locality || user.district || null;
  const langs = list(p.languages).map(nameOf).filter(Boolean);
  const student = ['jhs', 'post_bece', 'shs'].includes(current?.educationLevel || p.educationLevel);

  // ---- skills (profile skill lists + verification rows) ----
  const verifByKey = Object.fromEntries(
    list(raw?.verifications).map((v) => [String(v.skillKey || '').toLowerCase(), v])
  );
  const skillNames = [];
  const seen = new Set();
  for (const s of [...list(p.technicalSkills), ...list(p.softSkills)]) {
    const n = nameOf(s);
    if (n && !seen.has(n.toLowerCase())) {
      seen.add(n.toLowerCase());
      skillNames.push(n);
    }
  }
  const skills = skillNames.map((n, i) => {
    const v = verifByKey[n.toLowerCase()];
    const badge = skillBadge(v);
    const level = String(v?.claimedLevel || '').toLowerCase();
    return {
      key: keyOf(n, i),
      icon: SKILL_ICONS[i % SKILL_ICONS.length],
      name: titleCase(n),
      group: badge.group,
      chip: badge.chip,
      pct: LEVEL_PCT[level] || (badge.group === 'self' ? 30 : 60),
      level: level ? titleCase(level) : null,
      when: monthYear(v?.verifiedAt || v?.updatedAt || v?.createdAt),
    };
  });
  const groupRows = (g) => skills.filter((s) => s.group === g);
  const verified = groupRows('verified');
  const endorsed = groupRows('endorsed');
  const self = groupRows('self');
  const skillMeta = (s) =>
    [
      s.level,
      s.group === 'self'
        ? `Added by you${s.when ? ` · ${s.when}` : ''}`
        : s.when
          ? `${s.chip.label} · ${s.when}`
          : null,
    ]
      .filter(Boolean)
      .join('  ·  ');

  // ---- work / portfolio / certs ----
  const work = list(p.workExperience).map((w, i) => {
    const months = monthsBetween(w.startDate, w.isCurrent ? null : w.endDate);
    const dates = [
      [monthYear(w.startDate), w.isCurrent ? 'Present' : monthYear(w.endDate)]
        .filter(Boolean)
        .join(' – '),
      durationLabel(months),
    ]
      .filter(Boolean)
      .join(' · ');
    const bullets = String(w.description || '')
      .split(/\n+|(?<=\.)\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => `•  ${t}`);
    return {
      key: keyOf(w.position || w.company, i),
      icon: 'trend',
      iconBg: ['#eaeffb', '#faf4e8', '#ebf1ec'][i % 3],
      title: titleCase(w.position) || 'Role',
      chips: w.employmentType ? [{ label: titleCase(w.employmentType), tone: 'white' }] : [],
      org: [w.company, w.location].filter(Boolean).join(' · '),
      dates,
      bullets,
      tags: list(w.skillsUsed || w.skills)
        .map(nameOf)
        .filter(Boolean),
      text: w.description || '',
      meta: [w.company, dates].filter(Boolean).join('  ·  '),
    };
  });
  const projects = list(p.portfolio).map((x, i) => ({
    key: keyOf(x.title, i),
    cover: ['bars', 'line', 'dots'][i % 3],
    coverUrl:
      typeof x.coverImage === 'string' && /^https:\/\//.test(x.coverImage) ? x.coverImage : null,
    category: 'all',
    tag: x.url ? 'Link ↗' : 'Project',
    title: x.title || 'Project',
    text: x.description || '',
    tags: list(x.skillsUsed).map(nameOf).filter(Boolean),
    links: x.url ? [{ label: 'Open', icon: 'link', href: x.url }] : [],
    stats: [monthYear(x.startDate), x.endDate ? monthYear(x.endDate) : null]
      .filter(Boolean)
      .join(' – '),
    meta: [
      list(x.skillsUsed).map(nameOf).slice(0, 2).join(' · '),
      x.endDate || x.startDate ? new Date(x.endDate || x.startDate).getFullYear() : null,
    ]
      .filter(Boolean)
      .join(' · '),
  }));
  const certs = list(p.certifications).map((c, i) => ({
    key: keyOf(c.name, i),
    sealBg: ['#eaeffb', '#ebf1ec', '#faf4e8'][i % 3],
    title: titleCase(c.name) || 'Certificate',
    chip: c.credentialURL
      ? { label: 'Link added', tone: 'white' }
      : { label: 'Not verified', tone: 'white' },
    issuer: c.issuingOrganization || '',
    meta: [
      [
        c.issueDateYearOnly && c.issueDate
          ? `Issued ${new Date(c.issueDate).getUTCFullYear()}`
          : monthYear(c.issueDate)
            ? `Issued ${monthYear(c.issueDate)}`
            : null,
        c.expirationDate ? `Expires ${monthYear(c.expirationDate)}` : 'No expiry',
      ]
        .filter(Boolean)
        .join(' · '),
      c.credentialID ? `Credential ID ${c.credentialID}` : null,
    ]
      .filter(Boolean)
      .join('  ·  '),
    tags: [],
    action: c.credentialURL ? 'View credential ↗' : '',
    href: c.credentialURL || null,
  }));

  // ---- personality ----
  const bigFiveRow = list(raw?.assessments).find((r) => r.assessmentType === 'big_five');
  const pct = bigFiveRow?.bigFiveScores?.percentiles || null;
  const traitRows = pct
    ? TRAITS.filter(([k]) => typeof pct[k] === 'number').map(([k, left, right]) => ({
        key: k,
        left,
        right,
        pos: Math.min(0.95, Math.max(0.02, 1 - pct[k] / 100)),
      }))
    : [];
  const primaryTraits = list(p.personalitySnapshot?.primaryTraits);
  const vibe = [
    ...primaryTraits
      .slice(0, 3)
      .map((t) => ({ label: VIBE[t] || titleCase(t), icon: VIBE_ICON[t] || 'heart' })),
    ...list(p.interests)
      .filter((x) => x?.category === 'hobby')
      .slice(0, 1)
      .map((x) => ({ label: titleCase(nameOf(x)), icon: 'heart' })),
  ];

  // ---- education ----
  const eduItems = edu.map((e, i) => ({
    key: keyOf(e.institution, i),
    icon: ['tertiary', 'post_grad'].includes(e.educationLevel) ? 'bldg' : 'company',
    iconBg: ['#faf4e8', '#eaeffb'][i % 2],
    title: educationTitle(e),
    org: e.institution,
    meta: [
      [e.startYear, e.isCurrent ? (e.endYear ? `${e.endYear} (expected)` : 'Present') : e.endYear]
        .filter(Boolean)
        .join(' – '),
      e.isCurrent ? classYearLabel(e.classYear) : null,
      overallResultLabel(e.overallResult),
      e.activities[0] || null,
    ]
      .filter(Boolean)
      .join('  ·  '),
    subjects: e.subjects,
  }));

  // ---- strength / views / goal ----
  const strengthPct = j?.percent ?? p.profileCompletion ?? 0;
  const pending = list(j?.stages).filter((s) => !s.done);
  const goalText = p.careerGoals?.shortTerm || p.careerGoals?.longTerm || null;

  const counts = {
    skills: skills.length,
    experience: work.length + eduItems.length,
    portfolio: projects.length,
    certs: certs.length,
  };

  // Recruiter / public-link previews (talentProfilePreviewData.js shapes). ⚠️ No reply-time or last-active data
  // yet, so those slots show skills / profile strength; the role-match box is hidden (it needs a recruiter's posting).
  const firstName = p.firstName || name.split(' ')[0] || 'me';
  const stat = (n, one, many) => ({ value: String(n), label: n === 1 ? one : many });
  const previewStats = [
    stat(verified.length, 'verified skill', 'verified skills'),
    stat(endorsed.length, 'endorsement', 'endorsements'),
  ];
  const PREVIEW = {
    banner: {
      public: {
        title: 'This is what anyone with your public link sees',
        sub: 'Logged-out visitors: no match score, no CV download, no endorser names. Messaging needs a GTH account.',
      },
    },
    hero: {
      recruiter: {
        sticker: 'Recruiters see these buttons',
        actions: [
          { key: 'shortlist', label: 'Shortlist', tone: 'tertiary' },
          { key: 'cv', label: 'Download CV', tone: 'tertiary' },
          { key: 'message', label: `Message ${firstName}`, tone: 'primary' },
        ],
        stats: [...previewStats, stat(counts.skills, 'skill', 'skills')],
      },
      public: {
        sticker: 'Visitors see these buttons',
        actions: [
          { key: 'copy', label: 'Copy link', tone: 'tertiary' },
          { key: 'join', label: `Join GTH to message ${firstName}`, tone: 'primary' },
        ],
        stats: [...previewStats, { value: `${strengthPct}%`, label: 'profile strength' }],
      },
    },
    recruiterRail: {
      match: null,
      hidden: {
        title: 'Only you see',
        rows: [
          { icon: 'wallet', label: 'Pay hope' },
          { icon: 'target', label: 'Your goals & milestones' },
          { icon: 'eye', label: `Who viewed you · ${views?.uniqueViewers ?? 0} this week` },
          { icon: 'streak', label: 'Streak, XP and level', labelFocused: 'Streak, pts and level' },
          { icon: 'hourglass', label: 'In-progress certs' },
        ],
        link: 'Manage what’s visible →',
      },
    },
    publicRail: {
      join: {
        sticker: 'Hiring in Ghana?',
        title: `Find talent like ${firstName}`,
        body: 'Free recruiter account. Search verified skills, message talent, and post roles.',
        cta: 'Create recruiter account',
      },
    },
  };

  return {
    PREVIEW,
    PROFILE_HERO: {
      name,
      photo: p.profilePhoto || p.avatar?.url || null,
      banner: p.bannerImage || null,
      openToWork: student ? 'Student' : 'Open to work',
      verified: '',
      level: j
        ? `${MILESTONE_LABEL[j.milestone] || 'Getting started'} · ${j.doneCount} of ${j.total || 9} stages`
        : '',
      handle: [
        p.createdAt ? `Joined ${monthYear(p.createdAt)}` : null,
        langs.length ? langs.join(' · ') : null,
      ]
        .filter(Boolean)
        .join(' · '),
      headline:
        [
          target ? `Aspiring ${titleCase(target)}` : null,
          current
            ? [educationTitle(current), current.institution].filter(Boolean).join(', ')
            : null,
          place,
        ]
          .filter(Boolean)
          .join(' · ') || 'Tell recruiters who you are',
      pitch:
        p.videoPitch?.videoUrl || p.videoPitch?.url
          ? {
              title: 'Watch my 60-sec pitch',
              meta: p.videoPitch.duration ? `${p.videoPitch.duration}s` : '',
            }
          : null,
      chips: [
        careers.length
          ? { label: careers.slice(0, 2).map(titleCase).join(' · '), icon: 'target', tone: 'green' }
          : null,
        place ? { label: place, icon: 'pin', tone: 'white' } : null,
        langs.length ? { label: langs.slice(0, 3).join(' · '), icon: 'lang', tone: 'white' } : null,
      ].filter(Boolean),
      actions: { preview: 'Preview as recruiter', share: 'Share profile' },
      stats: [
        { value: String(views?.uniqueViewers ?? 0), label: 'views this week' },
        {
          value: String(verified.length),
          label: verified.length === 1 ? 'verified skill' : 'verified skills',
        },
        { value: `${strengthPct}%`, label: 'profile strength' },
      ],
    },
    PROFILE_TAB_LIST: [
      { key: 'overview', label: 'Overview' },
      { key: 'skills', label: 'Skills', count: String(counts.skills) },
      { key: 'experience', label: 'Experience', count: String(counts.experience) },
      { key: 'portfolio', label: 'Portfolio', count: String(counts.portfolio) },
      { key: 'certs', label: 'Certs', count: String(counts.certs) },
      { key: 'about', label: 'About me' },
    ],
    OVERVIEW_ABOUT: {
      title: 'About',
      link: 'Read more →',
      text:
        p.professionalBio ||
        'Add a short bio so recruiters know who you are and what you want next.',
      vibeLabel: vibe.length ? 'My vibe' : '',
      vibe,
    },
    OVERVIEW_SKILLS: {
      title: 'Top skills',
      link: skills.length ? `See all ${skills.length} →` : '',
      empty: 'No skills yet. Add a few with Career Buddy, then prove them in Skills Lab.',
      items: [...verified, ...endorsed, ...self].slice(0, 4).map((s) => ({
        key: s.key,
        icon: s.icon,
        name: s.name,
        chip: s.chip,
        pct: s.pct,
        note: s.level ? titleCase(s.level) : '',
      })),
    },
    OVERVIEW_EXPERIENCE: {
      title: 'Experience',
      link: work.length ? `See all ${work.length} →` : '',
      empty: 'No work yet. Gigs, side hustles, volunteering and apprenticeships all count.',
      items: work.slice(0, 2).map((w) => ({
        key: w.key,
        icon: w.icon,
        iconBg: w.iconBg,
        title: w.title,
        meta: w.meta,
        text: w.text,
        tags: w.tags,
      })),
    },
    OVERVIEW_PORTFOLIO: {
      title: 'Portfolio',
      link: projects.length ? `See all ${projects.length} →` : '',
      empty: 'No projects yet. If you made it, it counts.',
      items: projects.slice(0, 3).map((x) => ({
        key: x.key,
        cover: x.cover,
        coverUrl: x.coverUrl,
        tag: x.tag,
        title: x.title,
        meta: x.meta,
      })),
    },
    PROFILE_STRENGTH: {
      title: 'Profile strength',
      pct: strengthPct,
      sub: pending.length ? `${plural(pending.length, 'step')} left` : 'All stages done',
      steps: pending.slice(0, 4).map((s) => ({
        key: s.id,
        label: STAGE_STEP[s.id] || titleCase(String(s.id).replace(/_/g, ' ')),
      })),
      cta: pending.length ? 'Finish my profile' : '',
    },
    PROFILE_VIEWS: {
      title: 'Who’s looking',
      link: '',
      count: String(views?.uniqueViewers ?? 0),
      label: 'views this week',
      trend: viewTrend(views),
      who: views?.uniqueViewers
        ? (views.byCompany || [])
            .slice(0, 2)
            .map((g) => g.orgName)
            .filter(Boolean)
            .join(', ') || 'Recruiters viewed your profile'
        : 'When recruiters open your profile, their company shows here.',
      searchNote: '',
      // The Figma faces are illustrations - never imply real viewers.
      showFaces: false,
    },
    PROFILE_GOAL: target
      ? {
          title: 'My goal',
          headline: `Become ${article(target)} ${titleCase(target)}`,
          detail: goalText || '',
          pct: strengthPct,
          progress: j ? `${j.doneCount} of ${j.total || 9} profile stages done` : '',
        }
      : null,
    PROFILE_BADGES: { title: 'Badges', link: '', items: [] },
    SKILLS_FILTERS: [
      { key: 'all', label: `All ${skills.length}` },
      { key: 'verified', label: `Verified ${verified.length}`, icon: 'check' },
      { key: 'endorsed', label: `Endorsed ${endorsed.length}` },
      { key: 'self', label: `Self-added ${self.length}` },
    ],
    SKILL_GROUPS: [
      {
        key: 'verified',
        title: 'Verified',
        titleIcon: 'check',
        hint: 'Proven on GTH, recruiters trust these most',
        rows: verified,
      },
      {
        key: 'endorsed',
        title: 'Endorsed',
        hint: 'Vouched for by people you’ve worked with',
        rows: endorsed,
      },
      {
        key: 'self',
        title: 'Self-added',
        hint: 'Not checked yet. Prove it to get the green tick',
        rows: self,
      },
    ]
      .filter((g) => g.rows.length)
      .map((g) => ({
        ...g,
        rows: g.rows.map((s) => ({
          key: s.key,
          icon: s.icon,
          name: s.name,
          chip: s.chip,
          meta: skillMeta(s),
          pct: s.pct,
          faces: 0,
          ...(g.key === 'self' ? { self: true, cta: 'Prove it in Skills Lab →' } : {}),
        })),
      })),
    SKILLS_IN_DEMAND: null,
    EXPERIENCE_WORK: { title: 'Work & volunteering', add: '+ Add', items: work },
    EXPERIENCE_TIP: {
      sticker: 'Buddy tip',
      title: 'Numbers get noticed',
      text: work.length
        ? 'Roles with a result in them (“served 40 customers a day”, “cut waste by a third”) get more recruiter clicks. Add one to each role.'
        : 'Gigs, apprenticeships and helping out in a family business all count as experience. Career Buddy can help you write them up.',
      cta: 'Improve with Career Buddy',
    },
    EXPERIENCE_EDUCATION: { title: 'Education', add: '+ Add', items: eduItems },
    PORTFOLIO_FILTERS: [{ key: 'all', label: `All ${projects.length}` }],
    PORTFOLIO_PROJECTS: projects,
    CERTS_LIST: { title: 'Certifications', add: '+ Add', items: certs },
    CERTS_IN_PROGRESS: null,
    CERTS_SUGGESTED: null,
    ABOUT_PITCH:
      p.videoPitch?.videoUrl || p.videoPitch?.url
        ? {
            title: 'My 60-sec pitch',
            link: 'Re-record',
            caption: p.videoPitch.transcript
              ? `“${String(p.videoPitch.transcript).slice(0, 60)}…”`
              : '',
            chip: '',
            // 2026-11-01: the real pitch (profiles/me adds videoPitch from the engagement): length + when it was published.
            stats: [
              p.videoPitch.duration ? `${Math.round(p.videoPitch.duration)} sec` : null,
              monthYear(p.videoPitch.submittedAt)
                ? `Published ${monthYear(p.videoPitch.submittedAt)}`
                : null,
            ].filter(Boolean),
            videoUrl: p.videoPitch.videoUrl || p.videoPitch.url,
            posterUrl: p.videoPitch.thumbnailUrl || null,
          }
        : null,
    ABOUT_BIO: {
      title: 'Bio',
      paragraphs: p.professionalBio
        ? String(p.professionalBio)
            .split(/\n\s*\n/)
            .map((t) => t.trim())
            .filter(Boolean)
        : ['No bio yet. A few lines about what you do and what you want next goes a long way.'],
    },
    ABOUT_TRAITS: {
      title: 'How I work',
      chip: traitRows.length
        ? 'From your personality quiz'
        : 'Take the personality quiz to fill this in',
      rows: traitRows,
    },
    ABOUT_GOALS: {
      title: 'Goals',
      items: [
        target
          ? {
              key: 'role',
              icon: 'target',
              headline: `Become ${article(target)} ${titleCase(target)}`,
              detail: goalText || '',
              primary: true,
            }
          : null,
        ...careers
          .filter((c) => c !== target)
          .slice(0, 2)
          .map((c, i) => ({
            key: `career-${i}`,
            icon: 'book',
            headline: titleCase(c),
            detail: 'Also interested',
          })),
      ].filter(Boolean),
      salary: '',
    },
    ABOUT_INTERESTS: {
      title: 'Into',
      chips: list(p.interests).map((x) => ({
        label: titleCase(nameOf(x)),
        icon: INTEREST_ICON[x?.category] || 'heart',
      })),
    },
    ABOUT_WORK_STYLE: {
      title: 'Work style',
      rows: [
        careers.length
          ? { label: 'Looking for', value: careers.slice(0, 3).map(titleCase).join(' · ') }
          : null,
        place ? { label: 'Where', value: place } : null,
        current
          ? {
              label: 'Studying',
              value:
                [current.fieldOfStudy || current.qualification, classYearLabel(current.classYear)]
                  .filter(Boolean)
                  .join(' · ') || current.levelLabel,
            }
          : null,
        langs.length ? { label: 'Languages', value: langs.join(' · ') } : null,
      ].filter(Boolean),
    },
  };
};
