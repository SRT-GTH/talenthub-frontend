import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import BannerToast from '../../ui/BannerToast.jsx';
import PostingManageMenu from '../recruiterJobs/PostingManageMenu.jsx';
import {
  CloseWithMessageDialog,
  DeleteDraftDialog,
  DuplicateDialog,
  PauseDialog,
} from '../recruiterJobs/postingActionDialogs.jsx';
import { PublishedDialog } from '../recruiterJobs/jobFlowDialogs.jsx';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../recruiterDashboard/renderWorkspaceSidebar.jsx';
import { useRecruiterHelpPanels } from '../recruiterSettings/help/useRecruiterHelpPanels.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import RecruiterListToolbar from '../recruiterShared/RecruiterListToolbar.jsx';
import { TemplateArrowRightIcon } from '../jobTemplates/jobTemplatesIcons.jsx';
import {
  PencilRulerIcon,
  DeveloperBoardIcon,
  HatGraduationIcon,
  LocationPinIcon,
  MeatballMenuIcon,
  PostingPencilIcon,
} from './jobPostingsIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  STATUS_PILLS,
  STATUS_FILTER_IDS,
  FILTER_SUMMARY,
  SEARCH_PLACEHOLDER,
  CREATE_POST_LABEL,
  STAT_LABELS,
  STATUS_STYLES,
  STATUS_ICON_STYLES,
  POSTINGS,
  CARD_MENU_ITEMS,
  CLOSE_CONFIRMATION,
  NEW_POSTING,
  DELETE_BLOCKED_NOTE,
  POSTING_TOASTS,
} from './jobPostingsData.js';

const log = debug('JobPostingsSection');

/*
 * URL state (route /recruiter/job-postings) — every Figma frame is reachable:
 *   (none)                                         7249:75818  All
 *   ?status=draft                                  7249:76277  Draft (also active | closed)
 *   ?menu=senior-ux-designer                       7249:76638  Post Card - Menu
 *   ?menu=senior-ux-designer&menuItem=duplicate    7249:77110  Menu Item Hover (pins the hover
 *                                                  fill; real :hover also works) — edit | duplicate | close
 *   ?modal=close-posting&posting=senior-ux-designer 7249:77582 Closing Post Confirmation
 * Clicking the filter pills, the card "..." trigger, the "Close posting" item and the dialog
 * buttons writes / clears the same keys, so reload, deep-link and back all work.
 */

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

