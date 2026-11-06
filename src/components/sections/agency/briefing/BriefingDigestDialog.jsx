import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import ShareDialogShell from '../../publicData/share/ShareDialogShell.jsx';
import { useAgencySession } from '../useAgencySession.js';
import { subscribeToBriefingDigest } from './data/briefingData.js';

const log = debug('BriefingDigestDialog');

/*
 * BriefingDigestDialog — Figma 11.4.4e "Digest for your agency" (8605:406838). The digest goes to the signed-in user's account address (shown
 * read-only: the server never sends it anywhere else); "Subscribe" turns on the email digest of Settings › Notifications
 * (PATCH /agency/settings/notifications { weekly: true }), the same switch as on the settings page. Errors from the server are shown in the dialog.
 * Props: onClose(), onSubscribed().
 */

const FIELD =
  'w-full min-h-[44px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[14px] py-[12px] font-sans text-[15px] leading-[18px] text-[#1c2a21]';

const BriefingDigestDialog = ({ onClose, onSubscribed }) => {
  const session = useAgencySession();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const ids = useId();
  const email = session?.analyst?.email || '';
  const name = session?.analyst?.name || '';
  const agency = session?.agency?.short || session?.agency?.name || 'your agency';

  useEffect(() => {
    log('mount');
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await subscribeToBriefingDigest();
      log('subscribed');
      onSubscribed?.();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not subscribe.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ShareDialogShell
      title="Email digest for your agency"
      description={`A short email with your MoU view: national, regional and district movement. Sent only to your ${agency} account address.`}
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
            disabled={busy || !email}
          >
            {busy ? 'Subscribing…' : 'Subscribe'}
          </Button>
        </>
      }
    >
      <form id={`${ids}-form`} noValidate onSubmit={submit} className="contents">
        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor={`${ids}-email`}
            className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
          >
            Sent to
          </label>
          <input id={`${ids}-email`} type="email" readOnly value={email} className={FIELD} />
        </div>
        {name ? (
          <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
            {name} · change the address in your account settings.
          </p>
        ) : null}
        <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
          You can turn it off any time in Settings › Notifications.
        </p>
        {error ? (
          <p
            role="alert"
            className={classNames(
              'm-0 font-sans text-[13px] leading-[16px] font-medium text-[#902b20]'
            )}
          >
            {error}
          </p>
        ) : null}
      </form>
    </ShareDialogShell>
  );
};

export default BriefingDigestDialog;
