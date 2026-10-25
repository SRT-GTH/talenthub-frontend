import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import CredentialModal from './CredentialModal.jsx';
import { CredentialsIconEdit, CredentialsIconFilecheck } from './credentialsIcons.jsx';

const log = debug('CredentialRevokeDialog');

/*
 * CredentialRevokeDialog — "Revoke Yaw’s sports prefect credential?" (Figma 11.2.4e 8593:389693, modal 8593:390243, 620 wide): dual approval. The first approver already asked (credential.askedBy);
 * this dialog is the second approver’s. Chip "Revoke credential" (white), the credential row, "WHAT HAPPENS" with three red-dot effects, the amber "Just a typo?" card, then
 * "Issue a corrected copy" and the red "Approve revocation". Props: credential (store row), onCorrected(), onApprove(), onClose().
 */
const CredentialRevokeDialog = ({ credential, onCorrected, onApprove, onClose }) => {
  const first = credential.student.split(' ')[0];
  const title = credential.title.toLowerCase();
  const words = `${title} credential?`.split(' ');
  const last = words.pop();

  useEffect(() => {
    log('open', credential.id);
  }, [credential.id]);

  const effects = [
    'The credential shows “Revoked” at gth.com/verify',
    `${first} is told, with your reason`,
    'It’s logged with both names and can’t be undone',
  ];

  return (
    <CredentialModal
      label="Revoke credential"
      chip="Revoke credential"
      chipTone="plain"
      width={620}
      gap={32}
      heading={
        <>
          Revoke {first}’s {words.join(' ')} <span className="text-[#387440]">{last}</span>
        </>
      }
      description={`Revoking needs two staff. ${credential.askedBy} asked first; your approval completes it.`}
      descriptionId="credential-revoke-desc"
      onClose={onClose}
    >
      <div className="flex flex-col gap-[28px]">
        <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <CredentialsIconFilecheck className="size-[20px] text-[#387440]" />
          </span>
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {credential.title} · {credential.number}
            </p>
            <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
              Issued {credential.issuedLong} · reason: {credential.reason}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[16px]">
          <p className="m-0 text-[11px] max-lg:text-[12px] leading-[13px] font-bold tracking-[1.2px] text-[#595959]">
            WHAT HAPPENS
          </p>
          <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
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
      </div>
      <div className="flex flex-wrap justify-end gap-[12px] pt-[8px]">
        <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onCorrected}>
          Issue a corrected copy
        </Button>
        <Button variant="danger" size="md" data-autofocus="" onClick={onApprove}>
          Approve revocation
        </Button>
      </div>
    </CredentialModal>
  );
};

export default CredentialRevokeDialog;
