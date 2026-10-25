/*
 * institutionCoreData.js — MOCK core data of the Theme 11 institution portal (Figma 11.2.1a "Institution home", 11.1.2b-e "Verification
 * status"; shaped like the future /institution/me + /institution/verification + /institution/counts API responses).
 * ⚠️ ASSUMPTION: no real auth, this "signed-in" session is a mock. Packages read it through useInstitutionSession()
 * (../useInstitutionSession.js), so the accreditation gate stays overridable with ?verify=.
 */

/* ---- institution + admin (Figma persona card "Iddrisu Abdul-Rahman · Admin · Registrar · Savannah Hills SHS") ---- */
export const INSTITUTION = {
  id: 'savannah-hills-shs',
  name: 'Savannah Hills Senior High School',
  short: 'Savannah Hills SHS',
  type: 'Senior high school',
  region: 'Northern Region',
  accreditationNumber: 'GES/NR/SHS/0412',
  publicUrl: 'gth.com/institutions/savannah-hills-shs',
  publicPath: '/institutions/savannah-hills-shs',
};

export const ADMIN = {
  id: 'iddrisu-abdul-rahman',
  name: 'Iddrisu Abdul-Rahman',
  firstName: 'Iddrisu',
  shortName: 'Iddrisu A.',
  monogram: 'IA',
  role: 'Admin',
  title: 'Registrar',
};

/* The head who confirms the account (Figma 11.1.2 / 11.2.1c "Head · Mrs Salamatu Yakubu"). */
export const HEAD = { name: 'Mrs Salamatu Yakubu', title: 'Head' };

/* ---- accreditation / verification (status is overridable with ?verify=) ---- */
export const VERIFICATION = {
  reference: 'GTH-VER-2026-0412',
  // Persona-card status line per gate, verbatim from frames 11.2.1a / 11.1.2b / c / d / e.
  statusLabel: {
    approved: 'Verified institution · GES accredited',
    'under-review': 'Verification in review',
    'needs-info': 'Verification · action needed',
    'not-approved': 'Verification not approved',
    // ⚠️ ASSUMPTION: Figma draws no persona card before the accreditation documents are uploaded.
    none: 'Not yet verified',
  },
  submitted: '2026-10-17',
  reviewStarted: '2026-10-18',
  decided: '2026-10-19',
  renewalDue: '2027-10-31',
};

/* ---- persona-card "Students on GTH" readiness bar (Figma 64 % on every screen, 61 % on the home 11.2.1a, 0 % while locked / new) ---- */
export const READINESS = { pct: 64, homePct: 61 };

/* ---- persona-card stats (Figma 847 Students · 23 Pending · 312 Credentials; 0 · 0 · 0 on the new / locked institution) ---- */
export const STATS = { students: 847, pending: 23, credentials: 312 };
export const STATS_EMPTY = { students: 0, pending: 0, credentials: 0 };

/* ---- other counts the home and the hero sentence use (Figma 11.2.1a: "2 scholarships live") ---- */
export const COUNTS = { scholarshipsLive: 2 };

/* ---- top-bar badges (Figma: bell 5, messages 5) ---- */
export const BADGES = { notifications: 5, messages: 5 };
