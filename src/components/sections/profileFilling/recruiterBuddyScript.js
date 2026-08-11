/*
 * recruiterBuddyScript.js — canned conversation data for the Recruiter
 * Career Buddy (Figma 5132:65865 landing, 5132:68604–69042 KYB/KYC,
 * 5132:66255–67352 Complete Company Profile, 5132:69191/69422 Post a Job,
 * 5132:69702–73286 Manual job form).
 *
 * Same FSM shape as careerBuddyScript.js so ChatThread / section wiring
 * stay identical. reply(inputText) may echo the recruiter's real typed
 * text (production-shaped); Figma strings are the demo fallbacks / bot
 * copy. Consumed by the shared CareerBuddySection shell (role = recruiter).
 */

import {
  JOB_FILE_EXTRACTED_BOT,
  JOB_FILE_REVIEW_CTA,
  JOB_FILE_UPLOAD_PROMPT,
  JOB_MANUAL_PROMPT_BOT,
  JOB_POSTED_SUCCESS_BOT,
} from './jobPostFormData.js';
import {
  JOB_CONV_AUTO,
  JOB_CONV_TITLE_ASK,
  JOB_CONV_TITLE_FALLBACK,
  JOB_CONV_COMPANY_ASK,
  JOB_CONV_COMPANY_FALLBACK,
  JOB_CONV_INDUSTRY_ASK,
  JOB_CONV_INDUSTRY_FALLBACK,
  JOB_CONV_DEPARTMENT_ASK,
  JOB_CONV_DEPARTMENT_FALLBACK,
  JOB_CONV_LOCATION_FALLBACK,
  JOB_CONV_TYPE_FALLBACK,
  JOB_CONV_EXPERIENCE_ASK,
  JOB_CONV_EXPERIENCE_FALLBACK,
  JOB_CONV_DESCRIPTION_ASK,
  JOB_CONV_DESCRIPTION_FALLBACK,
  JOB_CONV_RESP_FALLBACK,
  JOB_CONV_RESP_REWRITE,
  JOB_CONV_RESP_CONFIRM_FALLBACK,
  JOB_CONV_QUALS_ASK,
  JOB_CONV_QUALS_FALLBACK,
  JOB_CONV_QUALS_REWRITE,
  JOB_CONV_QUALS_CONFIRM_FALLBACK,
  JOB_CONV_SALARY_ASK,
  JOB_CONV_SALARY_FALLBACK,
  JOB_CONV_BENEFITS_FALLBACK,
  JOB_CONV_PERKS_ASK,
  JOB_CONV_PERKS_FALLBACK,
  JOB_CONV_DATES_ASK,
  JOB_CONV_DATES_FALLBACK,
  JOB_CONV_COMPLETE_BOT,
  jobConvLocationAskFor,
  jobConvTypeAskFor,
  jobConvRespAskFor,
  jobConvBenefitsAskFor,
} from './jobConversationData.js';

export {
  JOB_PANEL_PROGRESS,
  applyJobConvAnswer,
  buildJobsPanelFields,
} from './jobConversationData.js';

export const RECRUITER_NAME = 'Mr.Whitmore';

// Figma 5132:65865 / 65914-65916 — first-visit hero (recruiter).
// Shape matches CareerBuddyHero (`eyebrow` + `headlineRest`).
export const RECRUITER_FIRST_TIME_HERO = {
  eyebrow: 'Ghana Talent AI',
  headlineRest: ' — AI-powered talent guidance and mentorship hub.',
  subtitle: 'Your lifelong digital mentor — from SHS to career success',
  buddyCardLabel: 'Career Buddy,',
  buddyCardSubtitle: 'your personal recruitment assistant',
};

/**
 * Post a Job mode cards — Figma 5132:69550 / 69563 / 69577.
 * Icons merged at render time in CareerBuddySection (MODE_CARD_ICONS).
 */
export const POST_JOB_MODE_CARDS = [
  {
    id: 'file-upload',
    title: 'File Upload',
    description: "Upload an existing job description and we'll extract the details for you.",
  },
  {
    id: 'conversation-ai',
    title: 'Conversation with AI',
    description: 'Answer a few quick questions and let AI draft the posting with you.',
  },
  {
    id: 'manual-creation',
    title: 'Manual Creation',
    description: 'Fill in the job details yourself using a structured form.',
  },
];

