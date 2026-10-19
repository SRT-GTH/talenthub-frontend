import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import CommunityPostCard from './CommunityPostCard.jsx';
import { CommunityCheckCircleFillGlyph } from './CommunityDialogIcons.jsx';
import { CommunityPostClockGlyph } from './CommunityPostIcons.jsx';
import { FOCUS_RING } from './communityDialogUtils.js';
import { PENDING_POST, TOAST_POSTED } from './communityData.js';

const log = debug('CommunityPendingParts');

// How long the "Posted!" toast stays. Not drawn in Figma → ASSUMPTION.
const TOAST_MS = 6000;

/*
 * PostedToast — C-13 `toast · posted` (Playful 7629:8663 / Focused 8110:464650): dark pill, green check, 14/17 white label,
 * centred over the page content ~98px below the top of the viewport. Props: onDone (called after 6s), text.
 */
export const PostedToast = ({ onDone, text = TOAST_POSTED }) => {
  useEffect(() => {
    log('toast mount');
    const timer = window.setTimeout(() => onDone?.(), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-[98px] z-[55] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-[16px] bg-[#1c2a21] py-[12px] pl-[12px] pr-[16px] shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] lg:ml-[63px]"
    >
      <CommunityCheckCircleFillGlyph className="size-[20px] shrink-0 text-[#387440]" />
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-white">{text}</span>
    </div>,
    document.body
  );
};

/* `pending banner` (Figma 7629:8656): #faf4e8, r12, clock + copy + "Edit". */
const PendingBanner = ({ onEdit }) => (
  <div className="flex items-center gap-[10px] rounded-[12px] bg-[#faf4e8] px-[14px] py-[10px]">
    <CommunityPostClockGlyph className="size-[16px] shrink-0 text-[#463409]" />
    <span className="min-w-0 flex-1 font-sans text-[13px] font-medium leading-[16px] text-[#463409] max-lg:text-[14px] max-lg:leading-[18px]">
      {PENDING_POST.banner}
    </span>
    <button
      type="button"
      onClick={onEdit}
      className={`shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[14px] ${FOCUS_RING}`}
    >
      {PENDING_POST.edit}
    </button>
  </div>
);

/*
 * PendingPostCard — C-13 `post · Kofi (pending)` (Playful 7629:8571 / Focused 8110:464371): the talent's own post right
 * after publishing — 1.5px #c8951a border, "Only you can see this for now…" banner, action row at 40%.
 * Props: community (useCommunityState(), "Edit" reopens the create dialog), body (text, default = the frame's post),
 * onMore (opens the report flow, like the other cards).
 */
const PendingPostCard = ({ community, body, onMore }) => (
  <CommunityPostCard
    tone="pending"
    className="!border-dashed"
    actionsOpacity={0.4}
    post={{
      id: PENDING_POST.id,
      author: { name: PENDING_POST.author, me: true },
      kind: PENDING_POST.tag,
      time: PENDING_POST.time,
      body:
        body ??
        'Shipped the dark mode toggle on my portfolio this weekend. Took 3 tries to get the system preference + manual override working together. Happy to share the hook if anyone needs it. #PortfolioWeekend #ReactGh',
      likes: Number(PENDING_POST.likes),
      comments: Number(PENDING_POST.comments),
    }}
    banner={<PendingBanner onEdit={() => community?.update({ modal: 'create' })} />}
    onMore={onMore}
  />
);

export default PendingPostCard;
