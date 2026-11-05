import ShareToast from '../../publicData/share/ShareToast.jsx';

/*
 * BriefingToast — Figma 11.4.4d "Link copied": the shared dark pill (`publicData/share/ShareToast`, a variant of `ui/StatusToast`) over the page hero with the agency text, 104px from the top.
 * ⚠️ ASSUMPTION: a copy cannot be taken back; Undo reopens the share dialog (same as the Theme 8 toast). Props: text, onUndo(), onDismiss(), duration (default 6000).
 */
const POSITION = 'top-[104px] z-[70] lg:pl-[80px] xl:pl-[303px]';

const BriefingToast = ({ text, onUndo, onDismiss, duration = 6000 }) => (
  <ShareToast
    text={text}
    onUndo={onUndo}
    onDismiss={onDismiss}
    duration={duration}
    positionClassName={POSITION}
  />
);

export default BriefingToast;
