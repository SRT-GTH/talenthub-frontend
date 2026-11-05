import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { copyPreviewToken } from '../../../../../services/siteCopy.api.js';
import { COPY_SECTIONS } from '../../../../../copy/copyRegistry.js';
import { flushSection } from '../live/copyLive.js';

const log = debug('LivePagePreview');

/*
 * LivePagePreview — the real page in the preview frame (live mode, see live/copyLive.js), at the place the section declares
 * (copy/copySections.js `preview: { path, anchor }`). "My draft" loads it with a 30-minute staff preview token (`?copyPreview=`): the
 * page reads the drafts from GET /api/copy/bundle?preview= and the portals show their sample account instead of a signed-in one.
 * "What everyone sees now" loads it without a token. Props: sectionId, view ('draft' | 'published'), device.
 */
const HEIGHT = { desktop: 900, tablet: 1000, phone: 760 };

const previewUrl = (sectionId, token) => {
  const p = COPY_SECTIONS[sectionId]?.preview ?? {};
  const path = p.path ?? '/';
  const q = new URLSearchParams(p.query ?? {});
  if (token) q.set('copyPreview', token);
  const qs = q.toString();
  return `${path}${qs ? `?${qs}` : ''}${p.anchor ? `#${p.anchor}` : ''}`;
};

const LivePagePreview = ({ sectionId, view, device }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const anchor = COPY_SECTIONS[sectionId]?.preview?.anchor;

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
  const src = previewUrl(sectionId, view === 'draft' ? token : null);
  return (
    <div className="flex flex-col">
      <iframe
        key={src}
        src={src}
        title={view === 'draft' ? 'The page with your draft' : 'The page as everyone sees it'}
        onLoad={(e) => {
          // The page draws its sections after load; jump to the one being previewed once it is there.
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
