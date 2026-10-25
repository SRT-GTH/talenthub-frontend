import { debug } from '../../../../utils/debug.js';
import AgencyDialog from './AgencyDialog.jsx';
import { VERIFY } from './data/agencyOnboardingData.js';
import { AgArrowRight, AgClose, AgMail, AgPhone, AgShield } from './agencyOnboardingIcons.jsx';

const log = debug('AgencyVerifiedDialog');

/*
 * AgencyVerifiedDialog — "Email verified" (Figma 11.4.1a2 8596:481 "div.succ-card": 440 x 553, white, r24, content 360, p 40; #1c2a21 at 70 % scrim):
 * close 28 round · green check tile 64 · "Email verified" caption pill · 28/35 600 headline (green "verified") · 12/18 #959592 text · summary card (#ebf1ec, 1px #e1eae2,
 * r16) with Agency / Email rows · progress rail · "Continue to MoU →" · domain note.
 * Props: agencyName, onContinue, onClose.
 */

const AgencyVerifiedDialog = ({ agencyName, onContinue, onClose }) => (
  <AgencyDialog
    label="Email verified"
    onClose={onClose}
    scrimClassName="bg-[#1c2a21]/70"
    panelClassName="w-[min(440px,calc(100vw-32px))]"
  >
    <div className="flex flex-col gap-[8px] rounded-[24px] bg-white p-[clamp(20px,9vw,40px)] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid size-[28px] self-end place-items-center rounded-[20px] bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AgClose className="size-[16px]" />
      </button>
      <div className="flex flex-col items-center gap-[16px]">
        <div className="flex flex-col items-center gap-[20px]">
          <span
            aria-hidden="true"
            className="grid size-[64px] place-items-center rounded-[10px] bg-[#e1eae2] text-[#387440] shadow-[0_1px_2px_rgba(15,15,10,0.1)]"
          >
            <svg viewBox="0 0 28 28" className="size-[28px]" fill="none" aria-hidden="true">
              <path
                d="M6 15l5.5 5.5L22 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="inline-flex items-center gap-[6px] rounded-[6px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] h-[24px] px-[16px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#999999]">
            <span
              aria-hidden="true"
              className="size-[8px] rounded-full border-[1.5px] border-solid border-[#1d7c4d] bg-[#c1d4c4]"
            />
            Email verified
          </span>
        </div>
        <div className="flex flex-col items-center gap-[4px] text-center">
          <h2 className="m-0 font-sans text-[28px] leading-[35px] font-semibold tracking-[-0.14px] text-[#1c2a21]">
            Email <span className="text-[#387440]">verified</span>
          </h2>
          <p className="m-0 max-w-[286px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#959592]">
            Next, upload your signed MoU so we can open your access.
          </p>
        </div>
        <dl className="m-0 flex w-full flex-col gap-[4px] rounded-[16px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[17px] py-[20px]">
          <div className="flex items-center justify-between gap-[12px]">
            <dt className="flex items-center gap-[12px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]">
              <AgPhone className="size-[12px] text-[#387440]" />
              Agency
            </dt>
            <dd className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#387440]">
              {agencyName}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-[12px]">
            <dt className="flex items-center gap-[12px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]">
              <AgMail className="size-[12px] text-[#387440]" />
              Email
            </dt>
            <dd className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#387440]">
              {VERIFY.masked}
            </dd>
          </div>
        </dl>
        <div className="flex w-full flex-col gap-[16px]">
          <div aria-hidden="true" className="h-[4px] rounded-[4px] bg-[#ebf1ec]" />
          <button
            type="button"
            data-autofocus
            onClick={() => {
              log('continue to MoU');
              onContinue();
            }}
            className="inline-flex min-h-[56px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Continue to MoU
            <AgArrowRight className="size-[20px]" />
          </button>
          <p className="m-0 flex items-center justify-center gap-[4px] font-sans text-[10px] max-lg:text-[12px] leading-[16px] tracking-[0.2px] text-[#959592]">
            <AgShield className="size-[12px] text-[#387440]" />
            {VERIFY.domainNote}
          </p>
        </div>
      </div>
    </div>
  </AgencyDialog>
);

export default AgencyVerifiedDialog;
