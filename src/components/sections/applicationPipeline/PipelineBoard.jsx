import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import PipelineCandidateCard from './PipelineCandidateCard.jsx';
import PipelineMeetingCard from './PipelineMeetingCard.jsx';
import { IN_FLIGHT_CARDS } from './pipelineBoardData.js';
import { formatStageCount } from './pipelineBoardModel.js';
import {
  BulkBarCloseIcon,
  EmptyHiredBadgeIcon,
  PipelineSearchIcon,
  ScrollLinkArrowIcon,
  StageHiredPersonIcon,
  StageInboxIcon,
  StageInterviewCalendarIcon,
  StageNotProgressedIcon,
  StageOfferExtendedIcon,
  StagePipelineIcon,
  StageShortlistedCheckIcon,
} from './pipelineStageIcons.jsx';

const log = debug('PipelineBoard');

/*
 * PipelineBoard — the new Application Pipeline board (Figma page "Recruiter - Application Pipeline", PL-01 10173:11112 and variants):
 * posting select + "Show qualified only (46)" switch + search, the stage chips ("All stages 128", "Applied 3" …, "Scroll for Hired and Not progressed →"),
 * then seven 280px columns (header icon + UPPERCASE label + 29px count pill) and, with a selection, the dark bulk action bar.
 * Presentational: the section owns the URL (see pipelineUrlState.js) and passes `urlState`, `setUrlKeys` and the handlers.
 */
const STAGE_ICONS = {
  inbox: StageInboxIcon,
  pipeline: StagePipelineIcon,
  check: StageShortlistedCheckIcon,
  calendar: StageInterviewCalendarIcon,
  offer: StageOfferExtendedIcon,
  hired: StageHiredPersonIcon,
  'not-progressed': StageNotProgressedIcon,
};

const MEETING_LABELS = {};

