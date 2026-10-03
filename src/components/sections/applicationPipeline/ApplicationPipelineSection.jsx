import { useEffect, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import ScheduleInterviewModal from './ScheduleInterviewModal.jsx';
import { CriteriaChevronIcon } from '../jobScreening/jobScreeningIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  CHOOSE_POSTING,
  MEETING_TONES,
  COLUMNS,
} from './applicationPipelineData.js';
// Placeholder portraits — Figma embeds its own image fills and no matching
// assets exist yet. Swap for src/assets/applicationPipeline/* when they land.
import avatarEleanor from '../../../assets/community/avatar-roselyn-awinnor.png';
import avatarJulian from '../../../assets/community/avatar-kingsley-smith.png';
import avatarElla from '../../../assets/community/avatar-abigail-mensah.png';

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

// 14x14, stroke #bfbfbf — akar-icons:clock in the profile-card footer.
const ClockIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <circle cx="7" cy="7" r="5.8" stroke="currentColor" strokeWidth="1" />
    <path d="M7 4.1V7l1.75 1.75" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 11.67x11.08, fill #f59e0b — the rating star.
const RatingStar = ({ className = '' }) => (
  <svg viewBox="0 0 12 11" fill="none" aria-hidden="true" className={className}>
    <path
      d="m6 .8 1.6 3.3 3.6.5-2.6 2.5.6 3.6L6 9l-3.2 1.7.6-3.6L.8 4.6l3.6-.5L6 .8Z"
      fill="currentColor"
    />
  </svg>
);

// 16x16, fill #785910 / tone colour — at-icons:video-camera in the status box.
const VideoCameraIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1.4 4.6a1.4 1.4 0 0 1 1.4-1.4h6a1.4 1.4 0 0 1 1.4 1.4v6.8a1.4 1.4 0 0 1-1.4 1.4h-6a1.4 1.4 0 0 1-1.4-1.4V4.6Z"
      fill="currentColor"
    />
    <path d="m11.2 7.4 3.4-2v5.2l-3.4-2V7.4Z" fill="currentColor" />
  </svg>
);

