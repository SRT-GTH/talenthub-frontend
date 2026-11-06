import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { GroupCard, SettingRow, SettingsToggle } from '../../../talentSettings/SettingsBUi.jsx';
import FieldButton from '../fields/FieldButton.jsx';
import { ChevronDownSmallIcon, ClockIcon } from '../fields/FieldsIcons.jsx';
import RolesMatrixCard from '../roles/RolesMatrixCard.jsx';
import SettingsMockShell from '../roles/SettingsMockShell.jsx';
import {
  INACTIVE_CARD,
  MATRIX_ACTIONS,
  MATRIX_COLUMNS,
  MATRIX_ROWS,
  NAV_LABELS_ROLES,
  SESSION_CARD,
  SETTINGS_SUBTITLE,
  SITE_CONTENT,
  buildInitialCells,
} from '../roles/settingsMockData.js';

const log = debug('SettingsRolesMock');

/*
 * SettingsRolesMock — Platform Admin 7.8.7a "Settings → Roles · site copy permissions and Content Editor" (Figma 7.8.7a).
 *   /admin/site-copy/settings/roles            (add ?role=super for the Super Admin chrome of the frame)
 * A MOCK copy of Settings → Roles and permissions (the real page is `/admin/settings/roles`, wired to the backend and not edited): the matrix gets the "Content Editor" column and the
 * "SITE CONTENT · NEW" rows, driven by COPY_PERMISSIONS (siteCopy/copyAccess.js); below it the "Session rules" and "Inactive accounts" cards, "Download permissions matrix"
 * (a CSV of the matrix as shown) and "Save changes". Everything is local: the checkboxes toggle, the switches switch.
 * ⚠️ ASSUMPTION: "Save changes" stores nothing and only confirms ("Changes saved." — not drawn); the two session selects only log (their options are not drawn).
 */
const SelectBox = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex min-h-[40px] cursor-pointer items-center gap-[8px] rounded-[12px] border border-solid border-[#1c2a21]/10 bg-white px-[14px] py-[10px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {icon}
    {label}
    <ChevronDownSmallIcon className="size-[18px] text-[#595959]" />
  </button>
);

const SettingsRolesMock = ({ ctx }) => {
  const [cells, setCells] = useState(buildInitialCells);
  const [twoStep, setTwoStep] = useState(true);
  const [lock, setLock] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    log('mount', { role: ctx.role, siteContentRows: SITE_CONTENT.rows.length });
  }, [ctx.role]);

  const toggle = (rowId, colId, next) => {
    setSaved(false);
    setCells((c) => ({ ...c, [`${rowId}:${colId}`]: next }));
  };

  const downloadMatrix = () => {
    const head = ['Permission', ...MATRIX_COLUMNS.map((c) => c.label)];
    const lines = [...MATRIX_ROWS, ...SITE_CONTENT.rows].map((r) =>
      [r.title, ...MATRIX_COLUMNS.map((c) => (cells[`${r.id}:${c.id}`] ? 'Yes' : 'No'))].join(',')
    );
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'permissions-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
    log('download matrix', lines.length, 'rows');
  };

  return (
    <SettingsMockShell
      ctx={ctx}
      subtitle={SETTINGS_SUBTITLE}
      labels={NAV_LABELS_ROLES}
      activeLabel="Roles and permissions"
      itemWeight={400}
    >
      <RolesMatrixCard cells={cells} onToggle={toggle} />

      <GroupCard title={SESSION_CARD.title} description={SESSION_CARD.sub}>
        <SettingRow
          title={SESSION_CARD.twoStep.title}
          description={SESSION_CARD.twoStep.text}
          control={
            <SettingsToggle
              checked={twoStep}
              onChange={setTwoStep}
              label={SESSION_CARD.twoStep.title}
            />
          }
        />
        <div className="flex w-full flex-wrap items-center gap-[16px] pt-[4px] pb-[6px]">
          <SelectBox
            icon={<ClockIcon className="size-[16px] text-[#595959]" />}
            label={SESSION_CARD.selects[0]}
            onClick={() => log('select (options not drawn)', SESSION_CARD.selects[0])}
          />
          <span aria-hidden="true" className="font-sans text-[14px] font-medium text-[#595959]">
            ·
          </span>
          <SelectBox
            icon={<ClockIcon className="size-[16px] text-[#595959]" />}
            label={SESSION_CARD.selects[1]}
            onClick={() => log('select (options not drawn)', SESSION_CARD.selects[1])}
          />
        </div>
      </GroupCard>

      <GroupCard title={INACTIVE_CARD.title}>
        <SettingRow
          top={false}
          title={INACTIVE_CARD.row.title}
          description={INACTIVE_CARD.row.text}
          control={
            <SettingsToggle checked={lock} onChange={setLock} label={INACTIVE_CARD.row.title} />
          }
        />
      </GroupCard>

      <div className="flex flex-wrap items-center gap-[12px]">
        <button
          type="button"
          onClick={downloadMatrix}
          className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#595959] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {MATRIX_ACTIONS.download}
        </button>
        <span className="flex-1" />
        {saved ? (
          <span role="status" className="font-sans text-[13px] text-[#2a5730]">
            Changes saved.
          </span>
        ) : null}
        <FieldButton
          tone="primary"
          size="sm"
          onClick={() => {
            log('save changes (mock, nothing stored)');
            setSaved(true);
          }}
        >
          {MATRIX_ACTIONS.save}
        </FieldButton>
      </div>
    </SettingsMockShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.7a',
    area: 'site-copy',
    priority: 5,
    match: (ctx) =>
      ctx.segments.length === 2 && ctx.segments[0] === 'settings' && ctx.segments[1] === 'roles',
    Component: SettingsRolesMock,
  },
];

export default SettingsRolesMock;
