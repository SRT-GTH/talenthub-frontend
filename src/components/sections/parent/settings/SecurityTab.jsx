import { useState } from 'react';
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
import ParentButton from '../ParentButton.jsx';
import { SECURITY } from './data/settingsData.js';

const log = debug('SettingsSecurityTab');

const DEVICE_ICONS = {
  laptop: SettingsLaptopIcon,
  mobile: SettingsMobileDeviceIcon,
  tablet: SettingsTabletIcon,
};

/*
 * SecurityTab — PS-04 "Settings · Security and sign-in (parent)" (Figma 10046:3404): Sign-in (password, two-step switch with the "On" chip, Google) and "Where you are logged in" (three devices, a
 * Log out link on the other two, "Log out of all other devices"). Logging a device out removes its row. Local state only.
 * ⚠️ ASSUMPTION: "Change password" and "Disconnect" only log (no dialog is drawn for them in this canvas).
 */
// Live (`live` = { sessions, logOut(ids) -> Promise }): the account's real sign-ins (GET /settings/sessions) and
// real log-outs (DELETE /settings/sessions/:id, POST /settings/sessions/revoke-others). The Google row is mock-only.
const SecurityTab = ({ live = null }) => {
  const { signIn, devices } = SECURITY;
  const [twoStep, setTwoStep] = useState(true);
  const [mockList, setList] = useState(devices.list);
  const list = live ? live.sessions : mockList;

  const logOut = (ids) => {
    log('log out devices', ids);
    if (live) {
      live.logOut(ids);
      return;
    }
    setList((l) => l.filter((d) => !ids.includes(d.id)));
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="security">
      <GroupCard title={signIn.title}>
        <SettingRow
          top={false}
          nowrapControl={false}
          title={signIn.password.title}
          description={signIn.password.desc}
          control={
            <ParentButton
              variant="secondary"
              onClick={() => log('change password (no dialog drawn)')}
            >
              {signIn.password.cta}
            </ParentButton>
          }
        />
        <SettingRow
          title={signIn.twoStep.title}
          titleId="sec-two-step"
          chip={twoStep ? <StatusPill tone="on">{signIn.twoStep.chip}</StatusPill> : null}
          description={signIn.twoStep.desc}
          control={
            <SettingsToggle labelledBy="sec-two-step" checked={twoStep} onChange={setTwoStep} />
          }
        />
        {live ? null : (
          <SettingRow
            top={false}
            title={signIn.google.title}
            description={signIn.google.email}
            control={
              <TextAction tone="danger" onClick={() => log('disconnect google (no dialog drawn)')}>
                {signIn.google.cta}
              </TextAction>
            }
          />
        )}
      </GroupCard>

      <GroupCard title={devices.title} description={devices.desc}>
        {list.map((d) => {
          const Icon = DEVICE_ICONS[d.kind] || DEVICE_ICONS.laptop;
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
              onClick={() => logOut(list.filter((d) => !d.current).map((d) => d.id))}
            >
              {devices.logOutAll}
            </ParentButton>
          </div>
        ) : null}
      </GroupCard>
    </div>
  );
};

export default SecurityTab;
