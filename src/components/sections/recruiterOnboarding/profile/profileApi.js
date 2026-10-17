import { DEMO_TAKEN_EMAIL, DEMO_VALID_OTP } from './profileValidation.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('recruiterProfileApi');

/*
 * Mock "API" for the recruiter profile step. FRONTEND ONLY: every function
 * returns a Promise and resolves/rejects after a short timer, so wiring the
 * real backend = swap each body, nothing else changes. Never sends/stores the
 * password.
 *
 * Rejections are plain objects { code, message }:
 *   EMAIL_TAKEN   (checkEmailAvailable / submitProfile) - demo email taken@example.com
 *   OTP_INVALID   (verifyOtp) - anything but 123456
 */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkEmailAvailable = async (email) => {
  log('checkEmailAvailable', email);
  await wait(250);
  if (email.trim().toLowerCase() === DEMO_TAKEN_EMAIL) {
    throw { code: 'EMAIL_TAKEN', message: 'This email is already registered.' };
  }
  return true;
};

export const submitProfile = async ({ fullName, email, phone }) => {
  log('submitProfile', { fullName, email, phone });
  await wait(1200); // Figma 7374:2251 loader ("Sending verification code")
  if (email.trim().toLowerCase() === DEMO_TAKEN_EMAIL) {
    throw { code: 'EMAIL_TAKEN', message: 'This email is already registered.' };
  }
  return { ok: true };
};

export const verifyOtp = async (code) => {
  log('verifyOtp', code.length);
  await wait(600);
  if (code !== DEMO_VALID_OTP) throw { code: 'OTP_INVALID', message: 'Wrong code' };
  return { verified: true };
};

export const resendOtp = async () => {
  log('resendOtp');
  await wait(400);
  return { ok: true };
};
