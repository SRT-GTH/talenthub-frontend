import { Link } from 'react-router-dom';
import { classNames } from '../../utils/classNames.js';

/*
 * UnderlineTabs — the text tab bar of the parent screens (Figma "tabs" 10057:648 ward page, 10057:913 To review): tabs px14 pt10 pb12, 15px, a 3px underline on the active tab
 * (green #387440, label 600) and #737373 / 500 on the others, a hairline #e1eae2 under the bar, count chips (11.5/700, 12 below lg) beside the label.
 * Props: tabs [{ id, label, to?, onClick?, count?, countTone? ('mint' default #ebf1ec | 'amber' #c8951a on white) }], activeId, label (the nav's accessible name), className.
 * A tab with `to` is a router <Link> (aria-current on the active one); without it a <button> that calls `onClick` (tabs whose page is not designed yet only log).
 * The bar scrolls sideways inside itself on narrow screens with no visible scrollbar.
 * Used by parent/wards/WardShell (ward page) and parent/flags/ReviewCorrections (To review); it replaced three copy-pasted tab bars.
 */
const TAB_BASE =
  'flex shrink-0 cursor-pointer items-center gap-[8px] border-0 border-b-[3px] border-solid bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-normal no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]';

const COUNT_TONES = {
  mint: 'bg-[#ebf1ec] text-[#2d5d33]',
  amber: 'bg-[#c8951a] text-white',
};

const UnderlineTabs = ({ tabs, activeId, label, className }) => (
  <nav
    aria-label={label}
    className={classNames(
      'flex gap-[4px] overflow-x-auto border-0 border-b border-solid border-[#e1eae2] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      className
    )}
  >
    {tabs.map((t) => {
      const selected = t.id === activeId;
      const cls = classNames(
        TAB_BASE,
        selected
          ? 'border-[#387440] font-semibold text-[#387440]'
          : 'border-transparent font-medium text-[#737373]'
      );
      const inner = (
        <>
          {t.label}
          {t.count ? (
            <span
              className={classNames(
                'rounded-full px-[7px] py-px font-sans text-[11.5px] leading-normal font-bold max-lg:text-[12px]',
                COUNT_TONES[t.countTone] ?? COUNT_TONES.mint
              )}
            >
              {t.count}
            </span>
          ) : null}
        </>
      );
      return t.to ? (
        <Link
          key={t.id}
          to={t.to}
          aria-current={selected ? 'page' : undefined}
          onClick={t.onClick}
          className={cls}
        >
          {inner}
        </Link>
      ) : (
        <button key={t.id} type="button" onClick={t.onClick} className={cls}>
          {inner}
        </button>
      );
    })}
  </nav>
);

export default UnderlineTabs;
