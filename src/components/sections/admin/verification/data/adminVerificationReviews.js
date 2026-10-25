/*
 * adminVerificationReviews — the five document-review screens of Verification and approvals (Figma canvas 8520:12): 7.6.2a partner KYB 8631:8, 7.6.3a institution
 * accreditation 8634:8, 7.6.3b agency MoU 8634:936, 7.6.4a DPO data request 8634:1676, 7.6.5a appeal 8640:419746 (one layout, five contents), generated from the Figma
 * node text and styles. ⚠️ ASSUMPTION: frontend only. `tone`: ok (white pill) · warn (cream pill with a clock) · plain (grey pill); `strong`: the green document tile.
 */

export const REVIEWS = {
  kyb: {
    title: 'Verification',
    sticker: 'KYB · submitted 17 Oct',
    subtitle:
      'Northern Skills Foundation · NGO · Tamale · 25 people · submitted by Ama Kyei, Programme Lead',
    banner: 'Constitution or trust deed is missing. NGOs must provide it before approval.',
    section: {
      title: 'Submitted documents',
      badge: '4 checks · 2 matched',
    },
    docs: [
      {
        title: 'Certificate of incorporation',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Registrar-General’s Department',
          },
          {
            icon: 'calendar',
            text: 'Issued Jun 2014',
          },
          {
            icon: 'label',
            text: 'Reg. no. CG048213917',
          },
        ],
        tags: ['Company', 'NGO', 'LBG'],
        link: 'View file',
      },
      {
        title: 'Director’s Ghana Card',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Kwabena Fuseini · Executive Director',
          },
          {
            icon: 'calendar',
            text: 'Expires Mar 2031',
          },
          {
            icon: 'label',
            text: 'GHA-•••••••••-3',
          },
        ],
        tags: ['Identity', 'Director'],
        link: 'View file',
      },
      {
        title: 'Proof of address',
        chip: 'To check',
        tone: 'warn',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'ECG bill · Tamale office',
          },
          {
            icon: 'calendar',
            text: 'Issued Sep 2026',
          },
        ],
        tags: ['Address', 'Tamale'],
        link: null,
      },
      {
        title: 'Constitution or trust deed',
        chip: 'Missing',
        tone: 'plain',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Missing · required for NGOs',
          },
          {
            icon: 'calendar',
            text: 'Ask for it',
          },
        ],
        tags: ['NGO'],
        link: null,
      },
    ],
    add: ['Request a document', 'Add reviewer note'],
    rail: [
      {
        title: 'Registry checks',
        rows: [
          {
            icon: 'check-circle-fill',
            title: 'Registrar-General',
            text: 'CG048213917 matches “Northern Skills Foundation LBG”, incorporated June 2014.',
          },
          {
            icon: 'time-clock',
            title: 'Ghana Card (NIA)',
            text: 'Kwabena Fuseini · name and photo match',
          },
          {
            icon: 'user',
            title: 'Proof of address',
            text: 'ECG bill from September 2026 · matches the Tamale office',
          },
        ],
      },
      {
        title: 'Before you decide',
        rows: [
          {
            icon: 'bell',
            title: 'Approving opens talent search',
            text: 'The partner gets a Verified badge and Growth-plan access. Every decision is logged under your name.',
          },
        ],
      },
    ],
    decisions: ['Approve partner', 'Ask for more info', 'Reject'],
    id: '8631:8',
  },
  accreditation: {
    title: 'Verification',
    sticker: 'Accreditation · submitted 18 Oct',
    subtitle:
      'Savannah Hills Senior High School · SHS · Tamale · submitted by Iddrisu Abdul-Rahman, Registrar',
    banner:
      'The letter on letterhead isn’t signed by the head. Ask for a signed copy before approving.',
    section: {
      title: 'Submitted documents',
      badge: '4 checks · 2 matched',
    },
    docs: [
      {
        title: 'GES accreditation licence',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Ghana Education Service',
          },
          {
            icon: 'calendar',
            text: 'Issued Jun 2014',
          },
          {
            icon: 'label',
            text: 'GES/NR/SHS/0412',
          },
        ],
        tags: ['SHS', 'Public', 'Northern'],
        link: 'View file',
      },
      {
        title: 'Head’s Ghana Card',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Mrs Salamatu Yakubu · Headmistress',
          },
          {
            icon: 'calendar',
            text: 'Expires Mar 2031',
          },
          {
            icon: 'label',
            text: 'GHA-•••••••••-3',
          },
        ],
        tags: ['Identity', 'Head'],
        link: 'View file',
      },
      {
        title: 'Letter on letterhead',
        chip: 'To check',
        tone: 'warn',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Not signed by the head',
          },
          {
            icon: 'calendar',
            text: 'Issued Sep 2026',
          },
        ],
        tags: ['Letter', 'Unsigned'],
        link: null,
      },
      {
        title: 'Ministry of Education registration',
        chip: 'Missing',
        tone: 'plain',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Uploaded 18 Oct',
          },
          {
            icon: 'calendar',
            text: 'Ask for it',
          },
        ],
        tags: ['Public'],
        link: null,
      },
    ],
    add: ['Request a document', 'Add reviewer note'],
    rail: [
      {
        title: 'Registry checks',
        rows: [
          {
            icon: 'check-circle-fill',
            title: 'GES register',
            text: 'GES/NR/SHS/0412 matches “Savannah Hills SHS”, accredited 1998.',
          },
          {
            icon: 'time-clock',
            title: 'Ghana Card (NIA)',
            text: 'Mrs Salamatu Yakubu · name and photo match',
          },
          {
            icon: 'user',
            title: 'Letter on letterhead',
            text: 'Signature missing · ask for a signed copy',
          },
        ],
      },
      {
        title: 'Before you decide',
        rows: [
          {
            icon: 'bell',
            title: 'Approving opens rosters and credentials',
            text: 'The school can add students, verify records and issue signed credentials. Every decision is logged.',
          },
        ],
      },
    ],
    decisions: ['Approve institution', 'Ask for more info', 'Reject'],
    id: '8634:8',
  },
  mou: {
    title: 'Verification',
    sticker: 'MoU · submitted 15 Oct',
    subtitle:
      'National Youth Authority · government agency · Accra · submitted by Efua Owusu, Director, Research & Data',
    banner:
      'GTH Legal holds the countersigned MoU. Check the data categories match before approving.',
    section: {
      title: 'Submitted documents',
      badge: '4 checks · 2 matched',
    },
    docs: [
      {
        title: 'Signed MoU',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'GTH × National Youth Authority',
          },
          {
            icon: 'calendar',
            text: 'Issued Jun 2014',
          },
          {
            icon: 'label',
            text: 'GTH-MOU-2026-004',
          },
        ],
        tags: ['3 categories', 'Aggregate only', '12 months'],
        link: 'View file',
      },
      {
        title: 'Director’s staff ID',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Efua Owusu · Director, Research & Data',
          },
          {
            icon: 'calendar',
            text: 'Expires Mar 2031',
          },
          {
            icon: 'label',
            text: 'GHA-•••••••••-3',
          },
        ],
        tags: ['Identity', 'Director'],
        link: 'View file',
      },
      {
        title: 'Letter of authority',
        chip: 'To check',
        tone: 'warn',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Signed by the Chief Executive',
          },
          {
            icon: 'calendar',
            text: 'Issued Sep 2026',
          },
        ],
        tags: ['Authority', 'Accra'],
        link: null,
      },
      {
        title: 'Data protection officer',
        chip: 'Missing',
        tone: 'plain',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Ama Darko · dpo@nya.gov.gh',
          },
          {
            icon: 'calendar',
            text: 'Ask for it',
          },
        ],
        tags: ['Aggregate only'],
        link: null,
      },
    ],
    add: ['Request a document', 'Add reviewer note'],
    rail: [
      {
        title: 'Registry checks',
        rows: [
          {
            icon: 'check-circle-fill',
            title: 'GTH Legal',
            text: 'GTH-MOU-2026-004 matches the countersigned copy held by GTH Legal.',
          },
          {
            icon: 'time-clock',
            title: 'Staff ID',
            text: 'Efua Owusu · staff ID checked with NYA HR',
          },
          {
            icon: 'user',
            title: 'Authority letter',
            text: 'Signed 2 Sep 2026 by the Chief Executive',
          },
        ],
      },
      {
        title: 'Before you decide',
        rows: [
          {
            icon: 'bell',
            title: 'Approving opens the MoU view',
            text: 'NYA sees national data for its 3 categories until 18 Oct 2027. Every decision is logged.',
          },
        ],
      },
    ],
    decisions: ['Approve MoU access', 'Ask for more info', 'Reject'],
    id: '8634:936',
  },
  'data-request': {
    title: 'Data requests',
    sticker: 'DPO review · day 3 of 10',
    subtitle:
      '“NSS placements by region” · National Youth Authority · requested 2 Oct by Efua Owusu',
    banner: 'The programme manager approved on 17 Oct. Your decision completes the review.',
    section: {
      title: 'Request',
      badge: '4 parts',
    },
    docs: [
      {
        title: 'Dataset',
        chip: 'Checked',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'NSS placements by region',
          },
          {
            icon: 'calendar',
            text: 'Oct 2024 – Oct 2026',
          },
          {
            icon: 'label',
            text: 'Aggregates only',
          },
        ],
        tags: ['Outcomes', '16 regions', 'In MoU'],
        link: 'Open request',
      },
      {
        title: 'Purpose',
        chip: 'Checked',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Plan the 2027 NSS allocation by region',
          },
          {
            icon: 'calendar',
            text: 'Cabinet memo CM/2026/114',
          },
          {
            icon: 'label',
            text: 'Policy',
          },
        ],
        tags: ['Specific', 'Clear'],
        link: 'Open request',
      },
      {
        title: 'Who will see it',
        chip: 'Check',
        tone: 'warn',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Efua Owusu, Kojo Mensah (NYA)',
          },
          {
            icon: 'calendar',
            text: '2 people',
          },
        ],
        tags: ['Viewers', '2'],
        link: null,
      },
      {
        title: 'Legal basis',
        chip: 'Check',
        tone: 'plain',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'MoU clause 4.2 · Data Protection Act 2012 (Act 843)',
          },
          {
            icon: 'calendar',
            text: 'Open MoU',
          },
        ],
        tags: ['16 regions'],
        link: null,
      },
    ],
    add: ['Ask the agency a question', 'Add DPO note'],
    rail: [
      {
        title: 'Approvals',
        rows: [
          {
            icon: 'check-circle-fill',
            title: 'Programme manager',
            text: 'Yaw Boakye approved on 17 Oct: in MoU scope, purpose is specific.',
          },
          {
            icon: 'time-clock',
            title: 'Data protection officer',
            text: 'Waiting for you. Due 30 Oct.',
          },
          {
            icon: 'user',
            title: 'Small-number check',
            text: 'No groups under 5 in the requested cut.',
          },
        ],
      },
      {
        title: 'Access if approved',
        rows: [
          {
            icon: 'bell',
            title: '30 days, logged',
            text: 'Every view and download is logged. NYA’s DPO gets the access report.',
          },
        ],
      },
    ],
    decisions: ['Approve as DPO', 'Ask the agency a question', 'Reject'],
    id: '8634:1676',
  },
  appeal: {
    title: 'Verification',
    sticker: 'Appeal · filed 19 Oct',
    subtitle:
      'Northern Skills Foundation appealed a rejected KYB. You didn’t make the first decision, so you can review it.',
    banner:
      'First decision: rejected by Akua Sarfo on 18 Oct · “Registration number doesn’t match”.',
    section: {
      title: 'Submitted documents',
      badge: '4 checks · 2 matched',
    },
    docs: [
      {
        title: 'Certificate of incorporation',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Registrar-General’s Department',
          },
          {
            icon: 'calendar',
            text: 'Issued Jun 2014',
          },
          {
            icon: 'label',
            text: 'Reg. no. CG048213917',
          },
        ],
        tags: ['Company', 'NGO', 'LBG'],
        link: 'View file',
      },
      {
        title: 'Director’s Ghana Card',
        chip: 'Matched',
        tone: 'ok',
        strong: true,
        meta: [
          {
            icon: 'company',
            text: 'Kwabena Fuseini · Executive Director',
          },
          {
            icon: 'calendar',
            text: 'Expires Mar 2031',
          },
          {
            icon: 'label',
            text: 'GHA-•••••••••-3',
          },
        ],
        tags: ['Identity', 'Director'],
        link: 'View file',
      },
      {
        title: 'Proof of address',
        chip: 'To check',
        tone: 'warn',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'ECG bill · Tamale office',
          },
          {
            icon: 'calendar',
            text: 'Issued Sep 2026',
          },
        ],
        tags: ['Address', 'Tamale'],
        link: null,
      },
      {
        title: 'Constitution or trust deed',
        chip: 'Missing',
        tone: 'plain',
        strong: false,
        meta: [
          {
            icon: 'company',
            text: 'Missing · required for NGOs',
          },
          {
            icon: 'calendar',
            text: 'Ask for it',
          },
        ],
        tags: ['NGO'],
        link: null,
      },
    ],
    add: ['Request a document', 'Add reviewer note'],
    rail: [
      {
        title: 'Registry checks',
        rows: [
          {
            icon: 'check-circle-fill',
            title: 'Matched',
            text: 'CG048213917 matches “Northern Skills Foundation LBG”, incorporated June 2014.',
          },
          {
            icon: 'time-clock',
            title: 'Ghana Card (NIA)',
            text: 'Kwabena Fuseini · name and photo match',
          },
          {
            icon: 'user',
            title: 'Missing',
            text: 'ECG bill from September 2026 · matches the Tamale office',
          },
        ],
      },
      {
        title: 'Before you decide',
        rows: [
          {
            icon: 'bell',
            title: 'Approving opens talent search',
            text: 'The partner gets a Verified badge and Growth-plan access. Every decision is logged under your name.',
          },
        ],
      },
    ],
    decisions: ['Uphold appeal', 'Ask for more info', 'Keep rejection'],
    id: '8640:419746',
  },
};

