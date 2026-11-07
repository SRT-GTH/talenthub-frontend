import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import CenteredIconDialog from '../../../ui/CenteredIconDialog.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { AlertIcon, TrashIcon } from './SettingsIcons.jsx';
import { DELETE_COPY } from './securityData.js';

const log = debug('DeleteAccountDialog');

/*
 * DeleteAccountDialog - SR-26 "Delete recruiter account · confirm" (Figma 10161:85946, modal 10161:86264): `ui/CenteredIconDialog` (540 wide, p32): a red 56px trash tile (#f9ebea), a Bricolage 28/600 title, the 14/24 intro,
 * an amber banner (#faf4e8, r10, p16: alert glyph, "You're the only Admin" 14/600, the 12/400 line and the green "Go to Team and roles" link), the required "Type DELETE to confirm" field (the grey "DELETE" is its placeholder)
 * and Cancel / Delete account. Delete account is the grey disabled button until the box reads DELETE (exact, upper case - the same rule as the parent "Close account" dialog); the typed text lives in the URL (`confirm=`).
 * ⚠️ ASSUMPTION: the enabled button is the red danger button; the banner is informational (confirming still works) and "Go to Team and roles" goes to ?tab=team.
 * Props: value, onChange(text), onCancel, onTeam, onConfirm.
 */
const DIALOG_BUTTON = '!h-[48px] !py-0';

const DeleteAccountDialog = ({ value, onChange, onCancel, onTeam, onConfirm }) => {
  const ready = value === DELETE_COPY.word;
  useEffect(() => {
    log('state', { typed: value.length, ready });
  }, [value, ready]);

  const submit = (event) => {
    event.preventDefault();
    if (!ready) {
      log('branch: confirm blocked, the word is not typed');
      return;
    }
    log('dispatch delete account');
    onConfirm();
  };

  return (
    <CenteredIconDialog
      icon={<TrashIcon className="size-[28px]" />}
      iconTileClassName="bg-[#f9ebea] text-[#c0392b]"
      title={DELETE_COPY.title}
      body={DELETE_COPY.body}
      onClose={onCancel}
      widthClassName="!max-w-[540px]"
      footer={
        <>
          <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onCancel}>
            {DELETE_COPY.cancel}
          </Button>
          <Button
            type="submit"
            form="recruiter-delete-account"
            variant="danger"
            size="sm"
            className={DIALOG_BUTTON}
            disabled={!ready}
          >
            {DELETE_COPY.confirm}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-[12px] rounded-[10px] bg-[#faf4e8] p-[16px] max-sm:flex-wrap">
        <AlertIcon className="mt-[2px] size-[20px] shrink-0 text-[#463409]" />
        <div className="flex min-w-[160px] flex-1 flex-col gap-[2px]">
          <p className="m-0 text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
            {DELETE_COPY.banner.title}
          </p>
          <p className="m-0 text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {DELETE_COPY.banner.body}
          </p>
        </div>
        <button
          type="button"
          onClick={onTeam}
          className="min-h-[24px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-sm:ml-[32px]"
        >
          {DELETE_COPY.banner.link}
        </button>
      </div>
      <form id="recruiter-delete-account" onSubmit={submit} noValidate>
        <TextInput
          label={DELETE_COPY.label}
          required
          autoComplete="off"
          placeholder={DELETE_COPY.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputClassName="!font-normal"
        />
      </form>
    </CenteredIconDialog>
  );
};

export default DeleteAccountDialog;
