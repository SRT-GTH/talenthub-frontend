/* AX-05 mock data — verbatim from Figma Playful 7591:3047 / Focused 8110:392527. No real video file exists. */
export const PITCH_AX = {
  title: 'My 60-sec pitch',
  link: 'Re-record',
  duration: 58,
  startAt: 21,
  hint: [
    { keys: ['Space'], label: 'play / pause' },
    { keys: ['C'], label: 'captions' },
    { keys: ['T'], label: 'transcript' },
    { keys: ['arrows'], label: '5 seconds' },
    { keys: ['D'], label: 'audio description' },
  ],
  notice: {
    title: 'Captions were made automatically',
    body: 'Check Ghanaian names, places and Twi words: auto-captions often get these wrong.',
    action: 'Review captions',
  },
  transcriptTitle: 'Transcript',
  transcriptChip: 'English · 2 Twi phrases marked',
  download: 'Download .txt ↓',
  twiTag: 'Twi',
  lines: [
    { at: 0, text: 'Hi, I’m Kofi Agyekum. I’m a final-year Statistics student at KNUST.' },
    { at: 7, text: 'I make numbers make sense for people who don’t love numbers.' },
    { at: 14, text: 'Last year I interned at the Ghana Statistical Service…' },
    { at: 19, text: '…so I built a dashboard that shows which trotro routes jam first.' },
    { at: 27, text: 'I clean data in SQL and Python, and I tell the story in Power BI.' },
    { at: 35, text: '“Me pɛ sɛ meboa” (I want to help) teams decide faster.', twi: true },
    { at: 44, text: 'I’m looking for my first analyst role in Accra. Let’s talk!' },
  ],
};
