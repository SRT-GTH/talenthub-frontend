import {
  TalentSidebarPublicProfileLinkIcon,
  TalentSidebarPreviewArrowUpRightIcon,
  TalentSidebarLiveStickerDot,
} from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { TALENT_PROFILE } from './talentShellData.js';

const log = debug('TalentPublicProfileCard');

/* "Recruiter view link" card — Figma 7740:11313 (Playful, with LIVE sticker) / 8097:4868 (Focused). */
const TalentPublicProfileCard = ({
  className,
  shelf = true,
  url = TALENT_PROFILE.url,
  label = 'Preview as recruiter',
  onPreview,
}) => (
  <div
    className={classNames(
      'relative flex w-full shrink-0 flex-col items-start gap-[10px] rounded-[12px] border border-solid border-[#f8f8f4] bg-white p-[12px]',
      shelf &&
        'playful:rounded-[20px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]',
      className
    )}
  >
    <div className="flex w-full items-center gap-[6px] rounded-[8px] bg-[#ebf1ec] px-[10px] py-[8px]">
      <TalentSidebarPublicProfileLinkIcon className="size-[14px] shrink-0" />
      <p className="font-sans text-[13px] font-medium leading-[18px] tracking-[0.2px] text-[#387440]">
        Your public profile
      </p>
    </div>
    {url ? (
      <p className="w-full break-all font-mono text-[10px] leading-4 tracking-[0.2px] text-[#32683a]">
        {url}
      </p>
    ) : null}
    <button
      type="button"
      onClick={() => {
        if (onPreview) {
          log('preview clicked:', label);
          onPreview();
        } else log('preview as recruiter clicked (no destination wired yet)');
      }}
      className="flex h-[36px] w-full items-center justify-center gap-[6px] rounded-[14px] border-x-2 border-b-2 border-t border-solid border-[rgba(28,42,33,0.3)] bg-white px-[12px] font-sans text-[13px] font-bold leading-6 tracking-[0.1px] text-[#1c2a21] drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="whitespace-nowrap">{label}</span>
      <TalentSidebarPreviewArrowUpRightIcon className="size-[20px] shrink-0" />
    </button>
    {/* genz:sticker · LIVE (8262:3154) — Playful shelf frames only (absent from complete/top) */}
    {shelf && (
      <span
        aria-hidden="true"
        className="absolute -top-[17px] right-[4px] hidden -rotate-6 items-center gap-[4px] overflow-hidden rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[8px] py-[3px] shadow-[2px_2px_0_#1c2a21] playful:flex"
      >
        <TalentSidebarLiveStickerDot className="size-[6px] shrink-0" />
        <span className="font-sans text-[10px] font-bold leading-[normal] tracking-[0.6px] text-[#1c2a21]">
          LIVE
        </span>
      </span>
    )}
  </div>
);

export default TalentPublicProfileCard;
