import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import WorkspaceSidebar from '../recruiterDashboard/WorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import BannerToast from '../../ui/BannerToast.jsx';
import { HANDOFF_TOAST } from '../jobScreening/screeningFlowData.js';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import PipelineMeetingCard, { SecondaryButton } from './PipelineMeetingCard.jsx';
import PipelineBoard from './PipelineBoard.jsx';
import PipelineActionLayer from './actions/PipelineActionLayer.jsx';
import { ACTION_SCENARIOS } from './actions/pipelineActionScenarios.js';
import { BASE_BOARD, EMPTY_BOARD } from './pipelineBoardData.js';
import { moveCard } from './pipelineBoardModel.js';
import ScheduleInterviewModal from './ScheduleInterviewModal.jsx';
import InterviewConfirmModal from './InterviewConfirmModal.jsx';
import ScheduleSelect from './ScheduleSelect.jsx';
import { useLivePipeline } from './useLivePipeline.js';
import { ACTION_LABELS, ACTION_STAGE, buildPipelineColumns, candidateFor } from './pipelineLive.js';
import { pipelineErrorText } from '../../../services/recruiterPipeline.api.js';
import { CandidateClockIcon, CandidateRatingStarIcon } from './pipelineBoardIcons.jsx';
import {
  PIPELINE_URL_KEYS,
  SCHEDULE_MODAL_VALUES,
  readPipelineUrlState,
} from './pipelineUrlState.js';
import TagRow from '../../ui/TagRow.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  CHOOSE_POSTING,
  COLUMNS,
  JOB_POSTING_OPTIONS,
} from './applicationPipelineData.js';
// Figma image fills, exported from V2.0 frame 7249:79474.
import avatarEleanor from '../../../assets/recruiter/application-pipeline/candidate-avatar-eleanor-fant.png';
import avatarJulian from '../../../assets/recruiter/application-pipeline/candidate-avatar-julian-reed.png';
import avatarElla from '../../../assets/recruiter/application-pipeline/candidate-avatar-ella-mensah.png';

const log = debug('ApplicationPipelineSection');

const AVATARS = { eleanor: avatarEleanor, julian: avatarJulian, ella: avatarElla };

/*
 * ApplicationPipelineSection — the recruiter's hiring kanban.
 * Source: Figma 7249:79017, board 7249:79069.
 *
 * Columns: 280 wide, #f3f8f4 at 28% FILL alpha (fill-level, so the cards
 * inside stay opaque), r12, gap 16, pad 14 / top 24.
 *
 * BORDERS: the columns AND the cards carry a 1px #00522b stroke at **opacity
 * 0.10** — barely visible, which is the point. Rendering it at full strength
 * (the first pass) drew a hard green outline round every column. Read the
 * stroke PAINT's opacity, not just its colour.
 *
 * Header is SPACE_BETWEEN: a 16/20 semibold UPPER-cased label and a 29x29
 * count pill that is #f8f8f4 on a 1.21px #e8e8e4 outline (r120.5) — not white
 * on green — with a 14/16.7 #737373 label.
 *
 * Cards come in two shapes — see applicationPipelineData.js. Seven columns at
 * 280 + 16 gap run to 2056px against a 1329px canvas, so the board scrolls.
 */

const actionLabel = (action) => ACTION_LABELS[action] || action;

// Live-only confirmations for actions that change things for the candidate.
const CONFIRM_COPY = {
  reject: {
    title: 'Reject this candidate?',
    body: 'They get a kind note with skills to work on. You can’t undo this from the board.',
    confirmLabel: 'Yes, reject',
    cancelLabel: 'Keep',
    tone: 'danger',
  },
  complete: {
    title: 'Mark as completed?',
    body: 'The interview is recorded as done, so you can move on to an offer.',
    confirmLabel: 'Mark completed',
    cancelLabel: 'Not yet',
    tone: 'brand',
  },
  'cancel-interview': {
    title: 'Cancel this interview?',
    body: 'The candidate is told it’s cancelled. Their application stays open.',
    confirmLabel: 'Yes, cancel interview',
    cancelLabel: 'Keep it',
    tone: 'danger',
  },
};

