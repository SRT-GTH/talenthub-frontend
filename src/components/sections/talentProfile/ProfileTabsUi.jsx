import { classNames } from '../../../utils/classNames.js';
import {
  ProfileBadgeBulbIcon,
  ProfileDotLargeAIcon,
  ProfileDotLargeBIcon,
  ProfileDotSmallAIcon,
  ProfileDotSmallBIcon,
  ProfileLineChartIllustration,
  ProfileBadgeCheckCircleGlyph,
  ProfileBarGlyph,
  ProfileBldgGlyph,
  ProfileBookGlyph,
  ProfileChipAnalyticalIcon,
  ProfileChipCalmIcon,
  ProfileChipCheckIcon,
  ProfileChipHeartIcon,
  ProfileChipLangIcon,
  ProfileChipPinIcon,
  ProfileChipTargetIcon,
  ProfileChipTeamIcon,
  ProfileCompanyGlyph,
  ProfileDnsGlyph,
  ProfileEditButtonIcon,
  ProfileFileIcon,
  ProfileFuncGlyph,
  ProfileGameGlyph,
  ProfileGradGlyph,
  ProfileInterestAgritechIcon,
  ProfileInterestCityIcon,
  ProfileInterestDataIcon,
  ProfileInterestFintechIcon,
  ProfileInterestMicIcon,
  ProfileInterestMusicIcon,
  ProfileLaptopGlyph,
  ProfileLinkIcon,
  ProfileNoteIcon,
  ProfileTableGlyph,
  ProfileTargetGlyph,
  ProfileTrendGlyph,
  ProfileTrophyIcon,
  ProfileVoiceGlyph,
  TalentNavStreakPlayfulFigureIcon,
  TalentHomeStreakFireIcon,
} from '../../shared/assets.jsx';
import {
  BADGE_ICONS,
  CARD_PLAIN,
  CHIP_ICONS,
  GLYPHS,
  PAD,
  SHELF,
  TITLE,
} from './profileTabsStyles.js';

/*
 * ProfileTabsUi — building blocks shared by the profile header + the six tab bodies (Tabs agent).
 * Focused is the default; Playful is layered with `playful:` variants only (wiki/playful-mode.md).
 * Every colour / radius / shadow is the exact Figma value (P-01..P-06, Focused + Playful frames).
 */

/* ---------- surfaces ---------- */
/* The streak mark: Focused = flame glyph, Playful = the GTH figure holding a torch. */
export const StreakMark = ({ className }) => (
  <>
    <TalentHomeStreakFireIcon className={classNames(className, 'playful:hidden')} />
    <TalentNavStreakPlayfulFigureIcon className={classNames(className, 'hidden playful:block')} />
  </>
);

/* ---------- small controls ---------- */
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

// 32px chip (Figma "GTH · Chip"): white default, green soft, ink selected.
const CHIP_TONE = {
  white: 'border-[#e1eae2] bg-white text-[#595959]',
  green: 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]',
  ink: 'border-[#1c2a21] bg-[#1c2a21] text-white',
};
export const ProfileChip = ({
  tone = 'white',
  icon,
  children,
  className,
  as: Tag = 'span',
  ...rest
}) => {
  const Icon = icon ? CHIP_ICONS[icon] : null;
  return (
    <Tag
      className={classNames(
        'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border px-[14px] text-[13px] leading-[normal] font-semibold whitespace-nowrap',
        CHIP_TONE[tone],
        Tag === 'button' && classNames('cursor-pointer', FOCUS),
        className
      )}
      {...rest}
    >
      {Icon ? <Icon className="size-[14px] shrink-0" /> : null}
      {children}
    </Tag>
  );
};

/* Pill sticker. Focused = soft green pill; Playful = ink-bordered "sticker" with a 2px shelf. */
const TAG_TONE = {
  yellow: 'playful:bg-[#ffd86b]',
  white: 'playful:bg-white',
};
export const Tag = ({ tone = 'yellow', size = 11, className, children }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] py-[5px] leading-[normal] font-bold whitespace-nowrap text-[#1f4d26]',
      'playful:border-[1.2px] playful:border-[#1c2a21] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      TAG_TONE[tone],
      size === 13 ? 'text-[13px]' : size === 12 ? 'text-[12px]' : 'text-[11px]',
      className
    )}
  >
    {children}
  </span>
);

/* 34px pencil button (Figma "edit"). */
export const EditButton = ({ label, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={classNames(
      'size-[34px] shrink-0 cursor-pointer rounded-[10px] transition-opacity hover:opacity-80',
      FOCUS
    )}
  >
    <ProfileEditButtonIcon className="block size-full" />
  </button>
);

/* Text link ("See all 7 →", "+ Add", "Re-record"). */
export const HeadLink = ({ children, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'shrink-0 cursor-pointer text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#387440] hover:underline',
      FOCUS,
      className
    )}
  >
    {children}
  </button>
);

/* Thin progress meter. */
export const Meter = ({ pct, height = 6, track = '#e1eae2', fill = '#387440', className }) => (
  <span
    role="presentation"
    className={classNames('block overflow-hidden rounded-full', className)}
    style={{ height, background: track }}
  >
    <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: fill }} />
  </span>
);

