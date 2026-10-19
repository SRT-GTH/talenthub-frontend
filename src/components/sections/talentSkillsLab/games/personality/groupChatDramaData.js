/*
 * Group Chat Drama mock content (Figma SL-GP08 Your reply, Playful 7943:10463 / Focused 8110:497617). Chat 2 and all of
 * its copy are verbatim from the frame. ⚠️ ASSUMPTION: chats 1 and 3 (same group, same four reply styles, new messages)
 * and the completion dialog.
 */
const REPLY_NAMES = ['Take charge', 'Nudge Yaw kindly', 'Cool things down', 'Go quiet'];
const GROUP = { name: 'Final Year Project · CS 400', members: 'Kojo, Ama, Yaw, Esi, You' };
const SPEAKER_COLOR = { Kojo: '#387440', Ama: '#6d28d9', Yaw: '#463409', Esi: '#244a9f' };

export const speakerColor = (name) => SPEAKER_COLOR[name] ?? '#387440';

export const CHAT = {
  gameId: 'group-chat-drama',
  title: 'Personality game · Group Chat Drama',
  subtitle: '3 chats · No wrong replies · About 2 min left',
  xp: '+15 {xp}',
  doneXp: '+50 {xp}',
  doneSubtitle: '3 chats · Game done',
  progressNote: 'Saved after every reply',
  doneNote: 'Saved',
  info: 'Pick what you would really send. Saying nothing is an option too.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Agreeableness', 'Taking the lead'],
  composer: 'Pick a reply on the right…',
  typing: 'Kojo is typing',
  group: GROUP,
  chats: [
    {
      /* ⚠️ ASSUMPTION: chat 1 */
      sticker: 'CHAT 1 OF 3',
      eyebrow: 'CHAT 1 · SOCIAL',
      title: ['Your project group chat just woke up. ', 'What do you send?'],
      body: 'Nobody has picked a topic for the final report yet, and the deadline is two weeks away.',
      vibe: { icon: 'smile', label: 'Vibe: Calm' },
      meter: { icon: 'file', label: 'Report topics: 0 of 5' },
      messages: [
        { who: 'Kojo', text: 'Has anyone started on the report topics?', time: '7:12 PM' },
        { who: 'Ama', text: 'I will wait for the supervisor to reply first.', time: '7:14 PM' },
        { who: 'Yaw', text: 'Same here.', time: '7:15 PM' },
      ],
      replies: [
        '"Let us list five topics tonight and vote tomorrow."',
        '"@Yaw, which topic would you like?"',
        '"No stress, we still have time."',
        'Say nothing and read what the others pick first.',
      ],
    },
    {
      /* DRAWN: GP08 */
      sticker: 'CHAT 2 OF 3',
      eyebrow: 'CHAT 2 · SOCIAL',
      title: ['Your project group chat is on fire. ', 'What do you send?'],
      body: 'The presentation is tomorrow at 9. Slides 6 to 10 are still empty, and you know that part well.',
      vibe: { icon: 'sad', label: 'Vibe: Tense' },
      meter: { icon: 'file', label: 'Slides done: 5 of 10' },
      messages: [
        {
          who: 'Kojo',
          text: 'Guys, the presentation is TOMORROW 9am and slides 6 to 10 are still empty.',
          time: '10:38 PM',
        },
        { who: 'Ama', text: 'I finished my part on Monday. Just saying.', time: '10:39 PM' },
        {
          who: 'Yaw',
          text: 'Sorry o, light off at my side since evening. I will try tonight.',
          time: '10:40 PM',
        },
        { who: 'Kojo', text: 'This is exactly what happened last semester.', time: '10:41 PM' },
        { who: 'Esi', text: 'Please, let us not fight here.', time: '10:41 PM' },
      ],
      replies: [
        '"Let us split 6 to 10 now. I will take 8 and 9, who wants 6 and 7?"',
        '"@Yaw, can you send what you have by 11? We can help fill the gaps."',
        '"Everyone calm down. We will be fine tomorrow."',
        'Say nothing tonight. Wake up early and do it yourself.',
      ],
    },
    {
      /* ⚠️ ASSUMPTION: chat 3 */
      sticker: 'CHAT 3 OF 3',
      eyebrow: 'CHAT 3 · SOCIAL',
      title: ['Presentation day, and one slide will not open. ', 'What do you send?'],
      body: 'You present in ten minutes and the projector will not open Yaw’s file.',
      vibe: { icon: 'sad', label: 'Vibe: Heated' },
      meter: { icon: 'file', label: 'Slides done: 9 of 10' },
      messages: [
        { who: 'Esi', text: 'The projector will not open Yaw’s file!', time: '8:46 AM' },
        { who: 'Yaw', text: 'It worked at home, I swear.', time: '8:47 AM' },
        { who: 'Kojo', text: 'We have ten minutes.', time: '8:47 AM' },
      ],
      replies: [
        '"Yaw, send it to me. I will convert it now."',
        '"@Yaw, can you share a PDF version too?"',
        '"Breathe, we have a backup on the drive."',
        'Say nothing and open the backup yourself.',
      ],
    },
  ],
  replyNames: REPLY_NAMES,
  complete: {
    sticker: 'CHAT DONE',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Calm Organiser.',
    body: 'You stepped in with a plan when the chat got loud and kept it kind.',
    stats: [
      { value: '3 of 3', label: 'CHATS', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      { label: 'Agreeableness', note: 'Kept replies kind', chip: '+6', strong: true },
      { label: 'Taking the lead', note: 'Offered a plan first', chip: '+5', strong: true },
    ],
    next: { title: 'Up next: Speed Sort', sub: '~2 min · Speed · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
