import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ProfileChipCheckIcon } from '../../shared/assets.jsx';
import { DISPLAY } from '../talentHome/TabsParts.jsx';
import { ImgDescWarnIcon } from './ImageDescriptionIcons.jsx';
import { ALT_BADGE, IMG_CHECK } from './ProfileImageDescriptionsData.js';
import { ProfileChip } from './ProfileTabsUi.jsx';
import { SHELF } from './profileTabsStyles.js';

const log = debug('ProfileImageDescriptions');

/* "ALT Described" / "ALT Add description" chip on a project cover (Figma `alt badge`). */
export const AltChip = ({ described, title, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Image description for ${title}: ${described ? ALT_BADGE.described : ALT_BADGE.missing}`}
    className={classNames(
      'absolute bottom-[12px] left-[12px] inline-flex cursor-pointer items-center rounded-full px-[10px] py-[6px] text-[11px] leading-[normal] font-bold whitespace-nowrap max-lg:text-[12px]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      described
        ? 'border border-[#387440] bg-[#ebf1ec] text-[#2d5d33] playful:border-[1.5px]'
        : 'border-[1.5px] border-[#c8951a] bg-white text-[#785910]'
    )}
  >
    {`${ALT_BADGE.prefix} ${described ? ALT_BADGE.described : ALT_BADGE.missing}`}
  </button>
);

/*
 * ImageDescriptionsCheck — AX-06 card "Readable by everyone" (Figma Playful 7591:4310 / Focused 8110:393259).
 * Props: `onDescribe()` opens the alt-text modal.
 */
const ImageDescriptionsCheck = ({ onDescribe }) => {
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <section
      aria-labelledby="img-check-title"
      className={classNames(
        'flex min-w-0 flex-wrap items-center gap-x-[20px] gap-y-[14px] rounded-[20px] bg-white p-[20px] max-lg:flex-col max-lg:items-stretch',
        SHELF
      )}
    >
      <div className="flex w-[96px] shrink-0 flex-col items-center max-lg:w-auto max-lg:flex-row max-lg:items-baseline max-lg:gap-[8px]">
        <span
          className={classNames(
            DISPLAY,
            'text-[32px] leading-[38px] font-semibold text-[#1c2a21] max-lg:text-[28px]'
          )}
        >
          {IMG_CHECK.score}
        </span>
        <span className="text-[12px] leading-[14px] font-medium text-[#737373]">
          {IMG_CHECK.scoreLabel}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 basis-[320px] flex-col gap-[8px]">
        <h2
          id="img-check-title"
          className="text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
        >
          {IMG_CHECK.title}
        </h2>
        <ul className="flex flex-wrap gap-[8px]">
          {IMG_CHECK.items.map((it) => (
            <li key={it.key}>
              <ProfileChip tone={it.ok ? 'green' : 'white'}>
                {it.ok ? (
                  <ProfileChipCheckIcon className="size-[14px] shrink-0" />
                ) : (
                  <ImgDescWarnIcon className="size-[14px] shrink-0" />
                )}
                {it.label}
              </ProfileChip>
            </li>
          ))}
        </ul>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          log('describe images');
          onDescribe();
        }}
      >
        {IMG_CHECK.cta}
      </Button>
    </section>
  );
};

export default ImageDescriptionsCheck;
