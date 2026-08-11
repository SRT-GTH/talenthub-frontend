/*
 * careerBuddyScript.js — canned conversation data for the Career Buddy
 * screen (AI Engagement Screens — Welcome Phase and Miscellaneous Screens,
 * Talent Flow). Source: Figma file Bin8roWL8sloyc36IgFMuT, nodes
 * 5132:43308-46274 (screenshots captured 2026-07-21/22 — see
 * wiki/figma-node-map.md).
 *
 * There is no careerBuddy.service.js yet (per the Engagement Batch 3 user
 * stories, US-2.3.9-01, it's still a planned LLM integration), so this is a
 * deterministic script keyed by node id — no real NLP. Every node id below
 * matches a `next` target elsewhere in this file, forming a small FSM that
 * CareerBuddySection walks.
 *
 * NAMING NOTE: the Figma source names the demo persona "Emma" in the
 * welcome/FAQ/returning-user frames (5132:43308-45182) but "Andrew" in one
 * line of the Educational Background exchange (5132:45721, "That's a
 * strong result, Andrew"). Treated as a Figma demo-data inconsistency
 * ("Emma" appears in 7 of 8 places) — standardised on "Emma" throughout for
 * a coherent single persona. Flagged in wiki/figma-node-map.md.
 */

export const TALENT_NAME = 'Emma';

// Figma 5132:43308 — first-visit hero copy (shown above the chat only when
// on the `welcome` node with zero prior messages).
export const FIRST_TIME_HERO = {
  eyebrow: 'Ghana Talent AI',
  headline: 'Ghana Talent AI — AI-powered talent guidance and mentorship hub.',
  // The portion of `headline` that follows `eyebrow`, split out so the shared
  // CareerBuddyHero can render the mixed serif/sans runs from data instead of
  // hardcoding the tail in JSX (added 2026-08-10 with the recruiter flow).
  headlineRest: ' — AI-powered talent guidance and mentorship hub.',
  subtitle: 'Your lifelong digital mentor — from SHS to career success',
  buddyCardLabel: 'Career Buddy,',
  buddyCardSubtitle: 'your personal career mentor',
};

// Figma 5132:45182 — returning-visit hero copy (shown when the chat has
// been reset via "New Chat" and there are zero messages).
export const RETURNING_HERO = {
  headlineQuestion: 'What are we working on today?',
  headlineName: TALENT_NAME,
  subtitle: 'We can continue your profile, get guidance, or just chat — your call',
};

// Figma 5132:45345 — chat history drawer, grouped by date, verbatim.
export const CHAT_HISTORY_GROUPS = [
  {
    label: 'Yesterday',
    entries: ['Personal Info.', 'Educational Background', 'Tell me more about GTH'],
  },
  { label: '2 Days Ago', entries: ['Work Experience — CodeBase Ghana', 'Is my data safe on GTH?'] },
  { label: '15 May', entries: ['Personal area of interest', 'How does GTH match me with jobs?'] },
  { label: '10 May', entries: ['Personality — MCQ Session', 'Skills & Competencies'] },
  { label: '4 May', entries: ['Avatar setup — getting started'] },
];

// Figma 5132:45721 — Educational Background field data extracted through
// the chat, and the exact values shown in the Talent Profile Panel's
// expanded "Educational Background" card.
export const EDUCATIONAL_BACKGROUND_FIELDS = [
  { label: 'Institution', value: 'University of Cape Coast' },
  { label: 'Degree', value: 'Bachelor of Science' },
  { label: 'Field of Study', value: 'Computer Science' },
  { label: 'Start Year', value: '2018' },
  { label: 'End Year', value: '2022' },
  { label: 'Grade', value: 'Second Class Upper' },
  { label: 'Transcript', value: 'Uploaded', verified: true },
];

// Figma node 5132:40348 ("component groupings" reference sheet) — field data
// for the sections whose own chat flows aren't built yet in this slice.
// Shown in the panel as an unconfirmed PREVIEW (no Modify/Confirm — nothing
// has actually been collected through a conversation for these yet), not as
// completed data, so the panel's completion percentages stay truthful to
// what happened in *this* build's chat.
//
// NAMING NOTE: this reference sheet's Personal Info card uses the persona
// "Elliot Whitmore" — kept verbatim here since it's a static Figma reference
// snapshot, not spoken chat dialogue (see the Andrew/Emma note above for the
// case where a name was normalised because it appeared in a live message).
export const PERSONAL_INFO_PREVIEW_FIELDS = [
  { label: 'Name', value: 'Elliot Whitmore' },
  { label: 'Email', value: 'ellwhitmore@gmail.com' },
  { label: 'Address', value: 'Weija Accra, Ghana' },
  { label: 'Ghana Card', value: 'Verified', verified: true },
];

