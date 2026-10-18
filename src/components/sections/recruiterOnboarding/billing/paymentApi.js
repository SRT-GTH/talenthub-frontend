import { confirmPayment, recordPayment } from '../../../../services/recruiterOnboarding.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('paymentApi');

/*
 * paymentApi - the ONLY place the recruiter Payment step talks to payments.
 * 2026-10-18: calls the backend (POST /api/recruiter/payment), which records
 * a SIMULATED payment - no money moves until the Paystack (SUBSCRIPTION_V2)
 * path is wired. The amount is decided by the backend from the chosen plan.
 *
 * Simulation (backend):
 *   - a card number ending 0002 is declined ("Your bank declined this card.")
 *   - any other card is paid
 *   - Mobile Money: the prompt is "sent" (pending), and after the approval
 *     wait below the client confirms it (POST /api/recruiter/payment/confirm)
 *
 * SECURITY: only the LAST FOUR digits ever leave the browser - never the full
 * card number, expiry or CVC. With a real provider the card fields would be
 * provider-hosted and this module would receive a token instead.
 */

export const DECLINE_SUFFIX = '0002';
export const MOMO_APPROVAL_DELAY_MS = 5000;
export const MOMO_PROMPT_TTL_SECONDS = 120;

const abortError = () => Object.assign(new Error('aborted'), { name: 'AbortError' });

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(id);
      reject(abortError());
    };
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });

const lastFourOf = (value) =>
  String(value ?? '')
    .replace(/\D/g, '')
    .slice(-4);

/**
 * createPayment({ method, card?, momo? }, { signal })
 *   card: { number, ... }   momo: { network, number }
 * -> Promise<{ status: 'succeeded' | 'declined' | 'pending', reference, last4 }>
 */
export const createPayment = async ({ method, card, momo }, { signal } = {}) => {
  log('createPayment start', { method });
  const last4 = lastFourOf(method === 'card' ? card?.number : momo?.number);
  const res = await recordPayment({
    method,
    last4,
    network: method === 'momo' ? momo?.network : undefined,
  });
  if (signal?.aborted) throw abortError();
  const status = res?.status === 'paid' ? 'succeeded' : res?.status || 'declined';
  log('createPayment result', { status });
  return { status, reference: res?.reference, last4: res?.last4 || last4 };
};

/**
 * pollMomoApproval({ reference }, { signal }) -> Promise<{ status: 'approved' }>
 * Simulated approval: waits, then confirms. Rejects with an AbortError when
 * the user cancels the prompt.
 */
export const pollMomoApproval = async ({ reference }, { signal } = {}) => {
  log('pollMomoApproval start', { reference });
  await wait(MOMO_APPROVAL_DELAY_MS, signal);
  await confirmPayment(reference);
  log('pollMomoApproval approved', { reference });
  return { status: 'approved' };
};
