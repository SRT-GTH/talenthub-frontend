/*
 * parentBuddyScript.js — Parent Career Buddy FSM
 * Welcome: Figma 5132:77628 / 5132:77862.
 * Guide ward: Figma 5132:78344 → 5132:78578 (NOT STARTED) / 78873 (IN PROGRESS)
 * / 79168 (COMPLETED). Education Q&A mirrors talent edu-* (careerBuddyScript);
 * opening bot line from Figma 5132:78734 (trailing `"` stripped).
 * Build own profile: reuses talent CAREER_BUDDY_NODES (edu → interests → …).
 *
 * Same shape as careerBuddyScript / recruiterBuddyScript so the shared
 * CareerBuddySection shell can swap by role. Icons are merged at render time.
 */

import { CAREER_BUDDY_NODES } from './careerBuddyScript.js';

export const PARENT_NAME = 'Mr.Whitmore';
export const WARD_NAME = 'Elliot';

/**
 * Education-level chips under the Guide-ward opening question
 * (Figma 5132:78740–78743 — characters via REST API ✅ VERIFIED).
 */
export const PARENT_GUIDE_EDU_LEVEL_CHIPS = [
  'Junior High School (JHS)',
  'Senior High School (SHS)',
  'University/Tertiary',
  'Completed education',
];

/** Figma 5132:78734 — trailing stray `"` stripped per product decision. */
export const PARENT_GUIDE_OPENING =
  "That's great, Mr. Whitmore. We noticed that you have already initiated your ward's account, in the earlier stage. We can proceed with getting to know your ward, Elliot. To start, what level of education is Elliot currently in?";

/**
 * Ward Educational Background fields after Guide Q&A (same shape as talent
 * EDUCATIONAL_BACKGROUND_FIELDS — panel Modify/Confirm reuse).
 * Demo values fit an SHS ward (Achimota) while reusing the talent field labels.
 */
export const PARENT_WARD_EDU_FIELDS = [
  { label: 'Institution', value: 'Achimota Senior High School' },
  { label: 'Degree', value: 'WASSCE — General Science' },
  { label: 'Field of Study', value: 'Science' },
  { label: 'Start Year', value: '2022' },
  { label: 'End Year', value: '2025' },
  { label: 'Grade', value: 'Aggregate 12' },
  { label: 'Transcript', value: 'Uploaded', verified: true },
];

/** Ward interests fields after Guide interests Q&A (mirrors talent preview). */
export const PARENT_WARD_INTERESTS_FIELDS = [
  { label: 'Educational Interests', value: 'Technology, Programming, Data Analysis' },
  { label: 'Extracurricular Interests', value: 'Coding, Chess, Volunteering (Teaching Computing)' },
  { label: 'Future career Interests', value: 'Software Development, Product Management' },
];

/** Figma 5132:77675 — same hero framing as talent. */
export const PARENT_FIRST_TIME_HERO = {
  eyebrow: 'Ghana Talent AI',
  headlineRest: ' — AI-powered talent guidance and mentorship hub.',
  subtitle: 'Your lifelong digital mentor — from SHS to career success',
  buddyCardLabel: 'Career Buddy,',
  buddyCardSubtitle: 'your personal career mentor',
};

/** Figma 5624:67780 toast=general — shared welcome banner copy. */
export const CAREER_BUDDY_WELCOME_TOAST = {
  title: 'Welcome Back',
  body: 'Good to see you again, Mr. Whitmore.',
};

export const PARENT_PANEL_TABS = [
  { id: 'mine', label: 'My Profile' },
  { id: 'ward', label: 'Elliot\u2019s Profile' },
];

export const PARENT_PANEL_SUBTITLE =
  'Every section you confirm brings the right job one step closer';

