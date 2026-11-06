import {
  AlertTriangleIcon,
  BookmarkIcon,
  CheckIcon,
  LinkIcon,
  PipelineIcon,
  PlusIcon,
  UsersIcon,
  EyeIcon,
} from './talentCandidateProfileIcons.jsx';
import { OVERFLOW_ITEMS, SAVE_LISTS, SAVE_MENU } from './talentCandidateProfileData.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('CandidateActionMenus');

/*
 * CandidateActionMenus — the two popovers under the profile's action row.
 *   SaveListMenu       "Save to a list" (Figma TS-14 "Popover · Save to list" 10102:43300): 300px, a group label, three lists (title + count) with a check on the selected one, a divider and "New list…".
 *   ProfileOverflowMenu the "…" menu (TS-16 "Menu · Profile overflow" 10102:44196): 280px, "Add to a job's pipeline" with a hint, Share with my team, Copy profile link, a divider, Hide from my searches, Report profile (red).
 * Both are absolutely positioned 8px under their trigger (the caller wraps trigger + menu in a `relative` element); below `sm` they become a bottom sheet pinned to the screen edges.
 * Props — SaveListMenu: selectedListId, onSelect(listId), onNewList. ProfileOverflowMenu: onSelect(itemId).
 */
const POPOVER =
  'absolute top-[calc(100%+8px)] left-0 z-40 flex flex-col gap-[2px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[6px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)] max-sm:fixed max-sm:inset-x-[16px] max-sm:top-auto max-sm:bottom-[16px] max-sm:w-auto';
const ITEM =
  'flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 bg-transparent px-[10px] text-left font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111] hover:bg-[#ebf1ec]/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green';
const SUB = 'font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]';

export const SaveListMenu = ({ selectedListId, onSelect, onNewList }) => {
  log('render', { selectedListId });
  return (
    <div role="menu" aria-label={SAVE_MENU.heading} className={classNames(POPOVER, 'w-[300px]')}>
      <p className="m-0 pt-[8px] pr-0 pb-[4px] pl-[10px] font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
        {SAVE_MENU.heading}
      </p>
      {SAVE_LISTS.map((list) => {
        const selected = list.id === selectedListId;
        return (
          <button
            key={list.id}
            type="button"
            role="menuitemradio"
            aria-checked={selected}
            onClick={() => onSelect(list.id)}
            className={classNames(ITEM, 'py-[8px]', selected && 'bg-[#ebf1ec]/50')}
          >
            <BookmarkIcon className="size-[18px] shrink-0 text-[#575755]" />
            <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
              <span className={selected ? 'font-medium' : undefined}>{list.title}</span>
              <span className={SUB}>{list.count}</span>
            </span>
            {selected ? <CheckIcon className="size-[16px] shrink-0 text-[#387440]" /> : null}
          </button>
        );
      })}
      <span aria-hidden="true" className="my-[1px] block h-px bg-[#e5e8e3]" />
      <button
        type="button"
        role="menuitem"
        onClick={onNewList}
        className={classNames(ITEM, 'py-[9px]')}
      >
        <PlusIcon className="size-[18px] shrink-0 text-[#387440]" />
        {SAVE_MENU.newList}
      </button>
    </div>
  );
};

const OVERFLOW_ICONS = {
  pipeline: PipelineIcon,
  users: UsersIcon,
  link: LinkIcon,
  eye: EyeIcon,
  alert: AlertTriangleIcon,
};

export const ProfileOverflowMenu = ({ onSelect }) => {
  log('render');
  return (
    <div role="menu" aria-label="Profile actions" className={classNames(POPOVER, 'w-[280px]')}>
      {OVERFLOW_ITEMS.map((item, index) => {
        const Icon = OVERFLOW_ICONS[item.icon];
        return (
          <div key={item.id} className="contents">
            {item.dividerBefore ? (
              <span aria-hidden="true" className="my-[1px] block h-px bg-[#e5e8e3]" />
            ) : null}
            <button
              type="button"
              role="menuitem"
              onClick={() => onSelect(item.id)}
              className={classNames(
                ITEM,
                item.hint ? 'py-[8px]' : 'py-[9px]',
                index === 0 && 'bg-[#fffefc]',
                item.danger && 'text-[#c0392b]'
              )}
            >
              <Icon
                className={classNames(
                  'size-[18px] shrink-0',
                  item.danger ? 'text-[#c0392b]' : 'text-[#575755]'
                )}
              />
              <span className="flex min-w-0 flex-col gap-[1px]">
                <span>{item.label}</span>
                {item.hint ? <span className={SUB}>{item.hint}</span> : null}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
