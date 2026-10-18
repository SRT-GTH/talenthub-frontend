import { useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { LearningStreakFlameIcon } from '../../shared/assets.jsx';
import LearningHubArt from './LearningHubArt.jsx';
import { HEAD, HubSticker } from './LearningHubParts.jsx';
import { HEADER, TABS, tabCounts, useRemovedSaved } from './talentLearningHubData.js';

const log = debug('LearningHub');

/*
 * LearningHub — the "My Learning" header + tab bar shared by every hub view (ML-01 In progress,
 * ML-06 Recommended, ML-07 empty, ML-08 loading, SV-02/03 Saved; the Certificates view reuses it too).
 * `children` is the view body. Tabs are URL-driven through `learning.update` (talentLearningState):
 *   In progress -> {view:null, tab:null}   Recommended -> {view:'recommended'}
 *   Saved -> {tab:'saved'}                 Certificates -> {view:'certificates'}
 * Completed has no frame in the Figma set, so it stays inert (logged) — see report.
 * Active tab = green label + 3px green underline + amber count; Saved is ink instead (Figma 7536:1780).
 */

const activeTabKey = (learning) => {
  if (learning.view === 'recommended') return 'recommended';
  if (learning.view === 'certificates') return 'certificates';
  if (learning.tab === 'saved') return 'saved';
  return 'progress';
};

const PATCH = {
  progress: { view: null, tab: null, toast: null },
  recommended: { view: 'recommended', tab: null, toast: null },
  saved: { view: null, tab: 'saved', toast: null },
  certificates: { view: 'certificates', tab: null, toast: null },
};

const LearningHub = ({ learning, children }) => {
  const active = activeTabKey(learning);
  const removed = useRemovedSaved();
  const refs = useRef({});
  const showEmpty = learning.empty && !learning.loading;
  const counts = tabCounts({
    empty: showEmpty,
    activeTab: active,
    savedEmpty: learning.empty,
    removedCount: removed.length,
  });
  const newHere = showEmpty && active === 'progress';

  log('render', { active, counts, newHere });

  const select = (key) => {
    const patch = PATCH[key];
    log('tab ->', key, patch ? '' : '(no frame, inert)');
    if (patch) learning.update(patch);
  };

  const onKeyDown = (e, index) => {
    const last = TABS.length - 1;
    let next = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    const key = TABS[next].key;
    select(key);
    refs.current[key]?.focus();
  };

  return (
    <div className="flex min-w-0 flex-col gap-[clamp(16px,1.39vw,24px)]">
      {/* Title row (+ Playful header art from xl) */}
      <div className="flex items-center justify-between gap-[24px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
            <h1
              className={classNames(
                'm-0 text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.02em] whitespace-nowrap text-[#1c2a21]',
                HEAD
              )}
            >
              {HEADER.title}
            </h1>
            {newHere ? (
              <HubSticker tone="gold" size="lg" rotate={6}>
                {HEADER.newHere}
              </HubSticker>
            ) : (
              <HubSticker
                tone="gold"
                size="lg"
                rotate={6}
                icon={<LearningStreakFlameIcon className="size-[15px] playful:size-[16.5px]" />}
              >
                {HEADER.streak}
              </HubSticker>
            )}
          </div>
          <p className="m-0 font-sans text-[14px] leading-[22px] tracking-[0.2px] text-[#999999] sm:text-[16px] sm:leading-[24px]">
            {HEADER.subtitle}
          </p>
        </div>
        <LearningHubArt />
      </div>

      {/* Tabs + body */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        <nav aria-label="My Learning sections">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="flex items-end gap-[4px] overflow-x-auto border-b border-[#e1eae2] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((tab, i) => {
              const isActive = tab.key === active;
              const ink = isActive && tab.key === 'saved';
              const count = counts[tab.key];
              return (
                <button
                  key={tab.key}
                  ref={(el) => {
                    refs.current[tab.key] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`learning-tab-${tab.key}`}
                  aria-selected={isActive}
                  aria-label={`${tab.label}, ${count}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(tab.key)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={classNames(
                    'flex shrink-0 cursor-pointer items-center gap-[8px] border-b-[3px] px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[normal] whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
                    isActive
                      ? classNames(
                          'font-semibold',
                          ink
                            ? 'border-[#1c2a21] text-[#1c2a21]'
                            : 'border-[#387440] text-[#387440]'
                        )
                      : 'border-transparent font-medium text-[#737373] hover:text-[#1c2a21]'
                  )}
                >
                  {tab.label}
                  <span
                    aria-hidden="true"
                    data-count={count}
                    className={classNames(
                      'rounded-full px-[7px] py-px text-[11.5px] leading-[normal] font-bold after:content-[attr(data-count)] max-lg:text-[12px]',
                      isActive ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </nav>

        <div role="tabpanel" aria-labelledby={`learning-tab-${active}`} className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
