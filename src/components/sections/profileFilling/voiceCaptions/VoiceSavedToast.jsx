import StatusToast from '../../../ui/StatusToast.jsx';
import { CaptionCheckIcon } from './VoiceCaptionIcons.jsx';
import { VOICE_COPY } from './voiceCaptionData.js';

/*
 * "Your voice chat is saved as text" - Figma 9149:84388 (221x32, #1c2a21, radius 99, padding 8/14/8/12, 8px gap,
 * check 14 + 13/500 white). Sits in the chat flow under the saved turns, centred (an inline variant of `ui/StatusToast`). Dismisses itself after 6 s
 * (never faster) unless `persist` (the demo frame keeps it).
 */
const SAVED_TOAST_MS = 6000;

const VoiceSavedToast = ({ persist = false, onDismiss }) => (
  <StatusToast
    duration={persist ? 0 : SAVED_TOAST_MS}
    onClose={onDismiss}
    wrapperClassName="mx-auto mt-[8px] flex w-fit max-w-full items-center gap-[8px] rounded-full bg-[#1c2a21] py-[8px] pl-[12px] pr-[14px]"
  >
    <CaptionCheckIcon className="size-[14px] shrink-0 text-white" />
    <span className="font-sans text-[13px] font-medium leading-[16px] text-white">
      {VOICE_COPY.saved}
    </span>
  </StatusToast>
);

export default VoiceSavedToast;
