import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import {
  InstitutionAccessibilityIcon,
  InstitutionBellIcon,
  InstitutionBellMobileIcon,
  InstitutionChevronDownIcon,
  InstitutionGlobeIcon,
  InstitutionHelpIcon,
  InstitutionMessageIcon,
  InstitutionSearchIcon,
} from './institutionIcons.jsx';
import { INSTITUTION_BASE } from './institutionNav.js';

const log = debug('InstitutionTopBar');

/*
 * InstitutionTopBar — the top bar of the institution chrome.
 *   >= lg : Figma "Nav" 8585:468 — h87 + 1px border, px56: logo 71x66 · search 553 (⌘K badge) | help · notifications (5) · messages (5) · EN ·
 *           accessibility · profile chip "Iddrisu A." (opens ?modal=profile, 11.6.0a)
 *   < lg  : Figma "Mobile top bar" 8588:961 (phone 360) — h73: menu button 48 · "GTH" · bell 48 · avatar 40 (monogram)
 * ⌘K (or Ctrl+K) focuses the search; Enter goes to the Students roster with ?q=. ⚠️ ASSUMPTION: Figma draws no search results (it searches students, records and credentials; the roster is the nearest page).
 * Help / notifications / messages / accessibility / language only set ?modal=help|notifications|messages|a11y|language (nothing is drawn for them yet).
 */

const ROUND =
  'relative flex shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#387440] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Badge = ({ count }) =>
  count ? (
    <span
      aria-hidden="true"
      className="absolute -top-[2px] left-[23px] flex size-[16px] items-center justify-center rounded-full border-[1.5px] border-solid border-white bg-[#c0392b] font-sans text-[10px] leading-[16px] font-semibold text-white"
    >
      {count}
    </span>
  ) : null;

const InstitutionTopBar = ({ session, data, modalOpen = false, menuButtonRef, className }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { admin, badges } = session;

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        log('shortcut ⌘K');
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    log('search', q);
    navigate(
      q ? `${INSTITUTION_BASE}/students?q=${encodeURIComponent(q)}` : `${INSTITUTION_BASE}/students`
    );
  };
  const open = (name) => data.update({ modal: name });

  return (
    <header
      className={classNames(
        'sticky top-0 z-30 border-b border-solid border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05)]',
        className
      )}
    >
      {/* phone + tablet */}
      <div className="flex h-[73px] items-center gap-[12px] px-[16px] lg:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={data.drawer}
          onClick={() => data.update({ drawer: true })}
          className="flex size-[48px] shrink-0 flex-col items-center justify-center gap-[4px] rounded-[10px] border border-solid border-[#e5e8e3] bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <span aria-hidden="true" className="h-[2px] w-[18px] rounded-[1px] bg-[#111111]" />
          <span aria-hidden="true" className="h-[2px] w-[18px] rounded-[1px] bg-[#111111]" />
          <span aria-hidden="true" className="h-[2px] w-[18px] rounded-[1px] bg-[#111111]" />
        </button>
        <Link
          to={INSTITUTION_BASE}
          className="min-w-0 flex-1 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#111111] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          GTH
        </Link>
        <button
          type="button"
          aria-label={`Notifications, ${badges.notifications} new`}
          onClick={() => open('notifications')}
          className="flex size-[48px] shrink-0 items-center justify-center rounded-[10px] border border-solid border-[#e5e8e3] bg-transparent text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <InstitutionBellMobileIcon className="size-[20px]" />
        </button>
        <button
          type="button"
          aria-label={`Profile menu, ${admin.name}`}
          aria-haspopup="menu"
          aria-expanded={modalOpen}
          onClick={() => open('profile')}
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <span
            aria-hidden="true"
            className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px] text-[#2a5730]"
          >
            {admin.monogram}
          </span>
        </button>
      </div>

      {/* desktop (lg and up) */}
      <div className="hidden h-[87px] items-center gap-[clamp(16px,2vw,34px)] px-[clamp(24px,3.24vw,56px)] lg:flex">
        <Link
          to={INSTITUTION_BASE}
          aria-label="Ghana Talent Hub, institution home"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <img src={gthLogo} alt="" className="block h-[66px] w-[71px] object-contain" />
        </Link>
        <form
          role="search"
          onSubmit={submitSearch}
          className="flex h-[48px] min-w-0 max-w-[553px] flex-1 items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pr-[12px] pl-[14px] shadow-[inset_0_1px_2px_rgba(15,15,10,0.05)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]"
        >
          <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-white text-[#387440]">
            <InstitutionSearchIcon className="size-[20px]" />
          </span>
          <input
            ref={searchRef}
            type="search"
            name="q"
            defaultValue={data.q}
            aria-label="Search students, records, credentials"
            placeholder="Search students, records, credentials…"
            className="h-[28px] min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
          />
          <kbd
            aria-hidden="true"
            className="flex h-[26px] shrink-0 items-center rounded-[6px] border border-solid border-[#e5e7eb] bg-white px-[10px] font-sans text-[12px] leading-[14px] font-semibold text-[#2d5d33] shadow-[0_1px_2px_rgba(15,15,10,0.05)]"
          >
            ⌘K
          </kbd>
        </form>
        <div className="ml-auto flex items-center gap-[24px]">
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              aria-label="Help"
              onClick={() => open('help')}
              className={classNames(ROUND, 'size-[36px]')}
            >
              <InstitutionHelpIcon className="size-[16px]" />
            </button>
            <button
              type="button"
              aria-label={`Notifications, ${badges.notifications} new`}
              onClick={() => open('notifications')}
              className={classNames(ROUND, 'size-[36px]')}
            >
              <InstitutionBellIcon className="size-[16px]" />
              <Badge count={badges.notifications} />
            </button>
            <button
              type="button"
              aria-label={`Messages, ${badges.messages} unread`}
              onClick={() => open('messages')}
              className={classNames(ROUND, 'size-[36px]')}
            >
              <InstitutionMessageIcon className="size-[18px]" />
              <Badge count={badges.messages} />
            </button>
            <button
              type="button"
              aria-label="Language, English"
              onClick={() => open('language')}
              className={classNames(ROUND, 'h-[36px] w-[83px] gap-[7px] px-[10px] pl-[12px]')}
            >
              <InstitutionGlobeIcon className="size-[16px]" />
              <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#babab7]">
                EN
              </span>
              <InstitutionChevronDownIcon className="size-[14px] text-[#cccccc]" />
            </button>
            <button
              type="button"
              aria-label="Accessibility"
              onClick={() => open('a11y')}
              className={classNames(ROUND, 'size-[38px]')}
            >
              <InstitutionAccessibilityIcon className="size-[20px]" />
            </button>
          </div>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={modalOpen}
            aria-label={`Profile menu, ${admin.shortName}`}
            onClick={() => open('profile')}
            className="flex h-[40px] shrink-0 items-center gap-[7px] rounded-[10px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-[16px] py-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <span
              aria-hidden="true"
              className="flex size-[24px] items-center justify-center rounded-full bg-[#387440] font-sans text-[10px] leading-[12px] font-semibold text-white"
            >
              {admin.monogram}
            </span>
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]">
              {admin.shortName}
            </span>
            <InstitutionChevronDownIcon className="size-[14px] text-[#387440]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default InstitutionTopBar;
