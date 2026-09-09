/*
 * pitchModeStyles.js — non-component constants + helpers for the Talent
 * Pitch (stage 9) flow. Split out of PitchStage2Section.jsx for the same
 * reason `certTypeStyles.js` / `goalTypeStyles.js` exist: the
 * `react-refresh/only-export-components` lint rule forbids exporting
 * non-component values from a file that also default-exports a component.
 *
 * Every string below is ✅ VERIFIED verbatim from a real
 * `mcp__figma__get_design_context` dive (file key Bin8roWL8sloyc36IgFMuT,
 * 2026-09-09). Node ids are noted per block so a manual re-verification pass
 * can jump straight to the source.
 */

// ── Mode tabs — Figma 6120:134569 (Upload frame), 6107:134149 (Upload-loaded
// frame), 6120:134598 (Written frame). Pill: px-16 py-6, rounded-999.
//   inactive  bg white, 1px #e8e8e4, 12px medium #70706e
//   active    bg #eff4f0, 1px #387440, 12px semibold #387440
//
// ❓ NEEDS-CLARIFICATION: Figma draws this tab row on the Upload and Written
// frames but NOT on either Record frame (6083:46594 / 5890:1732) or the
// empty state (5890:2). With no tab row in Record mode there is no way back
// to Upload/Written once you start recording, so the row is rendered for all
// three modes here. Flagged rather than silently "fixed".
export const PITCH_MODES = [
  { id: 'record', label: 'Record' },
  { id: 'upload', label: 'Upload' },
  { id: 'written', label: 'Written Pitch' },
];

export const TAB_ACTIVE_STYLE = { bg: '#eff4f0', border: '#387440', text: '#387440' };
export const TAB_INACTIVE_STYLE = { bg: '#ffffff', border: '#e8e8e4', text: '#70706e' };

// ── Right-aside content, per mode/state ────────────────────────────────────
// The aside's THREE cards are identical in shape across every Pitch frame
// (a green "checklist" card, a white prose card, and the shared "👀 Recruiter
// views this week" card) but their copy changes per state. Sources:
//   empty / record-idle  — 5890:133 + 5890:148   (frame 5890:2, 6083:46594)
//   record-recorded      — 5890:1863 + 5890:1878 (frame 5890:1732)
//   upload-empty         — 5890:825 + 5890:840   (frame 5890:694)
//   upload-loaded        — 5890:1171 + 5890:1186 (frame 5890:1040)
//   written              — 5890:1517 + 5890:1532 (frame 5890:1386)
export const ASIDE_CONTENT = {
  default: {
    checklistTitle: 'What to say',
    checklist: [
      'Your name & role',
      'One project you built',
      'What you want next',
      'Keep it under 60s',
    ],
    proseTitle: 'Why this matters',
    prose:
      'Recruiters remember real faces. A pitch turns a data card into a person — that difference is real and measurable.',
  },
  recorded: {
    checklistTitle: 'Quick self-check',
    checklist: [
      'You said your name',
      'The audio is clear',
      'One specific project',
      'The role you want',
    ],
    proseTitle: 'Perfection is the enemy',
    prose:
      'A slightly imperfect pitch that exists is infinitely better than a perfect pitch that never gets recorded. You can replace it any time.',
  },
  uploadEmpty: {
    checklistTitle: 'File requirements',
    checklist: ['MP4, MOV or WebM', 'Up to 100MB', 'Maximum 60 seconds', 'Audio track present'],
    proseTitle: 'Quick trim on phone',
    prose:
      'iPhone: tap Edit in Photos, drag the yellow handles. Android: open in Gallery, tap Edit → Trim. Save as a new clip, then transfer here.',
  },
  uploadLoaded: {
    checklistTitle: 'File checks passed',
    checklist: [
      'MP4 format — supported',
      '18.4 MB — under 100MB',
      '0:54 — within 60s limit',
      'Audio track present',
    ],
    proseTitle: 'Replace it any time',
    prose:
      'Once live, come back to your dashboard and upload a new version. The old pitch is replaced immediately. No waiting, no re-applying.',
  },
  written: {
    checklistTitle: 'What recruiters read',
    checklist: [
      'Name & role — sentence 1',
      'One number or project',
      'Your ask — sentence 4',
      'Write for skimming',
    ],
    proseTitle: 'Length sweet spot',
    prose:
      '40–150 words. Under 40 feels rushed; over 150 recruiters stop reading. 80–100 words is ideal — thorough but not exhausting.',
  },
};

