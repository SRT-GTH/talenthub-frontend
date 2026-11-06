/*
 * recordModel — builds the student record page (Figma 11.2.2j) from a roster row and GET /api/institution/students/:id (backend institutionRoster.get).
 * The profile sections (About, Top skills, Experience, Portfolio) come from the student's own GTH profile and are shown only when the profile is linked
 * and, for an under-18, the guardian agreed; otherwise they are left out (never invented). recordFor(student, detail, institution) → the record shape
 * the hero / overview / rail draw; firstNameOf(student); barText(student, record).
 */

const PRONOUN_TEXT = { he: 'he/him', she: 'she/her', they: 'they/them' };
const SKILL_ICONS = ['chart', 'dns', 'fn', 'voice'];
const TINTS = ['#eaeffb', '#faf4e8', '#ebf1ec', '#f5f3ff'];
const COVERS = ['bars', 'line', 'dots'];
const month = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(d))
    : '';
const day = (d) =>
  d ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(d)) : '';

export const firstNameOf = (student) => String(student.name || '').split(' ')[0];

const formLabel = (form) => (form === 'graduates' ? 'Graduate' : `Form ${form}`);

export const recordFor = (student, detail, institution = {}) => {
  const first = firstNameOf(student);
  const p = detail?.profile || null;
  const school = institution.short || institution.name || 'your institution';
  const where = [institution.town, institution.region].filter(Boolean).join(' · ');
  const consent = detail?.consent?.status || student.consent?.status;
  const skills = p?.skills?.length
    ? {
        more: null,
        items: p.skills.slice(0, 4).map((s, i) => ({
          id: `s${i}`,
          name: s.name,
          icon: SKILL_ICONS[i % SKILL_ICONS.length],
          chip: s.verified ? 'Verified' : 'On profile',
          chipOn: s.verified,
          bar: s.verified ? 258 : 186,
          sub: s.verified ? 'Verified on GTH' : 'Added by the student',
        })),
      }
    : null;
  const experience = p?.experience?.length
    ? {
        more: null,
        items: p.experience.map((x, i) => ({
          id: `x${i}`,
          title: x.title || 'Experience',
          meta: [
            x.org,
            [month(x.from), x.current ? 'now' : month(x.to)].filter(Boolean).join(' – '),
          ]
            .filter(Boolean)
            .join('  ·  '),
          text: '',
          tags: [],
          icon: i % 2 ? 'grad' : 'trend',
          tint: TINTS[i % TINTS.length],
        })),
      }
    : null;
  const portfolio = p?.portfolio?.length
    ? {
        more: null,
        items: p.portfolio.map((x, i) => ({
          id: `p${i}`,
          kind: x.kind || 'Project',
          title: x.title || 'Untitled',
          meta: x.year ? String(x.year) : '',
          cover: COVERS[i % COVERS.length],
        })),
      }
    : null;
  const about = p?.about ? { text: p.about, vibe: [] } : null;
  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...(skills ? [{ id: 'skills', label: 'Skills', count: p.skillsCount }] : []),
    ...(experience
      ? [{ id: 'experience', label: 'Experience', count: experience.items.length }]
      : []),
    ...(portfolio ? [{ id: 'portfolio', label: 'Portfolio', count: portfolio.items.length }] : []),
    ...(about ? [{ id: 'about', label: 'About me' }] : []),
  ];
  const record = [
    ...(detail?.cardLast
      ? [{ id: 'card', icon: 'video', text: `Ghana Card on file (…${detail.cardLast})`, dim: true }]
      : []),
    {
      id: 'visible',
      icon: 'wallet',
      text: student.linked
        ? `Linked to GTH${detail?.linkedAt ? ` · ${day(detail.linkedAt)}` : ''}`
        : student.note
          ? `Not linked yet · ${student.note}`
          : 'Not linked to GTH yet',
    },
    ...(student.under18
      ? [
          {
            id: 'consent',
            icon: 'voice',
            text:
              consent === 'agreed'
                ? 'Guardian agreed to link the profile'
                : consent === 'sent'
                  ? 'Guardian consent requested'
                  : consent === 'declined'
                    ? 'Guardian declined'
                    : 'Guardian consent not asked yet',
          },
        ]
      : []),
    ...(detail?.guardian?.name || detail?.guardian?.phone || detail?.guardian?.email
      ? [
          {
            id: 'guardian',
            icon: 'phone',
            text: `Guardian: ${[detail.guardian.name, detail.guardian.phone || detail.guardian.email].filter(Boolean).join(' · ')}`,
          },
        ]
      : []),
    ...(detail?.transfer?.status === 'requested'
      ? [{ id: 'transfer', icon: 'file', text: `Transfer requested to ${detail.transfer.to}` }]
      : []),
  ];
  return {
    id: student.id,
    name: student.name,
    pronouns: PRONOUN_TEXT[student.pronoun] ?? '',
    firstName: first,
    joined: detail?.joined || month(detail?.addedOn) || '',
    line: [formLabel(student.form), student.programme, school, where].filter(Boolean).join(' · '),
    formClass: formLabel(student.form),
    indexNo: detail?.indexNumber || null,
    open: null,
    chips: [
      ...(p?.goals?.length
        ? [{ id: 'goal', label: p.goals.slice(0, 2).join(' · '), icon: 'target', primary: true }]
        : []),
      ...(p?.location || where ? [{ id: 'where', label: p?.location || where, icon: 'pin' }] : []),
      ...(p?.languages?.length
        ? [{ id: 'lang', label: p.languages.join(' · '), icon: 'voice' }]
        : []),
    ],
    stats: p
      ? [
          { id: 'skills', value: String(p.verifiedSkills || 0), label: 'verified skills' },
          { id: 'profile', value: `${p.completion || 0}%`, label: 'profile complete' },
          { id: 'active', value: p.lastActive ? day(p.lastActive) : '–', label: 'last active' },
        ]
      : [],
    tabs,
    about,
    skills,
    experience,
    portfolio,
    hiddenNote:
      detail?.profileHidden ||
      (!student.linked ? `${first} hasn’t linked a GTH profile yet.` : null),
    enrolment: {
      badge: 'Enrolment',
      title: `Enrolled · ${formLabel(student.form)}`,
      text: `On the ${school} roster since ${month(detail?.addedOn) || 'recently'}${detail?.indexNumber ? ` · index no. ${detail.indexNumber}` : ''}.`,
    },
    record,
    badges: [],
  };
};

/** The sentence under the title of the dark bar. */
export const barText = (student, record) =>
  `${record.formClass}${student.programme ? ` · ${student.programme}` : ''}${record.indexNo ? ` · index no. ${record.indexNo}` : ''}. ${
    student.linked ? 'Linked to GTH' : 'Not linked to GTH yet'
  }. Only your staff see this record.`;
