import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AgencyChevronDownIcon } from '../../agency/agencyIcons.jsx';
import { GroupCard, SettingRow, SettingsToggle } from '../../talentSettings/SettingsBUi.jsx';
import { AdminCheckIcon, AdminTimeClockIcon } from '../adminIcons.jsx';
import { ROLES } from './data/adminSettingsData.js';

const log = debug('RolesTab');

/*
 * RolesTab — Settings › Roles and permissions (Figma 7.5.1e 8639:2083): the "Roles and permissions" group with the permission matrix (head: Permission + Support ·
 * Moderator · Senior Admin · Super Admin at 12.5/600 #595959; one 61px row per permission, title 15/600 + 13 note, a 22 r6 checkbox per role: on = #387440 with a check, off = white
 * with a hairline ring) · "Session rules" (2-step switch + two select chips: 30 days · idle lock) · "Inactive accounts" (lock after 30 days) · "Download permissions matrix" +
 * "Save changes". Every cell and switch is local state.
 * ⚠️ ASSUMPTION: "Download permissions matrix" and the two select chips only log; "Save changes" logs the matrix (no API).
 */

const Box = ({ on, label, onClick }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={on}
    aria-label={label}
    onClick={onClick}
    className={classNames(
      'grid size-[22px] cursor-pointer place-items-center rounded-[6px] border border-solid p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      on
        ? 'border-[#387440] bg-[#387440] text-white'
        : 'border-[rgba(28,42,33,0.12)] bg-white text-transparent'
    )}
  >
    <AdminCheckIcon className="size-[13px]" />
  </button>
);

const SelectChip = ({ children }) => (
  <button
    type="button"
    onClick={() => log('select (no menu drawn)', children)}
    className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[12px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[14px] py-[10px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    <AdminTimeClockIcon className="size-[16px]" />
    {children}
    <AgencyChevronDownIcon className="size-[18px]" />
  </button>
);

const RolesTab = () => {
  const [matrix, setMatrix] = useState(() => ROLES.rows.map((r) => [...r.on]));
  const [twoStep, setTwoStep] = useState(true);
  const [lock, setLock] = useState(true);
  const flip = (ri, ci) =>
    setMatrix((m) => m.map((row, i) => (i === ri ? row.map((v, j) => (j === ci ? !v : v)) : row)));
  return (
    <>
      <GroupCard title={ROLES.title} description={ROLES.sub} gap="gap-0">
        <div
          role="table"
          aria-label="Permissions by role"
          className="flex w-full flex-col overflow-x-auto"
        >
          <div
            role="row"
            className="grid min-w-[560px] grid-cols-[minmax(0,1fr)_repeat(4,96px)] items-center py-[10px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]"
          >
            <span role="columnheader">{ROLES.head}</span>
            {ROLES.columns.map((c) => (
              <span key={c} role="columnheader" className="text-center">
                {c}
              </span>
            ))}
          </div>
          {ROLES.rows.map((r, ri) => (
            <div
              key={r.id}
              role="row"
              className="grid min-w-[560px] grid-cols-[minmax(0,1fr)_repeat(4,96px)] min-h-[61px] items-center border-t border-solid border-[rgba(28,42,33,0.08)] py-[12px]"
            >
              <span role="rowheader" className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {r.title}
                </span>
                <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                  {r.text}
                </span>
              </span>
              {ROLES.columns.map((c, ci) => (
                <span key={c} role="cell" className="flex justify-center">
                  <Box
                    on={matrix[ri][ci]}
                    label={`${r.title}: ${c}`}
                    onClick={() => flip(ri, ci)}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </GroupCard>
      <GroupCard title={ROLES.session.title} description={ROLES.session.sub} gap="gap-0">
        <SettingRow
          title={ROLES.session.twoStep.title}
          description={ROLES.session.twoStep.text}
          top
          control={
            <SettingsToggle
              checked={twoStep}
              onChange={setTwoStep}
              label={ROLES.session.twoStep.title}
            />
          }
        />
        <div className="flex items-center gap-[16px] pt-[4px] pb-[6px]">
          <SelectChip>{ROLES.session.selects[0]}</SelectChip>
          <span aria-hidden="true" className="font-sans text-[14px] font-medium text-[#595959]">
            ·
          </span>
          <SelectChip>{ROLES.session.selects[1]}</SelectChip>
        </div>
      </GroupCard>
      <GroupCard title={ROLES.inactive.title} gap="gap-0">
        <SettingRow
          title={ROLES.inactive.row.title}
          description={ROLES.inactive.row.text}
          top
          control={
            <SettingsToggle checked={lock} onChange={setLock} label={ROLES.inactive.row.title} />
          }
        />
      </GroupCard>
      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          onClick={() => log('download permissions matrix (no file)')}
          className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#595959] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {ROLES.download}
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => log('save changes (mock)', { matrix, twoStep, lock })}
          className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {ROLES.save}
        </button>
      </div>
    </>
  );
};

export default RolesTab;
