import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsAUserTileIcon } from '../../../shared/assets.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import { AgencyLockIcon } from '../agencyIcons.jsx';

const log = debug('AgencyKeySecretDialog');

/*
 * AgencyKeySecretDialog — create / rotate an API key (Figma 11.6.1e rows "Create a new key" / "Rotate key"; the dialog itself is not drawn).
 * Step 1 (create only): key name. Step 2: the secret is shown ONCE with a Copy button; closing it leaves only the masked key in the list.
 * ⚠️ ASSUMPTION: the secret is a mock string (gth_live_ + random hex, never sent anywhere); dialog copy other than "Create a new key",
 * "Rotate key", "Create key" and "Each key is shown once." is assumed.
 * Props: mode 'create' | 'rotate', keyName (rotate), onDone({name, secret}), onClose.
 */
const mockSecret = (prefix) => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return prefix + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

const AgencyKeySecretDialog = ({ mode, keyName, onDone, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [secret, setSecret] = useState(mode === 'rotate' ? mockSecret('gth_live_') : null);
  const [copied, setCopied] = useState(false);
  const finalName = mode === 'rotate' ? keyName : name.trim();

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Enter a key name');
      return;
    }
    log('create', name);
    setSecret(mockSecret('gth_live_'));
  };

  const copy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(secret).catch(() => log('clipboard unavailable'));
  };

  const close = () => {
    if (secret) onDone({ name: finalName, secret });
    onClose();
  };

  return (
    <SettingsDialog
      open
      title={mode === 'rotate' ? 'Rotate key' : 'Create a new key'}
      icon={<AgencyLockIcon className="size-[20px] text-[#387440]" />}
      onClose={close}
      widthClass="w-[520px]"
    >
      {secret ? (
        <>
          <p className="m-0 text-[14px] leading-[20px] text-[#595959]">
            Each key is shown once. Copy it now: after you close this, only the last 4 characters
            stay visible.
          </p>
          <div className="flex items-center gap-[10px] rounded-[12px] border border-[rgba(28,42,33,0.1)] bg-[#f8f8f4] p-[12px]">
            <code className="min-w-0 flex-1 text-[13.5px] leading-[20px] break-all text-[#1c2a21]">
              {secret}
            </code>
            <Button variant="tertiary" size="sm" className="shrink-0" onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p role="status" className="sr-only">
            {copied ? 'Key copied to the clipboard' : ''}
          </p>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={close}>
              Done
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={create} noValidate className="flex flex-col gap-[16px]">
          <TextInput
            label="Key name"
            id="key-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
            aria-invalid={error ? 'true' : undefined}
            autoFocus
          />
          <div className="flex justify-end gap-[12px]">
            <Button variant="tertiary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create key
            </Button>
          </div>
        </form>
      )}
    </SettingsDialog>
  );
};

export default AgencyKeySecretDialog;
