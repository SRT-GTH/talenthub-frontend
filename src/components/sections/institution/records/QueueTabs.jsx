import { classNames } from '../../../../utils/classNames.js';

/*
 * QueueTabs — the status tabs of the lists (Figma tabs 8593:27): 15px label + count bubble; the active tab is 600 #1c2a21 with a 3px #1c2a21 underline and a gold (#c8951a) bubble,
 * the others 500 #737373 with a #ebf1ec bubble; the row has a 1px #e1eae2 base. Props: label (aria-label), tabs [{ id, label, count? }], active, onSelect(id), tone ('dark' lists | 'green' profile tabs, Figma 11.2.3b 8593:688).
 */
const QueueTabs = ({ label, tabs, active, onSelect, tone = 'dark' }) => (
  <div
    role="tablist"
    aria-label={label}
    className="flex items-end gap-[4px] overflow-x-auto border-0 border-b border-solid border-[#e1eae2] pb-px font-sans"
  >
    {tabs.map((t) => {
      const on = t.id === active;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={on}
          onClick={() => onSelect(t.id)}
          className={classNames(
            'flex shrink-0 cursor-pointer items-center gap-[8px] border-0 border-solid bg-transparent px-[14px] pt-[10px] pb-[12px] text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]',
            on
              ? classNames(
                  'border-b-[3px] pb-[10px] font-semibold',
                  tone === 'green'
                    ? 'border-[#387440] text-[#387440]'
                    : 'border-[#1c2a21] text-[#1c2a21]'
                )
              : 'font-medium text-[#737373] hover:text-[#1c2a21]'
          )}
        >
          {t.label}
          {t.count ? (
            <span
              className={classNames(
                'inline-flex h-[16px] items-center rounded-full px-[7px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold',
                on && tone !== 'green' ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
              )}
            >
              {t.count}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);

export default QueueTabs;
