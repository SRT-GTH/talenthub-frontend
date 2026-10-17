import { debug } from '../../../../utils/debug.js';

const log = debug('paymentApi');

/*
 * paymentApi - the ONLY place the recruiter Payment step "talks" to a payment
 * provider. Everything here is a MOCK that returns Promises, so integrating a
 * hosted provider (Paystack inline / redirect, per the Figma note) = swap the
 * bodies; the page does not change.
 *
 * DEMO TRIGGERS (documented in RecruiterPaymentPage's header):
 *   - a card number ending 0002 is declined ("Your bank declined this card.")
 *   - any other card succeeds after ~1.2 s
 *   - Mobile Money: the prompt is "sent" after ~0.9 s, then approved ~5 s later
 *
 * SECURITY: this file never logs, stores or returns a full card number / CVC.
 * With a real provider the card fields would be provider-hosted and this
 * module would receive a token instead of raw digits.
 */

export const DECLINE_SUFFIX = '0002';
const CARD_DELAY_MS = 1200;
const MOMO_PROMPT_DELAY_MS = 900;
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

const makeReference = () => `GTH-PAY-${String(10000 + Math.floor(Math.random() * 90000))}`;

/**
 * createPayment({ method, tier, billing, amount, card?, momo? }, { signal })
 *   card: { number, ... } (demo only)   momo: { network, number }
 * -> Promise<{ status: 'succeeded' | 'declined' | 'pending', reference, last4 }>
 */
export const createPayment = async (
  { method, tier, billing, amount, card, momo },
  { signal } = {}
) => {
  log('createPayment start', { method, tier, billing, amount });
  if (method === 'card') {
    await wait(CARD_DELAY_MS, signal);
    const last4 = String(card?.number ?? '')
      .replace(/\D/g, '')
      .slice(-4);
    const result = {
      status: last4 === DECLINE_SUFFIX ? 'declined' : 'succeeded',
      reference: makeReference(),
      last4,
    };
    log('createPayment card result', { status: result.status });
    return result;
  }
  await wait(MOMO_PROMPT_DELAY_MS, signal);
  const result = {
    status: 'pending',
    reference: makeReference(),
    last4: String(momo?.number ?? '')
      .replace(/\D/g, '')
      .slice(-4),
  };
  log('createPayment momo result', { status: result.status });
  return result;
};

/**
 * pollMomoApproval({ reference }, { signal }) -> Promise<{ status: 'approved' }>
 * Rejects with an AbortError when the user cancels the prompt.
 */
export const pollMomoApproval = async ({ reference }, { signal } = {}) => {
  log('pollMomoApproval start', { reference });
  await wait(MOMO_APPROVAL_DELAY_MS, signal);
  log('pollMomoApproval approved', { reference });
  return { status: 'approved' };
};
