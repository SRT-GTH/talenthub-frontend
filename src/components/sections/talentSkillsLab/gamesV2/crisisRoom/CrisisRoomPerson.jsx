import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { FOCUS_RING } from '../../labPlayStyles.js';
import {
  ServerArrowDownIcon,
  ServerDragDotsIcon,
  ServerPhoneIcon,
} from '../serverGame/ServerGameIcons.jsx';

const log = debug('CrisisRoomPerson');

/*
 * CrisisRoomPerson — one row of "Who do you call first?" (Figma "person · Kwabena": 510x60, r16, pad 12/14, gap 12; drag dots 16 ·
 * number badge 26 · avatar 34 · name + role · phone 18). Ordered rows are white with a hairline; the left-out one is #f8f8f4 with a
 * dashed ink@.30 border and a "–" badge.
 * Play (the Figma frames only draw drag): tap the row to add it to the call order / tap again to take it out, ArrowUp / ArrowDown
 * on the focused row (or the ↑ ↓ buttons that appear on hover / focus / touch) move it within the order.
 *   position   index in the order, or -1
 *   last       true for the last numbered row (its ↓ is disabled)
 */
const BADGE =
  'inline-flex size-[26px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] font-sans text-[12px] leading-[14px] font-bold playful:border-[1.5px] playful:border-[#1c2a21]';

const MOVE_BUTTON =
  'inline-flex size-[24px] items-center justify-center rounded-[8px] border border-solid border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] enabled:cursor-pointer enabled:hover:bg-[#ebf1ec] disabled:opacity-35';

const CrisisRoomPerson = ({ person, position, last, locked, onToggle, onMove }) => {
  const ordered = position >= 0;
  const onKeyDown = (event) => {
    if (!ordered || locked) return;
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const dir = event.key === 'ArrowUp' ? -1 : 1;
      log('keyboard move', person.id, dir);
      onMove(person.id, dir);
    }
  };
  return (
    <li
      className={classNames(
        'group relative flex min-h-[60px] rounded-[16px]',
        ordered
          ? 'border border-solid border-[rgba(28,42,33,0.12)] bg-white'
          : 'border border-dashed border-[rgba(28,42,33,0.1)] bg-[#f8f8f4] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.3)]',
        locked ? '' : 'transition-colors hover:border-[rgba(28,42,33,0.3)]'
      )}
    >
      <button
        type="button"
        disabled={locked}
        aria-pressed={ordered}
        aria-label={
          ordered
            ? `${person.name}, ${person.role}: call number ${position + 1}. Press to take out. Arrow up and down move it.`
            : `${person.name}, ${person.role}: not called. Press to add to your order.`
        }
        onClick={() => {
          log('toggle', person.id, ordered ? 'remove' : 'add');
          onToggle(person.id);
        }}
        onKeyDown={onKeyDown}
        className={classNames(
          'flex min-w-0 flex-1 items-center gap-[12px] rounded-[15px] px-[14px] py-[12px] max-[360px]:gap-[8px] max-[360px]:px-[10px] text-left font-sans enabled:cursor-pointer disabled:cursor-default',
          FOCUS_RING
        )}
      >
        <ServerDragDotsIcon className="size-[16px] shrink-0 max-[360px]:hidden" />
        <span
          aria-hidden="true"
          data-n={ordered ? position + 1 : '–'}
          className={classNames(
            BADGE,
            'after:content-[attr(data-n)]',
            ordered ? 'bg-[#387440] text-white' : 'bg-white text-[#1c2a21]'
          )}
        />
        <span
          aria-hidden="true"
          data-initial={person.initial}
          style={{ backgroundColor: person.color }}
          className={classNames(
            'inline-flex size-[34px] shrink-0 items-center justify-center rounded-full text-[14px] leading-[17px] font-bold after:content-[attr(data-initial)]',
            person.ink ? 'text-[#1c2a21]' : 'text-white'
          )}
        />
        <span className={classNames('flex min-w-0 flex-1 flex-col', ordered && 'max-lg:pr-[56px]')}>
          {/* the role line is generated content: the row is one text line for the responsive audit, two lines on screen */}
          <span
            data-role={person.role}
            className="text-[15px] leading-[18px] font-semibold whitespace-nowrap text-[#1c2a21] after:block after:text-[13px] after:leading-[16px] after:font-normal after:text-[#595959] after:content-[attr(data-role)]"
          >
            {person.name}
          </span>
        </span>
        <ServerPhoneIcon className="m-[1px] size-[16px] shrink-0 text-[#1c2a21]" />
      </button>
      {ordered && !locked ? (
        <span className="absolute top-1/2 right-[44px] flex -translate-y-1/2 gap-[4px] opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-lg:opacity-100 [@media(hover:none)]:opacity-100">
          <button
            type="button"
            aria-label={`Move ${person.name} up`}
            disabled={position === 0}
            onClick={() => onMove(person.id, -1)}
            className={classNames(MOVE_BUTTON, FOCUS_RING)}
          >
            <ServerArrowDownIcon className="size-[16px] rotate-180" />
          </button>
          <button
            type="button"
            aria-label={`Move ${person.name} down`}
            disabled={last}
            onClick={() => onMove(person.id, 1)}
            className={classNames(MOVE_BUTTON, FOCUS_RING)}
          >
            <ServerArrowDownIcon className="size-[16px]" />
          </button>
        </span>
      ) : null}
    </li>
  );
};

export default CrisisRoomPerson;
