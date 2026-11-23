import { useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import PipelineCardMenu from './PipelineCardMenu.jsx';
import useDismissableLayer from '../../../hooks/useDismissableLayer.js';
import {
  CardMoreIcon,
  ChipAlertIcon,
  ChipCheckIcon,
  ChipClockIcon,
  ChipUndoIcon,
  FooterClockIcon,
} from './pipelineStageIcons.jsx';
import avatarAmaBoateng from '../../../assets/recruiter/talent-search/candidate-avatar-ama-boateng.webp';
import avatarEllaMensah from '../../../assets/recruiter/application-pipeline/candidate-avatar-ella-mensah.png';

const log = debug('PipelineCandidateCard');

/*
 * PipelineCandidateCard — the new board's candidate card (Figma "Candidate Card", e.g. 10173:11215 / 11240 / 11261 / 11290 / 11323 / 11412 / 11458):
 * white, 1px #00522b at 10%, r10, pad 14/16, gap 14. Top row = 32px avatar (photo or initials), name 14/600 + "Role · N yrs" 12, match % on the right
 * (13/600 #2a5730; 12px #902b20 under 50, #b8712a under 60). Below: tag chips (r8, #f3f8f4), status badges (pills), the green "Schedule Interview"
 * button, a 1px #e5e5e5 rule and the footer (clock + text, "..." menu). Selected = 2px #387540 border + a green check box top-left (PL-06 10173:15057).
 * ⚠️ ASSUMPTION: the select box shows as an empty outline on hover / focus and for every card once a selection exists; drawn only in its checked state.
 */
const PHOTOS = { 'ama-boateng': avatarAmaBoateng, 'ella-mensah': avatarEllaMensah };

const AVATAR_TONES = {
  violet: 'bg-[#f5f3ff] text-[#6d28d9]',
  taupe: 'bg-[#bcb7a8] text-[#575755]',
  blue: 'bg-[#eaeffb] text-[#244a9f]',
  green: 'bg-[#ebf1ec] text-[#2a5730]',
};

const BADGE_TONES = {
  amber: 'bg-[#faf4e8] text-[#463409]',
  red: 'bg-[#f9ebea] text-[#902b20]',
  neutral: 'bg-[#fefefe] text-[#575755]',
  green: 'bg-[#ebf1ec] text-[#165d3a]',
};

const BADGE_ICONS = {
  alert: ChipAlertIcon,
  clock: ChipClockIcon,
  check: ChipCheckIcon,
  undo: ChipUndoIcon,
};

const matchStyle = (percent) =>
  percent < 50
    ? 'text-[12px] text-[#902b20]'
    : percent < 60
      ? 'text-[12px] text-[#b8712a]'
      : 'text-[13px] text-[#2a5730]';

const ACTION_TEXT = { 'schedule-interview': 'Schedule Interview' };

const PipelineCandidateCard = ({
  card,
  stageId,
  selected = false,
  menuOpen = false,
  menuItemPinned = null,
  menuAlign = 'left',
  ghost = false,
  onToggleSelect,
  onOpenMenu,
  onCloseMenu,
  onMenuItem,
  onOpenDetails,
  onAction,
  onDragStart,
  onDragEnd,
}) => {
  const rootRef = useRef(null);
  useDismissableLayer(rootRef, menuOpen, () => {
    log('menu dismissed', card.id);
    onCloseMenu?.();
  });
  const Photo = card.avatar ? PHOTOS[card.avatar] : null;

  return (
    <article
      ref={rootRef}
      data-card={card.id}
      data-selected={selected ? 'true' : undefined}
      draggable={!ghost}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', card.id);
        event.dataTransfer.effectAllowed = 'move';
        log('drag start', card.id);
        onDragStart?.(card.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      className={classNames(
        'group relative flex flex-col gap-[14px] rounded-[10px] bg-white px-[16px] py-[14px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)] max-lg:px-[12px] max-lg:py-[12px]',
        selected
          ? 'border-2 border-[#387540] px-[15px] py-[13px] max-lg:px-[11px] max-lg:py-[11px]'
          : 'border border-[#00522b]/10',
        menuOpen && 'z-30'
      )}
    >
      {onToggleSelect ? (
        <label
          className={classNames(
            'absolute -left-[2px] -top-[2px] z-10 grid size-[24px] cursor-pointer place-items-center',
            !selected && 'opacity-0 focus-within:opacity-100 group-hover:opacity-100'
          )}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(card.id)}
            aria-label={`Select ${card.name}`}
            className="peer sr-only"
          />
          <span
            className={classNames(
              'grid size-[18px] place-items-center rounded-[5px] border peer-focus-visible:outline-2 peer-focus-visible:outline-brand-green',
              selected ? 'border-[#387440] bg-[#387440]' : 'border-[#bcb7a8] bg-white'
            )}
          >
            {selected ? <ChipCheckIcon className="size-[12px] text-white" /> : null}
          </span>
        </label>
      ) : null}

      <div className="flex items-center gap-[8px]">
        {Photo ? (
          <img src={Photo} alt="" className="size-[32px] shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className={classNames(
              'grid size-[32px] shrink-0 place-items-center rounded-full font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px]',
              AVATAR_TONES[card.avatarTone] ?? AVATAR_TONES.green
            )}
          >
            {card.initials}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => onOpenDetails?.(card.id)}
            className="cursor-pointer truncate border-0 bg-transparent p-0 text-left font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111] focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            {card.name}
          </button>
          <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {card.years === null || card.years === undefined
              ? card.role
              : `${card.role} · ${card.years} yrs`}
          </span>
        </div>
        {card.matchPercent === null || card.matchPercent === undefined ? null : (
          <span
            className={classNames(
              'shrink-0 font-sans leading-[16px] font-semibold tracking-[0.1px]',
              matchStyle(card.matchPercent)
            )}
          >
            {card.matchPercent}%
          </span>
        )}
      </div>

      {card.tags.length > 0 || card.criteria ? (
        <div className="flex flex-wrap gap-[4px]">
          {[...card.tags, ...(card.criteria ? [card.criteria] : [])].map((label) => (
            <span
              key={label}
              className="inline-flex min-h-[26px] items-center rounded-[8px] bg-[#f3f8f4] px-[10px] py-[6px] font-sans text-[12px] leading-[14px] font-medium text-[#2a5730]"
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}

      {card.badges.length > 0 ? (
        <div className="flex flex-wrap gap-[6px]">
          {card.badges.map((badge) => {
            const Icon = BADGE_ICONS[badge.icon];
            return (
              <span
                key={badge.id}
                className={classNames(
                  'inline-flex min-h-[26px] items-center gap-[4px] px-[8px] py-[3px] font-sans text-[12px] font-medium tracking-[0.2px]',
                  badge.chip
                    ? 'rounded-[8px] leading-[14px] tracking-normal text-[#5a430c]'
                    : 'rounded-full leading-[20px]',
                  badge.chip ? 'bg-[#faf4e8]' : BADGE_TONES[badge.tone]
                )}
              >
                {Icon ? <Icon className="size-[12px] shrink-0" /> : null}
                {badge.label}
              </span>
            );
          })}
        </div>
      ) : null}

      {card.primaryAction ? (
        <button
          type="button"
          onClick={() => onAction?.(card, card.primaryAction)}
          className="inline-flex h-[30px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border-2 border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[12px] leading-[14px] font-medium tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none max-lg:h-[36px] max-lg:shadow-none max-lg:active:translate-y-0"
        >
          {ACTION_TEXT[card.primaryAction] ?? card.primaryAction}
        </button>
      ) : null}

      <div className="relative flex items-center justify-between gap-2 border-t border-[#e5e5e5] pt-[12px]">
        <span className="flex items-center gap-[4px] font-sans text-[12px] leading-[14px] tracking-[0.2px] text-[#959592]">
          <FooterClockIcon className="size-[12px] shrink-0" />
          {card.footer}
        </span>
        <span className="relative">
          <button
            type="button"
            aria-label={`More actions for ${card.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => (menuOpen ? onCloseMenu?.() : onOpenMenu?.(card.id))}
            className="-my-[2px] grid size-[24px] cursor-pointer place-items-center rounded-[6px] border-0 bg-transparent p-0 text-[#bfbfbf] hover:bg-[#f3f8f4] focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            <CardMoreIcon className="size-[20px]" />
          </button>
          {menuOpen ? (
            <PipelineCardMenu
              stageId={stageId}
              pinnedItem={menuItemPinned}
              align={menuAlign}
              onItem={(item) => onMenuItem?.(card, item)}
            />
          ) : null}
        </span>
      </div>
    </article>
  );
};

export default PipelineCandidateCard;
