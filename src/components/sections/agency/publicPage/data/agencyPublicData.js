/*
 * agencyPublicData.js — the public agency page (Figma 11.6.1i, 8611:3509) built from live data: the agency profile (GET /agency/settings),
 * the signed-in session (name / short name) and the agency's programmes (GET /agency/programmes). Aggregates only: no MoU data appears here;
 * counts go through formatCount at the call site.
 */

const day = (v) =>
  v
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(v))
    : null;

const monogramOf = (short, name) =>
  ((short || '').trim() && !/\s/.test(short.trim())
    ? short.trim().slice(0, 4).toUpperCase()
    : '') ||
  String(short || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join('') ||
  String(name || 'GTH')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join('') ||
  'GTH';

export const buildPublicAgency = ({ session, settings, programmes = [] }) => {
  const profile = settings?.profile ?? {};
  const name = profile.name || session?.agency?.name || 'Your agency';
  const short = profile.short || session?.agency?.short || '';
  const shown = programmes.filter((p) => p.status !== 'draft');
  const live = shown.filter((p) => p.status === 'live');
  const sum = (key) => shown.reduce((a, p) => a + (Number(p[key]) || 0), 0);
  const reached = shown.reduce((a, p) => a + (Number(p.audienceAtPublish) || 0), 0);
  const placed = shown.reduce((a, p) => a + (p.success?.placed || 0), 0);
  const where = [profile.town, profile.region].filter(Boolean).join(', ');
  return {
    slug: session?.agency?.publicPath ?? '',
    monogram: monogramOf(short, name),
    type: profile.type || 'Government agency',
    name,
    short,
    about: `${profile.type || 'Government agency'}${where ? ` based in ${where}` : ''}, on Ghana Talent Hub.`,
    website: profile.website || '',
    contactEmail: profile.email || '',
    hero: {
      title: 'Your agency page',
      subtitle:
        'What talents and the public see in the agency directory. No MoU data appears here.',
    },
    breadcrumb: ['Directory', 'Agencies'],
    impact: {
      title: 'Programmes through GTH',
      hint: 'Aggregated · all your published programmes',
      tiles: [
        { id: 'reached', value: reached, label: 'Talents reached at publish' },
        { id: 'applied', value: sum('applicants'), label: 'Applied to a programme' },
        { id: 'funded', value: placed, label: 'Placed, hired or funded' },
        {
          id: 'live',
          value: String(live.length),
          label: live.length === 1 ? 'Programme open now' : 'Programmes open now',
        },
      ],
    },
    programmes: {
      title: 'Programmes on GTH',
      hint: `${live.length} active`,
      items: shown.slice(0, 6).map((p) => ({
        id: p.id,
        title: p.title,
        summary: [p.kind, p.place].filter(Boolean).join(' · '),
        status:
          p.status === 'live'
            ? p.deadline
              ? `Open · closes ${day(p.deadline)}`
              : 'Open'
            : 'Closed',
      })),
    },
    reach: {
      title: 'Where they work',
      caption: profile.region ? `Based in ${profile.region}` : 'National',
    },
    open: {
      title: 'Open programmes',
      items: live.slice(0, 4).map((p) => ({
        id: p.id,
        title: p.title,
        meta: [p.kind, p.deadline ? `closes ${day(p.deadline)}` : null].filter(Boolean).join(' · '),
      })),
      all: 'See all programmes →',
    },
  };
};
