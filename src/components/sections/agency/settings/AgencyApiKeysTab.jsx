import { useState } from 'react';
import {
  agencyApiKeys,
  agencyCreateApiKey,
  agencyRevokeApiKey,
  agencySettings,
} from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow } from '../../talentSettings/SettingsAUi.jsx';
import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import AgencyKeySecretDialog from './AgencyKeySecretDialog.jsx';
import AgencyRevokeKeysDialog from './AgencyRevokeKeysDialog.jsx';
import { TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyApiKeysTab');

const day = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

/*
 * AgencyApiKeysTab — Figma 11.6.1e "API keys (agency)" (8597:397859): the agency's keys (live and test), "Create a new key", and the red
 * "Revoke all keys" card. Live: GET /agency/api-keys; Create → POST (the secret is shown once in the dialog; only its hash is stored);
 * Rotate = create a new key with the same name, then revoke the old one; Revoke one / all → DELETE. Admins only (others see the list).
 * Note: the keys are issued and stored now; the data API that accepts them is not open yet.
 * Props: onToast(toast).
 */
const AgencyApiKeysTab = ({ onToast }) => {
  const res = useAgencyResource(agencyApiKeys, []);
  const settings = useAgencyResource(agencySettings, []);
  const admin = settings.data?.role === 'admin';
  const keys = res.data?.items ?? [];
  const [dialog, setDialog] = useState(null); // { mode: 'create' } | { mode: 'rotate', id, name, env } | { mode: 'revoke' }

  const issue = async ({ name, env }) => {
    const out = await agencyCreateApiKey(name, env);
    if (dialog?.mode === 'rotate') await agencyRevokeApiKey(dialog.id);
    log('issued', out.id);
    res.reload();
    return out.secret;
  };

  const revokeOne = async (k) => {
    try {
      await agencyRevokeApiKey(k.id);
      res.reload();
      onToast({ title: 'Key revoked', body: `${k.name} stops working at once.` });
    } catch (err) {
      onToast({ title: 'Not done', body: err?.response?.data?.message || err?.message });
    }
  };

  return (
    <>
      <SettingsACard
        title="API keys"
        desc="Pull aggregates into your own systems. Same rules as the dashboard: groups under 5 stay hidden."
      >
        {res.loading && !res.data ? (
          <p role="status" className="m-0 text-[14px] text-[#737373]">
            Loading keys…
          </p>
        ) : null}
        {keys.map((k, i) => (
          <SettingsARow
            key={k.id}
            first={i === 0}
            title={`${k.name} · ${k.env}`}
            desc={`${k.prefix}••••••••${k.last4} · created ${day(k.createdAt)} by ${k.by} · ${k.lastUsedAt ? `last used ${day(k.lastUsedAt)}` : 'not used yet'}`}
          >
            {admin ? (
              <div className="flex shrink-0 flex-wrap gap-[8px]">
                <Button
                  variant="tertiary"
                  size="lg"
                  onClick={() => setDialog({ mode: 'rotate', id: k.id, name: k.name, env: k.env })}
                >
                  Rotate key
                </Button>
                <Button variant="tertiary" size="lg" onClick={() => revokeOne(k)}>
                  Revoke
                </Button>
              </div>
            ) : null}
          </SettingsARow>
        ))}
        <SettingsARow
          first={keys.length === 0}
          title="Create a new key"
          desc={`Keys inherit your MoU categories${res.data?.expiresAt ? ` and expire with it on ${day(res.data.expiresAt)}` : ''}. Each key is shown once.`}
        >
          {admin ? (
            <Button
              variant="tertiary"
              size="lg"
              className="shrink-0"
              onClick={() => setDialog({ mode: 'create' })}
            >
              Create key
            </Button>
          ) : (
            <span className="text-[13px] text-[#737373]">Agency admins only</span>
          )}
        </SettingsARow>
      </SettingsACard>

      {admin ? (
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
              disabled={!keys.length}
              onClick={() => setDialog({ mode: 'revoke' })}
              className="inline-flex h-[47px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-[#c0392b] px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SettingsTrashIcon className="size-[20px] shrink-0" />
              Revoke all keys
            </button>
          </SettingsARow>
        </section>
      ) : null}

      {dialog?.mode === 'create' || dialog?.mode === 'rotate' ? (
        <AgencyKeySecretDialog
          mode={dialog.mode}
          keyName={dialog.name}
          keyEnv={dialog.env}
          onIssue={issue}
          onClose={() => setDialog(null)}
        />
      ) : null}
      {dialog?.mode === 'revoke' ? (
        <AgencyRevokeKeysDialog
          onClose={() => setDialog(null)}
          onConfirm={async () => {
            log('revoke all');
            try {
              const out = await agencyRevokeApiKey();
              res.reload();
              onToast({
                ...TOASTS.keyRevoked,
                body: `${out.revoked} key${out.revoked === 1 ? '' : 's'} stopped working.`,
              });
            } catch (err) {
              onToast({ title: 'Not done', body: err?.response?.data?.message || err?.message });
            }
            setDialog(null);
          }}
        />
      ) : null}
    </>
  );
};

export default AgencyApiKeysTab;
