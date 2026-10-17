import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { CHAT_HISTORY_GROUPS } from './careerBuddyScript.js';

const log = debug('CareerBuddyHistoryDrawer');

const ChevronDoubleLeftIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M9.5 3.5 5 8l4.5 4.5M13 3.5 8.5 8l4.5 4.5" />
  </svg>
);

/*
 * CareerBuddyHistoryDrawer — chat-history slide-in panel.
 * Source: Figma 5132:45345 ("History" drawer over the Career Buddy chat).
 * Renders CHAT_HISTORY_GROUPS verbatim, grouped by date. Presentational
 * only — entries are inert in this slice (no navigation back into old
 * conversations yet, since there's no real chat persistence).
 *
 * 2026-10-16 (live Career Buddy): optional groups ({ label, entries:
 * Array<string | { id, label }> }[]) + onSelect(entry) + activeId render
 * the talent's real saved conversations; without them the canned Figma
 * groups render as before (scripted demo unchanged).
 */
const CareerBuddyHistoryDrawer = ({ open, onClose, groups, onSelect, activeId }) => {
  log('render', { open, live: Boolean(groups) });
  const shown = groups ?? CHAT_HISTORY_GROUPS;

  return (
    <div
      className={classNames(
        'absolute left-4 top-4 bottom-4 z-20 w-[220px] rounded-[16px] bg-white shadow-lg border border-border-default',
        // < lg: full-width sheet over the chat pane
        'max-lg:inset-0 max-lg:w-auto max-lg:rounded-none max-lg:border-0',
        // Playful (Figma 7873:52640): drawer opens on the RIGHT, 349px, r12,
        // 1px #e5e7eb, backdrop blur 16.2.
        'playful:lg:left-auto playful:lg:right-[19px] playful:lg:w-[349px] playful:rounded-[12px] playful:border-[#e5e7eb] playful:shadow-none playful:backdrop-blur-[16.2px] playful:max-lg:rounded-none',
        'transition-all duration-200 ease-in motion-reduce:transition-none',
        open
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 -translate-x-2 pointer-events-none playful:translate-x-2'
      )}
      role="dialog"
      aria-label="Chat history"
      aria-hidden={!open}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0 max-lg:pt-[max(8px,env(safe-area-inset-top))] playful:lg:px-[22px] playful:lg:pt-[22px] playful:lg:pb-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className="text-content-tertiary hover:text-brand-green max-lg:-ml-3 max-lg:inline-flex max-lg:size-11 max-lg:items-center max-lg:justify-center playful:text-[#777] playful:hover:text-[#1c2a21] playful:hover:shadow-[0_4px_12.7px_rgba(254,254,254,0.65)] playful:focus-visible:outline-2 playful:focus-visible:outline-offset-2 playful:focus-visible:outline-[#1c2a21]"
          >
            {/* Playful: » (Figma mynaui:chevron-double-right, 24px #777) */}
            <ChevronDoubleLeftIcon className="size-4 playful:size-6 playful:rotate-180" />
          </button>
        </div>
        <h3 className="font-display text-[22px] text-content-primary px-4 pb-3 shrink-0 playful:px-[22px] playful:pt-3 playful:pb-5 playful:font-sans playful:text-[24px] playful:font-medium playful:leading-normal playful:tracking-[-1px] playful:text-[#0d0d0d]">
          History
        </h3>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-4 playful:px-[22px] playful:pb-[22px] playful:gap-5">
          {shown.length === 0 && (
            <p className="font-sans text-[12px] text-content-tertiary">
              No earlier conversations yet.
            </p>
          )}
          {shown.map((group) => (
            <div key={group.label} className="flex flex-col gap-1 playful:gap-3">
              <span className="font-sans text-[10px] max-lg:text-[12px] font-medium text-content-tertiary uppercase tracking-wide playful:flex playful:items-center playful:gap-[6px] playful:text-[12px] playful:font-normal playful:normal-case playful:tracking-normal playful:text-[#999] playful:after:block playful:after:h-px playful:after:flex-1 playful:after:bg-[#999] playful:after:content-['']">
                {group.label}
              </span>
              <div className="flex flex-col border-t border-border-default playful:gap-1 playful:border-t-0">
                {group.entries.map((entry) => {
                  const id = typeof entry === 'string' ? entry : entry.id;
                  const label = typeof entry === 'string' ? entry : entry.label;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-current={id === activeId ? 'true' : undefined}
                      onClick={() => {
                        log('branch', { historyEntryClicked: id });
                        onSelect?.(entry);
                      }}
                      className={classNames(
                        'text-left font-sans text-[12px] py-2 border-b border-border-default hover:text-brand-green max-lg:min-h-11 max-lg:text-[14px] playful:rounded-[8px] playful:border playful:border-transparent playful:px-[14px] playful:py-[9px] playful:text-[14px] playful:hover:border-[rgba(89,89,89,0.15)] playful:hover:bg-[rgba(28,42,33,0.04)] playful:hover:text-[#1c2a21] playful:focus-visible:outline-2 playful:focus-visible:outline-offset-2 playful:focus-visible:outline-[#1c2a21]',
                        id === activeId
                          ? 'text-brand-green font-medium'
                          : 'text-content-primary playful:text-[#1c2a21]'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerBuddyHistoryDrawer;
