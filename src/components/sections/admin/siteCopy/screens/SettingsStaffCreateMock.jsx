import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { GroupCard, SettingRow, SettingsToggle } from '../../../talentSettings/SettingsBUi.jsx';
import { copyUrl } from '../copyUrl.js';
import FieldButton from '../fields/FieldButton.jsx';
import FieldChip from '../fields/FieldChip.jsx';
import { ArrowRightIcon, InfoIcon, LockIcon } from '../fields/FieldsIcons.jsx';
import SettingsMockShell from '../roles/SettingsMockShell.jsx';
import {
  CREATE_ACCOUNT,
  EDITOR_CAN_DO,
  NAV_LABELS_STAFF,
  SETTINGS_SUBTITLE_CREATE,
  SUPER_ADMINS_CARD,
  permissionPreview,
} from '../roles/settingsMockData.js';

const log = debug('SettingsStaffCreateMock');

/*
 * SettingsStaffCreateMock — Platform Admin 7.8.7b "Settings → Staff · create a Content Editor account" (Figma 7.8.7b).
 *   /admin/site-copy/settings/staff            (add ?role=super for the Super Admin chrome of the frame)
 * A MOCK copy of Settings → Staff accounts → "Create a staff account" with the new account type "Content Editor": the amber domain banner, the card (Full name, Work email, the five
 * account types as radio chips, "Send set-up link →" and the line "Permissions preview: …" derived from COPY_PERMISSIONS), the "What a Content Editor can do" card (shown while Content Editor is
 * chosen: a "Policy" row, "Draft product names" switch, a locked "No account, moderation or audit access" switch) and the "Super Admins" card. "Send set-up link" validates, then goes to the
 * Staff accounts list (7.8.7e) with the "Set-up link sent to …" banner.
 * ⚠️ ASSUMPTION: the validation messages (name required, work email on @ghanatalenthub.com — the banner above states the rule) are not drawn; for the other four account types the permission preview only
 * lists their site copy permissions and the "What a Content Editor can do" card is hidden; the locked switch is drawn off like in the frame and cannot be changed (it is policy).
 */
const TextInput = ({ label, value, onChange, error, type = 'text', autoComplete }) => {
  const id = useId();
  const errId = useId();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(
          'min-h-[51px] w-full min-w-0 rounded-[10px] border border-solid bg-white px-[20px] py-[13px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_11px_rgba(0,0,0,0.04)] outline-none focus:border-[#387440]',
          error ? 'border-[#c0392b]' : 'border-[#cccccc]'
        )}
      />
      {error ? (
        <p
          id={errId}
          role="alert"
          className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#c0392b]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};

const SettingsStaffCreateMock = ({ ctx }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(CREATE_ACCOUNT.name);
  const [email, setEmail] = useState(CREATE_ACCOUNT.email);
  const [role, setRole] = useState('editor');
  const [draftNames, setDraftNames] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    log('mount', { role: ctx.role });
  }, [ctx.role]);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = CREATE_ACCOUNT.nameError;
    if (!email.trim().toLowerCase().endsWith(CREATE_ACCOUNT.domain))
      next.email = CREATE_ACCOUNT.emailError;
    setErrors(next);
    log('send set-up link', { role, valid: Object.keys(next).length === 0 });
    if (Object.keys(next).length) return;
    navigate(
      copyUrl(ctx, '/admin/site-copy/settings/staff-list', {
        sent: 1,
        name: name.trim(),
        who: role,
      })
    );
  };

  return (
    <SettingsMockShell
      ctx={ctx}
      subtitle={SETTINGS_SUBTITLE_CREATE}
      labels={NAV_LABELS_STAFF}
      activeLabel="Staff accounts"
      itemWeight={500}
    >
      <div className="flex items-start gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px]">
        <InfoIcon className="size-[20px] shrink-0 text-[#463409]" />
        <p className="m-0 min-w-0 font-sans text-[14px] leading-[20px] font-medium text-[#463409]">
          {CREATE_ACCOUNT.info}
        </p>
      </div>

      <GroupCard title={CREATE_ACCOUNT.title} gap="gap-[8px]">
        <form onSubmit={submit} noValidate className="flex w-full flex-col gap-[8px]">
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">
            {CREATE_ACCOUNT.sub}
          </p>
          <div className="flex gap-[16px] pt-[0px] max-md:flex-col">
            <TextInput
              label={CREATE_ACCOUNT.nameLabel}
              value={name}
              onChange={setName}
              error={errors.name}
              autoComplete="off"
            />
            <TextInput
              label={CREATE_ACCOUNT.emailLabel}
              value={email}
              onChange={setEmail}
              error={errors.email}
              type="email"
              autoComplete="off"
            />
          </div>
          <div
            role="radiogroup"
            aria-label="Account type"
            className="flex flex-wrap gap-[8px] pt-[8px]"
          >
            {CREATE_ACCOUNT.roles.map((r) => {
              const on = r.id === role;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    log('account type', r.id);
                    setRole(r.id);
                  }}
                  className={classNames(
                    'min-h-[35px] cursor-pointer rounded-full px-[14px] py-[8px] font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    on
                      ? 'border-0 bg-[#1c2a21] text-white'
                      : 'border border-solid border-[#1c2a21]/10 bg-white text-[#1c2a21]'
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px] pt-[12px]">
            <FieldButton tone="primary" size="lg" type="submit">
              {CREATE_ACCOUNT.send}
              <ArrowRightIcon className="size-[20px]" />
            </FieldButton>
            <p
              aria-live="polite"
              className="m-0 min-w-0 font-sans text-[13px] leading-[16px] text-[#595959]"
            >
              {permissionPreview(role)}
            </p>
          </div>
        </form>
      </GroupCard>

      {role === 'editor' ? (
        <GroupCard title={EDITOR_CAN_DO.title} description={EDITOR_CAN_DO.sub}>
          {EDITOR_CAN_DO.rows.map((row) => (
            <SettingRow
              key={row.id}
              top
              title={row.title}
              description={row.text}
              control={
                row.control === 'policy' ? (
                  <FieldChip
                    tone="outline"
                    icon={<LockIcon className="size-[14px] text-[#387440]" />}
                  >
                    {EDITOR_CAN_DO.policy}
                  </FieldChip>
                ) : row.control === 'toggle-on' ? (
                  <SettingsToggle checked={draftNames} onChange={setDraftNames} label={row.title} />
                ) : (
                  <span
                    role="switch"
                    aria-checked="false"
                    aria-disabled="true"
                    aria-label={row.title}
                    className="relative h-[26px] w-[44px] shrink-0 rounded-full bg-[#e7e7e7] shadow-[inset_0_0_0_1px_rgba(28,42,33,0.12)]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-[3px] left-[3px] size-[20px] rounded-full border-[1.2px] border-[#1c2a21] bg-white"
                    />
                  </span>
                )
              }
            />
          ))}
        </GroupCard>
      ) : null}

      <GroupCard title={SUPER_ADMINS_CARD.title}>
        <SettingRow
          top={false}
          title={SUPER_ADMINS_CARD.row.title}
          description={SUPER_ADMINS_CARD.row.text}
          control={null}
        />
      </GroupCard>
    </SettingsMockShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.7b',
    area: 'site-copy',
    priority: 5,
    match: (ctx) =>
      ctx.segments.length === 2 && ctx.segments[0] === 'settings' && ctx.segments[1] === 'staff',
    Component: SettingsStaffCreateMock,
  },
];

export default SettingsStaffCreateMock;
