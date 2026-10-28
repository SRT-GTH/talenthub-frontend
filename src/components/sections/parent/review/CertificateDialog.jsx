import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import spotCertificate from '../../../../assets/parent/spot-certificate.svg';
import { CERTIFICATE } from './data/reviewData.js';

const log = debug('CertificateDialog');

/*
 * CertificateDialog — PR-02 "Abena’s certificate" (Figma 10034:145407, modal 10034:146057): 640 wide, r24, p32, gap16. Head: 26/600 title (-0.13) over a 15 #575755 line + the grey 36px close;
 * the preview (#faf4e8, r18, p24, centred: Spot · Certificate 72, 20/600 "Certificate of Completion", 13 line, green 13/600 "Open full file (PDF, 420 KB)"); the white "Self-reported · not verified
 * by GTH" pill; a 14 #575755 note; "Decline with a note" (secondary) + "Approve" (primary), right aligned.
 * Props: onClose, onApprove, onDecline. ⚠️ ASSUMPTION: "Open full file" only logs (no file viewer is drawn; the mock has no PDF).
 */
const CertificateDialog = ({ onClose, onApprove, onDecline }) => (
  <DialogCard
    label={CERTIFICATE.title}
    onClose={onClose}
    width={640}
    padding={32}
    gap={16}
    className="items-stretch max-sm:!p-[20px]"
  >
    <div className="flex items-start gap-[12px]">
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <h2 className="m-0 text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
          {CERTIFICATE.title}
        </h2>
        <p className="m-0 text-[15px] leading-[18px] text-[#575755]">{CERTIFICATE.sub}</p>
      </div>
      <DialogCloseButton onClose={onClose} tone="grey" />
    </div>

    <div className="flex flex-col items-center gap-[8px] rounded-[18px] bg-accent-light p-[24px] text-center">
      <img src={spotCertificate} alt="" aria-hidden="true" className="size-[72px]" />
      <p className="m-0 text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#1c2a21]">
        {CERTIFICATE.previewTitle}
      </p>
      <p className="m-0 text-[13px] leading-[16px] text-[#575755]">{CERTIFICATE.previewLine}</p>
      <button
        type="button"
        onClick={() => log('open full file (no viewer drawn)')}
        className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        {CERTIFICATE.file}
      </button>
    </div>

    <span className="inline-flex h-[32px] items-center self-start rounded-full border border-solid border-brand-green-light-hover bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
      {CERTIFICATE.chip}
    </span>
    <p className="m-0 text-[14px] leading-[17px] text-[#575755]">{CERTIFICATE.body}</p>

    <div className="flex flex-wrap items-center justify-end gap-[12px]">
      <ParentButton variant="secondary" onClick={onDecline}>
        {CERTIFICATE.decline}
      </ParentButton>
      <ParentButton onClick={onApprove}>{CERTIFICATE.approve}</ParentButton>
    </div>
  </DialogCard>
);

export default CertificateDialog;
