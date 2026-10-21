import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { HubButton } from '../../talentSkillsLab/HubParts.jsx';
import {
  AppliedTickIcon,
  ButtonArrowIcon,
  FarmerlineMarkIcon,
  MatchSparkleIcon,
  PinIcon,
  ShieldCheckIcon,
  TrackArrowIcon,
  UndoIcon,
} from '../bIcons.jsx';

const log = debug('JobProposalCard');

/*
 * JobProposalCard — "GTH · Job proposal card" component set (Figma 7430:3311), States: Pending 7430:3149, Passing 7433:3157,
 * Applied 7430:3195, Passed 7430:3242, Closed 7430:3283. Same in Playful and Focused (pdiff = 0 on every instance).
 *   <JobProposalCard card={JOB_CARD_*} onApply onNotInterested onUndo … />
 * Props
 *   card              a JOB_CARD_* object (messageCardsData.js); `card.state` picks the state.
 *   onApply()         Pending "View and apply"      -> the lead opens the pre-apply dialog (?modal=pre-apply).
 *   onNotInterested() Pending "Not interested"      -> the lead moves the card to state 'passing' (?modal=not-interested).
 *   onPass(reason)    Passing "Pass on this role"   -> the lead moves the card to 'passed'. `reason` = chip label or null.
 *   onCancelPass()    Passing "Cancel"              -> back to 'pending'.
 *   onUndo()          Passed (optional)             -> back to 'pending'.
 *   onTrack()         Applied "Track" (optional)    -> default logs only (no destination is drawn).
 *   onSeeSimilar()    Closed "See similar roles" (optional) -> default logs only (no destination is drawn).
 * The card is presentational: the lead owns `card.state` (see the wiring notes in the package report).
 * Width: fills the bubble column, capped at 540px (Pending: 400px, as drawn).
 */
const DARK_CARD =
  'bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] text-white shadow-[0_8px_24px_rgba(31,69,38,0.18)]';
const LIGHT_CARD = 'border border-solid border-[#e6e6e6] bg-[#f8f8f4] text-[#1c2a21]';

const STATE_ALIASES = {
  pending: 'pending',
  passing: 'passing',
  applied: 'applied',
  passed: 'passed',
  closed: 'closed',
};

const Fact = ({ children, icon, closed }) => (
  <li
    className={classNames(
      'm-0 inline-flex items-center gap-[4px] rounded-full px-[10px] font-sans text-[12px] font-medium leading-[14px] tracking-[0.2px]',
      closed
        ? 'border border-solid border-[#e6e6e6] bg-white py-[5px] text-[#595959]'
        : 'bg-white/12 py-[5px] text-white'
    )}
  >
    {icon ? <PinIcon className="size-[12px] shrink-0" /> : null}
    {children}
  </li>
);

