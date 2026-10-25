import { classNames } from '../../../../utils/classNames.js';
import { formatRosterCount } from './rosterFormat.js';
import { FORM_TABS } from './data/rosterData.js';

/*
 * InstitutionRosterTabs — the class tabs of the roster (Figma "tabs" 8590:383352, 1329 x 44, gap 4): Form 1 · Form 2 · Form 3 · Graduates.
 * Tab: p 10/14/12/14, gap 8, 15/18; the current tab is 600 #1c2a21 with a 2px #1c2a21 underline and a gold #c8951a count pill (white 11.5/14 700),
 * the others 500 #737373 with a #ebf1ec count pill (#2d5d33). Counts come from the roster store (the Figma counts are the base) and read
 * "1,204" style (roster counts are the institution's own data, not an aggregate: no "<5" suppression).
 * Props: counts ({ [tabId]: number }), current (tab id), onChange(id), className. URL key `form` is owned by the page.
 */

const InstitutionRosterTabs = ({ counts, current, onChange, className }) => (
  <div
    role="tablist"
    aria-label="Class"
    className={classNames('flex flex-wrap gap-[4px]', className)}
  >
    {FORM_TABS.map((t) => {
      const on = t.id === current;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={on}
          onClick={() => onChange(t.id)}
          className={classNames(
            'inline-flex min-h-[40px] items-center gap-[8px] border-0 bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]',
            on
              ? 'cursor-default border-b-2 border-solid border-[#1c2a21] font-semibold text-[#1c2a21]'
              : 'cursor-pointer font-medium text-[#737373] hover:text-[#1c2a21]'
          )}
        >
          {t.label}
          <span
            className={classNames(
              'inline-flex h-[16px] items-center rounded-full px-[7px] text-[11.5px] leading-[14px] font-bold max-lg:h-[18px] max-lg:text-[12px]',
              on ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
            )}
          >
            {formatRosterCount(counts[t.id] ?? 0)}
          </span>
        </button>
      );
    })}
  </div>
);

export default InstitutionRosterTabs;
