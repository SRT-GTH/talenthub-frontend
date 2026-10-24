import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from './shareButtonClasses.js';
import ShareDialogShell from './ShareDialogShell.jsx';
import { ShareIconFile, ShareIconImage, ShareIconShare, ShareIconWarning } from './shareIcons.jsx';
import { DOWNLOAD_ERROR_CODE } from './data/shareData.js';

/*
 * DownloadFailedDialog — Figma 8.8.1f "We couldn’t build the PDF" (8504:728): error alert, three other ways to take the view away
 * (print this page · download images · share a link instead), Close + Try again.
 *   Print this page → window.print() through the A4 print layout (onPrint)
 *   Share a link instead → the Share dialog (onShare)
 *   Download images → ⚠️ NOT BUILT: per-section PNGs need an image-rendering library or the backend; the row is drawn but disabled.
 * Props: code (error code), onPrint(), onShare(), onRetry(), onClose().
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const AltRow = ({ icon, title, detail, onClick, disabled = false }) => {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'flex w-full items-center gap-[12px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] text-left',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[#f8f8f4]',
        FOCUS
      )}
    >
      <Icon className="size-[20px] shrink-0 text-[#387440]" />
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {title}
        </span>
        <span className="font-sans text-[12px] leading-[14px] text-[#595959]">{detail}</span>
      </span>
    </button>
  );
};

const DownloadFailedDialog = ({
  code = DOWNLOAD_ERROR_CODE,
  onPrint,
  onShare,
  onRetry,
  onClose,
}) => (
  <ShareDialogShell
    title="We couldn’t build the PDF"
    description="Something went wrong on our side. Your view is fine; nothing was lost."
    onClose={onClose}
    width={560}
    footer={
      <>
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={onClose}
          className={TERTIARY_BUTTON}
        >
          Close
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          onClick={onRetry}
        >
          Try again
        </Button>
      </>
    }
  >
    <div
      role="alert"
      className="flex items-start gap-[10px] rounded-[12px] bg-[#f9ebea] px-[14px] py-[12px]"
    >
      <ShareIconWarning className="mt-[1px] size-[18px] shrink-0 text-[#902b20]" />
      <p className="m-0 font-sans text-[13px] leading-[18px] font-medium text-[#902b20]">
        Error code {code} · the map service timed out. Mention this code if you contact us.
      </p>
    </div>
    <p className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
      Other ways to take this away
    </p>
    <div className="flex flex-col gap-[16px]">
      <AltRow
        icon={ShareIconFile}
        title="Print this page"
        detail="Uses your browser’s print to PDF (A4 layout)"
        onClick={onPrint}
      />
      <AltRow
        icon={ShareIconImage}
        title="Download images"
        detail="PNG of each section, ready for slides"
        disabled
      />
      <AltRow
        icon={ShareIconShare}
        title="Share a link instead"
        detail="Opens the same live view"
        onClick={onShare}
      />
    </div>
  </ShareDialogShell>
);

export default DownloadFailedDialog;
