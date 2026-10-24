import { debug } from '../../../../utils/debug.js';
import {
  FILTER_KEY_NAMES,
  FILTER_LABEL_ORDER,
  SHARE_DEFAULT_PATH,
  SHARE_EMAIL_SUBJECT,
  SHARE_ORIGIN,
  SHARE_QUERY_KEYS,
  SHARE_SOURCE_KEY,
  SHARE_SOURCE_VALUE,
  getFilteredTalentCount,
  humanizeFilterValue,
} from './data/shareData.js';
import { formatCount } from '../publicDataFormat.js';

const log = debug('shareUrl');

/*
 * shareUrl — pure helpers that build the links of the Share dialog from the CURRENT page query (Theme 8, Figma 8.1.2 / 8.8.2).
 * Scope ids: 'view' (this view, with its filters) · 'national' (the whole national snapshot) · 'region' (the region page of the region filter).
 */

export const SCOPE_IDS = ['view', 'national', 'region'];

/** ?scope=filtered (the frame URL of 8.8.2a) is the same as 'view'. */
export const normaliseScope = (raw) => {
  if (raw === 'national' || raw === 'region') return raw;
  return 'view';
};

/** The five overview filters that are set in the query: { region: 'volta', interest: 'technology' }. */
export const readShareFilters = (params) =>
  Object.fromEntries(
    SHARE_QUERY_KEYS.map((key) => [key, params.get(key)]).filter(([, value]) => value)
  );

/** "Volta · Technology · 18–24" (empty string when no filter is set). */
export const filtersLabel = (filters) =>
  FILTER_LABEL_ORDER.filter((key) => filters[key])
    .map((key) => humanizeFilterValue(key, filters[key]))
    .join(' · ');

/** "Region: Ashanti, Interest: Technology" for the dialog footer, or "none". */
export const filtersSummary = (filters) => {
  const parts = FILTER_LABEL_ORDER.filter((key) => filters[key]).map(
    (key) => `${FILTER_KEY_NAMES[key]}: ${humanizeFilterValue(key, filters[key])}`
  );
  return parts.length ? parts.join(', ') : 'none';
};

/** "237 talents" with the suppression rule ("<5 talents" would leak; a zero match reads "0 talents"). */
export const talentsLabel = (filters) => {
  const count = getFilteredTalentCount(filters);
  return `${formatCount(count)} talents`;
};

const toQuery = (entries) => {
  const search = new URLSearchParams();
  entries.forEach(([key, value]) => search.set(key, value));
  search.set(SHARE_SOURCE_KEY, SHARE_SOURCE_VALUE);
  return search.toString();
};

/** The path + query shown under each option of the choose dialog (Figma 8500:2403 / 2409 / 2415). */
export const scopePathLabel = (scopeId, filters) => {
  if (scopeId === 'national') return '/snapshot';
  if (scopeId === 'region') return `/regions/${filters.region}`;
  const query = Object.entries(filters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return query ? `?${query}` : '/snapshot';
};

/** The full link for a scope. */
export const buildShareUrl = ({ scopeId, filters, path = SHARE_DEFAULT_PATH }) => {
  let url;
  if (scopeId === 'national') {
    url = `${SHARE_ORIGIN}/${SHARE_DEFAULT_PATH}?${toQuery([])}`;
  } else if (scopeId === 'region' && filters.region) {
    url = `${SHARE_ORIGIN}/regions/${filters.region}?${toQuery([])}`;
  } else {
    url = `${SHARE_ORIGIN}/${path}?${toQuery(Object.entries(filters))}`;
  }
  log('buildShareUrl', scopeId, url);
  return url;
};

/** "gh-talenthub.gov.gh/snapshot?src=share" — the link without its scheme, as the dialog draws it. */
export const displayUrl = (url) => url.replace(/^https?:\/\//, '');

/** Links of the channel tiles. `message` is the optional note typed by the person. */
export const buildChannelUrl = (channel, { url, message, title }) => {
  const text = [message?.trim(), url].filter(Boolean).join('\n\n');
  const subject = title || SHARE_EMAIL_SUBJECT;
  if (channel === 'email') {
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }
  if (channel === 'whatsapp') return `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (channel === 'x') {
    const tweet = message?.trim() || subject;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(url)}`;
  }
  if (channel === 'sms') return `sms:?&body=${encodeURIComponent(text)}`;
  return url;
};

/**
 * Copies text with the async Clipboard API. Resolves true on success; false when the API is missing or the browser refuses
 * (insecure context, denied permission) — the caller then opens the manual-copy dialog (Figma 8.1.2c).
 */
export const copyToClipboard = async (text) => {
  try {
    if (!navigator.clipboard?.writeText) {
      log('clipboard API unavailable');
      return false;
    }
    await navigator.clipboard.writeText(text);
    log('copied');
    return true;
  } catch (error) {
    log.warn('clipboard refused', error?.name);
    return false;
  }
};

/** Opens a channel link in a new tab without giving the target a handle to this page. */
export const openChannel = (href) => {
  if (href.startsWith('mailto:') || href.startsWith('sms:')) {
    window.location.href = href;
    return;
  }
  window.open(href, '_blank', 'noopener,noreferrer');
};
