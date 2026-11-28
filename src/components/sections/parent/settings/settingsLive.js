/*
 * settingsLive — helpers for the live parent Settings (signed-in parent). The parent Settings read and save through the
 * same account endpoints as the talent Settings (services/settings.api.js, backend talentSettings.service, which acts
 * on whoever is signed in):
 *   GET /settings/overview        account, preferences, passwordChangedAt, sessions
 *   PUT /settings/account         { firstName, lastName, phoneNumber, region, city }
 *   GET|PUT /settings/notifications  { rows, quiet, weekly, pause? }
 *   POST /settings/password · DELETE /settings/sessions/:id · POST /settings/sessions/revoke-others
 *   GET /settings/export · POST /users/logout
 * Nothing parent-only exists yet for roles, the weekly ward summary, the ward progress PDF, "take a break" or closing
 * the parent role (see wiki/parent-settings.md › Backend).
 */

const pad = (n) => String(n).padStart(2, '0');

/** "08 / 02 / 1984" from an ISO date (UTC, as the talent Settings do). */
export const fmtDob = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return `${pad(d.getUTCDate())} / ${pad(d.getUTCMonth() + 1)} / ${d.getUTCFullYear()}`;
};

/** The six Account fields from overview.account. */
export const liveAccountValues = (a = {}) => ({
  fullName: [a.firstName, a.lastName].filter(Boolean).join(' '),
  email: a.email || '',
  phone: a.phoneNumber || '',
  dob: fmtDob(a.dateOfBirth),
  region: a.region || '',
  city: a.city || '',
});

// Read-only when live: an email change needs re-verification (not built) and the date of birth is not editable here.
export const LOCKED_HINT = {
  email: 'To change your email, contact support from Help.',
  dob: 'Contact support from Help to correct your date of birth.',
};

const PHONE_OK = /^\+?[0-9 ]{9,16}$/;

/** Field errors for the live form (the talent Settings rules). */
export const accountErrors = (v) => ({
  fullName: !v.fullName.trim() ? 'Add your full name' : null,
  phone:
    v.phone && !PHONE_OK.test(v.phone.trim()) ? 'Use a phone number like +233 24 412 3456' : null,
});

/** Only the changed fields, in the PUT /settings/account shape. */
export const accountBody = (values, saved) => {
  const body = {};
  if (values.fullName !== saved.fullName) {
    const [firstName, ...rest] = values.fullName.trim().split(/\s+/);
    body.firstName = firstName;
    body.lastName = rest.join(' ') || saved.fullName.split(/\s+/).slice(1).join(' ') || firstName;
  }
  if (values.phone !== saved.phone) body.phoneNumber = values.phone.trim();
  if (values.region !== saved.region) body.region = values.region.trim();
  if (values.city !== saved.city) body.city = values.city.trim();
  return body;
};

/** A device row from an overview session (same mapping as the talent Security section). */
export const seenLabel = (iso) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 10) return 'active now';
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d} ${d === 1 ? 'day' : 'days'} ago`;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const liveDevices = (sessions = []) =>
  sessions.map((s) => ({
    id: s.id,
    kind: ['laptop', 'mobile', 'tablet'].includes(s.kind) ? s.kind : 'laptop',
    name: s.device || 'Unknown device',
    meta: s.thisDevice ? 'active now' : seenLabel(s.lastSeenAt),
    current: Boolean(s.thisDevice),
  }));

export const passwordChangedLabel = (iso) => {
  if (!iso) return 'Not changed on GTH yet.';
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 864e5);
  if (days < 1) return 'Last changed today.';
  if (days < 30) return `Last changed ${days} ${days === 1 ? 'day' : 'days'} ago.`;
  const months = Math.round(days / 30);
  return `Last changed ${months} ${months === 1 ? 'month' : 'months'} ago.`;
};