/** Parent's own profile — Figma 5132:77759 / 77766 completion mix. */
export const PARENT_MY_PROFILE_STAGES = [
  {
    id: 'personal-info',
    trailLabel: 'Personal Info',
    panelLabel: 'Personal Info.',
    completionPct: 80,
    status: 'in-progress',
  },
  {
    id: 'educational-background',
    trailLabel: 'Education',
    panelLabel: 'Educational Background',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'personal-interests',
    trailLabel: 'Interests',
    panelLabel: 'Personal area of interest',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'personality',
    trailLabel: 'Personality',
    panelLabel: 'Personality',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'skills',
    trailLabel: 'Skills',
    panelLabel: 'Skills (Competencies)',
    completionPct: 48,
    status: 'in-progress',
  },
  {
    id: 'work-experience',
    trailLabel: 'Work',
    panelLabel: 'Work Experience',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'project-portfolio',
    trailLabel: 'Portfolio',
    panelLabel: 'Project Portfolio',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'certifications',
    trailLabel: 'Certs',
    panelLabel: 'Certifications',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'desired-career',
    trailLabel: 'Goals',
    panelLabel: 'Career Options',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'talent-pitch',
    trailLabel: 'Pitch',
    panelLabel: 'Career Pitch',
    completionPct: 0,
    status: 'not-started',
  },
];

/**
 * Empty ward panel while account is not initiated (all Not Started / 0%).
 * Same stage ids as My Profile so TalentProfilePanel stays stable.
 */
export const PARENT_EMPTY_WARD_STAGES = PARENT_MY_PROFILE_STAGES.map((stage) => ({
  ...stage,
  completionPct: 0,
  status: 'not-started',
}));

/**
 * Ward panel when starting Guide: Personal Info already done from account
 * init; Educational Background + rest not started (talent-style).
 */
export const PARENT_GUIDE_START_STAGES = PARENT_EMPTY_WARD_STAGES.map((stage) =>
  stage.id === 'personal-info' ? { ...stage, completionPct: 100, status: 'done' } : stage
);

/**
 * Ward (Elliot) profile — same stage ids, different demo completion so the
 * My Profile / Elliot's Profile toggle is visibly distinct (ward already
 * initialized, landing demo).
 */
export const PARENT_WARD_PROFILE_STAGES = [
  {
    id: 'personal-info',
    trailLabel: 'Personal Info',
    panelLabel: 'Personal Info.',
    completionPct: 100,
    status: 'done',
  },
  {
    id: 'educational-background',
    trailLabel: 'Education',
    panelLabel: 'Educational Background',
    completionPct: 100,
    status: 'done',
  },
  {
    id: 'personal-interests',
    trailLabel: 'Interests',
    panelLabel: 'Personal area of interest',
    completionPct: 40,
    status: 'in-progress',
  },
  {
    id: 'personality',
    trailLabel: 'Personality',
    panelLabel: 'Personality',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'skills',
    trailLabel: 'Skills',
    panelLabel: 'Skills (Competencies)',
    completionPct: 20,
    status: 'in-progress',
  },
  {
    id: 'work-experience',
    trailLabel: 'Work',
    panelLabel: 'Work Experience',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'project-portfolio',
    trailLabel: 'Portfolio',
    panelLabel: 'Project Portfolio',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'certifications',
    trailLabel: 'Certs',
    panelLabel: 'Certifications',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'desired-career',
    trailLabel: 'Goals',
    panelLabel: 'Career Options',
    completionPct: 0,
    status: 'not-started',
  },
  {
    id: 'talent-pitch',
    trailLabel: 'Pitch',
    panelLabel: 'Career Pitch',
    completionPct: 0,
    status: 'not-started',
  },
];

/** Parent save-chain after Confirm on ward panel (talent uses CAREER_BUDDY_NODES). */
export const PARENT_STAGE_SAVE_META = {
  'educational-background': {
    autoMessageText: "Elliot's educational background confirmed ✅",
    toastLabel: 'Educational background saved',
    nextNodeId: 'parent-interests-prompt',
  },
  'personal-interests': {
    autoMessageText: "Elliot's personal area of interest confirmed ✅",
    toastLabel: 'Personal area of interest saved',
    nextNodeId: 'parent-guide-wrap',
  },
};

