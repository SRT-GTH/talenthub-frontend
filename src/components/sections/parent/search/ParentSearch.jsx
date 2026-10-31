import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { useParentMe } from '../live/parentLive.js';
import { HELP_TOPICS } from '../help/data/helpData.js';

const log = debug('ParentSearch');

/*
 * ParentSearch — the top bar's search (click the field or press Ctrl/⌘ K). Not drawn in Figma for parents: the
 * talent search covers jobs and skills, which a parent doesn't look for, so this searches what a parent moves
 * between — their wards (live), the parent pages and settings tabs, and the help guides. Arrow keys move,
 * Enter opens, Esc closes.
 * Props: onClose.
 */
const PAGES = [
  { label: 'Home', to: '/parent', words: 'dashboard overview start' },
  { label: 'My wards', to: '/parent/wards', words: 'children kids ward list' },
  { label: 'To review', to: '/parent/review', words: 'corrections approvals check' },
  { label: 'Evaluate', to: '/parent/evaluate', words: 'evaluation questions assess' },
  { label: 'Ward wallets', to: '/parent/wallets', words: 'money payments wallet' },
  { label: 'Messages', to: '/parent/messages', words: 'chat talk inbox conversation' },
  { label: 'Notifications', to: '/parent/notifications', words: 'alerts updates bell' },
  { label: 'Link a ward', to: '/parent/link-ward', words: 'add child code connect' },
  { label: 'Settings', to: '/parent/settings', words: 'account profile details name phone' },
  {
    label: 'Notification settings',
    to: '/parent/settings?tab=notifications',
    words: 'email sms whatsapp quiet',
  },
  {
    label: 'Language and data',
    to: '/parent/settings?tab=language',
    words: 'twi ga ewe english data saver',
  },
  {
    label: 'Accessibility',
    to: '/parent/settings?tab=accessibility',
    words: 'text size contrast motion',
  },
  {
    label: 'Security and sign-in',
    to: '/parent/settings?tab=security',
    words: 'password sessions devices log out',
  },
  { label: 'Your roles', to: '/parent/settings?tab=roles', words: 'career profile switch talent' },
  { label: 'Help and guides', to: '/parent/help', words: 'support questions faq' },
];

const norm = (v) => String(v || '').toLowerCase();
const matches = (q, ...fields) => {
  const words = norm(q).split(/\s+/).filter(Boolean);
  const hay = fields.map(norm).join(' ');
  return words.every((w) => hay.includes(w));
};

const ParentSearch = ({ onClose }) => {
  const navigate = useNavigate();
  const me = useParentMe();
  const [q, setQ] = useState('');
  const [hot, setHot] = useState(0);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  const groups = useMemo(() => {
    const wards = (me.data?.wards || [])
      .filter((w) => !q || matches(q, w.firstName, w.lastName, w.fullName, 'ward child'))
      .map((w) => ({
        key: `ward-${w.id}`,
        label: [w.firstName, w.lastName].filter(Boolean).join(' ') || 'Your ward',
        hint: 'Ward',
        to: `/parent/wards/${w.id}`,
      }));
    const pages = PAGES.filter((p) => !q || matches(q, p.label, p.words)).map((p) => ({
      key: `page-${p.to}`,
      label: p.label,
      hint: 'Page',
      to: p.to,
    }));
    const help = HELP_TOPICS.filter((h) => q && matches(q, h.title, h.text, 'help guide')).map(
      (h) => ({
        key: `help-${h.id}`,
        label: h.title,
        hint: 'Guide',
        to: `/parent/help/${h.id}`,
      })
    );
    return [
      { title: 'Wards', items: wards },
      { title: 'Pages', items: q ? pages : pages.slice(0, 6) },
      { title: 'Help', items: help },
    ].filter((g) => g.items.length);
  }, [q, me.data]);
  const flat = groups.flatMap((g) => g.items);

  const onQuery = (value) => {
    setQ(value);
    setHot(0);
  };

  useEffect(() => {
    inputRef.current?.focus();
    const onDown = (e) => {
      if (rootRef.current?.contains(e.target) || e.target.closest?.('[data-parent-search]')) return;
      closeRef.current?.();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (item) => {
    if (!item) return;
    log('open', item.to);
    closeRef.current?.();
    navigate(item.to);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeRef.current?.();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHot((h) => Math.min(h + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHot((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(flat[hot]);
    }
  };

  const offsets = groups.reduce(
    (acc, g, gi) => [...acc, gi === 0 ? 0 : acc[gi - 1] + groups[gi - 1].items.length],
    []
  );

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Search"
      className="fixed top-[80px] left-1/2 z-[60] flex w-[min(560px,calc(100vw-32px))] -translate-x-1/2 flex-col overflow-hidden rounded-[18px] border border-solid border-[#1c2a21]/10 bg-white font-sans shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04),0_24px_48px_rgba(28,42,33,0.12)]"
    >
      <div className="border-b border-solid border-[#ececea] p-[12px]">
        <label htmlFor="parent-search" className="sr-only">
          Search wards, pages and help
        </label>
        <input
          id="parent-search"
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="parent-search-results"
          aria-activedescendant={flat[hot] ? `ps-${flat[hot].key}` : undefined}
          autoComplete="off"
          value={q}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search wards, pages and help…"
          className="w-full rounded-[10px] border border-solid border-[#dfdfdc] px-[14px] py-[10px] text-[15px] text-[#1c2a21] outline-none focus:border-[#387440]"
        />
      </div>
      <div
        id="parent-search-results"
        role="listbox"
        className="flex max-h-[min(420px,60vh)] flex-col overflow-y-auto p-[8px]"
      >
        {groups.length === 0 ? (
          <p className="m-0 px-[12px] py-[14px] text-[14px] text-[#8a938d]">
            Nothing matches “{q}”.
          </p>
        ) : (
          groups.map((g, gi) => (
            <div key={g.title} className="flex flex-col">
              <p className="m-0 px-[12px] pt-[8px] pb-[4px] text-[12px] font-semibold tracking-[0.4px] text-[#8a938d] uppercase">
                {g.title}
              </p>
              {g.items.map((item, ii) => {
                const i = offsets[gi] + ii;
                return (
                  <button
                    key={item.key}
                    id={`ps-${item.key}`}
                    type="button"
                    role="option"
                    aria-selected={i === hot}
                    onMouseEnter={() => setHot(i)}
                    onClick={() => go(item)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[10px] border-0 px-[12px] py-[9px] text-left text-[14px] text-[#1c2a21] ${
                      i === hot ? 'bg-[#ebf1ec]' : 'bg-transparent'
                    }`}
                  >
                    <span className="truncate font-semibold">{item.label}</span>
                    <span className="shrink-0 text-[12px] text-[#8a938d]">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentSearch;
