/*
 * Recruiter Settings · Account, Organisation, Team and roles - mock data + copy (Figma "Recruiter - Settings & Account" 10161:75722).
 * Frames: SR-01 Account 10161:77483, SR-20 Account · work email error 10161:83955, SR-02 Organisation 10161:77780, SR-03 Team and roles 10161:78103,
 * SR-04 Invite teammate 10161:78453, SR-05 role dropdown open 10161:78832, SR-06 Invite sent toast 10161:79229, SR-07 Remove teammate 10161:79590.
 * Every string is copied from the node `characters`. Shapes mimic a future API payload (swap for a service later).
 *
 * URL contract (all keys live next to `?tab=`):
 *   Account       ?state=email-error      SR-20 (work email at gmail.com + hint; the photo row sits in "Account type" as that frame draws it). Typing a non-work address sets it, a work address clears it.
 *   Team          ?modal=invite-teammate  SR-04 (NOT ?modal=invite: the Help builder uses that for the talent-style Invite dialog on every recruiter page) the invite dialog (empty). `&email=ama.k@silverrock.tech` seeds the typed address (the frame draws it filled); `&role=open` = SR-05 (role menu open)
 *                 ?modal=remove-teammate  SR-07 confirm; `&member=<id>` picks the teammate (default `efua`)
 *                 ?toast=invite-sent      SR-06 (`&to=` = the address in the toast, default ama.k@silverrock.tech); other toasts: `invite-resent`, `invite-cancelled` (`&to=<email>`), `member-removed` (`&to=<name>`) (⚠️ not drawn)
 *                 ?row=<id>               the "…" menu of one row is open
 */

export const ORG_NAME = 'Silver Rock Technology';
export const ORG_DOMAIN = 'silverrock.tech';

/* ---------------- SR-01 / SR-20 Account ---------------- */
export const ACCOUNT_CARD = {
  title: 'Personal details',
  description: 'How you appear to candidates in Messages and on job posts.',
};
export const ACCOUNT_PHOTO = {
  // SR-01 draws the photo block inside "Personal details" with an "Upload new logo" button (a Figma copy leftover, kept as drawn); SR-20 draws "Profile photo" with "Change photo" in "Account type".
  title: 'Profile Photo',
  rowTitle: 'Profile photo',
  description: 'Candidates see your photo next to your messages.',
  button: 'Upload new logo',
  rowButton: 'Change photo',
};
export const ACCOUNT_FIELDS = [
  { id: 'fullName', label: 'Full name', required: true, type: 'text', autoComplete: 'name' },
  {
    id: 'jobTitle',
    label: 'Job title',
    required: true,
    type: 'text',
    autoComplete: 'organization-title',
  },
  { id: 'email', label: 'Work email', required: true, type: 'email', autoComplete: 'email' },
  { id: 'phone', label: 'Phone', required: false, type: 'tel', autoComplete: 'tel' },
];
export const ACCOUNT_VALUES = {
  fullName: 'Joel Adade Kofie',
  jobTitle: 'HR Lead',
  email: 'joel.kofie@silverrock.tech',
  phone: '+233 24 412 3456',
};
// SR-20: the value drawn in the error frame and its hint (the hint uses a curly apostrophe).
export const ACCOUNT_EMAIL_ERROR_VALUE = 'joel.kofie@gmail.com';
export const ACCOUNT_EMAIL_ERROR_HINT =
  'Use your work email at silverrock.tech so candidates know you’re a real recruiter.';
export const ACCOUNT_TYPE = {
  title: 'Account type',
  recruiterTitle: 'Recruiter · Silver Rock Technology',
  recruiterDescription: 'Dedicated recruiter for one organisation. Role: Admin',
  change: 'Change',
  publicTitle: 'Public recruiter profile',
  publicUrl: 'gth.com/recruiter/joel-adade-kofie',
  preview: 'Preview as talent',
};
export const FOOTER_ACTIONS = { cancel: 'Cancel', save: 'Save changes' };

