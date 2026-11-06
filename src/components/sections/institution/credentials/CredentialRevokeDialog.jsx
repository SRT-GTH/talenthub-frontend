import { useEffect, useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import CredentialModal from './CredentialModal.jsx';
import { CredentialsIconEdit, CredentialsIconFilecheck } from './credentialsIcons.jsx';

const log = debug('CredentialRevokeDialog');

/*
 * CredentialRevokeDialog — "Revoke <first name>’s <credential>?" (Figma 11.2.4e 8593:389693, modal 8593:390243, 620 wide). Two steps:
 *   a valid credential: the first staff member gives a reason ("Ask to revoke"); a school with one active staff member revokes at once.
 *   a credential being revoked: a second staff member sees who asked and why, and approves it ("Approve revocation").
 * The credential row, "WHAT HAPPENS" with three red-dot effects and the amber "Just a typo?" card (opens the corrected copy).
 * Props: credential (GET /credentials/:id), busy, onCorrected(), onConfirm(reason?), onClose().
 */
const CredentialRevokeDialog = ({ credential, busy, onCorrected, onConfirm, onClose }) => {
  const reasonId = useId();
  const [reason, setReason] = useState('');
  const first = credential.student.split(' ')[0];
  const approving = credential.status === 'revoking';
  // Titles are names ("QA Career Fair 2026"): keep the school's own capitalisation.
  const title = credential.title;
  const words = `${title} credential?`.split(' ');
  const last = words.pop();

  useEffect(() => {
    log('open', credential.id, credential.status);
  }, [credential.id, credential.status]);

  const effects = [
    'The credential shows “Revoked” at gth.com/verify',
    `${first} is told, with your reason`,
    'It’s logged with your name and can’t be undone',
  ];

  return (
    <CredentialModal
      label="Revoke credential"
      chip="Revoke credential"
      chipTone="plain"
      width={620}
      gap={28}
      heading={
        <>
          Revoke {first}’s {words.join(' ')} <span className="text-[#387440]">{last}</span>
        </>
      }
      description={
        approving
          ? `Revoking needs two staff. ${credential.askedBy} asked first; your approval completes it.`
          : 'Revoking needs two staff when your school has more than one. You ask now; a colleague approves it.'
      }
      descriptionId="credential-revoke-desc"
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-[24px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (busy) return;
          onConfirm(approving ? undefined : reason.trim());
        }}
      >
        <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <CredentialsIconFilecheck className="size-[20px] text-[#387440]" />
          </span>
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {credential.title} · {credential.number}
            </p>
            <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
              Issued {credential.issuedLong}
              {approving ? ` · reason: ${credential.reason}` : ''}
            </p>
          </div>
        </div>
        {approving ? null : (
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor={reasonId}
              className="text-[14px] leading-[24px] font-medium text-[#1c2a21]"
            >
              Reason<span className="text-[#2e8b57]"> *</span>
            </label>
            <input
              id={reasonId}
              type="text"
              required
              minLength={3}
              maxLength={200}
              data-autofocus=""
              value={reason}
              placeholder="e.g. Issued to the wrong student"
              onChange={(e) => setReason(e.target.value)}
              className="h-[51px] w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[20px] font-sans text-[14px] leading-[20px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-[#387440]"
            />
          </div>
        )}
        <div className="flex flex-col gap-[14px]">
          <p className="m-0 text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
            WHAT HAPPENS
          </p>
          <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
            {effects.map((text) => (
              <li
                key={text}
                className="flex items-start gap-[8px] text-[14px] leading-[17px] font-medium text-[#1c2a21]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[5px] size-[7px] shrink-0 rounded-full bg-[#c0392b]"
                />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[16px] pl-[14px]">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a]">
            <CredentialsIconEdit className="size-[17px] text-white" />
          </span>
          <div className="flex flex-col gap-[2px]">
            <p className="m-0 text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              Just a typo?
            </p>
            <p className="m-0 text-[13px] leading-[19px] text-[#595959]">
              Issue a corrected copy instead. The old one is replaced, not revoked.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-[12px]">
          {approving ? null : (
            <Button
              variant="tertiary-subtle"
              size="lg"
              className="!py-[14px]"
              onClick={onCorrected}
            >
              Issue a corrected copy
            </Button>
          )}
          <Button
            type="submit"
            variant="danger"
            size="md"
            disabled={busy}
            data-autofocus={approving ? '' : undefined}
          >
            {busy ? 'Working…' : approving ? 'Approve revocation' : 'Revoke credential'}
          </Button>
        </div>
      </form>
    </CredentialModal>
  );
};

export default CredentialRevokeDialog;
