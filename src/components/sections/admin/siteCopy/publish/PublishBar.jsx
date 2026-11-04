import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { copyAccess } from '../copyAccess.js';
import PublishButton from './PublishButton.jsx';
import { PublishEyeIcon } from './PublishIcons.jsx';
import { barSummary, changeCount, plural } from './publishData.js';

const log = debug('PublishBar');

/*
 * PublishBar — the sticky bar of the section editor (Figma 7.8.4a "publish bar (sticky)" 11023:75501): #1c2a21, r18, p 14/20, gap 14, shadow
 * 0 8 24 black@.18; amber dot (10, #c8951a), "3 unpublished changes" 15/600 white, "Home › Hero (2) · Home › FAQ (1)" 13 #bfbfbf, then
 * Preview (outlined, green eye), Discard (outlined) and Publish (green, 56 high).
 * Props: changes (publishData.js), role (the screen role; no "publish" permission = no Publish button), onPublish, onDiscard, previewTo (the
 * Preview link; without it Preview only logs: ⚠️ ASSUMPTION). Renders nothing without changes. `sticky bottom-[24px]` (stickyClassName overrides; ⚠️ ASSUMPTION: Figma's 102px
 * from the artboard bottom is the 1195px frame, not a viewport rule). Below lg the text sits above the buttons (own phone layout).
 */
const PublishBar = ({
  changes = [],
  role,
  onPublish,
  onDiscard,
  previewTo,
  stickyClassName = 'bottom-[24px]',
}) => {
  const count = changeCount(changes);
  const canPublish = copyAccess(role).publish;

  useEffect(() => {
    log('state', { count, role, canPublish });
  }, [count, role, canPublish]);

  if (count === 0) return null;
  const title = `${plural(count, 'unpublished change', 'unpublished changes')}`;

  return (
    <div
      role="region"
      aria-label="Unpublished changes"
      className={`sticky ${stickyClassName} z-30 flex flex-wrap items-center gap-x-[14px] gap-y-[12px] rounded-[18px] bg-[#1c2a21] px-[clamp(14px,1.2vw,20px)] py-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.18)]`}
    >
      <div className="flex min-w-0 flex-1 basis-[240px] items-center gap-[14px]">
        <span aria-hidden="true" className="size-[10px] shrink-0 rounded-full bg-[#c8951a]" />
        <span className="font-sans text-[15px] leading-[18px] font-semibold whitespace-nowrap text-white max-lg:text-[14px]">
          {title}
        </span>
        <span className="min-w-0 truncate font-sans text-[13px] leading-[16px] text-[#bfbfbf] max-lg:text-[12px]">
          {barSummary(changes)}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-x-[14px] gap-y-[8px] max-lg:w-full max-lg:justify-start">
        <PublishButton
          variant="outline"
          to={previewTo}
          onClick={previewTo ? undefined : () => log('preview (no target given)')}
          leftIcon={<PublishEyeIcon className="size-[16px] text-[#387440]" />}
        >
          Preview
        </PublishButton>
        <PublishButton variant="outline" onClick={onDiscard}>
          Discard
        </PublishButton>
        {canPublish ? (
          <PublishButton variant="primary" onClick={onPublish}>
            Publish
          </PublishButton>
        ) : null}
      </div>
    </div>
  );
};

export default PublishBar;
