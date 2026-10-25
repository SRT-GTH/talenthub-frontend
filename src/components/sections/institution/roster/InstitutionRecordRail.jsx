import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import InstitutionRecordCard from './InstitutionRecordCard.jsx';
import {
  Roster20BulbIcon,
  Roster20CheckCircleFillIcon,
  Roster20EyeIcon,
  Roster20FileIcon,
  Roster20LockIcon,
  Roster20PhoneIcon,
  Roster20TargetIcon,
  Roster20VoiceIcon,
  Roster20WalletIcon,
  RosterTrophyIcon,
} from './rosterIcons.jsx';

const log = debug('InstitutionRecordRail');

/*
 * InstitutionRecordRail — the right column of the student record (Figma "right rail" 8744:433762, 425 wide, gap 20):
 *   Enrolment (dark #1c2a21 card, r20, p 24: pill "Enrolment" + eye, "Enrolled · Form 3B" 22/28 600 white, 14/21 #bfbfbf text, green "Message Kofi" button)
 *   Record (white card: six 14/17 500 #595959 lines with a 15 glyph and a 14 lock = only your staff see them, then "Transfer out or remove →")
 *   Badges (three 56 round medals: First steps, Profile started, Quiz Ace; "All 9 →").
 * "Transfer out or remove →" opens a two-item menu (Transfer out, Remove student) that opens the roster dialogs (?modal=transfer|remove&student=<id>); Esc closes it and gives the focus
 * back. The "Ghana Card verified" line draws no glyph: its Figma icon instance (opacity 0.45) is empty. "All 9 →" has no destination drawn (logs).
 * Props: record, student ({ id, firstName ... }), onAction(modal) — the page sets the URL.
 */

const ICONS = {
  target: Roster20TargetIcon,
  file: Roster20FileIcon,
  voice: Roster20VoiceIcon,
  phone: Roster20PhoneIcon,
  wallet: Roster20WalletIcon,
};
const BADGE_ICON = {
  trophy: RosterTrophyIcon,
  check: Roster20CheckCircleFillIcon,
  bulb: Roster20BulbIcon,
};

const InstitutionRecordRail = ({ record, firstName, messageTo, onAction }) => {
  const [menu, setMenu] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menu) return undefined;
    menuRef.current?.querySelector('button')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setMenu(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target))
        setMenu(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [menu]);

  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      <section
        aria-labelledby="record-enrolment"
        className="flex flex-col gap-[12px] rounded-[20px] bg-[#1c2a21] p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]"
      >
        <span className="inline-flex h-[24px] w-fit items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
          {record.enrolment.badge}
          <Roster20EyeIcon className="size-[14px]" />
        </span>
        <h2
          id="record-enrolment"
          className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-white"
        >
          {record.enrolment.title}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[21px] text-[#bfbfbf]">
          {record.enrolment.text}
        </p>
        <Link
          to={messageTo}
          className="inline-flex h-[48px] w-fit items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730]"
        >
          Message {firstName}
        </Link>
      </section>

      <InstitutionRecordCard id="record-card" title="Record">
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {record.record.map((r) => {
            const Icon = ICONS[r.icon];
            return (
              <li
                key={r.id}
                className="flex items-center gap-[10px] font-sans text-[14px] leading-[17px] font-medium text-[#595959]"
              >
                {Icon ? (
                  <Icon className="size-[15px] shrink-0" />
                ) : (
                  <span aria-hidden="true" className="size-[15px] shrink-0" />
                )}
                <span className="min-w-0 flex-1">{r.text}</span>
                <Roster20LockIcon className="size-[14px] shrink-0 text-[#737373]" />
                <span className="sr-only">Only your staff see this</span>
              </li>
            );
          })}
        </ul>
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Transfer out or remove →
          </button>
          {menu ? (
            <div
              ref={menuRef}
              role="menu"
              aria-label="Transfer out or remove"
              className="absolute bottom-[calc(100%+8px)] left-0 z-20 flex w-[220px] flex-col rounded-[12px] border border-solid border-[#e1eae2] bg-white p-[6px] shadow-[0_8px_24px_rgba(15,15,10,0.16)]"
            >
              {[
                { id: 'transfer', label: 'Transfer out' },
                { id: 'remove', label: 'Remove student' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    log('menu', m.id);
                    setMenu(false);
                    onAction(m.id);
                  }}
                  className="min-h-[36px] cursor-pointer rounded-[8px] border-0 bg-transparent px-[10px] text-left font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]"
                >
                  {m.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </InstitutionRecordCard>

      {record.badges.length ? (
        <InstitutionRecordCard
          id="record-badges"
          title="Badges"
          link="All 9 →"
          onLink={() => log('badges (no destination drawn)')}
        >
          <ul className="m-0 flex list-none gap-[6px] p-0">
            {record.badges.map((b) => {
              const Icon = BADGE_ICON[b.icon];
              return (
                <li key={b.id} className="flex w-[88px] flex-col items-center gap-[6px]">
                  <span
                    style={{ backgroundColor: b.tint }}
                    className="grid size-[56px] place-items-center rounded-full border border-solid border-[#1c2a21]/10 text-[#1c2a21] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]"
                  >
                    <Icon className="size-[25px]" />
                  </span>
                  <span className="text-center font-sans text-[11px] leading-[13px] font-medium text-[#595959] max-lg:text-[12px]">
                    {b.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </InstitutionRecordCard>
      ) : null}
    </div>
  );
};

export default InstitutionRecordRail;
