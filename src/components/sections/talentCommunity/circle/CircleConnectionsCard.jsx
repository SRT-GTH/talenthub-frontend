import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE, CONNECTIONS_RESPONSE } from './circleData.js';
import {
  CircleBellIcon,
  CircleChevronRightIcon,
  CircleCloseIcon,
  CircleMoreIcon,
  CircleShieldIcon,
  CircleUserIcon,
} from './circleIcons.jsx';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';

const MENU_ICON = {
  'View profile': CircleUserIcon,
  'Mute their posts': CircleBellIcon,
  'Remove connection': CircleCloseIcon,
  Block: CircleShieldIcon,
  Report: CircleShieldIcon,
};
const DANGER = ['Remove connection', 'Block', 'Report'];

/*
 * CircleConnectionsCard — Figma `Connections list` (NW-05): "128 people in your circle" + the sort chips (Recently added · Region ·
 * Skills · Community), rows of avatar 48 / name / headline / "Connected 2 days ago" with Message + the "…" button, and the open
 * `Connection menu` (View profile · Mute their posts · Remove connection · Report, red for the last two).
 * Props: items ([{ id, connected }] already filtered / sorted), total, sort (chip label), onSort(label), menuId (person whose menu is
 * open), onMenu(id | null), muted (ids), onMessage(person), onMenuAction(index, person).
 * ⚠️ ASSUMPTION: the three grey chips re-sort the rows (group-by is not drawn); "Muted" rows get a small "Muted" tag.
 */
const CircleConnectionsCard = ({
  items,
  total,
  sort,
  onSort,
  menuId,
  onMenu,
  muted,
  onMessage,
  onMenuAction,
  people = CIRCLE_PEOPLE,
  menu = CONNECTIONS_RESPONSE.menu,
}) => {
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onMenu(null);
    };
    const onDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest('[data-circle-more]')
      )
        onMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [menuId, onMenu]);

  return (
    <section className={classNames(CARD, 'flex flex-col gap-[16px] pb-[8px] pt-[16px]')}>
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[8px] px-[16px]">
        <h2 className={classNames(HEADING, 'text-[18px] leading-[21px]')}>
          {`${total} ${total === 1 ? 'person' : 'people'} in your circle`}
        </h2>
        <span aria-hidden="true" className="hidden min-w-[16px] flex-1 lg:block" />
        <div
          role="group"
          aria-label="Sort your circle"
          className="ml-auto flex flex-wrap gap-[8px]"
        >
          {CONNECTIONS_RESPONSE.sorts.map((label, i) => {
            const on = sort === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={on}
                onClick={() => onSort(label)}
                className={classNames(
                  'inline-flex h-[22px] cursor-pointer items-center gap-[5px] rounded-full border-0 px-[10px] font-sans text-[12px] font-semibold leading-[14px] max-lg:h-[28px]',
                  on ? 'bg-[#1c2a21] text-white' : 'bg-[#f8f8f4] text-[#595959]',
                  'playful:border playful:border-solid',
                  on ? 'playful:border-[#1c2a21]' : 'playful:border-[rgba(28,42,33,0.35)]',
                  FOCUS_RING
                )}
              >
                {i > 0 && <CircleChevronRightIcon className="size-[12px]" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <ul className="m-0 flex list-none flex-col p-0">
        {items.map((item, i) => {
          const person = people[item.id];
          if (!person) return null;
          const open = menuId === item.id;
          return (
            <li
              key={item.id}
              className={classNames(
                'relative flex items-center gap-[14px] px-[16px] py-[12px]',
                i > 0 && 'border-t border-solid border-[#e7e7e7]'
              )}
            >
              <Link
                to={personHref(person.id)}
                aria-label={`View ${person.name}'s profile`}
                className={`shrink-0 rounded-full ${FOCUS_RING}`}
              >
                <CircleAvatar id={person.id} size={48} photo={person.photo} name={person.name} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <Link
                  to={personHref(person.id)}
                  className={`w-fit font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] no-underline ${FOCUS_RING}`}
                >
                  {person.name}
                </Link>
                <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
                  {person.headline}
                </span>
                <span className="font-sans text-[12px] leading-[14px] text-[#9a9a98] max-lg:text-[13px]">
                  {item.connected}
                  {muted.includes(item.id) ? ' · Muted' : ''}
                </span>
              </div>
              {onMessage && (
                <CircleButton tone="soft" onClick={() => onMessage(person)}>
                  {COPY.message}
                </CircleButton>
              )}
              <button
                type="button"
                data-circle-more=""
                aria-label={`More for ${person.name}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => onMenu(open ? null : item.id)}
                className={classNames(
                  'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#e7e7e7] bg-white p-0 text-[#595959] max-lg:size-[44px]',
                  'playful:border-[rgba(28,42,33,0.35)]',
                  FOCUS_RING
                )}
              >
                <CircleMoreIcon className="size-[16px]" />
              </button>
              {open && (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-label={`${person.name} options`}
                  className={classNames(
                    CARD,
                    'absolute right-[16px] top-[58px] z-20 flex w-[230px] max-w-[calc(100%-32px)] flex-col gap-[8px] !rounded-[14px] p-[6px]'
                  )}
                >
                  {menu.map((label, k) => {
                    const Glyph = MENU_ICON[label] ?? CircleShieldIcon;
                    const danger = DANGER.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        role="menuitem"
                        onClick={() => onMenuAction(k, person, label)}
                        className={classNames(
                          'flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 bg-transparent p-[10px] text-left font-sans text-[14px] leading-[17px] hover:bg-[#f8f8f4] max-lg:min-h-[44px]',
                          danger ? 'font-medium text-[#c0392b]' : 'text-[#70706e]',
                          FOCUS_RING
                        )}
                      >
                        <Glyph className="size-[16px] shrink-0" />
                        {label === 'Mute their posts' && muted.includes(item.id)
                          ? 'Unmute their posts'
                          : label}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CircleConnectionsCard;
