import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { logout } from '../../../../services/auth.api.js';
import { LANGUAGES } from '../../talentMessages/LanguageData.js';
import { ADMIN_BASE } from '../adminNav.js';
import AdminPanel from './AdminPanel.jsx';
import { TEXT_SIZES, useAdminA11y } from './useAdminA11y.js';

/*
 * The small top-bar panels: Help, Language, Accessibility, Profile menu (desktop chip and phone avatar).
 * Each takes { onClose } plus what it needs from the session; Profile can open the others (onOpen(name)).
 */

const SETTINGS_ROLES = ['super', 'senior'];
const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

const Row = ({ children, onClick, danger, hint }) => (
  <li>
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={classNames(
        'flex w-full cursor-pointer items-center justify-between gap-[10px] rounded-[10px] border-0 bg-transparent px-[12px] py-[10px] text-left font-sans text-[14px] hover:bg-[#f4f7f3] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
        danger ? 'font-semibold text-[#b42318]' : 'text-[#1c2a21]'
      )}
    >
      <span>{children}</span>
      {hint ? <span className="text-[12.5px] text-[#8a8a85]">{hint}</span> : null}
    </button>
  </li>
);

// ── Help ───────────────────────────────────────────────────────────────────
export const AdminHelpPanel = ({ onClose, session }) => {
  const navigate = useNavigate();
  const go = (to) => {
    onClose();
    navigate(to);
  };
  const role = session?.role;
  return (
    <AdminPanel label="Help" title="Help" onClose={onClose} width={360}>
      <div className="flex flex-col gap-[14px] px-[18px] py-[14px] text-[14px] leading-[20px]">
        <p className="m-0 text-[#595959]">
          Signed in as{' '}
          <strong className="text-[#1c2a21]">{session?.staff?.roleLabel || 'staff'}</strong>. What
          you can see and change depends on your role.
        </p>
        <div>
          <h3 className="m-0 mb-[6px] text-[13px] font-semibold tracking-[0.3px] text-[#595959] uppercase">
            Keyboard
          </h3>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[6px]">
            <dt>
              <kbd className="rounded-[6px] border border-solid border-[#e5e7eb] px-[6px] text-[12px] font-semibold">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </dt>
            <dd className="m-0">Search accounts, settings and pages</dd>
            <dt>
              <kbd className="rounded-[6px] border border-solid border-[#e5e7eb] px-[6px] text-[12px] font-semibold">
                Esc
              </kbd>
            </dt>
            <dd className="m-0">Close a panel or dialog</dd>
          </dl>
        </div>
        <div>
          <h3 className="m-0 mb-[4px] text-[13px] font-semibold tracking-[0.3px] text-[#595959] uppercase">
            Where things are
          </h3>
          <ul role="menu" className="m-0 -mx-[12px] list-none p-0">
            <Row onClick={() => go('/admin/settings/roles')}>What my role can do</Row>
            <Row onClick={() => go(`${ADMIN_BASE}/audit-log`)}>Audit log: who changed what</Row>
            <Row onClick={() => go(`${ADMIN_BASE}/observability`)}>
              Observability: errors and slow requests
            </Row>
            {SETTINGS_ROLES.includes(role) ? (
              <Row onClick={() => go(`${ADMIN_BASE}/settings`)}>
                Platform settings and feature flags
              </Row>
            ) : null}
          </ul>
        </div>
        <p className="m-0 text-[13px] text-[#595959]">
          Every change you make asks for a reason and is recorded in the audit log.
        </p>
      </div>
    </AdminPanel>
  );
};

// ── Language ───────────────────────────────────────────────────────────────
export const AdminLanguagePanel = ({ onClose }) => (
  <AdminPanel label="Language" title="Language" onClose={onClose} width={320}>
    <ul role="radiogroup" aria-label="Language" className="m-0 list-none p-[8px]">
      <li>
        <div
          role="radio"
          aria-checked="true"
          className="flex items-center justify-between rounded-[10px] bg-[#f3f8f3] px-[12px] py-[10px]"
        >
          <span className="text-[14px] font-semibold">English (Ghana)</span>
          <span className="text-[13px] font-semibold text-[#387440]">✓ In use</span>
        </div>
      </li>
      {LANGUAGES.map((l) => (
        <li key={l.id}>
          <div
            role="radio"
            aria-checked="false"
            aria-disabled="true"
            className="flex items-center justify-between px-[12px] py-[10px]"
          >
            <span className="text-[14px] text-[#595959]">
              {l.name} <span className="text-[12.5px] text-[#8a8a85]">{l.native}</span>
            </span>
            <span className="rounded-full bg-[#fff4cc] px-[8px] py-[2px] text-[11.5px] font-semibold text-[#7a5b00]">
              Soon
            </span>
          </div>
        </li>
      ))}
    </ul>
    <p className="m-0 px-[20px] pb-[14px] text-[12.5px] text-[#595959]">
      The admin back office is in English. Talents can already preview these languages in the app.
    </p>
  </AdminPanel>
);