// Recruiter Panel shows Company Info. + Jobs (Conversation AI / Manual form
// draft). Other stage rows stay out of the panel until designed.
export const RECRUITER_BUDDY_STAGES = [
  {
    id: 'company-info',
    trailLabel: 'Company',
    panelLabel: 'Company Info.',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'jobs',
    trailLabel: 'Jobs',
    panelLabel: 'Jobs',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'kyb',
    trailLabel: 'KYB',
    panelLabel: 'KYB / KYC',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'pipeline',
    trailLabel: 'Pipeline',
    panelLabel: 'Pipeline',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'team',
    trailLabel: 'Team',
    panelLabel: 'Team',
    completionPct: 0,
    status: 'not-started',
  },
];

/** Landing chip — Figma 5132:65985 / 68727 (verbatim). */
export const KYB_UPLOAD_CTA =
  'Upload KYB/KYC Documents (Optional) - Build trust with a verified badge';

/**
 * Auto-echo after picking the KYB CTA — Figma 5132:68851 (shorter than the
 * chip label; keep both strings exact).
 */
export const KYB_UPLOAD_AUTO = 'Upload KYB/KYC Documents - Get verified to start posting jobs';

/** Bot prompt — Figma 5132:68917 (curly apostrophe + double space before KYB). */
export const KYB_UPLOAD_PROMPT =
  'Okay, That\u2019s a wonderful option. You can go ahead and upload your  KYB/KYC\ndocument.';

/** Success — Figma 5132:69042. */
export const KYB_VERIFIED_BOT =
  'That\u2019s wonderful. You have been successfully verified \uD83D\uDEE1\uFE0F';

// ── Complete Company Profile — Figma 5132:66255–67352 / strip 66562–66576 ──

/** [Auto] echo — Figma 5132:66496. */
export const COMPANY_PROFILE_AUTO = 'Complete Company Profile';

/** Opening bot — Figma 5132:66562. */
export const COMPANY_BIO_ASK =
  "Perfect! Let's have a conversation about your company. This will help candidates understand who you are and what you offer. \uD83C\uDF1F\n\nFirst question: Tell me about your company. What does Silver Rock Technologies do?\nJust describe it naturally — what products/services do you offer? What industry are you in? What makes your company unique?";

/** Demo fallback user bio — Figma 5132:66563 (used only if input empty). */
export const COMPANY_BIO_USER_FALLBACK =
  "We're a tech startup focused on building mobile apps for small businesses. We help SMEs digitize their operations and reach more customers online.";

/** Bot rewrite — Figma 5132:66564. */
export const COMPANY_BIO_REWRITE =
  "That's fantastic! A tech startup helping SMEs — very impactful work. \uD83D\uDC4F\n\nHere's what I've captured:\n\nAbout SRT:\n\"We are a technology startup specializing in mobile application development for small and medium enterprises. Our mission is to help SMEs digitize their operations and expand their customer reach through innovative digital solutions.\"\n\nDoes this sound good, or would you like me to adjust the wording?";

/** Canonical bio written to the panel — Figma 5132:66804. */
export const COMPANY_BIO_CANONICAL =
  'We are a technology startup specializing in mobile application development for small and medium enterprises. Our mission is to help SMEs digitize their operations and expand their customer reach through innovative digital solutions.';

/** Culture ask — Figma 5132:66566 (`[Company Name]` verbatim). */
export const COMPANY_CULTURE_ASK =
  "Now, tell me about your company culture. What's it like to work at [Company Name]?\n\nThink about:\n- Work environment (collaborative, innovative, fast-paced?)\n- Team values (integrity, creativity, excellence?)\n- What employees love about working there - Any unique perks or traditions";

export const COMPANY_CULTURE_USER_FALLBACK =
  "We have a very collaborative and innovative culture. We encourage creativity and give our team autonomy. We're fast-paced but flexible with work hours. Team lunches every Friday, and we invest heavily in learning and development.";