// ── "Three ways to pitch" cards — Figma 5895:19 / 5895:23 / 5895:27 ────────
export const THREE_WAYS = [
  {
    id: 'record',
    title: 'Record in-browser',
    body: 'Use your webcam. One click to start and stop.',
  },
  {
    id: 'upload',
    title: 'Upload a video',
    body: 'Recorded on your phone? Upload the file. MP4, MOV or WebM.',
  },
  {
    id: 'written',
    title: 'Write a pitch',
    body: 'Not camera-ready? Four sentences. Still far better than no pitch.',
  },
];

// ── The 4-sentence formula ────────────────────────────────────────────────
// Two presentations of the SAME four sentences exist in Figma:
//   • the compact bold-lead + grey-tail row list on the empty / record
//     frames (5895:34-44)
//   • the numbered-pill version inside the Written-Pitch tips card
//     (5905:12-35), which adds a short title per row and slightly longer
//     sentence text.
// Both are reproduced verbatim; `lead`/`tail` drive the compact list and
// `title`/`sentence` drive the numbered one.
export const FORMULA_ROWS = [
  {
    num: '1',
    lead: 'Hi, I’m [name],',
    tail: 'a [role / what you do] from [city].',
    title: 'Who you are',
    sentence: 'Hi, I’m [name], a [role / what you do] from [city].',
  },
  {
    num: '2',
    lead: 'My strongest skill is [skill]',
    tail: '— I’ve been doing it for [time].',
    title: 'Your top skill',
    sentence: 'My strongest skill is [skill] — I’ve been doing it for [time / context].',
  },
  {
    num: '3',
    lead: 'I built [project]',
    tail: '— [one sentence on the outcome].',
    title: 'One thing you built',
    sentence: 'I built [project] — [what it does + one measurable outcome].',
  },
  {
    num: '4',
    lead: 'I’m looking for [what you want]',
    tail: '— [timeline / location].',
    title: 'What you want',
    sentence: 'I’m looking for [what you want] — [timeline / location].',
  },
];

// Figma 5895:46 (compact card) and 5905:38 (Written-Pitch card). The two
// strings genuinely differ — the Written-Pitch one is longer — so both are
// kept rather than collapsing them into one.
export const FORMULA_EXAMPLE_COMPACT =
  '“Hi, I’m Kofi, a frontend developer from Accra. My strongest skill is React — I’ve been building with it for 2 years. I built Accra Bus Tracker, a real-time transport app used by 200+ daily commuters. I’m looking for a full-time software engineering role at a fintech company, ideally starting within 6 months.”';

export const FORMULA_EXAMPLE_LONG =
  '“Hi, I’m Kofi, a frontend developer from Accra. My strongest skill is React — I’ve been building production apps with it for 2 years. I built Accra Bus Tracker, a real-time transport app that’s used by over 200 commuters daily during the KNUST pilot. I’m looking for a full-time software engineering role at a fintech company in Accra or remote, ideally starting within 6 months.”';

// Figma 5905:39 — the DM-Mono meta line under the long example.
export const FORMULA_EXAMPLE_META = '4 sentences · 78 words · ~18 seconds to read';

