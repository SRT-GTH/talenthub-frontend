import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '../../../../hooks/useMediaQuery.js';
import { debug } from '../../../../utils/debug.js';
import { regionById } from '../regionsList.js';
import ShareChooseDialog from './ShareChooseDialog.jsx';
import ShareFallbackDialog from './ShareFallbackDialog.jsx';
import ShareMainDialog from './ShareMainDialog.jsx';
import SharePreviewSpec from './SharePreviewSpec.jsx';
import ShareSheet from './ShareSheet.jsx';
import { SHARE_CARD } from './data/shareData.js';
import {
  buildChannelUrl,
  buildShareUrl,
  copyToClipboard,
  filtersLabel,
  filtersSummary,
  normaliseScope,
  openChannel,
  readShareFilters,
  scopePathLabel,
  talentsLabel,
} from './shareUrl.js';

const log = debug('ShareDialog');

/*
 * ShareDialog — controller of the Share flow (Figma 8.1.2a-c, 8.8.2a-b, mobile sheet 8515:566), mounted by PublicDataModals for ?modal=share.
 * URL keys it reads: scope=filtered|view|national|region (which option of "What do you want to share?" is selected; filtered = view),
 *   state=fallback (open the manual-copy dialog), preview=1 (the link-unfurl specimen 8.8.2b).
 * Flow: filters applied (desktop/tablet) → choose dialog → Create link → share dialog; no filters → share dialog directly.
 *       Copy link → Clipboard API → toast (page behind) or, when refused / unavailable, the manual-copy dialog.
 *       Phone (< 768px) → the drawn bottom sheet; on a touch phone whose browser has the Web Share API and a fresh user gesture the
 *       native share menu opens instead and the sheet is skipped.
 * Props: data (usePublicDataState()), scope ({ title, filtersLabel, sharePath }), onClose(), onCopied().
 */

const canShareNatively = () =>
  typeof navigator !== 'undefined' &&
  typeof navigator.share === 'function' &&
  window.matchMedia?.('(pointer: coarse)').matches &&
  navigator.userActivation?.isActive === true;

const ShareDialog = ({ data, scope, onClose, onCopied }) => {
  const { params, update, state } = data;
  const isPhone = useMediaQuery('(max-width: 767px)');
  const filters = useMemo(() => readShareFilters(params), [params]);
  const hasFilters = Object.keys(filters).length > 0;
  const requested = normaliseScope(params.get('scope'));
  const scopeId = requested === 'region' && !filters.region ? 'view' : requested;
  const [step, setStep] = useState(hasFilters && !isPhone ? 'choose' : 'share');
  const [fallback, setFallback] = useState(state === 'fallback');
  const [nativeTried, setNativeTried] = useState(false);

  const label = scope?.filtersLabel ?? filtersLabel(filters);
  const url = buildShareUrl({ scopeId, filters, path: scope?.sharePath });
  const pageTitle = scope?.title ?? SHARE_CARD.title;

  const card = useMemo(() => {
    if (scopeId === 'view' && hasFilters) {
      return {
        title: label,
        headline: talentsLabel(filters),
        sub: 'Filtered view · Ghana Talent Hub · updated 17 Oct 2026',
      };
    }
    return {};
  }, [scopeId, hasFilters, label, filters]);

  useEffect(() => {
    log('mount', { scopeId, step, hasFilters, isPhone, fallback });
  }, [scopeId, step, hasFilters, isPhone, fallback]);

  // Phone + Web Share API + a user gesture: hand over to the phone's own share menu and skip the drawn sheet.
  useEffect(() => {
    if (!isPhone || nativeTried || fallback || !canShareNatively()) return;
    setNativeTried(true);
    log('navigator.share');
    navigator
      .share({ title: pageTitle, url })
      .then(() => onClose())
      .catch((error) => {
        log('navigator.share ended', error?.name);
        if (error?.name === 'AbortError') onClose();
      });
  }, [isPhone, nativeTried, fallback, pageTitle, url, onClose]);

  const copy = async () => {
    const ok = await copyToClipboard(url);
    if (ok) onCopied();
    else setFallback(true);
  };

  const channel = (id, message) => {
    log('channel', id);
    openChannel(buildChannelUrl(id, { url, message, title: pageTitle }));
  };

  const sheetApp = (id) => {
    if (id === 'copy') {
      copy();
    } else if (id === 'more') {
      if (typeof navigator.share === 'function') {
        navigator
          .share({ title: pageTitle, url })
          .catch((error) => log('share ended', error?.name));
      } else {
        // ⚠️ ASSUMPTION: without the Web Share API "More" falls back to copying the link.
        copy();
      }
    } else {
      channel(id);
    }
  };

  if (params.get('preview') === '1') {
    return (
      <SharePreviewSpec
        filtersTitle={hasFilters ? label : 'Volta · Technology · 18–24'}
        filtersHeadline={hasFilters ? talentsLabel(filters) : '237 talents'}
        onClose={onClose}
      />
    );
  }

  if (fallback) {
    return <ShareFallbackDialog url={url} onClose={onClose} />;
  }

  if (isPhone) {
    return (
      <ShareSheet url={url} title={pageTitle} card={card} onApp={sheetApp} onClose={onClose} />
    );
  }

  if (step === 'choose') {
    const regionName = filters.region ? (regionById(filters.region)?.name ?? filters.region) : null;
    const options = [
      {
        id: 'view',
        title: 'This view, with your filters',
        detail: `${label} · ${talentsLabel(filters)}`,
        extra: scopePathLabel('view', filters),
      },
      {
        id: 'national',
        title: 'The whole national snapshot',
        detail: 'All 16 regions, no filters',
        extra: scopePathLabel('national', filters),
      },
      ...(regionName
        ? [
            {
              id: 'region',
              title: `The ${regionName} region page`,
              detail: 'Regional deep dive',
              extra: scopePathLabel('region', filters),
            },
          ]
        : []),
    ];
    return (
      <ShareChooseDialog
        options={options}
        value={scopeId}
        onChange={(id) => update({ scope: id }, { replace: true })}
        onCreate={() => setStep('share')}
        onClose={onClose}
      />
    );
  }

  return (
    <ShareMainDialog
      url={url}
      summary={filtersSummary(scopeId === 'view' ? filters : {})}
      card={card}
      onCopy={copy}
      onChannel={channel}
      onClose={onClose}
    />
  );
};

export default ShareDialog;
