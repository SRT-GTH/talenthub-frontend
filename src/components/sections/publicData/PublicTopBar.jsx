import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import gthLogo from '../../../assets/public-data/gth-logo.png';
import FreshnessTooltip from './methodology/FreshnessTooltip.jsx';
import { PublicIconMenu, PublicIconSearch, PublicIconShare } from './publicDataIcons.jsx';

const log = debug('PublicTopBar');

/*
 * PublicTopBar — Figma "GTH · Top bar" Public variants (desktop 8514:147 · tablet 8508:351194 · mobile 8507:10), Focused style.
 *   desktop >= xl  : h76, px40 — page title (18/600) · search 420 · freshness pill · Share · Download PDF
 *   tablet md..xl  : h77, px32 — title (16/700) · freshness pill · Share icon button · Download PDF (no search drawn)
 *   mobile < md    : h60, px16 — logo · "GTH" · Live pill · menu button (the section tabs sit in the page body, see PublicMobileTabs)
 * Props: title (the page's context label, e.g. "Home", "National snapshot"), freshness { label } , q / onSearch, onSubmitSearch(text) (Enter in the
 * search box; optional), onShare(), onDownload(), onMenu().
 * Without onDownload the "Download PDF" button is left out (pages that have no printable layout).
 * ⚠️ ASSUMPTION: the search box writes ?q= as you type (the directories filter on it); Enter calls onSubmitSearch, which the page chrome
 * turns into a destination (publicDataSearch.js: region page or directory) because no results page is drawn.
 */

/** size 'md' = the desktop / tablet freshness pill (h30, 13/16 500); 'sm' = the phone top bar's "Live" pill (h24, 12/14 600). */
export const FreshnessPill = ({
  label = 'Updated 2 min ago · Live',
  tone,
  size = 'md',
  className,
}) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full font-sans whitespace-nowrap',
      size === 'sm'
        ? 'h-[24px] gap-[6px] px-[10px] text-[12px] leading-[14px] font-semibold'
        : 'h-[30px] gap-[8px] py-[7px] pr-[14px] pl-[12px] text-[13px] leading-[16px] font-medium',
      tone === 'maintenance' || tone === 'offline'
        ? 'bg-[#f2f2ee] text-[#1c2a21]'
        : 'bg-[#ebf1ec] text-[#2a5730]',
      className
    )}
    role="status"
  >
    <span
      className={classNames(
        'size-[8px] rounded-full',
        tone === 'maintenance'
          ? 'bg-[#c98500]'
          : tone === 'offline'
            ? 'bg-[#9a9a96]'
            : 'bg-[#387440]'
      )}
      aria-hidden="true"
    />
    {label}
  </span>
);

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const PublicTopBar = ({
  title = 'Home',
  freshness,
  q = '',
  onSearch,
  onSubmitSearch,
  onShare,
  onDownload,
  onMenu,
}) => {
  log('render', { title });
  const label = freshness?.label;
  return (
    <header className="sticky top-0 z-30 border-b border-solid border-[#e7e7e7] bg-white">
      {/* desktop + tablet */}
      <div className="hidden h-[76px] items-center gap-[24px] px-[32px] md:flex xl:px-[40px]">
        <p className="m-0 w-[168px] min-w-0 shrink truncate font-sans text-[16px] leading-[19px] font-bold text-[#1c2a21] xl:w-[236px] xl:text-[18px] xl:leading-[21px] xl:font-semibold">
          {title}
        </p>
        <label className="hidden h-[42px] w-[420px] max-w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[14px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] xl:flex">
          <PublicIconSearch className="size-[18px] shrink-0 text-[#595959]" />
          <input
            type="search"
            value={q}
            onChange={(e) => onSearch?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !onSubmitSearch) return;
              e.preventDefault();
              log('search submit', { length: e.currentTarget.value.length });
              onSubmitSearch(e.currentTarget.value);
            }}
            placeholder="Search regions, partners, opportunities"
            aria-label="Search regions, partners, opportunities"
            className="min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
          />
        </label>
        <div className="ml-auto flex items-center gap-[10px] xl:gap-[12px]">
          <FreshnessTooltip>
            <FreshnessPill label={label} tone={freshness?.tone} />
          </FreshnessTooltip>
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={onShare}
            className="!hidden !rounded-[14px] !px-[22px] !py-[12px] xl:!inline-flex"
          >
            Share
          </Button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            className={classNames(
              'flex size-[42px] items-center justify-center rounded-[12px] border border-solid border-[#e7e7e7] bg-white text-[#1c2a21] xl:hidden',
              FOCUS
            )}
          >
            <PublicIconShare className="size-[20px]" />
          </button>
          {onDownload ? (
            <Button type="button" variant="primary" size="sm" onClick={onDownload}>
              Download PDF
            </Button>
          ) : null}
        </div>
      </div>
      {/* mobile */}
      <div className="flex h-[60px] items-center gap-[10px] px-[16px] md:hidden">
        <Link
          to="/data"
          className={classNames('flex items-center gap-[10px] rounded-[8px]', FOCUS)}
        >
          <img src={gthLogo} alt="" width="32" height="30" className="h-[30px] w-[32px]" />
          <span className="font-sans text-[16px] leading-[19px] font-bold text-[#1c2a21]">GTH</span>
        </Link>
        {/* Phones: the short state of the same freshness (it said "Live" even when the data was offline / cached). */}
        <FreshnessPill
          label={
            freshness?.tone === 'offline'
              ? 'Offline'
              : freshness?.tone === 'maintenance'
                ? 'Maintenance'
                : 'Live'
          }
          tone={freshness?.tone}
          size="sm"
        />
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className={classNames(
            'ml-auto flex size-[42px] items-center justify-center rounded-[12px] border border-solid border-[#e7e7e7] bg-white text-[#1c2a21]',
            FOCUS
          )}
        >
          <PublicIconMenu className="size-[20px]" />
        </button>
      </div>
    </header>
  );
};

export default PublicTopBar;
