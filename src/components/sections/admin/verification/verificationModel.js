import { humanize, shortDate, timeAgo } from '../../../../services/admin.api.js';

/*
 * verificationModel — maps /api/admin/verification records onto the queue rows (AdminQueueView) and the
 * document-review layout (VerificationReviewView). Two kinds today: recruiter KYB and requests to post under an
 * organisation's name (affiliation).
 */

export const KIND_LABEL = { kyb: 'KYB', affiliation: 'Affiliation' };

export const VERIF_TABS = [
  { id: 'all', label: 'All' },
  { id: 'kyb', label: 'Recruiter KYB' },
  { id: 'affiliation', label: 'Affiliation requests' },
];

export const VERIF_CHIPS = [
  { id: 'waiting', label: 'Waiting' },
  { id: 'decided', label: 'Decided (90 days)' },
];

export const ASK_TOPICS = [
  'Registration certificate',
  'TIN certificate',
  'Recruitment agency licence',
  'A clearer copy of a document',
  'Something else',
];

export const REJECT_REASONS = {
  kyb: [
    'Registration number doesn’t match',
    'Documents are unreadable',
    'Business can’t be verified',
    'Other',
  ],
  affiliation: [
    'Not known to the organisation',
    'Organisation asked us to decline',
    'Duplicate request',
    'Other',
  ],
};

const waitingText = (h) =>
  h == null
    ? ''
    : h < 1
      ? 'Waiting under an hour'
      : h < 48
        ? `Waiting ${h} hours`
        : `Waiting ${Math.round(h / 24)} days`;

export const rowOf = (r) => ({
  id: r.id,
  lead: { icon: r.kind === 'kyb' ? 'company' : 'shield' },
  title: r.title,
  sticker: KIND_LABEL[r.kind],
  sub: [
    r.orgType ? humanize(r.orgType) : null,
    r.place,
    r.kind === 'kyb' ? `${r.documents.sent} of ${r.documents.total} documents` : null,
    r.submittedAt ? `submitted ${shortDate(r.submittedAt)}` : null,
  ]
    .filter(Boolean)
    .join(' · '),
  chips: [
    r.decision
      ? {
          label: r.decision === 'approved' ? 'Approved' : 'Rejected',
          tone: r.decision === 'approved' ? 'green' : 'amber',
        }
      : { label: waitingText(r.waitingHours), tone: 'amber' },
    r.overdue ? { label: 'Past 2-day target', tone: 'amber' } : null,
    r.kind === 'kyb' && r.documents.sent < r.documents.total && !r.decision
      ? { label: `${r.documents.total - r.documents.sent} not sent`, tone: 'amber' }
      : null,
    { label: 'Recruiter', tone: 'grey' },
  ].filter(Boolean),
  pill: { label: r.decision ? 'View' : 'Review', strong: !r.decision && r.overdue },
  age: r.decidedAt ? shortDate(r.decidedAt) : '',
  muted: Boolean(r.decision),
  button: null,
  to: `/admin/verification/${r.id}?kind=${r.kind}`,
});

const ACTION_LABEL = {
  KYB_DOCUMENTS_SUBMITTED: 'KYB documents sent',
  KYB_APPROVED: 'KYB approved',
  KYB_REJECTED: 'KYB rejected',
  KYB_INFO_REQUESTED: 'More information asked for',
  RECRUITER_REGISTERED: 'Recruiter signed up',
  AFFILIATION_REQUESTED: 'Asked to join an organisation',
  AFFILIATION_REQUEST_SENT: 'Asked to post under an organisation’s name',
  AFFILIATION_APPROVED: 'Affiliation approved',
  AFFILIATION_DENIED: 'Affiliation rejected',
};
const actionLabel = (a) => ACTION_LABEL[a] || humanize(a);

const DOC_TONE = {
  approved: 'ok',
  verified: 'ok',
  pending: 'warn',
  missing: 'plain',
  rejected: 'plain',
};
const DOC_CHIP = {
  approved: 'Approved',
  verified: 'Approved',
  pending: 'To check',
  missing: 'Not sent',
  rejected: 'Rejected',
};

