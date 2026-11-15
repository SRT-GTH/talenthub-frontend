import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import PipelineToast from '../../applicationPipeline/actions/PipelineToast.jsx';
import ChangePasswordDialog from '../security/ChangePasswordDialog.jsx';
import DeleteAccountDialog from '../security/DeleteAccountDialog.jsx';
import TwoStepDialog from '../security/TwoStepDialog.jsx';
import {
  SettingLine,
  SettingsCard,
  SettingsChip,
  SettingsSwitch,
  SettingsTextLink,
  ToastText,
  TwoStepStatus,
} from '../security/SettingsParts.jsx';
import {
  DEVICES,
  DEVICE_TOAST_DEFAULT_ID,
  PASSWORD_COPY,
  SECURITY_COPY,
  TWO_STEP_VERIFIED_TOAST,
  deviceToast,
} from '../security/securityData.js';

import {
  changePassword,
  logOutDevice as logOutSession,
  settingsError,
} from '../../../../services/settings.api.js';
import { ageOf, useLiveSettingsOverview } from '../account/useLiveSettingsOverview.js';

const log = debug('RecruiterSecurityTab');

const whenSeen = (iso) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 5) return 'now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

/*
 * SecurityTab - recruiter Settings `?tab=security` (Figma SR-13 "Settings · Security and sign-in" 10161:81691) with its states SR-23 (change password), SR-24 (two-step code), SR-25 (device logged out toast) and
 * SR-26 (delete recruiter account). Three white cards: Sign-in (Password + "Change password", Two-step verification with the "On" chip and "Manage", Single sign-on (Google Workspace) with a green switch),
 * "Where you're signed in" (three devices, "Log out" on the two others) and "Danger zone" (Leave organisation, Delete account). The talent tab (`talentSettings/SettingsSecurity`) is the model for the flows; the look is the recruiter card.
 * URL: modal=change-password | two-step | delete-account (+ confirm=<typed text>), toast=device-logged-out | password-updated | two-step-verified, removed=<device id>[,<id>] (see security/securityData.js). Mock only: nothing is saved.
 * ⚠️ ASSUMPTIONS (not drawn): "Manage" opens the code step (SR-24); "Leave organisation" only logs; the toasts after Update password / Verify; confirming the delete goes to the logged-out screen; the single sign-on switch only flips.
 * Props: settings (useRecruiterSettingsState()).
 */
