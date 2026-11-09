import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../../../services/auth.api.js';
import { readSetupHint, shortDate, twoStepPath } from '../../../services/mfa.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('TwoStepReminder');

/*
 * TwoStepReminder — the "set up 2-step verification by …" banner (user story A2, screen 5), for accounts that must use 2-step
 * (staff, organisation / school / agency admins) during their grace period. Driven by the sign-in hint (verify-otp `mfaSetup`, kept by
 * services/mfa.api.js); it disappears once 2-step is on (the hint is cleared) or after "Later" for the rest of this browser session.
 * Hidden on sign-in pages and on the 2-step page itself. Mounted once in App.jsx.
 */

const HIDDEN_ON = [
  '/login',
  '/admin/sign-in',
  '/security/2-step',
  '/forgot-password',
  '/reset-password',
  '/register',
  '/get-started',
];
const LATER_KEY = 'th:mfa-reminder-later';

const later = () => {
  try {
    return sessionStorage.getItem(LATER_KEY) === '1';
  } catch {
    return false;
  }
};

const TwoStepReminder = () => {
  const { pathname, search } = useLocation();
  const [dismissed, setDismissed] = useState(later);
  const hint = readSetupHint();

  if (dismissed || !hint || !hint.required || !isLoggedIn()) return null;
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const date = hint.graceUntil ? shortDate(hint.graceUntil) : '';
  return (
    <aside
      role="region"
      aria-label="2-step verification reminder"
      className="fixed bottom-[16px] left-[16px] z-[60] flex w-[min(420px,calc(100vw-32px))] flex-col gap-[10px] rounded-[18px] border border-solid border-[#e9d9b0] bg-[#faf4e8] p-[16px] shadow-[0_6px_24px_-6px_rgba(15,15,10,0.25)]"
    >
      <p className="m-0 font-sans text-[15px] leading-[20px] font-semibold text-[#1c2a21]">
        Set up 2-step verification
      </p>
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#463409]">
        {date
          ? `Your account needs it. Set it up by ${date}; after that you’ll need it to keep using GTH.`
          : 'Your account needs it. It takes about two minutes.'}
      </p>
      <div className="flex items-center gap-[16px]">
        <Link
          to={twoStepPath({ next: `${pathname}${search}` })}
          onClick={() => log('set up now')}
          className="inline-flex min-h-[40px] items-center rounded-[12px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[16px] font-sans text-[14px] font-bold text-white no-underline shadow-[0_3px_0_#2a5730]"
        >
          Set up now
        </Link>
        <button
          type="button"
          onClick={() => {
            log('later');
            try {
              sessionStorage.setItem(LATER_KEY, '1');
            } catch {
              // ignore
            }
            setDismissed(true);
          }}
          className="cursor-pointer border-0 bg-transparent font-sans text-[14px] font-semibold text-[#463409] underline-offset-2 hover:underline"
        >
          Later
        </button>
      </div>
    </aside>
  );
};

export default TwoStepReminder;
