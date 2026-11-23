import { classNames } from '../../../utils/classNames.js';
import {
  CopyGlyph,
  EyeGlyph,
  LinkGlyph,
  PauseGlyph,
  PencilGlyph,
  PipelineGlyph,
  TrashGlyph,
  XCircleGlyph,
} from './jobIcons.jsx';

/*
 * PostingManageMenu — the "..." menu of a posting card once it has applicants (Figma JM-02 10117:58656): View posting, Open pipeline, Edit posting, Duplicate as template, Share link | Pause applications, Close posting | Delete posting (disabled once people applied, with the reason).
 * URL: /recruiter/job-postings?menu=<posting id>&menuKind=manage (the plain `?menu=` keeps the older 3-item menu of 7249:76889).
 * Props: onAction(id), deleteDisabledReason (when set, "Delete posting" is greyed with the note). Rows are 14px, #111 labels, a 16px glyph each; destructive "Close posting" #c0392b.
 */
const ROWS = [
  { id: 'view', label: 'View posting', icon: EyeGlyph },
  { id: 'pipeline', label: 'Open pipeline', icon: PipelineGlyph },
  { id: 'edit', label: 'Edit posting', icon: PencilGlyph },
  { id: 'duplicate', label: 'Duplicate as template', icon: CopyGlyph },
  { id: 'share', label: 'Share link', icon: LinkGlyph },
  { divider: true },
  { id: 'pause', label: 'Pause applications', icon: PauseGlyph },
  { id: 'close', label: 'Close posting', icon: XCircleGlyph, destructive: true },
  { divider: true },
];

const PostingManageMenu = ({ onAction, deleteDisabledReason, hoverId }) => (
  <div
    role="menu"
    className="absolute top-[33px] right-0 z-20 w-[240px] rounded-[12px] border border-solid border-[#e5e5e5] bg-white py-[6px] shadow-[0_8px_24px_rgba(15,15,10,0.14)]"
  >
    {ROWS.map((row, index) =>
      row.divider ? (
        <div key={`d${index}`} className="my-[6px] h-px w-full bg-[#e5e5e5]" />
      ) : (
        <button
          key={row.id}
          type="button"
          role="menuitem"
          onClick={() => onAction(row.id)}
          className={classNames(
            'flex h-[36px] w-full cursor-pointer items-center gap-[10px] border-0 px-[14px] text-left font-sans text-[14px] leading-[20px] hover:bg-[#f6f6f6]',
            hoverId === row.id ? 'bg-[#f6f6f6]' : 'bg-transparent',
            row.destructive ? 'text-[#c0392b]' : 'text-[#111]'
          )}
        >
          <row.icon size={18} />
          {row.label}
        </button>
      )
    )}
    <button
      type="button"
      role="menuitem"
      aria-disabled={deleteDisabledReason ? 'true' : undefined}
      disabled={Boolean(deleteDisabledReason)}
      onClick={() => onAction('delete')}
      className={classNames(
        'flex w-full items-start gap-[10px] border-0 bg-transparent px-[14px] py-[6px] text-left font-sans text-[14px] leading-[20px]',
        deleteDisabledReason ? 'text-[#babab7]' : 'cursor-pointer text-[#c0392b] hover:bg-[#f6f6f6]'
      )}
    >
      <TrashGlyph size={18} />
      <span className="flex flex-col">
        Delete posting
        {deleteDisabledReason ? (
          <span className="text-[12px] leading-[16px]">{deleteDisabledReason}</span>
        ) : null}
      </span>
    </button>
  </div>
);

export default PostingManageMenu;
