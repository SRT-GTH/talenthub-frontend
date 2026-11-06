/*
 * signUpValidation.js — client-side checks of the institution sign-up. Pure functions: (values) -> { field: message }.
 * The server repeats the checks that matter (duplicate GES number or email, the email code, the password rule).
 */

const FREE_MAIL = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
// GES numbers look like GES/NR/SHS/0412; universities and colleges use GTEC / NAB numbers, so only the shape is checked.
const ACCREDITATION_NUMBER = /^[A-Z0-9][A-Z0-9/.\- ]{3,39}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITAL_ADDRESS = /^[A-Z]{2}-?\d{3,4}-?\d{3,4}$/i;
const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const REGIONS = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
];

const emailError = (value) => {
  if (!value.trim()) return 'Enter your work email.';
  if (!EMAIL.test(value.trim())) return 'Enter a valid email address.';
  if (FREE_MAIL.includes(value.trim().split('@')[1].toLowerCase()))
    return 'Use your institution’s own email domain.';
  return undefined;
};

export const isInstitutionComplete = (v) =>
  Boolean(
    v.name.trim() &&
    v.gesNumber.trim() &&
    v.type &&
    v.digitalAddress.trim() &&
    v.region &&
    v.contactName.trim() &&
    v.email.trim() &&
    v.password &&
    v.confirm
  );

export const validateInstitution = (v) => {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter your institution’s name.';
  else if (v.name.trim().length < 3) e.name = 'Use the full name of your institution.';
  if (!v.gesNumber.trim()) e.gesNumber = 'Enter the GES / accreditation number.';
  else if (!ACCREDITATION_NUMBER.test(v.gesNumber.trim()))
    e.gesNumber = 'Use the number on your licence, e.g. GES/NR/SHS/0412.';
  if (!v.type) e.type = 'Choose an institution type.';
  if (!v.digitalAddress.trim()) e.digitalAddress = 'Enter your GhanaPost digital address.';
  else if (!DIGITAL_ADDRESS.test(v.digitalAddress.trim()))
    e.digitalAddress = 'Use the format NT-0123-4567.';
  if (!v.region) e.region = 'Choose your region.';
  if (!v.contactName.trim() || v.contactName.trim().split(/\s+/).length < 2)
    e.contactName = 'Enter your first and last name.';
  const mail = emailError(v.email);
  if (mail) e.email = mail;
  if (!PASSWORD.test(v.password))
    e.password = 'Use 8 or more characters with upper and lower case letters and a number.';
  if (v.confirm !== v.password) e.confirm = 'Passwords do not match.';
  return e;
};

export const validateContact = (v) => {
  const e = {};
  const digits = v.phone.replace(/\D/g, '');
  if (digits.length < 9) e.phone = 'Enter a valid phone number.';
  if (v.office && v.office.replace(/\D/g, '').length < 9) e.office = 'Enter a valid office line.';
  const mail = emailError(v.email);
  if (mail) e.email = mail;
  return e;
};
