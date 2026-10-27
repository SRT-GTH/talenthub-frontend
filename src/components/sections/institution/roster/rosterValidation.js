import { ageOn } from './csvImport.js';

/*
 * rosterValidation — validation of the "Add one student" form (the server repeats every rule: services/institutionRoster.service.js prepare()).
 * Rules: full name (first and last), programme and a real past date of birth are required; the Ghana Card (GHA-000000000-0) is optional and only
 * used to spot duplicates; year group is 1, 2 or 3 when given; emails must look like emails; under 18 needs a guardian phone or email.
 * validateStudent(form) → { errors: { field: message }, under18: boolean, dob: Date | null }
 */
const CARD = /^GHA-?\d{9}-?\d$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s-]{9,18}$/;

export const parseDob = (v) => {
  const m = /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/.exec(String(v || '').trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d)
    return null;
  return date;
};

export const validateStudent = (f) => {
  const errors = {};
  if (!f.name.trim() || f.name.trim().split(/\s+/).length < 2)
    errors.name = 'Enter the student’s first and last name.';
  if (f.card.trim() && !CARD.test(f.card.trim()))
    errors.card = 'Enter the Ghana Card number as GHA-000000000-0.';
  if (!f.programme) errors.programme = 'Choose a programme.';
  const dob = parseDob(f.dob);
  let under18 = false;
  if (!f.dob.trim()) errors.dob = 'Enter the date of birth as DD / MM / YYYY.';
  else if (!dob) errors.dob = 'That isn’t a real date. Use DD / MM / YYYY.';
  else if (dob > new Date()) errors.dob = 'The date of birth is in the future.';
  else under18 = ageOn(dob) < 18;
  if (f.year.trim() && !/^(form\s*)?[123]$/i.test(f.year.trim())) errors.year = 'Enter 1, 2 or 3.';
  if (f.email.trim() && !EMAIL.test(f.email.trim())) errors.email = 'Enter a valid email address.';
  if (f.invite && !f.email.trim()) errors.email = 'Add the student’s email to send an invite.';
  if (f.guardian.trim() && !PHONE.test(f.guardian.trim()))
    errors.guardian = 'Enter a valid phone number.';
  if ((f.guardianEmail || '').trim() && !EMAIL.test(f.guardianEmail.trim()))
    errors.guardianEmail = 'Enter a valid email address.';
  if (under18 && !f.guardian.trim() && !(f.guardianEmail || '').trim() && !errors.dob)
    errors.guardian = 'A guardian phone or email is needed for students under 18.';
  return { errors, under18, dob };
};