// ── "How to get a video from your phone" — Figma 5900:19/22/26/29 ─────────
// The 4th card is tinted (bg rgba(235,241,236,0.5)) in Figma; the other
// three are plain white.
export const PHONE_TRANSFER_CARDS = [
  {
    id: 'iphone',
    title: 'IPHONE → MAC',
    body: 'AirDrop the video to your Mac, then drag it here. Or use a Lightning / USB-C cable and import via Finder.',
    highlighted: false,
  },
  {
    id: 'android',
    title: 'ANDROID → WINDOWS',
    body: 'Connect via USB and copy the video from DCIM to your desktop, or share to Gmail and download.',
    highlighted: false,
  },
  {
    id: 'whatsapp',
    title: 'ANY PHONE → WHATSAPP WEB',
    body: 'Send the video to yourself on WhatsApp, then download it from WhatsApp Web on your computer.',
    highlighted: false,
  },
  {
    id: 'email',
    title: 'EASIEST OPTION',
    body: 'Email the video to yourself. Download the attachment. Drop it here. Done in under 60 seconds.',
    highlighted: true,
  },
];

// ── Pre-publish checklists ────────────────────────────────────────────────
// The record-review checklist (Figma 5906:14/17/20/23) and the upload-review
// checklist (Figma 5903:53/57/61/64) are DIFFERENT lists with overlapping
// wording — both verbatim, including 5906:17's doubled space after "clear"
// and 5903:53's space before its comma.
export const RECORD_CHECKLIST = [
  'I said my name clearly at the start',
  'The audio is clear  I can hear myself without straining',
  'I mentioned at least one specific project or achievement',
  'I said what kind of role or opportunity I’m looking for',
];

export const UPLOAD_CHECKLIST = [
  'The audio is clear , I can hear myself without straining',
  'I say my name and what I do in the first 10 seconds',
  'I mention at least one specific project or achievement',
  'I say what kind of role or opportunity I’m looking for',
];

// Figma 5903:38/41/44/47 — the 2×2 "File passed all checks" grid inside the
// uploaded-file card. Note Figma writes these with a colon separator here
// while the aside (uploadLoaded above) uses an em dash for the same facts;
// both separators are Figma's own and are preserved per surface.
//
// Figma hard-codes its demo file's numbers. The browser DOES report a real
// name/format/size for a picked file, so those values are substituted into
// Figma's own sentence shapes — otherwise the file row above the grid would
// say "18.0 MB" while the grid right beneath it said "18.4 MB". Duration is
// the one fact that can't be known without decoding the media, so Figma's
// own "0:54" stands in there (see DEMO_PITCH_FILE).
export const buildUploadFileChecks = (file = DEMO_PITCH_FILE) => [
  `${file.format} format : supported`,
  `${file.durationLabel} : within 60s limit`,
  `${file.sizeLabel} : under 100MB`,
  'Audio track present',
];

// The same four facts as the aside renders them (Figma 5890:1171's list) —
// em dash instead of colon, and a different running order.
export const buildUploadAsideChecks = (file = DEMO_PITCH_FILE) => [
  `${file.format} format — supported`,
  `${file.sizeLabel} — under 100MB`,
  `${file.durationLabel} — within 60s limit`,
  'Audio track present',
];

// ── The seeded demo file ──────────────────────────────────────────────────
// Figma's populated upload/delete/success frames all describe the same file
// (5903:23/25/26, 6107:122590/122592, 6107:123219/123220). No real media
// backend exists in this app, so a picked file is normalised onto this shape
// (real name/size where the browser gives them, Figma's duration otherwise —
// duration can't be read without decoding the media).
export const DEMO_PITCH_FILE = {
  name: 'pitch_kofi_accra.mp4',
  sizeLabel: '18.4 MB',
  format: 'MP4',
  durationLabel: '0:54',
  uploadedLabel: 'Uploaded Aug 2026',
};

// Formats the mm:ss recorder timer. Figma's idle value is literally "00:00"
// (6093:21844), so the minutes segment is zero-padded to two digits INSIDE
// the viewfinder. Everywhere the duration appears as prose instead — the
// playback scrubber (5906:10, "0:58") and the success/delete summaries
// (6107:122592, "0:54") — Figma drops the leading zero, which is what
// `formatDurationLabel` below is for.
export const formatRecorderTime = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

// Figma's prose duration format — "0:54" / "0:58", i.e. no leading zero on
// the minutes segment. Used by the scrubber and both modal summaries.
export const formatDurationLabel = (totalSeconds) =>
  formatRecorderTime(totalSeconds).replace(/^0(?=\d:)/, '');