export const REVIEW_PATHS = {
  kyb: 'kyb',
  accreditation: 'accreditation',
  mou: 'mou',
  'data-requests': 'data-request',
  appeals: 'appeal',
};

/* The decision dialogs: 7.6.2b approve (with a condition) · 7.6.2c ask for more information · 7.6.2d reject · 7.6.4b DPO approve · 7.6.4c DPO reject. */
export const DIALOGS = {
  approve: {
    title: 'Approve Northern Skills Foundation?',
    body: 'The constitution is still missing. Approving now gives a conditional badge for 14 days while they upload it. Ama Kyei is emailed.',
    primary: 'Approve with condition',
    secondary: 'Cancel',
  },
  info: {
    title: 'Ask for more information?',
    body: 'The partner keeps their place in the queue. They see exactly what you ask for.',
    selectLabel: 'What’s missing',
    selectOptions: ['Constitution or trust deed', 'Proof of address', 'Director’s Ghana Card'],
    messageLabel: 'Message to the partner',
    message: 'Please upload your constitution or trust deed (PDF).',
    primary: 'Send request',
    secondary: 'Cancel',
  },
  reject: {
    title: 'Reject this verification?',
    body: 'They can appeal within 14 days. A different reviewer handles appeals. Your reason is shown to the partner.',
    selectLabel: 'Reason',
    selectOptions: [
      'Registration number doesn’t match',
      'Documents are unreadable',
      'Organisation can’t be verified',
    ],
    messageLabel: 'Note to the partner',
    message: 'CG048213917 is registered to a different organisation.',
    primary: 'Reject',
    secondary: 'Cancel',
  },
  dpoApprove: {
    title: 'Approve this request?',
    body: 'NYA can open “NSS placements by region” for the window you set. Efua Owusu is emailed.',
    selectLabel: 'Access window',
    selectOptions: ['30 days', '14 days', '7 days'],
    messageLabel: 'Conditions',
    message: 'Aggregates only · groups under 5 hidden',
    primary: 'Approve',
    secondary: 'Cancel',
  },
  dpoReject: {
    title: 'Reject this request?',
    body: 'NYA sees your reason and can appeal within 14 days. A different reviewer handles appeals.',
    selectLabel: 'Reason',
    selectOptions: [
      'Outside the MoU categories',
      'Purpose is too broad',
      'Groups under 5 would show',
    ],
    messageLabel: 'Note to the agency',
    message: 'Ask for regional totals instead.',
    primary: 'Reject request',
    secondary: 'Cancel',
  },
};
