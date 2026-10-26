/*
 * signUpValidation.js — client-side checks of the agency sign-up (the server checks again: POST /government/register). Pure functions: (values) -> { field: message }.
 * ⚠️ ASSUMPTION: copy of the error messages is not drawn in Figma; these are the shortest neutral wordings.
 */

const FREE_MAIL = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
const MOU_REF = /^GTH-MOU-\d{4}-\d{3}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateAgency = (v) => {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter your agency name.';
  if (v.mouRef.trim() && !MOU_REF.test(v.mouRef.trim()))
    e.mouRef = 'Use the format GTH-MOU-2026-004.';
  if (!v.contact.trim()) e.contact = 'Enter your name.';
  if (!v.type) e.type = 'Choose an agency type.';
  if (!v.data) e.data = 'Choose what data you need.';
  if (!v.email.trim()) e.email = 'Enter your work email.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address.';
  else if (FREE_MAIL.includes(v.email.trim().split('@')[1].toLowerCase()))
    e.email = 'Use your agency’s own email domain.';
  if (v.phone && v.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number.';
  return e;
};

export const validateContact = (v) => {
  const e = {};
  const digits = v.phone.replace(/\D/g, '');
  if (digits.length < 7) e.phone = 'Enter a valid phone number.';
  if (v.office && v.office.replace(/\D/g, '').length < 7) e.office = 'Enter a valid office line.';
  if (!v.email.trim()) e.email = 'Enter your work email.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address.';
  else if (FREE_MAIL.includes(v.email.trim().split('@')[1].toLowerCase()))
    e.email = 'Use your agency’s own email domain.';
  return e;
};