// Word count for the written pitch's "N words" readout (Figma 5905:43).
export const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

// Figma 5905:44 — "0 / 600". The 600 is the character budget shown next to
// the word count.
export const WRITTEN_PITCH_CHAR_LIMIT = 600;

// Figma 5905:39 reads "4 sentences · 78 words · ~18 seconds to read", i.e.
// roughly 4.3 words/second of reading. Used to compose the written pitch's
// own summary line in the success modal, the same "Figma's sentence shape
// with live values substituted" convention every sibling success modal uses.
const WORDS_PER_SECOND = 78 / 18;

/*
 * buildPitchSummary — the single row describing the published pitch inside
 * `PitchPublishedModal`. Figma hard-codes the demo VIDEO file
 * (6107:122590 "60-second video pitch" / 6107:122592
 * "MP4 · 0:54 · 18.4 MB · uploaded securely"), but this flow can publish a
 * recording, an uploaded file OR a written pitch, so the sentence shape is
 * preserved and the values come from live state.
 *
 * ⚠️ The recorded branch reports Figma's own container format ("WebM", the
 * browser-recording format named in the upload requirements) and the live
 * timer value. No byte is ever captured — see PitchRecorder.jsx.
 */
export const buildPitchSummary = (pitch) => {
  if (!pitch) return null;

  if (pitch.kind === 'written') {
    const words = countWords(pitch.text ?? '');
    const seconds = Math.max(1, Math.round(words / WORDS_PER_SECOND));
    return {
      kind: 'written',
      title: 'Written pitch',
      metaLine: `${words} word${words === 1 ? '' : 's'} · ~${seconds} seconds to read · saved securely`,
    };
  }

  if (pitch.kind === 'upload') {
    const file = pitch.file ?? DEMO_PITCH_FILE;
    return {
      kind: 'upload',
      title: '60-second video pitch',
      metaLine: `${file.format} · ${file.durationLabel} · ${file.sizeLabel} · uploaded securely`,
    };
  }

  // kind === 'recorded'
  return {
    kind: 'recorded',
    title: '60-second video pitch',
    metaLine: `WebM · ${formatDurationLabel(pitch.durationSeconds ?? 0)} · recorded in-browser · uploaded securely`,
  };
};

/*
 * buildDeletePreview — the pink preview card inside `DeletePitchModal`.
 * Figma's own chip row (6107:123231/123233/123235/123237) is
 * "Video pitch · 0:54 · MP4 · 18.4MB"; a written pitch has none of those
 * facts, so its chips describe what it actually is.
 */
export const buildDeletePreview = (pitch) => {
  if (!pitch) return null;

  if (pitch.kind === 'written') {
    const words = countWords(pitch.text ?? '');
    return {
      kind: 'written',
      title: 'Written pitch',
      fileLine: `Saved as text · ${DEMO_PITCH_FILE.uploadedLabel}`,
      detailLine: `Text · ${words} word${words === 1 ? '' : 's'} · saved securely`,
      chips: ['Written pitch', `${words} words`],
    };
  }

  if (pitch.kind === 'upload') {
    const file = pitch.file ?? DEMO_PITCH_FILE;
    return {
      kind: 'upload',
      title: '60-second video pitch',
      fileLine: `${file.name} · ${file.uploadedLabel}`,
      detailLine: `${file.format} · ${file.sizeLabel} · uploaded securely`,
      chips: ['Video pitch', file.durationLabel, file.format, file.sizeLabel.replace(' ', '')],
    };
  }

  // kind === 'recorded'
  const duration = formatDurationLabel(pitch.durationSeconds ?? 0);
  return {
    kind: 'recorded',
    title: '60-second video pitch',
    fileLine: `Recorded in-browser · ${DEMO_PITCH_FILE.uploadedLabel}`,
    detailLine: `WebM · ${duration} · uploaded securely`,
    chips: ['Video pitch', duration, 'WebM'],
  };
};
