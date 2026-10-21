import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  MsgArchiveIcon,
  MsgBanIcon,
  MsgCheckIcon,
  MsgFlagIcon,
  MsgLockIcon,
  MsgMeatballIcon,
  MsgMuteIcon,
  MsgTrashIcon,
  MsgUserIcon,
} from './aIcons.jsx';
import { MESSAGES_COPY, avatarSrc } from './messagesData.js';
import { FOCUS_RING } from './messagesStyles.js';

const log = debug('MessagesThreadHeader');

const ICONS = {
  user: MsgUserIcon,
  mute: MsgMuteIcon,
  archive: MsgArchiveIcon,
  flag: MsgFlagIcon,
  ban: MsgBanIcon,
  trash: MsgTrashIcon,
};

const ARROW_LEFT = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M10 3 5 8l5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * Options menu (T-MSG-02, Figma "Tags" 7417:7499): 265 wide white card, 24px radius, hairline #e6e6e6 + soft shadow;
 * rows 49px (12px padding, 14px text #737373, icons #bfbfbf, Delete in #c0392b); the hovered row is #f6f6f6.
 * Opened through `?menu=options`; Esc / outside click / choosing an item closes it.
 * Only the menu is drawn: none of its actions has a drawn result, so choosing one only closes the menu.
 */
const OptionsMenu = ({ startIdx, onPick, onClose, muted = false }) => {
  const [active, setActive] = useState(startIdx);
  const ref = useRef(null);

  useEffect(() => {
    log('menu open');
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    const onDown = (e) => {
      if (!ref.current?.contains(e.target) && !e.target.closest('[data-msg-menu-trigger]'))
        onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Conversation options"
      className="absolute right-[-4px] top-[calc(100%+3px)] z-30 flex w-[265px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[24px] border-[0.7px] border-solid border-[#e6e6e6] bg-white py-[4px] shadow-[0_1.5px_3px_rgba(64,64,64,0.12)]"
    >
      {MESSAGES_COPY.menu.map((item, idx) => {
        const Glyph = ICONS[item.icon];
        // Live inbox: a muted conversation offers Unmute (not drawn in Figma; same row and icon).
        const label = item.id === 'mute' && muted ? 'Unmute notifications' : item.label;
        return (
          <div key={item.id} role="none">
            {[1, 2, 3, 5].includes(idx) ? (
              <div className="h-[0.6px] w-full bg-[#e6e6e6]" aria-hidden="true" />
            ) : null}
            <button
              type="button"
              role="menuitem"
              onClick={() => onPick(item.id)}
              onMouseEnter={() => setActive(idx)}
              onFocus={() => setActive(idx)}
              className={classNames(
                'flex min-h-[48px] w-full cursor-pointer items-center justify-center border-0 px-[16px] py-[12px] font-sans text-[14px] leading-[24.3px] tracking-[0.2431px] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
                active === idx ? 'bg-[#f6f6f6]' : 'bg-white',
                item.danger ? 'text-[#c0392b]' : 'text-[#737373]'
              )}
            >
              <span
                className="flex items-center"
                style={{
                  width: label === item.label ? item.w : undefined,
                  gap: item.gap,
                  maxWidth: '100%',
                }}
              >
                <Glyph className={classNames('size-[18px]', item.danger ? '' : 'text-[#bfbfbf]')} />
                <span className="whitespace-nowrap">{label}</span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const Chip = ({ soft, children }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] shrink-0 items-center whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-normal max-lg:min-h-[24px] max-lg:text-[12px]',
      soft
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {children}
  </span>
);

/*
 * Conversation header pill (Figma "Frame 1000002153" in the thread card): avatar + verified badge, name, role,
 * label chip, "Re: …" chip and the ⋯ button. Props: conv, messages (state hook), onBack (phone), onPick(id).
 */
const MessagesThreadHeader = ({ conv, messages, onBack, onPick, loading }) => {
  const menuOpen = messages.menu === 'options';
  const startIdx = useRef(menuOpen ? 1 : -1).current;
  const close = () => messages.update({ menu: null });

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="mb-[16px] flex shrink-0 items-center justify-center rounded-[100px] border-[1.205px] border-solid border-[rgba(0,82,43,0.1)] px-[12px] py-[8px]"
      >
        <div className="flex items-center gap-[14px]">
          <span className="size-[53px] animate-pulse rounded-full bg-[#dfdfdc]" />
          <span className="flex w-[181px] flex-col gap-[8px]">
            <span className="h-[14px] w-[160px] animate-pulse rounded-[6px] bg-[#dfdfdc]" />
            <span className="h-[10px] w-[110px] animate-pulse rounded-[6px] bg-[#dfdfdc]" />
          </span>
        </div>
      </div>
    );
  }

  return (
    <header className="relative mb-[16px] flex shrink-0 flex-wrap items-center justify-between gap-x-[16.9px] gap-y-[8px] rounded-[26px] border-[1.205px] border-solid border-[rgba(0,82,43,0.1)] px-[12px] py-[8px] lg:rounded-[100px]">
      <div className="flex min-w-0 items-center gap-[14px]">
        <button
          type="button"
          aria-label="Back to conversations"
          onClick={onBack}
          className={classNames(
            'inline-flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#1c2a21] lg:hidden',
            FOCUS_RING
          )}
        >
          {ARROW_LEFT}
        </button>
        <span
          className={classNames(
            'relative flex size-[53px] shrink-0 items-center justify-center rounded-full',
            conv.confidential ? 'bg-[#eaeffb] text-[#244a9f]' : 'bg-[#dfdfdc]'
          )}
        >
          {conv.confidential ? (
            <MsgLockIcon className="size-[22px]" />
          ) : (
            <>
              {avatarSrc(conv.avatar) ? (
                <img
                  src={avatarSrc(conv.avatar)}
                  alt=""
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="font-sans text-[16px] font-semibold text-[#1c2a21]"
                >
                  {conv.initials}
                </span>
              )}
              {conv.verified !== false ? (
                <span className="absolute left-[39px] top-[39px] flex size-[16px] items-center justify-center rounded-full border-2 border-solid border-white bg-[#224626] text-white">
                  <MsgCheckIcon className="size-[8.8px]" />
                </span>
              ) : null}
            </>
          )}
        </span>
        <span className="flex min-w-0 flex-col gap-[6px]">
          <span className="truncate font-sans text-[16px] font-medium leading-[19px] text-[#1c2a21]">
            {conv.name}
          </span>
          <span className="truncate font-sans text-[14px] leading-[17px] text-[#737373]">
            {conv.role}
          </span>
        </span>
      </div>
      <div className="relative flex min-w-0 items-center gap-[10px] max-lg:flex-wrap">
        {conv.label ? <Chip soft>{conv.label}</Chip> : null}
        {conv.reChip ? <Chip>{conv.reChip}</Chip> : null}
        <button
          type="button"
          data-msg-menu-trigger
          aria-label="Conversation options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => {
            log('toggle menu');
            messages.update({ menu: menuOpen ? null : 'options' });
          }}
          className={classNames(
            'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#c1d4c4] bg-white p-0 text-[#999]',
            FOCUS_RING
          )}
        >
          <MsgMeatballIcon className="h-[3.75px] w-[20.25px]" />
        </button>
        {menuOpen ? (
          <OptionsMenu
            muted={Boolean(conv.muted)}
            startIdx={startIdx}
            onClose={close}
            onPick={(id) => {
              close();
              onPick(id);
            }}
          />
        ) : null}
      </div>
    </header>
  );
};

export default MessagesThreadHeader;