export const CAREER_OPTIONS_FIELDS = [
  { label: 'Career Focus Area', value: 'EdTech / Technical Training' },
  { label: 'Preferred Roles', value: 'Learning Experience Designer, Product Trainer' },
  {
    label: 'Top Strengths to Leverage',
    value: 'Communication, Problem-Solving, Technical Literacy',
  },
  {
    label: 'Recommended Skills to Develop',
    value: 'Curriculum Design, Web Development, Data Storytelling',
  },
];

/** @deprecated Use CAREER_OPTIONS_FIELDS — kept as alias so older imports don't break mid-refactor. */
export const CAREER_OPTIONS_PREVIEW_FIELDS = CAREER_OPTIONS_FIELDS;

// Renamed from PERSONALITY_PREVIEW_FIELDS now that Open Chat/MCQ mode give
// Personality a real live-collected chat flow (confirmed: true in
// CareerBuddySection's STAGE_FIELD_DATA) — no longer a static preview.
// Values match the user-supplied personality-report screenshot exactly
// (percentages + type/traits); the report's own richer widgets (progress
// bars, collapsible "Summary Insight", "Add your comment" textarea) are a
// bespoke panel layout out of scope for this pass — TalentProfilePanel's
// existing generic label/value row list is used instead, same as every
// other stage, so the confirm/save/toast/auto-message machinery works
// identically without a new panel variant.
export const PERSONALITY_FIELDS = [
  { label: 'Personality type', value: 'Strategic Thinker (INTJ-T)' },
  { label: 'Key Traits', value: 'Analytical, Adaptable, Empathetic, Goal-Oriented' },
  { label: 'Confidence Level', value: '75%' },
  { label: 'Adaptability', value: '80%' },
  { label: 'Risk Tolerance', value: '65%' },
  { label: 'Emotional Stability', value: '82%' },
];

// Work Experience is a real, live-collected chat flow (confirmed: true) —
// Figma 5132:50598 ("AWAITING REVIEW") shows a MULTI-ENTRY panel row: each
// job is its own collapsible sub-card, only Experience 1 has real Q&A-
// collected field data (the work-q* chat below), Experience 2 ("EduTech
// Africa (Teaching Assistant)") only ever appears as a collapsed title
// with no fields ever shown expanded in Figma — kept as a title-only,
// non-expandable entry here rather than fabricating a field breakdown
// Figma never specified. "+ Add Experience" (5132:50994, edit-details
// state) exists in Figma but adding a genuinely new entry would require a
// whole new Q&A sub-flow this session's single conversation never covers —
// TalentProfilePanel renders the control but its handler just logs, it
// doesn't fabricate a second real entry.
export const WORK_EXPERIENCE_ENTRIES = [
  {
    id: 'exp-1',
    title: 'Experience 1 – CodeBase Ghana (Software Dev Intern)',
    fields: [
      { label: 'Organization', value: 'CodeBase Ghana' },
      { label: 'Role', value: 'Software Development Intern' },
      { label: 'Duration', value: 'June – August 2024' },
      { label: 'Key Projects', value: 'Internal dashboard for client tracking' },
      { label: 'Skills gained', value: 'Teamwork, Backend Debugging, Time Management' },
      {
        label: 'Supervisor Info',
        value: 'Name: Mr. Kwame Agyapong.\nEmail: aqyapongkwa23@gmail.com\nContact: +223 243567890',
      },
    ],
  },
  {
    id: 'exp-2',
    title: 'Experience 2 – EduTech Africa (Teaching Assistant)',
    fields: null,
  },
];

export const PERSONAL_INTERESTS_PREVIEW_FIELDS = [
  { label: 'Educational Interests', value: 'Technology, Programming, Data Analysis' },
  { label: 'Extracurricular Interests', value: 'Coding, Chess, Volunteering (Teaching Computing)' },
  { label: 'Future career Interests', value: 'Software Development, Product Management' },
];

let uid = 0;
const nextId = () => `msg-${++uid}`;

const bot = (text, extra = {}) => ({ id: nextId(), sender: 'bot', text, ...extra });
const user = (text, extra = {}) => ({
  id: nextId(),
  sender: 'user',
  text,
  personaLabel: TALENT_NAME,
  ...extra,
});

// Figma 5132:52485 / 64380 — guidance area chips (verbatim labels; note
// the double space in "Entrepreneurial  Guidance"). Career Exposure is
// the only area with a full Q&A; the rest stub to coming-soon nodes.
const GUIDANCE_AREA_CHIPS = [
  'Career exposure',
  'Secondary Elective Matching',
  'Tertiary Course Matching',
  'Mock Interviews',
  'Opportunity Matching',
  'Talent Matching',
  'Entrepreneurial  Guidance',
];

const GUIDANCE_AREA_NEXT = {
  'Career exposure': 'exposure-q1',
  'Secondary Elective Matching': 'stub-guidance-secondary-elective',
  'Tertiary Course Matching': 'stub-guidance-tertiary',
  'Mock Interviews': 'stub-guidance-mock-interviews',
  'Opportunity Matching': 'stub-guidance-opportunity',
  'Talent Matching': 'stub-guidance-talent',
  'Entrepreneurial  Guidance': 'stub-guidance-entrepreneurial',
};

