import {
  changePassword as changePasswordApi,
  logOutDevice as logOutDeviceApi,
  logOutOtherDevices,
  settingsError,
} from '../../../services/settings.api.js';
import { useState } from 'react';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { TalentHomeChipLockIcon as _unused } from '../../shared/assets.jsx';
import {
  SettingsLaptopIcon,
  SettingsMobileDeviceIcon,
  SettingsTabletIcon,
} from '../../shared/assets.jsx';
import { GroupCard, SettingRow, SettingsToggle, StatusPill, TextAction } from './SettingsBUi.jsx';
import { SettingsToast } from './SettingsBDialogs.jsx';
import { ChangePasswordDialog, TwoStepDialog } from './SettingsBSecurityDialogs.jsx';
import { DEVICES, DEVICE_TOAST, SECURITY_COPY } from './talentSettingsBData.js';

const log = debug('SettingsSecurity');

const DEVICE_ICONS = {
  laptop: SettingsLaptopIcon,
  mobile: SettingsMobileDeviceIcon,
  tablet: SettingsTabletIcon,
};

/*
 * SettingsSecurity — ST-06 "Security and sign-in" (Playful 7843:14250 / Focused 8110:45907) and
 * its states: ?state=password (ST-06b dialog), ?state=two-step (ST-06c code dialog),
 * ?state=device-logged-out (ST-06d: iPad row gone + toast). Everything works on local state.
 */
