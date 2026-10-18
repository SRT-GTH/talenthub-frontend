import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { LearningToastBookmarkIcon } from '../../shared/assets.jsx';
import { SAVED_TOAST } from './talentLearningHubData.js';
import { useLearningData } from './useLearningData.js';

const log = debug('LearningSavedToast');

// Not dismissed faster than 6s (wiki/playful-mode.md); View / Undo dismiss it immediately.
const AUTO_DISMISS_MS = 10000;

/*
 * LearningSavedToast — SV-01 "Course saved" toast (Playful 7536:972 / Focused 8110:15698). In Figma it
 * floats over the Course detail screen (view=course); the page mounts it for `?toast=saved` over
 * whichever view is showing. Dark pill, gold bookmark disc, "View" opens the Saved tab, "Undo" closes it.
 */
const LearningSavedToast = ({ learning }) => {
  const data = useLearningData();
  useEffect(() => {
    log('mount', { view: learning.view });
    const t = setTimeout(() => {
      log('auto-dismiss');
      learning.update({ toast: null });
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
    // learning.update changes identity with the URL; the timer only needs to start once per toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'fixed bottom-[88px] left-1/2 z-50 flex w-[min(476px,calc(100vw-24px))] lg:w-auto lg:max-w-[calc(100vw-24px)] lg:min-w-[476px] -translate-x-1/2 items-center gap-[12px] rounded-[27px] bg-[#1c2a21] py-[10px] pr-[18px] pl-[10px] lg:bottom-[60px] lg:left-[calc(50%+130px)]',
        'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
      )}
    >
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#ffd86b]">
        <LearningToastBookmarkIcon className="size-[15px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[1px]">
        <span className="font-sans text-[14.5px] leading-[17.3px] font-semibold text-white">
          {SAVED_TOAST.title}
        </span>
        <span className="font-sans text-[12.5px] leading-[14.9px] text-[#c1d4c4] lg:whitespace-nowrap">
          {SAVED_TOAST.body}
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          log('click', 'view');
          learning.update({ toast: null, view: null, tab: 'saved' });
        }}
        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13.5px] leading-[16.1px] font-bold text-[#ffd86b] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd86b]"
      >
        {SAVED_TOAST.view}
      </button>
      <button
        type="button"
        onClick={() => {
          log('click', 'undo');
          // Live: the course was bookmarked when Save was tapped, so Undo removes the bookmark.
          if (data.live && learning.course) data.unsave(learning.course);
          learning.update({ toast: null });
        }}
        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13.5px] leading-[16.1px] font-bold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {SAVED_TOAST.undo}
      </button>
    </div>
  );
};

export default LearningSavedToast;
