/*
 * Talent Wallet · set up and KYC — mock data (Figma W-01 … W-05c, canvas 8819:11130). Mock only: nothing is uploaded, checked or stored.
 * Verbatim copy from the Figma nodes.
 *   POST /wallet/kyc (ghana card number + front/back, proof of address, selfie) ; GET /wallet/kyc/status
 */
export const NEW_WALLET = {
  chip: 'For talents 18 and over',
  title: 'Your money, in the same place as your career.',
  text: 'Receive internship stipends and gig payments, turn learning into Cycles, save towards goals and apply for tuition support. Free to open. No monthly fees.',
  benefits: [
    {
      id: 'paid',
      icon: 'in',
      title: 'Get paid fast',
      text: 'Stipends and gigs land here, no bank account needed.',
    },
    {
      id: 'cycles',
      icon: 'star',
      title: 'Earn Cycles',
      text: 'Verified courses and assessments earn Cycles you can cash out.',
    },
    {
      id: 'credit',
      icon: 'chart',
      title: 'Build credit',
      text: 'Your skills and activity build a fair credit score.',
    },
  ],
  cta: 'Set up my wallet',
  note: 'About 5 minutes · Ghana Card needed',
};

export const KYC_STEP_LABELS = ['Ghana Card', 'Proof of address', 'Selfie check'];

export const KYC = {
  footer: 'Your progress is saved. You can finish later.',
  back: 'Back',
  next: 'Continue',
  card: {
    title: 'Add your Ghana Card',
    text: 'We use it to confirm it is really you. Your name must match your GTH profile.',
    field: 'Ghana Card number',
    value: 'GHA-723456789-0',
    hint: 'Find it on the front of your card, under your photo.',
    sub: 'JPG or PNG, under 5 MB',
    front: { title: 'Front of card', done: true },
    back: { title: 'Back of card', done: false },
    replace: 'Replace',
    upload: 'Upload',
  },
  address: {
    title: 'Confirm where you live',
    text: 'Any one of these, dated in the last 3 months, with your name on it.',
    kinds: ['Utility bill', 'Bank statement', 'Tenancy agreement', 'Letter from school'],
    field: 'Digital address (GhanaPost GPS)',
    value: 'GA-183-8164',
    hint: 'Optional, but it speeds up checks.',
    file: { title: 'ECG bill · September 2026', sub: 'ecg_sept_2026.pdf · 412 KB' },
    replace: 'Replace',
  },
  selfie: {
    title: 'Take a quick selfie',
    text: 'Hold your phone at eye level in good light. We will ask you to turn your head slowly.',
    caption: 'Turn your head slowly to the left',
    tips: [
      '✓ Remove glasses and caps',
      '✓ Face a window or a light',
      '✓ Only you in the picture',
      '✓ We delete the video after the check',
    ],
    footer: 'Liveness check by our verification partner. Takes about 20 seconds.',
    submit: 'Submit for review',
  },
};

export const CHECKING = {
  chip: 'Pending check · usually under 24 hours',
  title: 'Thanks, Kofi. We are checking your details.',
  text: 'Your wallet is created and waiting. As soon as your Ghana Card and selfie are approved you can receive payments. We will send a notification and an SMS.',
  timeline: [
    { id: 'received', dot: '#387455', label: 'Details received', note: 'Today, 10:42' },
    { id: 'card', dot: '#f5c344', label: 'Ghana Card check', note: 'In progress · NIA' },
    { id: 'selfie', dot: '#d9dcd3', label: 'Selfie check', note: 'Waiting' },
    { id: 'active', dot: '#d9dcd3', label: 'Wallet active', note: 'You can receive payments' },
  ],
  back: 'Back to Home',
};

export const RETAKE = {
  chip: 'We could not verify your Ghana Card',
  title: 'One quick fix and you are done.',
  text: 'The photo of the back of your card was blurry, so the numbers could not be read. Everything else is fine and saved.',
  upload: { title: 'Back of card', sub: 'Retake in good light, flat on a table', action: 'Upload' },
  primary: 'Upload a new photo',
  secondary: 'Talk to support',
};

export const ACTIVATED = {
  title: 'Your wallet is active',
  subtitle: 'You can now receive payments on GTH.',
  moved: '+340 Cycles moved in',
  from: 'From courses and assessments you finished before.',
  tips: [
    '• Share your wallet ID with Accra Tech for your stipend',
    '• Turn on a savings pot to grow your laptop fund',
  ],
  go: 'Go to my wallet',
  later: 'Later',
};