const CardButton = ({ children, onClick, grow, className, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[37px] cursor-pointer select-none items-center justify-center gap-[6px] whitespace-nowrap rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white font-sans text-[14px] font-bold leading-[24px] tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-transform active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
      grow ? 'min-w-0 flex-1 px-[12px]' : 'shrink-0 px-[16px]',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

const ReasonChip = ({ label, selected, onToggle }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onToggle}
    className={classNames(
      'inline-flex min-h-[24px] cursor-pointer items-center rounded-full px-[12px] py-[6px] font-sans text-[12px] font-medium leading-[14px] tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
      selected
        ? 'bg-white text-[#2d5d33]'
        : 'border border-solid border-white/50 bg-transparent text-white'
    )}
  >
    {label}
  </button>
);

const JobProposalCard = ({
  card,
  onApply,
  onNotInterested,
  onPass,
  onCancelPass,
  onUndo,
  onTrack,
  onSeeSimilar,
}) => {
  const state = STATE_ALIASES[card?.state] ?? 'pending';
  const [reason, setReason] = useState(card?.selectedReason ?? null);

  useEffect(() => {
    log('mount', { id: card?.id, state });
  }, [card?.id, state]);

  useEffect(() => {
    // A card re-entering "passing" starts from the drawn selection again.
    if (state === 'passing') setReason(card?.selectedReason ?? null);
  }, [state, card?.selectedReason]);

  const closed = state === 'closed';
  // Passed (7430:3242) shares Closed's light card; its header/role colours differ slightly (see below).
  const light = closed || state === 'passed';
  const tag = state === 'pending' ? card.badge : card.statusLabel;
  const matchBlock = state === 'pending' || state === 'applied' || state === 'passed';
  log('render', { state, tag });

  return (
    <article
      aria-label={`${card.company} job proposal: ${card.role}`}
      data-state={state}
      className={classNames(
        'flex w-full flex-col gap-[12px] rounded-[16px] p-[16px] max-lg:p-[14px]',
        'max-w-[540px]', // T-MSG-01 draws the Pending instance 537px wide in the thread (component set: 400px)
        light ? LIGHT_CARD : DARK_CARD
      )}
    >
      <header className="flex items-start gap-[12px]">
        <FarmerlineMarkIcon className="size-[44px] shrink-0 overflow-hidden rounded-[12px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px] pt-[2px]">
          <p
            className={classNames(
              'm-0 flex items-center gap-[4px] font-sans text-[13px] font-medium leading-[16px] tracking-[0.2px]',
              light ? 'text-[#1c2a21]' : 'text-white'
            )}
          >
            <span className="min-w-0 truncate">{card.company} · Job proposal</span>
            <ShieldCheckIcon
              className={classNames('size-[13px] shrink-0', light && 'text-[#387440]')}
            />
          </p>
          <h3
            className={classNames(
              'm-0 font-sans text-[18px] font-semibold leading-[21px] tracking-[0.2px]',
              closed ? 'text-[#595959]' : light ? 'text-[#1c2a21]' : 'text-white'
            )}
          >
            {card.role}
          </h3>
        </div>
        {tag ? (
          <span
            className={classNames(
              'mt-[10px] inline-flex shrink-0 items-center rounded-full px-[10px] py-[4px] font-sans text-[11px] max-lg:text-[12px] font-semibold leading-[13px] tracking-[0.2px]',
              light ? 'bg-[#e6e6e6] text-[#595959]' : 'bg-white/16 text-white'
            )}
          >
            {tag}
          </span>
        ) : null}
      </header>

      <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
        {card.tags.map((t, i) => (
          <Fact key={t} icon={i === 0} closed={light}>
            {t}
          </Fact>
        ))}
      </ul>

      {matchBlock ? (
        <div
          className={classNames(
            'flex flex-col gap-[8px] rounded-[12px] px-[12px] py-[10px]',
            state === 'passed' ? 'border border-solid border-[#e6e6e6] bg-white' : 'bg-white/8'
          )}
        >
          <div className="flex items-center gap-[6px]">
            <MatchSparkleIcon className="size-[14px] shrink-0 text-[#f3c84b]" />
            <span className="font-sans text-[15px] font-semibold leading-[18px] tracking-[0.2px]">
              {card.matchPercent}% match
            </span>
            <span
              className={classNames(
                'min-w-0 flex-1 text-right font-sans text-[12px] font-medium leading-[14px] tracking-[0.2px]',
                state === 'passed' ? 'text-[#387440]' : 'text-white/75'
              )}
            >
              {card.skillsLabel}
            </span>
          </div>
          <div
            role="meter"
            aria-label={`${card.matchPercent}% match`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={card.matchPercent}
            className={classNames(
              'h-[6px] w-full overflow-hidden rounded-full',
              state === 'passed' ? 'bg-[#e6e6e6]' : 'bg-white/18'
            )}
          >
            <div
              className={classNames(
                'h-full rounded-full',
                state === 'passed' ? 'bg-[#387440]' : 'bg-[#f3c84b]'
              )}
              style={{ width: state === 'passed' ? '96.04%' : `${card.matchPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      {state === 'pending' ? (
        <div className="flex gap-[8px]">
          <CardButton
            grow
            onClick={() => {
              log('branch: view and apply');
              onApply?.(card);
            }}
          >
            View and apply
            <ButtonArrowIcon className="size-[20px] shrink-0 text-[#387440]" />
          </CardButton>
          <CardButton
            onClick={() => {
              log('branch: not interested');
              onNotInterested?.(card);
            }}
          >
            Not interested
          </CardButton>
        </div>
      ) : null}

      {state === 'passing' ? (
        <>
          <div className="flex flex-col gap-[8px] rounded-[12px] bg-white/8 p-[12px]">
            <p
              id={`${card.id}-why`}
              className="m-0 font-sans text-[14px] font-semibold leading-[17px] tracking-[0.2px] text-white"
            >
              {card.reasonsPrompt}
            </p>
            <div
              role="group"
              aria-labelledby={`${card.id}-why`}
              className="flex flex-wrap items-center gap-[6px]"
            >
              {card.reasons.map((r) => (
                <ReasonChip
                  key={r}
                  label={r}
                  selected={reason === r}
                  onToggle={() => {
                    log('branch: reason toggled', { r, was: reason });
                    setReason((cur) => (cur === r ? null : r));
                  }}
                />
              ))}
            </div>
            <p className="m-0 font-sans text-[12px] leading-[14px] tracking-[0.2px] text-white/75">
              {card.reasonsNote}
            </p>
          </div>
          <div className="flex gap-[8px]">
            <CardButton
              grow
              onClick={() => {
                log('branch: pass on this role', { reason });
                onPass?.(reason);
              }}
            >
              {card.passLabel}
            </CardButton>
            <CardButton
              className="px-[20px]"
              onClick={() => {
                log('branch: cancel pass');
                onCancelPass?.();
              }}
            >
              {card.cancelLabel}
            </CardButton>
          </div>
        </>
      ) : null}

      {state === 'applied' ? (
        <div className="flex items-center gap-[8px] rounded-[10px] bg-white px-[14px] py-[9px] text-[#1c2a21]">
          <span className="inline-flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
            <AppliedTickIcon className="size-[12px]" />
          </span>
          <span className="min-w-0 flex-1 font-sans text-[14px] font-semibold leading-[17px] tracking-[0.2px]">
            {card.applied.label}
          </span>
          <button
            type="button"
            onClick={() => {
              log('branch: track');
              onTrack?.(card);
            }}
            className="inline-flex min-h-[24px] shrink-0 cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {card.applied.action}
            <TrackArrowIcon className="size-[14px]" />
          </button>
        </div>
      ) : null}

      {state === 'passed' ? (
        <div className="flex items-center gap-[8px]">
          <p className="m-0 min-w-0 flex-1 font-sans text-[13px] leading-[1.4] tracking-[0.2px] text-[#595959]">
            {card.passedNote}
          </p>
          <button
            type="button"
            onClick={() => {
              log('branch: undo pass');
              onUndo?.();
            }}
            className="inline-flex min-h-[24px] shrink-0 cursor-pointer items-center gap-[4px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <UndoIcon className="size-[14px]" />
            Undo
          </button>
        </div>
      ) : null}

      {closed ? (
        <>
          <p className="m-0 font-sans text-[13px] leading-[16px] tracking-[0.2px] text-[#595959]">
            {card.closedNote}
          </p>
          <HubButton
            tone="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              log('branch: see similar roles');
              onSeeSimilar?.(card);
            }}
          >
            {card.closedAction}
          </HubButton>
        </>
      ) : null}
    </article>
  );
};

export default JobProposalCard;