/* ---------------- SR-02 Organisation ---------------- */
export const ORG_COMPANY = {
  title: 'Company details',
  description: 'Shown on every job you post and in Talent Search invites.',
  logoTitle: 'Company logo',
  logoDescription: 'PNG or SVG, at least 256 × 256',
  logoButton: 'Upload new logo',
  aboutLabel: 'About the company',
  aboutMax: 500,
};
export const ORG_VALUES = {
  name: 'Silver Rock Technology',
  industry: 'technology-fintech',
  size: '50-200',
  website: 'silverrock.tech',
  office: 'Airport City, Accra',
  about: 'We build payments and savings tools for small businesses across West Africa.',
};
// ⚠️ ASSUMPTION: only "Technology · Fintech" and "50–200 people" are drawn; the other options complete the two dropdowns.
export const ORG_INDUSTRIES = [
  { value: 'technology-fintech', label: 'Technology · Fintech' },
  { value: 'technology-software', label: 'Technology · Software' },
  { value: 'technology-telecoms', label: 'Technology · Telecoms' },
  { value: 'finance-banking', label: 'Finance · Banking' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' },
];
export const ORG_SIZES = [
  { value: '1-10', label: '1–10 people' },
  { value: '11-49', label: '11–49 people' },
  { value: '50-200', label: '50–200 people' },
  { value: '201-500', label: '201–500 people' },
  { value: '500+', label: '500+ people' },
];
export const ORG_FIELD_LABELS = {
  name: 'Company name',
  industry: 'Industry',
  size: 'Company size',
  website: 'Website',
  office: 'Head office',
};
export const ORG_VERIFICATION = {
  title: 'Verification',
  description: 'Verified employers get a badge and 3× more replies to invites.',
  chip: 'Verified',
  items: [
    { id: 'kyb', title: 'KYB · Business registration', detail: 'Verified on 2 Oct 2026' },
    { id: 'kyc', title: 'KYC · Your identity', detail: 'Verified on 1 Oct 2026' },
  ],
};
export const ORG_LIST = {
  title: 'Your organisations',
  description: 'Switch between organisations from the top bar.',
  items: [
    {
      id: 'silver-rock',
      name: 'Silver Rock Technology',
      detail: 'Admin · current',
      chip: 'Current',
      tone: 'mint',
    },
    {
      id: 'hubtel',
      name: 'Hubtel Ltd',
      detail: 'Recruiter · membership pending approval',
      chip: 'Pending',
      tone: 'amber',
    },
  ],
};

/* ---------------- SR-03..SR-07 Team and roles ---------------- */
export const TEAM_PLAN = { name: 'Professional', seats: 10 };
export const TEAM_CARD = {
  title: 'Team members',
  seatsUsed: (used) => `${used} of ${TEAM_PLAN.seats} seats used on the ${TEAM_PLAN.name} plan.`,
  description: `People who can post jobs and manage candidates at ${ORG_NAME}.`,
  invite: 'Invite teammate',
  pendingChip: 'Invite pending',
  resend: 'Resend',
  menuLabel: (name) => `More actions for ${name}`,
  roleLabel: (name) => `Role for ${name}`,
};

// Role menu (SR-05: titles + helper lines) and "What each role can do" (SR-03: longer lines).
export const ROLES = [
  {
    value: 'admin',
    label: 'Admin',
    hint: 'Everything, including billing and team',
    can: 'Everything, including billing, verification and team',
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    hint: 'Post jobs, search talent, move candidates',
    can: 'Post jobs, search talent, message and move candidates',
  },
  {
    value: 'hiring-manager',
    label: 'Hiring manager',
    hint: 'Review candidates and give feedback',
    can: 'Review candidates and leave interview feedback on assigned jobs',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    hint: 'Read-only',
    can: 'Read-only access to jobs and pipelines',
  },
];
export const ROLES_CARD = { title: 'What each role can do' };

// Avatar faces per member (initials on a tint). `status: 'pending'` = invited, not joined.
export const TEAM_MEMBERS = [
  {
    id: 'joel',
    name: 'Joel Adade Kofie',
    email: 'joel.kofie@silverrock.tech',
    initials: 'JK',
    role: 'admin',
    isYou: true,
    status: 'active',
    avatar: 'bg-[#ebf1ec] text-[#2a5730]',
  },
  {
    id: 'akua',
    name: 'Akua Mensah',
    email: 'akua.m@silverrock.tech',
    initials: 'AM',
    role: 'recruiter',
    status: 'active',
    avatar: 'bg-[#f5f3ff] text-[#6d28d9]',
  },
  {
    id: 'kwabena',
    name: 'Kwabena Danso',
    email: 'kwabena@silverrock.tech',
    initials: 'KD',
    role: 'hiring-manager',
    status: 'active',
    avatar: 'bg-[#eaeffb] text-[#244a9f]',
  },
  {
    id: 'efua',
    name: 'Efua Arthur',
    email: 'efua@silverrock.tech',
    initials: 'EA',
    role: 'viewer',
    status: 'active',
    openConversations: 2,
    avatar: 'bg-[#faf4e8] text-[#463409]',
  },
  {
    id: 'nii',
    name: 'Nii Okai',
    email: 'nii@silverrock.tech',
    initials: 'NO',
    role: 'viewer',
    status: 'pending',
    avatar: 'bg-[#bcb7a8] text-[#575755]',
  },
];
// ⚠️ ASSUMPTION: the "…" row menus are not drawn open; these entries complete the flow (remove opens the SR-07 confirm).
export const MEMBER_MENU = {
  you: [{ id: 'account', label: 'My account settings' }],
  active: [{ id: 'remove', label: 'Remove from team', tone: 'danger' }],
  pending: [
    { id: 'resend', label: 'Resend invite' },
    { id: 'cancel', label: 'Cancel invite', tone: 'danger' },
  ],
};
export const DEFAULT_REMOVE_ID = 'efua';

export const INVITE_DIALOG = {
  title: 'Invite a teammate',
  body: `They’ll get an email to join ${ORG_NAME} on GTH.`,
  emailLabel: 'Work email',
  roleLabel: 'Role',
  defaultRole: 'recruiter',
  accessLabel: 'Access to jobs',
  access: [
    { value: 'all', label: 'All current and future jobs' },
    { value: 'selected', label: 'Only selected jobs', hint: 'Good for hiring managers' },
  ],
  freeSeats: (n) => `Uses 1 of ${n} free seats`,
  // ⚠️ ASSUMPTION: shown instead of the line above when every seat is taken.
  noSeats: 'No free seats left on your plan.',
  cancel: 'Cancel',
  send: 'Send invite',
  // ⚠️ ASSUMPTION: validation copy is not drawn.
  errors: {
    invalid: 'Enter a work email, for example name@silverrock.tech.',
    duplicate: 'This person is already on your team.',
  },
};
export const REMOVE_DIALOG = {
  title: (name) => `Remove ${name}?`,
  body: (first) =>
    `${first} will lose access to ${ORG_NAME} right away. Their notes and feedback stay with your team.`,
  reassign: (first, n) => `Reassign ${first}’s ${n} open conversations to me`,
  cancel: 'Cancel',
  confirm: 'Remove teammate',
};
export const TEAM_TOASTS = {
  'invite-sent': (email) => ({
    title: `Success - Invite sent to ${email}`,
    message: 'They’ll appear as pending until they join',
  }),
  // ⚠️ ASSUMPTION: the three toasts below are not drawn; they follow the drawn "Success - …" pattern.
  'invite-resent': (email) => ({
    title: `Success - Invite resent to ${email}`,
    message: 'We sent them a fresh link',
  }),
  'invite-cancelled': (email) => ({
    title: `Success - Invite to ${email} cancelled`,
    message: 'The link they received no longer works',
  }),
  'member-removed': (name) => ({
    title: `Success - ${name} removed`,
    message: 'They lost access to your organisation right away',
  }),
};
export const DEFAULT_TOAST_EMAIL = 'ama.k@silverrock.tech';
