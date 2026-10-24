import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import RegionSwitcher from './RegionSwitcher.jsx';

/*
 * RegionHeader — the "page header" of the region and district pages (Figma 8493:80 / 8494:2009): the title with its switcher (34/41 600) and the
 * one-line subtitle (16/19 #595959) on the left; "Data as of 17 Oct 2026 · 14:02 GMT" (14/17 500 #595959) and the compare button on the right.
 * Phones (frames 8507:289, 8516:20): title 26/31, subtitle 14/20, no "data as of", no compare button (the action bar carries Share / Download).
 * Props: view (regionsView), switcher { items, currentId, open, onOpenChange, onSelect, searchLabel, caption, listLabel }, onCompare().
 */

const RegionHeader = ({ view, switcher, onCompare, className, plainTitle = false }) => (
  <header
    className={classNames(
      'flex flex-col gap-[8px] md:flex-row md:items-end md:justify-between',
      className
    )}
  >
    <div className="flex min-w-0 flex-col gap-[4px] md:gap-[6px]">
      {plainTitle ? (
        <h1 className="m-0 px-[4px] py-[2px] font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:hidden">
          {view.name}
        </h1>
      ) : null}
      <div className={classNames(plainTitle && 'max-md:hidden')}>
        <RegionSwitcher title={view.name} {...switcher} />
      </div>
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959] md:text-[16px] md:leading-[19px]">
        <span className="md:hidden">{view.mobile.subtitle}</span>
        <span className="max-md:hidden">{view.subtitle}</span>
      </p>
    </div>
    <div className="flex shrink-0 items-center gap-[12px] max-md:hidden md:pb-[2px]">
      <span className="font-sans text-[14px] leading-[17px] font-medium whitespace-nowrap text-[#595959]">
        {`Data as of ${view.dataAsOf}`}
      </span>
      <Button
        type="button"
        variant="tertiary-subtle"
        size="md"
        onClick={onCompare}
        className="!rounded-[14px] !border-2 !border-solid !border-[#c1d4c4] !bg-[#e1eae2] !px-[22px] !py-[12px] !text-[#165d3a]"
      >
        {view.compareLabel}
      </Button>
    </div>
  </header>
);

export default RegionHeader;
