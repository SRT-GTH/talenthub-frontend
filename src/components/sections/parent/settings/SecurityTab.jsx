import { useState } from 'react';
import {
  changePassword as changePasswordApi,
  logOutDevice as logOutDeviceApi,
  logOutOtherDevices,
  settingsError,
} from '../../../../services/settings.api.js';
import { debug } from '../../../../utils/debug.js';
import {
  SettingsLaptopIcon,
  SettingsMobileDeviceIcon,
  SettingsTabletIcon,
} from '../../../shared/assets.jsx';
import {
  GroupCard,
  SettingRow,
  SettingsToggle,
  StatusPill,
  TextAction,
} from '../../talentSettings/SettingsBUi.jsx';
import { ChangePasswordDialog } from '../../talentSettings/SettingsBSecurityDialogs.jsx';
import LiveSaveStatus from '../../talentSettings/LiveSaveStatus.jsx';
import TwoStepSettingsRow from '../../twoStep/TwoStepSettingsRow.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentToast from '../wards/dialogs/ParentToast.jsx';
import { SECURITY } from './data/settingsData.js';
import { liveDevices, passwordChangedLabel } from './settingsLive.js';

const log = debug('SettingsSecurityTab');

const DEVICE_ICONS = {
  laptop: SettingsLaptopIcon,
  mobile: SettingsMobileDeviceIcon,
  tablet: SettingsTabletIcon,
};

/*
 * SecurityTab — PS-04 "Settings · Security and sign-in (parent)" (Figma 10046:3404): Sign-in (password, two-step switch with the "On" chip, Google) and "Where you are logged in" (three devices, a
 * Log out link on the other two, "Log out of all other devices"). Logging a device out removes its row. Local state only.
 * "Change password" opens the talent Settings change-password dialog (⚠️ ASSUMPTION: the parent canvas draws none; demo only, no API call — submitting closes it and, when ticked, logs the other devices out).
 * ⚠️ ASSUMPTION: "Disconnect" only logs (no dialog is drawn for it).
 * Live (signed-in parent, settings.live): the talent Settings endpoints, which act on whoever is signed in. The devices are GET /settings/overview
 * sessions (DELETE /settings/sessions/:id, POST /settings/sessions/revoke-others), the password is POST /settings/password, two-step is the shared
 * TwoStepSettingsRow (opens /security/2-step, any signed-in account) and the Google row is hidden (Google sign-in is not built), as on the talent page.
 */
const SecurityTab = ({ settings }) => {
  const live = settings?.live?.overview ? settings.live : null;
  const { signIn, devices } = SECURITY;
  const [twoStep, setTwoStep] = useState(true);
  const [demoList, setDemoList] = useState(devices.list);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [devError, setDevError] = useState(null);
  const [toast, setToast] = useState(null);
  const list = live ? liveDevices(live.overview.sessions || []) : demoList;

  const dropLive = (ids) =>
    live.patch(
      'sessions',
      (live.overview.sessions || []).filter((s) => !ids.includes(s.id))
    );

  const logOut = async (ids, all = false) => {
    log('log out devices', { ids, live: Boolean(live) });
    if (!live) {
      setDemoList((l) => l.filter((d) => !ids.includes(d.id)));
      return;
    }
    setDevError(null);
    const others = list.filter((d) => !d.current).map((d) => d.id);
    try {
      if (all) {
        const res = await logOutOtherDevices();
        log('revoked others', res?.loggedOut);
        dropLive(others);
        setToast(`Logged out of ${res?.loggedOut ?? others.length} other devices`);
      } else {
        await logOutDeviceApi(ids[0]);
        dropLive(ids);
        setToast(`${list.find((d) => d.id === ids[0])?.name || 'Device'} is logged out`);
      }
    } catch (err) {
      log.error('log out device failed:', err?.response?.status);
      setDevError(settingsError(err, 'Could not log that device out. Try again.'));
    }
  };

  const submitPassword = async ({ currentPassword, newPassword, logOutOthers }) => {
    if (!live) {
      log('password changed (demo, no API)', { logOutOthers });
      if (logOutOthers)
        logOut(
          list.filter((d) => !d.current).map((d) => d.id),
          true
        );
      setPwOpen(false);
      return;
    }
    setPwBusy(true);
    setPwError(null);
    try {
      const res = await changePasswordApi({ currentPassword, newPassword, logOutOthers });
      log('password changed', { others: res?.otherSessionsLoggedOut });
      live.patch('passwordChangedAt', new Date().toISOString());
      if (logOutOthers) dropLive(list.filter((d) => !d.current).map((d) => d.id));
      setPwOpen(false);
      setToast('Password updated');
    } catch (err) {
      log.error('password change failed:', err?.response?.status);
      setPwError(settingsError(err, 'Could not update your password. Try again.'));
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="security">
      <GroupCard title={signIn.title}>
        <SettingRow
          top={false}
          nowrapControl={false}
          title={signIn.password.title}
          description={
            live ? passwordChangedLabel(live.overview.passwordChangedAt) : signIn.password.desc
          }
          control={
            <ParentButton
              variant="secondary"
              onClick={() => {
                log('change password -> dialog');
                setPwOpen(true);
              }}
            >
              {signIn.password.cta}
            </ParentButton>
          }
        />
        {live ? (
          <TwoStepSettingsRow />
        ) : (
          <>
            <SettingRow
              title={signIn.twoStep.title}
              titleId="sec-two-step"
              chip={twoStep ? <StatusPill tone="on">{signIn.twoStep.chip}</StatusPill> : null}
              description={signIn.twoStep.desc}
              control={
                <SettingsToggle labelledBy="sec-two-step" checked={twoStep} onChange={setTwoStep} />
              }
            />
            <SettingRow
              top={false}
              title={signIn.google.title}
              description={signIn.google.email}
              control={
                <TextAction
                  tone="danger"
                  onClick={() => log('disconnect google (no dialog drawn)')}
                >
                  {signIn.google.cta}
                </TextAction>
              }
            />
          </>
        )}
      </GroupCard>

      <GroupCard title={devices.title} description={devices.desc}>
        {list.map((d) => {
          const Icon = DEVICE_ICONS[d.kind];
          return (
            <div
              key={d.id}
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
                  <p className="text-[15px] leading-[18px] font-semibold whitespace-nowrap text-[#1c2a21]">
                    {d.name}
                  </p>
                  {d.current ? <StatusPill tone="device">{devices.thisDevice}</StatusPill> : null}
                </div>
                <p className="text-[13px] leading-[16px] text-[#595959]">{d.meta}</p>
              </div>
              {d.current ? null : (
                <TextAction
                  tone="danger"
                  onClick={() => logOut([d.id])}
                  aria-label={`${devices.logOut} ${d.name}`}
                >
                  {devices.logOut}
                </TextAction>
              )}
            </div>
          );
        })}
        {list.some((d) => !d.current) ? (
          <div className="flex w-full items-center pt-[12px]">
            <ParentButton
              variant="secondary"
              onClick={() =>
                logOut(
                  list.filter((d) => !d.current).map((d) => d.id),
                  true
                )
              }
            >
              {devices.logOutAll}
            </ParentButton>
          </div>
        ) : null}
      </GroupCard>
      <LiveSaveStatus status={devError ? { tone: 'error', text: devError } : null} />
      {pwOpen ? (
        <ChangePasswordDialog
          open
          live={Boolean(live)}
          busy={pwBusy}
          error={pwError}
          onClose={() => {
            setPwError(null);
            setPwOpen(false);
          }}
          onSubmit={submitPassword}
        />
      ) : null}
      {toast ? <ParentToast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
};

export default SecurityTab;
