import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import ShareDialogShell from '../../publicData/share/ShareDialogShell.jsx';
import { BRIEFING_DIGEST as D, subscribeToBriefingDigest } from './data/briefingData.js';

const log = debug('BriefingDigestDialog');

/*
 * BriefingDigestDialog — Figma 11.4.4e "Monthly digest for your agency" (8605:406838): email (required) · name (optional) · role · regions of
 * interest · "Send the digest to my analysts too (3 people)…" checkbox (checked as drawn) · Cancel + Subscribe.
 * ⚠️ ASSUMPTIONS: Figma draws no error or success state. An empty / invalid email shows a red line (copy "Enter a valid email address." borrowed from
 * Theme 8); on success (MOCK request) the dialog closes and the result is announced to screen readers only (sr-only live region on the page).
 * Props: onClose(), onSubscribed(payload).
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

const BriefingDigestDialog = ({ onClose, onSubscribed }) => {
  const [email, setEmail] = useState(D.email);
  const [name, setName] = useState(D.name);
  const [role, setRole] = useState(D.roles[0]);
  const [regions, setRegions] = useState(D.regions[0]);
  const [analysts, setAnalysts] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const ids = useId();

  useEffect(() => {
    log('mount');
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      log('invalid email');
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setBusy(true);
    const result = await subscribeToBriefingDigest({
      email: trimmed,
      name: name.trim(),
      role,
      regions,
      analysts,
    });
    log('subscribed (mock)', result.ok);
    setBusy(false);
    onSubscribed?.(result.payload);
  };

  return (
    <ShareDialogShell
      title="Monthly digest for your agency"
      description="A one-page email on the 1st of each month with your MoU view: national, regional and district movement. Sent only to verified NYA addresses."
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
            disabled={busy}
          >
            Subscribe
          </Button>
        </>
      }
    >
      <form id={`${ids}-form`} noValidate onSubmit={submit} className="contents">
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor={`${ids}-email`}>Email address</Label>
          <input
            id={`${ids}-email`}
            type="email"
            autoComplete="email"
            data-autofocus=""
            value={email}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${ids}-error` : undefined}
            onChange={(event) => setEmail(event.target.value)}
            className={classNames(FIELD, error ? 'border-[#902b20]' : 'border-[#e7e7e7]')}
          />
          {error ? (
            <p
              id={`${ids}-error`}
              role="alert"
              className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#902b20]"
            >
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor={`${ids}-name`}>Name (optional)</Label>
          <input
            id={`${ids}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={classNames(FIELD, 'border-[#e7e7e7]')}
          />
        </div>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div className="flex flex-col gap-[6px]">
            <Label htmlFor={`${ids}-role`}>Your role</Label>
            <select
              id={`${ids}-role`}
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className={classNames(FIELD, 'border-[#e7e7e7]')}
            >
              {D.roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-[6px]">
            <Label htmlFor={`${ids}-regions`}>Regions of interest</Label>
            <select
              id={`${ids}-regions`}
              value={regions}
              onChange={(event) => setRegions(event.target.value)}
              className={classNames(FIELD, 'border-[#e7e7e7]')}
            >
              {D.regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-[10px] font-sans text-[13px] leading-[18px] text-[#1c2a21]">
          <input
            type="checkbox"
            checked={analysts}
            onChange={(event) => setAnalysts(event.target.checked)}
            className="mt-[1px] size-[18px] shrink-0 accent-[#387440]"
          />
          {D.analystsLabel}
        </label>
      </form>
    </ShareDialogShell>
  );
};

export default BriefingDigestDialog;
