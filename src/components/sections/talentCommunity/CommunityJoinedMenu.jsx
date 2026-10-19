import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { COMMUNITY_BROWSE_COPY } from './communityData.js';
import {
  CommunityBellIcon,
  CommunityLogoutIcon,
  CommunityOpenIcon,
} from './communityBrowseIcons.jsx';
import { EMPHASIS_SURFACE } from './communityStyles.js';

const log = debug('CommunityJoinedMenu');

/*
 * CommunityJoinedMenu — the pop-over under a joined card's "Joined" button (Figma "menu · Joined" 7625:5482 / Focused 8110:460679):
 * 240px, r14, 1.5px #959592 border, items "Open community" · "Mute notifications" · "Leave community" (red).
 * Positioned by its parent (absolute, right edge = the Joined button's right edge, 16px under it (the card body padding)).
 * Props: to (href of the community page), muted, onMute, onLeave, onClose.
 * Keyboard: roving focus with ArrowUp/ArrowDown/Home/End, Escape closes, outside click closes.
 * ⚠️ ASSUMPTION: the highlighted "Mute notifications" row in the frame is the menu's active row (it starts active, hover/arrows move it);
 *    its label reads "Unmute notifications" once muted (not drawn).
 */
const ITEM =
  'flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 px-[12px] py-[10px] text-left font-sans text-[14px] font-medium leading-[17px] no-underline max-lg:min-h-[44px]';

const CommunityJoinedMenu = ({ to, muted, onMute, onLeave, onClose }) => {
  const rootRef = useRef(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    log('open');
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        const owner = rootRef.current.parentElement;
        if (owner && owner.contains(event.target)) return;
        onClose();
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        log('escape');
        onClose();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const focusItem = (index) => {
    const items = rootRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items?.length) return;
    const next = (index + items.length) % items.length;
    setActive(next);
    items[next].focus();
  };

  const onKeyDown = (event) => {
    const items = [...(rootRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];
    const current = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(current < 0 ? items.length - 1 : current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusItem(items.length - 1);
    }
  };

  const copy = COMMUNITY_BROWSE_COPY.menu;
  const rowProps = (index) => ({
    role: 'menuitem',
    tabIndex: active === index ? 0 : -1,
    onMouseEnter: () => setActive(index),
    onFocus: () => setActive(index),
  });
  const rowBg = (index) => (active === index ? 'bg-[#f8f8f4]' : 'bg-transparent');

  return (
    <div
      ref={rootRef}
      role="menu"
      aria-label="Community options"
      onKeyDown={onKeyDown}
      className={classNames(
        'absolute right-0 top-[calc(100%+16px)] z-30 flex w-[240px] max-w-[calc(100vw-24px)] flex-col gap-[8px] rounded-[14px] border-[1.5px] border-solid border-[#959592] bg-white p-[6px]',
        EMPHASIS_SURFACE
      )}
    >
      <Link
        to={to}
        {...rowProps(0)}
        onClick={onClose}
        className={classNames(ITEM, rowBg(0), 'text-[#959592]')}
      >
        <CommunityOpenIcon className="size-[16px] shrink-0" />
        {copy.open}
      </Link>
      <button
        type="button"
        {...rowProps(1)}
        onClick={() => {
          onMute();
          onClose();
        }}
        className={classNames(ITEM, rowBg(1), 'text-[#959592]')}
      >
        <CommunityBellIcon className="size-[16px] shrink-0" />
        {muted ? 'Unmute notifications' : copy.mute}
      </button>
      <button
        type="button"
        {...rowProps(2)}
        onClick={() => {
          onLeave();
          onClose();
        }}
        className={classNames(ITEM, rowBg(2), 'text-[#c0392b]')}
      >
        <CommunityLogoutIcon className="size-[16px] shrink-0" />
        {copy.leave}
      </button>
    </div>
  );
};

export default CommunityJoinedMenu;
