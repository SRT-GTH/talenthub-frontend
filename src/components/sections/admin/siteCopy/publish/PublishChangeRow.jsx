import { classNames } from '../../../../../utils/classNames.js';
import { PublishEditIcon, PublishWarningIcon } from './PublishIcons.jsx';

/*
 * PublishChangeRow — one row of the change list (Figma "change" 11023:76354 / "blocker" 11023:81677): a 16px icon, a 14/600 title and a
 * 12.5 detail line. tone 'change' = #f8f8f4 row with the amber edit glyph (#8a6100) and the "before → after" line; tone 'blocker' =
 * #f9ebea@50 row with the red warning glyph, a #c0392b title and an ink detail.
 */
const PublishChangeRow = ({ title, detail, tone = 'change' }) => {
  const blocker = tone === 'blocker';
  const Glyph = blocker ? PublishWarningIcon : PublishEditIcon;
  return (
    <li
      className={classNames(
        'm-0 flex list-none items-center gap-[10px] rounded-[12px] p-[12px]',
        blocker ? 'bg-[#f9ebea]/50' : 'bg-[#f8f8f4]'
      )}
    >
      <Glyph
        className={classNames(
          'size-[16px] shrink-0',
          blocker ? 'text-[#b42318]' : 'text-[#8a6100]'
        )}
      />
      <div className={classNames('flex min-w-0 flex-col', blocker ? 'gap-[3px]' : 'gap-[2px]')}>
        <span
          className={classNames(
            'font-sans text-[14px] font-semibold',
            blocker ? 'leading-[19px] text-[#c0392b]' : 'leading-[17px] text-[#1c2a21]'
          )}
        >
          {title}
        </span>
        <span
          className={classNames(
            'font-sans text-[12.5px] [overflow-wrap:anywhere] max-lg:text-[12px]',
            blocker ? 'leading-[15px] text-[#1c2a21]' : 'leading-[18px] text-[#575755]'
          )}
        >
          {detail}
        </span>
      </div>
    </li>
  );
};

export default PublishChangeRow;