let _id = 0;
const nextId = () => `parent-msg-${++_id}`;

const bot = (text, extras = {}) => ({
  id: nextId(),
  sender: 'bot',
  text,
  ...extras,
});

const user = (text, extras = {}) => ({
  id: nextId(),
  sender: 'user',
  personaLabel: PARENT_NAME,
  text,
  ...extras,
});

/** Verbatim welcome CTAs + FAQ chips — Figma 5132:77748 / 77753–77755. */
const PARENT_WELCOME_CHIPS = [
  'Build my own talent profile',
  "Guide my ward's profile",
  'Upload resume to automatically populate profile?',
  'Tell me more about GTH',
  'How does GTH match me with opportunities?',
  'Is my personal information safe on GTH',
];

const PARENT_GUIDE_LEVEL_NEXT = Object.fromEntries(
  PARENT_GUIDE_EDU_LEVEL_CHIPS.map((label) => [label, 'parent-guide-edu-q1'])
);

/** Welcome when ward account already exists — Figma 5132:77628. */
export const PARENT_WELCOME_INITIALIZED =
  "Hi there! 👋 Welcome to Ghana Talent AI. I'm TALI, your AI mentor.\n✅ We noticed that you already initialized your wards account. What do you want to do?";

/** Welcome when ward account is not initiated — matches setup modal intent. */
export const PARENT_WELCOME_UNINITIATED =
  "Hi there! 👋 Welcome to Ghana Talent AI. I'm TALI, your AI mentor.\n⚠️ We noticed your ward's account hasn't been initialized yet. What do you want to do?";

