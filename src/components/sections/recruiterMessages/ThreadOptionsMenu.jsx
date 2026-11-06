import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  MenuArchiveIcon,
  MenuBlockIcon,
  MenuDeleteTrashIcon,
  MenuMuteNotificationsIcon,
  MenuReportFlagIcon,
  MenuViewProfileIcon,
} from './recruiterMessagesIcons.jsx';

const log = debug('ThreadOptionsMenu');

const MENU_ICONS = {
  viewProfile: MenuViewProfileIcon,
  muteNotifications: MenuMuteNotificationsIcon,
  archive: MenuArchiveIcon,
  reportFlag: MenuReportFlagIcon,
  block: MenuBlockIcon,
  deleteTrash: MenuDeleteTrashIcon,
};

/*
 * ThreadOptionsMenu — the dropdown behind the thread header's meatball button.
 * Figma 7249:84533 (plain, 265x255, border 0.7px #e5e5e5, shadow 0 1.5px 6.1px) and 8187:78389 (iconed,
 * 265x304, border #e6e6e6, shadow 0 1px 4px). Rows are 49px, content CENTRED, 14/400 #737373, rules 0.6px,
 * hover #f6f6f6.
 *
 * Props: items (recruiterMessagesData menu arrays), variant 'plain' | 'iconed', forcedHoverId (URL `forceHover`:
 * pins that row's hover look; the real :hover still works), onSelect(item), className (position).
 */
const ThreadOptionsMenu = ({
  items,
  variant = 'plain',
  forcedHoverId = null,
  onSelect,
  className,
}) => {
  const iconed = variant === 'iconed';

  useEffect(() => {
    log('mount', { variant, itemCount: items.length, forcedHoverId });
  }, [variant, items.length, forcedHoverId]);

  return (
    <div
      role="menu"
      className={classNames(
        'z-30 w-[265px] overflow-hidden rounded-[24px] border-[0.7px] bg-white py-[4px] max-lg:max-w-[calc(100vw-32px)]',
        iconed
          ? 'border-[#e6e6e6] shadow-[0_1px_4px_0_rgba(0,0,0,0.12)]'
          : 'border-[#e5e5e5] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]',
        className
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon ? MENU_ICONS[item.icon] : null;
        const showRule = index > 0 && item.ruleBefore !== false;
        const isHoverPinned = item.id === forcedHoverId;
        return (
          <div key={item.id}>
            {showRule && (
              <div
                className={classNames('h-[0.6px] w-full', iconed ? 'bg-[#e6e6e6]' : 'bg-[#e5e5e5]')}
              />
            )}
            <button
              type="button"
              role="menuitem"
              data-menu-item={item.id}
              onClick={() => {
                log('branch', { menuItem: item.id, wired: false });
                onSelect?.(item);
              }}
              style={Icon ? { columnGap: `${item.iconGap}px` } : undefined}
              className={classNames(
                'flex h-[49px] w-full items-center justify-center px-[16px] text-center font-sans text-[14px] leading-[24.31px] tracking-[0.24px] transition-colors',
                'hover:bg-[#f6f6f6] active:bg-[#ededed]',
                isHoverPinned && 'bg-[#f6f6f6]',
                item.destructive ? (iconed ? 'text-[#c0392b]' : 'text-[#902b20]') : 'text-[#737373]'
              )}
            >
              {Icon && (
                <Icon
                  className={classNames(
                    'h-[18px] shrink-0',
                    item.icon === 'block' ? 'w-[17px]' : 'w-[18px]',
                    item.destructive ? 'text-[#c0392b]' : 'text-[#bfbfbf]'
                  )}
                />
              )}
              <span>{item.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ThreadOptionsMenu;
