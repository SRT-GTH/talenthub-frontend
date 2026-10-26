import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { chromeSearch } from '../../../../services/adminChrome.api.js';
import { AgencySearchIcon } from '../../agency/agencyIcons.jsx';
import { ADMIN_BASE, PRIMARY_NAV, SECONDARY_NAV } from '../adminNav.js';
import { NAV as SETTINGS_NAV } from '../settings/data/adminSettingsData.js';

/*
 * AdminSearch — the top-bar search with suggestions (combobox). Typing 2+ characters lists:
 *   Pages     admin pages and settings tabs whose name matches (instant, no request)
 *   Accounts  name / email / username / phone / account or entity ID (GET /admin/chrome/search; not for moderators)
 *   Settings  platform settings and feature flags (Super / Senior Admin)
 * ↑/↓ move, Enter opens the highlighted result; Enter with none highlighted keeps the old behaviour (an ID opens that
 * account, anything else searches Accounts). ⌘K / Ctrl+K focuses it (wired by the top bar through the forwarded ref).
 */
const SETTINGS_ROLES = ['super', 'senior'];
const TYPE_LABEL = {
  talent: 'Talent',
  recruiter: 'Recruiter',
  parent: 'Parent',
  guardian: 'Guardian',
  government: 'Government',
  super_admin: 'Super Admin',
  senior_admin: 'Senior Admin',
  support_agent: 'Support',
  content_moderator: 'Moderator',
};

const AdminSearch = forwardRef(({ role, initial = '' }, inputRef) => {
  const navigate = useNavigate();
  const listId = useId();
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [remote, setRemote] = useState({
    q: '',
    loading: false,
    accounts: [],
    settings: [],
    error: false,
  });
  const boxRef = useRef(null);

  const pages = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    const all = [
      ...PRIMARY_NAV.map((n) => ({ label: n.label, to: n.to })),
      ...SECONDARY_NAV.filter((n) => n.id !== 'settings' || SETTINGS_ROLES.includes(role)).map(
        (n) => ({ label: n.label, to: n.to })
      ),
      ...(SETTINGS_ROLES.includes(role)
        ? SETTINGS_NAV.filter((n) => n.to).map((n) => ({
            label: `Settings › ${n.label}`,
            to: n.to,
          }))
        : []),
    ];
    return all.filter((p) => p.label.toLowerCase().includes(t)).slice(0, 4);
  }, [q, role]);

  useEffect(() => {
    const t = q.trim();
    if (t.length < 2) {
      setRemote({ q: '', loading: false, accounts: [], settings: [], error: false });
      return undefined;
    }
    setRemote((r) => ({ ...r, loading: true }));
    const timer = setTimeout(async () => {
      try {
        const r = await chromeSearch(t);
        setRemote({
          q: t,
          loading: false,
          accounts: r?.accounts || [],
          settings: r?.settings || [],
          error: false,
        });
      } catch {
        setRemote({ q: t, loading: false, accounts: [], settings: [], error: true });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const onDown = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const results = [
    ...pages.map((p) => ({
      key: `p:${p.to}`,
      group: 'Pages',
      title: p.label,
      meta: null,
      to: p.to,
    })),
    ...remote.accounts.map((a) => ({
      key: `a:${a.id}`,
      group: 'Accounts',
      title: a.name || a.email || a.id,
      meta: [
        TYPE_LABEL[a.accountType] || a.accountType,
        a.email && a.email !== a.name ? a.email : null,
        a.status && a.status !== 'active' ? a.status : null,
      ]
        .filter(Boolean)
        .join(' · '),
      to: `${ADMIN_BASE}/accounts/${a.id}`,
    })),
    ...remote.settings.map((s) => ({
      key: `s:${s.key}`,
      group: s.isFlag ? 'Feature flags' : 'Settings',
      title: s.label,
      meta: [s.key, s.isFlag && s.on !== null ? (s.on ? 'On' : 'Off') : null]
        .filter(Boolean)
        .join(' · '),
      to: `${ADMIN_BASE}/settings${s.category === 'feature_flag' || s.category === 'integration' ? `#${s.category}` : ''}`,
    })),
  ];

  const go = (to) => {
    setOpen(false);
    setActive(-1);
    navigate(to);
  };
  const submit = (e) => {
    e.preventDefault();
    if (active >= 0 && results[active]) return go(results[active].to);
    const t = q.trim();
    if (t && /^[a-f0-9]{24}$/i.test(t)) return go(`${ADMIN_BASE}/accounts/${t}`);
    return go(t ? `${ADMIN_BASE}/accounts?q=${encodeURIComponent(t)}` : `${ADMIN_BASE}/accounts`);
  };
  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setOpen(true);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  const showList = open && q.trim().length >= 2;
  let lastGroup = null;
  return (
    <div ref={boxRef} className="relative min-w-0 max-w-[553px] flex-1">
      <form
        role="search"
        onSubmit={submit}
        className="flex h-[48px] items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pr-[12px] pl-[14px] shadow-[inset_0_1px_2px_rgba(15,15,10,0.05)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]"
      >
        <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-white text-[#387440]">
          <AgencySearchIcon className="size-[20px]" />
        </span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && results[active] ? `${listId}-${active}` : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          aria-label="Search accounts, flags or IDs"
          placeholder="Search accounts, flags or IDs…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
        />
        <kbd
          aria-hidden="true"
          className="flex h-[26px] shrink-0 items-center rounded-[6px] border border-solid border-[#e5e7eb] bg-white px-[10px] font-sans text-[12px] leading-[14px] font-semibold text-[#2d5d33] shadow-[0_1px_2px_rgba(15,15,10,0.05)]"
        >
          ⌘K
        </kbd>
      </form>
      {showList ? (
        <div className="absolute inset-x-0 top-[54px] z-40 max-h-[60vh] overflow-y-auto rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[6px] font-sans shadow-[0_12px_32px_rgba(15,15,10,0.14)]">
          <ul id={listId} role="listbox" aria-label="Search results" className="m-0 list-none p-0">
            {results.map((r, i) => {
              const header = r.group !== lastGroup ? r.group : null;
              lastGroup = r.group;
              return (
                <li key={r.key} role="presentation">
                  {header ? (
                    <div
                      role="presentation"
                      className="px-[10px] pt-[8px] pb-[4px] text-[11.5px] font-semibold tracking-[0.4px] text-[#8a8a85] uppercase"
                    >
                      {header}
                    </div>
                  ) : null}
                  <div
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(r.to)}
                    onMouseEnter={() => setActive(i)}
                    className={classNames(
                      'flex cursor-pointer flex-col rounded-[10px] px-[10px] py-[8px]',
                      i === active ? 'bg-[#eef4ee]' : ''
                    )}
                  >
                    <span className="text-[14px] font-semibold text-[#1c2a21]">{r.title}</span>
                    {r.meta ? <span className="text-[12.5px] text-[#595959]">{r.meta}</span> : null}
                  </div>
                </li>
              );
            })}
          </ul>
          {remote.loading ? (
            <p className="m-0 px-[10px] py-[8px] text-[13px] text-[#595959]">Searching…</p>
          ) : null}
          {!remote.loading && remote.error ? (
            <p className="m-0 px-[10px] py-[8px] text-[13px] text-[#902b20]">
              Search isn’t available right now.
            </p>
          ) : null}
          {!remote.loading && !remote.error && !results.length ? (
            <p className="m-0 px-[10px] py-[8px] text-[13px] text-[#595959]">
              Nothing matches “{q.trim()}”. Press Enter to search all accounts.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
AdminSearch.displayName = 'AdminSearch';

export default AdminSearch;
