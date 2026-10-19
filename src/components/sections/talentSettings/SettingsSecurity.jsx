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
const SettingsSecurity = ({ settings }) => {
  const { state, update } = settings;
  const copy = SECURITY_COPY;
  const [twoStep, setTwoStep] = useState(true);
  const [removed, setRemoved] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);

  // ?state=device-logged-out on its own reproduces the drawn frame: Safari on iPad is logged out.
  if (state === 'device-logged-out' && lastRemoved === null) {
    log('branch', { seed: 'device-logged-out -> safari-ipad' });
    setRemoved(['safari-ipad']);
    setLastRemoved('safari-ipad');
  }

  const devices = DEVICES.filter((d) => !removed.includes(d.id));
  const toastDevice = DEVICES.find((d) => d.id === lastRemoved);
  const toast = toastDevice ? DEVICE_TOAST(toastDevice.name) : null;

  const logOutDevice = (device) => {
    log('dispatch log out device', { id: device.id });
    setRemoved((prev) => [...prev, device.id]);
    setLastRemoved(device.id);
    update({ state: 'device-logged-out' });
  };

  const logOutAll = () => {
    log('dispatch log out all other devices');
    setRemoved(DEVICES.filter((d) => !d.thisDevice).map((d) => d.id));
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
          description={copy.signIn.password.description}
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
        <div className="flex w-full items-center pt-[12px]">
          <Button variant="tertiary" size="lg" onClick={logOutAll}>
            {copy.devices.logOutAll}
          </Button>
        </div>
      </GroupCard>

      {state === 'password' && (
        <ChangePasswordDialog
          open
          onClose={() => update({ state: null })}
          onSubmit={() => update({ state: null })}
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
        open={state === 'device-logged-out' && Boolean(toast)}
        title={toast?.title}
        body={toast?.body}
        onDismiss={() => update({ state: null })}
      />
    </div>
  );
};

export default SettingsSecurity;
