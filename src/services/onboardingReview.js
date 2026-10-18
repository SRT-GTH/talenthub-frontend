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
    role: education.educationLevel ? 'Student' : 'Talent',
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
      level: show(EDUCATION_LEVEL_LABELS[education.educationLevel] || education.educationLevel),
      grade: show(formatGrade(education.educationGrade)),
      programme: show(education.educationFieldOfStudy || education.educationCurriculum),
      graduation: education.expectedGraduationYear
        ? `Class of ${education.expectedGraduationYear}`
        : EMPTY,
      institution: show(education.educationInstitution),
      confirmed: Boolean(education.educationInstitution),
    },
  };
};
