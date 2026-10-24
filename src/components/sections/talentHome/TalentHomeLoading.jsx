import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import {
  CardError,
  CardSkeleton,
  LoadingNote,
  ShimmerStyle,
  Skel,
  SkelCard,
} from './TalentHomeStates.jsx';
import { CtaButton } from './coreUi.jsx';

const log = debug('TalentHomeLoading');

/*
 * HM-04 loading: Playful 7733:731 / Focused 8097:10681 (content column; the shell owns the
 * chrome). Figma draws only the skeleton + "Getting your matches ready…" note and no empty/error
 * frames, so `loading` = 'empty' keeps the skeleton. `loading` = 'error' (a failed live load, or the
 * `?loading=error` frame) shows an error card with "Try again" instead of a skeleton that never
 * ends: live it re-runs the loader (home.retry); the design frame just drops the param.
 * A 401 never gets here (talentHomeState sends the talent to /login). Reusable pieces live in
 * TalentHomeStates.jsx.
 */
const TalentHomeLoading = ({ home }) => {
  const kind = home?.loading;
  useEffect(() => {
    log('mount', { kind });
  }, [kind]);

  if (kind === 'error') {
    const retry = () => {
      log('retry');
      // Drops a `?loading=error` design param (no-op otherwise), then re-runs the live loader.
      if (new URLSearchParams(window.location.search).has('loading')) {
        home?.update?.({ loading: null });
      }
      home?.retry?.();
    };
    return (
      <CardError
        title="We couldn’t load your home"
        body="Something went wrong on our side or your connection dropped. Your progress is safe."
      >
        <CtaButton size="sm" onClick={retry}>
          Try again
        </CtaButton>
      </CardError>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]" aria-busy="true">
      <ShimmerStyle />
      <LoadingNote />
      <SkelCard className="gap-[14px] rounded-[28px] p-[clamp(16px,2.1vw,36px)]">
        <Skel className="h-[10px] w-[160px] rounded-[8px]" />
        <Skel className="h-[44px] w-[520px] rounded-[10px]" />
        <Skel className="h-[14px] w-[620px] rounded-[8px]" />
        <div className="grid grid-cols-2 gap-[12px] sm:flex">
          {[0, 1, 2, 3].map((i) => (
            <Skel key={i} className="h-[96px] w-full rounded-[18px] sm:w-[150px]" />
          ))}
        </div>
      </SkelCard>
      <div className="grid gap-[16px] lg:grid-cols-[minmax(0,912fr)_minmax(0,448fr)]">
        <div className="flex flex-col gap-[16px]">
          <SkelCard className="gap-[16px] p-[clamp(16px,1.6vw,24px)]">
            <Skel className="h-[20px] w-[220px] rounded-[8px]" />
            <div className="grid gap-[16px] sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skel
                  key={i}
                  className={classNames(
                    'h-[220px] w-full rounded-[20px]',
                    i > 0 && 'max-sm:hidden'
                  )}
                />
              ))}
            </div>
          </SkelCard>
          <SkelCard className="gap-[12px] p-[clamp(16px,1.6vw,24px)]">
            <Skel className="h-[20px] w-[200px] rounded-[8px]" />
            {[0, 1, 2].map((i) => (
              <Skel key={i} className="h-[64px] w-full rounded-[16px]" />
            ))}
          </SkelCard>
        </div>
        <div className="flex flex-col gap-[16px]">
          <CardSkeleton bodyH="h-[180px]" />
          <CardSkeleton bodyH="h-[160px]" />
          <CardSkeleton bodyH="h-[120px]" />
        </div>
      </div>
    </div>
  );
};

export default TalentHomeLoading;
