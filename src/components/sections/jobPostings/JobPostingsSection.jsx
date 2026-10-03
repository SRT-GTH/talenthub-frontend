import { useEffect, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import { SearchIcon } from '../../shared/assets.jsx';
import { TemplateArrowRightIcon } from '../jobTemplates/jobTemplatesIcons.jsx';
import {
  PencilRulerIcon,
  DeveloperBoardIcon,
  HatGraduationIcon,
  LocationPinIcon,
  MeatballMenuIcon,
} from './jobPostingsIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  STATUS_PILLS,
  SEARCH_PLACEHOLDER,
  CREATE_POST_LABEL,
  STAT_LABELS,
  STATUS_STYLES,
  STATUS_ICON_STYLES,
  POSTINGS,
  CARD_MENU_ITEMS,
  CLOSE_CONFIRMATION,
} from './jobPostingsData.js';

const log = debug('JobPostingsSection');

/*
 * JobPostingsSection — the recruiter's own postings list.
 * Source: Figma 7249:75818, canvas 7249:75849.
 *
 * Card anatomy, from a full-depth walk of 7249:75903:
 *   card          432.33x329.59, white, 1px #e6e2d6, r14, pad 22, counter MAX
 *   └ body        VERTICAL gap 18
 *     ├ head      VERTICAL gap 16
 *     │  ├ tile   48x48 #f3f8f4 r8 with a 20px #2a5730 glyph (per card)
 *     │  └ text   VERTICAL gap 12
 *     │     ├ row SPACE_BETWEEN: title 26/33.8 ls -1 Instrument Serif +
 *     │     │     status PILL (r120.5, 1.21px outline)
 *     │     └ row HORIZONTAL gap 6: 18px location pin + location, "•",
 *     │           type, "•", age — all 14px, pin+location #999999
 *     ├ menu      40.75x24.25 WHITE PILL (r100) with three #999999 dots,
 *     │           absolutely placed top-right; opens 7249:76889
 *     └ stats     HORIZONTAL SPACE_BETWEEN, py 18, three 100px columns split
 *                 by 1px #e6e2d6 rules. Labels 14/20 #9a988f; values 25/30
 *                 Instrument Serif — the FIRST is #00522b, the other two #43664d.
 *   └ footer      1px #e6e2d6 top border, pad-top 18, SPACE_BETWEEN:
 *                 action text 14/17.6 #999999 (not a button) + 24px arrow
 */
const CARD_ICONS = {
  'pencil-ruler': PencilRulerIcon,
  'developer-board': DeveloperBoardIcon,
  'hat-graduation': HatGraduationIcon,
};