const ProfileCard = ({ card, onAction }) => (
  <article className="relative flex flex-col gap-[14px] max-lg:gap-[8px] rounded-[10px] border border-[#00522b]/10 bg-white p-[18px] max-lg:p-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]">
    {card.avatar && (
      /* Figma 7249:79077 — 40px ring, 1px #e6e2d6, 38px image inside */
      <span className="grid size-[40px] place-items-center rounded-full border border-border-card max-lg:absolute max-lg:right-[12px] max-lg:top-[12px] max-lg:size-[36px]">
        <img
          src={AVATARS[card.avatar]}
          alt={card.name}
          className="size-[38px] max-lg:size-[32px] rounded-full object-cover"
        />
      </span>
    )}

    <div className="flex flex-col gap-[14px] max-lg:gap-[8px]">
      <div className="flex flex-col gap-[4px] max-lg:gap-0 max-lg:pr-[44px]">
        <h4 className="font-sans text-[16px] max-lg:text-[15px] font-medium leading-5 text-[#1c1c1a]">
          {card.name}
        </h4>
        <p className="font-sans text-[14px] max-lg:text-[13px] leading-5 tracking-[0.2px] text-neutral-dark-hover">
          {card.meta}
        </p>
      </div>

      {card.tags && (
        <TagRow
          items={card.tags}
          gap={4}
          className="items-center"
          renderItem={(tag) => (
            <span
              key={tag}
              className="inline-flex h-[26px] max-lg:h-[24px] items-center rounded-[8px] bg-[#f3f8f4] px-[10px] font-sans text-[12px] font-medium leading-[14.32px] text-brand-green-dark"
            >
              {tag}
            </span>
          )}
        />
      )}

      {card.noteLabel && (
        <div className="flex flex-col gap-[2px] rounded-[8px] bg-brand-green-light px-[10px] py-[8px] max-lg:py-[6px]">
          <span className="font-sans text-[13px] font-medium text-brand-green-dark">
            {card.noteLabel}
          </span>
          <span className="font-sans text-[13px] text-content-helper">{card.noteValue}</span>
        </div>
      )}

      {(card.time || card.rating) && (
        /* Figma 7249:79088 — 1px #e5e5e5 top rule, pad-top 12, SPACE_BETWEEN */
        <div className="flex items-center justify-between gap-2 border-t border-[#e5e5e5] pt-[12px] max-lg:pt-[8px]">
          <span className="flex items-center gap-[4px]">
            <CandidateClockIcon className="size-[14px] text-[#bfbfbf]" />
            <span className="font-sans text-[13px] leading-[15.51px] tracking-[0.2px] text-[#bfbfbf]">
              {card.time}
            </span>
          </span>
          {card.rating ? (
            <span className="flex items-center gap-[4px]">
              <CandidateRatingStarIcon className="size-[12px] text-[#f59e0b]" />
              <span className="font-sans text-[13px] font-semibold leading-[15px] text-black">
                {card.rating}
              </span>
            </span>
          ) : null}
        </div>
      )}

      {card.primaryAction && (
        <button
          type="button"
          onClick={() => onAction(card, card.primaryAction)}
          className="inline-flex relative h-[30px] max-lg:h-[36px] items-center justify-center whitespace-nowrap rounded-[8px] max-lg:after:absolute max-lg:after:-inset-x-0 max-lg:after:-inset-y-[4px] border-2 border-brand-green-dark bg-brand-green px-[18px] font-sans text-[12px] max-lg:text-[13px] font-medium leading-[14.32px] tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] max-lg:shadow-none transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] max-lg:active:translate-y-0 active:shadow-none"
        >
          {actionLabel(card.primaryAction)}
        </button>
      )}
      <SecondaryButton card={card} onAction={onAction} labelFor={actionLabel} />
    </div>
  </article>
);

const jobIdOf = (j) => String(j?._id || j?.id || '');

