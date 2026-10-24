import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { PublicIconSearch } from '../publicDataIcons.jsx';
import { PublicIconWarning } from '../ui/publicUiIcons.jsx';
import { STATUS_PAGES, SERVICE_STATUS_PATH } from './data/statusData.js';
import {
  PublicIconStatusClock,
  PublicIconStatusCompass,
  PublicIconStatusSettings,
} from './statusIcons.jsx';

const log = debug('StatusMessage');

/*
 * StatusMessage — the centred message block of the three status pages (Figma 8.9.3b/c/d: "body" p 120/0, "message" 640 wide, gap 14, centred).
 * disc 72 (p18, icon 36) · eyebrow 13/600 +1.04 tracking #595959 · h1 36/43 600 -0.36 · message 17/26 #595959 (max 600) · actions (gap 12, pt 10).
 * Props
 *   kind      '404' | '500' | 'maintenance'   picks copy (data/statusData.js), icon disc and actions
 *   onRetry   fn()   500 "Try again" (default: reload the page)
 *   onNotify  fn()   maintenance "Get notified when we’re back" (the page opens the digest dialog)
 *   onDownload fn()  maintenance "Download last snapshot (PDF)" (the page opens the download dialog)
 * Navigation: 404 primary -> /data, "Browse regions" -> /data/regions, the 404 search submits to /data?q=…  (⚠️ ASSUMPTION: no results page drawn).
 * The title is the page's single <h1>.
 */

const DISC = {
  404: { bg: 'bg-[#ebf1ec]', fg: 'text-[#387440]', Icon: PublicIconStatusCompass },
  500: { bg: 'bg-[#f9ebea]', fg: 'text-[#9f2a1e]', Icon: PublicIconWarning },
  maintenance: { bg: 'bg-[#faf4e8]', fg: 'text-[#9a3d12]', Icon: PublicIconStatusSettings },
};

const PRIMARY = '!px-[18px] !py-[12px] !rounded-[10px]';
const SECONDARY = '!rounded-[14px] !px-[22px] !py-[12px]';

const StatusMessage = ({ kind = '404', onRetry, onNotify, onDownload }) => {
  const copy = STATUS_PAGES[kind] ?? STATUS_PAGES[404];
  const { bg, fg, Icon } = DISC[kind] ?? DISC[404];
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const go = (to) => () => {
    log('navigate', to);
    navigate(to);
  };
  const retry = () => {
    log('retry');
    if (onRetry) onRetry();
    else window.location.reload();
  };
  const submitSearch = (event) => {
    event.preventDefault();
    const q = query.trim();
    log('search', { hasQuery: Boolean(q) });
    navigate(q ? `/data?q=${encodeURIComponent(q)}` : '/data');
  };

  let primary = go('/data');
  let secondary = go('/data/regions');
  if (kind === '500') {
    primary = retry;
    secondary = go(SERVICE_STATUS_PATH);
  } else if (kind === 'maintenance') {
    primary = () => onNotify?.();
    secondary = () => onDownload?.();
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-[14px] px-[16px] py-[48px] text-center font-sans md:px-[32px] md:py-[80px] xl:py-[120px]">
      <span
        aria-hidden="true"
        className={`flex size-[72px] items-center justify-center rounded-full ${bg} ${fg}`}
      >
        <Icon className="size-[36px]" />
      </span>
      <p className="m-0 text-[13px] leading-[16px] font-semibold tracking-[1.04px] text-[#595959] uppercase">
        {copy.eyebrow}
      </p>
      {copy.window ? (
        <p className="m-0 inline-flex items-center gap-[10px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[16px] py-[10px] text-[14px] leading-[17px] font-medium text-[#1c2a21]">
          <PublicIconStatusClock className="size-[16px] shrink-0 text-[#70706e]" />
          {copy.window}
        </p>
      ) : null}
      <h1 className="m-0 text-[28px] leading-[34px] font-semibold tracking-[-0.36px] text-[#1c2a21] md:text-[36px] md:leading-[43px]">
        {copy.title}
      </h1>
      <p className="m-0 max-w-[600px] text-[16px] leading-[24px] text-[#595959] md:text-[17px] md:leading-[26px]">
        {copy.message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[10px]">
        <Button type="button" variant="primary" size="sm" onClick={primary} className={PRIMARY}>
          {copy.primaryLabel}
        </Button>
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={secondary}
          className={SECONDARY}
        >
          {copy.secondaryLabel}
        </Button>
      </div>
      {copy.reference ? (
        <p className="m-0 pt-[0px] text-[13px] leading-[16px] font-medium text-[#595959]">
          {copy.reference}
        </p>
      ) : null}
      {kind === '404' ? (
        <form
          role="search"
          onSubmit={submitSearch}
          className="flex h-[44px] w-full max-w-[440px] items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[16px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]"
        >
          <PublicIconSearch className="size-[18px] shrink-0 text-[#70706e]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[15px] leading-[18px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
          />
        </form>
      ) : null}
    </div>
  );
};

export default StatusMessage;
