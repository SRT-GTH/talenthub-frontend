import { useNavigate, useLocation } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HelpMailInkIcon } from '../../shared/assets.jsx';
import { FOCUS_RING, HEADING, HelpButton, HelpRow, Kbd } from './helpUi.jsx';
import {
  HELP_ROUTE,
  HP_COPY,
  HP_DEFAULT_QUERY,
  HP_PAGE_ROWS,
  HP_POPULAR_ROWS,
  searchHelp,
} from './helpData.js';
import iconClose from '../../../assets/notifications/help/close.svg';
import iconSearch from '../../../assets/notifications/help/search.svg';
import iconBulb from '../../../assets/notifications/help/bulb.svg';
import iconWhatsapp from '../../../assets/notifications/help/whatsapp.svg';
import iconPlay from '../../../assets/notifications/help/play.svg';
import iconArrow from '../../../assets/notifications/help/arrow-right.svg';
import spotSearch from '../../../assets/talent-settings/help/spot-search-no-results.svg';

const log = debug('HelpPopoverFlow');

/*
 * HelpPopoverFlow — the extra Help pop-over states, rendered by notifications/HelpPopover.jsx when the URL
 * carries `?help=page|searching|none` (`?help=1` keeps the original pop-over untouched):
 *   HP-01 For this page  (Playful 8228:11841 / Focused 8230:416483)  ?help=page
 *   HP-02 Searching      (8228:12878 / 8230:417097)                  ?help=searching[&q=fee]
 *   HP-03 No results     (8228:13882 / 8230:417711)                  ?help=none[&q=nss posting letter]
 * Component `GTH · Help pop-over` (8226:20731): 400px, r20, p20/20/16, gap 20 (Focused) / 24 (Playful).
 * Typing in the field rewrites `help` + `q` in the URL, so the state shown is always the URL's.
 */
const SECTION_LABEL =
  'font-sans text-[11px] font-semibold leading-[1.2] tracking-[0.66px] max-lg:text-[12px] text-[#387440]';

const Footer = ({ onReplay, onShortcuts, onCentre }) => (
  <>
    <div className="h-px w-full shrink-0 bg-[rgba(28,42,33,0.08)]" />
    <div className="flex w-full flex-wrap items-center gap-x-[8px] gap-y-[6px]">
      <button
        type="button"
        onClick={onReplay}
        className={classNames(
          'inline-flex cursor-pointer items-center gap-[6px] font-sans text-[13px] font-semibold leading-[1.2] whitespace-nowrap text-[#387440]',
          FOCUS_RING
        )}
      >
        <img src={iconPlay} alt="" aria-hidden="true" className="size-[16px]" />
        {HP_COPY.replay}
      </button>
      <span className="h-px min-w-px flex-1" />
      <span className="inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[1.2] text-[#595959]">
        {HP_COPY.shortcuts}
        <button
          type="button"
          onClick={onShortcuts}
          aria-label="Open keyboard shortcuts"
          className={classNames('cursor-pointer rounded-[6px]', FOCUS_RING)}
        >
          <Kbd>?</Kbd>
        </button>
      </span>
      <button
        type="button"
        onClick={onCentre}
        className={classNames(
          'inline-flex cursor-pointer items-center gap-[4px] font-sans text-[13px] font-semibold leading-[1.2] whitespace-nowrap text-[#387440]',
          FOCUS_RING
        )}
      >
        {HP_COPY.centre}
        <img src={iconArrow} alt="" aria-hidden="true" className="size-[14px]" />
      </button>
    </div>
  </>
);

