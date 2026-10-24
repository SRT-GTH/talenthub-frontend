import { useRef } from 'react';
import { createPortal } from 'react-dom';
import SharePreviewCard from './SharePreviewCard.jsx';
import { ShareIconClose } from './shareIcons.jsx';
import { SHARE_CARD } from './data/shareData.js';
import { useDialogBehaviour } from './useDialogBehaviour.js';

/*
 * SharePreviewSpec — Figma 8.8.2b "Link preview (how the link unfurls)" (8500:2428), a COMPONENT frame, not a product screen:
 * two chat bubbles showing the auto-generated preview image (1200×630) of a shared link — left the national snapshot, right a filtered view.
 * It is reachable at ?modal=share&preview=1 and drawn full-screen over the page (Esc closes). The real Open Graph image and the
 * <meta property="og:*"> tags need the backend / prerender (⚠️ not built: only this on-screen specimen).
 * Props: filters label (for the right-hand bubble), headline (talent count text), onClose().
 */

const Bubble = ({ title, headline, sub, metaTitle }) => (
  <div className="flex w-[540px] max-w-full flex-col overflow-hidden rounded-[18px] border border-solid border-[#e7e7e7] bg-white">
    <SharePreviewCard
      width={538}
      className="max-w-full"
      title={title}
      headline={headline}
      sub={sub}
    />
    <div className="flex flex-col gap-[4px] px-[16px] py-[14px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {metaTitle}
      </p>
      <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
        {SHARE_CARD.metaDescription}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
        {SHARE_CARD.metaHost}
      </p>
    </div>
  </div>
);

const SharePreviewSpec = ({ filtersTitle, filtersHeadline, onClose }) => {
  const containerRef = useRef(null);
  useDialogBehaviour(containerRef, onClose);
  return createPortal(
    <div
      data-share-dialog=""
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-preview-spec-title"
      tabIndex={-1}
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#f8f8f4] font-sans outline-none"
    >
      <div className="flex min-h-full flex-col gap-[24px] p-[24px] md:p-[48px]">
        <div className="flex items-start gap-[16px]">
          <h2
            id="share-preview-spec-title"
            className="m-0 flex-1 font-sans text-[28px] leading-[33px] font-semibold text-[#1c2a21]"
          >
            8.8.2b · Link preview
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f2f2ee] text-[#1a1a18] hover:bg-[#e7e7e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <ShareIconClose className="size-[18px]" />
          </button>
        </div>
        <p className="m-0 max-w-[1100px] font-sans text-[15px] leading-[22px] text-[#595959]">
          Every shareable URL has an auto-generated preview image (1200×630) that reflects the
          shared scope. Left: national snapshot. Right: a filtered view. Shown inside a generic chat
          bubble.
        </p>
        <div className="flex flex-wrap gap-[40px]">
          <Bubble
            title={SHARE_CARD.title}
            headline={SHARE_CARD.headline}
            sub={SHARE_CARD.sub}
            metaTitle={SHARE_CARD.metaTitle}
          />
          <Bubble
            title={filtersTitle}
            headline={filtersHeadline}
            sub="Filtered view · Ghana Talent Hub · updated 17 Oct 2026"
            metaTitle={`${filtersTitle} | Ghana Talent Hub`}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SharePreviewSpec;