// ── Accessibility ──────────────────────────────────────────────────────────
const Toggle = ({ label, hint, on, onChange }) => (
  <label className="flex cursor-pointer items-start justify-between gap-[12px] px-[18px] py-[10px]">
    <span className="flex flex-col">
      <span className="text-[14px] font-semibold">{label}</span>
      <span className="text-[12.5px] text-[#595959]">{hint}</span>
    </span>
    <input
      type="checkbox"
      role="switch"
      checked={on}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-[4px] size-[18px] accent-[#387440]"
    />
  </label>
);

export const AdminA11yPanel = ({ onClose }) => {
  const [p, set, reset] = useAdminA11y();
  return (
    <AdminPanel
      label="Accessibility"
      title="Accessibility"
      onClose={onClose}
      width={360}
      footer={
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[13.5px] font-semibold text-[#387440]"
        >
          Reset to defaults
        </button>
      }
    >
      <fieldset className="m-0 border-0 px-[18px] pt-[12px] pb-[6px]">
        <legend className="mb-[6px] p-0 text-[14px] font-semibold">Text size</legend>
        <div className="flex gap-[6px]">
          {TEXT_SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={p.text === s.id}
              onClick={() => set('text', s.id)}
              className={classNames(
                'h-[34px] flex-1 cursor-pointer rounded-[10px] border border-solid font-sans text-[13.5px] font-semibold',
                p.text === s.id
                  ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730]'
                  : 'border-[#e1e1dd] bg-white text-[#1c2a21]'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>
      <Toggle
        label="High contrast"
        hint="Darker text and borders, stronger focus ring"
        on={p.contrast}
        onChange={(v) => set('contrast', v)}
      />
      <Toggle
        label="Reduce motion"
        hint="Stops animations and smooth scrolling"
        on={p.motion}
        onChange={(v) => set('motion', v)}
      />
      <Toggle
        label="Underline links"
        hint="Makes links easier to spot"
        on={p.links}
        onChange={(v) => set('links', v)}
      />
      <p className="m-0 px-[18px] pb-[12px] text-[12.5px] text-[#595959]">Saved on this device.</p>
    </AdminPanel>
  );
};

// ── Profile menu ───────────────────────────────────────────────────────────
export const AdminProfileMenu = ({ onClose, onOpen, session, counts }) => {
  const navigate = useNavigate();
  const go = (to) => {
    onClose();
    navigate(to);
  };
  const { staff, user, role } = session;
  return (
    <AdminPanel label="Profile menu" onClose={onClose} width={320}>
      <div className="flex items-center gap-[12px] border-b border-solid border-[#efefec] px-[16px] py-[14px]">
        <span
          aria-hidden="true"
          className="grid size-[40px] shrink-0 place-items-center rounded-full bg-[#387440] text-[14px] font-semibold text-white"
        >
          {staff.monogram}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] font-semibold">{staff.name}</span>
          <span className="truncate text-[12.5px] text-[#595959]">{user?.email}</span>
          <span className="mt-[3px] w-fit rounded-full bg-[#eef4fb] px-[8px] py-[1px] text-[11.5px] font-semibold text-[#2f5b8a]">
            {staff.roleLabel}
          </span>
        </span>
      </div>
      <ul role="menu" aria-label="Profile" className="m-0 list-none p-[8px]">
        <Row onClick={() => go(ADMIN_BASE)}>Home</Row>
        <Row onClick={() => go('/admin/settings/roles')}>My role and permissions</Row>
        {SETTINGS_ROLES.includes(role) ? (
          <Row onClick={() => go(`${ADMIN_BASE}/settings`)}>Platform settings</Row>
        ) : null}
        <Row
          onClick={() => onOpen('notifications')}
          hint={counts?.notifications ? `${counts.notifications} new` : null}
        >
          Notifications
        </Row>
        <Row
          onClick={() => onOpen('messages')}
          hint={counts?.messages ? `${counts.messages} unread` : null}
        >
          Messages
        </Row>
        <Row onClick={() => onOpen('a11y')}>Accessibility</Row>
        <Row onClick={() => onOpen('language')} hint="English">
          Language
        </Row>
        <Row onClick={() => onOpen('help')}>Help</Row>
        <li aria-hidden="true" className="my-[6px] h-px bg-[#efefec]" />
        <Row
          danger
          onClick={() => {
            onClose();
            logout();
            navigate('/admin/sign-in', { replace: true });
          }}
        >
          Log out
        </Row>
      </ul>
    </AdminPanel>
  );
};
