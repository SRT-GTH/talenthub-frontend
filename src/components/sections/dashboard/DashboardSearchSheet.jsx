import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import { TOP_NAV } from './dashboardData.js';

const log = debug('DashboardSearchSheet');

/*
 * DashboardSearchSheet — the phone (< md) global search. The inline search
 * field in DashboardTopNav is `md:flex`, so on a phone the top bar shows a
 * search icon button instead and this sheet drops down full-width from the top
 * edge. It is anchored to the TOP (not the bottom) so the on-screen keyboard
 * never covers it. The input is 16px so iOS Safari does not zoom on focus.
 */
const DashboardSearchSheet = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    log('open');
    inputRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      log('close');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] md:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          log('submit search', { length: inputRef.current?.value.length ?? 0 });
          onClose?.();
        }}
        className="flex w-full items-center gap-[8px] border-b border-[#e7e7e7] bg-white px-[16px] pb-[8px] pt-[calc(8px+env(safe-area-inset-top))] shadow-bottom-100"
      >
        <label className="flex h-[44px] min-w-0 flex-1 items-center gap-[10px] rounded-[10px] border border-[#dfdfdc] bg-white pl-[12px] pr-[12px] focus-within:border-brand-green">
          <span className="sr-only">{TOP_NAV.searchPlaceholder}</span>
          <CommunityIcon src={icons.navSearch} size={18} />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            placeholder={TOP_NAV.searchPlaceholder}
            onChange={(event) => log('global search input:', event.target.value.length, 'chars')}
            className="min-w-0 flex-1 bg-transparent font-sans text-[16px] leading-6 tracking-[0.2px] text-black outline-none placeholder:text-[#bfbfbf]"
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-[44px] shrink-0 items-center justify-center rounded-[10px] px-[8px] font-sans text-[14px] font-medium text-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          Cancel
        </button>
      </form>
    </div>,
    document.body
  );
};

export default DashboardSearchSheet;
