import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { GroupCard, SettingRow } from '../../talentSettings/SettingsBUi.jsx';
import Button from '../../../ui/Button.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import { ACCOUNT } from './data/settingsData.js';
import useParentChrome from '../live/useParentChrome.js';
import { useSpaces } from '../../../../services/spaces.api.js';

const log = debug('SettingsAccountTab');

/*
 * AccountTab — PS-01 "Settings · Account (parent)" (Figma 10046:1670): "Personal details" (six fields, two columns; Email and Phone carry the verified green border) and "Account type" (the
 * parent role with a "Your roles" link, and the profile photo), then Cancel / Save changes. Built on the talent Settings pieces (GroupCard, SettingRow).
 * Props: onRoles (the "Your roles" link). Cancel restores the drawn values; Save only logs (mock data, no backend).
 */
const mockInitial = () => Object.fromEntries(ACCOUNT.fields.map((f) => [f.id, f.value]));

// Live (`live` = { account, save(values) -> Promise }): the parent's real details (GET /settings/overview); Save sends
// name, phone, region and city (PUT /settings/account). Email and date of birth are shown but not editable here.
const liveInitial = (a = {}) => ({
  fullName: [a.firstName, a.lastName].filter(Boolean).join(' '),
  email: a.email || '',
  phone: a.phoneNumber || '',
  dob: a.dateOfBirth ? new Date(a.dateOfBirth).toLocaleDateString('en-GB') : '',
  region: a.region || '',
  city: a.city || '',
});
const READ_ONLY = ['email', 'dob'];

const AccountTab = ({ onRoles, live = null }) => {
  const initial = () => (live ? liveInitial(live.account) : mockInitial());
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState(null);
  const chrome = useParentChrome();
  const spaces = useSpaces();
  // Live: the real role line (the sidebar's) and whether a career profile exists yet.
  const role = live ? chrome.sidebar.role || 'Parent' : ACCOUNT.type.role;
  const roleDesc = live
    ? spaces.talent
      ? ACCOUNT.type.roleDesc
      : 'You can also build your own career profile. Manage both in Your roles.'
    : ACCOUNT.type.roleDesc;

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
              verified={live ? false : f.verified}
              value={values[f.id]}
              readOnly={live ? READ_ONLY.includes(f.id) : undefined}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
            />
          ))}
        </div>
      </GroupCard>

      <GroupCard title={ACCOUNT.type.title}>
        <SettingRow
          top={false}
          title={role}
          description={roleDesc}
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
        <Button
          size="sm"
          onClick={async () => {
            if (!live) {
              log('save changes', Object.keys(values));
              return;
            }
            setStatus({ busy: true });
            try {
              await live.save(values);
              setStatus({ ok: 'Saved.' });
            } catch (err) {
              setStatus({ error: err?.message || 'Could not save. Try again.' });
            }
          }}
        >
          {status?.busy ? 'Saving…' : ACCOUNT.save}
        </Button>
      </div>
      {status?.ok || status?.error ? (
        <p
          role={status.error ? 'alert' : 'status'}
          className={`m-0 text-right font-sans text-[14px] font-semibold ${status.error ? 'text-[#c0392b]' : 'text-[#387440]'}`}
        >
          {status.ok || status.error}
        </p>
      ) : null}
    </div>
  );
};

export default AccountTab;
