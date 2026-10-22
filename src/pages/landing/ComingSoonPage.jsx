import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ComingSoonCenter from '../../components/sections/landing/comingSoon/ComingSoonCenter.jsx';
import {
  ComingSoonBottom,
  ComingSoonTopBar,
} from '../../components/sections/landing/comingSoon/ComingSoonChrome.jsx';
import {
  BuddyFloat,
  MatchFloat,
  RecruiterFloat,
  StreakFloat,
} from '../../components/sections/landing/comingSoon/ComingSoonFloats.jsx';
import { CsStar } from '../../components/sections/landing/comingSoon/ComingSoonIcons.jsx';
import {
  CS_COPY,
  CS_SAMPLE_EMAIL_ERROR,
  CS_STATES,
  EMAIL_RE,
} from '../../components/sections/landing/comingSoon/ComingSoonData.js';
import useFitZoom from '../../components/sections/landing/shared/useFitZoom.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import { debug } from '../../utils/debug.js';

const log = debug('ComingSoonPage');

/* "genz:sticker · LAUNCHING 2026" (7797:17189): gold, rotated +6deg. Position differs per frame, so the caller passes it. */
const LaunchSticker = ({ className }) => (
  <span
    className={`pointer-events-none absolute z-0 rotate-6 whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] ${className}`}
  >
    {CS_COPY.sticker}
  </span>
);

/*
 * Coming Soon — CS-01 Default 7797:15854 · CS-02 On the list 7797:17223 · CS-03 Email error 7797:18587
 * (tablet 7817:5221 / 7817:10820 / 7817:16402, mobile 7817:8021 / 7817:13608 / 7817:19198).
 * The frames carry their own chrome (top bar + launch-progress/partners strip) and neither S10 nor S11, so this page does NOT use LandingShell
 * (which always adds the landing nav + footer). State is URL-driven: ?state=default|joined|error (⚠️ naming mine).
 * Form: valid email -> ?state=joined, invalid -> ?state=error; no network.
 * Layout: desktop >=1600px = floats pinned to the corners (Figma 1728 frame); below that the four float cards sit in a "peek row" under the form
 * (tablet frame), and on mobile only Match + Streak show (mobile frame).
 */
const ComingSoonPage = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get('state');
  const state = CS_STATES.includes(raw) ? raw : 'default';
  const [email, setEmail] = useState(state === 'error' ? CS_SAMPLE_EMAIL_ERROR : '');
  const [joinedEmail, setJoinedEmail] = useState('');
  const zoom = useFitZoom();

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  useEffect(() => {
    log('state', { state });
    if (state === 'error' && !email) setEmail(CS_SAMPLE_EMAIL_ERROR);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to URL state changes
  }, [state]);

  const onSubmit = (e) => {
    e.preventDefault();
    const value = email.trim();
    const valid = EMAIL_RE.test(value);
    log('submit', { valid });
    if (valid) {
      setJoinedEmail(value);
      setParams({ state: 'joined' });
    } else {
      setParams({ state: 'error' });
    }
  };

  return (
    <div
      className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-[linear-gradient(180deg,#0f2414_0%,#1e4a27_55%,#2e6436_100%)] font-sans text-white"
      style={zoom < 1 ? { zoom } : undefined}
    >
      <div className="pointer-events-none absolute -right-[60px] -top-[100px] -z-10 size-[640px] rounded-full bg-[#84cc16]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[140px] -left-[200px] -z-10 size-[560px] rounded-full bg-[#c8951a]/[0.22] blur-[120px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1.5px)] bg-[length:40px_40px]"
      />
      <ComingSoonTopBar />
      <div className="relative mx-auto flex w-full max-w-[1728px] flex-1 flex-col">
        <CsStar
          size={26}
          className="pointer-events-none absolute left-[16px] top-[124px] md:left-[60px] md:top-[100px] min-[1600px]:left-[420px] min-[1600px]:top-[194px]"
        />
        <CsStar
          size={12}
          color="#84cc16"
          className="pointer-events-none absolute right-[28px] top-[244px] md:right-[78px] md:top-[220px] min-[1600px]:right-[316px] min-[1600px]:top-[424px]"
        />
        <LaunchSticker className="right-[30px] top-[676px] md:right-[50px] md:top-[582px] min-[1600px]:right-[417px] min-[1600px]:top-[64px]" />
        <div className="hidden min-[1600px]:block">
          <RecruiterFloat className="absolute left-[96px] top-[114px]" />
          <MatchFloat className="absolute left-[120px] top-[424px]" />
          <StreakFloat className="absolute right-[179px] top-[114px]" />
          <BuddyFloat className="absolute right-[162px] top-[564px]" />
        </div>
        <main className="relative z-10 flex flex-col items-center px-5 pt-8 md:px-10 md:pt-10 xl:pt-[147px]">
          <ComingSoonCenter
            state={state}
            email={email}
            setEmail={setEmail}
            joinedEmail={joinedEmail}
            onSubmit={onSubmit}
          />
        </main>
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4 px-5 md:mt-10 md:px-10 min-[1600px]:hidden">
          <MatchFloat className="max-md:[zoom:0.877]" />
          <StreakFloat className="max-md:[zoom:0.88]" />
          <BuddyFloat className="max-md:hidden" />
          <RecruiterFloat className="max-md:hidden" />
        </div>
        <div className="mt-8 pb-12 md:mt-10 md:pb-16 xl:pb-[51px] min-[1600px]:mt-[129px]">
          <ComingSoonBottom />
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
