import {
  resendSignupCode,
  startSignup,
  verifySignupCode,
} from '../../../../services/recruiterOnboarding.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('recruiterProfileApi');

/*
 * Recruiter profile step -> backend (2026-10-18, services/recruiterOnboarding.api.js).
 * Same signatures as the old mock, so the page and the OTP modal are unchanged:
 *
 *   submitProfile({ fullName, email, phone, password })  sends the 6-digit email code
 *   verifyOtp(code)  verifies it, then creates the account and logs in
 *   resendOtp()      sends a new code (60 s cooldown on the backend)
 *
 * Rejections carry { code, message }: EMAIL_TAKEN (email already registered),
 * OTP_INVALID (wrong code) - other failures are also shown as a banner.
 * The password stays in memory only until the account is created.
 * Staging: the code 123456 works while ENABLE_TEST_OTP_BYPASS=1.
 */

// No separate "is this email free?" endpoint (it would let anyone list
// accounts) - a taken email is reported when the code is requested.
export const checkEmailAvailable = async () => true;

export const submitProfile = async ({ fullName, email, phone, password }) => {
  log('submitProfile -> send code');
  return startSignup({ fullName, email, phone, password });
};

export const verifyOtp = async (code) => {
  log('verifyOtp', String(code).length);
  await verifySignupCode(code);
  return { verified: true };
};

export const resendOtp = async () => {
  log('resendOtp');
  await resendSignupCode();
  return { ok: true };
};