export const PARENT_BUDDY_NODES = {
  welcome: {
    hero: 'first-time',
    seedMessages: () => [bot(PARENT_WELCOME_INITIALIZED)],
    suggestedReplies: PARENT_WELCOME_CHIPS,
    next: {
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward',
      'Upload resume to automatically populate profile?': 'parent-upload-prompt',
      'Tell me more about GTH': 'faq-about',
      'How does GTH match me with opportunities?': 'faq-matching',
      'Is my personal information safe on GTH': 'faq-privacy',
    },
  },

  'welcome-uninitiated': {
    hero: 'first-time',
    seedMessages: () => [bot(PARENT_WELCOME_UNINITIATED)],
    suggestedReplies: PARENT_WELCOME_CHIPS,
    next: {
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward-setup',
      'Upload resume to automatically populate profile?': 'parent-upload-prompt',
      'Tell me more about GTH': 'faq-about',
      'How does GTH match me with opportunities?': 'faq-matching',
      'Is my personal information safe on GTH': 'faq-privacy',
    },
  },

  'parent-build-own': {
    // Same entry shape as talent `ready-prompt` → `edu-q1` (careerBuddyScript).
    reply: () => [
      user('Build my own talent profile'),
      bot(
        `You're already ahead, ${PARENT_NAME} — your personal info came through from onboarding ✅\nWant to jump into your educational background, or review your personal details first?`
      ),
    ],
    suggestedReplies: ["Sounds great. Let's do that."],
    next: { '*': 'edu-q1' },
    panelTab: 'mine',
    startOwnProfile: true,
  },

  /**
   * Guide ward (account ready) — Figma 5132:78578.
   * Normal user bubble (not [Auto]) + opening education question + level chips.
   */
  'parent-guide-ward': {
    reply: () => [
      user("Guide my ward's profile"),
      bot(PARENT_GUIDE_OPENING, { showActions: true }),
    ],
    suggestedReplies: PARENT_GUIDE_EDU_LEVEL_CHIPS,
    next: PARENT_GUIDE_LEVEL_NEXT,
    panelTab: 'ward',
    startWardGuide: true,
  },

  /** Ward not initiated — chip opens setup modal (Figma 5132:80134). */
  'parent-guide-ward-setup': {
    reply: () => [
      user("Guide my ward's profile"),
      bot(
        "Let's set up your ward's account first — fill in their details so we can start guiding their profile."
      ),
    ],
    suggestedReplies: [
      'Tell me more about GTH',
      'How does GTH match me with opportunities?',
      'Is my personal information safe on GTH',
      'Build my own talent profile',
    ],
    next: {
      'Tell me more about GTH': 'faq-about',
      'How does GTH match me with opportunities?': 'faq-matching',
      'Is my personal information safe on GTH': 'faq-privacy',
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward-setup',
    },
    panelTab: 'ward',
    openWardSetup: true,
  },

  // ── Guide Educational Background Q&A (talent edu-* mirrored for Elliot) ──
  'parent-guide-edu-q1': {
    reply: (level) => [
      user(level || PARENT_GUIDE_EDU_LEVEL_CHIPS[1]),
      bot(
        `Got it — ${level || PARENT_GUIDE_EDU_LEVEL_CHIPS[1]}. What school or institution is ${WARD_NAME} attending most recently?`,
        { showActions: true }
      ),
    ],
    freeTextNext: 'parent-guide-edu-q2',
  },
  'parent-guide-edu-q2': {
    reply: () => [
      user(`${WARD_NAME} goes to Achimota Senior High School.`),
      bot(
        `Got it — Achimota Senior High School. What programme or course is ${WARD_NAME} pursuing there?`,
        {
          showActions: true,
        }
      ),
    ],
    freeTextNext: 'parent-guide-edu-q3',
  },
  'parent-guide-edu-q3': {
    reply: () => [
      user('General Science — with a focus on maths, physics and computing.'),
      bot(`Perfect. Can you tell me the years ${WARD_NAME} started and will finish?`, {
        showActions: true,
      }),
    ],
    freeTextNext: 'parent-guide-edu-q4',
  },
  'parent-guide-edu-q4': {
    reply: () => [
      user('Started in 2022 and graduating in 2025.'),
      bot(
        `Nice — 2022 to 2025. That must be quite a journey!\nDo you recall ${WARD_NAME}'s current grade or classification?`,
        { showActions: true }
      ),
    ],
    freeTextNext: 'parent-guide-edu-q5',
  },
  'parent-guide-edu-q5': {
    reply: () => [
      user('Yes — Aggregate 12 so far.'),
      bot(
        `That's a strong result for ${WARD_NAME} 👋\nLastly, do you have a transcript you'd like to upload or link to ${WARD_NAME}'s profile?`,
        { showActions: true }
      ),
    ],
    freeTextNext: 'parent-guide-edu-confirm',
  },
  'parent-guide-edu-confirm': {
    reply: () => [
      user("Yes, I have a PDF copy — I've attached it.", {
        file: { name: 'Transcript.pdf', size: '6MB' },
      }),
      bot(
        `The information gathered from our interaction on ${WARD_NAME}'s educational background is currently displayed on the talent profile panel. Feel free to make changes or confirm so that we continue.`,
        { showActions: true, confirmsStageId: 'educational-background' }
      ),
    ],
  },

  /** After Confirm saves Educational Background on the ward panel. */
  'parent-interests-prompt': {
    reply: () => [
      bot(
        `Saved! ✅ ${WARD_NAME}'s education section is locked in. Ready to move on to their personal area of interest?`
      ),
    ],
    suggestedReplies: ["I'd love to talk about that"],
    next: { '*': 'parent-interests-q1' },
  },
  'parent-interests-q1': {
    reply: () => [
      user("I'd love to talk about that"),
      bot(
        `Let's talk about ${WARD_NAME}'s interests so I can better tailor recommendations.\nTo start, what subjects or areas in education excite ${WARD_NAME} the most?`,
        { showActions: true }
      ),
    ],
    freeTextNext: 'parent-interests-q2',
  },
  'parent-interests-q2': {
    reply: () => [
      user(
        `${WARD_NAME} has always enjoyed subjects related to technology and problem-solving — especially programming and data analysis.`
      ),
      bot(
        `That's great! So ${WARD_NAME}'s educational interests include technology, programming, and data analysis — noted ✅\nOutside the classroom, what does ${WARD_NAME} usually like doing? Any hobbies or extracurricular activities?`,
        { showActions: true }
      ),
    ],
    freeTextNext: 'parent-interests-q3',
  },
  'parent-interests-q3': {
    reply: () => [
      user(
        `Yes — coding personal projects, playing chess, and volunteering to teach basic computing to younger students.`
      ),
      bot(
        `Love that mix. Looking ahead, what kinds of careers or roles is ${WARD_NAME} curious about?`,
        { showActions: true }
      ),
    ],
    freeTextNext: 'parent-interests-confirm',
  },
  'parent-interests-confirm': {
    reply: () => [
      user('Software development and product management sound exciting.'),
      bot(
        `The information gathered on ${WARD_NAME}'s personal area of interest is on the profile panel. Feel free to make changes or confirm so that we continue.`,
        { showActions: true, confirmsStageId: 'personal-interests' }
      ),
    ],
  },

  /** Soft wrap after interests confirmed — return to parent welcome actions. */
  'parent-guide-wrap': {
    reply: () => [
      bot(`Excellent work guiding ${WARD_NAME}'s profile so far. What would you like to do next?`),
    ],
    suggestedReplies: [
      'Build my own talent profile',
      'Upload resume to automatically populate profile?',
      'Tell me more about GTH',
    ],
    next: {
      'Build my own talent profile': 'parent-build-own',
      'Upload resume to automatically populate profile?': 'parent-upload-prompt',
      'Tell me more about GTH': 'faq-about',
    },
  },

  'parent-upload-prompt': {
    reply: () => [
      {
        id: nextId(),
        sender: 'user',
        personaLabel: PARENT_NAME,
        auto: true,
        autoLabel: '[Auto]',
        text: 'Upload resume to automatically populate profile',
      },
      // Figma 5132:79750 / 79822 — verbatim (comma, not period).
      bot('Awesome, Go ahead and upload your resume then.'),
    ],
    suggestedReplies: [],
    awaitFile: true,
    fileNext: 'parent-upload-received',
  },

  'parent-upload-received': {
    // File bubble is prepended by CareerBuddySection.handleAttach.
    // Figma 5132:79750 — "This is my resume" + evaluate prompt + Of course.
    reply: () => [
      user('This is my resume'),
      bot('Excellent. Now do you want help evaluate your wards profile'),
    ],
    suggestedReplies: ['Of course'],
    next: {
      'Of course': 'parent-resume-fill',
    },
    panelTab: 'ward',
  },

  /** After "Of course" — fill Elliot's panel (modifiable / confirmable). */
  'parent-resume-fill': {
    reply: () => [user('Of course')],
    suggestedReplies: [
      'Build my own talent profile',
      "Guide my ward's profile",
      'Tell me more about GTH',
    ],
    next: {
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward',
      'Tell me more about GTH': 'faq-about',
    },
    panelTab: 'ward',
    fillWardFromResume: true,
  },

  // FAQ copy mirrors talent Career Buddy (same GTH questions in Figma).
  'faq-about': {
    reply: () => [
      bot(
        "Hey! Great question. 👋\nGhana Talent Hub (GTH) is an AI-powered platform built entirely for Ghana's talent ecosystem — connecting students and graduates with real opportunities at top companies across the country.\nHere's what makes GTH different:",
        {
          bullets: [
            '🎯 Your profile is matched to live opportunities based on your skills, interests and personality — not just your grades',
            '✅ Every profile is verified so recruiters trust what they see',
            "🤖 I'm TALI — your AI career mentor, here to guide you from your first profile section all the way to your first job",
            "🇬🇭 We're built in Ghana, for Ghana — not adapted from somewhere else",
          ],
          linkButton: { label: 'Visit our About page' },
          followUp: 'Want the full story on our mission and the team behind it?',
        }
      ),
    ],
    suggestedReplies: [
      'Build my own talent profile',
      "Guide my ward's profile",
      'Upload resume to automatically populate profile?',
    ],
    next: {
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward',
      'Upload resume to automatically populate profile?': 'parent-upload-prompt',
    },
  },

  'faq-matching': {
    reply: () => [
      bot(
        'Great question — this is where GTH is different. 👋\nMost job platforms match you by keywords. GTH matches you by who you actually are.\nOur matching engine looks at:',
        {
          bullets: [
            '🎯 Your talent assessment score — analytical, leadership and communication strengths',
            '🎯 Your career interests and goals — the roles and industries you actually want',
            '📋 Your profile completeness — the more sections you fill, the more accurate your matches',
            '📍 Your location — so opportunities near you surface first',
          ],
          followUp:
            "The result? Opportunities that actually fit you — not just ones that contain the same words as your CV. The more of your profile you complete, the better your matches get. That's why we're here. 😊",
        }
      ),
    ],
    suggestedReplies: [
      'Build my own talent profile',
      "Guide my ward's profile",
      'Upload resume to automatically populate profile?',
    ],
    next: {
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward',
      'Upload resume to automatically populate profile?': 'parent-upload-prompt',
    },
  },

  'faq-privacy': {
    reply: () => [
      bot(
        "Your data is yours — always. 🔒\nGTH is fully compliant with the Ghana Data Protection Act (Act 843, 2012). Here's what that means in plain terms:",
        {
          bullets: [
            'Your information is encrypted and never sold to third parties',
            'Recruiters only see what you choose to make visible',
            'You can request to edit, download or delete your data at any time from Settings → Privacy',
          ],
          followUp:
            "We built GTH in Ghana — we take data privacy seriously because it's the law and because it's the right thing to do.",
        }
      ),
    ],
    suggestedReplies: [
      'Build my own talent profile',
      "Guide my ward's profile",
      'Upload resume to automatically populate profile?',
    ],
    next: {
      'Build my own talent profile': 'parent-build-own',
      "Guide my ward's profile": 'parent-guide-ward',
      'Upload resume to automatically populate profile?': 'parent-upload-prompt',
    },
  },
};

