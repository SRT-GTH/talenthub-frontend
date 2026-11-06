import { Link } from 'react-router-dom';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import SyncChip from './SyncChip.jsx';
import { EyeIcon, HistoryIcon } from './SyncIcons.jsx';

/*
 * SyncPaneHead — the head of a section pane (Figma "section head"): the breadcrumb (13/500 #575755, current part 13/600 #1c2a21, "›" between), the title
 * 22/600 with its status chip, and the "History" / "Preview" links (34 high, 1px #e7e7e7, r10, 13.5/600; Preview is hidden for a removed section).
 * Props: ctx, sectionId, path [..], title, chip (tone), removed.
 */
const LINK =
  'inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] no-underline hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const SyncPaneHead = ({ ctx, sectionId, path, title, chip, removed = false }) => (
  <div className="flex flex-col gap-[10px]">
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap items-center gap-[6px] p-0 font-sans text-[13px] leading-[16px] font-medium text-[#575755]">
        {path.map((part, i) => (
          <li key={part} className="flex items-center gap-[6px]">
            {i > 0 ? <span aria-hidden="true">›</span> : null}
            <span
              aria-current={i === path.length - 1 ? 'page' : undefined}
              className={i === path.length - 1 ? 'font-semibold text-[#1c2a21]' : undefined}
            >
              {part}
            </span>
          </li>
        ))}
      </ol>
    </nav>
    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px]">
      <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
        {title}
      </h2>
      <SyncChip tone={chip} />
      <span className="flex-1" />
      <Link to={copyUrl(ctx, COPY_PATHS.history(sectionId))} className={LINK}>
        <HistoryIcon className="size-[16px] shrink-0" />
        History
      </Link>
      {removed ? null : (
        <Link to={copyUrl(ctx, COPY_PATHS.preview(sectionId))} className={LINK}>
          <EyeIcon className="size-[16px] shrink-0 text-[#387440]" />
          Preview
        </Link>
      )}
    </div>
  </div>
);

export default SyncPaneHead;
