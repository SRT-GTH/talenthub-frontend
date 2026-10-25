import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgencyDialog from './AgencyDialog.jsx';

const log = debug('AgencyDuplicateDialog');

/*
 * AgencyDuplicateDialog — "Your agency is already on GTH" (Figma 11.4.1a5 8607:2242 "div.vid-card": 528 x 320, white, r24, p 64/48, 4px + 40/100 shadow, #1c2a21 at 70 % scrim):
 * 32/40 600 title, 16/24 #575755 body, red "Ask for an invite" (#c0392b, 2px #73221a, r10, 4px shelf) and white "Contact support" (2px ink@.30, r14).
 * ⚠️ ASSUMPTION: "Ask for an invite" (no request flow drawn) logs the intent and returns to the sign-up form; "Contact support" opens the support mailbox.
 * Props: agencyName, registeredOn, onClose.
 */

const AgencyDuplicateDialog = ({ agencyName, registeredOn, onClose }) => {
  const navigate = useNavigate();
  return (
    <AgencyDialog
      label="Your agency is already on GTH"
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/70"
      panelClassName="w-[min(528px,calc(100vw-32px))]"
    >
      <div className="flex flex-col items-center gap-[24px] rounded-[24px] bg-white px-[clamp(20px,9vw,48px)] py-[clamp(32px,12vw,64px)] text-center shadow-[0_4px_0_rgba(0,0,0,0.1),0_40px_100px_rgba(0,0,0,0.25)]">
        <h2 className="m-0 font-sans text-[clamp(24px,6vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
          Your agency is already on GTH
        </h2>
        <p className="m-0 max-w-[432px] font-sans text-[16px] leading-[24px] text-[#575755]">
          Someone at the {agencyName} registered on {registeredOn}. Ask them to invite you as an
          analyst, or contact us if this looks wrong.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[8px]">
          <button
            type="button"
            data-autofocus
            onClick={() => {
              log('ask for an invite');
              onClose();
              navigate('/agency/sign-up');
            }}
            className="inline-flex min-h-[44px] items-center rounded-[10px] border-2 border-solid border-[#73221a] bg-[#c0392b] px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-white shadow-[0_4px_0_#73221a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0392b]"
          >
            Ask for an invite
          </button>
          <a
            href="mailto:agencies@ghanatalenthub.example"
            className="inline-flex min-h-[44px] items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Contact support
          </a>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default AgencyDuplicateDialog;
