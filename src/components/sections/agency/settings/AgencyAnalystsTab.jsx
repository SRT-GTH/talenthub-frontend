import { useCallback, useState } from 'react';
import {
  agencyAnalysts,
  agencyInviteAnalyst,
  agencyRemoveAnalyst,
  agencyResetAnalyst,
  agencySetAnalystRole,
  agencySettings,
  agencyUpdateCapabilities,
} from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import AgencyAlwaysOnChip from './AgencyAlwaysOnChip.jsx';
import AgencyAnalystRow from './AgencyAnalystRow.jsx';
import AgencyInviteAnalystCard from './AgencyInviteAnalystCard.jsx';
import AgencyRemoveAccessDialog from './AgencyRemoveAccessDialog.jsx';
import AgencySettingsInfoBox from './AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from './agencySettingsIcons.jsx';
import { ROLE_CAPABILITIES, ROLE_INFO, TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyAnalystsTab');

/*
 * AgencyAnalystsTab — Figma 11.6.1b analysts list, 11.6.1c add (?modal=invite), 11.6.1d remove (?modal=remove&at=<user id>).
 * Live: GET /agency/analysts. "Send invite" creates the analyst's sign-in (POST /agency/analysts) and shows a one-time temporary password
 * for the admin to hand over (they set their own at first sign-in, like agency accounts created by GTH). "Resend" issues a new temporary
 * password; Change role → PATCH; Remove access → DELETE (signed out, history kept). Role switches → PATCH /agency/settings/capabilities.
 * Non-admins see the list read-only.
 * Props: data (useAgencyState()), onToast(toast).
 */

const Credentials = ({ creds, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Email: ${creds.email}\nTemporary password: ${creds.temporaryPassword}`
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <SettingsACard title="Sign-in details · shown once">
      <p className="m-0 text-[14px] leading-[20px] text-[#595959]">
        Hand these to {creds.email} in person or by phone. They set their own password the first
        time they sign in. This password isn’t shown again.
      </p>
      <dl className="m-0 grid grid-cols-[140px_1fr] gap-y-[8px] text-[15px] leading-[20px]">
        <dt className="text-[#595959]">Email</dt>
        <dd className="m-0 font-semibold break-all text-[#1c2a21]">{creds.email}</dd>
        <dt className="text-[#595959]">Temporary password</dt>
        <dd className="m-0 font-mono font-semibold break-all text-[#1c2a21]">
          {creds.temporaryPassword}
        </dd>
      </dl>
      <div className="flex flex-wrap gap-[12px] pt-[8px]">
        <Button variant="tertiary" size="sm" onClick={copy}>
          {copied ? 'Copied' : 'Copy details'}
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          I’ve handed them over
        </Button>
      </div>
    </SettingsACard>
  );
};

const AgencyAnalystsTab = ({ data, onToast }) => {
  const team = useAgencyResource(agencyAnalysts, []);
  const settings = useAgencyResource(agencySettings, []);
  const [creds, setCreds] = useState(null);
  const [error, setError] = useState('');
  const analysts = team.data?.items ?? [];
  const seats = team.data?.seats ?? 0;
  const seatsUsed = team.data?.used ?? 0;
  const admin = settings.data?.role === 'admin';
  const caps = settings.data?.capabilities ?? { post: true, export: true };

  const invitingOpen = admin && data.modal === 'invite';
  const removeId = data.modal === 'remove' ? data.params.get('at') : null;
  const removing = analysts.find((a) => a.id === removeId && !a.self) ?? null;

  const closeModal = useCallback(
    (restore = true) => {
      data.update({ modal: null, at: null });
      if (restore)
        requestAnimationFrame(() => document.querySelector('[data-invite-trigger]')?.focus());
    },
    [data]
  );

  const run = async (fn, toast) => {
    setError('');
    try {
      const out = await fn();
      team.reload();
      if (toast) onToast(toast);
      return out;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'That didn’t work.';
      setError(msg);
      onToast({ title: 'Not done', body: msg });
      return null;
    }
  };

  const send = async ({ name, email, phone, role }) => {
    log('invite', { email, role });
    const out = await run(
      () => agencyInviteAnalyst({ name, email, phone, role: role.toLowerCase() }),
      {
        ...TOASTS.invited,
        body: `${email} can sign in with the temporary password below.`,
      }
    );
    if (out?.login) {
      setCreds(out.login);
      closeModal(false);
    }
  };

  const changeRole = (id, role) => {
    log('role', { id, role });
    run(() => agencySetAnalystRole(id, role.toLowerCase()), TOASTS.roleChanged);
  };

  const confirmRemove = async () => {
    const gone = removing;
    log('remove', gone.id);
    await run(() => agencyRemoveAnalyst(gone.id), {
      ...TOASTS.removed,
      body: `${gone.name} was signed out.`,
    });
    data.update({ modal: null, at: null });
  };

  const resend = async (id) => {
    log('resend', id);
    const out = await run(() => agencyResetAnalyst(id), {
      title: 'New temporary password',
      body: 'Hand it over; it is shown once.',
    });
    if (out?.login) setCreds(out.login);
  };

  const toggleCap = async (id, on) => {
    try {
      await agencyUpdateCapabilities({ [id]: on });
      settings.reload();
      onToast(TOASTS.saved);
    } catch (err) {
      onToast({ title: 'Not saved', body: err?.response?.data?.message || err?.message });
    }
  };

  return (
    <>
      <AgencySettingsInfoBox
        compact={false}
        icon={<AgencySettingsInfoIcon className="size-[20px]" />}
      >
        {ROLE_INFO}
      </AgencySettingsInfoBox>

      {creds ? <Credentials creds={creds} onClose={() => setCreds(null)} /> : null}

      {invitingOpen ? (
        <AgencyInviteAnalystCard
          seatsUsed={seatsUsed}
          seats={seats}
          domain={team.data?.domain}
          error={error}
          onSend={send}
          onClose={closeModal}
        />
      ) : (
        <SettingsACard title="Analysts">
          {team.loading && !team.data ? (
            <p role="status" className="m-0 text-[14px] text-[#737373]">
              Loading your team…
            </p>
          ) : null}
          <ul className="m-0 flex list-none flex-col p-0">
            {analysts.map((a) => (
              <AgencyAnalystRow
                key={a.id}
                analyst={a}
                readOnly={!admin}
                onRole={changeRole}
                onRemove={(id) => data.update({ modal: 'remove', at: id })}
                onResend={resend}
              />
            ))}
          </ul>
          {admin ? (
            <div className="pt-[8px]">
              <Button
                variant="tertiary"
                size="sm"
                data-invite-trigger=""
                disabled={seatsUsed >= seats}
                onClick={() => data.update({ modal: 'invite' })}
              >
                Invite an analyst
              </Button>
            </div>
          ) : null}
        </SettingsACard>
      )}

      <SettingsACard title="What each role can do" desc="Changes take effect right away.">
        {ROLE_CAPABILITIES.map((c, i) => (
          <SettingsARow key={c.id} first={i === 0} title={c.title} desc={c.desc}>
            {c.fixed ? (
              <AgencyAlwaysOnChip>{c.fixed}</AgencyAlwaysOnChip>
            ) : (
              <SettingsAToggle
                on={Boolean(caps[c.id])}
                label={c.title}
                disabled={!admin}
                onChange={(v) => (admin ? toggleCap(c.id, v) : null)}
              />
            )}
          </SettingsARow>
        ))}
      </SettingsACard>

      <SettingsACard title="Analyst seats">
        <SettingsARow
          first
          title={`${seatsUsed} of ${seats} seats used`}
          desc="Seats are set by your MoU. Ask your GTH contact to add more."
        />
      </SettingsACard>

      {removing && admin ? (
        <AgencyRemoveAccessDialog
          analyst={removing}
          actorName="you"
          onClose={() => closeModal(false)}
          onConfirm={confirmRemove}
        />
      ) : null}
    </>
  );
};

export default AgencyAnalystsTab;
