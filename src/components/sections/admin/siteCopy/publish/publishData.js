/*
 * publishData — copy, limits, the change model and the demo seeds of the publish flow (Platform Admin 7.8.4a-i).
 *
 * A "change set" (what PublishBar / PublishDialogs receive as `changes`) is one entry per edited SECTION:
 *   { sectionId: 'public.home.hero', label: 'Home › Hero', name: 'Hero', currentVersion?: 5,
 *     shared?: { name: 'footer', pages: 46 },                // a section used on every page (7.8.4d)
 *     fields: [{ key, label, before, after, summary?, quoted?, kind?: 'text' | 'image', ... }] }
 * `fields` are the changed fields (the dialog lists one row per field). Image fields add { assetName, alt, identifiable, consent }.
 *
 * ⚠️ ASSUMPTION (all of these are tagged where used): the shape above (frames only draw its output); the reason length 3–200 (the 7.8.4c
 * message says "3–200 characters", the counter "24 / 200"); the demo field keys (the editor, builder B1, owns the real keys); the toast
 * auto-dismiss time; history `when` as an ISO string.
 */

export const REASON_MIN = 3;
export const REASON_MAX = 200;

/** ⚠️ ASSUMPTION: a toast closes itself after this long (Figma draws no timer). */
export const TOAST_MS = 8000;

export const PUBLISH_COPY = {
  reasonLabel: 'Why are you publishing this?',
  reasonPlaceholder: 'For example: Fix typo in hero',
  reasonError:
    'Add a short reason (3–200 characters) so the team knows why this changed. Nothing was published.',
  reasonHint: 'everyone on the team can see this in history',
  minuteNote: 'Users see the change within about a minute.',
  cancel: 'Cancel',
  liveToast: 'Live · users will see this within a minute',
  viewHistory: 'View history',
  discardWarn: 'Discarded drafts can’t be brought back.',
  keepEditing: 'Keep editing',
  discardChanges: 'Discard changes',
  draftsKept: 'Your drafts are kept',
  leaveEditor: 'Leave editor',
  publishNow: 'Publish now',
  sharedExamples: 'Home, Sign up and Help centre',
  blockedBody: 'Your text changes are fine. Only the new image needs these.',
  blockedAlt: 'Add a description for this image in the media library',
  blockedConsent: 'Confirm consent for the people in this photo first',
  blockedConsentDetail: 'The photo is marked “Shows identifiable people”',
  close: 'Close',
  openMedia: 'Open media library',
};

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const changeCount = (changes) =>
  changes.reduce((sum, c) => sum + (c.fields?.length ?? 0), 0);

/** "Home › Hero (2) · Home › FAQ (1)" (the sticky bar's second line). */
export const barSummary = (changes) =>
  changes.map((c) => `${c.label} (${c.fields.length})`).join(' · ');

/** One list row per changed field: "Home › Hero · Headline" + "before → after" (or the field's own summary). */
export const changeRows = (changes) =>
  changes.flatMap((c) =>
    c.fields.map((f) => ({
      id: `${c.sectionId}:${f.key}`,
      title: `${c.label} · ${f.label}`,
      detail: f.summary ?? (f.quoted ? `“${f.before}” → “${f.after}”` : `${f.before} → ${f.after}`),
    }))
  );

/** What stops a publish (7.8.4h): an image without a description, an identifiable photo without consent. */
export const findBlockers = (changes) =>
  changes.flatMap((c) =>
    c.fields
      .filter((f) => f.kind === 'image')
      .flatMap((f) => {
        const out = [];
        if (!f.alt?.trim()) {
          out.push({
            id: `${c.sectionId}:${f.key}:alt`,
            title: PUBLISH_COPY.blockedAlt,
            detail: `${f.label} · “${f.assetName}” has no alt text`,
          });
        }
        if (f.identifiable && !f.consent) {
          out.push({
            id: `${c.sectionId}:${f.key}:consent`,
            title: PUBLISH_COPY.blockedConsent,
            detail: PUBLISH_COPY.blockedConsentDetail,
          });
        }
        return out;
      })
  );

/** Which dialog the Publish button opens for this change set. */
export const publishModalFor = (changes) => {
  if (findBlockers(changes).length) return 'blocked';
  if (changes.some((c) => c.shared)) return 'publish-shared';
  return 'publish';
};

/** "“A”, “B” and “C”" for the discard text (the published values the drafts go back to). */
export const quotedList = (values) => {
  const q = values.map((v) => `“${v}”`);
  if (q.length <= 1) return q.join('');
  return `${q.slice(0, -1).join(', ')} and ${q[q.length - 1]}`;
};

/* ---------------------------------------------------------------- demo seeds (7.8.4a-i frames) */

export const DEMO_HERO_CHANGE = {
  sectionId: 'public.home.hero',
  label: 'Home › Hero',
  name: 'Hero',
  currentVersion: 5, // ⚠️ ASSUMPTION: 7.8.4e's editor reads "version 6" after publishing, so the demo history stands at 5
  fields: [
    {
      key: 'headline',
      label: 'Headline',
      before: 'Find work that fits you',
      after: 'Your future starts here',
    },
    {
      key: 'main-button-text',
      label: 'Main button text',
      before: 'Create my profile',
      after: 'Join for free',
    },
  ],
};

export const DEMO_FAQ_CHANGE = {
  sectionId: 'public.home.faq',
  label: 'Home › FAQ',
  name: 'FAQ',
  currentVersion: 0,
  fields: [
    {
      key: 'answer-3',
      label: 'Answer 3',
      before: '',
      after: '',
      summary: 'Bold text and a 3-item list added',
    },
  ],
};

export const DEMO_FOOTER_CHANGE = {
  sectionId: 'public.shared.footer',
  label: 'Footer',
  name: 'Footer',
  currentVersion: 0,
  shared: { name: 'footer', pages: 46 },
  fields: [
    {
      key: 'tagline',
      label: 'Tagline',
      quoted: true,
      before: 'Ghana Talent Hub · Built in Ghana, for Ghana’s young people',
      after: 'Built in Ghana, for every young person with a dream',
    },
  ],
};

export const DEMO_IMAGE_CHANGE = {
  ...DEMO_HERO_CHANGE,
  fields: [
    ...DEMO_HERO_CHANGE.fields,
    {
      key: 'hero-image',
      label: 'Hero image',
      kind: 'image',
      assetName: 'Career fair 2026',
      alt: '',
      identifiable: true,
      consent: false,
      before: '',
      after: 'Career fair 2026',
    },
  ],
};

/** ⚠️ ASSUMPTION: the reasons typed in the frames, used to pre-fill the field when a frame URL is opened (never in the live flow). */
export const DEMO_REASONS = {
  publish: 'New hero wording for MVP',
  'publish-shared': 'Shorter, warmer tagline for launch',
};