/** Culture summary — Figma 5132:66568. */
export const COMPANY_CULTURE_REWRITE =
  'Wonderful! That sounds like a great place to work. \uD83C\uDF1F\n\nCompany Culture & Values:\n- Collaborative and innovation-driven environment\n- Encourages creativity and employee autonomy\n- Fast-paced yet flexible working arrangements\n- Weekly team bonding (Friday lunches)\n- Strong focus on learning and professional development\n\nCore Values:\n- Innovation\n- Collaboration\n- Autonomy & Trust\n- Continuous Learning\n\n Does this capture your culture well?';

/** Panel Culture & Values — Figma 5132:66804. */
export const COMPANY_CULTURE_PANEL =
  'Collaborative Innovation, Team Bonding, Growth-Focused, Agile & Flexible';

/** Location ask — Figma 5132:66570. */
export const COMPANY_LOCATION_ASK =
  'Perfect! \u2705\n\n**Where are your office(s) located?**\nPlease provide:\n- City/Town\n- Specific area/neighborhood (optional)\n- Full address (optional — helps candidates find you)\n\nIf you have multiple locations, list them all!';

export const COMPANY_LOCATION_USER_FALLBACK =
  "We're in East Legon, Accra. Specifically on Liberation Road near the A&C Mall.";

/** Location confirm — Figma 5132:66572. */
export const COMPANY_LOCATION_REWRITE =
  'Got it! \u2705\n\n**Office Location:**\nEast Legon, Accra\nLiberation Road (near A&C Mall)\n\nWould you like to add:\n- Google Maps link?\n- Office photos?\n- Multiple locations?';

/** Panel address — Figma 5132:66804 (canonical directory form). */
export const COMPANY_ADDRESS_PANEL = '10 Jungle Road, East Legon, Accra, Ghana';

/** Socials ask — Figma 5132:66574. */
export const COMPANY_SOCIALS_ASK =
  "**Let's add your online presence so candidates can learn more about you. \uD83C\uDF10**\n\nWhat are your company's:\n- Website URL\n- LinkedIn page\n- Facebook page\n- Instagram handle\n- Twitter/X handle\n- Other social media\n\nJust share what you have — no pressure to have everything!";

export const COMPANY_SOCIALS_USER_FALLBACK =
  'Website: www.silverrocktech.com\nLinkedIn: linkedin.com/company/silver-rock-technology-services\nInstagram: @srt_gh';

/**
 * Congrats — Figma 5132:66576.
 * Screenshot / product wording: "recruiter panel" (Figma instance said
 * "talent profile panel").
 */
export const COMPANY_COMPLETE_BOT =
  "\uD83C\uDF89 Congratulations! Your company profile is now 100% complete! Go ahead and modify or confirm on the recruiter panel.\n\nWhat this means for you:\n- Candidates can now see your full company profile\n- You'll appear in company directory searches\n- Your job posts look more professional and trustworthy\n- Candidates are 3x more likely to apply when they see a complete profile";

/**
 * Full Company Info. field sheet — Figma 5132:66804 (view-details).
 * `kind: 'photo'` renders the logo + status row. KYB value is overwritten
 * at runtime from session verification state (production).
 */
export const COMPANY_INFO_FIELDS = [
  { label: 'Profile Photo', value: 'Uploaded · Visible to everyone', kind: 'photo' },
  { label: 'Name', value: 'Silver Rock Technologies Ltd' },
  { label: 'Email', value: 'info.srtsghana@silverrocktech.com' },
  { label: 'Bio', value: COMPANY_BIO_CANONICAL, kind: 'bio' },
  { label: 'Company size', value: '11–50 employees' },
  { label: 'Phone', value: '+233 24 248 4435' },
  { label: 'Address', value: COMPANY_ADDRESS_PANEL },
  { label: 'Culture & Values', value: COMPANY_CULTURE_PANEL },
  { label: 'Services Offered', value: 'Mobile App Development, UIUX Design' },
  { label: 'KYB/KYC Status', value: 'Not verified', verified: false },
];

/**
 * Completion % milestones while the company Q&A runs (animate during chat).
 * Final 100% lands with confirmsStageId → awaiting-review.
 */
