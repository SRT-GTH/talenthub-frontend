/*
 * articleData — the help articles of the parent "Help and guides" (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 10 Help and safety" 10057:67418).
 * Only one article is drawn: PH-02 "Opting out and privacy" 10053:3343 (crumb "Help and guides › Your controls"). The other five topics have no designed article yet (their cards only log).
 * `related` links: `to` opens a built page; without `to` the link has no designed destination (it only logs).
 */
export const ARTICLES = {
  'opting-out': {
    title: 'Opting out and privacy',
    crumb: 'Your controls',
    sections: [
      {
        heading: 'What opt-out does',
        body: 'Your ward can’t sign in, and recruiters and clubs can’t see them. They get a message saying their access is paused by you.',
      },
      {
        heading: 'What’s kept',
        body: 'Their profile, badges, Cycles, wallet balance and certificates are kept safely, exactly as they were.',
      },
      {
        heading: 'How to restore access',
        body: 'Go to My wards, open your ward and choose Restore access. They’re told straight away and can carry on.',
      },
      {
        heading: 'What you can’t do',
        body: 'Parents can’t edit a ward’s profile or read their private chats. If something looks wrong, flag it and they fix it.',
        tight: true,
      },
    ],
    related: [
      { label: 'Flagging your ward’s profile →' },
      { label: 'When your ward turns 18 →' },
      { label: 'Report a safety concern →', to: '/parent/help?modal=report' },
    ],
  },
};

export const ARTICLE_FEEDBACK = { prompt: 'Was this helpful?', yes: 'Yes', no: 'Not really' };