/* Rounded glyph tile used for skills / rows (Figma "icon", bg #f8f8f4). */
export const GlyphTile = ({ name, size = 40, glyph = 21, className }) => {
  const Glyph = name ? GLYPHS[name] : null;
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'flex shrink-0 items-center justify-center rounded-[12px] bg-[#f8f8f4]',
        className
      )}
      style={{ width: size, height: size }}
    >
      {Glyph ? (
        <span className="block shrink-0" style={{ width: glyph, height: glyph }}>
          <Glyph className="block size-full" />
        </span>
      ) : null}
    </span>
  );
};

/* ---------- card shell with the standard head ---------- */
export const ProfileCard = ({
  title,
  link,
  onLink,
  onEdit,
  editLabel,
  shelf = false,
  tint,
  className,
  bodyClassName,
  children,
}) => (
  <section
    aria-label={title}
    className={classNames(
      'flex min-w-0 flex-col gap-[16px] overflow-hidden rounded-[20px]',
      PAD,
      shelf ? SHELF : 'border border-[#e6e6e6]',
      tint ?? 'bg-white',
      className
    )}
  >
    <header className="flex items-center gap-[10px]">
      <h2 className={classNames(TITLE, 'min-w-0 truncate')}>{title}</h2>
      <span aria-hidden="true" className="h-px min-w-px flex-1" />
      {link ? <HeadLink onClick={onLink}>{link}</HeadLink> : null}
      {onEdit ? <EditButton label={editLabel ?? `Edit ${title}`} onClick={onEdit} /> : null}
    </header>
    <div className={bodyClassName}>{children}</div>
  </section>
);

/* Two-column page body (left 880 / right 425 at 1329) that stacks below 896px of content width. */
export const TabLayout = ({ tab, left, right, className }) => (
  <div
    id="profile-tabpanel"
    role="tabpanel"
    aria-labelledby={`profile-tab-${tab}`}
    className="@container"
  >
    <div
      className={classNames(
        'grid grid-cols-1 items-start gap-[clamp(16px,1.39vw,24px)] @4xl:grid-cols-[minmax(0,880fr)_minmax(0,425fr)]',
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-[clamp(14px,1.16vw,20px)]">{left}</div>
      <div className="flex min-w-0 flex-col gap-[clamp(14px,1.16vw,20px)]">{right}</div>
    </div>
  </div>
);

/* Single-column tab panel wrapper (Portfolio). */
export const TabPanel = ({ tab, children, className }) => (
  <div
    id="profile-tabpanel"
    role="tabpanel"
    aria-labelledby={`profile-tab-${tab}`}
    className={classNames('@container flex flex-col gap-[clamp(14px,1.16vw,20px)]', className)}
  >
    {children}
  </div>
);

/* ---------- project cover art (Figma cover/bars | cover/line | cover/dots, drawn in code) ---------- */
// Art is designed on a 264x150 canvas; positions are % of it so it scales with the cover.
const px = (n, of) => `${(n / of) * 100}%`;
const BARS = [
  [39, 75, 60],
  [73, 40, 95],
  [107, 95, 40],
  [141, 15, 120],
  [175, 55, 80],
  [209, 30, 105],
];
// [left, top, size, variant] — variant picks one of the four dot SVGs.
const DOTS = [
  [13, 39, 8, 'sa'],
  [66, 76, 15, 'la'],
  [119, 113, 8, 'sb'],
  [172, 54, 15, 'lb'],
  [225, 91, 8, 'sb'],
  [48, 128, 15, 'la'],
  [101, 69, 8, 'sa'],
  [154, 106, 15, 'la'],
  [207, 47, 8, 'sb'],
  [30, 84, 15, 'lb'],
  [83, 121, 8, 'sb'],
  [136, 62, 15, 'la'],
  [189, 99, 8, 'sa'],
  [242, 40, 15, 'la'],
  [65, 77, 8, 'sb'],
  [118, 114, 15, 'lb'],
  [171, 55, 8, 'sb'],
  [224, 92, 15, 'la'],
  [47, 129, 8, 'sa'],
  [100, 70, 15, 'la'],
  [153, 107, 8, 'sb'],
  [206, 48, 15, 'lb'],
  [29, 85, 8, 'sb'],
  [82, 122, 15, 'la'],
  [135, 63, 8, 'sa'],
  [188, 100, 15, 'la'],
];
const DOT_ICON = {
  sa: ProfileDotSmallAIcon,
  sb: ProfileDotSmallBIcon,
  la: ProfileDotLargeAIcon,
  lb: ProfileDotLargeBIcon,
};

export const ProjectCoverArt = ({ kind, fixed = false }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'relative block aspect-[264/150]',
      fixed ? 'mx-auto w-[264px] max-w-full' : 'w-full'
    )}
  >
    {kind === 'bars'
      ? BARS.map(([l, t, h]) => (
          <span
            key={l}
            className="absolute rounded-[4px] bg-[#1d4ed8]"
            style={{ left: px(l, 264), top: px(t, 150), width: px(22, 264), height: px(h, 150) }}
          />
        ))
      : null}
    {kind === 'line' ? (
      <span
        className="absolute block"
        style={{ left: px(13, 264), top: px(37, 150), width: px(234, 264), height: px(96, 150) }}
      >
        <ProfileLineChartIllustration className="block size-full" />
      </span>
    ) : null}
    {kind === 'dots'
      ? DOTS.map(([l, t, size, v], i) => {
          const Dot = DOT_ICON[v];
          return (
            <span
              key={i}
              className="absolute block"
              style={{ left: px(l, 264), top: px(t, 150), width: px(size, 264), aspectRatio: '1' }}
            >
              <Dot className="block size-full" />
            </span>
          );
        })
      : null}
  </span>
);
