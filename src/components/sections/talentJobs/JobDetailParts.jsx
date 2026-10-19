import { classNames } from '../../../utils/classNames.js';
import { TalentSidebarProfileAvatarIllustration } from '../../shared/assets.jsx';
import { JobDetailLockXlIcon } from './JobDetailIcons.jsx';
import { INK_PILL } from './jobDetailStyles.js';

/*
 * Small pieces shared by the posting detail screen and the apply dialogs (Figma J-02 … J-14).
 *   Sticker      Focused: mint pill #ebf1ec / #1f4d26, flat.   Playful: yellow #ffd86b + 1.2px ink + 2px shadow,
 *                tilted (pass the rotate class: Figma tilts are 5 / -4 / 4 / -6 deg).
 *   CompanyLogo  56px r16 company mark, or the dashed lock tile for a confidential company.
 *   KofiAvatar   56px round avatar used in the profile preview (green face, Playful: green→sage gradient).
 */
export const Sticker = ({ tone = 'yellow', className, children }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[11.5px] leading-[14px] font-bold text-[#1f4d26] max-lg:text-[12px]',
      INK_PILL,
      tone === 'white'
        ? 'playful:bg-white playful:text-[#1c2a21]'
        : tone === 'grey'
          ? 'playful:bg-[#e1eae2] playful:text-[#1c2a21]'
          : 'playful:bg-[#ffd86b] playful:text-[#1c2a21]',
      className
    )}
  >
    {children}
  </span>
);

export const CompanyLogo = ({ company, size = 56, radius = 16, className }) =>
  company.confidential ? (
    <span
      className={classNames(
        'flex shrink-0 items-center justify-center border-[1.5px] border-dashed border-[#1c2a21] bg-[#f8f8f4] text-[#1c2a21]',
        className
      )}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <JobDetailLockXlIcon className="size-[24px]" />
    </span>
  ) : company.logo ? (
    <img
      src={company.logo}
      alt=""
      aria-hidden="true"
      className={classNames('shrink-0 object-cover', className)}
      style={{ width: size, height: size, borderRadius: radius }}
    />
  ) : (
    <span
      aria-hidden="true"
      className={classNames(
        'flex shrink-0 items-center justify-center bg-[#ebf1ec] font-sans font-bold text-[#2d5d33]',
        className
      )}
      style={{ width: size, height: size, borderRadius: radius, fontSize: Math.round(size * 0.34) }}
    >
      {company.initials ||
        String(company.name || '?')
          .slice(0, 1)
          .toUpperCase()}
    </span>
  );

export const KofiAvatar = () => (
  <span className="relative block size-[56px] shrink-0 overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.6%,#7aa870_85.4%)]">
    <TalentSidebarProfileAvatarIllustration className="absolute -top-[3px] -left-[3px] h-[63px] w-[62px] max-w-none" />
  </span>
);