const STATE_BADGES = {
  hourglass: (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-[12px]">
      <path
        d="M2.6 1.2h6.8M2.6 10.8h6.8M3.6 1.2c0 2.4 2.4 3.2 2.4 4.8S3.6 8.4 3.6 10.8M8.4 1.2c0 2.4-2.4 3.2-2.4 4.8s2.4 2.4 2.4 4.8"
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
  alert: <span className="font-sans text-[10px] font-bold leading-[15px] text-white">!</span>,
  check: (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-[12px]">
      <path
        d="m2.6 6.2 2.2 2.2 4.6-4.8"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const ProfileCard = ({ card, onAction }) => (
  <article className="flex flex-col gap-[14px] rounded-[10px] border border-[#00522b]/10 bg-white p-[18px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]">
    {card.avatar && (
      /* Figma 7249:79077 — 40px ring, 1px #e6e2d6, 38px image inside */
      <span className="grid size-[40px] place-items-center rounded-full border border-border-card">
        <img
          src={AVATARS[card.avatar]}
          alt={card.name}
          className="size-[38px] rounded-full object-cover"
        />
      </span>
    )}

    <div className="flex flex-col gap-[14px]">
      <div className="flex flex-col gap-[4px]">
        <h4 className="font-sans text-[16px] font-medium leading-5 text-[#1c1c1a]">{card.name}</h4>
        <p className="font-sans text-[14px] leading-5 tracking-[0.2px] text-neutral-dark-hover">
          {card.meta}
        </p>
      </div>

      {card.tags && (
        <div className="flex flex-wrap items-center gap-[4px]">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-[26px] items-center rounded-[8px] bg-[#f3f8f4] px-[10px] font-sans text-[12px] font-medium leading-[14.32px] text-brand-green-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {card.noteLabel && (
        <div className="flex flex-col gap-[2px] rounded-[8px] bg-brand-green-light px-[10px] py-[8px]">
          <span className="font-sans text-[13px] font-medium text-brand-green-dark">
            {card.noteLabel}
          </span>
          <span className="font-sans text-[13px] text-content-helper">{card.noteValue}</span>
        </div>
      )}

      {(card.time || card.rating) && (
        /* Figma 7249:79088 — 1px #e5e5e5 top rule, pad-top 12, SPACE_BETWEEN */
        <div className="flex items-center justify-between gap-2 border-t border-[#e5e5e5] pt-[12px]">
          <span className="flex items-center gap-[4px]">
            <ClockIcon className="size-[14px] text-[#bfbfbf]" />
            <span className="font-sans text-[13px] leading-[15.51px] tracking-[0.2px] text-[#bfbfbf]">
              {card.time}
            </span>
          </span>
          <span className="flex items-center gap-[4px]">
            <RatingStar className="w-[11.67px] text-[#f59e0b]" />
            <span className="font-sans text-[13px] font-semibold leading-[15px] text-black">
              {card.rating}
            </span>
          </span>
        </div>
      )}

      {card.primaryAction && (
        <button
          type="button"
          onClick={() => onAction(card.id, card.primaryAction)}
          className="inline-flex h-[30px] items-center justify-center rounded-[8px] border-2 border-brand-green-dark bg-brand-green px-[18px] font-sans text-[12px] font-medium leading-[14.32px] tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none"
        >
          {card.primaryAction}
        </button>
      )}
    </div>
  </article>
);

const MeetingCard = ({ card, onAction }) => {
  const tone = MEETING_TONES[card.tone];
  return (
    <article className="relative flex flex-col gap-[14px] rounded-[10px] border border-[#00522b]/10 bg-white p-[18px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]">
      {/* 24px round state badge — Figma 7249:79183 / :79186 / :79216 */}
      <span
        className={classNames(
          'absolute right-[18px] top-[18px] grid size-[24px] place-items-center rounded-full',
          tone.badge
        )}
      >
        {STATE_BADGES[card.badge]}
      </span>

      <div className="flex flex-col gap-[14px] pr-[32px]">
        <div className="flex flex-col gap-[4px]">
          <h4 className="font-sans text-[16px] font-medium leading-[19.09px] text-[#1c1c1a]">
            {card.name}
          </h4>
          <p className="font-sans text-[14px] leading-5 tracking-[0.2px] text-neutral-dark-hover">
            {card.meta}
          </p>
        </div>

        {/* Status box — Figma 7249:79175, r8, 1.21px outline, pad 14/10 */}
        <div
          className={classNames(
            'flex items-center gap-[8px] rounded-[8px] border-[1.21px] px-[14px] py-[10px]',
            tone.box
          )}
        >
          <VideoCameraIcon className={classNames('size-[16px] shrink-0', tone.text)} />
          <span className="flex min-w-0 flex-col gap-[4px]">
            <span
              className={classNames(
                'font-sans text-[13px] font-medium leading-[15.51px]',
                tone.text
              )}
            >
              {card.statusLabel}
            </span>
            <span className="font-sans text-[14px] leading-[16.71px] tracking-[0.2px] text-content-helper">
              {card.platform}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        {card.primaryAction && (
          <button
            type="button"
            onClick={() => onAction(card.id, card.primaryAction)}
            className="inline-flex h-[30px] items-center justify-center rounded-[8px] border-2 border-brand-green-dark bg-brand-green px-[18px] font-sans text-[12px] font-medium leading-[14.32px] tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none"
          >
            {card.primaryAction}
          </button>
        )}
        {card.secondaryAction && (
          /* Figma 7249:79181 — white, 1px #e5e5e5, r8, 12/14.32 #111111 */
          <button
            type="button"
            onClick={() => onAction(card.id, card.secondaryAction)}
            className="inline-flex h-[30px] items-center justify-center rounded-[8px] border border-[#e5e5e5] bg-white px-[18px] font-sans text-[12px] font-medium leading-[14.32px] tracking-[0.1px] text-black transition-colors hover:bg-neutral"
          >
            {card.secondaryAction}
          </button>
        )}
      </div>
    </article>
  );
};

const ApplicationPipelineSection = () => {
  // Figma 7249:80368 et al. open from the Shortlisted card's "Schedule
  // Interview" CTA and from the Interview card's "Reschedule".
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    log('mount', {
      route: '/recruiter/application-pipeline',
      columnCount: COLUMNS.length,
      cardCount: COLUMNS.reduce((n, c) => n + c.cards.length, 0),
    });
  }, []);

  const handleAction = (cardId, action) => {
    if (action === 'Schedule Interview' || action === 'Reschedule') {
      log('branch', { cardId, action, opens: 'ScheduleInterviewModal' });
      setScheduleOpen(true);
      return;
    }
    log('branch', { cardId, action, destination: 'none-in-figma' });
  };

  return (
    <DashboardShell>
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
        <RecruiterPageHeading
          lead={PAGE_HEADING.lead}
          accent={PAGE_HEADING.accent}
          subtitle={PAGE_SUBHEADING}
        />

        <label className="flex w-full max-w-[431px] flex-col gap-[8px]">
          <span className="font-sans text-[14px] font-medium leading-6 tracking-[0.2px] text-black">
            {CHOOSE_POSTING.label}
            <span className="font-display text-[14px] font-semibold not-italic text-[#2e8b57]">
              {CHOOSE_POSTING.required}
            </span>
          </span>
          <button
            type="button"
            onClick={() => log('branch', { action: 'open-posting-select', wired: false })}
            className="flex h-[51px] items-center justify-between gap-[8px] rounded-[10px] border border-[#cccccc] bg-white px-[16px] text-left font-sans text-[14px] font-medium leading-5 tracking-[0.2px] text-[#595959] shadow-[0_2.5px_0_0_#bfbfbf]"
          >
            {CHOOSE_POSTING.value}
            <CriteriaChevronIcon className="size-[20px] shrink-0 text-[#595959]" />
          </button>
        </label>

        {/* Board — Figma 7249:79069, HORIZONTAL gap 16 */}
        <div className="-mx-2 flex items-start gap-[16px] overflow-x-auto px-2 pb-[48px]">
          {COLUMNS.map((column) => (
            <section
              key={column.id}
              className="flex w-[280px] shrink-0 flex-col gap-[16px] rounded-[12px] border border-[#00522b]/10 bg-[#f3f8f4]/28 px-[14px] pb-[24px] pt-[24px]"
            >
              <header className="flex items-center justify-between gap-2">
                {/* Figma textCase: UPPER */}
                <h3 className="font-sans text-[16px] font-semibold uppercase leading-5 text-black">
                  {column.label}
                </h3>
                <span className="inline-flex items-center rounded-pill border-[1.21px] border-border-pill bg-neutral px-[8px] py-[6px] font-sans text-[14px] font-medium leading-[16.71px] text-content-helper">
                  {column.count}
                </span>
              </header>

              <div className="flex flex-col gap-[12px]">
                {column.cards.map((card) =>
                  card.kind === 'meeting' ? (
                    <MeetingCard key={card.id} card={card} onAction={handleAction} />
                  ) : (
                    <ProfileCard key={card.id} card={card} onAction={handleAction} />
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <ScheduleInterviewModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onScheduled={(payload) => log('branch', { scheduled: payload })}
      />
    </DashboardShell>
  );
};

export default ApplicationPipelineSection;
