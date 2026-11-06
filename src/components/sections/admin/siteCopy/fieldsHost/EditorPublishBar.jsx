import { Link } from 'react-router-dom';
import { EyeIcon } from '../fields/FieldsIcons.jsx';
import FieldButton from '../fields/FieldButton.jsx';

/*
 * EditorPublishBar — the sticky dark bar at the bottom of the Site copy editor (Figma "publish bar (sticky)": #1c2a21, r18, 14 / 20 padding, 14 gap, soft shadow):
 * an amber dot, "1 unpublished change" 15 / 600 white, the section crumb "Home › How it works" 13 #bfbfbf, then "Preview" (outlined, green eye), "Discard" (outlined)
 * and the green "Publish". It floats 88 px above the bottom (clear of the Ask Buddy button, as drawn). ⚠️ ASSUMPTION: the plural "N unpublished changes" for more than one. Below md the actions wrap under the text.
 * Props: count, crumb, previewHref, onDiscard(), onPublish().
 */
const EditorPublishBar = ({ count, crumb, previewHref, onDiscard, onPublish }) => (
  <div
    role="region"
    aria-label="Unpublished changes"
    className="sticky bottom-[88px] z-30 flex flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[18px] bg-[#1c2a21] px-[20px] py-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.25)] max-sm:px-[14px]"
  >
    <span aria-hidden="true" className="size-[10px] shrink-0 rounded-full bg-[#c8951a]" />
    <span className="font-sans text-[15px] leading-[18px] font-semibold text-white">
      {count} unpublished {count === 1 ? 'change' : 'changes'}
    </span>
    <span className="min-w-0 font-sans text-[13px] leading-[16px] text-[#bfbfbf]">{crumb}</span>
    <span className="flex-1" />
    <div className="flex flex-wrap items-center gap-[14px] max-sm:w-full">
      <Link
        to={previewHref}
        className="inline-flex min-h-[44px] items-center gap-[6px] rounded-[12px] border border-solid border-white/35 px-[16px] font-sans text-[15px] leading-[18px] font-semibold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <EyeIcon className="size-[16px] text-[#387440]" />
        Preview
      </Link>
      <button
        type="button"
        onClick={onDiscard}
        className="inline-flex min-h-[44px] cursor-pointer items-center rounded-[12px] border border-solid border-white/35 bg-transparent px-[16px] font-sans text-[15px] leading-[18px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Discard
      </button>
      <FieldButton tone="primary" size="lg" className="max-sm:flex-1" onClick={onPublish}>
        Publish
      </FieldButton>
    </div>
  </div>
);

export default EditorPublishBar;