const PostingCard = ({ posting, openMenuId, onToggleMenu, onMenuItem, onAction }) => {
  const Icon = CARD_ICONS[posting.icon];
  const isMenuOpen = openMenuId === posting.id;

  return (
    <article className="relative flex min-w-0 flex-col justify-between rounded-[14px] border border-border-card bg-white p-[22px]">
      {/* Overflow trigger — Figma 7249:75929: a white PILL, not a circle */}
      <div className="absolute right-[22px] top-[22px]">
        <button
          type="button"
          aria-label={`Options for ${posting.title}`}
          aria-expanded={isMenuOpen}
          onClick={() => onToggleMenu(posting.id)}
          className="flex h-[24.25px] w-[40.75px] items-center justify-center rounded-pill bg-white shadow-[0_1.5px_1px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-neutral"
        >
          <MeatballMenuIcon className="w-[18.75px] text-[#999999]" />
        </button>

        {isMenuOpen && (
          /* Figma 7249:76889 — 160 wide, r12, 0.7px #e5e5e5, 49px rows */
          <div className="absolute right-0 top-[30px] z-20 w-[160px] overflow-hidden rounded-[12px] border-[0.7px] border-[#e5e5e5] bg-white py-[4px] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]">
            {CARD_MENU_ITEMS.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <div className="h-[0.6px] w-full bg-[#e5e5e5]" />}
                <button
                  type="button"
                  onClick={() => onMenuItem(posting.id, item)}
                  className={classNames(
                    'flex h-[49px] w-full items-center px-[16px] text-left font-sans text-[14px] leading-[24.31px] tracking-[0.24px] transition-colors',
                    // Figma highlights one row per menu to show the HOVER state;
                    // all three menus in this file set use #f6f6f6 for it.
                    'hover:bg-[#f6f6f6] active:bg-[#ededed]',
                    item.destructive ? 'text-[#902b20]' : 'text-content-helper'
                  )}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-[16px]">
          <span
            className={classNames(
              'grid size-[48px] place-items-center rounded-[8px]',
              STATUS_ICON_STYLES[posting.status].tile
            )}
          >
            <Icon className={classNames('size-[20px]', STATUS_ICON_STYLES[posting.status].glyph)} />
          </span>

          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between gap-[12px] pr-[48px]">
              <h3 className="font-display text-[26px] not-italic leading-[33.8px] tracking-[-1px] text-black">
                {posting.title}
              </h3>
              <span
                className={classNames(
                  'inline-flex shrink-0 items-center rounded-pill border-[1.21px] px-[9.64px] py-[6px] font-sans text-[14px] font-medium leading-[16.71px]',
                  STATUS_STYLES[posting.status]
                )}
              >
                {posting.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-[6px]">
              <span className="flex items-center gap-[4px]">
                <LocationPinIcon className="size-[18px] shrink-0 text-[#999999]" />
                {/* whitespace-pre-wrap preserves Figma's "Ho,  Ghana" */}
                <span className="whitespace-pre-wrap font-sans text-[14px] leading-[16.71px] text-[#999999]">
                  {posting.location}
                </span>
              </span>
              <span className="font-sans text-[14px] leading-[16.71px] text-content-muted">•</span>
              <span className="font-sans text-[14px] leading-[19.2px] text-content-muted">
                {posting.type}
              </span>
              <span className="font-sans text-[14px] leading-[16.71px] text-content-muted">•</span>
              <span className="font-sans text-[14px] leading-[19.2px] text-content-muted">
                {posting.age}
              </span>
            </div>
          </div>
        </div>

        {/* Stat strip — Figma 7249:75934 */}
        <div className="flex items-stretch justify-between gap-[24px] py-[18px]">
          {[
            { label: STAT_LABELS.totalApplicants, value: posting.totalApplicants, primary: true },
            { label: STAT_LABELS.awaiting, value: posting.awaiting },
            { label: STAT_LABELS.avgMatch, value: posting.avgMatch },
          ].map((stat, index) => (
            <div key={stat.label} className="flex flex-1 items-stretch">
              {index > 0 && <span className="mr-[24px] w-px shrink-0 bg-border-card" />}
              <span className="flex flex-1 flex-col items-center justify-center gap-[6.59px]">
                <span className="font-sans text-[14px] leading-5 tracking-[0.2px] text-content-muted">
                  {stat.label}
                </span>
                <span
                  className={classNames(
                    'font-display text-[25px] not-italic leading-[30px]',
                    stat.primary ? 'text-[#00522b]' : 'text-[#43664d]'
                  )}
                >
                  {stat.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer — Figma 7249:75949: plain text + arrow, not a button */}
      <button
        type="button"
        onClick={() => onAction(posting.id, posting.action)}
        className="flex items-center justify-between gap-3 border-t border-border-card pt-[18px] text-left transition-opacity hover:opacity-80"
      >
        <span className="font-sans text-[14px] leading-[17.6px] text-[#999999]">
          {posting.action}
        </span>
        <TemplateArrowRightIcon className="size-[24px] shrink-0 text-brand-green-dark" />
      </button>
    </article>
  );
};

const JobPostingsSection = () => {
  const [activeStatus, setActiveStatus] = useState(STATUS_PILLS[0].id);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [closingPostingId, setClosingPostingId] = useState(null);

  useEffect(() => {
    log('mount', { route: '/recruiter/job-postings', postingCount: POSTINGS.length });
  }, []);

  const visible =
    activeStatus === 'all'
      ? POSTINGS
      : POSTINGS.filter((p) => p.status.toLowerCase() === activeStatus);

  const handleMenuItem = (postingId, item) => {
    log('branch', { menuItem: item.id, posting: postingId });
    setOpenMenuId(null);
    if (item.id === 'close') setClosingPostingId(postingId);
  };

  return (
    <DashboardShell>
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
        <div className="flex flex-col gap-[16px]">
          <RecruiterPageHeading lead={PAGE_HEADING.lead} subtitle={PAGE_SUBHEADING} />
          <RecruiterJobTabs />
        </div>

        <div className="flex flex-col gap-[32px] pb-[48px]">
          <div className="flex items-center justify-between gap-[28.93px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              {STATUS_PILLS.map((pill) => {
                const isActive = pill.id === activeStatus;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => {
                      log('branch', { statusFilter: pill.id });
                      setActiveStatus(pill.id);
                    }}
                    className={classNames(
                      'inline-flex h-[37px] shrink-0 items-center gap-[4px] rounded-pill border-[1.22px] border-brand-green-light-hover px-[14px]',
                      'font-sans tracking-[0.24px] shadow-[0_1.22px_3.65px_0_rgba(0,0,0,0.08)] transition-all duration-300 ease-in',
                      isActive
                        ? 'bg-brand-green text-[14.59px] font-semibold text-white'
                        : 'bg-white text-[14px] font-medium text-content-helper hover:bg-neutral'
                    )}
                  >
                    {pill.label}
                    {pill.count && <span>{pill.count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Figma 7249:75888 — fixed 362px input + fixed button, gap 19.29,
                never wrapping. */}
            <div className="flex shrink-0 flex-nowrap items-center gap-[19.29px]">
              <label className="flex h-[49px] w-[362px] shrink-0 items-center gap-[9.73px] rounded-[12px] border-[1.22px] border-[#cccccc] bg-white px-[24px] shadow-[0_3.04px_0_0_#bfbfbf] focus-within:border-brand-green">
                <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
                <SearchIcon className="size-[19.45px] shrink-0 text-[#595959]" />
                <input
                  type="search"
                  placeholder={SEARCH_PLACEHOLDER}
                  onChange={(event) => log('search', { length: event.target.value.length })}
                  className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] text-black outline-none placeholder:text-[#999999]"
                />
              </label>
              <button
                type="button"
                onClick={() => log('branch', { action: 'create-post', wired: false })}
                className="inline-flex h-[49px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12.05px] border-[2.41px] border-brand-green-dark bg-brand-green px-[24.11px] font-sans text-[14px] font-medium leading-[16.71px] tracking-[0.12px] text-white shadow-[0_4.82px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4.82px] active:shadow-none"
              >
                {CREATE_POST_LABEL}
              </button>
            </div>
          </div>

          {/* Figma 7249:75902 — HORIZONTAL, gap 16, 3 x 432.33 */}
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-3">
            {visible.map((posting) => (
              <PostingCard
                key={posting.id}
                posting={posting}
                openMenuId={openMenuId}
                onToggleMenu={(id) => setOpenMenuId((prev) => (prev === id ? null : id))}
                onMenuItem={handleMenuItem}
                onAction={(id, action) =>
                  log('branch', { posting: id, action, destination: 'none-in-figma' })
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Close confirmation — Figma 7249:78032 (528x313, r24, pad 48/64) */}
      {closingPostingId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={CLOSE_CONFIRMATION.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setClosingPostingId(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-[528px] flex-col items-center rounded-[24px] bg-white px-[48px] py-[64px] text-center shadow-[0_4px_0_0_rgba(0,0,0,0.04),0_40px_100px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex flex-col items-center gap-[10px]">
              <h2 className="font-display text-[36px] not-italic leading-[46.8px] text-black">
                {CLOSE_CONFIRMATION.title}
              </h2>
              <p className="font-sans text-[16px] leading-6 text-[#575755]">
                {CLOSE_CONFIRMATION.body}
              </p>
            </div>

            <div className="mt-[36px] flex flex-wrap items-center justify-center gap-[8px]">
              <button
                type="button"
                onClick={() => {
                  log('branch', { action: 'confirm-close-posting', posting: closingPostingId });
                  setClosingPostingId(null);
                }}
                className="inline-flex h-[44px] items-center justify-center rounded-[10px] border-2 border-[#73221a] bg-danger px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-white shadow-[0_4px_0_0_#73221a] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
              >
                {CLOSE_CONFIRMATION.confirmLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  log('branch', { action: 'cancel-close-posting' });
                  setClosingPostingId(null);
                }}
                className="inline-flex h-[44px] items-center justify-center rounded-[14px] border-2 border-black bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black shadow-[0_4px_0_0_#111111] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
              >
                {CLOSE_CONFIRMATION.cancelLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default JobPostingsSection;
