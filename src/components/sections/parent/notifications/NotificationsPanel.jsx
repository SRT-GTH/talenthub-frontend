import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { PANEL } from './data/notificationsData.js';
import { SPACES_PANEL } from '../switch/switchData.js';
import iconUserSolo from '../../../../assets/parent/notif-user.svg';
import iconSpacesUsers from '../../../../assets/parent/spaces-users.svg';
import iconSpacesUser from '../../../../assets/parent/spaces-user.svg';

const log = debug('NotificationsPanel');

/*
 * NotificationsPanel — PN-01 "Notifications (panel)" (Figma 10035:530, panel 10035:1303): the bell pop-up over the parent home. 460 wide, white, 1px #e7e7e7, r24, p 18 / 20 / 12 / 20, gap 12,
 * shadow 0 12 36; header "Notifications" 20/600 + "Mark all read" 13/600 green; five rows (icon tile 40 #eef4ef r12 · title 15/600 over a 13/400 #575755 line, 14px gap, hairline #eeeee9 between rows).
 * Figma places it at x 1098..1558 of the 1728 frame, 78px under the top of the page: `right` is that 170px as a clamp so it stays under the bell on narrower screens.
 * Props: onClose, both (PN-02, `?spaces=both`: a parent who is also a talent — filter chips All · 7 / Parent · 5 / My career · 2, a space chip on each row and the two My career rows on top).
 * A11y: non-modal dialog; focus moves to the panel on open and returns to the bell on close; Esc and a click outside close it (a click on the bell is left to the bell's own toggle).
 * ⚠️ ASSUMPTION: "Mark all read" only logs (no read state is drawn); each row opens the screen listed in notificationsData.js and closes the panel.
 */
const NotificationsPanel = ({ onClose, both = false }) => {
  const [filter, setFilter] = useState('all');
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    log('mount', { rows: PANEL.items.length });
    const node = ref.current;
    node?.focus();
    const bell = document.querySelector('[data-notif-bell]');
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      log('close: Esc');
      closeRef.current();
      bell?.focus();
    };
    const onPointer = (e) => {
      if (node?.contains(e.target) || e.target.closest?.('[data-notif-bell]')) return;
      log('close: click outside');
      closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  const rows = both
    ? [
        ...SPACES_PANEL.careerRows.map((r) => ({ ...r, icon: iconUserSolo, space: 'career' })),
        ...PANEL.items.map((r) => ({ ...r, space: 'parent' })),
      ].filter((r) => filter === 'all' || r.space === filter)
    : PANEL.items;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={PANEL.title}
      tabIndex={-1}
      className="fixed top-[78px] right-[clamp(12px,9.84vw,170px)] z-30 flex max-h-[calc(100dvh-90px)] w-[460px] max-w-[calc(100vw-24px)] flex-col gap-[12px] overflow-y-auto rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[20px] pt-[18px] pb-[12px] font-sans shadow-[0_12px_36px_rgba(28,42,33,0.12)] outline-none"
    >
      <div className="flex items-center justify-between gap-[12px] pb-[10px]">
        <h2 className="m-0 text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#1c2a21]">
          {PANEL.title}
        </h2>
        <button
          type="button"
          onClick={() => log('mark all read (no read state drawn)')}
          className="cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {PANEL.markAllRead}
        </button>
      </div>
      {both ? (
        <div
          role="group"
          aria-label="Filter by space"
          className="flex flex-wrap gap-[8px] pb-[8px]"
        >
          {SPACES_PANEL.filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => {
                log('filter', f.id);
                setFilter(f.id);
              }}
              className={`flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-solid px-[14px] text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${filter === f.id ? 'border-[#1c2a21] bg-[#1c2a21] text-white' : 'border-[#e1eae2] bg-white text-[#595959]'}`}
            >
              {f.id === 'parent' ? (
                <img src={iconSpacesUsers} alt="" className="size-[14px]" />
              ) : null}
              {f.id === 'career' ? (
                <img src={iconSpacesUser} alt="" className="size-[14px]" />
              ) : null}
              {f.label}
            </button>
          ))}
        </div>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {rows.map((item, i) => (
          <li
            key={item.id}
            className={
              i < rows.length - 1 ? 'border-0 border-b border-solid border-[#eeeee9]' : undefined
            }
          >
            <Link
              to={item.to}
              onClick={() => {
                log('open row', item.id);
                onClose();
              }}
              className="flex items-center gap-[14px] py-[14px] text-inherit no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]"
            >
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ef]">
                <img src={item.icon} alt="" className="size-[20px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {item.title}
                </span>
                <span className="text-[13px] leading-[16px] text-[#575755]">{item.sub}</span>
              </span>
              {both ? (
                <span
                  className={`inline-flex h-[32px] shrink-0 items-center rounded-full border border-solid px-[14px] text-[13px] leading-[16px] font-semibold ${item.space === 'career' ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]' : 'border-[#e1eae2] bg-white text-[#595959]'}`}
                >
                  {SPACES_PANEL.chips[item.space]}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
