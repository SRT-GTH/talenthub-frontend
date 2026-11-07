import { classNames } from '../../../utils/classNames.js';
import { menuRowsFor } from './pipelineBoardData.js';
import {
  MenuApplicationIcon,
  MenuMessageIcon,
  MenuMoveArrowIcon,
  MenuNotProgressingIcon,
  MenuProfileIcon,
  MenuScheduleIcon,
} from './pipelineStageIcons.jsx';

/*
 * PipelineCardMenu — the "..." popover of a board card (Figma "Tags" 10173:12710 in PL-02): 265 wide, r18, 0.7px #e6e6e6, 1px #e6e6e6 rules between rows,
 * 49px rows (two-line rows 61 / 75), 14/24 #737373 labels, 18px #babab7 icons, hover #f6f6f6, "Not progressing…" #c0392b.
 * `pinnedItem` pins the hover look (URL key menuItem). `align` right-aligns it for the last columns so it stays on screen.
 */
const ICONS = {
  profile: MenuProfileIcon,
  application: MenuApplicationIcon,
  message: MenuMessageIcon,
  move: MenuMoveArrowIcon,
  schedule: MenuScheduleIcon,
  'not-progressing': MenuNotProgressingIcon,
};

const PipelineCardMenu = ({ stageId, pinnedItem = null, align = 'left', onItem }) => (
  <div
    role="menu"
    aria-label="Candidate actions"
    data-testid="pipeline-card-menu"
    className={classNames(
      'absolute top-[20px] z-40 w-[min(265px,calc(100vw-32px))] overflow-hidden rounded-[18px] border-[0.7px] border-[#e6e6e6] bg-white py-[4px] shadow-[0_1px_4px_0_rgba(0,0,0,0.12)]',
      align === 'right' ? 'right-0' : 'left-[2px]'
    )}
  >
    {menuRowsFor(stageId).map((row, index) => {
      const Icon = ICONS[row.icon];
      return (
        <div key={row.id}>
          {index > 0 ? <div className="h-px w-full bg-[#e6e6e6]" /> : null}
          <button
            type="button"
            role="menuitem"
            data-testid={`pipeline-menu-item-${row.id}`}
            onClick={() => onItem(row)}
            className={classNames(
              'flex min-h-[49px] w-full cursor-pointer items-center gap-[12px] border-0 px-[16px] py-[12px] text-left font-sans tracking-[0.24px] transition-colors hover:bg-[#f6f6f6] focus-visible:bg-[#f6f6f6]',
              pinnedItem === row.id ? 'bg-[#f6f6f6]' : 'bg-transparent'
            )}
          >
            <Icon
              className={classNames(
                'size-[18px] shrink-0',
                row.destructive ? 'text-[#c0392b]' : 'text-[#babab7]'
              )}
            />
            <span className="flex min-w-0 flex-col gap-[6px]">
              <span
                className={classNames(
                  'text-[14px]',
                  row.sub ? 'leading-[17px]' : 'leading-[24px]',
                  row.destructive ? 'text-[#c0392b]' : row.sub ? 'text-[#575755]' : 'text-[#737373]'
                )}
              >
                {row.label}
              </span>
              {row.sub ? (
                <span className="text-[12px] leading-[14px] text-[#737373]">{row.sub}</span>
              ) : null}
            </span>
          </button>
        </div>
      );
    })}
  </div>
);

export default PipelineCardMenu;
