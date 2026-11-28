import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { GroupCard, SettingRow } from '../../talentSettings/SettingsBUi.jsx';
import LiveSaveStatus from '../../talentSettings/LiveSaveStatus.jsx';
import Button from '../../../ui/Button.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import { ACCOUNT } from './data/settingsData.js';
import { accountBody, accountErrors, liveAccountValues, LOCKED_HINT } from './settingsLive.js';

const log = debug('SettingsAccountTab');

/*
 * AccountTab — PS-01 "Settings · Account (parent)": "Personal details" (six fields, two columns; Email and Phone carry the verified green border) and "Account type" (the
 * parent role with a "Your roles" link, and the profile photo), then Cancel / Save changes. Built on the talent Settings pieces (GroupCard, SettingRow).
 * Props: onRoles (the "Your roles" link), settings.live (useLiveSettings(), signed-in parent).
 * Demo (signed out or a frame URL): the drawn values; Cancel restores them; Save shows "Saved" (nothing is sent).
 * Live: GET /settings/overview fills the fields, Save sends the changed ones to PUT /settings/account (the same endpoint
 * the talent Settings use, it acts on whoever is signed in). Email and date of birth are read-only, as on the talent page.
 * ⚠️ ASSUMPTION: "Change photo" only logs: the parent has no profile page to upload a photo from and no parent photo endpoint exists.
 */
const initial = () => Object.fromEntries(ACCOUNT.fields.map((f) => [f.id, f.value]));

const AccountTab = ({ onRoles, settings }) => {
  const live = settings?.live?.overview?.account ? settings.live : null;
  const [saved, setSaved] = useState(() =>
    live ? liveAccountValues(live.overview.account) : initial()
  );
  const [values, setValues] = useState(saved);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const errors = live ? accountErrors(values) : {};
  const dirty = ACCOUNT.fields.some((f) => values[f.id] !== saved[f.id]);
  const invalid = Object.values(errors).some(Boolean);

  const save = async () => {
    if (!live) {
      log('save changes (demo, nothing sent)', Object.keys(values));
      setStatus({ tone: 'ok', text: 'Saved' });
      return;
    }
    if (!dirty || invalid || busy) return;
    const body = accountBody(values, saved);
    log('save account', Object.keys(body));
    setBusy(true);
    setStatus(null);
    try {
      const next = liveAccountValues(await live.saveAccount(body));
      setSaved(next);
      setValues(next);
      setStatus({ tone: 'ok', text: 'Saved' });
    } catch (err) {
      log.error('save account failed:', err?.response?.status);
      setStatus({
        tone: 'error',
        text: err?.response?.data?.message || 'Could not save. Try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="account">
      <GroupCard title={ACCOUNT.personal.title} description={ACCOUNT.personal.desc} gap="gap-[4px]">
        <div className="grid w-full grid-cols-2 gap-[20px] max-md:grid-cols-1">
          {ACCOUNT.fields.map((f) => {
            const locked = Boolean(live && LOCKED_HINT[f.id]);
            return (
              <ParentTextField
                key={f.id}
                id={`settings-${f.id}`}
                label={f.label}
                type={f.type ?? 'text'}
                autoComplete={f.autoComplete}
                verified={live ? f.verified && Boolean(values[f.id]) && !errors[f.id] : f.verified}
                readOnly={locked}
                error={errors[f.id] || undefined}
                helperText={errors[f.id] ? undefined : locked ? LOCKED_HINT[f.id] : undefined}
                value={values[f.id]}
                onChange={(e) => {
                  setStatus(null);
                  setValues((v) => ({ ...v, [f.id]: e.target.value }));
                }}
              />
            );
          })}
        </div>
      </GroupCard>

      <GroupCard title={ACCOUNT.type.title}>
        <SettingRow
          top={false}
          title={live ? 'Parent' : ACCOUNT.type.role}
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
            <ParentButton
              variant="secondary"
              onClick={() => log('change photo (no screen drawn, no endpoint)')}
            >
              {ACCOUNT.type.photoCta}
            </ParentButton>
          }
        />
      </GroupCard>

      <div className="flex items-center justify-end gap-[12px] max-sm:flex-wrap">
        <LiveSaveStatus status={status} className="mr-auto" />
        <ParentButton
          variant="secondary"
          disabled={live ? !dirty || busy : false}
          onClick={() => {
            log('cancel: values restored');
            setValues(saved);
            setStatus(null);
          }}
        >
          {ACCOUNT.cancel}
        </ParentButton>
        <Button size="sm" disabled={live ? !dirty || busy || invalid : false} onClick={save}>
          {busy ? 'Saving…' : ACCOUNT.save}
        </Button>
      </div>
    </div>
  );
};

export default AccountTab;
