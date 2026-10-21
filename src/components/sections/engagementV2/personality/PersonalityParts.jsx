import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { DoodleStarLargeIcon, DoodleStarSmallIcon } from '../../../shared/assets.jsx';
import * as Icons from './personalityIcons.jsx';
import { STAGE_TRAIL } from './personalityData.js';

const log = debug('PersonalityParts');

/*
 * Shared pieces of the Personality screens (Figma canvas 3125:10352).
 *   PIcon          icon by data name ('Compass' -> CompassIcon from personalityIcons.jsx)
 *   StageTrail     the 77px progress bar of PE-01 / PA-00 / overview: Avatar > Interests > ... trail (left) +
 *                  "Step 3 of 9 · Personality · 22% · auto-saved" and a 6px progress track (right)
 *   PageFooter     the 88px footer (left note · right actions), sticky to the bottom
 *   PlayfulSticker / PlayfulStar   Playful-only `genz:` layers (hidden in Focused)
 */

export const PIcon = ({ name, className }) => {
  const Glyph = Icons[`${name}Icon`];
  return Glyph ? <Glyph className={className} /> : null;
};

export const StageTrail = ({
  progressPct = 22,
  fillPx = 73,
  statusTail = '· 22% · auto-saved',
}) => {
  log('trail render', { progressPct });
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-white px-[clamp(16px,3.1vw,54px)] py-[10px] lg:min-h-[77px]">
      <ol className="m-0 flex min-w-0 list-none items-center gap-[8px] overflow-x-auto p-0 max-md:w-full">
        {STAGE_TRAIL.map((s, i) => (
          <li key={s.id} className="flex shrink-0 items-center gap-[8px]">
            <span className="flex items-center gap-[12px]">
              <Icons.CheckCircleIcon
                className={classNames('size-[16px]', s.done ? 'text-[#387440]' : 'text-[#babab7]')}
              />
              <span
                className={classNames(
                  'font-sans text-[14px] leading-[17px] tracking-[0.14px] max-lg:text-[12px]',
                  s.current ? 'font-semibold text-[#387440]' : 'font-medium text-[#babab7]'
                )}
                aria-current={s.current ? 'step' : undefined}
              >
                {s.label}
              </span>
            </span>
            {i < STAGE_TRAIL.length - 1 ? (
              <Icons.SeparatorIcon
                className={classNames('size-[24px]', i === 0 ? 'text-[#387440]' : 'text-[#999999]')}
              />
            ) : null}
          </li>
        ))}
      </ol>
      <div className="flex w-[334px] max-w-full flex-col gap-[4px] max-md:w-full">
        <div className="flex flex-wrap items-center gap-x-[9px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#716e65]">
          <span aria-hidden="true" className="size-[5px] rounded-[2.5px] bg-[#387440]" />
          <span>
            Step 3 of 9 · <b className="font-bold tracking-[0.1px] text-[#1c2a21]">Personality</b>
          </span>
          <span className="ml-auto">{statusTail}</span>
        </div>
        <div
          role="progressbar"
          aria-label="Profile progress"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-[6px] w-full overflow-hidden rounded-full bg-[#e1eae2]"
        >
          <div
            className="h-full rounded-full bg-[#387440]"
            style={{ width: `${(fillPx / 334) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* Footer: left note (icon + text) and right actions. `skip` / `primary` / `secondary` = { label, onClick, disabled, icon }. */
export const PageFooter = ({
  noteIcon = 'CheckCircle',
  noteIconClass = 'text-[#387440]',
  note,
  skip,
  secondary,
  primary,
  buttonSize = 'md',
}) => {
  log('footer render', { note, primary: primary?.label });
  return (
    <div className="sticky bottom-0 z-20 flex min-h-[88px] w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-3">
      <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
        <PIcon name={noteIcon} className={classNames('size-[14px] shrink-0', noteIconClass)} />
        {note}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        {skip ? (
          <button
            type="button"
            onClick={skip.onClick}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent px-2 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {skip.label}
          </button>
        ) : null}
        {secondary ? (
          <Button
            variant="tertiary-subtle"
            size="lg"
            onClick={secondary.onClick}
            className="!border-[#c1d4c4] !text-[#165d3a]"
          >
            {secondary.label}
          </Button>
        ) : null}
        {primary ? (
          <Button
            size={buttonSize}
            disabled={primary.disabled}
            onClick={primary.onClick}
            rightIcon={<Icons.ArrowRightIcon />}
          >
            {primary.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

/* Playful-only sticker (Figma `genz:sticker`): #ffd86b, 1.2px ink border, 2px hard shadow. rotate in CSS degrees. */
export const PlayfulSticker = ({ children, className, rotate = 0, pill = false }) => (
  <span
    aria-hidden="true"
    data-sticker=""
    style={{ transform: `rotate(${rotate}deg)` }}
    className={classNames(
      'pointer-events-none absolute z-10 hidden whitespace-nowrap border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:block playful:max-lg:hidden',
      pill
        ? 'rounded-full text-[11px] leading-[13px] font-bold'
        : 'rounded-[8px] text-[12px] leading-[14px] font-bold tracking-[0.4px]',
      className
    )}
  >
    {children}
  </span>
);

/* Playful-only doodle star (yellow = large 4-point star, green = small). */
export const PlayfulStar = ({ size = 18, green = false, className }) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size }}
    className={classNames(
      'pointer-events-none absolute hidden playful:block playful:max-lg:hidden [&_svg]:size-full',
      green && '[&_path]:fill-[#387440]',
      className
    )}
  >
    {size > 12 ? <DoodleStarLargeIcon /> : <DoodleStarSmallIcon />}
  </span>
);

/* Heading with an accent tail: lead in ink, tail in brand green. */
export const AccentHeading = ({ as = 'h1', lead, accent, className }) => {
  const Tag = as;
  return (
    <Tag className={classNames('m-0 font-semibold', className)}>
      {lead}
      <span className="text-[#387440]">{accent}</span>
    </Tag>
  );
};
