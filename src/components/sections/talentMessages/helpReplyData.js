/*
 * Help me reply (Career Buddy AI) — API-shaped mock for
 *   POST /messages/conversations/:id/reply-suggestions  ->  REPLY_SUGGESTIONS_RESPONSE
 * Copy is VERBATIM from Figma Talent Messages H-01…H-04 (Playful 7463:4297/4862/5418/5987, Focused 8110:449385/449794/
 * 450198/450605). Playful and Focused copy is identical for this panel. Only the first idea ("Say thanks & confirm I’m
 * interested", Friendly tone) has drawn draft text, so it is the only one with a draft: the other idea chips and the
 * Professional / Short tones are drawn but have no drawn result, so they do nothing (nothing is invented).
 */

export const REPLY_TONES = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'professional', label: 'Professional' },
  { id: 'short', label: 'Short' },
];

export const REPLY_COPY = {
  title: 'Help me reply',
  privacy: 'Career Buddy · only reads this chat · you send, not Buddy',
  toneLabel: 'Tone',
  draftIntro: 'Here’s a draft. Change anything you like before you send it.',
  useThis: 'Use this reply',
  shorter: 'Make it shorter',
  formal: 'More formal',
  tryAgain: 'Try again',
  // accessible name only (the drawn close button is an icon with no text)
  close: 'Close Help me reply',
  placedNote: 'Drafted with Buddy edit anything, then send. Recruiters don’t see this label.',
  undo: 'Undo',
};

// How long "Buddy is writing" shows before the draft appears: Figma draws only the two states, so a timer is the minimum
// needed for the flow to move on (not content).
export const REPLY_WRITING_MS = 2600;

export const REPLY_SUGGESTIONS_RESPONSE = {
  conversationId: 'owura',
  prompt:
    'Mr. Asante explained the process: a short skills task, then a 30-minute call. How do you want to reply?',
  defaultTone: 'friendly',
  ideas: [
    {
      id: 'thanks',
      label: 'Say thanks & confirm I’m interested',
      writing: 'Writing a friendly reply that thanks Mr. Asante and confirms you’re interested…',
      drafts: {
        friendly: {
          text: 'Thank you, Mr. Asante  that sounds great! I’m very interested in the Data Science Intern role and happy to do the skills task this week. Is there a deadline I should keep in mind?',
          // H-04 composer text: the em dash only exists there (the H-03 node text has two spaces in its place).
          placedText:
            'Thank you, Mr. Asante — that sounds great! I’m very interested in the Data Science Intern role and happy to do the skills task this week. Is there a deadline I should keep in mind?',
          meta: 'Friendly · 38 words · mentions the role and asks one question',
        },
      },
    },
    // The three chips below are drawn in H-01 but have no drawn writing line or draft: they do nothing.
    { id: 'deadline', label: 'Ask about the deadline', drawn: false },
    { id: 'task-covers', label: 'Ask what the skills task covers', drawn: false },
    { id: 'decline', label: 'Politely say no', drawn: false },
  ],
};

/** Resolve the idea + its drawn Friendly draft (only the first idea has one). */
export const getReplyDraft = (ideaId, toneId, response = REPLY_SUGGESTIONS_RESPONSE) => {
  const idea = response.ideas.find((i) => i.id === ideaId && i.drafts) ?? response.ideas[0];
  const draft = idea.drafts[toneId] ?? idea.drafts.friendly;
  return { idea, draft };
};
