import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ApplicantRowMoreDotsIcon,
  ExtendOfferSignatureIcon,
  MarkAcceptedUserCheckIcon,
  RescheduleInterviewClockCalendarIcon,
  RescheduleInterviewCalendarAddIcon,
  RejectApplicantCircleXIcon,
  ShortlistApplicantStarIcon,
  MessageCandidateBubbleIcon,
  UndoDecisionArrowIcon,
  ReconsiderApplicantRotateIcon,
} from './recruiterHomeApplicantIcons.jsx';
import {
  APPLICANT_ROW_MENU_BY_STAGE,
  APPLICANT_STAGES,
  APPLICANT_TABLE_COLUMNS,
  APPLICANTS_PAGE,
} from './recruiterHomeData.js';

const log = debug('RecruiterApplicantsTable');

/*
 * RecruiterApplicantsTable — existing-user home: applicants table with the per-row "..." action menu, plus the pagination bar.
 * Figma 8121:19114 (table 1329x382, white, r16, 1px #e5e5e5), header 8121:19115 (62px, #f1f1f1), rows 8121:19130/19157/19184/19211,
 * pagination 8121:19236 (68px, white, r16, pad 16/24), menus 8193:79206 / 8193:79366 / 8193:79660 / 8193:80703.
 *
 * Open menu = `actionsMenuApplicantId` (URL ?actionsMenu=<id>, owned by the section, see recruiterHomeState.js). The menu hangs under its row's
 * "..." button (top 100%, left aligned with the button as drawn; right aligned below lg so it stays on screen). In Figma the Accepted and
 * Rejected menus are placed arbitrarily (not under their own row); here every menu opens under its own row.
 * `hoveredActionId` pins the hover look of one menu row (frame 8063:45341 draws "Mark as Accepted" hovered).
 * Below lg the header row is dropped and each row becomes a wrapped card (⚠️ ASSUMPTION: no phone frame exists in Figma).
 */
const ACTION_ICONS = {
  'extend-offer': ExtendOfferSignatureIcon,
  'mark-as-accepted': MarkAcceptedUserCheckIcon,
  'reschedule-interview-clock': RescheduleInterviewClockCalendarIcon,
  'reschedule-interview-add': RescheduleInterviewCalendarAddIcon,
  reject: RejectApplicantCircleXIcon,
  shortlist: ShortlistApplicantStarIcon,
  'message-candidate': MessageCandidateBubbleIcon,
  undo: UndoDecisionArrowIcon,
  reconsider: ReconsiderApplicantRotateIcon,
};

const ACTION_TONE_CLASSES = {
  danger: 'text-[#c0392b]',
  muted: 'text-[#70706e] [&_svg]:text-[#959592]',
  default: 'text-[#737373] [&_svg]:text-[#999999]',
};

const ROW_GRID =
  'lg:grid lg:grid-cols-[48px_minmax(0,321fr)_minmax(0,198fr)_minmax(0,136fr)_minmax(0,135fr)_minmax(0,104fr)] lg:items-center lg:gap-x-[clamp(12px,3vw,40px)] lg:px-[clamp(16px,6.4%,85px)]';

