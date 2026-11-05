import { useEffect } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import SiteCopyShelfButton from '../browse/SiteCopyShelfButton.jsx';
import { BrowseClearIcon, BrowseSparkleIcon } from '../browse/SiteCopyBrowseIcons.jsx';
import { markTourSeen } from './siteCopyTourStore.js';

const log = debug('SiteCopyTour');

/*
 * SiteCopyTour — the first-visit tour "Welcome to Site copy" (Platform Admin 7.8.0b, tour 1 of 3): a centred 560 wide card over a #1c2a21 / 55 % scrim (AgencyDialog),
 * 44 px sparkle tile + 24/600 title + close (x), a 15/22 intro, three step cards (the open step has a 1.5px #387440 border and #ebf1ec / 50 % fill), the amber
 * reassurance line (13.5/500 #463409) and two buttons: "Skip the tour" (white) and "Next: change the words" (green). The three step cards share the width equally
 * (Figma squeezed them to 28-31 px wide with overflowing labels: kept out of the build).
 * ⚠️ ASSUMPTION: only step 1 is drawn. Steps 2 and 3 reuse the three drawn step names ("Change the words", "Preview, then publish") as titles with one short
 * sentence each in the same voice, "Next: preview, then publish" and "Got it" as their buttons; the amber line stays on every step.
 * Props: step (1 | 2 | 3), onStep(n), onClose(). Closing (x, Esc, Skip, last step) marks the tour as seen (siteCopyTourStore).
 */
const STEPS = [
  {
    title: 'Welcome to Site copy',
    body: 'You can change the words on any page yourself, like editing in Wix or WordPress. Layout, icons and colours stay as designed.',
    label: 'Pick a page and section',
    next: 'Next: change the words',
  },
  {
    // ⚠️ ASSUMPTION (not drawn)
    title: 'Change the words',
    body: 'Open a section and type your own words. The original text is always one click away.',
    label: 'Change the words',
    next: 'Next: preview, then publish',
  },
  {
    // ⚠️ ASSUMPTION (not drawn)
    title: 'Preview, then publish',
    body: 'Check how it looks on desktop, tablet and phone, then publish with a short reason. Every change keeps its history.',
    label: 'Preview, then publish',
    next: 'Got it',
  },
];

const SiteCopyTour = ({ step = 1, onStep, onClose }) => {
  const i = Math.min(Math.max(step, 1), 3) - 1;
  const cur = STEPS[i];
  useEffect(() => {
    log('step', { step: i + 1, drawn: i === 0 });
  }, [i]);

  const close = () => {
    log('close', { at: i + 1 });
    markTourSeen();
    onClose?.();
  };
  const next = () => {
    if (i >= 2) {
      close();
      return;
    }
    log('next', { to: i + 2 });
    onStep?.(i + 2);
  };

  return (
    <AgencyDialog
      label={cur.title}
      onClose={close}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(560px,calc(100vw-24px))]"
    >
      <div className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(18px,5vw,28px)] font-sans shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ebf1ec]/50 text-[#27522e]">
            <BrowseSparkleIcon className="size-[21px]" />
          </span>
          <h2 className="m-0 min-w-0 flex-1 text-[clamp(20px,5vw,24px)] leading-[29px] font-semibold tracking-[-0.24px] text-[#1c2a21]">
            {cur.title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close the tour"
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <BrowseClearIcon className="size-[18px]" />
          </button>
        </div>
        <p className="m-0 text-[15px] leading-[22px] text-[#575755]">{cur.body}</p>
        <ol className="m-0 grid list-none grid-cols-3 gap-[10px] p-0" aria-label="Tour steps">
          {STEPS.map((s, n) => {
            const on = n === i;
            return (
              <li
                key={s.label}
                aria-current={on ? 'step' : undefined}
                className={classNames(
                  'flex flex-col gap-[6px] rounded-[14px] border-[1.5px] border-solid p-[14px]',
                  on ? 'border-[#387440] bg-[#ebf1ec]/50' : 'border-transparent bg-[#f8f8f4]'
                )}
              >
                <span
                  className={classNames(
                    'text-[18px] leading-[21px] font-bold',
                    on ? 'text-[#2a5730]' : 'text-[#575755]'
                  )}
                >
                  {n + 1}
                </span>
                <span
                  className={classNames(
                    'text-[13.5px] leading-[16px] font-semibold max-sm:text-[12px] max-sm:leading-[15px]',
                    on ? 'text-[#1c2a21]' : 'text-[#575755]'
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="m-0 text-[13.5px] leading-[20px] font-medium text-[#463409]">
          Your changes are saved as drafts. Only staff can see them until you publish.
        </p>
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
          <SiteCopyShelfButton onClick={close} className="w-full">
            Skip the tour
          </SiteCopyShelfButton>
          <SiteCopyShelfButton tone="green" onClick={next} className="w-full" data-autofocus>
            {cur.next}
          </SiteCopyShelfButton>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default SiteCopyTour;