export const COMPANY_PANEL_PROGRESS = {
  'company-profile-start': 20,
  'company-bio-rewrite': 35,
  'company-culture-ask': 50,
  'company-culture-capture': 60,
  'company-location-ask': 70,
  'company-location-capture': 80,
  'company-socials-ask': 90,
  'company-complete': 100,
};

let uid = 0;
const nextId = () => `r-msg-${++uid}`;

const bot = (text, extra = {}) => ({ id: nextId(), sender: 'bot', text, ...extra });
const user = (text, extra = {}) => ({
  id: nextId(),
  sender: 'user',
  text,
  personaLabel: RECRUITER_NAME,
  ...extra,
});

const SETUP_CHIPS = ['Post Your First Job', 'Complete Company Profile', KYB_UPLOAD_CTA];

const FAQ_CHIPS = [
  'Tell me more about GTH',
  'How does GTH match me with competent employees?',
  'Is my personal information safe on GTH',
];

const NEXT_PROFILE_CHIPS = ['Post Your First Job', KYB_UPLOAD_CTA, 'Tell me more about GTH'];

export const RECRUITER_BUDDY_NODES = {
  welcome: {
    hero: 'first-time',
    seedMessages: () => [
      bot(
        "Hi there! 👋 Welcome to Ghana Talent AI. I'm Career Buddy, I'm here to help you find the best talent in Ghana.\nWith our platform, you can: Post jobs and reach thousands of qualified candidates, Review applicants matched to your requirements, Track applications and manage your hiring pipeline, Access verified talent with complete profiles.",
        { linkButton: { label: 'Visit our About page' } }
      ),
    ],
    suggestedReplies: [...SETUP_CHIPS, ...FAQ_CHIPS],
    next: {
      'Post Your First Job': 'post-a-job-options',
      'Complete Company Profile': 'company-profile-start',
      [KYB_UPLOAD_CTA]: 'kyb-prompt',
      'Tell me more about GTH': 'faq-about',
      'How does GTH match me with competent employees?': 'faq-matching',
      'Is my personal information safe on GTH': 'faq-privacy',
    },
  },

  'faq-about': {
    reply: () => [
      user('Tell me more about GTH'),
      bot(
        'Happy to — a fuller About walkthrough for recruiters is coming soon. In the meantime, pick a setup step below.'
      ),
    ],
    suggestedReplies: SETUP_CHIPS,
    next: {
      'Post Your First Job': 'post-a-job-options',
      'Complete Company Profile': 'company-profile-start',
      [KYB_UPLOAD_CTA]: 'kyb-prompt',
    },
  },

  'faq-matching': {
    reply: () => [
      user('How does GTH match me with competent employees?'),
      bot(
        'Matching details for recruiters are coming soon. For now, start with your company profile or first job post.'
      ),
    ],
    suggestedReplies: SETUP_CHIPS,
    next: {
      'Post Your First Job': 'post-a-job-options',
      'Complete Company Profile': 'company-profile-start',
      [KYB_UPLOAD_CTA]: 'kyb-prompt',
    },
  },

  'faq-privacy': {
    reply: () => [
      user('Is my personal information safe on GTH'),
      bot(
        "Privacy details for recruiters are coming soon. Your data stays under Ghana's Data Protection Act once that walkthrough ships."
      ),
    ],
    suggestedReplies: SETUP_CHIPS,
    next: {
      'Post Your First Job': 'post-a-job-options',
      'Complete Company Profile': 'company-profile-start',
      [KYB_UPLOAD_CTA]: 'kyb-prompt',
    },
  },

  // ── Post a Job (Figma 5132:69191 → 69422) ───────────────────────────────
  'post-a-job-options': {
    reply: () => [
      user('Post Your First Job', { auto: true, autoLabel: '[Auto]' }),
      bot(
        "Straight to business. I like that! 💼\nLet's get your first job posted. You can create your job posting in three ways:",
        { modeCards: POST_JOB_MODE_CARDS }
      ),
    ],
    suggestedReplies: [],
    next: {
      'file-upload': 'job-file-upload',
      'conversation-ai': 'job-conv-start',
      'manual-creation': 'job-manual-prompt',
    },
  },

  // ── File Upload job JD (Figma 5132:75172 / 75224 → 75538 → 75730) ───────
  'job-file-upload': {
    reply: () => [
      user('File Upload', { auto: true, autoLabel: '[Auto]' }),
      bot(JOB_FILE_UPLOAD_PROMPT),
    ],
    suggestedReplies: [],
    awaitFile: true,
    fileNext: 'job-file-extracted',
  },

  'job-file-extracted': {
    reply: () => [bot(JOB_FILE_EXTRACTED_BOT, { linkButton: { label: JOB_FILE_REVIEW_CTA } })],
    suggestedReplies: [],
  },

  // ── Conversation with AI (Figma 5132:73294 / 73460 + form-parity asks) ──
  'job-conv-start': {
    reply: () => [
      user(JOB_CONV_AUTO, { auto: true, autoLabel: '[Auto]' }),
      bot(JOB_CONV_TITLE_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-title',
  },

  'job-conv-title': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_TITLE_FALLBACK),
      bot(JOB_CONV_COMPANY_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-company',
  },

  'job-conv-company': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_COMPANY_FALLBACK),
      bot(JOB_CONV_INDUSTRY_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-industry',
  },

  'job-conv-industry': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_INDUSTRY_FALLBACK),
      bot(JOB_CONV_DEPARTMENT_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-department',
  },

  'job-conv-department': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_DEPARTMENT_FALLBACK),
      bot(jobConvLocationAskFor('this role'), { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-location',
  },

  'job-conv-location': {
    reply: (inputText) => {
      const loc = inputText?.trim() || JOB_CONV_LOCATION_FALLBACK;
      return [user(loc), bot(jobConvTypeAskFor(loc), { showActions: true })];
    },
    suggestedReplies: [],
    freeTextNext: 'job-conv-type',
  },

  'job-conv-type': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_TYPE_FALLBACK),
      bot(JOB_CONV_EXPERIENCE_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-experience',
  },

  'job-conv-experience': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_EXPERIENCE_FALLBACK),
      bot(JOB_CONV_DESCRIPTION_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-description',
  },

  'job-conv-description': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_DESCRIPTION_FALLBACK),
      bot(jobConvRespAskFor('Full-time'), { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-resp',
  },

  'job-conv-resp': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_RESP_FALLBACK),
      bot(JOB_CONV_RESP_REWRITE, { showActions: true }),
    ],
    suggestedReplies: [JOB_CONV_RESP_CONFIRM_FALLBACK],
    next: {
      [JOB_CONV_RESP_CONFIRM_FALLBACK]: 'job-conv-resp-confirm',
      '*': 'job-conv-resp-confirm',
    },
  },

  'job-conv-resp-confirm': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_RESP_CONFIRM_FALLBACK),
      bot(JOB_CONV_QUALS_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-quals',
  },

  'job-conv-quals': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_QUALS_FALLBACK),
      bot(JOB_CONV_QUALS_REWRITE, { showActions: true }),
    ],
    suggestedReplies: [JOB_CONV_QUALS_CONFIRM_FALLBACK],
    next: {
      [JOB_CONV_QUALS_CONFIRM_FALLBACK]: 'job-conv-quals-confirm',
      '*': 'job-conv-quals-confirm',
    },
  },

  'job-conv-quals-confirm': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_QUALS_CONFIRM_FALLBACK),
      bot(JOB_CONV_SALARY_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-salary',
  },

  'job-conv-salary': {
    reply: (inputText) => {
      const salary = inputText?.trim() || JOB_CONV_SALARY_FALLBACK;
      const summary = /ghs|usd|eur|\d/i.test(salary)
        ? salary.replace(/depending on experience/i, '').trim()
        : salary;
      return [
        user(salary),
        bot(
          jobConvBenefitsAskFor(
            summary.includes('/') || summary.includes('-') ? summary : 'that range'
          ),
          {
            showActions: true,
          }
        ),
      ];
    },
    suggestedReplies: [],
    freeTextNext: 'job-conv-benefits',
  },

  'job-conv-benefits': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_BENEFITS_FALLBACK),
      bot(JOB_CONV_PERKS_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-perks',
  },

  'job-conv-perks': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_PERKS_FALLBACK),
      bot(JOB_CONV_DATES_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'job-conv-dates',
  },

  'job-conv-dates': {
    reply: (inputText) => [
      user(inputText?.trim() || JOB_CONV_DATES_FALLBACK),
      bot(JOB_CONV_COMPLETE_BOT, {
        showActions: true,
        confirmsStageId: 'jobs',
      }),
    ],
    suggestedReplies: [],
  },

  // Figma 5132:69702 — Manual Creation → Fill Form CTA (opens JobPostFormModal).
  'job-manual-prompt': {
    reply: () => [
      user('Manual Creation', { auto: true, autoLabel: '[Auto]' }),
      bot(JOB_MANUAL_PROMPT_BOT, { linkButton: { label: 'Fill Form' } }),
    ],
    suggestedReplies: [],
    next: {},
  },

  // Figma 5132:72901 — after Confirm & Post Job.
  'job-posted-success': {
    reply: () => [
      user('Job posted successfully', { auto: true, autoLabel: '[Auto]' }),
      bot(JOB_POSTED_SUCCESS_BOT),
    ],
    // Section merges unfinished-setup chips (Company / KYB) at render time.
    suggestedReplies: [],
    next: {
      'Complete Company Profile': 'company-profile-start',
      [KYB_UPLOAD_CTA]: 'kyb-prompt',
      'Tell me more about GTH': 'faq-about',
    },
  },

  // ── Company profile Q&A (Figma 5132:66255 → 67352) ──────────────────────
  // Production: free-text turns echo whatever the recruiter typed; bot copy
  // below is the Figma demo path. A live model can later replace bot bodies
  // without changing node ids / panel progress hooks.

  'company-profile-start': {
    reply: () => [
      user(COMPANY_PROFILE_AUTO, { auto: true, autoLabel: '[Auto]' }),
      bot(COMPANY_BIO_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'company-bio-rewrite',
  },

  'company-bio-rewrite': {
    reply: (inputText) => [
      user(inputText?.trim() || COMPANY_BIO_USER_FALLBACK),
      bot(COMPANY_BIO_REWRITE, { showActions: true }),
    ],
    suggestedReplies: ["That's perfect!"],
    next: {
      "That's perfect!": 'company-culture-ask',
      '*': 'company-culture-ask',
    },
  },

  'company-culture-ask': {
    reply: (inputText) => [
      user(inputText?.trim() || "That's perfect!"),
      bot(COMPANY_CULTURE_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'company-culture-capture',
  },

  'company-culture-capture': {
    reply: (inputText) => [
      user(inputText?.trim() || COMPANY_CULTURE_USER_FALLBACK),
      bot(COMPANY_CULTURE_REWRITE, { showActions: true }),
    ],
    suggestedReplies: ['Yes, continue!'],
    next: {
      'Yes, continue!': 'company-location-ask',
      '*': 'company-location-ask',
    },
  },

  'company-location-ask': {
    reply: (inputText) => [
      user(inputText?.trim() || 'Yes, continue!'),
      bot(COMPANY_LOCATION_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'company-location-capture',
  },

  'company-location-capture': {
    reply: (inputText) => [
      user(inputText?.trim() || COMPANY_LOCATION_USER_FALLBACK),
      bot(COMPANY_LOCATION_REWRITE, { showActions: true }),
    ],
    suggestedReplies: ['No thanks — continue'],
    next: {
      'No thanks — continue': 'company-socials-ask',
      '*': 'company-socials-ask',
    },
  },

  'company-socials-ask': {
    reply: (inputText) => [
      user(inputText?.trim() || 'No thanks — continue'),
      bot(COMPANY_SOCIALS_ASK, { showActions: true }),
    ],
    suggestedReplies: [],
    freeTextNext: 'company-complete',
  },

  'company-complete': {
    reply: (inputText) => [
      user(inputText?.trim() || COMPANY_SOCIALS_USER_FALLBACK),
      bot(COMPANY_COMPLETE_BOT, {
        showActions: true,
        confirmsStageId: 'company-info',
      }),
    ],
    suggestedReplies: [],
  },

  // After panel Confirm succeeds — next-section chips (mirrors KYB hand-off).
  'company-next-section': {
    reply: () => [
      bot(
        'Great — your company profile is locked in. Would you like to keep setting up your recruiter account?'
      ),
    ],
    suggestedReplies: NEXT_PROFILE_CHIPS,
    next: {
      'Post Your First Job': 'post-a-job-options',
      [KYB_UPLOAD_CTA]: 'kyb-prompt',
      'Tell me more about GTH': 'faq-about',
    },
  },

  // ── KYB / KYC upload (Figma 5132:68604 → 68793 → 68990 / 69042) ─────────
  'kyb-prompt': {
    reply: () => [
      user(KYB_UPLOAD_AUTO, { auto: true, autoLabel: '[Auto]' }),
      bot(KYB_UPLOAD_PROMPT),
    ],
    suggestedReplies: [],
    awaitFile: true,
    fileNext: 'kyb-verified',
  },

  'kyb-verified': {
    reply: () => [bot(KYB_VERIFIED_BOT)],
    suggestedReplies: ['Of course'],
    next: {
      'Of course': 'kyb-next-section',
    },
  },

  'kyb-next-section': {
    reply: () => [
      user('Of course'),
      bot(
        "Great — you're verified. Would you like to keep populating your recruiter profile? You can finish Company Info or post your first job."
      ),
    ],
    suggestedReplies: ['Complete Company Profile', 'Post Your First Job', 'Tell me more about GTH'],
    next: {
      'Complete Company Profile': 'company-profile-start',
      'Post Your First Job': 'post-a-job-options',
      'Tell me more about GTH': 'faq-about',
    },
  },
};

/**
 * DemoNavigator jump seeds — rebuild the message list for mid-flow hops.
 */
export function seedRecruiterJump(hint) {
  if (hint === 'kyb-prompt') {
    return {
      nodeId: 'kyb-prompt',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['kyb-prompt'].reply(),
      ],
    };
  }
  if (hint === 'kyb-verified') {
    return {
      nodeId: 'kyb-verified',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['kyb-prompt'].reply(),
        {
          id: nextId(),
          sender: 'user',
          personaLabel: RECRUITER_NAME,
          file: {
            name: 'SRT KYC Document.pdf',
            displayName: 'SRT KYC Docum... .pdf',
            size: 6 * 1024 * 1024,
            sizeLabel: '6MB',
          },
        },
        user('This is my resume'),
        ...RECRUITER_BUDDY_NODES['kyb-verified'].reply(),
      ],
    };
  }
  if (hint === 'company-start') {
    return {
      nodeId: 'company-profile-start',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['company-profile-start'].reply(),
      ],
    };
  }
  if (hint === 'company-review') {
    return {
      nodeId: 'company-complete',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['company-profile-start'].reply(),
        ...RECRUITER_BUDDY_NODES['company-bio-rewrite'].reply(COMPANY_BIO_USER_FALLBACK),
        ...RECRUITER_BUDDY_NODES['company-culture-ask'].reply("That's perfect!"),
        ...RECRUITER_BUDDY_NODES['company-culture-capture'].reply(COMPANY_CULTURE_USER_FALLBACK),
        ...RECRUITER_BUDDY_NODES['company-location-ask'].reply('Yes, continue!'),
        ...RECRUITER_BUDDY_NODES['company-location-capture'].reply(COMPANY_LOCATION_USER_FALLBACK),
        ...RECRUITER_BUDDY_NODES['company-socials-ask'].reply('No thanks — continue'),
        ...RECRUITER_BUDDY_NODES['company-complete'].reply(COMPANY_SOCIALS_USER_FALLBACK),
      ],
    };
  }
  if (hint === 'company-confirmed') {
    return {
      nodeId: 'company-next-section',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['company-profile-start'].reply(),
        ...RECRUITER_BUDDY_NODES['company-complete'].reply(COMPANY_SOCIALS_USER_FALLBACK),
        {
          id: nextId(),
          sender: 'user',
          personaLabel: RECRUITER_NAME,
          auto: true,
          autoLabel: '[Auto]',
          text: 'Company Profile Confirmed',
        },
        ...RECRUITER_BUDDY_NODES['company-next-section'].reply(),
      ],
    };
  }
  if (hint === 'post-job-form' || hint === 'post-job-confirm') {
    return {
      nodeId: 'job-manual-prompt',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['post-a-job-options'].reply(),
        ...RECRUITER_BUDDY_NODES['job-manual-prompt'].reply(),
      ],
    };
  }
  if (hint === 'post-job-success') {
    return {
      nodeId: 'job-posted-success',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['post-a-job-options'].reply(),
        ...RECRUITER_BUDDY_NODES['job-manual-prompt'].reply(),
        ...RECRUITER_BUDDY_NODES['job-posted-success'].reply(),
      ],
    };
  }
  if (hint === 'post-job-chat') {
    return {
      nodeId: 'job-conv-start',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['post-a-job-options'].reply(),
        ...RECRUITER_BUDDY_NODES['job-conv-start'].reply(),
      ],
    };
  }
  if (hint === 'post-job-upload') {
    return {
      nodeId: 'job-file-upload',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['post-a-job-options'].reply(),
        ...RECRUITER_BUDDY_NODES['job-file-upload'].reply(),
      ],
    };
  }
  if (hint === 'post-job-upload-review') {
    return {
      nodeId: 'job-file-extracted',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['post-a-job-options'].reply(),
        ...RECRUITER_BUDDY_NODES['job-file-upload'].reply(),
        {
          id: nextId(),
          sender: 'user',
          personaLabel: RECRUITER_NAME,
          file: {
            name: 'Marketing_Manager_JD.pdf',
            displayName: 'Marketing_Ma... .pdf',
            size: 245760,
            sizeLabel: '240KB',
          },
        },
        ...RECRUITER_BUDDY_NODES['job-file-extracted'].reply(),
      ],
    };
  }
  if (hint === 'post-job-chat-review') {
    return {
      nodeId: 'job-conv-dates',
      messages: [
        ...RECRUITER_BUDDY_NODES.welcome.seedMessages(),
        ...RECRUITER_BUDDY_NODES['post-a-job-options'].reply(),
        ...RECRUITER_BUDDY_NODES['job-conv-start'].reply(),
        ...RECRUITER_BUDDY_NODES['job-conv-title'].reply(JOB_CONV_TITLE_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-company'].reply(JOB_CONV_COMPANY_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-industry'].reply(JOB_CONV_INDUSTRY_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-department'].reply(JOB_CONV_DEPARTMENT_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-location'].reply(JOB_CONV_LOCATION_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-type'].reply(JOB_CONV_TYPE_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-experience'].reply(JOB_CONV_EXPERIENCE_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-description'].reply(JOB_CONV_DESCRIPTION_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-resp'].reply(JOB_CONV_RESP_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-resp-confirm'].reply(JOB_CONV_RESP_CONFIRM_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-quals'].reply(JOB_CONV_QUALS_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-quals-confirm'].reply(JOB_CONV_QUALS_CONFIRM_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-salary'].reply(JOB_CONV_SALARY_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-benefits'].reply(JOB_CONV_BENEFITS_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-perks'].reply(JOB_CONV_PERKS_FALLBACK),
        ...RECRUITER_BUDDY_NODES['job-conv-dates'].reply(JOB_CONV_DATES_FALLBACK),
      ],
    };
  }
  return {
    nodeId: 'welcome',
    messages: RECRUITER_BUDDY_NODES.welcome.seedMessages(),
  };
}

/** Figma 5132:66245 / 66251 — welcome toast copy (comma + double space in Toast). */
export const RECRUITER_WELCOME_TOAST = {
  title: 'Welcome Back',
  body: 'Mr.Whitmore',
};

/** Panel Confirm success — product wording (Figma toast was job-post copy). */
export const COMPANY_SAVE_META = {
  autoMessageText: 'Company Profile Confirmed',
  toastLabel: 'Company profile confirmed',
  nextNodeId: 'company-next-section',
};
