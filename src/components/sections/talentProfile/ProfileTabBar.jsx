import { useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { PROFILE_TAB_LIST } from './talentProfileTabsData.js';

const log = debug('ProfileTabBar');

/*
 * ProfileTabBar — Figma "profile tabs" (Focused 8110:368214 / Playful 7570:478, identical in both
 * styles). Active tab = green label + 3px green underline; its count chip turns amber (#c8951a, white
 * text, Playful P-03 7571:1639). Overview and About me have no visible count. Switching a tab is
 * `profile.update({ tab })` (URL-driven). Scrolls sideways on phones; labels never wrap.
 */
const ProfileTabBar = ({ profile }) => {
  const active = profile?.tab ?? 'overview';
  const refs = useRef({});

  const select = (key) => {
    log('tab ->', key);
    profile?.update?.({ tab: key === 'overview' ? null : key });
  };

  const onKeyDown = (e, index) => {
    const last = PROFILE_TAB_LIST.length - 1;
    let next = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    const key = PROFILE_TAB_LIST[next].key;
    select(key);
    refs.current[key]?.focus();
  };

  return (
    <nav aria-label="Profile sections" className="@container">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-end gap-[4px] overflow-x-auto border-b border-[#e1eae2] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PROFILE_TAB_LIST.map((tab, i) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                refs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              id={`profile-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls="profile-tabpanel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(tab.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={classNames(
                'flex shrink-0 cursor-pointer items-center gap-[8px] border-b-[3px] px-[14px] pt-[10px] pb-[12px] text-[15px] leading-[normal] whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
                isActive
                  ? 'border-[#387440] font-semibold text-[#387440]'
                  : 'border-transparent font-medium text-[#737373] hover:text-[#1c2a21]'
              )}
            >
              {tab.label}
              {tab.count ? (
                <span
                  className={classNames(
                    'rounded-full px-[7px] py-px text-[11.5px] leading-[normal] font-bold',
                    isActive ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ProfileTabBar;
