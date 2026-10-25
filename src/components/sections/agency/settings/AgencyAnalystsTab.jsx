import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import AgencyAlwaysOnChip from './AgencyAlwaysOnChip.jsx';
import AgencyAnalystRow from './AgencyAnalystRow.jsx';
import AgencyInviteAnalystCard from './AgencyInviteAnalystCard.jsx';
import AgencyRemoveAccessDialog from './AgencyRemoveAccessDialog.jsx';
import AgencySettingsInfoBox from './AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from './agencySettingsIcons.jsx';
import {
  ANALYSTS,
  ANALYST_SEATS,
  ROLE_CAPABILITIES,
  ROLE_INFO,
  TOASTS,
} from './data/agencySettingsData.js';

const log = debug('AgencyAnalystsTab');

/*
 * AgencyAnalystsTab — Figma 11.6.1b analysts list, 11.6.1c invite (?modal=invite), 11.6.1d remove (?modal=remove&at=<id>, default kojo-mensah).
 * Interactions (mock): invite adds a pending row and a seat; role Change updates the row; remove opens a confirm dialog, then an Undo toast
 * restores the row; the role switches and seat count are component state.
 * Props: data (useAgencyState()), onToast(toast, onUndo?).
 */
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const AgencyAnalystsTab = ({ data, onToast }) => {
  const [analysts, setAnalysts] = useState(ANALYSTS);
  const [invites, setInvites] = useState(0);
  const [caps, setCaps] = useState(() =>
    Object.fromEntries(ROLE_CAPABILITIES.map((c) => [c.id, Boolean(c.on)]))
  );

  const invitingOpen = data.modal === 'invite';
  const removeId = data.modal === 'remove' ? (data.params.get('at') ?? 'kojo-mensah') : null;
  const removing = analysts.find((a) => a.id === removeId && a.status === 'active') ?? null;
  const seatsUsed = analysts.filter((a) => a.status === 'active').length + invites;

  const closeModal = useCallback(
    (restore = true) => {
      data.update({ modal: null, at: null });
      if (restore) {
        requestAnimationFrame(() => document.querySelector('[data-invite-trigger]')?.focus());
      }
    },
    [data]
  );

  const send = ({ name, email, role }) => {
    log('invite', { email, role });
    setAnalysts((list) => [
      ...list,
      {
        id: `inv-${Date.now()}`,
        name: email,
        invitee: name,
        email,
        role,
        note: `Invite sent ${today()} · expires in 7 days`,
        status: 'invited',
      },
    ]);
    setInvites((n) => n + 1);
    closeModal(false);
    onToast(TOASTS.invited);
  };

  const changeRole = (id, role) => {
    log('role', { id, role });
    setAnalysts((list) => list.map((a) => (a.id === id ? { ...a, role } : a)));
    onToast(TOASTS.roleChanged);
  };

  const confirmRemove = () => {
    const index = analysts.findIndex((a) => a.id === removing.id);
    const gone = removing;
    log('remove', gone.id);
    setAnalysts((list) => list.filter((a) => a.id !== gone.id));
    data.update({ modal: null, at: null });
    onToast({ ...TOASTS.removed, body: `${gone.name} was signed out.`, undo: true }, () => {
      log('undo remove', gone.id);
      setAnalysts((list) => {
        const next = [...list];
        next.splice(Math.min(index, next.length), 0, gone);
        return next;
      });
    });
  };

  const resend = (id) => {
    log('resend', id);
    setAnalysts((list) =>
      list.map((a) =>
        a.id === id ? { ...a, note: `Invite sent ${today()} · expires in 7 days` } : a
      )
    );
    onToast(TOASTS.invited);
  };

  return (
    <>
      <AgencySettingsInfoBox
        compact={false}
        icon={<AgencySettingsInfoIcon className="size-[20px]" />}
      >
        {ROLE_INFO}
      </AgencySettingsInfoBox>

      {invitingOpen ? (
        <AgencyInviteAnalystCard seatsUsed={seatsUsed} onSend={send} onClose={closeModal} />
      ) : (
        <SettingsACard title="Analysts">
          <ul className="m-0 flex list-none flex-col p-0">
            {analysts.map((a) => (
              <AgencyAnalystRow
                key={a.id}
                analyst={a}
                onRole={changeRole}
                onRemove={(id) => data.update({ modal: 'remove', at: id })}
                onResend={resend}
              />
            ))}
          </ul>
          <div className="pt-[8px]">
            <Button
              variant="tertiary"
              size="sm"
              data-invite-trigger=""
              onClick={() => data.update({ modal: 'invite' })}
            >
              Invite an analyst
            </Button>
          </div>
        </SettingsACard>
      )}

      <SettingsACard title="What each role can do" desc="Changes take effect right away.">
        {ROLE_CAPABILITIES.map((c, i) => (
          <SettingsARow key={c.id} first={i === 0} title={c.title} desc={c.desc}>
            {c.fixed ? (
              <AgencyAlwaysOnChip>{c.fixed}</AgencyAlwaysOnChip>
            ) : (
              <SettingsAToggle
                on={caps[c.id]}
                label={c.title}
                onChange={(v) => setCaps((s) => ({ ...s, [c.id]: v }))}
              />
            )}
          </SettingsARow>
        ))}
      </SettingsACard>

      <SettingsACard title="Analyst seats">
        <SettingsARow
          first
          title={`${seatsUsed} of ${ANALYST_SEATS} seats used`}
          desc="Seats are set by your MoU. Ask your GTH contact to add more."
        />
      </SettingsACard>

      {removing ? (
        <AgencyRemoveAccessDialog
          analyst={removing}
          actorName="Efua Owusu"
          onClose={() => closeModal(false)}
          onConfirm={confirmRemove}
        />
      ) : null}
    </>
  );
};

export default AgencyAnalystsTab;
