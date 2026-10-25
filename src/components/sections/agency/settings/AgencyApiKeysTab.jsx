import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import AgencyKeySecretDialog from './AgencyKeySecretDialog.jsx';
import AgencyRevokeKeysDialog from './AgencyRevokeKeysDialog.jsx';
import { API_KEYS, KEYS_EXPIRY, TEST_KEY, TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyApiKeysTab');

/*
 * AgencyApiKeysTab — Figma 11.6.1e "API keys (agency)" (8597:397859): live key row + Rotate key, "Create a new key" + Create key, the staging test
 * key with an on/off switch, and the red "Revoke all keys" card. Mock: create / rotate show the secret once (copy button) then only the masked
 * key; revoke asks for confirmation. Props: onToast(toast).
 */
const stamp = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const AgencyApiKeysTab = ({ onToast }) => {
  const [keys, setKeys] = useState(API_KEYS);
  const [testOn, setTestOn] = useState(TEST_KEY.active);
  const [dialog, setDialog] = useState(null); // { mode: 'create' } | { mode: 'rotate', id } | { mode: 'revoke' }

  const done = ({ name, secret }) => {
    log('key shown once', name);
    setKeys((list) => {
      const entry = {
        id: `key-${Date.now()}`,
        name: name.includes('·') ? name : `${name} · live`,
        prefix: 'gth_live_',
        last4: secret.slice(-4),
        created: stamp(),
        by: 'Efua Owusu',
        lastUsed: null,
      };
      return dialog?.mode === 'rotate'
        ? list.map((k) => (k.id === dialog.id ? { ...entry, id: k.id } : k))
        : [...list, entry];
    });
  };

  return (
    <>
      <SettingsACard
        title="API keys"
        desc="Pull aggregates into your own systems. Same rules as the dashboard: groups under 5 stay hidden."
      >
        {keys.map((k, i) => (
          <SettingsARow
            key={k.id}
            first={i === 0}
            title={k.name}
            desc={`${k.prefix}••••••••${k.last4} · created ${k.created} by ${k.by} · ${k.lastUsed ? `last used ${k.lastUsed}` : 'not used yet'}`}
          >
            <Button
              variant="tertiary"
              size="lg"
              className="shrink-0"
              onClick={() => setDialog({ mode: 'rotate', id: k.id, name: k.name })}
            >
              Rotate key
            </Button>
          </SettingsARow>
        ))}
        <SettingsARow
          first={keys.length === 0}
          title="Create a new key"
          desc={`Keys inherit your MoU categories and expire with it on ${KEYS_EXPIRY}. Each key is shown once.`}
        >
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            onClick={() => setDialog({ mode: 'create' })}
          >
            Create key
          </Button>
        </SettingsARow>
      </SettingsACard>

      <SettingsACard title={TEST_KEY.name}>
        <SettingsARow
          first
          title={TEST_KEY.title}
          desc={`${TEST_KEY.prefix}••••••••${TEST_KEY.last4} · ${TEST_KEY.note}`}
        >
          <SettingsAToggle
            on={testOn}
            label={`${TEST_KEY.name}: ${TEST_KEY.title}`}
            onChange={setTestOn}
          />
        </SettingsARow>
      </SettingsACard>

      <section
        aria-label="Revoke all keys"
        className="flex flex-col gap-[4px] rounded-[20px] border-[1.5px] border-[#c0392b] bg-white p-[clamp(14px,1.39vw,24px)]"
      >
        <header className="flex flex-col gap-[4px] pb-[8px]">
          <h2 className="m-0 text-[clamp(17px,1.1vw,19px)] leading-[1.25] font-semibold tracking-[-0.19px] text-[#c0392b]">
            Revoke all keys
          </h2>
          <p className="m-0 text-[14px] leading-[20px] text-[#595959]">
            Use this if a key leaks. Every system using GTH data stops at once.
          </p>
        </header>
        <SettingsARow
          first
          title="This can’t be undone"
          desc="You’ll need new keys and to update your systems."
        >
          <button
            type="button"
            onClick={() => setDialog({ mode: 'revoke' })}
            className="inline-flex h-[47px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-[#c0392b] px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <SettingsTrashIcon className="size-[20px] shrink-0" />
            Revoke all keys
          </button>
        </SettingsARow>
      </section>

      {dialog?.mode === 'create' || dialog?.mode === 'rotate' ? (
        <AgencyKeySecretDialog
          mode={dialog.mode}
          keyName={dialog.name}
          onDone={done}
          onClose={() => setDialog(null)}
        />
      ) : null}
      {dialog?.mode === 'revoke' ? (
        <AgencyRevokeKeysDialog
          onClose={() => setDialog(null)}
          onConfirm={() => {
            log('revoke all');
            setKeys([]);
            setTestOn(false);
            setDialog(null);
            onToast(TOASTS.keyRevoked);
          }}
        />
      ) : null}
    </>
  );
};

export default AgencyApiKeysTab;
