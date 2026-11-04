import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { copyPreviewToken } from '../../../../../services/siteCopy.api.js';
import { flushSection } from '../live/copyLive.js';

const log = debug('LivePagePreview');

/*
 * LivePagePreview — the real public page in the preview frame (live mode, see live/copyLive.js). "My draft" loads the page with a
 * 30-minute staff preview token (`?copyPreview=`, the page then reads the drafts from GET /api/copy/bundle?preview=); "What everyone
 * sees now" loads it without one. The page scrolls to the section being previewed.
 * Props: sectionId, view ('draft' | 'published'), device.
 */
const PAGE_OF = { home: '/' };
const ANCHOR_OF = {
  'public.home.hero': 'lp-hero',
  'public.home.how-it-works': 'lp-how',
  'public.home.features': 'lp-features',
  'public.home.made-for-ghana': 'made-for-ghana',
  'public.home.faq': 'faq',
};
const HEIGHT = { desktop: 900, tablet: 1000, phone: 760 };

const livePreviewUrl = (sectionId, token) => {
  const page = PAGE_OF[String(sectionId).split('.')[1]] ?? '/';
  const q = token ? `?copyPreview=${encodeURIComponent(token)}` : '';
  const anchor = ANCHOR_OF[sectionId];
  return `${page}${q}${anchor ? `#${anchor}` : ''}`;
};

const LivePagePreview = ({ sectionId, view, device }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (view !== 'draft') return undefined;
    let alive = true;
    // Pending typing goes out first, so the preview shows the latest draft.
    Promise.resolve(flushSection(sectionId))
      .then(() => copyPreviewToken())
      .then((r) => {
        if (alive) setToken(r?.token ?? null);
      })
      .catch((e) => {
        log('preview token failed', e?.message);
        if (alive) setError('Couldn’t open the preview. Try again.');
      });
    return () => {
      alive = false;
    };
  }, [sectionId, view]);

  if (error) return <p className="m-0 p-6 font-sans text-[15px] text-[#8a1c1c]">{error}</p>;
  if (view === 'draft' && !token) {
    return <p className="m-0 p-6 font-sans text-[15px] text-[#595959]">Opening the preview…</p>;
  }
  const src = livePreviewUrl(sectionId, view === 'draft' ? token : null);
  return (
    <div className="flex flex-col">
      <iframe
        key={src}
        src={src}
        title={view === 'draft' ? 'The page with your draft' : 'The page as everyone sees it'}
        onLoad={(e) => {
          // The page draws its sections after load; jump to the one being previewed once it is there.
          const anchor = ANCHOR_OF[sectionId];
          const win = e.currentTarget.contentWindow;
          if (!anchor || !win) return;
          let tries = 0;
          const jump = () => {
            const el = win.document.getElementById(anchor);
            if (el) el.scrollIntoView({ block: 'start' });
            else if ((tries += 1) < 20) win.setTimeout(jump, 150);
          };
          jump();
        }}
        className="block w-full border-0"
        style={{ height: HEIGHT[device] ?? HEIGHT.desktop }}
      />
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="self-end px-4 py-2 font-sans text-[13px] font-semibold text-[#387440] underline underline-offset-2"
      >
        Open in a new tab
      </a>
    </div>
  );
};

export default LivePagePreview;
