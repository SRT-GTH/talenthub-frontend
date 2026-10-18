import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../utils/debug.js';
import { JobsToastCheckGlyph } from './JobsDialogIcons.jsx';
import { FOCUS_RING } from './jobsDialogUtils.js';
import JobsNotifPopover from './JobsNotifPopover.jsx';
import { AlertsPopover, MatchPopover } from './JobsPopovers.jsx';
import { NotForMeDialog, ReportDialog, WithdrawDialog } from './JobsReasonDialogs.jsx';
import { JOB_DIALOGS } from './talentJobsData.js';

const log = debug('JobsDialogs');

// How long the withdrawn toast stays up. Not drawn in Figma, so this is an ASSUMPTION; it pauses while
// hovered or focused.
const TOAST_MS = 8000;

/*
 * WithdrawnToast — J-21 (Playful 7518:6321 / Focused 8110:419420, identical in both styles): dark pill,
 * 390x54, at x560 / top 98 of the viewport (frame y150 − 52 toolbar) over the Applied tab. Below lg it is
 * centred and full-width. `Undo` clears `?withdrawn`.
 */
const WithdrawnToast = ({ jobs }) => {
  const copy = JOB_DIALOGS.withdrawnToast;
  const timer = useRef(null);
  const dismiss = () => jobs.update({ withdrawn: null });

  const arm = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      log('toast auto-dismiss');
      jobs.update({ withdrawn: null });
    }, TOAST_MS);
  };
  const hold = () => clearTimeout(timer.current);

  useEffect(() => {
    log('toast mount');
    arm();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={hold}
      onMouseLeave={arm}
      onFocus={hold}
      onBlur={arm}
      className="fixed left-1/2 top-[98px] z-[70] flex w-[calc(100vw-24px)] max-w-[390px] -translate-x-1/2 items-center gap-[12px] rounded-full bg-[#1c2a21] py-[10px] pl-[10px] pr-[18px] shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] lg:left-[calc(50%-304px)] lg:translate-x-0"
    >
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#ffd86b] text-[#1c2a21]">
        <JobsToastCheckGlyph className="size-[15px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="font-sans text-[14.5px] font-semibold leading-[17px] text-white">
          {copy.title}
        </span>
        <span className="font-sans text-[12.5px] leading-[15px] text-[#c1d4c4]">{copy.body}</span>
      </span>
      <button
        type="button"
        onClick={() => {
          log('undo withdraw');
          dismiss();
        }}
        className={`shrink-0 rounded-[6px] font-sans text-[13.5px] font-bold leading-[16px] text-[#ffd86b] ${FOCUS_RING}`}
      >
        {copy.undo}
      </button>
    </div>,
    document.body
  );
};

/*
 * JobsDialogs — every overlay of /job-postings. Mount once inside TalentJobsPage with `jobs` (the object from
 * useTalentJobsState()); renders nothing unless the URL asks for one:
 *
 *   ?modal=alerts         J-06  Match alerts settings   popover under the toolbar button   (over Matched, cards)
 *   ?modal=notifications  J-08  Notifications w/ match rows  popover under the bell        (over Matched, cards)
 *   ?modal=how-match      J-15  "How your 82% works"    popover on the job detail          (over detail, ?job=data-analyst)
 *   ?modal=not-for-me     J-16  "Not for you?"          modal                              (over Matched, cards)
 *   ?modal=report         J-17  "Report this posting"   modal                              (over detail, ?job=junior-product-analyst)
 *   ?modal=withdraw       J-20  "Withdraw your application?" modal                         (over the applied job's detail)
 *   ?withdrawn=1          J-21  "Application withdrawn" toast                              (over ?tab=applied)
 *
 * Esc / scrim click / Cancel -> `jobs.update({ modal: null })`. Mock only: confirms log and close (Withdraw
 * also navigates to the Applied tab with the toast).
 */
const JobsDialogs = ({ jobs }) => {
  const modal = jobs?.modal ?? null;

  useEffect(() => {
    if (modal) log('modal', modal);
  }, [modal]);

  return (
    <>
      {modal === 'alerts' && <AlertsPopover jobs={jobs} />}
      {modal === 'notifications' && <JobsNotifPopover jobs={jobs} />}
      {modal === 'how-match' && <MatchPopover jobs={jobs} />}
      {modal === 'not-for-me' && <NotForMeDialog jobs={jobs} />}
      {modal === 'report' && <ReportDialog jobs={jobs} />}
      {modal === 'withdraw' && <WithdrawDialog jobs={jobs} />}
      {jobs?.withdrawn && !modal && <WithdrawnToast jobs={jobs} />}
    </>
  );
};

export default JobsDialogs;
