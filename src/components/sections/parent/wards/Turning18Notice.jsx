import { useEffect, useRef } from 'react';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotCalendar from '../../../../assets/parent/spot-calendar.svg';
import closeIcon from '../../../../assets/parent/ward-close.svg';
import iconUser from '../../../../assets/parent/ward-user.svg';
import iconShield from '../../../../assets/parent/ward-shield.svg';
import iconUsers from '../../../../assets/parent/ward-users.svg';
import iconWallet from '../../../../assets/parent/ward-wallet.svg';

const log = debug('Turning18Notice');

/*
 * Turning18Notice — PW-10 "Ward turning 18 soon (notice)" 10041:4106: modal "modal · Abena turns 18 on 12 March" over the Abena overview.
 * Scrim rgba(28,42,33,.55); card 560 wide, white, border rgba(28,42,33,.1), r24, p28, gap16, shadow 0 24 48 rgba(28,42,33,.12);
 * top row: Spot calendar 80 + close 36 (#f8f8f4); title 24/600; intro 14 #575755; info card (#ebf1ec r24 p18 gap16) of four 13.5/500 rows with 18px icons; buttons right: "Got it" secondary, primary CTA.
 * Props: ward (needs ward.turning18), onClose, onPrimary.
 * ⚠️ ASSUMPTION: centered in the viewport (Figma pins it at top 296 of a 1117 frame); Esc and scrim click close it.
 */
const ICONS = { user: iconUser, shield: iconShield, users: iconUsers, wallet: iconWallet };

const Turning18Notice = ({ ward, onClose, onPrimary }) => {
  const n = ward.turning18;
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    log('mount', ward.id);
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ward.id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-[16px]">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(28,42,33,0.55)]"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="turning18-title"
        tabIndex={-1}
        className="relative flex w-full max-w-[560px] flex-col gap-[16px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[28px] shadow-[0_24px_48px_rgba(28,42,33,0.12),0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] outline-none"
      >
        <div className="flex items-start justify-between">
          <img src={spotCalendar} alt="" className="size-[80px]" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-[36px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <img src={closeIcon} alt="" className="size-[16px]" />
          </button>
        </div>
        <h2
          id="turning18-title"
          className="m-0 font-sans text-[24px] leading-normal font-semibold text-[#1c2a21]"
        >
          {n.title}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[1.45] text-[#575755]">{n.intro}</p>
        <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[24px] bg-[#ebf1ec] p-[18px]">
          {n.points.map((p) => (
            <li key={p.icon} className="flex items-center gap-[10px]">
              <img src={ICONS[p.icon]} alt="" className="size-[18px] shrink-0" />
              <span className="min-w-0 flex-1 font-sans text-[13.5px] leading-normal font-medium text-[#1c2a21]">
                {p.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-end gap-[12px] py-[8px]">
          <ParentButton variant="secondary" onClick={onClose}>
            Got it
          </ParentButton>
          <ParentButton
            variant="primary"
            onClick={() => {
              onPrimary?.();
              onClose();
            }}
          >
            {n.cta}
          </ParentButton>
        </div>
      </div>
    </div>
  );
};

export default Turning18Notice;
