import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { SettingsARadioOnIcon } from '../../../shared/assets.jsx';
import { GroupCard, SettingRow, SettingsToggle } from '../../talentSettings/SettingsBUi.jsx';
import ParentButton from '../ParentButton.jsx';
import { ROLES } from './data/settingsData.js';

const log = debug('SettingsRolesTab');

// One "When I sign in, open" option (Figma "option · …"): a radio card, 16 padding, r16, the chosen one mint with a green hairline.
const RoleOption = ({ option, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={classNames(
      'flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] border p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[rgba(28,42,33,0.12)] bg-white'
    )}
  >
    {selected ? (
      <SettingsARadioOnIcon className="block size-[22px] shrink-0" />
    ) : (
      <span
        aria-hidden="true"
        className="block size-[22px] shrink-0 rounded-full border border-[rgba(28,42,33,0.1)] bg-white"
      />
    )}
    <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
      <span className="flex flex-wrap items-center gap-[8px]">
        <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {option.title}
        </span>
        {option.chip ? (
          <span className="rounded-full border border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] py-[2px] text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#e7e7e7] max-lg:text-[12px]">
            {option.chip}
          </span>
        ) : null}
      </span>
      <span className="text-[13.5px] leading-[20px] text-[#595959]">{option.desc}</span>
    </span>
  </button>
);

/*
 * RolesTab — PS-02 "Settings · Your roles (parent and talent)" (Figma 10046:2250): where to land after sign-in (four radio cards), "Keep your spaces separate" (four switches) and "Wards linked to you"
 * (a summary row with Manage → My wards). Local state only; there is no Save in this frame (choices apply at once).
 * Props: onManage.
 */
const RolesTab = ({ onManage }) => {
  const [open, setOpen] = useState(ROLES.open.options[0].id);
  const [flags, setFlags] = useState(() =>
    Object.fromEntries(ROLES.separate.rows.map((r) => [r.id, r.on]))
  );

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="roles">
      <GroupCard title={ROLES.open.title} description={ROLES.open.desc} gap="gap-[4px]">
        <div
          role="radiogroup"
          aria-label={ROLES.open.title}
          className="flex w-full flex-col gap-[16px]"
        >
          {ROLES.open.options.map((o) => (
            <RoleOption
              key={o.id}
              option={o}
              selected={open === o.id}
              onSelect={() => {
                log('open on sign-in', o.id);
                setOpen(o.id);
              }}
            />
          ))}
        </div>
      </GroupCard>

      <GroupCard title={ROLES.separate.title}>
        {ROLES.separate.rows.map((r, i) => (
          <SettingRow
            key={r.id}
            top={i > 0}
            title={r.title}
            titleId={`roles-${r.id}`}
            description={r.desc}
            control={
              <SettingsToggle
                labelledBy={`roles-${r.id}`}
                checked={flags[r.id]}
                onChange={(next) => setFlags((f) => ({ ...f, [r.id]: next }))}
              />
            }
          />
        ))}
      </GroupCard>

      <GroupCard title={ROLES.wards.title} description={ROLES.wards.desc} gap="gap-[4px]">
        <SettingRow
          top={false}
          nowrapControl={false}
          title={ROLES.wards.row}
          description={ROLES.wards.rowDesc}
          control={
            <ParentButton variant="secondary" onClick={onManage}>
              {ROLES.wards.cta}
            </ParentButton>
          }
        />
      </GroupCard>
    </div>
  );
};

export default RolesTab;
