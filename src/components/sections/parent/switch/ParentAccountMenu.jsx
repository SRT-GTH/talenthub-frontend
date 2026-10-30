import { useEffect, useRef } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('ParentAccountMenu');

/*
 * ParentAccountMenu — the drop-down under the top bar's profile chip (`?menu=account`). Not drawn in Figma: it reuses the
 * switch-space menu's card look (PD-02) so it works at every width, including phones where the sidebar card is hidden.
 * Rows: who is signed in, the two spaces (Parent view = current; My career switches, or "Build my career profile" when
 * the account has none), Settings, Help and guides, Log out.
 * Props: name, detail (role line), photo, career ('talent' | 'none'), busy (a switch is running), onCareer, onBuildCareer,
 * onSettings, onHelp, onLogout, onClose. Esc or a click outside closes it (the chip itself toggles it).
 */
const Row = ({ children, onClick, tone = 'ink', checked, disabled }) => (
  <button
    type="button"
    role={checked === undefined ? 'menuitem' : 'menuitemradio'}
    aria-checked={checked === undefined ? undefined : checked}
    disabled={disabled}
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[12px] border-0 px-[12px] py-[10px] text-left font-sans text-[14px] leading-[20px] font-semibold disabled:cursor-default disabled:opacity-60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440] ${
      checked ? 'bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#f4f6f4]'
    } ${tone === 'danger' ? 'text-[#c0392b]' : 'text-[#1c2a21]'}`}
  >
    {children}
  </button>
);

const ParentAccountMenu = ({
  name,
  detail,
  photo,
  career = 'talent',
  busy = false,
  onCareer,
  onBuildCareer,
  onSettings,
  onHelp,
  onLogout,
  onClose,
}) => {
  const ref = useRef(null);
  // The parent passes a fresh onClose each render; keep the listeners (and the opening focus) set up once.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.();
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || e.target.closest?.('[data-account-chip]')) return;
      closeRef.current?.();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.querySelector('[role^="menuitem"]')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, []);

  const act = (what, fn) => () => {
    log(what);
    fn?.();
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Account"
      className="fixed top-[80px] right-[clamp(16px,3.24vw,56px)] z-[60] flex w-[300px] max-w-[calc(100vw-32px)] flex-col gap-[4px] rounded-[18px] border border-solid border-[#1c2a21]/10 bg-white px-[8px] pt-[12px] pb-[8px] font-sans shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04),0_24px_48px_rgba(28,42,33,0.12)]"
    >
      <div className="flex items-center gap-[12px] px-[12px] pb-[10px]">
        {photo ? (
          <img src={photo} alt="" className="size-[40px] shrink-0 rounded-[20px] object-cover" />
        ) : null}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] leading-[20px] font-semibold text-[#1c2a21]">
            {name}
          </span>
          {detail ? (
            <span className="truncate text-[13px] leading-[18px] text-[#5b6660]">{detail}</span>
          ) : null}
        </div>
      </div>

      <p className="m-0 px-[12px] pt-[6px] pb-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#8a938d] uppercase">
        Switch space
      </p>
      <Row checked onClick={act('parent view (current)', onClose)}>
        <span>Parent view</span>
        <span className="text-[12px] font-medium text-[#387440]">Current</span>
      </Row>
      {career === 'talent' ? (
        <Row checked={false} disabled={busy} onClick={act('my career', onCareer)}>
          <span>My career</span>
          <span className="text-[12px] font-medium text-[#5b6660]">
            {busy ? 'Switching…' : 'Switch'}
          </span>
        </Row>
      ) : (
        <Row checked={false} disabled={busy} onClick={act('build career', onBuildCareer)}>
          <span>Build my career profile</span>
          <span className="text-[12px] font-medium text-[#5b6660]">New</span>
        </Row>
      )}

      <hr className="my-[6px] h-px w-full border-0 bg-[#ececea]" />
      <Row onClick={act('settings', onSettings)}>Settings</Row>
      <Row onClick={act('help', onHelp)}>Help and guides</Row>
      <hr className="my-[6px] h-px w-full border-0 bg-[#ececea]" />
      <Row tone="danger" onClick={act('log out', onLogout)}>
        Log out
      </Row>
    </div>
  );
};

export default ParentAccountMenu;