const SecurityTab = ({ settings }) => {
  const { modal, update } = settings;
  const [sso, setSso] = useState(true);
  const toast = settings.get('toast');
  const removed = settings.get('removed').split(',').filter(Boolean);
  const typed = settings.get('confirm');
  // Signed in: real devices (GET /settings/sessions via the overview), password change and device log-out.
  // Sign-in already asks for an emailed code every time, so two-step shows as on with nothing to manage.
  const live = useLiveSettingsOverview();
  const isLive = live.status !== 'demo';
  const navigate = useNavigate();
  const [liveError, setLiveError] = useState(null);
  const [liveToast, setLiveToast] = useState(null);
  const liveDevices = (live.overview?.sessions || []).map((s) => ({
    id: s.id,
    name: s.device,
    city: '',
    meta: s.thisDevice ? 'This browser · now' : `Last seen ${whenSeen(s.lastSeenAt)}`,
    current: s.thisDevice,
  }));
  const devices = isLive ? liveDevices : DEVICES.filter((d) => !removed.includes(d.id));
  const otherDevices = devices.filter((d) => !d.current).length;

  useEffect(() => {
    log('mount', { modal, toast, removed, typed: typed.length });
  }, [modal, toast, removed.join(','), typed.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // A stable close handler: `ui/Modal` re-focuses the dialog whenever its `onClose` identity changes.
  const closeModal = useCallback(() => update({ modal: null, confirm: null }), [update]);
  const closeToast = useCallback(() => update({ toast: null }, { replace: true }), [update]);

  const logOutDevice = (device) => {
    log('dispatch log out device', { id: device.id });
    if (isLive) {
      setLiveError(null);
      logOutSession(device.id)
        .then(() => live.reload())
        .then(() =>
          setLiveToast({
            title: `Success - Logged out of ${device.name}`,
            message: 'That device needs to sign in again.',
          })
        )
        .catch((err) => setLiveError(settingsError(err, 'That device couldn’t be logged out.')));
      return;
    }
    update({ removed: [...removed, device.id].join(','), toast: 'device-logged-out' });
  };

  const submitPassword = ({ currentPassword, newPassword, logOutOthers }) => {
    log('dispatch password updated', { logOutOthers });
    if (isLive) {
      setLiveError(null);
      changePassword({ currentPassword, newPassword, logOutOthers })
        .then(() => live.reload())
        .then(() => {
          update({ modal: null });
          setLiveToast(PASSWORD_COPY.updated);
        })
        .catch((err) => {
          update({ modal: null });
          setLiveError(settingsError(err, 'Your password wasn’t changed.'));
        });
      return;
    }
    update({
      modal: null,
      toast: 'password-updated',
      removed: logOutOthers
        ? DEVICES.filter((d) => !d.current)
            .map((d) => d.id)
            .join(',')
        : settings.get('removed'),
    });
  };

  const deviceToastDevice = DEVICES.find(
    (d) => d.id === (removed.at(-1) ?? DEVICE_TOAST_DEFAULT_ID)
  );
  const toastView = liveToast
    ? liveToast
    : toast === 'device-logged-out'
      ? deviceToast(deviceToastDevice)
      : toast === 'password-updated'
        ? PASSWORD_COPY.updated
        : toast === 'two-step-verified'
          ? TWO_STEP_VERIFIED_TOAST
          : null;

  const { signIn, devices: deviceCopy, danger } = SECURITY_COPY;

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="security">
      {liveError ? (
        <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-[#c0392b]">
          {liveError}
        </p>
      ) : null}
      <SettingsCard title={signIn.title}>
        <SettingLine
          title={signIn.password.title}
          description={
            isLive
              ? live.overview?.passwordChangedAt
                ? `Last changed ${ageOf(live.overview.passwordChangedAt)}`
                : 'Not changed since you joined'
              : signIn.password.description
          }
          control={
            <Button
              variant="tertiary"
              className="!h-[40px] !py-0 max-sm:!px-[20px]"
              onClick={() => update({ modal: 'change-password' })}
              aria-haspopup="dialog"
            >
              {signIn.password.cta}
            </Button>
          }
        />
        <SettingLine
          title={signIn.twoStep.title}
          description={
            isLive ? 'A code is emailed to you every time you sign in' : signIn.twoStep.description
          }
          control={
            isLive ? (
              <SettingsChip>{signIn.twoStep.chip}</SettingsChip>
            ) : (
              <TwoStepStatus
                chip={signIn.twoStep.chip}
                manage={signIn.twoStep.manage}
                onManage={() => update({ modal: 'two-step' })}
              />
            )
          }
        />
        {isLive ? null : (
          <SettingLine
            titleId="recruiter-sso-title"
            title={signIn.sso.title}
            description={signIn.sso.description}
            control={
              <SettingsSwitch labelledBy="recruiter-sso-title" checked={sso} onChange={setSso} />
            }
          />
        )}
      </SettingsCard>

      <SettingsCard title={deviceCopy.title}>
        {devices.map((device) => (
          <SettingLine
            key={device.id}
            title={device.name}
            description={device.meta}
            control={
              device.current ? (
                <SettingsChip>{deviceCopy.thisDevice}</SettingsChip>
              ) : (
                <SettingsTextLink
                  onClick={() => logOutDevice(device)}
                  aria-label={`${deviceCopy.logOut} ${device.name}`}
                >
                  {deviceCopy.logOut}
                </SettingsTextLink>
              )
            }
          />
        ))}
      </SettingsCard>

      {isLive ? (
        <SettingsCard title={danger.title}>
          <SettingLine
            title="Leave your organisation or close this account"
            description="Your organisation keeps its jobs and candidate history. Our support team does this with you so nothing is lost."
            control={
              <Button
                variant="tertiary"
                className="!h-[40px] !py-0 max-sm:!px-[20px]"
                onClick={() => navigate('/recruiter/help?help=contact')}
              >
                Contact support
              </Button>
            }
          />
        </SettingsCard>
      ) : (
        <SettingsCard title={danger.title}>
          <SettingLine
            title={danger.leave.title}
            description={danger.leave.description}
            control={
              <Button
                variant="tertiary"
                className="!h-[40px] !py-0 max-sm:!px-[20px]"
                onClick={() => log('leave organisation (no screen is drawn for it)')}
              >
                {danger.leave.cta}
              </Button>
            }
          />
          <SettingLine
            title={danger.delete.title}
            description={danger.delete.description}
            control={
              <Button
                variant="danger"
                size="sm"
                className="!h-[40px] !py-0"
                onClick={() => update({ modal: 'delete-account' })}
                aria-haspopup="dialog"
              >
                {danger.delete.cta}
              </Button>
            }
          />
        </SettingsCard>
      )}

      {modal === 'change-password' ? (
        <ChangePasswordDialog
          blank={isLive}
          otherDevices={otherDevices}
          onClose={closeModal}
          onSubmit={submitPassword}
        />
      ) : null}
      {modal === 'two-step' ? (
        <TwoStepDialog
          onClose={closeModal}
          onVerified={() => update({ modal: null, toast: 'two-step-verified' })}
        />
      ) : null}
      {modal === 'delete-account' ? (
        <DeleteAccountDialog
          value={typed}
          onChange={(text) => update({ confirm: text }, { replace: true })}
          onCancel={closeModal}
          onTeam={() => update({ tab: 'team', modal: null, confirm: null })}
          onConfirm={() => update({ modal: null, confirm: null, state: 'logged-out' })}
        />
      ) : null}
      {toastView ? (
        <PipelineToast
          title={toastView.title}
          message={<ToastText>{toastView.message}</ToastText>}
          onClose={() => {
            setLiveToast(null);
            closeToast();
          }}
        />
      ) : null}
    </div>
  );
};

export default SecurityTab;
