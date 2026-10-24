import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { fetchTalentJobs } from '../../../services/talentJobs.api.js';
import { fetchCommunities } from '../../../services/community.api.js';
import { classNames } from '../../../utils/classNames.js';
import { LIFT } from './TabsParts.jsx';
import {
  SearchRoleWalletActiveIcon,
  SearchRoleWalletIcon,
  SkillFunctionIcon,
} from '../../shared/assets.jsx';
import buddyAvatar from '../../../assets/talent-home/tabs/search-career-buddy-avatar.png';
import {
  SEARCH_CATEGORIES,
  SEARCH_ASK,
  SEARCH_GROUPS,
  SEARCH_HINTS,
  SEARCH_SEE_ALL,
} from './talentHomeTabsData.js';

const log = debug('GlobalSearchOverlay');

/*
 * GlobalSearchOverlay — HM-08. Figma Playful 7748:2357 / Focused 8097:9162.
 * Opened by `?search=1`; closes with `home.update({ search: false })` (Esc, scrim click).
 * Figma: the top-nav search field stays live above a dimmed scrim (rgba(11,26,15,.45)) and the
 * results panel hangs under it, left-aligned with the field. The panel therefore measures the
 * header's `input[type=search]` (Shell's) for its anchor; on phones (no inline field) it is
 * inset 12px. role=dialog, Tab is trapped between the nav field and the panel, focus is
 * restored on close, ↑/↓ move the highlighted row, Enter opens it.
 *
 * Live (signed in, no `?state=` design frame): the panel has its own query field (the talent top-nav
 * field is read-only and only opens the overlay), and results are searched in the browser over real data
 * loaded once when the overlay opens — roles from the job feed (GET /guidance/jobs), communities from
 * the catalogue (GET /community) and the app's own pages. There is no backend people / skills search yet,
 * so those groups only exist in the demo. Demo (`?state=` frames): the Figma results (talentHomeTabsData).
 * Opening a row routes by its type: role -> /job-postings?job=<id>, community -> /community/<slug>,
 * page -> its route; demo skills -> /my-assessment, demo people -> /community. The "Ask Career Buddy" row
 * opens Buddy with the typed query as the talent's message; "See all" opens Browse all on Job Postings.
 */

// Pages a talent can jump to from search (all routed in App.jsx).
const PAGES = [
  { id: 'p-jobs', title: 'Job postings', sub: 'Roles matched to you', to: '/job-postings' },
  {
    id: 'p-applied',
    title: 'My applications',
    sub: 'Job postings · Applied',
    to: '/job-postings?tab=applied',
  },
  {
    id: 'p-saved',
    title: 'Saved jobs',
    sub: 'Job postings · Saved',
    to: '/job-postings?tab=saved',
  },
  {
    id: 'p-assessment',
    title: 'My Assessment',
    sub: 'Skills evidence and personality',
    to: '/my-assessment',
  },
  { id: 'p-lab', title: 'Skills Lab', sub: 'Labs and games', to: '/skills-lab' },
  { id: 'p-learning', title: 'My Learning', sub: 'Courses and modules', to: '/learning' },
  { id: 'p-profile', title: 'My profile', sub: 'What recruiters see', to: '/profile' },
  { id: 'p-journey', title: 'Profile journey', sub: 'The 9 stages', to: '/profile/engagement' },
  {
    id: 'p-buddy',
    title: 'Career Buddy',
    sub: 'Your AI guide',
    to: '/profile/filling/career-buddy',
  },
  { id: 'p-community', title: 'Community', sub: 'Groups and posts', to: '/community' },
  { id: 'p-messages', title: 'Messages', sub: 'Chats with recruiters', to: '/messages' },
  { id: 'p-wallet', title: 'Wallet', sub: 'Your GTH wallet', to: '/wallet' },
  { id: 'p-streak', title: 'Streak', sub: 'Your daily streak', to: '/streak' },
  { id: 'p-settings', title: 'Settings', sub: 'Account and privacy', to: '/settings' },
  { id: 'p-help', title: 'Help centre', sub: 'Answers and support', to: '/settings/help' },
];

// Demo rows carry no route; send each Figma group to the closest real surface.
const DEMO_ROUTE = { skills: '/my-assessment', people: '/community' };

