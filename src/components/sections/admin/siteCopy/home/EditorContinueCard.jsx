import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import SiteCopyChip from '../browse/SiteCopyChip.jsx';
import SiteCopyShelfButton from '../browse/SiteCopyShelfButton.jsx';
import { CONTINUE_SAVED } from './editorHomeData.js';

const log = debug('EditorContinueCard');

/*
 * EditorContinueCard — "Continue where you left off" (7.8.0a): white card (r20, p24, gap 14, 1px ink@.10) with the title (19/600), "Saved as draft 10 min ago" on the
 * right and one #f8f8f4 r14 row per draft (p14, gap 14): path 15/600 + line 13/400 on the left, the "N changes" chip and a white "Open" shelf button that fills the rest
 * of the row and goes to the section editor. Props: rows [{ sectionId, path, hint, changes, to }].
 */
const EditorContinueCard = ({ rows }) => {
  useEffect(() => {
    log('render', { rows: rows.length });
  }, [rows.length]);
  return (
    <section
      aria-labelledby="editor-continue"
      className="flex flex-col gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,1.8vw,24px)] font-sans"
    >
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
        <h2
          id="editor-continue"
          className="m-0 text-[19px] leading-[23px] font-semibold text-[#1c2a21]"
        >
          Continue where you left off
        </h2>
        <span className="flex-1" />
        <span className="text-[13px] leading-[16px] font-medium text-[#575755]">
          {CONTINUE_SAVED}
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
        {rows.map((r) => (
          <li
            key={r.sectionId}
            className="flex flex-col gap-[12px] rounded-[14px] bg-[#f8f8f4] p-[14px] sm:flex-row sm:items-center sm:gap-[14px]"
          >
            <div className="flex min-w-0 flex-col gap-[3px] sm:flex-1">
              <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {r.path}
              </span>
              <span className="text-[13px] leading-[16px] text-[#575755]">{r.hint}</span>
            </div>
            <span className="flex items-center gap-[14px] sm:contents">
              <SiteCopyChip
                kind="count"
                label={r.changes === 1 ? '1 change' : `${r.changes} changes`}
              />
              <SiteCopyShelfButton
                size="md"
                to={r.to}
                aria-label={`Open ${r.path}`}
                className="flex-1 sm:w-[588px] sm:max-w-[48%] sm:flex-none"
              >
                Open
              </SiteCopyShelfButton>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EditorContinueCard;
