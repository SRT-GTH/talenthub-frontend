/*
 * signUpValidation.js — client-side checks of the institution sign-up (no server). Pure functions: (values) -> { field: message }.
 * ⚠️ ASSUMPTION: the wording of the error messages is not drawn in Figma; these are the shortest neutral wordings.
 */

const FREE_MAIL = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
const GES_NUMBER = /^GES\/[A-Z]{2}\/[A-Z]{2,4}\/\d{4}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ⚠️ ASSUMPTION (demo): an accreditation number that is already registered. The sign-up shows the "already on GTH" dialog for it.
export const REGISTERED_GES_NUMBER = 'GES/NR/SHS/0001';

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
    v.address &&
    v.email.trim() &&
    v.password &&
    v.confirm
  );

export const validateInstitution = (v) => {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter your institution’s name.';
  if (!v.gesNumber.trim()) e.gesNumber = 'Enter the GES / accreditation number.';
  else if (!GES_NUMBER.test(v.gesNumber.trim())) e.gesNumber = 'Use the format GES/NR/SHS/0412.';
  if (!v.type) e.type = 'Choose an institution type.';
  if (!v.address) e.address = 'Choose your address.';
  const mail = emailError(v.email);
  if (mail) e.email = mail;
  if (v.password.length < 8) e.password = 'Use at least 8 characters.';
  if (v.confirm !== v.password) e.confirm = 'Passwords do not match.';
  return e;
};

export const validateContact = (v) => {
  const e = {};
  const digits = v.phone.replace(/\D/g, '');
  if (digits.length < 7) e.phone = 'Enter a valid phone number.';
  if (v.office && v.office.replace(/\D/g, '').length < 7) e.office = 'Enter a valid office line.';
  const mail = emailError(v.email);
  if (mail) e.email = mail;
  return e;
};
