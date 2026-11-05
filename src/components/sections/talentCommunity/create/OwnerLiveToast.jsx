import { debug } from '../../../../utils/debug.js';
import StatusToast from '../../../ui/StatusToast.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { OWNER_COPY } from './createCommunityData.js';
import { CcLiveEyeIcon } from './CreateCommunityIcons.jsx';

const log = debug('OwnerLiveToast');
const TOAST_MS = 6000;

/*
 * OwnerLiveToast — Figma `toast · … is live` (CC-08): dark pill, gold disc with the eye, "{name} is live · +100 XP" (pts in Focused)
 * and a gold "Share"; a variant of `ui/StatusToast`. Props: name, xp ('XP' | 'pts'), onShare(), onDone() (after 6s).
 */
const OwnerLiveToast = ({ name, xp, onShare, onDone }) => {
  log('mount');
  return (
    <StatusToast
      portal
      duration={TOAST_MS}
      onClose={onDone}
      wrapperClassName="fixed left-1/2 top-[98px] z-[55] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-full bg-[#1c2a21] py-[12px] pl-[14px] pr-[18px] shadow-[0_8px_20px_rgba(28,42,33,0.25)] lg:ml-[63px]"
    >
      <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#c8951a]">
        <CcLiveEyeIcon className="size-[15px]" />
      </span>
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-white">
        {fillCopy(OWNER_COPY.toastLive, { name, xp })}
      </span>
      <button
        type="button"
        onClick={onShare}
        className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#ffd86b] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
      >
        {OWNER_COPY.toastShare}
      </button>
    </StatusToast>
  );
};

export default OwnerLiveToast;
