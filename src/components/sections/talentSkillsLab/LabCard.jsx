import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { hubLabMeta } from './skillsLabData.js';
import { HubCheckIcon, HubHourglassIcon, HubStopwatchIcon } from './HubIcons.jsx';
import { EMPHASIS_CARD, HAIRLINE_CARD, HEADING, HubButton, HubDots } from './HubParts.jsx';
import { LAB_ICONS } from './hubShared.js';

const log = debug('LabCard');

/*
 * LabCard — Figma component set "GTH · Lab card" (7831:8206), six variants driven by `lab.status`:
 *   ready        Ready to verify chip, primary "Start lab"                (emphasis card)
 *   in_progress  "In progress · 5 of 8" chip + progress dots, "Resume lab" (emphasis card)
 *   verified     "Verified · 8/8" chip, secondary "Retake"
 *   cooldown     "Retake in 18h" chip, disabled "Retake in 18h" button
 *   explore      "Not in your skills yet" chip, secondary "Try it"
 *   new          "NEW" chip, primary "Try it"
 * Props: lab (GET /skills-lab/labs item), context (picks lab.notes[context] as the description, optional),
 * badge (replaces the explore chip text, e.g. "Most picked"), className.
 * Links: card title -> /skills-lab/lab/<id> (details, stretched over the card); CTA -> /skills-lab/lab/<id>/play.
 */
const STATUS = {
  ready: { cta: 'Start lab', tone: 'cardPrimary', size: 'sm', emphasis: true },
  in_progress: { cta: 'Resume lab', tone: 'cardPrimary', size: 'sm', emphasis: true },
  verified: { cta: 'Retake', tone: 'cardSecondary', size: 'lg' },
  cooldown: { tone: 'disabled', size: 'lg' },
  explore: { cta: 'Try it', tone: 'cardSecondary', size: 'lg' },
  new: { cta: 'Try it', tone: 'cardPrimary', size: 'sm' },
};

/* Chip sitting top-right of the card. Rotated stickers are Playful-only decoration; the tilt is a pure style. */
const StatusChip = ({ lab, badge }) => {
  const base =
    'inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full font-sans text-[12px] leading-[14px] max-lg:text-[12px]';
  switch (lab.status) {
    case 'ready':
      return (
        <span
          className={classNames(
            base,
            'min-h-[31px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[10px] py-[5px] font-bold leading-[18px] text-[#1c2a21]',
            'rotate-[-3deg] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]'
          )}
        >
          Ready to verify
        </span>
      );
    case 'in_progress':
      return (
        <span
          className={classNames(
            base,
            'bg-[#eaeffb] px-[10px] py-[5px] font-semibold text-[#244a9f]'
          )}
        >
          <HubStopwatchIcon className="size-[14px]" />
          {`In progress · ${lab.progress.answered} of ${lab.progress.total}`}
        </span>
      );
    case 'verified':
      return (
        <span
          className={classNames(
            base,
            'border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[10px] py-[5px] font-bold text-[#1c2a21]',
            'playful:border-[#1c2a21] playful:bg-[#ebf1ec]'
          )}
        >
          <HubCheckIcon className="size-[14px] text-[#1c2a21]" />
          {`Verified · ${lab.score}`}
        </span>
      );
    case 'cooldown':
      return (
        <span
          className={classNames(
            base,
            'bg-[#faf4e8] px-[10px] py-[5px] font-semibold text-[#463409]'
          )}
        >
          <HubHourglassIcon className="size-[14px]" />
          {`Retake in ${lab.cooldown.hours}h`}
        </span>
      );
    case 'new':
      return (
        <span
          className={classNames(
            base,
            'border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[11px] py-[5px] text-[11px] font-bold leading-[13px] text-[#1c2a21] max-lg:text-[12px]',
            'rotate-[-4deg] playful:border-[1.2px] playful:border-[#1c2a21] playful:bg-[#ebf1ec] playful:shadow-[2px_2px_0_#1c2a21]'
          )}
        >
          NEW
        </span>
      );
    default:
      return (
        <span
          className={classNames(
            base,
            'bg-[#f8f8f4] px-[10px] py-[5px] font-semibold text-[#595959]'
          )}
        >
          {badge ?? 'Not in your skills yet'}
        </span>
      );
  }
};

const LabCard = ({ lab, context, badge, className }) => {
  useEffect(() => {
    log('render', lab.id, lab.status);
  }, [lab.id, lab.status]);

  const spec = STATUS[lab.status] ?? STATUS.explore;
  const Glyph = LAB_ICONS[lab.icon];
  const quiet = lab.status === 'cooldown' || lab.status === 'explore';
  const description = (context && lab.notes?.[context]) || lab.description;
  const playHref = `/skills-lab/lab/${lab.id}/play`;
  const detailsHref = `/skills-lab/lab/${lab.id}`;

  return (
    <article
      data-lab={lab.id}
      data-status={lab.status}
      className={classNames(
        'relative flex min-w-0 flex-col gap-[12px] rounded-[20px] bg-white p-[20px]',
        spec.emphasis ? EMPHASIS_CARD : HAIRLINE_CARD,
        className
      )}
    >
      <div className="flex items-center justify-between gap-[8px]">
        <span
          className={classNames(
            'inline-flex size-[44px] shrink-0 items-center justify-center rounded-[13px] text-[#387440]',
            quiet ? 'bg-[#f8f8f4]' : 'bg-[#ebf1ec]',
            lab.status === 'verified' && 'bg-[#387440] playful:bg-[#ebf1ec]'
          )}
        >
          {/* Focused verified tile is green with the glyph in its own green (Figma), so it all but vanishes. */}
          <Glyph className="size-[21px]" />
        </span>
        <StatusChip lab={lab} badge={badge} />
      </div>
      <h3
        className={classNames(
          HEADING,
          'text-[20px] leading-[25px] tracking-[-0.01em] [overflow-wrap:anywhere]'
        )}
      >
        <Link
          to={detailsHref}
          className="text-inherit no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {lab.title}
        </Link>
      </h3>
      <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-lg:text-[13px]">
        <HubStopwatchIcon className="size-[20px] shrink-0 text-[#595959]" />
        {hubLabMeta(lab)}
      </p>
      <p className="m-0 min-h-[40px] font-sans text-[14px] leading-[20px] text-[#595959]">
        {description}
      </p>
      {lab.status === 'in_progress' ? <HubDots dots={lab.cardDots} /> : null}
      <div className="relative z-10 mt-auto">
        {lab.status === 'cooldown' ? (
          <HubButton
            tone="disabled"
            disabled
            className="w-full"
            aria-label={`Retake in ${lab.cooldown.hours}h (available after the cooldown)`}
          >
            {`Retake in ${lab.cooldown.hours}h`}
          </HubButton>
        ) : (
          <HubButton tone={spec.tone} size={spec.size} to={playHref} className="w-full">
            {spec.cta}
          </HubButton>
        )}
      </div>
    </article>
  );
};

export default LabCard;
