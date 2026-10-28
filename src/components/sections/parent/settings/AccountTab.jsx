import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { GroupCard, SettingRow } from '../../talentSettings/SettingsBUi.jsx';
import Button from '../../../ui/Button.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import { ACCOUNT } from './data/settingsData.js';

const log = debug('SettingsAccountTab');

/*
 * AccountTab — PS-01 "Settings · Account (parent)" (Figma 10046:1670): "Personal details" (six fields, two columns; Email and Phone carry the verified green border) and "Account type" (the
 * parent role with a "Your roles" link, and the profile photo), then Cancel / Save changes. Built on the talent Settings pieces (GroupCard, SettingRow).
 * Props: onRoles (the "Your roles" link). Cancel restores the drawn values; Save only logs (mock data, no backend).
 */
const initial = () => Object.fromEntries(ACCOUNT.fields.map((f) => [f.id, f.value]));

const AccountTab = ({ onRoles }) => {
  const [values, setValues] = useState(initial);

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="account">
      <GroupCard title={ACCOUNT.personal.title} description={ACCOUNT.personal.desc} gap="gap-[4px]">
        <div className="grid w-full grid-cols-2 gap-[20px] max-md:grid-cols-1">
          {ACCOUNT.fields.map((f) => (
            <ParentTextField
              key={f.id}
              id={`settings-${f.id}`}
              label={f.label}
              type={f.type ?? 'text'}
              autoComplete={f.autoComplete}
              verified={f.verified}
              value={values[f.id]}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
            />
          ))}
        </div>
      </GroupCard>

      <GroupCard title={ACCOUNT.type.title}>
        <SettingRow
          top={false}
          title={ACCOUNT.type.role}
          description={ACCOUNT.type.roleDesc}
          control={
            <button
              type="button"
              onClick={() => {
                log('your roles link');
                onRoles?.();
              }}
              className="shrink-0 cursor-pointer text-[14px] leading-[17px] font-semibold whitespace-nowrap text-[#387440] underline decoration-solid decoration-from-font focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {ACCOUNT.type.roleLink}
            </button>
          }
        />
        <SettingRow
          title={ACCOUNT.type.photo}
          description={ACCOUNT.type.photoDesc}
          control={
            <ParentButton variant="secondary" onClick={() => log('change photo (no screen drawn)')}>
              {ACCOUNT.type.photoCta}
            </ParentButton>
          }
        />
      </GroupCard>

      <div className="flex items-center justify-end gap-[12px] max-sm:flex-wrap">
        <ParentButton
          variant="secondary"
          onClick={() => {
            log('cancel: values restored');
            setValues(initial());
          }}
        >
          {ACCOUNT.cancel}
        </ParentButton>
        <Button size="sm" onClick={() => log('save changes', Object.keys(values))}>
          {ACCOUNT.save}
        </Button>
      </div>
    </div>
  );
};

export default AccountTab;