const Toggle = ({ on, onClick, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={onClick}
    className="inline-flex min-h-[49px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#dbded9] bg-white px-[16px] py-[8px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
  >
    {label}
    <span
      aria-hidden="true"
      className={classNames(
        'relative ml-[6px] inline-block h-[18px] w-[33px] rounded-[11px] transition-colors',
        on ? 'bg-[#387440]' : 'bg-[#babab7]'
      )}
    >
      <span
        className={classNames(
          'absolute top-[2px] size-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all',
          on ? 'left-[17px]' : 'left-[2px]'
        )}
      />
    </span>
  </button>
);

const StageChip = ({ active, label, count, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-[6px] rounded-full px-[16px] py-[8px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      active
        ? 'border border-solid border-[#2a5730] bg-[#2a5730] text-white'
        : 'border border-solid border-[#dbded9] bg-white text-[#111]'
    )}
  >
    {label}
    <span
      className={classNames('text-[12px] leading-[20px]', active ? 'text-white' : 'text-[#2a5730]')}
    >
      {count}
    </span>
  </button>
);

const PipelineBoard = ({
  board,
  jobSelect,
  urlState,
  setUrlKeys,
  onCardAction,
  onMenuItem,
  onOpenDetails,
  onMove,
  onInvite,
}) => {
  const boardRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [overStage, setOverStage] = useState(null);
  const query = urlState.query.trim().toLowerCase();
  const selected = urlState.selected;
  const ghostId = urlState.drag ?? urlState.justMoved;
  const ghost = ghostId ? IN_FLIGHT_CARDS[ghostId] : null;
  // A dialog open over a selection hides the bar (PL-08, PL-10 draw ticked cards with no bar); the bulk-move prompt (PL-07) keeps it. `selectionBar=hidden` forces it off.
  const barHidden =
    urlState.selectionBarHidden || (Boolean(urlState.modal) && urlState.modal !== 'bulk-move');
  const dropStage = urlState.over ?? overStage;

  useEffect(() => {
    log('mount', { stages: board.stages.length, selected: selected.length, ghost: ghostId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (urlState.scrollEnd && boardRef.current) {
      log('branch', { scroll: 'end' });
      boardRef.current.scrollTo({ left: boardRef.current.scrollWidth, behavior: 'smooth' });
    }
  }, [urlState.scrollEnd]);

  const matches = (card) => {
    if (urlState.qualifiedOnly && !card.qualified) return false;
    if (!query) return true;
    return `${card.name} ${card.role ?? ''}`.toLowerCase().includes(query);
  };

  const chipCount = (stage) => {
    const shown = stage.chipCount ?? stage.count;
    return ghost && ghost.from === stage.id ? shown + 1 : shown;
  };
  const visibleStages = board.stages.filter(
    (stage) => !urlState.stage || urlState.stage === 'all' || urlState.stage === stage.id
  );

  const toggleSelect = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    log('select', { id, count: next.length });
    setUrlKeys({ selected: next.join(',') });
  };

  const stageOfSelection = board.stages.find((stage) =>
    stage.cards.some((card) => card.id === selected[0])
  );

  const renderStage = (stage, stageIndex) => {
    const Icon = STAGE_ICONS[stage.icon];
    const cards = stage.cards.filter(matches);
    const isGhostTarget = ghost && ghost.to === stage.id;
    const isDrop = dropStage === stage.id && (draggingId || urlState.drag);
    const empty = stage.cards.length === 0 && stage.count === 0 && stage.empty && !isGhostTarget;
    return (
      <section
        key={stage.id}
        data-stage={stage.id}
        aria-label={stage.label}
        onDragOver={(event) => {
          if (!draggingId) return;
          event.preventDefault();
          if (overStage !== stage.id) setOverStage(stage.id);
        }}
        onDrop={(event) => {
          if (!draggingId) return;
          event.preventDefault();
          log('drop', { card: draggingId, stage: stage.id });
          onMove(draggingId, stage.id);
          setDraggingId(null);
          setOverStage(null);
        }}
        className={classNames(
          'flex min-h-[638px] w-[280px] shrink-0 flex-col max-lg:w-[min(85vw,360px)] max-lg:snap-start',
          isDrop
            ? 'gap-[10px] rounded-[16px] border-2 border-dashed border-[#387540] bg-[#ebf1ec]/50 p-[12px]'
            : 'gap-[16px] rounded-[12px] border border-[#00522b]/10 bg-[#f3f8f4]/[0.28] px-[14px] pb-[24px] pt-[24px]'
        )}
      >
        <header className="flex items-center justify-between gap-2">
          <h3 className="m-0 flex items-center gap-[6px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111] uppercase">
            {Icon ? <Icon className="size-[20px] shrink-0 text-[#595959]" /> : null}
            {stage.label}
          </h3>
          <span
            className={classNames(
              'inline-flex min-h-[29px] items-center rounded-full px-[8px] py-[6px] font-sans text-[14px] leading-[17px] font-medium text-[#737373]',
              stage.count > 0 || ghost?.to === stage.id
                ? 'border-[1.2px] border-[#00522b]/10 bg-white'
                : ''
            )}
          >
            {formatStageCount(stage.count)}
          </span>
        </header>

        <div
          className={classNames(
            'flex flex-col max-lg:gap-[8px]',
            isDrop ? 'gap-[10px]' : 'gap-[12px]'
          )}
        >
          {cards.map((card) =>
            card.kind === 'meeting' ? (
              <PipelineMeetingCard
                key={card.id}
                secondaryFirst
                card={card}
                labelFor={(action) => MEETING_LABELS[action] ?? action}
                onAction={(c, action) => onCardAction(c, action)}
              />
            ) : (
              <PipelineCandidateCard
                key={card.id}
                card={card}
                stageId={stage.id}
                selected={selected.includes(card.id)}
                menuOpen={urlState.menu === card.id}
                menuItemPinned={urlState.menu === card.id ? urlState.menuItem : null}
                menuAlign={stageIndex >= 4 ? 'right' : 'left'}
                onToggleSelect={toggleSelect}
                onOpenMenu={(id) => setUrlKeys({ menu: id, menuItem: null })}
                onCloseMenu={() => setUrlKeys({ menu: null, menuItem: null })}
                onMenuItem={(c, item) => onMenuItem(c, item, stage.id)}
                onOpenDetails={onOpenDetails}
                onAction={onCardAction}
                onDragStart={(id) => setDraggingId(id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setOverStage(null);
                }}
              />
            )
          )}
          {isGhostTarget ? (
            <PipelineCandidateCard
              key={ghost.card.id}
              card={ghost.card}
              stageId={stage.id}
              ghost
              onAction={onCardAction}
            />
          ) : null}
          {isGhostTarget && ghost.hiddenInTarget ? (
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440]">
              Show {ghost.hiddenInTarget} more
            </span>
          ) : null}
        </div>

        {empty ? (
          <div className="flex flex-col items-center gap-[8px] pt-[24px] text-center">
            <span className="grid size-[44px] place-items-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
              {stage.id === 'hired' ? (
                <EmptyHiredBadgeIcon className="size-[22px]" />
              ) : Icon ? (
                <Icon className="size-[22px]" />
              ) : null}
            </span>
            <p className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
              {stage.empty.title}
            </p>
            <p className="m-0 max-w-[200px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {stage.empty.text}
            </p>
            {stage.empty.action ? (
              <Button variant="primary" size="sm" onClick={onInvite}>
                {stage.empty.action}
              </Button>
            ) : null}
          </div>
        ) : null}
      </section>
    );
  };

  return (
    <>
      <div className="-mt-[5px] flex flex-wrap items-end justify-between gap-x-[24px] gap-y-[16px]">
        <div className="flex w-full max-w-[400px] flex-col gap-[8px] max-lg:max-w-none">
          {jobSelect}
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-[10px] max-lg:w-full">
          <Toggle
            on={urlState.qualifiedOnly}
            label={`Show qualified only (${board.qualifiedCount})`}
            onClick={() => {
              log('qualified toggle', !urlState.qualifiedOnly);
              setUrlKeys({ qualified: urlState.qualifiedOnly ? null : '1' });
            }}
          />
          <label className="flex min-h-[49px] w-[450px] max-w-full items-center gap-[9.7px] rounded-[12px] border-[1.2px] border-solid border-[#ccc] bg-white px-[24px] py-[12px] shadow-[0_3px_0_rgba(0,0,0,0.06)] focus-within:border-[#387440] max-lg:w-full">
            <PipelineSearchIcon className="size-[19px] shrink-0 text-[#595959]" />
            <input
              type="search"
              value={urlState.query}
              onChange={(event) => setUrlKeys({ q: event.target.value })}
              placeholder="Search candidates in this pipeline"
              aria-label="Search candidates in this pipeline"
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14.5px] leading-[24px] tracking-[0.24px] text-[#111] outline-none placeholder:text-[#999]"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px] max-lg:flex-col max-lg:flex-nowrap max-lg:items-stretch">
        <div
          role="group"
          aria-label="Filter by stage"
          className="no-scrollbar flex gap-[8px] max-lg:overflow-x-auto max-lg:pb-[4px] lg:flex-wrap"
        >
          <StageChip
            active={!urlState.stage || urlState.stage === 'all'}
            label="All stages"
            count={board.totalCandidates}
            onClick={() => setUrlKeys({ stage: null })}
          />
          {board.stages.map((stage) => (
            <StageChip
              key={stage.id}
              active={urlState.stage === stage.id}
              label={stage.label}
              count={chipCount(stage)}
              onClick={() => setUrlKeys({ stage: stage.id })}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            log('scroll to end');
            setUrlKeys({ stage: null, scroll: 'end' });
            boardRef.current?.scrollTo({ left: boardRef.current.scrollWidth, behavior: 'smooth' });
          }}
          className="inline-flex min-h-[24px] shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-brand-green max-lg:hidden"
        >
          Scroll for Hired and Not progressed
          <ScrollLinkArrowIcon className="size-[16px]" />
        </button>
      </div>

      <div
        ref={boardRef}
        className="relative -mx-2 flex items-stretch gap-[16px] overflow-x-auto px-2 pb-[16px] max-lg:-mx-4 max-lg:snap-x max-lg:snap-mandatory max-lg:px-4 max-lg:scroll-px-4"
      >
        {visibleStages.map((stage) => renderStage(stage, board.stages.indexOf(stage)))}
      </div>

      {selected.length > 0 && !barHidden ? (
        <div className="pointer-events-none sticky bottom-[-32px] z-40 -mt-[44px] max-lg:bottom-[-88px] max-md:bottom-[-64px] flex h-0 justify-center overflow-visible">
          <div
            role="toolbar"
            aria-label="Bulk actions"
            className="pointer-events-auto absolute bottom-0 flex w-max max-w-full flex-wrap items-center gap-[12px] rounded-[16px] bg-[#111] px-[20px] py-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_12px_28px_rgba(0,0,0,0.2)]"
          >
            <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-white">
              {selected.length} selected
            </span>
            {stageOfSelection ? (
              <button
                type="button"
                className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#ebf1ec] focus-visible:outline-2 focus-visible:outline-white"
                onClick={() => log('select all in stage', stageOfSelection.id)}
              >
                Select all {stageOfSelection.selectAllCount ?? stageOfSelection.count} in{' '}
                {stageOfSelection.label}
              </button>
            ) : null}
            <span className="ml-auto flex flex-wrap items-center gap-[12px]">
              <Button
                variant="tertiary"
                size="lg"
                className="!h-[40px] !py-0"
                onClick={() => onCardAction(null, 'bulk-message', selected)}
              >
                Message
              </Button>
              <Button
                variant="tertiary"
                size="lg"
                className="!h-[40px] !py-0"
                onClick={() => onCardAction(null, 'bulk-not-progressing', selected)}
              >
                Not progressing
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="!h-[40px] !py-0"
                onClick={() => onCardAction(null, 'bulk-move', selected)}
              >
                Move to…
              </Button>
              <button
                type="button"
                aria-label="Clear selection"
                onClick={() => setUrlKeys({ selected: null })}
                className="grid size-[24px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-[#babab7] focus-visible:outline-2 focus-visible:outline-white"
              >
                <BulkBarCloseIcon className="size-[16px]" />
              </button>
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PipelineBoard;