/** The review layout for one record (VerificationReviewView `review`). */
export const reviewOf = (d) => {
  const waiting = d.state === 'waiting';
  const isKyb = d.kind === 'kyb';
  const c = d.company;
  const docs = isKyb
    ? d.documents.map((doc) => ({
        title: doc.label,
        chip: DOC_CHIP[doc.status] || humanize(doc.status),
        tone: DOC_TONE[doc.status] || 'plain',
        strong: doc.status === 'approved' || doc.status === 'verified',
        meta: [
          ...(c.name ? [{ icon: 'company', text: c.name }] : []),
          {
            icon: 'calendar',
            text: doc.uploadedAt ? `Uploaded ${shortDate(doc.uploadedAt)}` : 'Not uploaded',
          },
        ],
        tags: [],
        link: doc.fileUrl ? 'View file' : null,
        href: doc.fileUrl,
      }))
    : [
        {
          title: d.affiliation.orgName || 'Organisation',
          chip: humanize(d.affiliation.status),
          tone:
            d.affiliation.status === 'approved'
              ? 'ok'
              : d.affiliation.status === 'pending'
                ? 'warn'
                : 'plain',
          strong: d.affiliation.status === 'approved',
          meta: [
            {
              icon: 'label',
              text: d.affiliation.orgType ? humanize(d.affiliation.orgType) : 'Organisation',
            },
            {
              icon: 'calendar',
              text: d.submittedAt ? `Asked ${shortDate(d.submittedAt)}` : 'Date unknown',
            },
          ],
          tags: d.affiliation.note ? [`“${d.affiliation.note}”`] : [],
          link: null,
        },
      ];
  const sent = isKyb ? d.documents.filter((x) => x.fileUrl).length : 1;
  const rail = [
    {
      title: 'Recruiter',
      rows: [
        {
          icon: 'user',
          title: d.recruiter.name || 'Name not given',
          text: [d.recruiter.email, d.recruiter.phone].filter(Boolean).join(' · ') || '–',
        },
        {
          icon: 'check-circle-fill',
          title: c.name || 'Business',
          text:
            [
              c.industry,
              c.size ? `${c.size} staff` : null,
              c.recruiterType ? humanize(c.recruiterType) : null,
              [c.district, c.region].filter(Boolean).join(', '),
            ]
              .filter(Boolean)
              .join(' · ') || 'No business details yet',
        },
        ...(d.contactPerson?.name ||
        (d.contactPerson?.email && d.contactPerson.email !== d.recruiter.email)
          ? [
              {
                icon: 'user',
                title: 'Contact person',
                text: [
                  d.contactPerson.name,
                  d.contactPerson.role,
                  d.contactPerson.email,
                  d.contactPerson.phone,
                ]
                  .filter(Boolean)
                  .join(' · '),
              },
            ]
          : []),
        ...(d.plan?.tier
          ? [
              {
                icon: 'bell',
                title: 'Plan',
                text: `${humanize(d.plan.tier)}${d.plan.billing ? ` · ${d.plan.billing}` : ''} · payment ${humanize(d.payment?.status || 'none').toLowerCase()}`,
              },
            ]
          : []),
      ],
    },
    {
      title: 'History',
      rows: d.history.length
        ? d.history.slice(0, 6).map((h) => ({
            icon: 'time-clock',
            title: actionLabel(h.action),
            text: [timeAgo(h.at), h.by, h.org, h.topic, h.note ? `“${h.note}”` : null]
              .filter(Boolean)
              .join(' · '),
          }))
        : [{ icon: 'time-clock', title: 'Nothing logged yet', text: 'Decisions appear here.' }],
    },
  ];
  const lastAsk = d.history.find((h) => h.action === 'KYB_INFO_REQUESTED');
  const banner =
    d.state === 'returned'
      ? `Sent back to the recruiter for more information${lastAsk ? ` (${lastAsk.topic || 'details'})` : ''}. It comes back to the queue when they resubmit.`
      : d.state === 'not_submitted'
        ? 'The recruiter hasn’t sent KYB documents yet.'
        : !waiting
          ? `${d.decision === 'approved' ? 'Approved' : 'Rejected'}${d.decidedAt ? ` on ${shortDate(d.decidedAt)}` : ''}${
              d.verification.rejectionReason && d.decision === 'rejected' && isKyb
                ? `: “${d.verification.rejectionReason}”`
                : ''
            }${!isKyb && d.affiliation.decisionNote ? `: “${d.affiliation.decisionNote}”` : ''}`
          : d.overdue
            ? `Waiting ${Math.round((d.waitingHours || 0) / 24)} days: past the 2-working-day target.`
            : `${waitingText(d.waitingHours) || 'Waiting'}. Target: decide within 2 working days.`;
  return {
    title: isKyb ? c.name || d.recruiter.name || 'Recruiter KYB' : d.title,
    sticker: KIND_LABEL[d.kind],
    subtitle: isKyb
      ? 'Check the documents match the business, then approve or reject. The recruiter is told either way.'
      : `${d.recruiter.name || 'A recruiter'} wants to post jobs under ${d.affiliation.orgName || 'this organisation'}’s name.${
          d.affiliation.orgHasAdmin ? ' The organisation’s Primary Admin can also decide this.' : ''
        }`,
    banner,
    section: {
      title: isKyb ? 'Submitted documents' : 'Request',
      badge: isKyb ? `${sent} of ${d.documents.length} sent` : humanize(d.affiliation.status),
    },
    docs,
    add: [],
    rail,
    decisions: waiting ? ['Approve', isKyb ? 'Ask for more info' : null, 'Reject'] : null,
  };
};
