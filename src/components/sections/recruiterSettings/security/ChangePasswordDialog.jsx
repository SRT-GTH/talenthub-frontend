import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import IconTileDialog from '../../../ui/IconTileDialog.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { HintCheckbox } from '../../applicationPipeline/actions/ActionFormParts.jsx';
import { LockIcon } from './SettingsIcons.jsx';
import { PASSWORD_COPY, PASSWORD_SEED } from './securityData.js';

const log = debug('ChangePasswordDialog');

/*
 * ChangePasswordDialog - SR-23 "Security · change password" (Figma 10161:84939, modal 10161:85257): the recruiter dialog shell `ui/IconTileDialog` (500 wide, p24, r24): a 44px lock tile, a Bricolage 24/600 title with
 * "You'll stay signed in on this device." and a close button; three required password fields (the new one focused, with the "Strong · 12+ characters with a number and symbol" helper line), the green
 * "Log out of my other 2 devices" checkbox and Cancel / Update password (48px, right-aligned).
 * Fields are seeded with the dots of the frame (10 / 12 / 12 characters). Update stays disabled until the current password is typed, the new one is strong (12+ characters, a number and a symbol) and the confirmation matches.
 * Props: otherDevices (count in the checkbox label), onClose, onSubmit({ currentPassword, newPassword, logOutOthers }).
 */
const DIALOG_BUTTON = '!h-[48px] !py-0';
const isStrong = (value) => value.length >= 12 && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);

const ChangePasswordDialog = ({ otherDevices, onClose, onSubmit }) => {
  const [current, setCurrent] = useState(PASSWORD_SEED.current);
  const [next, setNext] = useState(PASSWORD_SEED.next);
  const [confirm, setConfirm] = useState(PASSWORD_SEED.confirm);
  const [logOutOthers, setLogOutOthers] = useState(true);
  const nextRef = useRef(null);
  const copy = PASSWORD_COPY;

  const strong = isStrong(next);
  const matches = confirm.length > 0 && confirm === next;
  const valid = current.length > 0 && strong && matches;

  useEffect(() => {
    log('mount', { otherDevices });
    // The frame draws the new-password field focused.
    nextRef.current?.focus();
  }, [otherDevices]);

  const submit = (event) => {
    event.preventDefault();
    if (!valid) {
      log('branch: submit blocked', { current: current.length > 0, strong, matches });
      return;
    }
    log('dispatch update password', { logOutOthers });
    onSubmit({ currentPassword: current, newPassword: next, logOutOthers });
  };

  return (
    <IconTileDialog
      icon={<LockIcon className="size-[22px]" />}
      title={copy.title}
      body={copy.subtitle}
      onClose={onClose}
      widthClassName="!max-w-[500px]"
    >
      <form
        id="recruiter-change-password"
        onSubmit={submit}
        noValidate
        className="flex flex-col gap-[14px]"
      >
        <TextInput
          label={copy.current}
          required
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
        />
        <TextInput
          label={copy.next}
          required
          type="password"
          autoComplete="new-password"
          ref={nextRef}
          value={next}
          onChange={(event) => setNext(event.target.value)}
          helperText={strong ? copy.strong : copy.weak}
          helperTextClassName="!text-[#575755]"
          helperIconClassName={strong ? 'text-[#387440]' : 'text-[#575755]'}
          className="[&_input]:caret-[#387440]"
        />
        <TextInput
          label={copy.confirm}
          required
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={confirm.length > 0 && !matches ? copy.mismatch : undefined}
        />
        <HintCheckbox
          checked={logOutOthers}
          onChange={setLogOutOthers}
          label={copy.logOutOthers(otherDevices)}
        />
      </form>
      <div className="flex items-center justify-end gap-[10px] max-sm:flex-wrap">
        <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onClose}>
          {copy.cancel}
        </Button>
        <Button
          type="submit"
          form="recruiter-change-password"
          variant="primary"
          size="sm"
          className={DIALOG_BUTTON}
          disabled={!valid}
        >
          {copy.submit}
        </Button>
      </div>
    </IconTileDialog>
  );
};

export default ChangePasswordDialog;
