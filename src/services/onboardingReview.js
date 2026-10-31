/*
 * Builds the review-screen profile from the backend's onboarding summary
 * (GET /v1/onboarding/status -> summary). The backend already masks the
 * Ghana Card and phone numbers and never returns the password.
 */

const EMPTY = '—';
const show = (value) => (value === null || value === undefined || value === '' ? EMPTY : value);

const EDUCATION_LEVEL_LABELS = {
  jhs: 'Junior High School (JHS)',
  shs: 'Senior High School (SHS)',
  tertiary: 'Tertiary / University',
  vocational: 'Vocational',
};
// The backend has no "not studying" level yet (it is saved as tertiary + the gap grade): show what was picked.
const levelLabel = (e) =>
  e.educationGrade === 'gap'
    ? 'Not currently studying'
    : EDUCATION_LEVEL_LABELS[e.educationLevel] || e.educationLevel;

// "year-3" -> "Year 3", "shs-2" -> "SHS 2", "jhs-1" -> "JHS 1"
const formatGrade = (grade) => {
  if (!grade) return null;
  const [prefix, num] = String(grade).split('-');
  if (!num) return grade;
  const label = prefix === 'year' ? 'Year' : prefix.toUpperCase();
  return `${label} ${num}`;
};

// "2004-05-10" -> "10 May 2004"
const formatDob = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

// The address step folds digital address, community and landmark into
// streetAddress ("GA-123-4567, Miotso, Near ..."). Split it back for display.
const DIGITAL_ADDRESS = /^[A-Z]{2}-\d{3}-\d{4}$/;
const splitStreetAddress = (street) => {
  const parts = String(street || '')
    .split(', ')
    .map((s) => s.trim())
    .filter(Boolean);
  const digital = parts.length && DIGITAL_ADDRESS.test(parts[0]) ? parts.shift() : null;
  const community = parts.shift() || null;
  const landmark = parts.length ? parts.join(', ') : null;
  return { digital, community, landmark };
};

// The Done page's summary of the account just activated (Review saves it; Done reads it). Kept for this tab only:
// activation returns no sign-in, so Done has nothing else to load from. No summary = the Figma demo values.
const DONE_KEY = 'th:onboarding-done';

export const saveDoneSummary = (summary) => {
  try {
    sessionStorage.setItem(DONE_KEY, JSON.stringify(summary));
  } catch {
    /* storage unavailable: Done shows the demo */
  }
};

export const readDoneSummary = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DONE_KEY) || 'null');
  } catch {
    return null;
  }
};

// "older_sibling" -> "Older sibling"
const formatRelationship = (value) => {
  if (!value) return null;
  const text = String(value).replace(/[_-]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const buildReviewProfile = (summary) => {
  const s = summary || {};
  const personal = s.personal || {};
  const identity = s.identity || {};
  const contact = s.contact || {};
  const address = s.address || {};
  const education = s.education || {};
  const street = splitStreetAddress(address.streetAddress);
  const name = [personal.firstName, personal.lastName].filter(Boolean).join(' ');

  return {
    name: name || 'Your profile',
    // "Not currently studying" is stored with the gap grade: not a student.
    role: education.educationLevel && education.educationGrade !== 'gap' ? 'Student' : 'Talent',
    avatarUrl: identity.profilePhoto || null,
    // No talent score exists until the profile is built after activation.
    score: null,
    tier: null,
    personal: {
      firstName: show(personal.firstName),
      middleName: show(personal.middleName),
      lastName: show(personal.lastName),
      dob: show(formatDob(s.dob)),
      gender: show(personal.gender),
      nationality: show(personal.nationality),
    },
    identity: {
      ghanaCardMasked: show(identity.ghanaCardMasked),
      // The card number is not checked against NIA yet, so no "Verified" badge.
      ghanaCardVerified: false,
      photoUploaded: Boolean(identity.profilePhoto),
    },
    contact: {
      phoneMasked: show(contact.phoneMasked),
      phoneVerified: Boolean(contact.contactVerified),
      whatsapp: contact.whatsappMasked || 'Same as phone',
      email: show(contact.email),
      preferred: 'Email',
    },
    address: {
      region: show(address.region),
      district: show(address.district),
      town: show(address.locality),
      digital: show(street.digital),
      community: show(street.community),
      landmark: show(street.landmark),
    },
    education: {
      level: show(levelLabel(education)),
      grade: show(formatGrade(education.educationGrade)),
      programme: show(education.educationFieldOfStudy || education.educationCurriculum),
      graduation: education.expectedGraduationYear
        ? `Class of ${education.expectedGraduationYear}`
        : EMPTY,
      institution: show(education.educationInstitution),
      confirmed: Boolean(education.educationInstitution),
    },
    // Under-18s only (the backend returns `parent: null` for adults): who gets the opt-out notice.
    parent: s.parent
      ? {
          name: show([s.parent.parentFirstName, s.parent.parentLastName].filter(Boolean).join(' ')),
          relationship: show(formatRelationship(s.parent.parentRelationship)),
          email: show(s.parent.parentEmail),
        }
      : null,
  };
};