const HelpPopoverFlow = ({ home, flow, q, pos, cardRef, close }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHelpPage = pathname === HELP_ROUTE;

  const query = flow === 'page' ? '' : (q ?? HP_DEFAULT_QUERY[flow] ?? '');
  const results = flow === 'page' ? [] : searchHelp(query);
  const view = flow === 'page' ? 'page' : results.length > 0 ? 'results' : 'none';
  log('render', { flow, query, view, results: results.length });

  const go = (state) => {
    log('go', state);
    if (onHelpPage) home.update({ help: state, q: null });
    else navigate(`${HELP_ROUTE}?help=${state}`);
  };

  const onType = (value) => {
    if (!value.trim()) {
      log('branch: empty query -> page');
      home.update({ help: 'page', q: null });
      return;
    }
    const next = searchHelp(value).length > 0 ? 'searching' : 'none';
    log('branch: query', { value, next });
    home.update({ help: next, q: value });
  };

  const openRow = (row) => {
    if (row.article) {
      go('article');
      return;
    }
    log('row without a drawn article', row.title);
  };

  const onCentre = () => {
    log('help centre');
    if (onHelpPage) home.update({ help: null, q: null });
    else navigate(HELP_ROUTE);
  };

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-40" onMouseDown={close} />
      <div
        ref={cardRef}
        role="dialog"
        aria-label="Help"
        tabIndex={-1}
        data-help-flow={view}
        className={classNames(
          'fixed z-50 flex w-[400px] max-w-[calc(100vw-24px)] flex-col items-start gap-[20px] overflow-y-auto rounded-[20px] border border-solid border-[rgba(28,42,33,0.12)] bg-white pb-[16px] pl-[20px] pr-[20px] pt-[20px] outline-none playful:gap-[24px] max-lg:!right-[12px]',
          'shadow-[0_16px_20px_rgba(28,42,33,0.16),0_2px_3px_rgba(28,42,33,0.06)]'
        )}
        style={{
          top: pos.top,
          right: pos.right,
          maxHeight: `calc(100dvh - ${pos.top}px - 12px)`,
        }}
      >
        <div className="flex w-full items-center gap-[12px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <h2 className={classNames('m-0 text-[22px] leading-[1.2] text-[#1c2a21]', HEADING)}>
              {HP_COPY.title}
            </h2>
            <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#595959]">
              {view === 'page' ? HP_COPY.subtitleDefault : HP_COPY.subtitleSearch}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close help"
            onClick={close}
            className={classNames(
              'flex shrink-0 cursor-pointer items-center justify-center rounded-full p-[8px]',
              FOCUS_RING
            )}
          >
            <img src={iconClose} alt="" aria-hidden="true" className="size-[18px]" />
          </button>
        </div>

        <label className="flex w-full items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pl-[14px] pr-[12px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
          <span className="flex size-[28px] shrink-0 items-center justify-center">
            <img src={iconSearch} alt="" aria-hidden="true" className="size-[20px]" />
          </span>
          <input
            type="search"
            value={query}
            placeholder={HP_COPY.search}
            aria-label="Search help"
            autoFocus={flow !== 'page'}
            onFocus={(e) => {
              const el = e.currentTarget;
              requestAnimationFrame(() => el.setSelectionRange?.(el.value.length, el.value.length));
            }}
            onChange={(e) => onType(e.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
          />
        </label>

        {view === 'page' && (
          <>
            <div className="flex w-full flex-col items-start gap-[8px]">
              <span className={SECTION_LABEL}>{HP_COPY.pageLabel}</span>
              {HP_PAGE_ROWS.map((r) => (
                <HelpRow key={r.id} icon={r.icon} title={r.title} onClick={() => openRow(r)} />
              ))}
            </div>
            <div className="flex w-full flex-col items-start gap-[8px]">
              <span className={SECTION_LABEL}>{HP_COPY.popularLabel}</span>
              {HP_POPULAR_ROWS.map((r) => (
                <HelpRow key={r.id} icon={r.icon} title={r.title} onClick={() => openRow(r)} />
              ))}
            </div>
            <div className="flex h-[51px] w-full items-center gap-[8px]">
              <HelpButton
                tone="primary"
                size="md"
                className="min-w-px flex-1"
                icon={<img src={iconBulb} alt="" aria-hidden="true" className="size-[20px]" />}
                onClick={() => log('ask buddy')}
              >
                {HP_COPY.buddy}
              </HelpButton>
              <HelpButton
                size="md"
                className="min-w-px flex-1"
                icon={<img src={iconWhatsapp} alt="" aria-hidden="true" className="size-[20px]" />}
                onClick={() => log('whatsapp')}
              >
                {HP_COPY.whatsapp}
              </HelpButton>
            </div>
          </>
        )}

        {view === 'results' && (
          <>
            <div className="flex w-full flex-col items-start gap-[16px]" aria-live="polite">
              <span className={SECTION_LABEL}>
                {`${results.length} ${results.length === 1 ? 'RESULT' : 'RESULTS'} FOR “${query.toUpperCase()}”`}
              </span>
              {results.map((r) => (
                <HelpRow
                  key={r.id}
                  icon={r.icon}
                  title={r.title}
                  preview={r.preview}
                  category={r.category}
                  query={query}
                  onClick={() => openRow(r)}
                />
              ))}
            </div>
            <div className="flex w-full items-center gap-[10px] overflow-hidden rounded-[12px] bg-[#faf4e8] px-[12px] py-[10px]">
              <span className="min-w-px flex-1 font-sans text-[13px] font-medium leading-[1.2] text-[#1c2a21]">
                {HP_COPY.notFound}
              </span>
              <HelpButton tone="primary" size="sm" onClick={() => log('ask buddy')}>
                {HP_COPY.buddy}
              </HelpButton>
            </div>
          </>
        )}

        {view === 'none' && (
          <>
            <div
              className="flex w-full flex-col items-center gap-[10px] pb-[4px] pt-[8px]"
              aria-live="polite"
            >
              <img src={spotSearch} alt="" aria-hidden="true" className="size-[96px]" />
              <p className="m-0 w-full text-center font-sans text-[16px] font-semibold leading-[1.2] text-[#1c2a21]">
                {`No answers for “${query}” yet`}
              </p>
              <p className="m-0 w-full text-center font-sans text-[13px] leading-[1.2] text-[#595959]">
                {HP_COPY.noResultsBody}
              </p>
            </div>
            <div className="flex h-[55px] w-full items-center gap-[8px]">
              <HelpButton
                tone="primary"
                size="md"
                className="min-w-px flex-1"
                icon={<img src={iconBulb} alt="" aria-hidden="true" className="size-[20px]" />}
                onClick={() => log('ask buddy')}
              >
                {HP_COPY.buddy}
              </HelpButton>
              <HelpButton
                size="md"
                className="min-w-px flex-1"
                icon={<HelpMailInkIcon className="size-[20px]" />}
                onClick={() => go('contact')}
              >
                {HP_COPY.contact}
              </HelpButton>
            </div>
            <button
              type="button"
              onClick={() => log('suggest a help article')}
              className={classNames(
                'flex w-full cursor-pointer items-center justify-center font-sans text-[13px] font-semibold leading-[1.2] text-[#387440]',
                FOCUS_RING
              )}
            >
              {HP_COPY.suggest}
            </button>
          </>
        )}

        <Footer
          onReplay={() => log('replay the tour')}
          onShortcuts={() => home.update({ help: 'shortcuts', q: null })}
          onCentre={onCentre}
        />
      </div>
    </>
  );
};

export default HelpPopoverFlow;
