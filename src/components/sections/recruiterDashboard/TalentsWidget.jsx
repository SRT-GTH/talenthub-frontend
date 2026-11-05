import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import InlineState from '../../ui/InlineState.jsx';
import SkeletonBlock from '../../ui/SkeletonBlock.jsx';
import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { HIDDEN_HINT, TALENTS, TALENT_EMPTY } from './recruiterDashboardData.js';

/*
 * TalentsWidget — "Recommended talents" (Figma 10049:59037, states D30–D36 in section 04): five AI-matched talent cards (fit chip, "why you match" chips, save / View / Invite).
 * The anonymised card (Talent #4821) shows a lock instead of initials; `hintId` highlights it and opens the "Identity hidden" note (D34).
 * Props: jobFilter (node: FilterSelect), readOnly, state ('' | 'loading' | 'empty'), cards, savedIds, hintId,
 *   onSave(id), onView(id), onInvite(id), onHint(id | ''), onRefine (the empty state's action).
 * ⚠️ ASSUMPTION: a saved card shows its bookmark filled (D33 draws the toast; the card itself is not distinguishable in the frame).
 */
const HiddenHint = ({ onClose }) => (
  <div
    role="note"
    className="absolute top-[calc(100%+8px)] left-0 z-20 flex w-[264px] max-w-[calc(100vw-48px)] flex-col gap-[6px] rounded-[12px] border border-solid border-[#e5e8e3] bg-white p-[14px] shadow-[0_12px_32px_-8px_rgba(15,15,10,0.2),0_2px_6px_rgba(15,15,10,0.06)]"
  >
    <span className="flex items-center gap-[6px] font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
      <img src={dashIcons.hiddenIdentityLock} alt="" aria-hidden="true" className="size-[16px]" />
      {HIDDEN_HINT.title}
    </span>
    <span className="font-sans text-[12px] leading-[18px] text-[#575755]">{HIDDEN_HINT.body}</span>
    <span className="font-sans text-[12px] leading-[18px] font-medium text-[#2a5730]">
      {HIDDEN_HINT.action}
    </span>
    <button type="button" onClick={onClose} className="sr-only">
      Close
    </button>
  </div>
);

const TalentCard = ({ card, readOnly, saved, hint, onSave, onView, onInvite, onHint }) => (
  <li
    className={classNames(
      'relative flex min-w-0 flex-col gap-[10px] rounded-[16px] border border-solid p-[16px]',
      card.anonymous ? 'bg-[#fffefc]' : 'bg-white',
      hint ? 'border-[#387440] shadow-[0_0_0_1px_#387440]' : 'border-[#e5e8e3]'
    )}
  >
    <div className="flex items-center justify-between gap-[8px]">
      {card.anonymous ? (
        <button
          type="button"
          aria-label="Why is this identity hidden?"
          aria-expanded={hint}
          onClick={() => onHint?.(hint ? '' : card.id)}
          className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#bcb7a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img src={dashIcons.lockHiddenTalent} alt="" className="size-[20px]" />
        </button>
      ) : (
        <span
          aria-hidden="true"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[20px] font-semibold"
          style={{ background: card.bg, color: card.color }}
        >
          {card.initials}
        </span>
      )}
      <Chip tone="mint" icon={dashIcons.sparklesFitChip}>
        {card.fit}
      </Chip>
    </div>
    <div className="flex flex-col">
      <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
        {card.name}
      </span>
      <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
        {card.sub}
      </span>
    </div>
    <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0" aria-label="Why you match">
      {card.why.map((reason) => (
        <li
          key={reason}
          className="rounded-full bg-[#ebf1ec] px-[10px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]"
        >
          {reason}
        </li>
      ))}
    </ul>
    <hr className="m-0 h-px border-0 bg-[#e5e8e3]" />
    <div className="flex items-center gap-[6px]">
      <button
        type="button"
        aria-label={`${saved ? 'Saved' : 'Save'} ${card.name}`}
        aria-pressed={saved}
        onClick={() => onSave?.(card.id)}
        className={classNames(
          'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
          saved ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#dbded9] bg-transparent'
        )}
      >
        <img src={dashIcons.bookmarkSave} alt="" aria-hidden="true" className="size-[16px]" />
      </button>
      <button
        type="button"
        onClick={() => onView?.(card.id)}
        className="inline-flex h-[34px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        {TALENTS.view}
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={() => onInvite?.(card.id)}
        className="inline-flex h-[32px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-0 bg-[#387440] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
      >
        <img src={dashIcons.sendInvite} alt="" aria-hidden="true" className="size-[14px]" />
        {TALENTS.invite}
      </button>
    </div>
    {hint ? <HiddenHint onClose={() => onHint?.('')} /> : null}
  </li>
);

