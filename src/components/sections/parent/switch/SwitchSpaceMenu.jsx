import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../utils/debug.js';
import emma from '../../../../assets/parent/emma.webp';
import checkIcon from '../../../../assets/parent/switch-check.svg';
import userIcon from '../../../../assets/parent/switch-user.svg';
import shieldIcon from '../../../../assets/parent/switch-shield.svg';
import { SWITCH_MENU } from './switchData.js';

const log = debug('SwitchSpaceMenu');

/*
 * SwitchSpaceMenu — "Switch space menu" (Figma 10036:142898 on the parent home PD-02, and the same menu on the talent home TC-02): 320 wide, p10/8/12, gap 12, r18, #1c2a21 at 10 % hairline and the
 * three-layer shadow; the 10/700 "SWITCH SPACE" label, two 56-high rows (the current one mint with a check) and a note under a hairline.
 * It opens beside the profile card: a portal at the card's right edge (card left + 212, top + 142 as drawn), closing on Esc or an outside click.
 * Props: anchorRef (the persona card), current ('parent' | 'career'), onClose, onSelect(space), offset ({ left, top } from the card: parent home 212 / 142, talent home 8 / 130 as TC-02 draws it),
 * parentChip (TC-02 shows "4 to review" on the Parent view row). A row for the space you are in only closes the menu.
 * lines (live): { parent, career, photo } replace the Emma copy; photo null shows the parent glyph instead of her photo.
 */
const SwitchSpaceMenu = ({
  anchorRef,
  current = 'parent',
  onClose,
  onSelect,
  offset = { left: 212, top: 142 },
  parentChip,
  lines,
}) => {
  const parentLine = lines ? lines.parent : SWITCH_MENU.parent.line;
  const careerLine = lines ? lines.career : SWITCH_MENU.career.line;
  const careerChip = lines ? null : SWITCH_MENU.career.chip;
  const parentPhoto = lines ? lines.photo : emma;
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const r = anchorRef?.current?.getBoundingClientRect();
    if (r) setPos({ left: r.left + offset.left, top: r.top + offset.top });
    log('position', r && { left: r.left, top: r.top });
  }, [anchorRef, offset.left, offset.top]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.querySelector('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [onClose, anchorRef]);

  const pick = (space) => {
    log('pick', space);
    if (space === current) onClose();
    else onSelect?.(space);
  };

  const row = (space, leading, title, line, trailing) => {
    const selected = current === space;
    return (
      <button
        type="button"
        role="menuitemradio"
        aria-checked={selected}
        onClick={() => pick(space)}
        className={`flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border-0 p-[10px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440] ${selected ? 'bg-[#ebf1ec]' : 'bg-transparent'}`}
      >
        {leading}
        <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{title}</span>
          <span className="text-[12px] leading-[14px] text-[#575755]">{line}</span>
        </span>
        {trailing}
      </button>
    );
  };

  const tick = <img src={checkIcon} alt="" className="size-[18px] shrink-0" />;

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label="Switch space"
      style={pos ? { left: pos.left, top: pos.top } : { visibility: 'hidden' }}
      className="fixed z-[60] flex w-[320px] max-w-[calc(100vw-16px)] flex-col gap-[12px] rounded-[18px] border border-solid border-[#1c2a21]/10 bg-white px-[8px] pt-[10px] pb-[12px] font-sans shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04),0_24px_48px_rgba(28,42,33,0.12)]"
    >
      <p className="m-0 pt-[4px] pr-0 pb-[6px] pl-[10px] text-[10px] leading-[12px] font-bold tracking-[0.8px] text-[#575755]">
        {SWITCH_MENU.heading}
      </p>
      <div className="flex flex-col">
        {row(
          'parent',
          parentPhoto ? (
            <img
              src={parentPhoto}
              alt=""
              className="size-[36px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec]">
              <img src={shieldIcon} alt="" className="size-[18px]" />
            </span>
          ),
          SWITCH_MENU.parent.title,
          parentLine,
          current === 'parent' ? (
            tick
          ) : parentChip ? (
            <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#387440]">
              {parentChip}
            </span>
          ) : null
        )}
        {row(
          'career',
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#387440]">
            <img src={userIcon} alt="" className="size-[18px]" />
          </span>,
          SWITCH_MENU.career.title,
          careerLine,
          current === 'career' ? (
            tick
          ) : careerChip ? (
            <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] leading-[16px] font-semibold text-[#387440]">
              {careerChip}
            </span>
          ) : null
        )}
      </div>
      <span className="h-px w-full bg-[#e7e7e7]" aria-hidden="true" />
      <p className="m-0 flex items-start gap-[8px] px-[10px] text-[11.5px] leading-[14px] text-[#575755]">
        <img src={shieldIcon} alt="" className="mt-[2px] size-[16px] shrink-0" />
        <span>{SWITCH_MENU.note}</span>
      </p>
    </div>,
    document.body
  );
};

export default SwitchSpaceMenu;
