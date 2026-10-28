import { debug } from '../../../../utils/debug.js';
import StatusToast from '../../../ui/StatusToast.jsx';
import { CredentialsIconCheckcircle18 } from './credentialsIcons.jsx';

const log = debug('CredentialToast');

/*
 * CredentialToast — "Toast · success" (Figma 11.2.4f 8744:436093, 465x42): #1c2a21 r12 p12/16 gap 10, a check-circle 18 (#ebf1ec), the 14/17 500 message and a 600 "View log" action,
 * centred 14px above the bottom edge; a variant of `ui/StatusToast`. ⚠️ ASSUMPTION: "View log" has no destination in the frames, so it only dismisses the toast; the toast hides itself after 8 seconds
 * unless `sticky` is set (the ?state=revoked frame draws it open).
 * Props: message, actionLabel, onAction (default: dismiss), onDismiss, sticky.
 */
const CredentialToast = ({ message, actionLabel = 'View log', onDismiss, sticky }) => {
  log('show', message);
  return (
    <StatusToast
      duration={sticky ? 0 : 8000}
      onClose={onDismiss}
      resetKey={message}
      wrapperClassName="pointer-events-none fixed inset-x-0 bottom-[16px] z-[70] flex justify-center px-[16px] font-sans"
      faceClassName="pointer-events-auto flex max-w-[560px] flex-wrap items-center sm:flex-nowrap gap-x-[10px] gap-y-[4px] rounded-[12px] bg-[#1c2a21] px-[16px] py-[12px] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <CredentialsIconCheckcircle18 className="size-[18px] shrink-0 text-[#ebf1ec]" />
      <span className="text-[14px] leading-[17px] font-medium">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[17px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {actionLabel}
      </button>
    </StatusToast>
  );
};

export default CredentialToast;