const GUIDANCE_AREA_CHIPS_AFTER = GUIDANCE_AREA_CHIPS.filter(
  (label) => label !== 'Career exposure'
);
const GUIDANCE_AREA_NEXT_AFTER = Object.fromEntries(
  Object.entries(GUIDANCE_AREA_NEXT).filter(([label]) => label !== 'Career exposure')
);

export const CAREER_BUDDY_NODES = {
  welcome: {
    hero: 'first-time',
    seedMessages: () => [
      bot(
        "👋 Nicely done! Your avatar is all set. That's your first step on GTH — and you're already discoverable. Whenever you're ready, I'll walk you through the rest of your profile. It takes about 40 minutes total, but you can do it in pieces. Let's go?"
      ),
    ],
    suggestedReplies: [
      'Tell me more about GTH',
      'How does GTH match me with opportunities?',
      'Is my personal information safe on GTH',
    ],
    next: {
      'Tell me more about GTH': 'faq-about',
      'How does GTH match me with opportunities?': 'faq-matching',
      'Is my personal information safe on GTH': 'faq-privacy',
    },
  },

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
    suggestedReplies: ["Awesome. I think I'm ready now. Let's build my profile!"],
    next: { '*': 'ready-prompt' },
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
    suggestedReplies: ["Awesome. I think I'm ready now. Let's build my profile!"],
    next: { '*': 'ready-prompt' },
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
    suggestedReplies: ["Awesome. I think I'm ready now. Let's build my profile!"],
    next: { '*': 'ready-prompt' },
  },

  'ready-prompt': {
    reply: () => [
      user("Awesome. I think I'm ready now. Let's build my profile!"),
      bot(
        `You're already ahead, ${TALENT_NAME} — your personal info came through from onboarding ✅\nWant to jump into your educational background, or review your personal details first?`
      ),
    ],
    suggestedReplies: ["Sounds great. Let's do that."],
    next: { '*': 'edu-q1' },
  },

  'edu-q1': {
    reply: () => [
      user("Sounds great. Let's do that."),
      bot('To start, what school or institution did you attend most recently?', {
        showActions: true,
      }),
    ],
    freeTextNext: 'edu-q2',
  },
  'edu-q2': {
    reply: () => [
      user('I went to the University of Cape Coast.'),
      bot('Got it — University of Cape Coast. What degree did you pursue there?', {
        showActions: true,
      }),
    ],
    freeTextNext: 'edu-q3',
  },
  'edu-q3': {
    reply: () => [
      user('Mostly software engineering — we focused on programming and systems design'),
      bot('Perfect. Can you tell me the years you started and finished your degree?', {
        showActions: true,
      }),
    ],
    freeTextNext: 'edu-q4',
  },
  'edu-q4': {
    reply: () => [
      user('I started in 2018 and graduated in 2022.'),
      bot(
        "Nice — 2018 to 2022. That must've been quite a journey!\nDo you recall your final grade or classification?",
        {
          showActions: true,
        }
      ),
    ],
    freeTextNext: 'edu-q5',
  },
  'edu-q5': {
    reply: () => [
      user('Yes, I graduated with a Second Class Upper Division.'),
      bot(
        `That's a strong result, ${TALENT_NAME}👋\nLastly, do you have a transcript you'd like to upload or link to your profile?`,
        {
          showActions: true,
        }
      ),
    ],
    freeTextNext: 'edu-confirm',
  },
  'edu-confirm': {
    reply: () => [
      user("Yes, I have a PDF copy — I've attached it.", {
        file: { name: 'Transcript.pdf', size: '6MB' },
      }),
      bot(
        'The information gathered from the our interaction on your educational background is currently displayed on the talent profile panel. Feel free to make changes or confirm so that we continue.',
        { showActions: true, confirmsStageId: 'educational-background' }
      ),
    ],
  },

  // Figma 5132:48144 ("IN PROGRESS" state) — the transition bot message that
  // appears once Educational Background's real save succeeds (triggered
  // from CareerBuddySection's handleConfirmStage via STAGE_SAVE_META's
  // nextNodeId, not a chat `next` transition — same reasoning as edu-q1
  // being triggered from ready-prompt's suggested reply).
  'interests-prompt': {
    reply: () => [
      bot(
        'Saved! ✅ Your education section is locked in. Ready to move on to your personal area of interest?'
      ),
    ],
    suggestedReplies: ["I'd love to talk about that"],
    next: { '*': 'interests-q1' },
  },
  'interests-q1': {
    reply: () => [
      user("I'd love to talk about that"),
      bot(
        "Let's talk about your interests so I can better tailor your recommendations.\nTo start, what subjects or areas in education excite you the most?",
        { showActions: true }
      ),
    ],
    freeTextNext: 'interests-q2',
  },
  'interests-q2': {
    reply: () => [
      user(
        "I've always enjoyed subjects related to technology and problem-solving — especially programming and data analysis."
      ),
      bot(
        "That's great! So your educational interests include technology, programming, and data analysis — noted ✅\nOutside the classroom, what do you usually like doing? Any hobbies or extracurricular activities?",
        { showActions: true }
      ),
    ],
    freeTextNext: 'interests-q3',
  },
  'interests-q3': {
    reply: () => [
      user(
        'Yes, I love coding personal projects, playing chess, and volunteering to teach basic computing to younger students.'
      ),
      bot(
        "Wow, that's awesome — coding, chess, and mentoring others show strong analytical and leadership skills.\nNow, thinking about the future — what kind of career paths or roles interest you most?",
        { showActions: true }
      ),
    ],
    freeTextNext: 'interests-confirm',
  },
  'interests-confirm': {
    reply: () => [
      user(
        "I'm really drawn to software development, maybe even becoming a product manager later in my career."
      ),
      bot(
        "Excellent vision, Emma 🌟\nReview what I've gathered from our chat on the Talent Profile Panel to confirm or make changes.",
        { showActions: true, confirmsStageId: 'personal-interests' }
      ),
    ],
  },

  // Figma 5132:55364 ("STARTED") — the transition prompt shown right after
  // Personal Area of Interest saves, leading into the personality
  // mode-picker below. (Corrects an earlier pass that mis-attributed the
  // "Sure bro" reply / stub-personality dead-end to this exact hand-off —
  // that text actually belongs one stage later, Personality→Skills, and is
  // preserved below as skills-prompt/stub-skills-topic once this stage's
  // own save succeeds.)
  'personality-prompt': {
    reply: () => [
      bot('Okay that’s great. Now would you like to continue with the topic personality ?'),
    ],
    suggestedReplies: ["I'd love to talk about that"],
    next: { '*': 'personality-mode-picker' },
  },

  // Figma 5132:57368 — the 3-card mode picker (Games / MCQs (Assessment) /
  // Open Chat). Figma merges the message text AND the cards into ONE shared
  // bg-white box, so `modeCards` lives on the bot() MESSAGE itself (renders
  // inside that same bubble via ChatThread's `options`-style handling) —
  // not a node-level property with its own separately-floating row, which
  // an earlier pass got wrong.
  'personality-mode-picker': {
    reply: () => [
      user("I'd love to talk about that"),
      bot(
        'Great 👌\nTo help personalize your talent journey, we’ll discover your unique personality traits.\nPlease select how you’d like to proceed',
        {
          modeCards: [
            {
              id: 'games',
              title: 'Games',
              description:
                'Play a short game — we read your decisions and patterns to build your personality profile.',
            },
            {
              id: 'mcq',
              title: 'MCQs (Assessment)',
              description:
                'Answer a short set of multiple choice questions. Quick, clear and structured.',
            },
            {
              id: 'open-chat',
              title: 'Open Chat',
              description:
                'Just talk freely — have a real back-and-forth with Career Buddy, type or speak.',
            },
          ],
        }
      ),
    ],
    next: { games: 'games-intro', mcq: 'mcq-q1', 'open-chat': 'open-chat-q1' },
  },

  // Games mode (Figma 5132:64829, verbatim) — hands off to the Game Store
  // modal (a separate React component, not more script nodes, since it's a
  // whole browsable catalog + detail view, not a linear Q&A). The modal
  // itself opens via `linkButton.onClick` (wired in CareerBuddySection).
  // Actual gameplay (the 4-stage Escape Room interaction) is still stubbed
  // this pass — Store + Details shell first, per the user's explicit
  // sequencing decision — so this node has no `next`; the conversation
  // continues once the user confirms the Personality panel row directly
  // (same mechanism MCQ/Open Chat already use), not via more chat nodes.
  'games-intro': {
    reply: () => [
      user('Play Games', { auto: true, autoLabel: '[Auto]' }),
      bot('All good! Check out the Game Store and choose whatever looks fun to you.', {
        linkButton: { label: 'Open Game Store' },
      }),
    ],
  },

  // Open Chat mode (Figma 5132:55945 → 55949, "IN PROGRESS" 5132:55734) —
  // 3 free-text questions, same edu-q*/interests-q* pattern.
  'open-chat-q1': {
    reply: () => [
      user('Open Chat', { auto: true, autoLabel: '[Auto]' }),
      bot(
        'OPEN CHAT! I love that. That’s a first.\nLet’s just chat a bit to understand how you think and work.\nTell me — when you’re faced with a challenge, how do you usually approach it?',
        { showActions: true }
      ),
    ],
    freeTextNext: 'open-chat-q2',
  },
  'open-chat-q2': {
    reply: () => [
      user('I usually pause, think it through, and break it down into smaller tasks.'),
      bot(
        'That’s a solid approach — sounds like you’re detail-oriented and logical.\nWhat kind of work environment brings out your best self — quiet and independent, or fast-paced and collaborative?',
        { showActions: true }
      ),
    ],
    freeTextNext: 'open-chat-q3',
  },
  'open-chat-q3': {
    reply: () => [
      user('I’d say independent, but I also like bouncing ideas off people occasionally.'),
      bot(
        'So balanced between introspection and teamwork — nice.\nLast one: When deadlines are tight, do you get energized or stressed?',
        { showActions: true }
      ),
    ],
    freeTextNext: 'open-chat-confirm',
  },
  'open-chat-confirm': {
    reply: () => [
      user('A bit of both — but I perform best under a little pressure.'),
      bot(
        'Based on your answers, we have summarized your personal traits in your talent profile panel on the right.\nCheck it out and feel free to comment on it.',
        { showActions: true, confirmsStageId: 'personality' }
      ),
    ],
  },

  // MCQ mode (Figma 5132:58211 → 58431, "IN PROGRESS" 5132:58016) — 4
  // lettered-option questions. Each `options` array renders as the 2-col
  // grid inside the bot bubble (Figma's exact layout, distinct from the
  // suggestedReplies row used elsewhere) — see ChatThread's `options`
  // support. Clicking an option produces an `[Auto] Option X` echo bubble
  // (Figma's own demo content — the literal option text isn't echoed) and
  // advances via `next`, same mechanism as modeCards.
  'mcq-q1': {
    reply: () => [
      user('MCQs (Assessment)', { auto: true, autoLabel: '[Auto]' }),
      bot('Great! First one\n1. When you’re solving a problem, what’s your first instinct?', {
        options: [
          { id: 'A', label: 'A) Look for logical steps and data' },
          { id: 'B', label: 'B) Talk it through with someone' },
          { id: 'C', label: 'C) Go with your intuition' },
          { id: 'D', label: 'D) Observe quietly before acting' },
        ],
      }),
    ],
    next: { '*': 'mcq-q2' },
  },
  'mcq-q2': {
    reply: () => [
      bot(
        'Nice — sounds like you value structure and clarity.\n1. When working on a team project, what motivates you the most?',
        {
          options: [
            { id: 'A', label: 'A) Reaching the goal efficiently' },
            { id: 'B', label: 'B) Seeing everyone enjoy the process' },
            { id: 'C', label: 'C) Trying out creative ideas' },
            { id: 'D', label: 'D) Taking the lead and organizing things' },
          ],
        }
      ),
    ],
    next: { '*': 'mcq-q3' },
  },
  'mcq-q3': {
    reply: () => [
      bot(
        'Perfect — I can already see a mix of analytical and creative traits forming.\n1. Now imagine you’re working with a team and someone disagrees with your idea.\nDo you tend to:',
        {
          options: [
            { id: 'A', label: 'A) Defend your idea with logic' },
            { id: 'B', label: 'B) Try to understand their point calmly, or' },
            { id: 'C', label: 'C) Step back and let the group decide?' },
          ],
        }
      ),
    ],
    next: { '*': 'mcq-q4' },
  },
  'mcq-q4': {
    reply: () => [
      bot(
        'That’s a great mix of logic and empathy — solid communication balance.\nHere’s a fun one — how do you react when things don’t go as planned?',
        {
          options: [
            { id: 'A', label: 'A) I try to stay calm and adjust.' },
            { id: 'B', label: 'B) I get angry and begin to blame others' },
          ],
        }
      ),
    ],
    next: { '*': 'mcq-confirm' },
  },
  'mcq-confirm': {
    reply: () => [
      bot(
        'Love that. That shows emotional stability and problem-solving confidence..\nBased on your answers, we have summarized your personal traits in your talent profile panel on the right.\nCheck it out and feel free to comment on it.',
        { showActions: true, confirmsStageId: 'personality' }
      ),
    ],
  },

  // Figma 5132:64061 — the hand-off out of Personality once its panel
  // Confirm succeeds (STAGE_SAVE_META.personality.nextNodeId in
  // CareerBuddySection.jsx, previously `null` since no verified content
  // existed for what came next — this is that content).
  'post-personality-prompt': {
    reply: () => [
      bot(
        "Okay that's great. We've covered a lot.\nNow would you like to continue populating your profile or you want some guidance based on what we've discussed so far?"
      ),
    ],
    suggestedReplies: ['Continue populating profile', 'I think I need some guidance'],
    next: {
      'Continue populating profile': 'section-picker-prompt',
      'I think I need some guidance': 'guidance-intro',
    },
  },

  // Figma 5132:52485 / 64380 — Career Buddy AI Provides Guidance Flow.
  // Area chips (white pills) → Career Exposure Q&A fills Career Options
  // (desired-career). The other 6 areas are stubbed (no Figma Q&A yet).
  // "Entrepreneurial  Guidance" keeps Figma's double space. "Talent
  // Profile Pannel" is corrected to "Panel" (same as Work Experience).
  'guidance-intro': {
    reply: () => [
      user('I think I need some guidance'),
      bot(
        "That's alright brother. I get where you're coming from.\nSelect which area you need guidance in the options below👇"
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'guidance-intro-returning': {
    reply: () => [
      user('Give me career guidance'),
      bot(
        "That's alright brother. I get where you're coming from.\nSelect which area you need guidance in the options below👇"
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'guidance-intro-section': {
    reply: () => [
      user('Career Options'),
      bot(
        "That's alright brother. I get where you're coming from.\nSelect which area you need guidance in the options below👇"
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },

  // Career Exposure Q&A (Figma 5132:64380, verbatim). Figma's user bubble
  // after the mentoring question accidentally re-echoes the prior bot
  // question — replaced here with a short answer that matches the next
  // bot line ("collaborative, impact-oriented roles").
  'exposure-q1': {
    reply: () => [
      user('Career exposure', { auto: true, autoLabel: '[Auto]' }),
      bot(
        "Let's talk about your career exposure.\nThis is where we explore the kinds of industries, roles, or experiences that match your skills and interests.\nTo start, have you had any internships, volunteering, or hands-on experiences related to your field?"
      ),
    ],
    freeTextNext: 'exposure-q2',
  },
  'exposure-q2': {
    reply: () => [
      user('Yeah, I volunteered at a local coding club teaching students the basics of Python.'),
      bot(
        "That's great! Teaching builds both communication and technical confidence — strong signs of leadership potential.\nWould you say you enjoyed mentoring others more, or did you prefer the technical side of it?"
      ),
    ],
    freeTextNext: 'exposure-q3',
  },
  'exposure-q3': {
    reply: () => [
      user('I enjoyed mentoring more — helping students finally get it was the highlight for me.'),
      bot(
        "That's insightful — sounds like you're drawn to collaborative, impact-oriented roles.\nBased on your background in technology and education, you might thrive in roles like\nTech Educator, Instructional Designer, or Product Trainer.\n\nWould you like me to show you a few related career paths or sample roles in\n Ghana's growing tech education space?"
      ),
    ],
    freeTextNext: 'exposure-q4',
  },
  'exposure-q4': {
    reply: () => [
      user('Yes, that would be great.'),
      bot(
        'Awesome 👍 — here are a few directions you could explore:\nEdTech Startups: roles like Learning Experience Designer or Technical Curriculum Developer.\nSTEM Outreach Programs: organizations that mentor or train young learners in computing.\nCorporate Training Roles: companies that upskill employees in data and software tools.\n\nEach of these can help you build both your tech and people-focused strengths. Do any of these sound exciting to you?'
      ),
    ],
    freeTextNext: 'exposure-q5',
  },
  'exposure-q5': {
    reply: () => [
      user('Yeah, the EdTech startup direction sounds interesting.'),
      bot(
        "Perfect — I'll keep that in your profile as a key career interest. If you'd like, I can also recommend short online programs or internships\nto help you explore that space further.\n\nWould you like to continue with that, or do you want to ask me something\nspecific about these roles first?"
      ),
    ],
    freeTextNext: 'exposure-q6',
  },
  'exposure-q6': {
    reply: () => [
      user("Can you tell me what skills I'll need to get into that area?"),
      bot(
        'Of course! For most EdTech startup roles, here are core skills you can start building:\nTechnical: basic web development, digital tools for learning (LMS platforms, no-code tools)\nSoft skills: communication, curriculum design, storytelling\nEntrepreneurial mindset: being comfortable testing ideas and adapting quickly\n\nI can help you identify learning resources or programs in these areas.\nWould you like to see those recommendations next?'
      ),
    ],
    freeTextNext: 'exposure-wrap',
  },
  'exposure-wrap': {
    reply: () => [
      user('Of course'),
      bot(
        'Got it ✅ — I’ll include tailored upskilling options in your “Career Exposure” summary.\nNow, before we wrap up — Would you like to:'
      ),
    ],
    suggestedReplies: [
      'Continue exploring guidance in another area',
      'Return to your profile setup to complete more sections?',
    ],
    next: {
      'Continue exploring guidance in another area': 'exposure-confirm-continue',
      'Return to your profile setup to complete more sections?': 'exposure-confirm-return',
    },
  },
  // Continue path: panel confirm + next-area chips in the same turn
  // (Figma 5132:64380). Chips stay on this node after save (nextNodeId
  // null); CareerBuddySection sets guidanceResumeNodeId only for return.
  'exposure-confirm-continue': {
    reply: () => [
      user('Continue exploring guidance in another area'),
      bot(
        `Perfect, ${TALENT_NAME} — I've recorded that. Just to confirm, kindly cross-check on your Talent Profile Panel to my right.\nWhat area should I guide you on next?`,
        { confirmsStageId: 'desired-career' }
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS_AFTER,
    next: GUIDANCE_AREA_NEXT_AFTER,
  },
  'exposure-confirm-return': {
    reply: () => [
      user('Return to your profile setup to complete more sections?'),
      bot(
        `Perfect, ${TALENT_NAME} — I've recorded that. Just to confirm, kindly cross-check on your Talent Profile Panel to my right.`,
        { confirmsStageId: 'desired-career' }
      ),
    ],
  },

  'stub-guidance-secondary-elective': {
    reply: () => [
      user('Secondary Elective Matching'),
      bot(
        "Secondary Elective Matching is up next on my roadmap — I'll bring that guidance area online soon. Pick another area below, or confirm Career Options on the panel if you haven't yet."
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'stub-guidance-tertiary': {
    reply: () => [
      user('Tertiary Course Matching'),
      bot(
        "Tertiary Course Matching is up next on my roadmap — I'll bring that guidance area online soon. Pick another area below, or confirm Career Options on the panel if you haven't yet."
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'stub-guidance-mock-interviews': {
    reply: () => [
      user('Mock Interviews'),
      bot(
        "Mock Interviews is up next on my roadmap — I'll bring that guidance area online soon. Pick another area below, or confirm Career Options on the panel if you haven't yet."
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'stub-guidance-opportunity': {
    reply: () => [
      user('Opportunity Matching'),
      bot(
        "Opportunity Matching is up next on my roadmap — I'll bring that guidance area online soon. Pick another area below, or confirm Career Options on the panel if you haven't yet."
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'stub-guidance-talent': {
    reply: () => [
      user('Talent Matching'),
      bot(
        "Talent Matching is up next on my roadmap — I'll bring that guidance area online soon. Pick another area below, or confirm Career Options on the panel if you haven't yet."
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },
  'stub-guidance-entrepreneurial': {
    reply: () => [
      user('Entrepreneurial  Guidance'),
      bot(
        "Entrepreneurial  Guidance is up next on my roadmap — I'll bring that guidance area online soon. Pick another area below, or confirm Career Options on the panel if you haven't yet."
      ),
    ],
    suggestedReplies: GUIDANCE_AREA_CHIPS,
    next: GUIDANCE_AREA_NEXT,
  },

  // Figma 5132:49680 — the section-picker mode-cards (3×2 grid, distinct
  // from Personality's own 3-card single-row picker; ChatThread's
  // modeCards grid handles both since it's grid-cols-3 regardless of
  // count). Card ids match CAREER_BUDDY_STAGES ids exactly so the icon
  // lookup and any future STAGE_QA_NODE_PREFIX/trail wiring stay
  // consistent. No description text exists in Figma for these cards
  // (unlike Personality's, which had one) — omitted rather than invented.
  'section-picker-prompt': {
    reply: () => [
      user('Continue populating profile'),
      bot('Okay that’s wonderful. Which section do you want to us to talk about', {
        modeCards: [
          { id: 'skills', title: 'Skills' },
          { id: 'work-experience', title: 'Work Experience' },
          { id: 'project-portfolio', title: 'Project Portfolio' },
          { id: 'certifications', title: 'Certifications' },
          { id: 'talent-pitch', title: 'Career Pitch' },
          { id: 'desired-career', title: 'Career Options' },
        ],
      }),
    ],
    next: {
      skills: 'stub-skills-section',
      'work-experience': 'work-q1',
      'project-portfolio': 'stub-portfolio-section',
      certifications: 'stub-certifications-section',
      'talent-pitch': 'stub-career-pitch-section',
      'desired-career': 'guidance-intro-section',
    },
  },
  // Return-from-guidance hand-off — same picker, no "Continue populating
  // profile" user echo (that chip wasn't what got us here).
  'section-picker-from-guidance': {
    reply: () => [
      bot('Okay that’s wonderful. Which section do you want to us to talk about', {
        modeCards: [
          { id: 'skills', title: 'Skills' },
          { id: 'work-experience', title: 'Work Experience' },
          { id: 'project-portfolio', title: 'Project Portfolio' },
          { id: 'certifications', title: 'Certifications' },
          { id: 'talent-pitch', title: 'Career Pitch' },
          { id: 'desired-career', title: 'Career Options' },
        ],
      }),
    ],
    next: {
      skills: 'stub-skills-section',
      'work-experience': 'work-q1',
      'project-portfolio': 'stub-portfolio-section',
      certifications: 'stub-certifications-section',
      'talent-pitch': 'stub-career-pitch-section',
      'desired-career': 'guidance-intro-section',
    },
  },
  // Work Experience is built; Career Options routes into guidance above.
  // Remaining section-picker cards stay on the "coming soon" convention.
  'stub-skills-section': {
    reply: () => [
      user('Skills'),
      bot(
        "Skills is up next on my roadmap — I'll bring that section online soon. Let's keep building elsewhere for now."
      ),
    ],
  },
  'stub-portfolio-section': {
    reply: () => [
      user('Project Portfolio'),
      bot(
        "Project Portfolio is up next on my roadmap — I'll bring that section online soon. Let's keep building elsewhere for now."
      ),
    ],
  },
  'stub-certifications-section': {
    reply: () => [
      user('Certifications'),
      bot(
        "Certifications is up next on my roadmap — I'll bring that section online soon. Let's keep building elsewhere for now."
      ),
    ],
  },
  'stub-career-pitch-section': {
    reply: () => [
      user('Career Pitch'),
      bot(
        "Career Pitch is up next on my roadmap — I'll bring that section online soon. Let's keep building elsewhere for now."
      ),
    ],
  },

  // Work Experience Q&A (Figma 5132:64061, verbatim) — a single job
  // (CodeBase Ghana) walked through 6 questions + a clarification nudge,
  // ending in the panel review hand-off. "Andrew" in the source frame is
  // normalised to TALENT_NAME here (same reasoning as the Educational
  // Background NAMING NOTE at the top of this file — "Emma" is the
  // consistent persona everywhere else, "Andrew" appears only twice in
  // this one exchange). "Talent Profile Pannel" (double-n) is corrected
  // to "Panel" — a plain spelling typo, not a content decision, and the
  // real component in this app is genuinely named "Talent Profile Panel"
  // everywhere else.
  'work-q1': {
    reply: () => [
      user('Work Experience'),
      bot(
        `Alright ${TALENT_NAME}, let's talk about your work experience so I can update your profile.\n Have you worked, interned, or volunteered anywhere before?`
      ),
    ],
    freeTextNext: 'work-q2',
  },
  'work-q2': {
    reply: () => [
      user('Yeah, I had an internship at CodeBase Ghana last year.'),
      bot("That's awesome! What role or position did you hold there?"),
    ],
    freeTextNext: 'work-q3',
  },
  'work-q3': {
    reply: () => [
      user('I was a software development intern.'),
      bot('Nice! What kind of projects or tasks were you involved in?'),
    ],
    freeTextNext: 'work-q4',
  },
  'work-q4': {
    reply: () => [
      user(
        'I helped the team build an internal dashboard for tracking clients and tasks.\nI mostly worked with React and Node.js.'
      ),
      bot(
        "Great — so that's a software development internship, focused on React and Node.js for internal product development.\nHow long was the internship, and what were the start and end months?"
      ),
    ],
    freeTextNext: 'work-q4-clarify',
  },
  // Figma's own next state always shows this clarification nudge after the
  // vague canned answer below — this FSM has no real NLP to branch on
  // what the user actually typed, so it's a fixed intermediate step, not
  // a conditional response to input content.
  'work-q4-clarify': {
    reply: () => [
      user('I think 3 months or so I am not sure.'),
      bot(
        `${TALENT_NAME} we want you to be specific with those dates please as your GTH profile\ncan serve as a CV to other recruiters or employers.`
      ),
    ],
    freeTextNext: 'work-q5',
  },
  'work-q5': {
    reply: () => [
      user('It started in June 2024 and ended in August 2024.'),
      bot(
        'Got it 👍 — three months of practical experience!\n How would you describe the main skills or lessons you took away from that experience?'
      ),
    ],
    freeTextNext: 'work-q6',
  },
  'work-q6': {
    reply: () => [
      user('I improved my teamwork, time management, and backend debugging skills.'),
      bot(
        'Excellent — that’s teamwork, time management, and technical problem-solving.\nDid you have the information (name, email and contact) of a supervisor or mentor you’d like to mention for reference purposes?'
      ),
    ],
    freeTextNext: 'work-confirm',
  },
  'work-confirm': {
    reply: () => [
      user(
        'Yes, my supervisor information is:\nName: Mr. Kwame Agyapong.\nEmail: aqyapongkwa23@gmail.com\nContact: +223 243567890'
      ),
      bot(
        `Perfect, ${TALENT_NAME} — I've recorded that. Just to confirm, kindly cross-check on your Talent Profile Panel to my right.`,
        {
          confirmsStageId: 'work-experience',
        }
      ),
    ],
  },

  'returning-prompt': {
    hero: 'returning',
    seedMessages: () => [],
    suggestedReplies: [
      'Continue my Education section',
      'I want to work on Skills',
      'Give me career guidance',
    ],
    next: {
      'Continue my Education section': 'edu-q1',
      'I want to work on Skills': 'stub-skills',
      // Career guidance anytime — same area-picker + Career Exposure flow
      // as the post-Personality path (Figma 5132:52485).
      'Give me career guidance': 'guidance-intro-returning',
    },
  },
  'stub-skills': {
    reply: () => [
      user('I want to work on Skills'),
      bot(
        "Skills is up next on your journey — I'll bring that flow online soon. For now, let's keep building elsewhere."
      ),
    ],
  },
};
