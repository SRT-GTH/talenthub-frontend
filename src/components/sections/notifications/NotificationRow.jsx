import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import NotifButton from './NotifButton.jsx';
import { NOTIFICATION_TYPES } from './notificationsData.js';
import actionCheck from '../../../assets/notifications/icons/action-check-circle.svg';
import actionMore from '../../../assets/notifications/icons/action-more.svg';

const log = debug('NotificationRow');

/*
 * NotificationRow — one notification, two sizes.
 *   variant="popover"  Figma 7466:5718 (pop-up list rows): p12 gap12 r16, 44px avatar, 22px badge.
 *   variant="page"     Figma 7471:55970 (full screen): p16/20/16/16 gap16 r18, 48px avatar, 24px badge,
 *                      quick check / more buttons on hover.
 * Unread rows sit on #ebf1ec (the page's hovered row is #e1eae2); read rows are transparent.
 * Focused wording: the badge row says "pts" not "XP" (8110:662).
 *
 * Props: item (notificationsData row), unread (bool), variant, onRead(id).
 */
const BADGE_RING = '#ffffff';

const AvatarCluster = ({ item, size }) => {
  const type = NOTIFICATION_TYPES[item.type];
  const page = size === 'page';
  const box = page ? 52 : 48;
  const badge = page ? 24 : 22;
  const single = page ? 48 : 44;
  const trio = page ? 32 : 30;
  const trioPos = page
    ? [
        [0, 2],
        [10, 18],
        [20, 2],
      ]
    : [
        [0, 2],
        [8, 16],
        [18, 2],
      ];
  const tile = item.tile;
  return (
    <div className="relative shrink-0" style={{ width: box, height: box }}>
      {tile ? (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute left-0 top-0 flex items-center justify-center rounded-[12px] border border-solid border-[rgba(28,42,33,0.1)]',
            item.tileTone === 'gold' ? 'bg-[#ffd86b]' : 'bg-[#c1d4c4]',
            'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
            page ? 'size-[48px] rounded-[14px]' : 'size-[48px]'
          )}
        >
          <img src={tile} alt="" className={page ? 'size-[24px]' : 'size-[22px]'} />
        </span>
      ) : item.avatars?.length > 1 ? (
        item.avatars.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute rounded-full border-2 border-solid object-cover"
            style={{
              width: trio,
              height: trio,
              left: trioPos[i][0],
              top: trioPos[i][1],
              borderColor: BADGE_RING,
            }}
          />
        ))
      ) : (
        <img
          src={item.avatars?.[0]}
          alt=""
          className="absolute left-0 top-0 rounded-full object-cover"
          style={{ width: single, height: single }}
        />
      )}
      <span
        aria-hidden="true"
        className="absolute flex items-center justify-center rounded-full border-2 border-solid border-white"
        style={{
          width: badge,
          height: badge,
          left: box - badge + 2,
          top: box - badge + 2,
          background: type.badge,
        }}
      >
        <img src={type.icon} alt="" className={page ? 'size-[13px]' : 'size-[12px]'} />
      </span>
    </div>
  );
};

const NotificationRow = ({ item, unread, variant = 'popover', onRead }) => {
  const { uiStyle } = useUiStyle();
  const page = variant === 'page';
  const focused = uiStyle !== 'playful';
  const actions = page ? (item.actionsFull ?? item.actions) : item.actions;
  const baseBody = page ? item.bodyFull : item.body;
  const body = focused ? ((page ? item.bodyFullFocused : item.bodyFocused) ?? baseBody) : baseBody;

  log('render', { id: item.id, variant, unread });

  return (
    <li
      className={classNames(
        'group/row relative flex list-none',
        page
          ? 'gap-[16px] rounded-[18px] py-[16px] pl-[16px] pr-[20px] max-md:gap-[12px] max-md:p-[12px]'
          : 'gap-[12px] rounded-[16px] p-[12px]',
        unread
          ? page
            ? 'bg-[#ebf1ec] hover:bg-[#e1eae2]'
            : 'bg-[#ebf1ec]'
          : page
            ? 'hover:bg-[#f4f7f4]'
            : ''
      )}
      data-unread={unread ? '' : undefined}
    >
      <AvatarCluster item={item} size={page ? 'page' : 'popover'} />

      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <div className="flex items-start gap-[8px]">
          <p
            className={classNames(
              'm-0 min-w-0 flex-1 font-sans font-semibold text-[#1c2a21]',
              page ? 'text-[15px] leading-[18px]' : 'text-[14px] leading-[17px]'
            )}
          >
            {item.title}
          </p>
          {!page && (
            <span className="flex shrink-0 items-center gap-[6px] pt-[1px]">
              <span className="font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
                {item.time}
              </span>
              {unread && (
                <span className="size-[8px] rounded-full bg-[#387440]" aria-label="Unread" />
              )}
            </span>
          )}
        </div>
        {body && (
          <p
            className={classNames(
              'm-0 font-sans text-[#595959]',
              page ? 'text-[13.5px] leading-[16px]' : 'text-[13px] leading-[18px]'
            )}
          >
            {body}
          </p>
        )}
        {item.quote && (
          <p
            className={classNames(
              'm-0 w-fit max-w-full rounded-[8px] bg-[rgba(229,229,229,0.5)] font-sans text-[#595959]',
              page
                ? 'px-[14px] py-[9px] text-[13.5px] leading-[16px]'
                : 'px-[12px] py-[8px] text-[13px] leading-[16px]'
            )}
          >
            {item.quote}
          </p>
        )}
        {actions?.length > 0 && (
          <div
            className={classNames(
              'flex flex-wrap items-center gap-[8px]',
              page ? 'pt-[6px]' : 'pt-[4px]'
            )}
          >
            {actions.map((a) => (
              <NotifButton
                key={a.label}
                size={page ? 'sm' : 'xs'}
                tone={a.tone}
                onClick={() => {
                  log('action', item.id, a.label);
                  onRead?.(item.id);
                }}
              >
                {a.label}
              </NotifButton>
            ))}
          </div>
        )}
      </div>

      {page && (
        <div className="flex shrink-0 items-start gap-[10px]">
          {/* Figma 7471:56008: hover quick actions (mark read / more), 32px circles */}
          <span className="flex items-center gap-[10px] opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100 max-md:hidden">
            <button
              type="button"
              aria-label="Mark as read"
              onClick={() => onRead?.(item.id)}
              className="flex size-[32px] items-center justify-center rounded-full border border-solid border-[#c1d4c4] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <img src={actionCheck} alt="" className="size-[15px]" />
            </button>
            <button
              type="button"
              aria-label="More options"
              className="flex size-[32px] items-center justify-center rounded-full border border-solid border-[#c1d4c4] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <img src={actionMore} alt="" className="size-[15px]" />
            </button>
          </span>
          <span className="flex items-center gap-[10px] pt-[1px]">
            <span className="font-sans text-[12.5px] font-medium leading-[15px] text-[#737373]">
              {item.time}
            </span>
            {unread && (
              <span className="size-[9px] rounded-full bg-[#387440]" aria-label="Unread" />
            )}
          </span>
        </div>
      )}
    </li>
  );
};

export default NotificationRow;
