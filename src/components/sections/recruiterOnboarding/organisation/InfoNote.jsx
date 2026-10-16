import { ShieldOutlineIcon, WarningIcon } from './OrganisationIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';

/*
 * InfoNote - tinted note box.
 * Figma "Info note": green 7374:4165 / 4595 / 5290 (fill #ebf1ec @50%, stroke #387440
 * @25-30%, r10, p 16/12, gap 10, text 14/24 #2a5730, 18px shield) and amber 7374:5046
 * (fill #faf4e8, stroke #c8951a @30%, text #463409, warning glyph).
 * Props: tone 'green' | 'amber', icon (override glyph), role, children.
 */
const TONES = {
  green: {
    box: 'border-brand-green/30 bg-brand-green-light/50',
    text: 'text-brand-green-dark',
    icon: 'text-brand-green',
    Glyph: ShieldOutlineIcon,
  },
  amber: {
    box: 'border-accent/30 bg-accent-light',
    text: 'text-accent-darker',
    icon: 'text-accent',
    Glyph: WarningIcon,
  },
};

const InfoNote = ({ tone = 'green', icon, role, className, children }) => {
  const t = TONES[tone];
  const Glyph = t.Glyph;
  return (
    <div
      role={role}
      className={classNames(
        'flex w-full items-start gap-2.5 rounded-[10px] border px-4 py-3 text-left',
        t.box,
        className
      )}
    >
      <span className={classNames('mt-[3px] inline-flex size-[18px] shrink-0', t.icon)}>
        {icon ?? <Glyph className="size-full" />}
      </span>
      <p
        className={classNames(
          'font-sans text-[14px] leading-6 max-md:text-[13px] max-md:leading-5',
          t.text
        )}
        style={{ letterSpacing: '0.2px' }}
      >
        {children}
      </p>
    </div>
  );
};

export default InfoNote;
