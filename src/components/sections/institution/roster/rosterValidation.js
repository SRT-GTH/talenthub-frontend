import { ageOn } from './csvImport.js';

/*
 * rosterValidation — validation of the "Add one student" form (Figma 11.2.2b draws no error state).
 * ⚠️ ASSUMPTION: the error copy below is mine. Rules: full name, Ghana Card (GHA-000000000-0), programme and a real past date of birth are required;
 * year group is 1, 2 or 3 when given; the student email must look like an email when given; a guardian phone is required under 18.
 * validateStudent(form) → { errors: { field: message }, under18: boolean }
 */
const CARD = /^GHA-\d{9}-\d$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s]{9,15}$/;

const parseDob = (v) => {
  const m = /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/.exec(v.trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
};

export const validateStudent = (f) => {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Enter the student’s full name.';
  if (!CARD.test(f.card.trim())) errors.card = 'Enter the Ghana Card number as GHA-000000000-0.';
  if (!f.programme) errors.programme = 'Choose a programme.';
  const dob = parseDob(f.dob);
  let under18 = false;
  if (!f.dob.trim()) errors.dob = 'Enter the date of birth as DD / MM / YYYY.';
  else if (!dob) errors.dob = 'That isn’t a real date. Use DD / MM / YYYY.';
  else if (dob > new Date()) errors.dob = 'The date of birth is in the future.';
  else under18 = ageOn(dob) < 18;
  if (f.year.trim() && !/^[123]$/.test(f.year.trim())) errors.year = 'Enter 1, 2 or 3.';
  if (f.email.trim() && !EMAIL.test(f.email.trim())) errors.email = 'Enter a valid email address.';
  if (f.guardian.trim() && !PHONE.test(f.guardian.trim()))
    errors.guardian = 'Enter a valid phone number.';
  if (under18 && !f.guardian.trim() && !errors.dob)
    errors.guardian = 'A guardian phone is needed for students under 18.';
  return { errors, under18 };
};
