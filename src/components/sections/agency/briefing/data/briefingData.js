/*
 * briefingData.js — copy of the briefing-pack dialogs (Figma 11.4.4a–e, h) and their server calls: the pack is the live 8-page agency report
 * (GET /agency/report, logged), sharing copies the page link (agency staff only), the digest is the email digest of Settings › Notifications.
 */
import { agencyReport, agencyUpdateNotifications } from '../../../../../services/agency.api.js';

/* ---- BLOCK 1 · download options (11.4.4a) ---- */
export const BRIEFING_NOTE_MAX = 200;
export const BRIEFING_DEFAULT_NOTE = '';
export const BRIEFING_REGIONAL_MAX = 3;
export const BRIEFING_PAGES_PER_REGION = 4;

export const BRIEFING_OPTIONS = [
  { id: 'view', label: 'Agency report', detail: 'Live figures · 8 pages · A4 landscape', pages: 8 },
];

/* ---- BLOCK 2 · build (11.4.4b, 11.4.4h) ---- */
export const BRIEFING_STEPS = [
  'Collecting live figures',
  'Laying out pages',
  'Adding skills and programmes',
  'Adding methodology and data-protection note',
];
export const BRIEFING_STEP_TOTAL = 4;
export const BRIEFING_BUILD_MS = 4000;
export const BRIEFING_RESUME_PROGRESS = 0.55;
export const BRIEFING_ERROR_CODE = 'REPORT-FAILED';

/** Builds the live report once on the server (the same call the report page makes) so a failure shows here, not in the new tab. */
export const requestBriefingBuild = ({ option, regions, note }) =>
  agencyReport().then((report) => ({
    option,
    regions,
    note,
    title: report.title,
    status: 'ready',
  }));

/* ---- BLOCK 3 · share with a colleague (11.4.4c / d) ---- */
export const BRIEFING_SHARE = {
  message: '',
  messageMax: 280,
  channels: [
    { id: 'copy', label: 'Copy link' },
    { id: 'email', label: 'Email' },
    { id: 'teams', label: 'Teams' },
  ],
  footer: 'Agency staff only · access logged',
  toast: 'Link copied. Only people in your agency with GTH access can open it.',
};

/* ---- BLOCK 4 · monthly digest (11.4.4e) ---- */

/** Turns on the email digest of Settings › Notifications for the signed-in user. */
export const subscribeToBriefingDigest = () =>
  agencyUpdateNotifications({ weekly: true }).then(() => ({ ok: true }));