const PostingCard = ({
  posting,
  isMenuOpen,
  forcedHoverItemId,
  manageMenu,
  onManageAction,
  onToggleMenu,
  onMenuItem,
  onAction,
}) => {
  const Icon = CARD_ICONS[posting.icon];

  return (
    <article
      className={classNames(
        'relative flex min-w-0 flex-col justify-between rounded-[14px] border bg-white p-[22px] max-sm:p-[14px]',
        posting.isNew ? 'border-2 border-[#387440]' : 'border-border-card'
      )}
    >
      {/* Overflow trigger — Figma 7249:75929: a white PILL sitting on the card corner (7px above, 4px past the edge) */}
      <div className="absolute -right-[5px] -top-[8px] z-10 max-sm:right-[10px] max-sm:top-[12px]">
        <button
          type="button"
          aria-label={`Options for ${posting.title}`}
          aria-expanded={isMenuOpen}
          onClick={() => onToggleMenu(posting.id)}
          /* Below lg an invisible ::after grows the hit area to ~60x44 without changing the pill. */
          className="flex h-[24.25px] w-[40.75px] items-center justify-center rounded-pill bg-white text-[#999999] shadow-[0_1.5px_1px_0_rgba(0,0,0,0.16)] transition-colors hover:bg-neutral max-lg:relative max-lg:after:absolute max-lg:after:-inset-x-[10px] max-lg:after:-inset-y-[10px]"
        >
          <MeatballMenuIcon className="w-[21px]" />
        </button>

        {isMenuOpen && manageMenu ? (
          <PostingManageMenu
            hoverId={forcedHoverItemId}
            deleteDisabledReason={DELETE_BLOCKED_NOTE}
            onAction={(id) => onManageAction(posting.id, id)}
          />
        ) : null}
        {isMenuOpen && !manageMenu && (
          /* Figma 7249:76889 — 160 wide, r12, 0.7px #e5e5e5, 49px rows, centred labels */
          <div
            role="menu"
            data-testid={`posting-menu-${posting.id}`}
            className="absolute right-0 top-[33px] z-20 w-[160px] overflow-hidden rounded-[12px] border-[0.7px] border-[#e5e5e5] bg-white py-[4px] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]"
          >
            {CARD_MENU_ITEMS.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <div className="h-[0.6px] w-full bg-[#e5e5e5]" />}
                <button
                  type="button"
                  role="menuitem"
                  data-testid={`posting-menu-item-${item.id}`}
                  onClick={() => onMenuItem(posting.id, item)}
                  className={classNames(
                    'flex h-[49px] w-full items-center justify-center px-[16px] text-center font-sans text-[14px] leading-[24.31px] tracking-[0.24px] transition-colors',
                    'hover:bg-[#f6f6f6] active:bg-[#ededed]',
                    forcedHoverItemId === item.id && 'bg-[#f6f6f6]',
                    item.destructive ? 'text-[#902b20]' : 'text-[#737373]'
                  )}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[18px] max-sm:gap-[6px]">
        <div className="flex flex-col gap-[16px] max-sm:flex-row max-sm:items-center max-sm:gap-[12px]">
          <span
            className={classNames(
              'grid size-[48px] place-items-center rounded-[8px] max-sm:size-[40px] max-sm:shrink-0',
              STATUS_ICON_STYLES[posting.status].tile
            )}
          >
            <Icon className={classNames('size-[20px]', STATUS_ICON_STYLES[posting.status].glyph)} />
          </span>

          <div className="flex flex-col gap-[12px] max-sm:min-w-0 max-sm:flex-1 max-sm:gap-[2px] max-sm:pr-[44px]">
            <div className="flex items-center justify-between gap-[12px] pr-[48px] max-sm:flex-wrap max-sm:justify-start max-sm:gap-x-[8px] max-sm:gap-y-[2px] max-sm:pr-0">
              <h3 className="font-heading text-[23px] font-semibold leading-[29px] tracking-[-0.46px] text-[#1c2a21] max-sm:text-[17px] max-sm:leading-[22px] max-sm:tracking-[-0.3px]">
                {posting.title}
              </h3>
              <span
                className={classNames(
                  'inline-flex shrink-0 items-center rounded-pill border-[1.21px] px-[9.64px] py-[6px] font-sans text-[14px] font-medium leading-[17px] max-sm:px-[8px] max-sm:py-[1px] max-sm:text-[12px]',
                  STATUS_STYLES[posting.status]
                )}
              >
                {posting.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-[6px] max-sm:gap-[4px]">
              <span className="flex items-center gap-[4px]">
                <LocationPinIcon className="size-[18px] max-sm:size-[14px] shrink-0 text-[#999999]" />
                {/* whitespace-pre-wrap preserves Figma's "Ho,  Ghana" */}
                <span className="whitespace-pre-wrap font-sans text-[14px] max-sm:text-[12px] leading-[16.71px] text-[#999999]">
                  {posting.location}
                </span>
              </span>
              <span className="font-sans text-[14px] max-sm:text-[12px] leading-[16.71px] text-[#9a988f]">
                •
              </span>
              <span className="font-sans text-[14px] max-sm:text-[12px] leading-[19.2px] text-[#9a988f]">
                {posting.type}
              </span>
              <span className="font-sans text-[14px] max-sm:text-[12px] leading-[16.71px] text-[#9a988f]">
                •
              </span>
              <span className="font-sans text-[14px] max-sm:text-[12px] leading-[19.2px] text-[#9a988f]">
                {posting.age}
              </span>
            </div>
          </div>
        </div>

        {/* Stat strip — Figma 7249:75934: three 100px columns, equal gaps, 1px rules */}
        <div className="flex items-stretch justify-between py-[18px] max-sm:gap-[8px] max-sm:py-[8px]">
          {[
            { label: STAT_LABELS.totalApplicants, value: posting.totalApplicants, primary: true },
            { label: STAT_LABELS.awaiting, value: posting.awaiting },
            { label: STAT_LABELS.avgMatch, value: posting.avgMatch },
          ].map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 && <span className="w-px shrink-0 bg-border-card" />}
              <span className="flex w-[100px] flex-col items-center justify-center gap-[6.59px] max-sm:w-auto max-sm:flex-1 max-sm:gap-[2px]">
                <span className="whitespace-nowrap text-center font-sans text-[14px] leading-5 tracking-[0.2px] text-[#9a988f] max-sm:text-[12px]">
                  {stat.label}
                </span>
                <span
                  className={classNames(
                    'font-heading text-[23px] font-semibold leading-[29px] max-sm:text-[17px] max-sm:leading-[22px]',
                    stat.primary ? 'text-[#00522b]' : 'text-[#43664d]'
                  )}
                >
                  {stat.value}
                </span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Footer — Figma 7249:75949: plain text + arrow, not a button */}
      <button
        type="button"
        onClick={() => onAction(posting.id, posting.action)}
        className="flex items-center justify-between gap-3 border-t border-border-card pt-[18px] text-left transition-opacity hover:opacity-80 max-sm:pt-[8px]"
      >
        <span className="font-sans text-[14px] leading-[18px] text-[#999999] max-sm:text-[13px]">
          {posting.action}
        </span>
        <TemplateArrowRightIcon className="size-[24px] max-sm:size-[20px] shrink-0 text-brand-green-dark" />
      </button>
    </article>
  );
};

const JobPostingsSection = () => {
  useScopedRoundedFont('data-recruiter-ui'); // Figma draws the recruiter pages in SF Pro Rounded
  const helpPanels = useRecruiterHelpPanels(); // top-bar "?" pop-over + feedback / invite dialogs (?help=, ?modal=feedback|invite; wiki recruiter-settings-help.md)
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  // Local, URL-seeded state: the toast frames (JM-09 / JM-11 / JM-13 / JT-11) open with the change already applied.
  const [overrides, setOverrides] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.get('posting');
    const kind = q.get('toast');
    if (kind === 'paused' && id) return { [id]: 'Paused' };
    if (kind === 'closed' && id) return { [id]: 'Closed' };
    return {};
  });
  const [deletedIds, setDeletedIds] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    return q.get('toast') === 'deleted' && q.get('posting') ? [q.get('posting')] : [];
  });
  const [published] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    return q.get('toast') === 'published' || q.get('modal') === 'published';
  });

  const statusParam = searchParams.get('status');
  const activeStatus = STATUS_FILTER_IDS.includes(statusParam) ? statusParam : 'all';
  const openMenuId = searchParams.get('menu');
  const forcedHoverItemId = searchParams.get('menuItem');
  const closingPostingId =
    searchParams.get('modal') === 'close-posting' ? searchParams.get('posting') : null;

  useEffect(() => {
    log('mount', { route: '/recruiter/job-postings', postingCount: POSTINGS.length });
  }, []);

  useEffect(() => {
    log('url state', { activeStatus, openMenuId, forcedHoverItemId, closingPostingId });
  }, [activeStatus, openMenuId, forcedHoverItemId, closingPostingId]);

  // Writes only the keys passed; null removes a key.
  const updateUrl = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value == null) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  const postings = useMemo(
    () =>
      [...(published ? [NEW_POSTING] : []), ...POSTINGS]
        .filter((p) => !deletedIds.includes(p.id))
        .map((p) => {
          const status = overrides[p.id];
          if (!status) return p;
          const action =
            status === 'Paused'
              ? 'Resume applications'
              : status === 'Closed'
                ? 'View summary'
                : p.action;
          return { ...p, status, action };
        }),
    [overrides, deletedIds, published]
  );

  const visible = postings.filter(
    (p) =>
      (activeStatus === 'all' || p.status.toLowerCase() === activeStatus) &&
      p.title.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  // Only the active pill shows a count (Figma 7249:75818 / 7249:76277).
  const pills = STATUS_PILLS.map((pill) =>
    pill.id === activeStatus
      ? {
          ...pill,
          count: pill.fixedCount && !deletedIds.length ? pill.fixedCount : `(${visible.length})`,
        }
      : { id: pill.id, label: pill.label }
  );
  const activePill = STATUS_PILLS.find((pill) => pill.id === activeStatus);

  const handleMenuItem = (postingId, item) => {
    log('branch', { menuItem: item.id, posting: postingId });
    if (item.id === 'close') {
      updateUrl({ menu: null, menuItem: null, modal: 'close-posting', posting: postingId });
    } else {
      updateUrl({ menu: null, menuItem: null });
    }
  };

  const closeDialog = () => updateUrl({ modal: null, posting: null });
  const modalKind = searchParams.get('modal');
  const modalPosting = postings.find((p) => p.id === searchParams.get('posting')) ?? postings[0];
  const toastKind = searchParams.get('toast');
  const toast = POSTING_TOASTS[toastKind];
  const manageMenu = searchParams.get('menuKind') === 'manage';
  const toastPosting = searchParams.get('posting');

  // Writes the toast + the posting it is about; nothing else in the URL survives.
  const finishWith = (kind, id) =>
    setSearchParams(new URLSearchParams({ toast: kind, ...(id ? { posting: id } : {}) }));

  const handleManageAction = (id, action) => {
    log('branch', { manage: action, posting: id });
    const base = { menu: null, menuKind: null, menuItem: null };
    if (action === 'view') navigate(`/recruiter/job-postings/${id}`);
    else if (action === 'pipeline') navigate('/recruiter/application-pipeline');
    else if (action === 'edit') navigate(`/recruiter/job-postings/${id}/edit`);
    else if (action === 'duplicate') updateUrl({ ...base, modal: 'save-template', posting: id });
    else if (action === 'pause') updateUrl({ ...base, modal: 'pause', posting: id });
    else if (action === 'close') updateUrl({ ...base, modal: 'close-applicants', posting: id });
    else {
      navigator.clipboard?.writeText?.(`gth.com/jobs/silver-rock/${id}`);
      updateUrl(base);
    }
  };

  return (
    <DashboardShell renderSidebar={renderWorkspaceSidebar} panels={helpPanels}>
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        <div className="flex flex-col gap-[16px] max-md:gap-[8px]">
          <RecruiterPageHeading
            lead={PAGE_HEADING.lead}
            accent={PAGE_HEADING.accent}
            subtitle={PAGE_SUBHEADING}
            titleStyle="sans-accent"
          />
          <RecruiterJobTabs />
        </div>

        <div className="flex flex-col gap-[32px] pb-[48px] max-md:gap-[12px] max-md:pb-[8px]">
          <RecruiterListToolbar
            chips={pills}
            activeChipId={activeStatus}
            onChipSelect={(id) => {
              log('branch', { statusFilter: id });
              updateUrl({ status: id === 'all' ? null : id, menu: null, menuItem: null });
            }}
            searchLabel={SEARCH_PLACEHOLDER}
            onSearch={setSearchText}
            actionLabel={CREATE_POST_LABEL}
            actionIcon={<PostingPencilIcon className="size-[18px] shrink-0" />}
            onAction={() => {
              log('branch', { action: 'create-post', to: '/recruiter/job-postings/new' });
              navigate('/recruiter/job-postings/new');
            }}
          />

          <div className="flex flex-col gap-[20px]">
            {activeStatus !== 'all' && (
              <p
                data-testid="posting-filter-summary"
                className="font-sans text-[14px] leading-5 tracking-[0.2px] text-[#959592]"
              >
                {FILTER_SUMMARY.prefix} {visible.length}{' '}
                {visible.length === 1 ? FILTER_SUMMARY.singular : FILTER_SUMMARY.plural}{' '}
                {FILTER_SUMMARY.connector}{' '}
                <span className="font-medium text-brand-green">{activePill.label}</span>
              </p>
            )}

            {/* Figma 7249:75902 — HORIZONTAL, gap 16, 3 x 432.33 */}
            <div className="grid grid-cols-1 gap-[16px] max-md:gap-[10px] md:grid-cols-2 xl:grid-cols-3">
              {visible.map((posting) => (
                <PostingCard
                  key={posting.id}
                  posting={posting}
                  isMenuOpen={openMenuId === posting.id}
                  forcedHoverItemId={openMenuId === posting.id ? forcedHoverItemId : null}
                  manageMenu={manageMenu}
                  onManageAction={handleManageAction}
                  onToggleMenu={(id) =>
                    updateUrl({
                      menu: openMenuId === id ? null : id,
                      menuItem: null,
                      menuKind: id === 'senior-ux-designer' && openMenuId !== id ? 'manage' : null,
                    })
                  }
                  onMenuItem={handleMenuItem}
                  onAction={(id, action) => {
                    log('branch', { posting: id, action });
                    if (action === 'Resume applications') {
                      setOverrides((prev) => ({ ...prev, [id]: undefined }));
                    } else if (action === 'Continue Editing') {
                      navigate('/recruiter/job-postings/new');
                    } else {
                      navigate('/recruiter/application-pipeline');
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Close confirmation — Figma 7249:78032 (528x304, r24, pad 64/48), scrim #0b1a0f @ 45% (10117:49564) */}
      {/* Portalled so it covers the shell's Career Buddy launcher + tab bar. */}
      {closingPostingId &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={CLOSE_CONFIRMATION.title}
            data-testid="close-posting-dialog"
            /* Phones: a bottom sheet flush to the screen edges, like the shared Modal. */
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1a0f]/45 px-4 max-sm:items-end max-sm:px-0"
            onClick={closeDialog}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex w-full max-w-[528px] flex-col rounded-[24px] bg-white px-[48px] py-[64px] shadow-[0_4px_0_0_rgba(0,0,0,0.13),0_40px_100px_0_rgba(0,0,0,0.25)] max-sm:max-h-dvh max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:px-[20px] max-sm:pb-[calc(24px+env(safe-area-inset-bottom))] max-sm:pt-[32px]"
            >
              <div className="flex flex-col items-center gap-[10px] text-center">
                <h2 className="font-heading text-[32px] font-semibold leading-[38px] text-[#1c2a21] max-sm:text-[22px] max-sm:leading-[28px]">
                  {CLOSE_CONFIRMATION.title}
                </h2>
                <p className="font-sans text-[16px] leading-6 text-[#575755]">
                  {CLOSE_CONFIRMATION.body}
                </p>
              </div>

              <div className="mt-[36px] flex flex-wrap items-center justify-end gap-[8px] max-sm:w-full max-sm:flex-col max-sm:gap-[12px]">
                <button
                  type="button"
                  onClick={() => {
                    log('branch', { action: 'confirm-close-posting', posting: closingPostingId });
                    setOverrides((prev) => ({ ...prev, [closingPostingId]: 'Closed' }));
                    closeDialog();
                  }}
                  className="inline-flex h-[44px] max-sm:h-[40px] max-sm:w-full max-sm:shadow-none items-center justify-center rounded-[10px] border-2 border-[#73221a] bg-[#c0392b] px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-white shadow-[0_4px_0_0_#73221a] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
                >
                  {CLOSE_CONFIRMATION.confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    log('branch', { action: 'cancel-close-posting' });
                    closeDialog();
                  }}
                  className="inline-flex h-[44px] max-sm:h-[40px] max-sm:w-full max-sm:shadow-none items-center justify-center rounded-[14px] border-2 border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_0_rgba(17,17,17,0.25)] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
                >
                  {CLOSE_CONFIRMATION.cancelLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {modalKind === 'pause' && (
        <PauseDialog
          title={modalPosting.title}
          applicants={modalPosting.totalApplicants}
          awaiting={72}
          onKeep={closeDialog}
          onPause={() => {
            setOverrides((prev) => ({ ...prev, [modalPosting.id]: 'Paused' }));
            finishWith('paused', modalPosting.id);
          }}
        />
      )}
      {modalKind === 'close-applicants' && (
        <CloseWithMessageDialog
          waiting={72}
          onCancel={closeDialog}
          onClose={() => {
            setOverrides((prev) => ({ ...prev, [modalPosting.id]: 'Closed' }));
            finishWith('closed', modalPosting.id);
          }}
        />
      )}
      {modalKind === 'delete-draft' && (
        <DeleteDraftDialog
          title={modalPosting.title}
          onCancel={closeDialog}
          onDelete={() => {
            setDeletedIds((prev) => [...prev, modalPosting.id]);
            finishWith('deleted', modalPosting.id);
          }}
        />
      )}
      {modalKind === 'save-template' && (
        <DuplicateDialog
          title={modalPosting.title}
          onClose={closeDialog}
          onSave={() => navigate('/recruiter/job-templates?mine=1&toast=copied')}
        />
      )}
      {modalKind === 'published' && (
        <PublishedDialog
          onBack={closeDialog}
          onView={() => navigate('/recruiter/job-postings/product-designer')}
          onAction={(id) => {
            if (id === 'track') navigate('/recruiter/application-pipeline');
            else if (id === 'invite') navigate('/recruiter/talent-search');
          }}
        />
      )}
      {toast && (
        <BannerToast
          key={toastKind}
          tone={toast.tone}
          title={toast.title}
          message={toast.message}
          actionLabel={toast.actionLabel}
          duration={0}
          onAction={() => {
            if (toastKind === 'paused' || toastKind === 'closed')
              setOverrides((prev) => ({ ...prev, [toastPosting]: undefined }));
            if (toastKind === 'deleted')
              setDeletedIds((prev) => prev.filter((id) => id !== toastPosting));
            if (toastKind === 'published') navigate('/recruiter/job-postings/product-designer');
          }}
          onClose={() => updateUrl({ toast: null, posting: null })}
        />
      )}
    </DashboardShell>
  );
};

export default JobPostingsSection;
