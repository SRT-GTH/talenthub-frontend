/*
 * adminVerificationQueue — the Verification queue (Figma canvas 8520:12, 7.6.1a), generated from the Figma node text and styles; consumed by queue/AdminQueueView.
 * ⚠️ ASSUMPTION: frontend only, three fixed sample verifications. `to` is the review screen a row opens.
 */

/* 7.6.1a Verification · Queue 8632:410855 */
export const VERIFICATION = {
  title: 'Verification',
  sticker: '7 waiting',
  subtitle:
    'Partner KYB, institution accreditation, agency MoUs and recruiter checks. Target: decide within 2 working days.',
  tabs: [
    {
      id: 'partners',
      label: 'Partners',
      count: '3',
    },
    {
      id: 'institutions',
      label: 'Institutions',
      count: '2',
    },
    {
      id: 'all',
      label: 'All',
      count: '7',
    },
    {
      id: 'agencies',
      label: 'Agencies',
      count: '1',
    },
  ],
  tabTone: 'ink',
  defaultTab: 'all',
  chips: [
    {
      id: 'all',
      label: 'All 7',
    },
    {
      id: 'new-5',
      label: 'New 5',
    },
    {
      id: 'appeals-2',
      label: 'Appeals 2',
    },
  ],
  defaultView: 'list',
  sort: 'Oldest first',
  action: 'Claim next',
  banner: '2 verifications are past the 2-day target. Oldest first.',
  rows: [
    {
      id: 'r1',
      lead: {
        icon: 'company',
      },
      title: 'Northern Skills Foundation',
      sticker: 'KYB',
      sub: 'NGO · Tamale · 4 documents · submitted 17 Oct',
      chips: [
        {
          label: 'Waiting 1 day',
          tone: 'amber',
        },
        {
          label: '1 missing',
          tone: 'green',
        },
        {
          label: 'Partner',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Review',
        strong: true,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/verification/kyb',
    },
    {
      id: 'r2',
      lead: {
        icon: 'book',
      },
      title: 'Savannah Hills Senior High School',
      sticker: null,
      sub: 'SHS · Tamale · GES licence + 3 documents · submitted 18 Oct',
      chips: [
        {
          label: 'Waiting 3 hours',
          tone: 'amber',
        },
        {
          label: 'GES check',
          tone: 'green',
        },
        {
          label: 'Partner',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Review',
        strong: false,
      },
      age: '',
      muted: false,
      button: null,
      to: '/admin/verification/accreditation',
    },
    {
      id: 'r3',
      lead: {
        icon: 'shield',
      },
      title: 'National Youth Authority',
      sticker: 'MoU',
      sub: 'Agency · Accra · signed MoU + DPO named · submitted 15 Oct',
      chips: [
        {
          label: 'Legal check',
          tone: 'green',
        },
        {
          label: 'GES check',
          tone: 'green',
        },
        {
          label: 'Agency',
          tone: 'grey',
        },
      ],
      pill: {
        label: 'Review',
        strong: false,
      },
      age: '',
      muted: true,
      button: 'Claim',
      to: '/admin/verification/mou',
    },
  ],
};