/**
 * DemoNavigator ?cb= seeds for parent Career Buddy.
 * Returns { nodeId, messages, wardReady, wardSetupStep, panelTab, fillWardFromResume, startWardGuide, guideSeed, startOwnProfile }.
 */
export function seedParentJump(hint) {
  if (
    hint === 'ward-uninitiated' ||
    hint === 'ward-setup' ||
    hint === 'ward-password' ||
    hint === 'ward-success'
  ) {
    const messages = PARENT_BUDDY_NODES['welcome-uninitiated'].seedMessages();
    if (hint === 'ward-success') {
      return {
        nodeId: 'welcome-uninitiated',
        messages,
        wardReady: true,
        wardSetupStep: 'success',
      };
    }
    return {
      nodeId: 'welcome-uninitiated',
      messages,
      wardReady: false,
      wardSetupStep:
        hint === 'ward-setup' ? 'details' : hint === 'ward-password' ? 'password' : null,
    };
  }

  // Parent fills own profile — same talent edu FSM (careerBuddyScript).
  if (hint === 'parent-own') {
    return {
      nodeId: 'parent-build-own',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-build-own'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'mine',
      startOwnProfile: true,
    };
  }

  if (hint === 'parent-own-progress') {
    return {
      nodeId: 'edu-q3',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-build-own'].reply(),
        ...CAREER_BUDDY_NODES['edu-q1'].reply(),
        ...CAREER_BUDDY_NODES['edu-q2'].reply(),
        ...CAREER_BUDDY_NODES['edu-q3'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'mine',
      startOwnProfile: true,
      ownProfileSeed: 'progress',
    };
  }

  if (hint === 'parent-own-review') {
    return {
      nodeId: 'edu-confirm',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-build-own'].reply(),
        ...CAREER_BUDDY_NODES['edu-q1'].reply(),
        ...CAREER_BUDDY_NODES['edu-q2'].reply(),
        ...CAREER_BUDDY_NODES['edu-q3'].reply(),
        ...CAREER_BUDDY_NODES['edu-q4'].reply(),
        ...CAREER_BUDDY_NODES['edu-q5'].reply(),
        ...CAREER_BUDDY_NODES['edu-confirm'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'mine',
      startOwnProfile: true,
      ownProfileSeed: 'review',
    };
  }

  // Guide ward — opening (Figma 5132:78578 NOT STARTED).
  if (hint === 'parent-guide') {
    return {
      nodeId: 'parent-guide-ward',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-guide-ward'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'ward',
      startWardGuide: true,
      guideSeed: 'start',
    };
  }

  // Guide ward — mid Q&A, edu in-progress (Figma 5132:78873).
  if (hint === 'parent-guide-progress') {
    return {
      nodeId: 'parent-guide-edu-q3',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-guide-ward'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q1'].reply(PARENT_GUIDE_EDU_LEVEL_CHIPS[1]),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q2'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q3'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'ward',
      startWardGuide: true,
      guideSeed: 'progress',
    };
  }

  // Guide ward — awaiting panel confirm (Figma 5132:79168 COMPLETED path → review).
  if (hint === 'parent-guide-review') {
    return {
      nodeId: 'parent-guide-edu-confirm',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-guide-ward'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q1'].reply(PARENT_GUIDE_EDU_LEVEL_CHIPS[1]),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q2'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q3'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q4'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-q5'].reply(),
        ...PARENT_BUDDY_NODES['parent-guide-edu-confirm'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'ward',
      startWardGuide: true,
      guideSeed: 'review',
    };
  }

  // Mid-flow: resume attached, waiting on "Of course" (Figma 5132:79750).
  if (hint === 'parent-resume') {
    return {
      nodeId: 'parent-upload-received',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-upload-prompt'].reply(),
        {
          id: nextId(),
          sender: 'user',
          personaLabel: PARENT_NAME,
          file: {
            name: 'Resume.pdf',
            displayName: 'Resume... .pdf',
            size: 6 * 1024 * 1024,
            sizeLabel: '6MB',
          },
        },
        ...PARENT_BUDDY_NODES['parent-upload-received'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'ward',
      fillWardFromResume: false,
    };
  }

  // After "Of course" — Elliot panel filled from resume.
  if (hint === 'parent-resume-filled') {
    return {
      nodeId: 'parent-resume-fill',
      messages: [
        ...PARENT_BUDDY_NODES.welcome.seedMessages(),
        ...PARENT_BUDDY_NODES['parent-upload-prompt'].reply(),
        {
          id: nextId(),
          sender: 'user',
          personaLabel: PARENT_NAME,
          file: {
            name: 'Resume.pdf',
            displayName: 'Resume... .pdf',
            size: 6 * 1024 * 1024,
            sizeLabel: '6MB',
          },
        },
        ...PARENT_BUDDY_NODES['parent-upload-received'].reply(),
        ...PARENT_BUDDY_NODES['parent-resume-fill'].reply(),
      ],
      wardReady: true,
      wardSetupStep: null,
      panelTab: 'ward',
      fillWardFromResume: true,
    };
  }

  return {
    nodeId: 'welcome',
    messages: PARENT_BUDDY_NODES.welcome.seedMessages(),
    wardReady: true,
    wardSetupStep: null,
  };
}
