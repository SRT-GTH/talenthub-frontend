import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { AssessmentArrowLeftIcon, AssessmentChevronIcon } from './AssessmentDetailIcons.jsx';
import { DETAIL_ICONS } from './assessmentDetailIconMap.js';
import {
  CHIP_BASE,
  CHIP_SIZES,
  CHIP_TONES,
  DETAIL_CARD,
  FOCUS_RING,
  HEADING,
  MINI_BASE,
  MINI_TONES,
} from './assessmentDetailStyles.js';

const log = debug('AssessmentDetailParts');

/* Renders a glyph by its data key; unknown keys draw nothing. */
export const Glyph = (props) => {
  const Icon = DETAIL_ICONS[props.name];
  return Icon ? <Icon className={props.className} /> : null;
};

/* Card shell. `label` becomes the section's accessible name. */
export const Card = (props) => (
  <section
    aria-label={props.label}
    className={classNames('flex min-w-0 flex-col', DETAIL_CARD, props.className)}
  >
    {props.children}
  </section>
);

/*
 * Chip — Figma "Chip · …". tone: soft | neutral | dark. Playful = 32px outlined pill; Focused = 22px flat pill.
 * `icon` is a data key (DETAIL_ICONS); `size="title"` is the page-title chip (12.5px in Focused).
 */
export const Chip = (props) => (
  <span
    className={classNames(
      CHIP_BASE,
      props.tone === 'outline'
        ? CHIP_SIZES.fixed
        : props.size === 'title'
          ? CHIP_SIZES.title
          : CHIP_SIZES.responsive,
      CHIP_TONES[props.tone ?? 'neutral'],
      props.className
    )}
  >
    {props.icon ? (
      <Glyph
        name={props.icon}
        className={classNames(
          'size-[13px] shrink-0 playful:size-[14px]',
          props.tone === 'dark' ? 'text-white playful:text-[#387440]' : '',
          props.tone === 'soft' ? 'text-[#2a5730] playful:text-[#387440]' : '',
          props.tone === 'neutral' || props.tone === 'outline'
            ? 'text-[#595959] playful:text-[#387440]'
            : ''
        )}
      />
    ) : null}
    {props.children}
  </span>
);

/* Mini status chip: done | here | next | strong | review | plain. */
export const MiniChip = (props) => (
  <span className={classNames(MINI_BASE, MINI_TONES[props.tone ?? 'plain'], props.className)}>
    {props.children}
  </span>
);

/* Back link + title row + subtitle + action(s): the page header every details screen shares (Figma `back` + `Container`). */
export const DetailHeader = (props) => {
  const { back, title, subtitle, titleChip, actions } = props;
  return (
    <header className="flex flex-col gap-[24px]">
      <Link
        to={back.to}
        className={classNames(
          'inline-flex w-fit items-center gap-[6px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline max-lg:min-h-[24px]',
          FOCUS_RING
        )}
      >
        <AssessmentArrowLeftIcon className="size-[16px] shrink-0 text-[#387440]" />
        {back.label}
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-x-[24px] gap-y-[16px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px] max-lg:basis-full">
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
            <h1
              className={classNames(
                HEADING,
                'text-[clamp(26px,1.97vw,34px)] leading-[1.21] tracking-[-0.02em]'
              )}
            >
              {title}
            </h1>
            {titleChip}
          </div>
          <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px] max-sm:leading-[20px]">
            {subtitle}
          </p>
        </div>
        {actions ? (
          <div className="mt-[6px] flex shrink-0 flex-wrap gap-[12px]">{actions}</div>
        ) : null}
      </div>
    </header>
  );
};

/* Tile: the square icon holder (rungs 34px r10, preview / practice rows 36px r11, library 48px r14). */
export const Tile = (props) => (
  <span
    aria-hidden="true"
    className={classNames('inline-flex shrink-0 items-center justify-center', props.className)}
  >
    {props.children}
  </span>
);

/* A chevron-only row action used by attempts / practice rows. */
export const RowChevron = (props) => (
  <AssessmentChevronIcon className={classNames('shrink-0 text-[#595959]', props.className)} />
);

/*
 * RowLink — a row that goes somewhere (`to`) or, when no destination is drawn, a button that only logs.
 * Used by the attempt rows and the practice rows.
 */
export const RowLink = (props) => {
  const cls = classNames(
    'flex w-full min-w-0 items-center text-left font-sans no-underline',
    FOCUS_RING,
    props.className
  );
  if (props.to) {
    return (
      <Link to={props.to} className={cls} onClick={() => log('row link', props.to)}>
        {props.children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={() => log('row action (no destination)')}>
      {props.children}
    </button>
  );
};
