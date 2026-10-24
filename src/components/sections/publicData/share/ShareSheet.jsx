import { classNames } from '../../../../utils/classNames.js';
import ShareDialogShell from './ShareDialogShell.jsx';
import SharePreviewCard from './SharePreviewCard.jsx';
import {
  ShareIconChat,
  ShareIconCopy,
  ShareIconMail,
  ShareIconMessage,
  ShareIconMore,
} from './shareIcons.jsx';
import { SHARE_SHEET_APPS } from './data/shareData.js';
import { displayUrl } from './shareUrl.js';

/*
 * ShareSheet — Figma 8.1.2 · Mobile · Native share sheet (8515:742). The drawn bottom sheet that stands in for the phone's own share menu:
 * on a phone whose browser supports the Web Share API the sheet is skipped (PublicDataModals calls navigator.share) and "More" still opens it.
 * Props: url, title (the page title shown next to the thumbnail), card, onApp(id), onClose().
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const APP_ICONS = {
  copy: ShareIconCopy,
  whatsapp: ShareIconMessage,
  email: ShareIconMail,
  sms: ShareIconChat,
  more: ShareIconMore,
};

const ShareSheet = ({ url, title, card, onApp, onClose }) => (
  <ShareDialogShell
    variant="sheet"
    title="Share"
    description="Uses your phone’s share menu when available."
    onClose={onClose}
  >
    <div className="flex items-center gap-[12px] rounded-[14px] bg-[#f2f2ee] p-[12px]">
      <SharePreviewCard width={96} {...card} />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {title}
        </p>
        <p className="m-0 truncate font-sans text-[12px] leading-[14px] text-[#595959]">
          {displayUrl(url)}
        </p>
      </div>
    </div>
    <ul className="m-0 flex list-none justify-between gap-[8px] p-0">
      {SHARE_SHEET_APPS.map((app) => {
        const Icon = APP_ICONS[app.id];
        return (
          <li key={app.id}>
            <button
              type="button"
              onClick={() => onApp(app.id)}
              className={classNames(
                'flex w-[56px] cursor-pointer flex-col items-center gap-[6px] rounded-[16px] bg-transparent p-0',
                FOCUS
              )}
            >
              <span className="flex size-[50px] items-center justify-center rounded-[16px] bg-[#f2f2ee] text-[#1c2a21]">
                <Icon className="size-[22px]" />
              </span>
              <span className="font-sans text-[12px] leading-[14px] font-medium text-[#1c2a21]">
                {app.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  </ShareDialogShell>
);

export default ShareSheet;
