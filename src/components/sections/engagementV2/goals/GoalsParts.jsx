import { CARD, CHIP_LINE, EYEBROW, HEADING_FONT, PAGE_X, STICKER } from './goalsStyles.js';
import * as Icons from './goalsIcons.jsx';

/*
 * Shared building blocks of the Goals and Profile complete screens (both use the same page skeleton: gradient hero with a
 * headline + info card, a content column and a 464px rail).
 */

/* Figma icon by name ('Target' -> TargetIcon). Size and colour come from the parent (font-size + text colour). */
export const Glyph = ({ name, className }) => {
  const Icon = Icons[`${name}Icon`];
  return Icon ? <Icon className={className ?? 'size-full'} /> : null;
};

/* Playful 4-point doodle star (Figma `genz:doodle star`: gold #c8951a 24px, green #387440 13px, yellow #ffd86b 18px). */
export const DoodleStar = ({ className = '', sizePx = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={sizePx}
    height={sizePx}
    fill="currentColor"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
  >
    <path
      d="M12 0L15.224 8.776L24 12L15.224 15.224L12 24L8.776 15.224L0 12L8.776 8.776L12 0Z"
      stroke="#1c2a21"
      strokeWidth="1.2"
    />
  </svg>
);

/* Yellow Playful sticker: tilt is a CSS rotate class. Hidden in Focused. */
export const Sticker = ({ children, className = '', testId }) => (
  <span data-testid={testId} className={`hidden playful:block ${STICKER} ${className}`}>
    {children}
  </span>
);

/* Pale tile with a glyph (icon sized by `iconClass`). */
export const IconTile = ({ icon, tileClass, iconClass = 'text-[16px] text-[#387440]' }) => (
  <span className={`grid shrink-0 place-items-center ${tileClass}`}>
    <span className={`grid ${iconClass}`}>
      <Glyph name={icon} />
    </span>
  </span>
);

/*
 * PageHero: the 230px gradient hero (Figma Hero 8285:19094 / 7715:98).
 * Props: eyebrow, title (<span> runs: ink + green), lead, sticker { text, tilt } (Playful), stars [{ left, top, size, color }]
 * (Playful, lg+), card (right column node).
 */
export const PageHero = ({ eyebrow, title, lead, sticker, stickerClass = '', card }) => (
  <section
    className={`bg-[linear-gradient(135deg,#ebf1ec_0%,#faf4e8_100%)] pt-[clamp(20px,1.97vw,34px)] pb-5 lg:min-h-[230px] ${PAGE_X}`}
  >
    <div className="mx-auto grid max-w-[1728px] gap-6 lg:grid-cols-[minmax(0,704fr)_minmax(0,460fr)] lg:justify-between lg:gap-[clamp(24px,3.7vw,64px)]">
      <div className="relative flex flex-col gap-3">
        <p className={`${EYEBROW} text-[#387440]`}>{eyebrow}</p>
        <div className="relative w-fit max-w-full">
          <h1
            className={`m-0 text-[clamp(28px,2.72vw,47px)] font-semibold leading-[1.107] text-[#111] ${HEADING_FONT}`}
          >
            {title}
          </h1>
          {sticker ? (
            <span
              data-testid="hero-sticker"
              className={`hidden playful:block lg:absolute lg:left-[calc(100%+8px)] lg:top-[24px] lg:whitespace-nowrap ${STICKER} ${stickerClass}`}
            >
              {sticker}
            </span>
          ) : null}
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959]">{lead}</p>
        {sticker ? (
          <DoodleStar
            sizePx={24}
            className="pointer-events-none hidden text-[#c8951a] lg:playful:absolute lg:playful:left-[calc(100%+24px)] lg:playful:top-[29px] lg:playful:block"
          />
        ) : null}
        {sticker ? (
          <DoodleStar
            sizePx={13}
            className="pointer-events-none hidden text-[#387440] lg:playful:absolute lg:playful:left-[calc(100%+50px)] lg:playful:top-[71px] lg:playful:block"
          />
        ) : null}
      </div>
      {card}
    </div>
  </section>
);

/* The white card in the hero's right column: heading + three icon rows (Figma Hero card, 460 wide). */
export const HeroInfoCard = ({ title, rows }) => (
  <div className={`flex flex-col gap-[10px] px-[22px] py-5 ${CARD}`}>
    <h2 className="m-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
      {title}
    </h2>
    {rows.map((r) => (
      <div key={r.title} className="flex items-center gap-[10px]">
        <IconTile icon={r.icon} tileClass="size-[30px] rounded-[9px] bg-[#ebf1ec]" />
        <span className="flex min-w-0 flex-col gap-px">
          <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] max-lg:text-[12px]">
            {r.title}
          </span>
          <span className="font-sans text-[12px] leading-[14px] text-[#595959]">{r.text}</span>
        </span>
      </div>
    ))}
  </div>
);

/* Rail card (Figma Rail · …): 18/600 heading + rows of a 32px tile, 14/600 title and 13/400 text. */
export const RailCard = ({ title, rows, className = '' }) => (
  <div className={`flex flex-col gap-[14px] p-6 ${CARD} ${className}`}>
    <h2 className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
      {title}
    </h2>
    {rows.map((r) => (
      <div key={r.title} className="flex gap-3">
        <IconTile icon={r.icon} tileClass="size-[32px] rounded-[10px] bg-[#ebf1ec]" />
        <span className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
            {r.title}
          </span>
          <span className="font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
            {r.text}
          </span>
        </span>
      </div>
    ))}
  </div>
);

/* Pill chip (24px, pale green, 11 or 12px 600 text). */
export const TagChip = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans font-semibold text-[#387440] ${CHIP_LINE} ${className}`}
  >
    {children}
  </span>
);

/* Section label: 11/700 uppercase, 1.2 tracking, #595959. */
export const SectionLabel = ({ children }) => (
  <p className={`${EYEBROW} text-[#595959]`}>{children}</p>
);