/* "active now" / "5 minutes ago" / "2 days ago" / "12 Oct" for a device row. */
const seenLabel = (iso) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 10) return 'active now';
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d} ${d === 1 ? 'day' : 'days'} ago`;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
const changedLabel = (iso) => {
  if (!iso) return 'Not changed on GTH yet.';
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return 'Last changed today.';
  if (days < 30) return `Last changed ${days} ${days === 1 ? 'day' : 'days'} ago.`;
  const months = Math.round(days / 30);
  return `Last changed ${months} ${months === 1 ? 'month' : 'months'} ago.`;
};

const SettingsSecurity = ({ settings }) => {
  const { state, update } = settings;
  const copy = SECURITY_COPY;
  // Live: real sign-in sessions + password change (GET/DELETE /settings/sessions, POST /settings/password).
  // Two-step verification and Google sign-in are not built on the backend yet: hidden on live pages.
  const live = settings?.live?.overview ? settings.live : null;
  const [twoStep, setTwoStep] = useState(true);
  const [removed, setRemoved] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [liveToast, setLiveToast] = useState(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [devError, setDevError] = useState(null);

  // ?state=device-logged-out on its own reproduces the drawn frame: Safari on iPad is logged out.
  if (!live && state === 'device-logged-out' && lastRemoved === null) {
    log('branch', { seed: 'device-logged-out -> safari-ipad' });
    setRemoved(['safari-ipad']);
    setLastRemoved('safari-ipad');
  }

  const sessions = live
    ? (live.overview.sessions || []).map((s) => ({
        id: s.id,
        name: s.device,
        meta: s.thisDevice ? 'active now' : seenLabel(s.lastSeenAt),
        kind: DEVICE_ICONS[s.kind] ? s.kind : 'laptop',
        thisDevice: s.thisDevice,
      }))
    : DEVICES;
  const devices = sessions.filter((d) => !removed.includes(d.id));
  const toastDevice = live ? null : DEVICES.find((d) => d.id === lastRemoved);
  const toast = live ? liveToast : toastDevice ? DEVICE_TOAST(toastDevice.name) : null;

  const dropSessions = (ids) => {
    setRemoved((prev) => [...prev, ...ids]);
    live.patch('sessions', (live.overview.sessions || []).filter((s) => !ids.includes(s.id)));
  };

  const logOutDevice = async (device) => {
    log('dispatch log out device', { id: device.id });
    if (live) {
      setDevError(null);
      try {
        await logOutDeviceApi(device.id);
        dropSessions([device.id]);
        setLiveToast(DEVICE_TOAST(device.name));
      } catch (err) {
        setDevError(settingsError(err, 'Could not log that device out. Try again.'));
      }
      return;
    }
    setRemoved((prev) => [...prev, device.id]);
    setLastRemoved(device.id);
    update({ state: 'device-logged-out' });
  };

  const logOutAll = async () => {
    log('dispatch log out all other devices');
    if (live) {
      setDevError(null);
      try {
        const res = await logOutOtherDevices();
        dropSessions(devices.filter((d) => !d.thisDevice).map((d) => d.id));
        setLiveToast({
          title: res?.loggedOut ? `Logged out of ${res.loggedOut} other ${res.loggedOut === 1 ? 'device' : 'devices'}` : 'No other devices',
          body: 'Only this device is still logged in.',
        });
      } catch (err) {
        setDevError(settingsError(err, 'Could not log the other devices out. Try again.'));
      }
      return;
    }
    setRemoved(DEVICES.filter((d) => !d.thisDevice).map((d) => d.id));
  };

  const submitPassword = async ({ currentPassword, newPassword, logOutOthers }) => {
    if (!live) {
      update({ state: null });
      return;
    }
    setPwBusy(true);
    setPwError(null);
    try {
      const res = await changePasswordApi({ currentPassword, newPassword, logOutOthers });
      live.patch('passwordChangedAt', new Date().toISOString());
      if (logOutOthers) dropSessions(devices.filter((d) => !d.thisDevice).map((d) => d.id));
      update({ state: null });
      setLiveToast({
        title: 'Password updated',
        body: res?.otherSessionsLoggedOut
          ? `We logged you out of ${res.otherSessionsLoggedOut} other ${res.otherSessionsLoggedOut === 1 ? 'device' : 'devices'}.`
          : 'Use it next time you log in.',
      });
    } catch (err) {
      setPwError(settingsError(err, 'Could not update your password. Try again.'));
    } finally {
      setPwBusy(false);
    }
  };

  const onTwoStepToggle = (next) => {
    if (next) {
      log('branch', { twoStep: 'enable -> code dialog' });
      update({ state: 'two-step' });
    } else {
      log('branch', { twoStep: 'disable' });
      setTwoStep(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="security">
      <GroupCard title={copy.signIn.title}>
        <SettingRow
          nowrapControl={false}
          title={copy.signIn.password.title}
          description={live ? changedLabel(live.overview.passwordChangedAt) : copy.signIn.password.description}
          control={
            <Button
              variant="tertiary"
              size="lg"
              onClick={() => update({ state: 'password' })}
              aria-haspopup="dialog"
            >
              {copy.signIn.password.cta}
            </Button>
          }
        />
        {live ? null : (
        <>
        <SettingRow
          title={copy.signIn.twoStep.title}
          titleId="sec-two-step"
          chip={twoStep ? <StatusPill tone="on">{copy.signIn.twoStep.chip}</StatusPill> : null}
          description={copy.signIn.twoStep.description}
          control={
            <SettingsToggle
              labelledBy="sec-two-step"
              checked={twoStep}
              onChange={onTwoStepToggle}
            />
          }
        />
        <SettingRow
          top={false}
          title={copy.signIn.google.title}
          description={copy.signIn.google.email}
          control={
            <TextAction tone="danger" onClick={() => log('dispatch disconnect google')}>
              {copy.signIn.google.cta}
            </TextAction>
          }
        />
        </>
        )}
      </GroupCard>

      <GroupCard title={copy.devices.title} description={copy.devices.description}>
        {devices.map((device) => {
          const Icon = DEVICE_ICONS[device.kind];
          return (
            <div
              key={device.id}
              className="flex w-full items-center gap-[14px] border-t border-[rgba(28,42,33,0.08)] py-[14px]"
            >
              <span
                aria-hidden="true"
                className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]"
              >
                <Icon className="size-[19px]" />
              </span>
              <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[2px]">
                <div className="flex items-center gap-[8px]">
                  <p className="text-[15px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
                    {device.name}
                  </p>
                  {device.thisDevice && (
                    <StatusPill tone="device">{copy.devices.thisDevice}</StatusPill>
                  )}
                </div>
                <p className="text-[13px] leading-[normal] text-[#595959]">{device.meta}</p>
              </div>
              {!device.thisDevice && (
                <TextAction
                  tone="danger"
                  onClick={() => logOutDevice(device)}
                  aria-label={`${copy.devices.logOut} ${device.name}`}
                >
                  {copy.devices.logOut}
                </TextAction>
              )}
            </div>
          );
        })}
        {devError ? (
          <p role="alert" className="m-0 w-full pt-[8px] text-[14px] font-medium text-[#c0392b]">
            {devError}
          </p>
        ) : null}
        {devices.some((d) => !d.thisDevice) || !live ? (
          <div className="flex w-full items-center pt-[12px]">
            <Button variant="tertiary" size="lg" onClick={logOutAll}>
              {copy.devices.logOutAll}
            </Button>
          </div>
        ) : null}
      </GroupCard>

      {state === 'password' && (
        <ChangePasswordDialog
          open
          live={Boolean(live)}
          busy={pwBusy}
          error={pwError}
          onClose={() => {
            setPwError(null);
            update({ state: null });
          }}
          onSubmit={submitPassword}
        />
      )}
      {state === 'two-step' && (
        <TwoStepDialog
          open
          onClose={() => update({ state: null })}
          onVerified={() => {
            setTwoStep(true);
            update({ state: null });
          }}
        />
      )}
      <SettingsToast
        open={live ? Boolean(toast) : state === 'device-logged-out' && Boolean(toast)}
        title={toast?.title}
        body={toast?.body}
        onDismiss={() => (live ? setLiveToast(null) : update({ state: null }))}
      />
    </div>
  );
};

export default SettingsSecurity;
