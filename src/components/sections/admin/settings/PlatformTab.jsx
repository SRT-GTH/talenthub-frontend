import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { GroupCard, SettingRow, SettingsToggle } from '../../talentSettings/SettingsBUi.jsx';
import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import { FLAGS, STAFF_DATA } from './data/adminSettingsData.js';

const log = debug('PlatformTab');

/*
 * PlatformTab — Settings › Platform settings. Two bodies of the same nav item:
 *   flags (7.5.2a 8639:2677): "Feature flags" (two rows with the big white "Turn off" button), "Maintenance mode" (one switch row), the red-ruled "Integration credentials"
 *     group (masked Paystack secret + the red "Rotate key" button).
 *   staff-data (the page behind the deactivate dialog, 7.5.1c 8639:1034): "Staff data" (two download rows), "Lock staff account" (Lock now), the red-ruled
 *     "Deactivate staff account" group with its "Deactivate" button.
 * Props: view 'flags' | 'staff-data', onTurnOff(flag), onMaintenance(), onRotate(), onDeactivate().
 * ⚠️ ASSUMPTION: the download buttons, "Lock now" and "Rotate key" only log; the maintenance switch opens the "Change a setting" dialog instead of flipping (7.5.2b).
 */

const BIG_WHITE =
  'inline-flex h-[56px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const RedButton = ({ children, onClick, icon = true }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-[47px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-[#c0392b] px-[20px] font-sans text-[15px] leading-[24px] font-bold whitespace-nowrap text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0392b]"
  >
    {icon ? <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" /> : null}
    {children}
  </button>
);

const PlatformTab = ({ view = 'flags', onTurnOff, onMaintenance, onRotate, onDeactivate }) => {
  const [maintenance, setMaintenance] = useState(false);
  if (view === 'staff-data') {
    const d = STAFF_DATA;
    return (
      <>
        <GroupCard title={d.data.title} description={d.data.sub} gap="gap-0">
          {d.data.rows.map((r) => (
            <SettingRow
              key={r.title}
              title={r.title}
              description={r.text}
              top
              control={
                <button
                  type="button"
                  onClick={() => log('download (no file)', r.title)}
                  className={BIG_WHITE}
                >
                  {r.action}
                </button>
              }
            />
          ))}
        </GroupCard>
        <GroupCard title={d.lock.title} gap="gap-0">
          <SettingRow
            title={d.lock.row.title}
            description={d.lock.row.text}
            top
            control={
              <SettingsToggle
                checked={false}
                onChange={() => log('lock now (no flow drawn)')}
                label={d.lock.row.title}
              />
            }
          />
        </GroupCard>
        <GroupCard title={d.danger.title} description={d.danger.sub} danger gap="gap-0">
          <SettingRow
            title={d.danger.row.title}
            description={d.danger.row.text}
            top
            control={<RedButton onClick={onDeactivate}>{d.danger.action}</RedButton>}
          />
        </GroupCard>
      </>
    );
  }
  return (
    <>
      <GroupCard title={FLAGS.title} description={FLAGS.sub} gap="gap-0">
        {FLAGS.rows.map((r) => (
          <SettingRow
            key={r.id}
            title={r.title}
            description={r.text}
            top
            control={
              <button type="button" onClick={() => onTurnOff(r)} className={classNames(BIG_WHITE)}>
                {r.action}
              </button>
            }
          />
        ))}
      </GroupCard>
      <GroupCard title={FLAGS.maintenance.title} gap="gap-0">
        <SettingRow
          title={FLAGS.maintenance.row.title}
          description={FLAGS.maintenance.row.text}
          top
          control={
            <SettingsToggle
              checked={maintenance}
              onChange={() => {
                onMaintenance();
                setMaintenance(false);
              }}
              label={FLAGS.maintenance.row.title}
            />
          }
        />
      </GroupCard>
      <GroupCard
        title={FLAGS.credentials.title}
        description={FLAGS.credentials.sub}
        danger
        gap="gap-0"
      >
        <SettingRow
          title={FLAGS.credentials.row.title}
          description={FLAGS.credentials.row.text}
          top
          control={<RedButton onClick={onRotate}>{FLAGS.credentials.action}</RedButton>}
        />
      </GroupCard>
    </>
  );
};

export default PlatformTab;
