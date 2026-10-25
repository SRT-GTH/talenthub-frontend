import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { formatCount } from '../agencyFormat.js';
import ProgrammeActionsMenu from './ProgrammeActionsMenu.jsx';
import {
  ProgrammesIconArrowRight,
  ProgrammesIconDevBoard,
  ProgrammesIconHatGrad,
  ProgrammesIconLocation,
  ProgrammesIconMeatball,
  ProgrammesIconPencilRuler,
} from './programmesIcons.jsx';

/*
 * ProgrammeCard — one programme of "Your programmes" (Figma "Software Engineer Card" 8610:400679 re-used: 432 wide, white, 1px #e6e2d6, r14, p22):
 *   48px tile (r8) + the "⋯" button (41 x 24 white pill, top right) · title 22/28 600 + status pill (Active #ebf1ec · Draft #faf4e8 · Closed #f8f8f4, 14/500)
 *   place · kind · stamp (14/400 #999999, 18px pin icon) · three stats (Applicants · To review · Avg. match, 22/600, "--" while empty) split by 1px rules ·
 *   the success-rate panel (r14, p 12/14: rate 18/700 + delta, a 6px track, "620 placed of 1,840 enrolled · See outcomes"; a draft says "Not yet" + the sentence)
 *   · footer rule + "View applicants" 14/400 #999999 + the arrow.
 * Counts go through formatCount() ("<5" under 5). The whole footer is the card's link (applicants / summary / the form for a draft).
 * Props: programme, menuOpen, onToggleMenu(), onChoose(actionId), onCloseMenu(reason), buttonRef, href.
 */

const TILE_ICON = {
  pencil: ProgrammesIconPencilRuler,
  board: ProgrammesIconDevBoard,
  hat: ProgrammesIconHatGrad,
};

const PILL = {
  live: 'border-[#e1eae2] bg-[#ebf1ec] text-[#2a5730]',
  draft: 'border-[#eedeb8] bg-[#faf4e8] text-[#935a22]',
  closed: 'border-[#e8e8e4] bg-[#f8f8f4] text-[#737373]',
};

const Stat = ({ label, value, className }) => (
  <div className={classNames('flex flex-1 flex-col items-center gap-[6.6px]', className)}>
    <span className="text-[14px] leading-[20px] tracking-[0.2px] text-[#959592]">{label}</span>
    <span className="text-[22px] leading-[28px] font-semibold tracking-[-0.11px]">{value}</span>
  </div>
);

