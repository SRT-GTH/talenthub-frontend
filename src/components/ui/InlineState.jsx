import { classNames } from '../../utils/classNames.js';

/*
 * InlineState — the empty / error / blocked state that replaces a dashboard widget body (Figma "Empty state" frames in 10084:84047 empty, 10084:85289 suspended, 10084:86395 load error).
 * A dashed, tinted box: 56px tile with a 26px glyph, a 16/600 title, a 14px message and an action row.
 * tone: 'mint' (#ebf1ec tile, empty) | 'danger' (#f9ebea tile and a faint red box, suspended / error).
 * Props: tone, icon (an <img> src), title, actions (node), className, children (the message).
 */
const TONES = {
  mint: { box: 'border-[#c1d4c4] bg-[#fafcfa]', tile: 'bg-[#ebf1ec]' },
  danger: { box: 'border-[#ebc2bd] bg-[#f9ebea]/40', tile: 'bg-[#f9ebea]' },
};

const InlineState = ({ tone = 'mint', icon, title, actions, className, children }) => {
  const style = TONES[tone] ?? TONES.mint;
  return (
    <div
      className={classNames(
        'flex flex-col items-center gap-[20px] rounded-[16px] border border-dashed px-[24px] py-[48px] text-center max-sm:px-[8px] max-sm:py-[32px]',
        style.box,
        className
      )}
    >
      <div className="flex flex-col items-center gap-[10px]">
        <span
          className={classNames(
            'flex size-[56px] items-center justify-center rounded-[16px]',
            style.tile
          )}
        >
          {icon ? <img src={icon} alt="" aria-hidden="true" className="size-[26px]" /> : null}
        </span>
        <h3 className="m-0 font-sans text-[16px] leading-[28px] font-semibold text-[#111]">
          {title}
        </h3>
        <p className="m-0 max-w-[480px] font-sans text-[14px] leading-[24px] text-[#575755]">
          {children}
        </p>
      </div>
      {actions}
    </div>
  );
};

export default InlineState;