const checkboxClass =
  'size-[24px] shrink-0 cursor-pointer lg:size-[16px] appearance-none rounded-[4px] border border-[#d6d1c2] bg-white checked:border-brand-green checked:bg-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const RowActionsMenu = ({ applicant, hoveredActionId, onChoose }) => {
  const menu = APPLICANT_ROW_MENU_BY_STAGE[applicant.stage];
  return (
    <div
      role="menu"
      aria-label={`Actions for ${applicant.name}`}
      data-testid={`applicant-actions-menu-${applicant.id}`}
      style={{ minWidth: `min(${menu.widthPx}px, 90vw)` }}
      className="absolute right-0 top-full z-20 flex w-max flex-col rounded-[16px] border-[0.7px] border-[#e6e6e6] bg-white py-[4px] shadow-[0_1px_4px_rgba(64,64,64,0.06)] lg:left-0 lg:right-auto"
    >
      {menu.actions.map((action, index) => {
        const Icon = ACTION_ICONS[action.iconKey];
        const pinned = hoveredActionId === action.id;
        return (
          <button
            key={action.id}
            type="button"
            role="menuitem"
            data-testid={`applicant-action-${action.id}`}
            onClick={() => onChoose(applicant, action)}
            style={{ columnGap: `${menu.iconGapPx}px` }}
            className={classNames(
              'flex min-h-[44px] w-full cursor-pointer whitespace-nowrap items-center px-[16px] py-[12px] text-left text-[12px] leading-[25px] tracking-[0.24px] transition-colors duration-150 hover:bg-[#f6f6f6] focus-visible:bg-[#f6f6f6] focus-visible:outline-none',
              index > 0 && 'border-t border-[#e6e6e6]',
              pinned && 'bg-[#f6f6f6]',
              ACTION_TONE_CLASSES[action.tone ?? 'default']
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const RecruiterApplicantsTable = ({
  actionsMenuApplicantId,
  hoveredActionId,
  onActionsMenuChange,
  className,
}) => {
  const { applicants, pagination } = APPLICANTS_PAGE;
  const openMenuRootRef = useRef(null);

  useEffect(() => {
    log('mount', { rows: applicants.length, openMenu: actionsMenuApplicantId });
  }, [applicants.length, actionsMenuApplicantId]);

  // Outside click / Escape closes the open row menu.
  useEffect(() => {
    if (!actionsMenuApplicantId) return undefined;
    const handlePointerDown = (event) => {
      if (openMenuRootRef.current && !openMenuRootRef.current.contains(event.target)) {
        log('branch', { closeMenu: 'outside-click' });
        onActionsMenuChange(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        log('branch', { closeMenu: 'escape' });
        onActionsMenuChange(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actionsMenuApplicantId, onActionsMenuChange]);

  const handleChoose = (applicant, action) => {
    // No confirmation / result frames exist in Figma, so the choice is logged and the menu closes.
    log('branch', { applicant: applicant.id, action: action.id, destination: 'none-in-figma' });
    onActionsMenuChange(null);
  };

  return (
    <div className={classNames('flex w-full flex-col gap-[8px]', className)}>
      <section aria-label="Applicants" className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div
          className={classNames(
            'hidden h-[62px] rounded-t-[16px] border-b border-[#e5e5e5] bg-[#f1f1f1] text-[16px] leading-6 tracking-[0.2px] text-[#9a988f]',
            ROW_GRID
          )}
        >
          <input
            type="checkbox"
            aria-label="Select all applicants"
            className={checkboxClass}
            onChange={(event) => log('branch', { selectAll: event.target.checked })}
          />
          <span>{APPLICANT_TABLE_COLUMNS.applicantName}</span>
          <span>{APPLICANT_TABLE_COLUMNS.currentStage}</span>
          <span>{APPLICANT_TABLE_COLUMNS.matchScore}</span>
          <span>{APPLICANT_TABLE_COLUMNS.appliedDate}</span>
          <span className="text-center">{APPLICANT_TABLE_COLUMNS.actions}</span>
        </div>

        <ul>
          {applicants.map((applicant) => {
            const stage = APPLICANT_STAGES[applicant.stage];
            const menuOpen = actionsMenuApplicantId === applicant.id;
            return (
              <li
                key={applicant.id}
                data-testid={`applicant-row-${applicant.id}`}
                className={classNames(
                  'relative flex min-h-[80px] flex-wrap items-center gap-x-[12px] gap-y-[8px] border-b border-[#f1f1f1] px-[14px] py-[12px] last:border-b-0',
                  ROW_GRID
                )}
              >
                <input
                  type="checkbox"
                  aria-label={`Select ${applicant.name}`}
                  className={checkboxClass}
                  onChange={(event) =>
                    log('branch', { select: applicant.id, checked: event.target.checked })
                  }
                />

                <div className="flex min-w-0 flex-1 items-center gap-[12px] lg:flex-none">
                  <span
                    className={classNames(
                      'grid size-[40px] shrink-0 place-items-center rounded-full font-[Inter,sans-serif] text-[14px] font-bold leading-5',
                      applicant.avatarClass
                    )}
                  >
                    {applicant.initials}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[16px] font-semibold leading-[22px] text-[#1c2a21]">
                      {applicant.name}
                    </span>
                    <span className="truncate text-[16px] leading-6 tracking-[0.2px] text-[#999999] max-sm:text-[13px] max-sm:leading-5">
                      {applicant.headline}
                    </span>
                  </span>
                </div>

                <span
                  className={classNames(
                    'inline-flex w-fit items-center rounded-full border px-[10px] py-[6px] text-[16px] leading-6 tracking-[0.2px] max-sm:text-[14px] max-sm:leading-5',
                    stage.pillClass
                  )}
                >
                  {stage.label}
                </span>

                <span className="flex items-center gap-[8px]">
                  <span
                    aria-hidden="true"
                    className="h-[6px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[#eae8e2]"
                  >
                    <span
                      className="block h-full"
                      style={{
                        width: `${applicant.matchBarFillPercent}%`,
                        backgroundColor: applicant.matchColor,
                      }}
                    />
                  </span>
                  <span
                    className="font-[Inter,sans-serif] text-[13.5px] font-semibold leading-[22px]"
                    style={{ color: applicant.matchColor }}
                  >
                    {applicant.matchScorePercent}%
                  </span>
                </span>

                <span className="text-[16px] leading-6 tracking-[0.2px] text-[#9a988f] max-sm:text-[13px] max-sm:leading-5">
                  {applicant.appliedDate}
                </span>

                <div
                  ref={menuOpen ? openMenuRootRef : undefined}
                  className="relative ml-auto flex justify-center lg:ml-0"
                >
                  <button
                    type="button"
                    aria-label={`Actions for ${applicant.name}`}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    data-testid={`applicant-actions-button-${applicant.id}`}
                    onClick={() => {
                      log('branch', { toggleMenu: applicant.id, wasOpen: menuOpen });
                      onActionsMenuChange(menuOpen ? null : applicant.id);
                    }}
                    className="grid h-[24px] min-w-[32px] cursor-pointer place-items-center rounded-[6px] text-[#9a988f] transition-colors hover:bg-[#f1f1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  >
                    <ApplicantRowMoreDotsIcon className="h-[4px] w-[16px]" />
                  </button>
                  {menuOpen && (
                    <RowActionsMenu
                      applicant={applicant}
                      hoveredActionId={hoveredActionId}
                      onChoose={handleChoose}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <nav
        aria-label="Applicants pagination"
        className="flex flex-wrap items-center justify-between gap-[12px] rounded-[16px] border border-[#e5e5e5] bg-white px-[24px] py-[16px] max-sm:px-[14px]"
      >
        <p className="text-[16px] leading-6 tracking-[0.2px] text-[#9a988f] max-sm:text-[13px]">
          {pagination.summary}
        </p>
        <div className="flex items-center gap-[8px]">
          <Button
            variant="tertiary"
            size="xs"
            onClick={() => log('branch', { page: 'previous', wired: false })}
            className="h-[34px] rounded-[14px]! px-[12px]! py-0! text-[16px]! max-sm:text-[14px]!"
          >
            {pagination.previousLabel}
          </Button>
          {pagination.pages.map((page) => {
            const current = page === pagination.currentPage;
            return (
              <Button
                key={page}
                variant={current ? 'primary' : 'tertiary'}
                size="xs"
                aria-label={`Page ${page}`}
                aria-current={current ? 'page' : undefined}
                onClick={() => log('branch', { page, wired: false })}
                className={classNames(
                  'h-[32px] min-w-[31px] px-[12px]! py-0! text-[13.5px]!',
                  current ? 'rounded-[10px]!' : 'rounded-[14px]!'
                )}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="tertiary"
            size="xs"
            onClick={() => log('branch', { page: 'next', wired: false })}
            className="h-[34px] rounded-[14px]! px-[12px]! py-0! text-[16px]! max-sm:text-[14px]!"
          >
            {pagination.nextLabel}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default RecruiterApplicantsTable;
