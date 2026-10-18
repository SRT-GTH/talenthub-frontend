/*
 * organisationData - MOCK organisation directory + API-shaped calls for the
 * recruiter "Organisation" step (Figma R04 7374:4393..5519, R04b 7374:5818..6478).
 *
 * Only names/details that literally appear in Figma are used:
 *   MTN Ghana              R04 7374:4607 + 5070  (Scancom PLC, Telecommunications,
 *                          Accra / Greater Accra, Accra Metro, 500+ staff, admin
 *                          Ama Owusu, 18 recruiters, Enterprise plan)
 *   MTN Ghana Foundation   R04 7374:4607 (Non-profit, Accra, 11-50 staff)
 *   MTN Mobile Money Ltd   R04 7374:4607 (Financial services, Accra, 201-500 staff)
 *   Silver Rock Technologies R04 7374:4844 (Technology, Kumasi, 51-200 staff,
 *                          Primary Admin A. Mensah)
 * Fields Figma does not show for an organisation are left undefined (never invented).
 *
 * 2026-10-18: the three calls below now hit the backend
 * (services/recruiterOnboarding.api.js, /api/recruiter/organizations/*);
 * ORGANISATIONS is kept only as Figma reference data.
 *   searchOrganisations(query)  -> GET  /recruiter/organizations/search?q=
 *   requestAffiliation(orgId)   -> POST /recruiter/organizations/request-affiliation
 *   createOrganisation(payload) -> POST /recruiter/organizations/create
 */
export {
  createOrganisation,
  requestAffiliation,
  searchOrganisations,
} from '../../../../services/recruiterOnboarding.api.js';

export const ORGANISATIONS = [
  {
    id: 'mtn-ghana',
    name: 'MTN Ghana',
    legalName: 'Scancom PLC',
    industry: 'Telecommunications',
    city: 'Accra',
    location: 'Greater Accra, Accra Metro',
    size: '500+ staff',
    admin: 'Ama Owusu',
    recruiters: 18,
    plan: 'Enterprise',
  },
  {
    id: 'mtn-ghana-foundation',
    name: 'MTN Ghana Foundation',
    industry: 'Non-profit',
    city: 'Accra',
    size: '11–50 staff',
  },
  {
    id: 'mtn-mobile-money-ltd',
    name: 'MTN Mobile Money Ltd',
    industry: 'Financial services',
    city: 'Accra',
    size: '201–500 staff',
  },
  {
    id: 'silver-rock-technologies',
    name: 'Silver Rock Technologies',
    industry: 'Technology',
    city: 'Kumasi',
    size: '51–200 staff',
    admin: 'A. Mensah',
  },
];

// Sub-line shown under an organisation name in a result row (Figma: "Scancom PLC ·
// Telecommunications · Accra · 500+ staff"). `extended` swaps the city for the longer
// location + drops nothing else (selected card, 7374:5070).
export const describeOrganisation = (org, { extended = false, withAdmin = false } = {}) => {
  const parts = [
    org.legalName,
    org.industry,
    extended && org.location ? org.location : org.city,
    org.size,
    withAdmin && org.admin ? `Primary Admin: ${org.admin}` : null,
  ].filter(Boolean);
  return parts.join(' · ');
};

// Create-form option lists. Values come from Figma's filled/error frames
// (Technology, 11-50 employees, Ashanti, Kumasi Metropolitan) plus the
// industries / sizes / regions that appear on the R04 organisation cards.
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Telecommunications',
  'Financial services',
  'Non-profit',
];
export const SIZE_OPTIONS = [
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '500+ employees',
];
export const REGION_OPTIONS = ['Ashanti', 'Greater Accra'];
export const DISTRICTS_BY_REGION = {
  Ashanti: ['Kumasi Metropolitan'],
  'Greater Accra': ['Accra Metro'],
};

// "Kente Labs Ghana Limited" -> "Kente Labs Ghana": the Figma created modal (7374:6478)
// shows the legal name without its suffix, not the trading name ("Kente Labs").
export const shortOrganisationName = (legalName) =>
  legalName.replace(/\s+(limited|ltd\.?|plc|llc)$/i, '').trim();

// URL check for the optional Website field: Figma accepts "kentelabs.com.gh" (filled) and
// rejects "kentelabs" (error "Enter a valid URL, e.g. https://kentelabs.com.gh").
export const isValidWebsite = (value) => {
  const v = value.trim();
  if (!v) return true;
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v);
};
