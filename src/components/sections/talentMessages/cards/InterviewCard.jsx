import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { HubButton } from '../../talentSkillsLab/HubParts.jsx';
import { CalendarIcon, ConfirmedCheckIcon, VideoCallIcon } from '../bIcons.jsx';

const log = debug('InterviewCard');

/*
 * InterviewCard — Figma "Interview card · Invited" (T-MSG-08 7421:2794 / Focused 8110:438553) and "Interview card · Confirmed"
 * (T-MSG-09 7421:3336 / Focused 8110:438937). Identical in Playful and Focused (pdiff = 0).
 *   <InterviewCard card={INTERVIEW_CARD_INVITE | INTERVIEW_CARD_CONFIRMED} onConfirm onSuggest onAddToCalendar onChange />
 * Props
 *   card                 { state: 'invite' | 'confirmed', strip, title, when, where, … } (messageCardsData.js)
 *   onConfirm()          invite "Accept"                -> the lead switches the card to 'confirmed' (?state=confirmed).
 *   onSuggest()          invite "Suggest another time"  (optional) -> default logs only: no destination is drawn.
 *   onAddToCalendar()    confirmed "Add to calendar"    (optional) -> default logs only: no destination is drawn.
 *   onChange()           confirmed "Need to change it?" (optional) -> default logs only: no destination is drawn.
 * The Figma strip reads "INTERVIEW INVITE" in both states. Width: fills the bubble column, capped at 540px.
 */
const Detail = (props) => {
  const Glyph = props.icon;
  return (
    <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] tracking-[0.2px] text-[#595959]">
      <Glyph className="size-[14px] shrink-0" />
      <span className="min-w-0">{props.children}</span>
    </p>
  );
};

const InterviewCard = ({ card, onConfirm, onSuggest, onAddToCalendar, onChange }) => {
  const confirmed = card?.state === 'confirmed';

  useEffect(() => {
    log('mount', { id: card?.id, state: card?.state });
  }, [card?.id, card?.state]);
  log('render', { confirmed });

  return (
    <article
      aria-label={`Interview invite: ${card.title}`}
      data-state={confirmed ? 'confirmed' : 'invite'}
      className="w-full max-w-[540px] overflow-hidden rounded-[12px] border-[1.2px] border-solid border-[rgba(0,82,43,0.1)] bg-white"
    >
      <div className="flex items-center gap-[8px] bg-[#eaeffb] px-[16px] py-[10px]">
        <CalendarIcon className="size-[14px] shrink-0 text-[#244a9f]" />
        <span className="font-sans text-[11px] max-lg:text-[12px] font-semibold leading-[13px] tracking-[0.2px] text-[#1d3b7f]">
          {card.strip}
        </span>
      </div>
      <div
        className={classNames(
          'flex flex-col p-[16px] max-lg:p-[14px]',
          confirmed ? 'gap-[8px]' : 'gap-[16px]'
        )}
      >
        <h3 className="m-0 font-sans text-[16px] font-semibold leading-[19px] tracking-[0.2px] text-[#1c2a21]">
          {card.title}
        </h3>
        {confirmed ? (
          <>
            <Detail icon={CalendarIcon}>{card.when}</Detail>
            <Detail icon={VideoCallIcon}>{card.where}</Detail>
            <p
              role="status"
              className="m-0 flex items-center gap-[8px] rounded-[10px] bg-[#e8f2ed] px-[12px] py-[10px] font-sans text-[13px] font-semibold leading-[16px] tracking-[0.2px] text-[#1c4327]"
            >
              <ConfirmedCheckIcon className="size-[16px] shrink-0 text-[#2d5d33]" />
              {card.confirmedLabel}
            </p>
            <div className="flex flex-wrap items-center gap-[12px] pt-[4px]">
              <HubButton
                tone="secondary"
                size="lg"
                onClick={() => {
                  log('branch: add to calendar');
                  onAddToCalendar?.(card);
                }}
              >
                {card.calendarLabel}
              </HubButton>
              <button
                type="button"
                onClick={() => {
                  log('branch: need to change it');
                  onChange?.(card);
                }}
                className="inline-flex min-h-[24px] cursor-pointer items-center border-0 bg-transparent p-0 font-sans text-[12px] font-medium leading-[14px] tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {card.changeLabel}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-[8px]">
              <Detail icon={CalendarIcon}>{card.when}</Detail>
              <Detail icon={VideoCallIcon}>{card.where}</Detail>
            </div>
            <div className="flex gap-[8px] max-sm:flex-col">
              <HubButton
                tone="primary"
                size="lg"
                className="min-w-0 flex-1 max-lg:whitespace-normal"
                onClick={() => {
                  log('branch: accept -> confirmed');
                  onConfirm?.(card);
                }}
              >
                {card.acceptLabel}
              </HubButton>
              <HubButton
                tone="secondary"
                size="lg"
                className="min-w-0 flex-1 max-lg:whitespace-normal"
                onClick={() => {
                  log('branch: suggest another time');
                  onSuggest?.(card);
                }}
              >
                {card.suggestLabel}
              </HubButton>
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default InterviewCard;
