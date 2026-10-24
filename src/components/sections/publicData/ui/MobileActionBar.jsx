import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';

/*
 * MobileActionBar — Figma "T8 · Mobile action bar (sticky)" (8507:241, 390x76): the bar pinned to the bottom of every phone page with the two
 * page actions. White, 1px #e7e7e7 on top, shadow 0 -4px 16px rgba(0,0,0,.06), px16, gap 10; "Share" (outlined, 178x48) and "Download PDF"
 * (green, 170x48).
 * Props
 *   onShare      fn()
 *   onDownload   fn()
 *   shareLabel / downloadLabel   default "Share" / "Download PDF"
 *   fixed        boolean   true (default) = sticky to the viewport bottom inside <main> (it never covers the footer: it rests at the end of
 *                          the page content) and shown below md only; false = in flow, always visible (gallery / frame comparison)
 *   className
 * Layout note: render it as the LAST child of <PublicDataFrame> content; it is sticky, so no bottom padding is needed. It pads for
 * env(safe-area-inset-bottom).
 */

const MobileActionBar = ({
  onShare,
  onDownload,
  shareLabel = 'Share',
  downloadLabel = 'Download PDF',
  fixed = true,
  className,
}) => (
  <div
    role="region"
    aria-label="Page actions"
    className={classNames(
      'z-30 flex h-[76px] w-full items-center gap-[10px] border-t border-solid border-[#e7e7e7] bg-white px-[16px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]',
      fixed ? 'sticky bottom-0 md:hidden' : 'relative',
      className
    )}
  >
    <Button
      type="button"
      variant="tertiary"
      size="md"
      onClick={onShare}
      className="min-w-0 flex-1 !rounded-[14px] !px-[22px] !py-[12px]"
    >
      {shareLabel}
    </Button>
    <Button
      type="button"
      variant="primary"
      size="sm"
      onClick={onDownload}
      className="min-w-0 flex-1"
    >
      {downloadLabel}
    </Button>
  </div>
);

export default MobileActionBar;