// [before, match, after] parts for the result title, matching the Figma highlight shape.
const highlight = (text, q) => {
  const t = String(text || '');
  const i = q ? t.toLowerCase().indexOf(q) : -1;
  if (i < 0) return [{ text: t }];
  return [
    { text: t.slice(0, i) },
    { text: t.slice(i, i + q.length), hl: true },
    { text: t.slice(i + q.length) },
  ].filter((p) => p.text);
};

const hit = (q, ...fields) =>
  !q ||
  fields.some((f) =>
    String(f || '')
      .toLowerCase()
      .includes(q)
  );

const liveGroups = (src, q) => {
  const roles = (src.jobs || [])
    .filter((j) => !j.closed && hit(q, j.title, j.company?.name, j.location))
    .map((j) => ({
      id: `job-${j.id}`,
      kind: 'role',
      to: `/job-postings?job=${encodeURIComponent(j.id)}`,
      parts: highlight(`${j.title}${j.company?.name ? ` · ${j.company.name}` : ''}`, q),
      sub: [j.location, j.typeLabel].filter(Boolean).join(' · ') || 'Open role',
      chip: j.match ? `${Math.round(j.match)}% match` : null,
      icon: 'wallet',
    }));
  const communities = (src.communities || [])
    .filter((c) => hit(q, c.name, c.description, c.category))
    .map((c) => ({
      id: `com-${c.id}`,
      kind: 'community',
      to: `/community/${encodeURIComponent(c.slug || c.id)}`,
      parts: highlight(c.name, q),
      sub: Number.isFinite(c.memberCount) ? `${c.memberCount} members` : 'Community',
      chip: c.isMember ? 'Joined' : null,
      icon: 'function',
    }));
  const pages = PAGES.filter((p) => hit(q, p.title, p.sub)).map((p) => ({
    id: p.id,
    kind: 'page',
    to: p.to,
    parts: highlight(p.title, q),
    sub: p.sub,
    icon: 'function',
  }));
  return [
    { id: 'roles', label: 'Roles', rows: roles },
    { id: 'communities', label: 'Communities', rows: communities },
    { id: 'pages', label: 'Pages', rows: pages },
  ];
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

const Tile = ({ row, active }) => {
  if (row.photo)
    return (
      <span className="flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] bg-[#ebf1ec]">
        <img src={row.photo} alt="" width="34" height="34" className="size-[34px]" />
      </span>
    );
  const Icon =
    row.icon === 'wallet'
      ? active
        ? SearchRoleWalletActiveIcon
        : SearchRoleWalletIcon
      : SkillFunctionIcon;
  return (
    <span
      className={classNames(
        'flex size-[34px] shrink-0 items-center justify-center rounded-[10px]',
        active && row.icon === 'wallet' ? 'bg-[#387440]' : 'bg-[#ebf1ec]'
      )}
    >
      <Icon className="size-[17px]" />
    </span>
  );
};

const GlobalSearchOverlay = ({ home }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const queryRef = useRef(null);
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ top: 64, left: 12, scrimTop: 56 });
  // Live = a signed-in talent on the real home (home.live is null on `?state=` design frames).
  const live = Boolean(home?.live);
  // Live sources: null = loading; each list stays [] if its call failed (see `failed`).
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState([]);

  const close = () => {
    log('close');
    home.update({ search: false });
  };

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    const miss = [];
    const grab = (label, p) =>
      p.catch((err) => {
        log.error(`${label} failed:`, err?.response?.status || err?.code || err?.message);
        miss.push(label);
        return null;
      });
    Promise.all([grab('roles', fetchTalentJobs()), grab('communities', fetchCommunities())]).then(
      ([feed, communities]) => {
        if (!alive) return;
        log('sources', { jobs: feed?.jobs?.length ?? 0, communities: communities?.length ?? 0 });
        setFailed(miss);
        setSrc({ jobs: feed?.jobs || [], communities: communities || [] });
      }
    );
    return () => {
      alive = false;
    };
  }, [live]);

  // Opening a row: route by its type (see the header), then close the overlay.
  const open = (row) => {
    const to = row.to || DEMO_ROUTE[row.group] || `/job-postings?job=${encodeURIComponent(row.id)}`;
    log('open result', row.id, '->', to);
    home.update({ search: false });
    navigate(to);
  };
  const askBuddy = () => {
    const prompt = query.trim();
    log('ask buddy', { withQuery: Boolean(prompt) });
    home.update({ search: false });
    navigate('/profile/filling/career-buddy', prompt ? { state: { prompt } } : undefined);
  };
  const seeAll = () => {
    log('see all -> browse all roles');
    home.update({ search: false });
    navigate('/job-postings?tab=browse');
  };

  const liveAll = useMemo(
    () => (live && src ? liveGroups(src, query.trim().toLowerCase()) : null),
    [live, src, query]
  );
  const categories = liveAll
    ? [
        {
          id: 'all',
          label: 'All',
          count: liveAll.reduce((n, g) => n + g.rows.length, 0),
        },
        ...liveAll.map((g) => ({ id: g.id, label: g.label, count: g.rows.length })),
      ]
    : live
      ? []
      : SEARCH_CATEGORIES;

  const groups = useMemo(() => {
    if (live) {
      return (liveAll || [])
        .filter((g) => cat === 'all' || g.id === cat)
        .map((g) => ({
          id: g.id,
          heading: `${g.label.toUpperCase()} · ${g.rows.length}`,
          // "All" shows the top few of each group; a category tab shows them all.
          rows: cat === 'all' ? g.rows.slice(0, g.id === 'pages' ? 3 : 4) : g.rows,
        }))
        .filter((g) => g.rows.length);
    }
    const q = query.trim().toLowerCase();
    return SEARCH_GROUPS.filter((g) => cat === 'all' || g.id === cat)
      .map((g) => ({
        ...g,
        rows: g.rows.filter(
          (r) =>
            !q ||
            r.parts
              .map((p) => p.text)
              .join('')
              .toLowerCase()
              .includes(q) ||
            r.sub.toLowerCase().includes(q)
        ),
      }))
      .map((g) => ({ ...g, rows: g.rows.map((r) => ({ ...r, group: g.id })) }))
      .filter((g) => g.rows.length);
  }, [live, liveAll, cat, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.rows), [groups]);

  useEffect(() => {
    log('mount', { rows: flat.length });
    const opener = document.activeElement;
    const header = document.querySelector('header');
    const navInput = header?.querySelector('input[type="search"]');
    const measure = () => {
      const h = header?.getBoundingClientRect();
      // the visible field box is the input's wrapper (icon + input + ⌘K badge)
      const i = (navInput?.parentElement ?? navInput)?.getBoundingClientRect();
      const visible = i && i.width > 0;
      const next = {
        scrimTop: Math.round(h?.bottom ?? 56),
        top: Math.round(visible ? i.bottom + 10 : (h?.bottom ?? 56) + 8),
        left: Math.round(visible ? i.left : 12),
      };
      log('anchor', next, { visible });
      setPos(next);
    };
    measure();
    window.addEventListener('resize', measure);
    // Live: type in the panel's own field (the talent top-nav field is read-only, it only opens this).
    if (queryRef.current) queryRef.current.focus();
    else (navInput && navInput.offsetWidth > 0 ? navInput : panelRef.current)?.focus();

    const onInput = (e) => {
      if (e.target === navInput) {
        setQuery(e.target.value);
        setActive(0);
      }
    };
    document.addEventListener('input', onInput);
    return () => {
      window.removeEventListener('resize', measure);
      document.removeEventListener('input', onInput);
      opener?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!flat.length) return;
        e.preventDefault();
        setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length);
      } else if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && flat[active]) {
        e.preventDefault();
        open(flat[active]);
      } else if (e.key === 'Tab') {
        const navInput = document.querySelector('header input[type="search"]');
        const list = [
          ...(navInput && navInput.offsetWidth > 0 ? [navInput] : []),
          ...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []),
        ];
        if (!list.length) return;
        const i = list.indexOf(document.activeElement);
        const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i + 1) % list.length;
        e.preventDefault();
        list[next].focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat, active]);

  let idx = -1;
  return (
    <>
      <div
        aria-hidden="true"
        onMouseDown={close}
        style={{ top: pos.scrimTop }}
        className="fixed inset-x-0 bottom-0 z-[50] bg-[rgba(11,26,15,0.45)]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search results"
        tabIndex={-1}
        style={{
          top: pos.top,
          left: pos.left,
          maxHeight: `calc(100dvh - ${pos.top}px - 12px)`,
        }}
        className={classNames(
          'fixed z-[55] flex w-[min(760px,calc(100vw-24px))] flex-col gap-[16px] overflow-y-auto rounded-[22px] bg-white px-[16px] py-[20px] outline-none playful:py-[16px]',
          LIFT
        )}
      >
        {live ? (
          <input
            ref={queryRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search roles, communities and pages"
            aria-label="Search"
            className="h-[44px] w-full rounded-[12px] border border-solid border-[#dfdfdc] bg-white px-[14px] font-sans text-[14px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf] focus-visible:border-[#387440]"
          />
        ) : null}
        <div
          role="group"
          aria-label="Result categories"
          className="flex gap-[6px] overflow-x-auto font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const on = c.id === cat;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  log('category', c.id);
                  setCat(c.id);
                  setActive(0);
                }}
                className={classNames(
                  'inline-flex shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[12px] py-[7px] leading-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  on ? 'border-[#387440] bg-[#387440]' : 'border-[#e7e7e7] bg-white'
                )}
              >
                <span className={classNames('text-[13px]', on ? 'text-white' : 'text-[#387440]')}>
                  {c.label}
                </span>
                <span
                  className={classNames('text-[12px]', on ? 'text-[#ffd86b]' : 'text-[#595959]')}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={askBuddy}
          className="flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <span className="flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-white">
            <img src={buddyAvatar} alt="" width="30" height="30" className="size-[30px]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="truncate text-[14px] font-semibold text-[#1c2a21]">
              {live
                ? query.trim()
                  ? `Ask Career Buddy: “${query.trim()}”`
                  : 'Ask Career Buddy anything'
                : SEARCH_ASK.title}
            </span>
            <span className="truncate text-[12px] text-[#595959]">{SEARCH_ASK.sub}</span>
          </span>
          <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959] max-sm:hidden">
            {SEARCH_ASK.key}
          </span>
        </button>

        {live && !src ? (
          <p role="status" className="text-[13px] text-[#595959]">
            Loading results…
          </p>
        ) : null}
        {live && src && failed.length ? (
          <p role="status" className="text-[13px] text-[#595959]">
            {`We couldn’t load ${failed.join(' or ')} right now. Other results still show.`}
          </p>
        ) : null}
        {live && src && !flat.length ? (
          <p role="status" className="text-[13px] text-[#595959]">
            {query.trim()
              ? `Nothing matches “${query.trim()}”. Try Career Buddy above.`
              : 'Nothing to show yet.'}
          </p>
        ) : null}

        {groups.map((g) => (
          <div key={g.id} role="group" aria-label={g.heading} className="flex flex-col gap-[16px]">
            <p className="text-[12px] font-bold tracking-[1.2px] text-[#595959]">{g.heading}</p>
            <ul className="flex flex-col">
              {g.rows.map((r) => {
                idx += 1;
                const i = idx;
                const on = i === active;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => open(r)}
                      className={classNames(
                        'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid px-[12px] py-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                        on
                          ? 'border-[rgba(28,42,33,0.1)] bg-[#f7f8f4]'
                          : 'border-transparent bg-transparent'
                      )}
                    >
                      <Tile row={r} active={on} />
                      <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="truncate text-[14px] font-semibold text-[#1c2a21]">
                          {r.parts.map((p, k) => (
                            <span key={k} className={p.hl ? 'text-[#387440]' : undefined}>
                              {p.text}
                            </span>
                          ))}
                        </span>
                        <span className="truncate text-[12px] text-[#595959]">{r.sub}</span>
                      </span>
                      {r.chip ? (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[12px] font-semibold text-[#387440] max-sm:hidden">
                          {r.chip}
                        </span>
                      ) : null}
                      {r.hint && on ? (
                        <span className="shrink-0 whitespace-nowrap text-[12px] font-medium text-[#595959] max-md:hidden">
                          {r.hint}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="flex items-center gap-[14px] border-t border-solid border-[#e7e7e7] px-[4px] pt-[10px]">
          {SEARCH_HINTS.map((h) => (
            <span key={h.key} className="flex shrink-0 items-center gap-[6px] max-md:hidden">
              <span className="inline-flex h-[32px] items-center whitespace-nowrap rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
                {h.key}
              </span>
              <span className="whitespace-nowrap text-[12px] text-[#595959]">{h.label}</span>
            </span>
          ))}
          <span className="h-px min-w-px flex-1" aria-hidden="true" />
          <button
            type="button"
            onClick={seeAll}
            className="shrink-0 cursor-pointer whitespace-nowrap text-[13px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {live ? 'Browse all roles' : SEARCH_SEE_ALL}
          </button>
        </div>
      </div>
    </>
  );
};

export default GlobalSearchOverlay;
