import { debug } from '../../../../../utils/debug.js';
import { CopyLabelIcon } from '../siteCopyIcons.jsx';
import { LinkIcon } from './SyncIcons.jsx';

const log = debug('SyncRichToolbar');

/*
 * SyncRichToolbar — the formatting strip of a rich text field (Figma "format toolbar": #f8f8f4, r10, 4 padding, 2 gap; tools B · I · • · 1. · link, a
 * 1px #e7e7e7 divider, then "Insert name" #2a5730 with the label glyph). ⚠️ ASSUMPTION: this release-sync page only previews the editor, so the tools
 * log the press (the Section editor of the Site copy area carries the real formatting).
 */
const TOOL =
  'inline-flex min-h-[27px] min-w-[24px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border-0 bg-transparent px-[10px] py-[5px] font-sans text-[14px] leading-[17px] text-[#1c2a21] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]';

const SyncRichToolbar = () => {
  const press = (name) => () => log('tool pressed (preview only)', name);
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex w-max max-w-full flex-wrap items-center gap-[2px] rounded-[10px] bg-[#f8f8f4] p-[4px]"
    >
      <button
        type="button"
        aria-label="Bold"
        onClick={press('bold')}
        className={`${TOOL} font-bold`}
      >
        B
      </button>
      <button
        type="button"
        aria-label="Italic"
        onClick={press('italic')}
        className={`${TOOL} font-medium`}
      >
        I
      </button>
      <button
        type="button"
        aria-label="Bulleted list"
        onClick={press('bullets')}
        className={`${TOOL} font-semibold`}
      >
        •
      </button>
      <button
        type="button"
        aria-label="Numbered list"
        onClick={press('numbers')}
        className={`${TOOL} font-semibold`}
      >
        1.
      </button>
      <button type="button" aria-label="Link" onClick={press('link')} className={TOOL}>
        <LinkIcon className="size-[16px]" />
      </button>
      <span aria-hidden="true" className="mx-[2px] h-[20px] w-px bg-[#e7e7e7]" />
      <button
        type="button"
        onClick={press('insert-name')}
        className={`${TOOL} text-[13px] font-semibold text-[#2a5730]`}
      >
        <CopyLabelIcon className="size-[16px]" />
        Insert name
      </button>
    </div>
  );
};

export default SyncRichToolbar;
