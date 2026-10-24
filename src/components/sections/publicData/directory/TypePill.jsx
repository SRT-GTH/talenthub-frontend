import { classNames } from '../../../../utils/classNames.js';
import { TYPE_STYLES } from './data/directoryData.js';

/*
 * TypePill — the small rounded label of the directories (Figma "type" frames: 8498:109 "NGO", 8498:349095 "Job", mobile 8508:471).
 * H gap 8, p 4/10, r100, label 12/14 600 (Figma mobile list cards draw 11/13; raised to the 12px floor); fill + text colour per type
 * (TYPE_STYLES in data/directoryData.js).
 * Props: type (id of PARTNER_TYPES / OPPORTUNITY_TYPES), label, className.
 */

const TypePill = ({ type, label, className }) => {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.employer;
  return (
    <span
      className={classNames(
        'inline-flex w-fit items-center rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold whitespace-nowrap',
        className
      )}
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      {label}
    </span>
  );
};

export default TypePill;