const ApplicationPipelineSection = () => {
  // URL state (see the key list at the top of pipelineUrlState.js): the schedule
  // modal, its confirmations, the job-posting dropdown and its hover are all
  // addressable, so every Figma frame can be opened by link.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlState = readPipelineUrlState(searchParams);
  // Screening hand-off (Figma JS-11 10117:68136): /recruiter/application-pipeline?handoff=46 — the toast "Success - 46 applicants moved to Screening" over the
  // workspace sidebar. Only with this key the page draws that sidebar and SF Pro Rounded; without it every other pipeline frame is unchanged.
  const handoff = searchParams.get('handoff');
  const pipe = useLivePipeline();
  const isLive = pipe.status !== 'demo';
  // The legacy board (older design, frames 7249:*) stays for the `sidebar=collapsed` schedule frames, the screening hand-off and signed-in data; every other demo URL is the new board.
  const legacy = isLive || urlState.sidebarCollapsed || handoff !== null;
  useScopedRoundedFont('data-recruiter-ui', handoff !== null || !legacy);
  const navigate = useNavigate();
  // Several writes can land in one tick (e.g. pick an option, then close the list), and
  // react-router's updater only sees the URL of the last render, so keep the newest params here.
  const latestParamsRef = useRef(searchParams);
  latestParamsRef.current = searchParams;
  const setUrlKeys = (changes) => {
    log('url', changes);
    const next = new URLSearchParams(latestParamsRef.current);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') next.delete(key);
      else next.set(key, value);
    });
    latestParamsRef.current = next;
    setSearchParams(next);
  };
  // Live: which application the modal is for, and a pending confirmation.
  const [scheduleFor, setScheduleFor] = useState(null);
  const [pending, setPending] = useState(null); // { card, action }
  const [error, setError] = useState(null);
  const selectedJob = pipe.jobs.find((j) => jobIdOf(j) === pipe.jobId) || null;
  // Signed in, the board never shows the Figma demo people — empty columns while loading.
  const columns = isLive
    ? buildPipelineColumns(COLUMNS, pipe.status === 'live' ? pipe.applications : [], pipe.jobId)
    : COLUMNS;
  // Unique option labels for the posting select (titles can repeat).
  const jobOptions = pipe.jobs.map((j, i) => {
    const title = j.title || 'Untitled posting';
    const dup = pipe.jobs.findIndex((x) => (x.title || 'Untitled posting') === title) !== i;
    return { id: jobIdOf(j), label: dup ? `${title} (${i + 1})` : title };
  });

  // Below lg the board is a scroll-snap strip (one column ~85vw) and the stage
  // chips above it are a jump nav. `activeStageId` follows the snapped column.
  const boardRef = useRef(null);
  const chipRowRef = useRef(null);
  const [activeStageId, setActiveStageId] = useState(COLUMNS[0].id);

  const getColumnEls = () => Array.from(boardRef.current?.querySelectorAll('[data-stage]') ?? []);

  const jumpToStage = (id) => {
    const board = boardRef.current;
    const target = getColumnEls().find((el) => el.dataset.stage === id);
    if (!board || !target) return;
    log('branch', { jumpToStage: id });
    setActiveStageId(id);
    board.scrollTo({ left: target.offsetLeft - 16, behavior: 'smooth' });
  };

  const handleBoardScroll = () => {
    const board = boardRef.current;
    if (!board) return;
    // The column whose left edge is nearest the strip's left edge is "current".
    const probe = board.scrollLeft + 16;
    let nearest = getColumnEls()[0];
    getColumnEls().forEach((el) => {
      if (Math.abs(el.offsetLeft - probe) < Math.abs(nearest.offsetLeft - probe)) nearest = el;
    });
    if (nearest && nearest.dataset.stage !== activeStageId) setActiveStageId(nearest.dataset.stage);
  };

  // Keep the active chip visible in its own scrolling row.
  useEffect(() => {
    const row = chipRowRef.current;
    const chip = row?.querySelector('[aria-current="true"]');
    if (!row || !chip) return;
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, [activeStageId]);

  useEffect(() => {
    log('url state', urlState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    log('mount', {
      route: '/recruiter/application-pipeline',
      columnCount: COLUMNS.length,
      cardCount: COLUMNS.reduce((n, c) => n + c.cards.length, 0),
    });
  }, []);

  const runLive = (promise) =>
    promise
      .then(() => setError(null))
      .catch((err) => {
        log.error('pipeline action failed:', err?.response?.status || err?.message);
        setError(pipelineErrorText(err));
      });

  const handleAction = (card, action) => {
    if (!isLive) {
      if (action === 'Schedule Interview' || action === 'Reschedule') {
        log('branch', { cardId: card.id, action, opens: 'ScheduleInterviewModal' });
        setUrlKeys({ [PIPELINE_URL_KEYS.modal]: 'schedule-interview' });
        return;
      }
      log('branch', { cardId: card.id, action, destination: 'none-in-figma' });
      return;
    }
    log('live action', { app: card.applicationId, action });
    if (action === 'schedule' || action === 'reschedule') {
      setScheduleFor(card.applicationId);
      setUrlKeys({ [PIPELINE_URL_KEYS.modal]: 'schedule-interview' });
      return;
    }
    if (CONFIRM_COPY[action]) {
      setPending({ card, action });
      return;
    }
    if (ACTION_STAGE[action]) runLive(pipe.move(card.applicationId, ACTION_STAGE[action]));
  };

  const confirmPending = () => {
    const { card, action } = pending;
    setPending(null);
    if (action === 'cancel-interview') runLive(pipe.cancelInterview(card.applicationId));
    else runLive(pipe.move(card.applicationId, ACTION_STAGE[action]));
  };

  const scheduleApp = pipe.applications.find((a) => String(a._id) === scheduleFor) || null;
  const scheduleModalActive = SCHEDULE_MODAL_VALUES.includes(urlState.modal);
  // Live deep links have no application to schedule, so the modal only opens in demo or with one chosen.
  const scheduleOpen = scheduleModalActive && (!isLive || Boolean(scheduleApp));
  const scheduleConfirm =
    urlState.modal === 'cancel-interview'
      ? 'cancel'
      : urlState.modal === 'schedule-confirmation'
        ? 'schedule'
        : null;
  const closeScheduleModal = () => {
    setScheduleFor(null);
    setUrlKeys({
      [PIPELINE_URL_KEYS.modal]: null,
      [PIPELINE_URL_KEYS.state]: null,
      [PIPELINE_URL_KEYS.format]: null,
      [PIPELINE_URL_KEYS.interviewers]: null,
    });
  };
  const postingOption =
    JOB_POSTING_OPTIONS.find((o) => o.id === urlState.posting) || JOB_POSTING_OPTIONS[1];
  const forceHoverOption = JOB_POSTING_OPTIONS.find((o) => o.id === urlState.forceHover);

  // New board data: base (or empty) board, then the `moved` URL pairs, then the action scenario (ACTIONS agent). Unknown scenario keys change nothing.
  const baseBoard = urlState.pipelineEmpty ? EMPTY_BOARD : BASE_BOARD;
  const movedBoard = urlState.moved.reduce((acc, [id, to]) => moveCard(acc, id, to), baseBoard);
  const scenario = urlState.scenario ? ACTION_SCENARIOS[urlState.scenario] : null;
  const board = scenario ? scenario(movedBoard) : movedBoard;

  const moveCardTo = (cardId, toStage) => {
    const found = board.stages.find((st) => st.cards.some((c) => c.id === cardId));
    if (!found || found.id === toStage) return;
    log('move', { cardId, from: found.id, to: toStage });
    const moved = [...urlState.moved.map((pair) => pair.join(':')), `${cardId}:${toStage}`].join(
      ','
    );
    setUrlKeys({
      moved,
      modal: 'move-notify',
      candidate: cardId,
      from: found.id,
      to: toStage,
      menu: null,
      menuItem: null,
    });
  };

  const handleBoardAction = (card, action, ids) => {
    log('board action', { card: card?.id, action, ids });
    if (action === 'schedule-interview' || action === 'Reschedule') {
      setUrlKeys({ modal: 'schedule-interview', candidate: card.id });
    } else if (action === 'Mark as Completed') {
      setUrlKeys({ modal: 'interview-completed', candidate: card.id });
    } else if (action === 'View Details' || action === 'View Meeting') {
      setUrlKeys({ drawer: card.id });
    } else if (action === 'bulk-move') {
      setUrlKeys({ modal: 'bulk-move', candidate: ids.join(',') });
    } else if (action === 'bulk-not-progressing') {
      setUrlKeys({ modal: 'not-progressing', candidate: ids.join(',') });
    } else if (action === 'bulk-message') {
      navigate('/recruiter/messages');
    }
  };

  const handleBoardMenuItem = (card, row) => {
    log('menu item', { card: card.id, item: row.id });
    setUrlKeys({ menu: null, menuItem: null });
    if (row.id === 'view-profile' || row.id === 'open-application') {
      setUrlKeys({ drawer: card.id });
    } else if (row.id === 'message') navigate('/recruiter/messages');
    else if (row.moveTo) moveCardTo(card.id, row.moveTo);
    else if (row.id === 'schedule-interview') {
      setUrlKeys({ modal: 'schedule-interview', candidate: card.id });
    } else if (row.id === 'not-progressing') {
      setUrlKeys({ modal: 'not-progressing', candidate: card.id });
    }
  };

  const postingField = (
    <>
      <span
        className={classNames(
          'font-sans text-[16px] font-medium leading-7 tracking-[0.2px] text-[#1c2a21]',
          !legacy && 'block h-[21px] -translate-y-[4px]'
        )}
      >
        {CHOOSE_POSTING.label}
        <span className="font-display text-[14px] font-semibold not-italic text-[#2e8b57]">
          {CHOOSE_POSTING.required}
        </span>
      </span>
      {isLive ? (
        <ScheduleSelect
          label={CHOOSE_POSTING.label}
          options={jobOptions.map((o) => o.label)}
          value={jobOptions.find((o) => o.id === pipe.jobId)?.label ?? null}
          placeholder={pipe.status === 'loading' ? 'Loading your postings…' : 'No postings yet'}
          onChange={(label) => {
            const next = jobOptions.find((o) => o.label === label);
            log('branch', { posting: next?.id });
            if (next) pipe.setJobId(next.id);
          }}
        />
      ) : (
        <ScheduleSelect
          label={CHOOSE_POSTING.label}
          menuVariant="centered"
          options={JOB_POSTING_OPTIONS.map((o) => o.label)}
          value={postingOption.label}
          open={urlState.dropdownOpen}
          onOpenChange={(next) =>
            setUrlKeys({
              [PIPELINE_URL_KEYS.dropdown]: next ? 'job-posting' : null,
              ...(next ? {} : { [PIPELINE_URL_KEYS.forceHover]: null }),
            })
          }
          pinnedHoverValue={forceHoverOption?.label}
          onChange={(label) => {
            const next = JOB_POSTING_OPTIONS.find((o) => o.label === label);
            log('branch', { demoPosting: next?.id });
            if (next) setUrlKeys({ [PIPELINE_URL_KEYS.posting]: next.id });
          }}
        />
      )}
    </>
  );

  return (
    <DashboardShell
      defaultSidebarCollapsed={urlState.sidebarCollapsed}
      renderSidebar={
        legacy && handoff === null
          ? undefined
          : ({ collapsed, onToggle }) =>
              collapsed ? null : <WorkspaceSidebar onToggle={onToggle} showSettings={!legacy} />
      }
    >
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        <RecruiterPageHeading
          titleStyle="sans-accent"
          lead={PAGE_HEADING.lead}
          accent={PAGE_HEADING.accent}
          subtitle={PAGE_SUBHEADING}
        />

        {legacy ? (
          <div className="flex w-full max-w-[431px] flex-col gap-[8px]">{postingField}</div>
        ) : null}

        {pipe.status === 'error' ? (
          <p
            role="alert"
            className="m-0 flex items-center gap-[12px] font-sans text-[14px] text-[#b42318]"
          >
            We couldn’t load your pipeline.
            <button
              type="button"
              onClick={pipe.retry}
              className="cursor-pointer rounded-[8px] border border-[#e5e5e5] bg-white px-[12px] py-[4px] font-sans text-[13px] font-medium text-black"
            >
              Try again
            </button>
          </p>
        ) : null}
        {pipe.status === 'live' && !pipe.jobs.length ? (
          <p className="m-0 font-sans text-[14px] text-content-helper">
            Post a job and its applications will show up here.
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
            {error}
          </p>
        ) : null}

        {legacy ? (
          <>
            {/* Stage jump nav — below lg only. Sticky under the top bar while the page scrolls. */}
            <nav
              aria-label="Pipeline stages"
              className="sticky top-0 z-20 -mx-4 -mb-[12px] border-b border-border-card bg-white/95 backdrop-blur lg:hidden"
            >
              <div
                ref={chipRowRef}
                className="no-scrollbar flex gap-[8px] overflow-x-auto px-4 py-[8px] [mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)]"
              >
                {columns.map((column) => {
                  const isActive = column.id === activeStageId;
                  return (
                    <button
                      key={column.id}
                      type="button"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => jumpToStage(column.id)}
                      className={classNames(
                        'relative inline-flex h-[30px] shrink-0 items-center gap-[6px] rounded-pill border-[1.22px] px-[12px] font-sans text-[13px] transition-colors after:absolute after:-inset-y-[7px] after:inset-x-0',
                        isActive
                          ? 'border-brand-green bg-brand-green font-semibold text-white'
                          : 'border-brand-green-light-hover bg-white font-medium text-content-helper'
                      )}
                    >
                      {column.label}
                      <span className={isActive ? 'text-white/80' : 'text-content-muted'}>
                        {column.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Board — Figma 7249:79069, HORIZONTAL gap 16. Below lg: scroll-snap strip. */}
            <div
              ref={boardRef}
              onScroll={handleBoardScroll}
              className="relative -mx-2 flex items-start gap-[16px] overflow-x-auto px-2 pb-[48px] max-lg:-mx-4 max-lg:snap-x max-lg:snap-mandatory max-lg:px-4 max-lg:scroll-px-4"
            >
              {columns.map((column) => (
                <section
                  key={column.id}
                  data-stage={column.id}
                  className="flex w-[280px] shrink-0 flex-col gap-[16px] rounded-[12px] max-lg:w-[min(85vw,360px)] max-lg:snap-start border border-[#00522b]/10 bg-[#f3f8f4]/28 px-[14px] pb-[24px] pt-[24px] max-lg:gap-[8px] max-lg:border-0 max-lg:bg-transparent max-lg:px-0 max-lg:pb-[12px] max-lg:pt-[4px]"
                >
                  <header className="flex items-center justify-between gap-2">
                    {/* Figma textCase: UPPER */}
                    <h3 className="font-sans text-[16px] max-lg:text-[14px] font-semibold uppercase leading-5 text-[#1c2a21]">
                      {column.label}
                    </h3>
                    <span className="inline-flex items-center rounded-pill border-[1.21px] border-border-pill bg-neutral px-[8px] py-[6px] max-lg:py-[2px] font-sans text-[14px] max-lg:text-[12px] font-medium leading-[16.71px] text-content-helper">
                      {column.count}
                    </span>
                  </header>

                  <div className="flex flex-col gap-[12px] max-lg:gap-[8px]">
                    {column.cards.map((card) =>
                      card.kind === 'meeting' ? (
                        <PipelineMeetingCard
                          key={card.id}
                          card={card}
                          onAction={handleAction}
                          labelFor={actionLabel}
                        />
                      ) : (
                        <ProfileCard key={card.id} card={card} onAction={handleAction} />
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <PipelineBoard
            board={board}
            jobSelect={postingField}
            urlState={urlState}
            setUrlKeys={setUrlKeys}
            onCardAction={handleBoardAction}
            onMenuItem={handleBoardMenuItem}
            onOpenDetails={(id) => setUrlKeys({ drawer: id })}
            onMove={moveCardTo}
            onInvite={() => navigate('/recruiter/talent-search')}
          />
        )}
      </div>

      <ScheduleInterviewModal
        open={scheduleOpen}
        confirm={scheduleConfirm}
        onConfirmChange={(next) =>
          setUrlKeys({
            [PIPELINE_URL_KEYS.modal]:
              next === 'cancel'
                ? 'cancel-interview'
                : next === 'schedule'
                  ? 'schedule-confirmation'
                  : 'schedule-interview',
          })
        }
        seed={{
          state: urlState.scheduleState,
          format: urlState.scheduleFormat,
          interviewersOpen: urlState.interviewersOpen,
        }}
        onClose={closeScheduleModal}
        onScheduled={(payload) => log('branch', { scheduled: payload })}
        {...(isLive && scheduleApp
          ? {
              live: true,
              jobTitle: selectedJob?.title || scheduleApp.resourceTitle,
              candidate: candidateFor(scheduleApp, selectedJob?.title || scheduleApp.resourceTitle),
              onSubmit: (body) => pipe.schedule(scheduleApp._id, body),
              errorText: pipelineErrorText,
            }
          : {})}
      />

      {isLive ? null : <PipelineActionLayer board={board} />}

      <InterviewConfirmModal
        open={Boolean(pending)}
        copy={pending ? CONFIRM_COPY[pending.action] : CONFIRM_COPY.reject}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
      {handoff !== null ? (
        <BannerToast
          tone="success"
          title={HANDOFF_TOAST.title(handoff)}
          message={HANDOFF_TOAST.message}
          actionLabel={HANDOFF_TOAST.action}
          onClose={() => setUrlKeys({ handoff: null })}
          duration={0}
          placement="fixed top-[22px] left-1/2 z-[70] w-max max-w-[calc(100vw-32px)] -translate-x-1/2 max-md:top-[72px]"
        />
      ) : null}
    </DashboardShell>
  );
};

export default ApplicationPipelineSection;
