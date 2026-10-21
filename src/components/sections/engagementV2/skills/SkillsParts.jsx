import { classNames } from '../../../../utils/classNames.js';
import { HEADING } from '../../talentSkillsLab/HubParts.jsx';
import { DoodleStarIcon } from '../interests/interestsIcons.jsx';
import { SKILL_LEVELS, SKILLS_COPY } from './skillsData.js';
import { CARD, GLYPHS, GUTTER, SOFT_FOCUS } from './skillsStyles.js';
import { SkillsSmileIcon } from './skillsIcons.jsx';

/* Level dots (4, filled = level). size 8 (cards / guide) or 7 (dialog). */
export const LevelDots = ({ filled, size = 8 }) => (
  <span className="inline-flex shrink-0 items-center gap-[3px]" aria-hidden="true">
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className={classNames('rounded-full', i < filled ? 'bg-[#387440]' : 'bg-[#d9dcd3]')}
        style={{ width: size, height: size }}
      />
    ))}
  </span>
);

/* "Chip · …" pills (32px). tone: dark (selected / Verified) | outline. */
export const SkChip = ({ tone = 'outline', onClick, pressed, className, children }) => {
  const cls = classNames(
    'inline-flex h-[32px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:min-h-[32px] max-lg:text-[13px]',
    tone === 'dark'
      ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
      : tone === 'soft'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]',
    onClick && classNames('cursor-pointer', SOFT_FOCUS),
    className
  );
  if (onClick) {
    return (
      <button type="button" aria-pressed={pressed} onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
};

/* Small pill (23px): "STAGE n" style count chip and "Self-reported". */
export const MiniChip = ({ strong, className, children, ...rest }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full border border-solid bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#595959] max-lg:text-[12px]',
      strong
        ? 'border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.35)]'
        : 'border-[#e7e7e7]',
      className
    )}
    {...rest}
  >
    {children}
  </span>
);

/* Playful-only yellow sticker (genz:sticker): tilt in degrees. */
export const Sticker = ({ children, rotate = 4, className }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'pointer-events-none hidden select-none whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px] tracking-[0.03em] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] lg:playful:inline-flex',
      className
    )}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </span>
);

/* Playful doodle star (hidden in Focused). */
export const Star = ({ size, color, className }) => (
  <span
    aria-hidden="true"
    className={classNames('pointer-events-none absolute hidden lg:playful:block', className)}
    style={{ width: size, height: size, color }}
  >
    <DoodleStarIcon className="size-full" />
  </span>
);

/* Tile with a glyph: Figma 48px (r14) tiles. tone: green | soft | gold | cream. */
export const Tile = ({
  glyph,
  tone = 'soft',
  size = 48,
  radius = 14,
  glyphSize = 24,
  className,
}) => {
  const Glyph = GLYPHS[glyph];
  const toneCls = {
    green:
      'bg-[#387440] text-white border border-solid border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
    soft: 'bg-[#f7f8f4] text-[#575755]',
    mint: 'bg-[#ebf1ec] text-[#387440]',
    gold: 'bg-[#c8951a] text-white',
    cream: 'bg-[#faf4e8] text-[#785910]',
  }[tone];
  return (
    <span
      className={classNames('inline-flex shrink-0 items-center justify-center', toneCls, className)}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {Glyph ? (
        <span
          className="inline-flex shrink-0 items-center justify-center [&>svg]:size-full"
          style={{ width: glyphSize, height: glyphSize }}
        >
          <Glyph />
        </span>
      ) : null}
    </span>
  );
};

/* ---- Hero (SK-01..03): gradient band, copy left, badge legend right ---- */

const Legend = ({ arcade }) => (
  <div className="relative w-full lg:w-[clamp(340px,26.6vw,460px)]">
    <div className={classNames('flex flex-col gap-[12px] p-[clamp(16px,1.27vw,22px)]', CARD)}>
      <h2 className="m-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
        {SKILLS_COPY.legendTitle}
      </h2>
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
        <SkChip tone="dark">Verified</SkChip>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
          {SKILLS_COPY.legendVerified}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
        <SkChip>Self-reported</SkChip>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
          {SKILLS_COPY.legendSelf}
        </span>
      </div>
    </div>
    {arcade ? (
      <button
        type="button"
        onClick={arcade}
        className={classNames(
          'relative z-[1] -mt-[4px] inline-flex min-h-[33px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[12px] py-[7px] font-sans text-[14px] font-semibold leading-[17px] text-white',
          'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
          'max-lg:mt-[10px] max-lg:text-[13px]',
          SOFT_FOCUS
        )}
      >
        <SkillsSmileIcon className="size-[16px] shrink-0" />
        New: verify skills by playing games
      </button>
    ) : null}
  </div>
);

export const SkillsHero = ({ sticker, arcade }) => (
  <section
    className={classNames(
      'relative bg-[linear-gradient(90deg,#ebf1ec_0%,#fffefc_60%,#faf4e8_100%)] pb-[clamp(24px,2.3vw,40px)] pt-[clamp(24px,2vw,34px)] lg:min-h-[230px] lg:pb-[13px]',
      GUTTER
    )}
  >
    <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start lg:justify-between">
      <div className="relative flex max-w-[660px] flex-col gap-[12px]">
        <span className="font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[0.109em] text-[#387440] max-lg:text-[12px]">
          {SKILLS_COPY.eyebrow}
        </span>
        <div className="relative w-fit max-w-full">
          <h1
            className={classNames(
              HEADING,
              'text-[clamp(28px,2.72vw,47px)] leading-[1.107] text-[#1c2a21] lg:whitespace-nowrap'
            )}
          >
            What you can <span className="text-[#387440]">actually do.</span>
          </h1>

          <Sticker className="absolute left-[calc(100%-39px)] top-[6px] max-lg:hidden">
            {sticker}
          </Sticker>
          <Star
            size={26}
            color="#c8951a"
            className="left-[calc(100%+53px)] top-[-12px] max-lg:hidden"
          />
          <Star
            size={14}
            color="#387440"
            className="left-[calc(100%+79px)] top-[28px] max-lg:hidden"
          />
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959] max-lg:text-[14px]">
          {SKILLS_COPY.body}
        </p>
        <Star size={10} color="#387440" className="left-[500px] top-[81px] max-lg:hidden" />
      </div>
      <div className="lg:mt-[6px]">
        <Legend arcade={arcade} />
      </div>
    </div>
  </section>
);

/* ---- Right rail ---- */

export const ProficiencyGuide = ({ className }) => (
  <aside className={classNames('flex flex-col gap-[14px] p-[24px]', CARD, className)}>
    <h2 className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
      {SKILLS_COPY.guideTitle}
    </h2>
    {SKILL_LEVELS.map((level) => (
      <div key={level.id} className="flex items-center gap-[12px]">
        <LevelDots filled={level.dots} />
        <div className="flex min-w-0 flex-col gap-[1px]">
          <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
            {level.id}
          </span>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959]">{level.hint}</span>
        </div>
      </div>
    ))}
  </aside>
);

/* Two-column body: main column + 464px rail. */
export const SkillsColumns = ({ main, rail }) => (
  <div
    className={classNames(
      'grid items-start gap-[clamp(20px,3.7vw,64px)] pb-[clamp(24px,3vw,56px)] pt-[clamp(20px,2.3vw,40px)] lg:grid-cols-[minmax(0,1fr)_clamp(300px,26.9vw,464px)]',
      GUTTER
    )}
  >
    <div className="flex min-w-0 flex-col gap-[20px]">{main}</div>
    <div className="flex min-w-0 flex-col gap-[20px]">{rail}</div>
  </div>
);
