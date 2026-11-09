import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import IconTileDialog from '../../../ui/IconTileDialog.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { RadioOptionRow } from '../../applicationPipeline/actions/ActionFormParts.jsx';
import { UserPlusIcon } from './accountIcons.jsx';
import RoleSelect from './RoleSelect.jsx';
import { INVITE_DIALOG, ROLES } from './accountData.js';

const log = debug('InviteDialog');

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIALOG_BUTTON = '!h-[48px] !py-0';

/*
 * InviteDialog - "Invite a teammate" (Figma SR-04 10161:78453; SR-05 10161:78832 with the role menu open): work email, role dropdown, "Access to jobs" radios, free-seats note, Cancel / Send invite.
 * On `ui/IconTileDialog` (540px, user-plus tile). Props: initialEmail (seeds the typed address, `?email=`), roleOpen (`?role=open`), onRoleOpen(open), seatsLeft, takenEmails, onClose, onSend({ email, role, access }).
 * The Role dropdown draws no hint line below it while its menu is open (SR-05), which is why the dialog is 23px shorter then.
 * ⚠️ ASSUMPTION: validation (well-formed address, not already on the team, a free seat) and its messages are not drawn.
 */
// Live extras: roleOptions (Admin, Recruiter), body (the real organisation), hideAccess (per-job access isn't built),
// footerNote (replaces the seats line; '' hides it), busy (while sending).
const InviteDialog = ({
  initialEmail = '',
  roleOpen = false,
  onRoleOpen,
  seatsLeft,
  takenEmails,
  onClose,
  onSend,
  roleOptions = ROLES,
  body,
  hideAccess = false,
  footerNote,
  busy = false,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(INVITE_DIALOG.defaultRole);
  const [access, setAccess] = useState('all');
  const [menuOpen, setMenuOpen] = useState(roleOpen);
  const [touched, setTouched] = useState(Boolean(initialEmail));

  const trimmed = email.trim();
  const duplicate = takenEmails.includes(trimmed.toLowerCase());
  const error = !touched
    ? ''
    : !EMAIL_OK.test(trimmed)
      ? INVITE_DIALOG.errors.invalid
      : duplicate
        ? INVITE_DIALOG.errors.duplicate
        : '';
  const canSend = EMAIL_OK.test(trimmed) && !duplicate && seatsLeft > 0;
  log('render', { role, access, canSend, menuOpen, seatsLeft });

  const send = () => {
    setTouched(true);
    if (!canSend) {
      log('send blocked', { valid: EMAIL_OK.test(trimmed), duplicate, seatsLeft });
      return;
    }
    log('send', { role, access });
    onSend({ email: trimmed, role, access });
  };

  return (
    <IconTileDialog
      icon={<UserPlusIcon size={22} />}
      title={INVITE_DIALOG.title}
      body={body ?? INVITE_DIALOG.body}
      onClose={onClose}
      widthClassName="!max-w-[540px]"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[12px]">
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {footerNote !== undefined
              ? footerNote
              : seatsLeft > 0
                ? INVITE_DIALOG.freeSeats(seatsLeft)
                : INVITE_DIALOG.noSeats}
          </p>
          <div className="flex items-center gap-[10px] max-sm:w-full max-sm:justify-end">
            <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onClose}>
              {INVITE_DIALOG.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className={DIALOG_BUTTON}
              disabled={!canSend || busy}
              onClick={send}
            >
              {INVITE_DIALOG.send}
            </Button>
          </div>
        </div>
      }
    >
      <TextInput
        label={INVITE_DIALOG.emailLabel}
        required
        type="email"
        autoComplete="off"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setTouched(true);
        }}
        error={error || undefined}
        onKeyDown={(event) => {
          if (event.key === 'Enter') send();
        }}
      />
      <div className={menuOpen ? '' : 'pb-[23px]'}>
        <RoleSelect
          label={INVITE_DIALOG.roleLabel}
          required
          value={role}
          options={roleOptions}
          defaultOpen={roleOpen}
          onChange={setRole}
          onOpenChange={(next) => {
            setMenuOpen(next);
            onRoleOpen?.(next);
          }}
        />
      </div>
      <div
        role="radiogroup"
        aria-labelledby="invite-access-label"
        className="flex flex-col gap-[14px]"
        hidden={hideAccess}
      >
        <p
          id="invite-access-label"
          className="m-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]"
        >
          {INVITE_DIALOG.accessLabel}
        </p>
        {INVITE_DIALOG.access.map((option) => (
          <RadioOptionRow
            key={option.value}
            name="invite-access"
            value={option.value}
            checked={access === option.value}
            onChange={setAccess}
            label={option.label}
            hint={option.hint}
          />
        ))}
      </div>
    </IconTileDialog>
  );
};

export default InviteDialog;
