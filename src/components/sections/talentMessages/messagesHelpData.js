/*
 * Messages · Help pop-over copy — Figma "HP · Help pop-over overlay" (Playful 8376:504797, Focused 8376:504917).
 * The card is the same as the default Help pop-over with the "for this page" block swapped; the text is identical in
 * Playful and Focused (texts.py diff of the two frames is empty). Same export shape as SKILLS_LAB_HELP_COPY, so
 * HelpPopover picks it through `home.helpPage === 'messages'` (the lead wires that — HelpPopover.jsx is not edited here).
 * Row icons: 20-help x3, 20-shield, 20-info-circle, 20-check-circle-fill (read from the frame; same keys as the other pages).
 * ✅ VERIFIED: every string below is verbatim from the node `characters` (texts.py).
 */
export const MESSAGES_HELP_COPY = {
  title: 'Help',
  subtitle: 'Quick answers for the page you are on',
  search: 'Search help, e.g. verify a skill',
  pageLabel: 'FOR THIS PAGE · MESSAGES',
  page: [
    { label: 'How do I report a recruiter?', icon: 'help' },
    { label: 'Can recruiters see my phone number?', icon: 'help' },
    { label: 'How do I block someone?', icon: 'help' },
  ],
  popularLabel: 'POPULAR',
  popular: [
    { label: 'A recruiter asked me to pay a fee. What do I do?', icon: 'shield' },
    { label: 'Can I use GTH without data?', icon: 'info' },
    { label: 'How do I verify a skill?', icon: 'verified' },
  ],
  buddy: 'Ask Career Buddy',
  whatsapp: 'WhatsApp us',
  replay: 'Replay the tour',
  shortcuts: 'Shortcuts',
  help: 'Help centre',
};
