import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';

const log = debug('InstitutionDuplicateDialog');

/*
 * InstitutionDuplicateDialog — "Your institution is already on GTH" (Figma 11.1.1c 8589:1478 "div.vid-card": 557 x 296, white, r24, p 64/48, 4px + 40/100 shadow, #1c2a21 at 70 % scrim):
 * 32/40 600 title, 16/24 #575755 body, green "Ask for an invite" (#387440, 2px #2a5730, r14, 4px shelf) and white "Contact support" (2px ink@.30, r14).
 * ⚠️ ASSUMPTION: "Ask for an invite" (no request flow drawn) logs the intent and returns to the sign-up form; "Contact support" opens the support mailbox.
 * Props: institutionName, registeredOn, onClose.
 */

const InstitutionDuplicateDialog = ({ institutionName, registeredOn, onClose }) => {
  const navigate = useNavigate();
  return (
    <AgencyDialog
      label="Your institution is already on GTH"
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/70"
      panelClassName="w-[min(557px,calc(100vw-32px))]"
    >
      <div className="flex flex-col items-center gap-[24px] rounded-[24px] bg-white px-[clamp(20px,9vw,48px)] py-[clamp(32px,12vw,64px)] text-center shadow-[0_4px_0_rgba(0,0,0,0.1),0_40px_100px_rgba(0,0,0,0.25)]">
        <h2 className="m-0 font-sans text-[clamp(24px,6vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
          Your institution is already on GTH
        </h2>
        <p className="m-0 max-w-[432px] font-sans text-[16px] leading-[24px] text-[#575755]">
          Someone at {institutionName} registered on {registeredOn}. Ask them to invite you, or
          contact us if this looks wrong.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[8px]">
          <button
            type="button"
            data-autofocus
            onClick={() => {
              log('ask for an invite');
              onClose();
              navigate('/institution/sign-up');
            }}
            className="inline-flex min-h-[44px] items-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Ask for an invite
          </button>
          <a
            href="mailto:institutions@ghanatalenthub.example"
            className="inline-flex min-h-[44px] items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Contact support
          </a>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default InstitutionDuplicateDialog;
