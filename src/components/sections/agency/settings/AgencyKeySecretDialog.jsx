import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import { AgencyLockIcon } from '../agencyIcons.jsx';

const log = debug('AgencyKeySecretDialog');

/*
 * AgencyKeySecretDialog — create / rotate an API key (Figma 11.6.1e rows "Create a new key" / "Rotate key"; the dialog itself is not drawn).
 * Step 1 (create): key name + Live / Test. Rotate starts straight away with the old key's name. Step 2: the secret from the server is shown
 * ONCE with a Copy button; closing it leaves only the masked key in the list.
 * Props: mode 'create' | 'rotate', keyName / keyEnv (rotate), onIssue({name, env}) → Promise<secret>, onClose.
 */
const AgencyKeySecretDialog = ({ mode, keyName, keyEnv, onIssue, onClose }) => {
  const [name, setName] = useState('');
  const [env, setEnv] = useState('live');
  const [error, setError] = useState('');
  const [secret, setSecret] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  const issue = async (n, e) => {
    setBusy(true);
    setError('');
    try {
      setSecret(await onIssue({ name: n, env: e }));
      log('issued', n);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'The key wasn’t created.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (mode === 'rotate' && !started.current) {
      started.current = true;
      issue(keyName, keyEnv || 'live');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const create = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Enter a key name');
      return;
    }
    issue(name.trim(), env);
  };

  const copy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(secret).catch(() => log('clipboard unavailable'));
  };

  return (
    <SettingsDialog
      open
      title={mode === 'rotate' ? 'Rotate key' : 'Create a new key'}
      icon={<AgencyLockIcon className="size-[20px] text-[#387440]" />}
      onClose={onClose}
      widthClass="w-[520px]"
    >
      {secret ? (
        <>
          <p className="m-0 text-[14px] leading-[20px] text-[#595959]">
            Each key is shown once. Copy it now: after you close this, only the last 4 characters
            stay visible.
            {mode === 'rotate' ? ' The old key has stopped working.' : ''}
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
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </>
      ) : mode === 'rotate' ? (
        <p role="status" className="m-0 text-[14px] text-[#595959]">
          {error || (busy ? 'Creating the new key…' : '')}
        </p>
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
          <div role="radiogroup" aria-label="Key type" className="flex gap-[8px]">
            {[
              ['live', 'Live data'],
              ['test', 'Test (sandbox)'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={env === id}
                onClick={() => setEnv(id)}
                className={classNames(
                  'cursor-pointer rounded-full px-[14px] py-[8px] text-[14px] font-semibold',
                  env === id
                    ? 'bg-[#1c2a21] text-white'
                    : 'border border-[rgba(28,42,33,0.1)] bg-white text-[#1c2a21]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-[12px]">
            <Button variant="tertiary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={busy}>
              {busy ? 'Creating…' : 'Create key'}
            </Button>
          </div>
        </form>
      )}
    </SettingsDialog>
  );
};

export default AgencyKeySecretDialog;