const TalentsWidget = ({
  jobFilter,
  readOnly = false,
  state = '',
  cards = TALENTS.cards,
  savedIds = [],
  hintId = '',
  onSave,
  onView,
  onInvite,
  onHint,
  onRefine,
}) => (
  <WidgetCard
    id="dash-talents"
    radius={16}
    icon={dashIcons.tileRecommendedTalents}
    title={TALENTS.title}
    subtitle={TALENTS.subtitle}
    controls={
      <>
        {jobFilter}
        <Link
          to="/recruiter/talent-search"
          className="inline-flex h-[32px] items-center gap-[3px] rounded-[10px] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {TALENTS.seeAll}
          <img src={dashIcons.arrowRightLink} alt="" aria-hidden="true" className="size-[15px]" />
        </Link>
        {readOnly ? <Chip tone="amber">Read-only</Chip> : null}
      </>
    }
  >
    {state === 'loading' ? (
      <div aria-busy="true" className="flex flex-col gap-[12px]">
        <p role="status" className="sr-only">
          Loading recommended talents…
        </p>
        <div className="grid grid-cols-5 gap-[16px] max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-[10px] rounded-[16px] bg-[linear-gradient(180deg,#f1f3ee,#f7f8f4)] p-[16px]"
            >
              <SkeletonBlock className="size-[44px] rounded-full" />
              <SkeletonBlock className="h-[12px] w-[70%] rounded-[6px]" />
              <SkeletonBlock className="h-[12px] w-[90%] rounded-[6px]" />
              <SkeletonBlock className="mt-[8px] h-[34px] w-full rounded-[10px]" />
            </div>
          ))}
        </div>
      </div>
    ) : state === 'empty' ? (
      <InlineState
        tone="mint"
        icon={dashIcons.emptyNoMatchesSparkles}
        title={TALENT_EMPTY.title}
        actions={
          <button
            type="button"
            onClick={onRefine}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-[8px] whitespace-nowrap max-sm:gap-[6px] max-sm:px-[12px] rounded-[10px] border-0 bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img
              src={dashIcons.emptyEditJobDescriptionsPencil}
              alt=""
              aria-hidden="true"
              className="size-[16px]"
            />
            {TALENT_EMPTY.action}
          </button>
        }
      >
        {TALENT_EMPTY.body}
      </InlineState>
    ) : (
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
            {TALENTS.groupLabel}
          </span>
          <Chip tone="neutral" className="text-[12px]">
            {TALENTS.groupCount}
          </Chip>
        </div>
        <ul className="m-0 grid list-none grid-cols-5 gap-[16px] p-0 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {cards.map((card) => (
            <TalentCard
              key={card.id}
              card={card}
              readOnly={readOnly}
              saved={savedIds.includes(card.id)}
              hint={hintId === card.id}
              onSave={onSave}
              onView={onView}
              onInvite={onInvite}
              onHint={onHint}
            />
          ))}
        </ul>
      </div>
    )}
  </WidgetCard>
);

export default TalentsWidget;
