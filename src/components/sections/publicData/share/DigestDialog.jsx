import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from './shareButtonClasses.js';
import DigestRegionsField from './DigestRegionsField.jsx';
import ShareDialogShell from './ShareDialogShell.jsx';
import { ShareIconMail } from './shareIcons.jsx';
import {
  DIGEST_FIRST_ISSUE,
  DIGEST_PREFILL_SAMPLE,
  DIGEST_RESEND_SECONDS,
  DIGEST_ROLES,
  DIGEST_SAMPLE,
  digestRegionsLabel,
  subscribeToDigest,
} from './data/shareData.js';

const log = debug('DigestDialog');

/*
 * DigestDialog — Figma 8.8.3a "Get the monthly digest" (8504:2595) and 8.8.3b "Check your inbox" (8504:2853), mounted for ?modal=digest
 * (?state=success draws the confirmation directly, with the sample address as in Figma).
 * Fields: email (required, validated) · name (optional) · role · regions of interest · consent (required). Submit → MOCK request
 * (POST /api/public/digest-subscriptions) → the success state with a 60 s resend countdown.
 * ⚠️ ASSUMPTIONS: Figma draws no error state — an invalid / empty email or an unticked consent shows a red (#902b20) border and a short line
 *   under the field (copy below is not from Figma); the form is pre-filled with the sample values Figma draws (DIGEST_PREFILL_SAMPLE in
 *   shareData.js — set it to false to start empty); roles = the three audiences (Public, Investor, Government); the drawn consent box has no
 *   tick, a tick is added for the checked state.
 * Props: data (usePublicDataState()), onClose().
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELD =
  'w-full min-h-[44px] rounded-[12px] border border-solid bg-white px-[14px] py-[12px] font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none focus-visible:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]';

const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
  >
    {children}
  </label>
);

const ErrorLine = ({ id, children }) => (
  <p
    id={id}
    role="alert"
    className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#902b20]"
  >
    {children}
  </p>
);

const DigestSuccess = ({ email, regions, onClose }) => {
  const [seconds, setSeconds] = useState(DIGEST_RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  return (
    <ShareDialogShell
      title="Check your inbox"
      description={`We sent a confirmation link to ${email}. Click it to start receiving the digest.`}
      onClose={onClose}
      width={560}
      bodyClassName="items-center text-center"
      footer={
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          onClick={onClose}
        >
          Done
        </Button>
      }
    >
      <span className="flex size-[64px] items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440]">
        <ShareIconMail className="size-[32px]" />
      </span>
      <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        First digest: {DIGEST_FIRST_ISSUE} · {digestRegionsLabel(regions)}
      </p>
      <p aria-live="polite" className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
        {seconds > 0
          ? `Didn’t get it? Check spam, or resend in ${seconds} s.`
          : 'Didn’t get it? Check spam, or resend now.'}
      </p>
    </ShareDialogShell>
  );
};

const DigestDialog = ({ data, onClose }) => {
  const prefill = DIGEST_PREFILL_SAMPLE ? DIGEST_SAMPLE : null;
  const [email, setEmail] = useState(prefill?.email ?? '');
  const [name, setName] = useState(prefill?.name ?? '');
  const [role, setRole] = useState(prefill?.role ?? DIGEST_ROLES[0]);
  const [regions, setRegions] = useState(
    prefill?.regions ?? (data.state === 'success' ? DIGEST_SAMPLE.regions : [])
  );
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState(data.state === 'success' ? DIGEST_SAMPLE.email : null);
  const ids = useId();
  const emailId = `${ids}-email`;
  const nameId = `${ids}-name`;
  const roleId = `${ids}-role`;

  useEffect(() => {
    log('mount', { success: Boolean(sentTo) });
  }, [sentTo]);

  const submit = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    const next = {};
    if (!trimmed) next.email = 'Enter your email address.';
    else if (!EMAIL_PATTERN.test(trimmed)) next.email = 'Enter a valid email address.';
    if (!consent) next.consent = 'Tick the box to subscribe.';
    setErrors(next);
    if (Object.keys(next).length) {
      log('invalid', Object.keys(next));
      return;
    }
    setSubmitting(true);
    const result = await subscribeToDigest({ email: trimmed, name: name.trim(), role, regions });
    log('subscribed (mock)', result.ok);
    setSubmitting(false);
    setSentTo(trimmed);
  };

  if (sentTo) {
    return <DigestSuccess email={sentTo} regions={regions} onClose={onClose} />;
  }

  return (
    <ShareDialogShell
      title="Get the monthly digest"
      description="A one-page email with the latest national (or regional) numbers on the 1st of each month. Unsubscribe in one click."
      onClose={onClose}
      width={600}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={onClose}
            className={TERTIARY_BUTTON}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={`${ids}-form`}
            variant="primary"
            size="sm"
            className={PRIMARY_BUTTON}
            disabled={submitting}
          >
            Subscribe
          </Button>
        </>
      }
    >
      <form id={`${ids}-form`} noValidate onSubmit={submit} className="contents">
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor={emailId}>Email address</Label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            onChange={(event) => setEmail(event.target.value)}
            className={classNames(FIELD, errors.email ? 'border-[#902b20]' : 'border-[#e7e7e7]')}
          />
          {errors.email ? <ErrorLine id={`${emailId}-error`}>{errors.email}</ErrorLine> : null}
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor={nameId}>Name (optional)</Label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={classNames(FIELD, 'border-[#e7e7e7]')}
          />
        </div>
        <div className="flex flex-col gap-[16px] sm:flex-row sm:gap-[12px]">
          <div className="relative flex min-w-0 flex-1 flex-col gap-[6px]">
            <Label htmlFor={roleId}>Your role</Label>
            <select
              id={roleId}
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className={classNames(
                FIELD,
                'cursor-pointer appearance-none border-[#e7e7e7] pr-[34px]'
              )}
            >
              {DIGEST_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[14px] bottom-[14px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
            >
              ▾
            </span>
          </div>
          <DigestRegionsField value={regions} onChange={setRegions} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="flex cursor-pointer items-start gap-[10px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#387440]">
            <input
              type="checkbox"
              checked={consent}
              aria-describedby={errors.consent ? `${ids}-consent-error` : undefined}
              onChange={(event) => setConsent(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={classNames(
                'relative mt-[1px] size-[20px] shrink-0 rounded-[5px] border border-solid',
                consent ? 'border-[#387440] bg-[#387440]' : 'border-[#b5b5b1] bg-white',
                errors.consent && 'border-[#902b20]'
              )}
            >
              {consent ? (
                <span className="absolute top-[3px] left-[7px] h-[10px] w-[5px] rotate-45 border-r-2 border-b-2 border-solid border-white" />
              ) : null}
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#1c2a21]">
              I agree to receive the GTH monthly digest. GTH will only use my email for this and
              never share it.
            </span>
          </label>
          {errors.consent ? (
            <ErrorLine id={`${ids}-consent-error`}>{errors.consent}</ErrorLine>
          ) : null}
        </div>
      </form>
    </ShareDialogShell>
  );
};

export default DigestDialog;
