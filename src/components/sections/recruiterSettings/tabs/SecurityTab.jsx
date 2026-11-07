import { useCallback, useEffect, useState } from 'react';
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

const log = debug('RecruiterSecurityTab');

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
  const devices = DEVICES.filter((d) => !removed.includes(d.id));
  const otherDevices = devices.filter((d) => !d.current).length;

  useEffect(() => {
    log('mount', { modal, toast, removed, typed: typed.length });
  }, [modal, toast, removed.join(','), typed.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // A stable close handler: `ui/Modal` re-focuses the dialog whenever its `onClose` identity changes.
  const closeModal = useCallback(() => update({ modal: null, confirm: null }), [update]);
  const closeToast = useCallback(() => update({ toast: null }, { replace: true }), [update]);

  const logOutDevice = (device) => {
    log('dispatch log out device', { id: device.id });
    update({ removed: [...removed, device.id].join(','), toast: 'device-logged-out' });
  };

  const submitPassword = ({ logOutOthers }) => {
    log('dispatch password updated', { logOutOthers });
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
  const toastView =
    toast === 'device-logged-out'
      ? deviceToast(deviceToastDevice)
      : toast === 'password-updated'
        ? PASSWORD_COPY.updated
        : toast === 'two-step-verified'
          ? TWO_STEP_VERIFIED_TOAST
          : null;

  const { signIn, devices: deviceCopy, danger } = SECURITY_COPY;

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="security">
      <SettingsCard title={signIn.title}>
        <SettingLine
          title={signIn.password.title}
          description={signIn.password.description}
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
          description={signIn.twoStep.description}
          control={
            <TwoStepStatus
              chip={signIn.twoStep.chip}
              manage={signIn.twoStep.manage}
              onManage={() => update({ modal: 'two-step' })}
            />
          }
        />
        <SettingLine
          titleId="recruiter-sso-title"
          title={signIn.sso.title}
          description={signIn.sso.description}
          control={
            <SettingsSwitch labelledBy="recruiter-sso-title" checked={sso} onChange={setSso} />
          }
        />
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

      {modal === 'change-password' ? (
        <ChangePasswordDialog
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
          onClose={closeToast}
        />
      ) : null}
    </div>
  );
};

export default SecurityTab;
