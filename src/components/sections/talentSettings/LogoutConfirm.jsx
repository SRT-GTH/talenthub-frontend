import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { LogoutConfirmBoltIcon, LogoutConfirmTileIcon } from '../../shared/assets.jsx';
import Button from '../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import FlowPortal from '../talentHome/FlowPortal.jsx';
import { logout as clearLocalSession } from '../../../services/auth.api.js';
import { logOutOtherDevices, serverLogout } from '../../../services/settings.api.js';
import { invalidateAccountOverview, useAccountOverview } from './useLiveSettings.js';

const log = debug('LogoutConfirm');

/*
 * LogoutConfirm — LO-01 "Log out · Confirm" (Playful 7846:14236 / Focused 8110:56441). `?logout=confirm`
 * over any talent page. Modal 480px, 28px padding, radius 24; scrim rgba(28,42,33,0.6). Playful: 1.5px ink
 * border + offset shelf, Bricolage Grotesque title, ink checkbox border. Copy verbatim from the frames
 * (mock streak 12 / 2 other devices / email: shaped for an API). "Log out" goes to `/logged-out`.
 * Props: `settings` (useTalentSettingsState()).
 */
const SESSION = {
  email: 'kofi.agyekum@gmail.com',
  streakDays: 12,
  otherDevices: 2,
};

const LogoutConfirm = ({ settings }) => {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const stayRef = useRef(null);
  const [allDevices, setAllDevices] = useState(false);
  const [busy, setBusy] = useState(false);
  // Live: real email + other signed-in devices (GET /settings/overview). No streak backend yet: that line is demo-only.
  const overview = useAccountOverview({ enabled: !settings.demo });
  const live = Boolean(overview);
  const view = live
    ? {
        email: overview.account?.email || '',
        otherDevices: (overview.sessions || []).filter((d) => !d.thisDevice).length,
      }
    : SESSION;

  const close = () => {
    log('close (stay logged in)');
    settings.update({ logout: null });
  };

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => stayRef.current,
    lockScroll: true,
  });

  const confirm = async () => {
    log('log out', { allDevices, live });
    if (!settings.demo) {
      setBusy(true);
      // Ends this device's session on the server (and the others when ticked), then clears this browser.
      if (allDevices && view.otherDevices)
        await logOutOtherDevices().catch((err) =>
          log('others not logged out', err?.response?.status)
        );
      await serverLogout();
      clearLocalSession();
      invalidateAccountOverview();
    }
    navigate('/logged-out', { replace: true });
  };

  return (
    <FlowPortal
      className="overflow-y-auto bg-[rgba(28,42,33,0.6)] px-[clamp(12px,2vw,16px)] pt-[clamp(28px,17.2vh,188px)] pb-[clamp(12px,2vw,16px)]"
      onScrimMouseDown={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        aria-describedby="logout-confirm-desc"
        tabIndex={-1}
        className="relative mx-auto flex w-full max-w-[480px] flex-col items-start gap-[24px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[28px] leading-[normal] shadow-[0px_2px_4px_rgba(28,42,33,0.04),0px_1px_1px_rgba(28,42,33,0.04)] outline-none max-sm:gap-[18px] max-sm:p-[20px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0px_10px_12px_rgba(28,42,33,0.06),4px_4px_0px_rgba(28,42,33,0.45)]"
      >
        <div className="flex w-full items-center gap-[12px]">
          <span
            aria-hidden="true"
            className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#c0392b]"
          >
            <LogoutConfirmTileIcon className="size-[21px] shrink-0" />
          </span>
          <h2
            id="logout-confirm-title"
            className="m-0 min-w-0 flex-1 font-sans text-[22px] leading-[1.25] font-semibold tracking-[-0.22px] text-[#1c2a21] playful:font-[family-name:var(--pf-font-display)] playful:[font-variation-settings:'wdth'_100]"
          >
            Log out of Ghana Talent Hub?
          </h2>
        </div>

        <p
          id="logout-confirm-desc"
          className="m-0 w-full font-sans text-[15px] leading-[1.5] font-normal text-[#1c2a21]"
        >
          Your profile, matches and progress are saved. Log back in any time with {view.email}.
        </p>

        {live ? null : (
          <div className="flex w-full items-center gap-[10px] rounded-[12px] bg-[#f9ebea] p-[12px]">
            <LogoutConfirmBoltIcon className="size-[18px] shrink-0" />
            <p className="m-0 min-w-0 flex-1 font-sans text-[13.5px] leading-[1.45] font-medium text-[#c0392b]">
              Your {SESSION.streakDays}-day streak is safe. Come back before midnight to keep it
              going.
            </p>
          </div>
        )}

        {live && !view.otherDevices ? null : (
          <label className="flex min-h-[24px] cursor-pointer items-center gap-[10px]">
            <input
              type="checkbox"
              checked={allDevices}
              onChange={(event) => {
                log('also log out on other devices:', event.target.checked);
                setAllDevices(event.target.checked);
              }}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={classNames(
                'relative size-[22px] shrink-0 rounded-[6px] border border-solid border-[rgba(28,42,33,0.1)] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.35)]',
                'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1c2a21]',
                allDevices && 'border-[#387440] bg-[#387440] playful:border-[#387440]'
              )}
            >
              {allDevices && (
                <svg viewBox="0 0 22 22" className="absolute inset-0 size-full" fill="none">
                  <path
                    d="M6 11.5l3.4 3.4L16 8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="font-sans text-[14px] font-medium text-[#1c2a21]">
              Also log out on my {view.otherDevices} other{' '}
              {view.otherDevices === 1 ? 'device' : 'devices'}
            </span>
          </label>
        )}

        <div className="flex w-full items-center gap-[12px] max-sm:flex-col-reverse max-sm:items-stretch">
          <Button
            ref={stayRef}
            variant="tertiary"
            size="lg"
            onClick={close}
            className="min-w-px flex-1 !px-[34px] max-lg:!px-[16px]"
          >
            Stay logged in
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={busy}
            onClick={confirm}
            className="h-[56px] min-w-px flex-1 !drop-shadow-[0_4px_0_#c0392b] max-lg:h-auto"
          >
            Log out
          </Button>
        </div>
      </div>
    </FlowPortal>
  );
};

export default LogoutConfirm;