const SuccessPanel = ({ success }) => {
  if (!success) {
    return (
      <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#f8f8f4] px-[14px] py-[12px]">
        <div className="flex items-center justify-between gap-[8px]">
          <span className="text-[12px] leading-[14px] font-medium text-[#575755]">
            Success rate
          </span>
          <span className="rounded-full bg-[#efefea] px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold text-[#575755]">
            Not yet
          </span>
        </div>
        <p className="m-0 text-[12px] leading-[14px] text-[#575755]">
          No outcomes yet. Shows after the first cohort finishes.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#ebf1ec] px-[14px] py-[12px]">
      <div className="flex items-center justify-between gap-[8px]">
        <span className="text-[12px] leading-[14px] font-medium text-[#575755]">Success rate</span>
        <span className="flex items-center gap-[8px]">
          <span className="text-[18px] leading-[21px] font-bold text-[#1c2a21]">
            {success.rate}
          </span>
          <span className="text-[12px] leading-[14px] font-semibold text-[#387440]">
            {success.delta}
          </span>
        </span>
      </div>
      <div
        role="img"
        aria-label={`Success rate ${success.rate}`}
        className="h-[6px] overflow-hidden rounded-[3px] bg-white"
      >
        <div
          className="h-full rounded-[3px] bg-[#387440]"
          style={{ width: `${Math.round(success.bar * 100)}%` }}
        />
      </div>
      <p className="m-0 flex flex-wrap items-center gap-x-[6px] text-[12px] leading-[14px] text-[#575755]">
        <span>
          {formatCount(success.placed)} placed of {formatCount(success.enrolled)} enrolled
        </span>
        <span aria-hidden="true">·</span>
        <Link
          to={`/agency/outcomes`}
          className="inline-flex min-h-[24px] items-center font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          See outcomes
        </Link>
      </p>
    </div>
  );
};

const ProgrammeCard = ({
  programme: p,
  href,
  menuOpen,
  onToggleMenu,
  onChoose,
  onCloseMenu,
  buttonRef,
}) => {
  const Icon = TILE_ICON[p.icon] ?? ProgrammesIconPencilRuler;
  const dash = (n, fmt) => (n === null ? '--' : fmt(n));
  return (
    <article
      aria-label={p.title}
      className="relative flex min-w-0 flex-col rounded-[14px] border border-solid border-[#e6e2d6] bg-white p-[22px] font-sans"
    >
      <div className="flex flex-col gap-[16px]">
        <span
          className={classNames(
            'grid size-[48px] place-items-center rounded-[8px]',
            p.tile.bg,
            p.tile.fg
          )}
        >
          <Icon className="size-[20px]" />
        </span>
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between gap-[12px]">
            <h2 className="m-0 min-w-0 text-[22px] leading-[28px] font-semibold tracking-[-0.11px] text-[#1c2a21]">
              {p.title}
            </h2>
            <span
              className={classNames(
                'shrink-0 rounded-full border border-solid px-[9.6px] py-[6px] text-[14px] leading-[17px] font-medium',
                PILL[p.status]
              )}
            >
              {p.statusLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[4px] text-[14px] leading-[19px] text-[#999999]">
            <span className="inline-flex items-center gap-[4px]">
              <ProgrammesIconLocation className="size-[18px] shrink-0" />
              {p.place}
            </span>
            <span aria-hidden="true" className="text-[#959592]">
              •
            </span>
            <span className="text-[#959592]">{p.kind}</span>
            <span aria-hidden="true" className="text-[#959592]">
              •
            </span>
            <span className="text-[#959592]">{p.stamp}</span>
          </div>
        </div>
      </div>
      <button
        ref={buttonRef}
        type="button"
        data-actions-button=""
        aria-label={`Actions for ${p.title}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={onToggleMenu}
        className="absolute top-[14px] right-[-4px] grid h-[28px] min-w-[41px] cursor-pointer place-items-center rounded-full border-0 bg-white px-[11px] text-[#999999] shadow-[0_1.5px_1px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <ProgrammesIconMeatball className="h-[4px] w-[19px]" />
      </button>
      {menuOpen ? (
        <ProgrammeActionsMenu
          label={`Actions for ${p.title}`}
          onChoose={onChoose}
          onClose={onCloseMenu}
        />
      ) : null}
      <div className="flex gap-[24px] py-[18px]">
        <Stat
          label="Applicants"
          value={dash(p.applicants, formatCount)}
          className="text-[#1f4a2b]"
        />
        <span aria-hidden="true" className="w-px self-stretch bg-[#e6e2d6]" />
        <Stat label="To review" value={dash(p.toReview, formatCount)} className="text-[#32683a]" />
        <span aria-hidden="true" className="w-px self-stretch bg-[#e6e2d6]" />
        <Stat
          label="Avg. match"
          value={dash(p.avgMatch, (n) => `${n}%`)}
          className="text-[#32683a]"
        />
      </div>
      <SuccessPanel success={p.success} />
      <Link
        to={href}
        className="mt-[18px] flex items-center justify-between border-0 border-t border-solid border-[#e6e2d6] pt-[18px] text-[14px] leading-[18px] text-[#999999] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <span>{p.action}</span>
        <ProgrammesIconArrowRight className="size-[24px] text-[#2a5730]" />
      </Link>
    </article>
  );
};

export default ProgrammeCard;
