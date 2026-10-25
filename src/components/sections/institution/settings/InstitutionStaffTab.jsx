import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import InstitutionAlwaysOnChip from './InstitutionAlwaysOnChip.jsx';
import InstitutionInviteStaffCard from './InstitutionInviteStaffCard.jsx';
import InstitutionSettingsInfoBox from './InstitutionSettingsInfoBox.jsx';
import InstitutionStaffRow from './InstitutionStaffRow.jsx';
import { InstitutionSettingsInfoIcon } from './institutionSettingsIcons.jsx';
import {
  ROLE_CAPABILITIES,
  ROLE_INFO,
  STAFF_SEATS,
  STAFF_SEATS_COPY,
  STAFF_SEATS_HIDDEN_REV,
  TOASTS,
} from './data/institutionSettingsData.js';

const log = debug('InstitutionStaffTab');

/*
 * InstitutionStaffTab — Figma 11.6.1b staff list (8597:396377), 11.6.1e invite (8746:207, ?modal=invite), 11.6.1f remove (the dialog is mounted by the page).
 * `revised` = the invite frame's copy (banner, role rows, seats 6 of 10): shown only while the invite card is open, see institutionSettingsData.js.
 * Interactions (mock): invite adds a pending row and a seat; role Change updates the row; Remove access opens the confirm dialog (page); the role
 * switches are component state; Resend refreshes the invite note.
 * Props: data (useInstitutionState()), team (useInstitutionStaff()), revised, onToast(toast, onUndo?).
 */
const InstitutionStaffTab = ({ data, team, revised, onToast }) => {
  const [caps, setCaps] = useState(() => ({
    base: Object.fromEntries(ROLE_CAPABILITIES.base.map((c) => [c.id, Boolean(c.on)])),
    rev: Object.fromEntries(ROLE_CAPABILITIES.rev.map((c) => [c.id, Boolean(c.on)])),
  }));
  const version = revised ? 'rev' : 'base';
  const seatCap = STAFF_SEATS[version];
  const seatsUsed = team.staff.length + (revised ? STAFF_SEATS_HIDDEN_REV : 0);
  const invitingOpen = data.modal === 'invite';
  const prefill = {
    name: data.params.get('invitee') ?? '',
    email: data.params.get('invitee_email') ?? '',
  };

  const closeModal = useCallback(
    (restore = true) => {
      data.update({ modal: null, at: null, invitee: null, invitee_email: null });
      if (restore) {
        requestAnimationFrame(() => document.querySelector('[data-invite-trigger]')?.focus());
      }
    },
    [data]
  );

  const send = (invite) => {
    team.invite(invite);
    closeModal(false);
    onToast(TOASTS.invited);
  };

  const changeRole = (id, role) => {
    team.changeRole(id, role);
    onToast(TOASTS.roleChanged);
  };

  const resend = (id) => {
    team.resend(id);
    onToast(TOASTS.invited);
  };

  return (
    <>
      <InstitutionSettingsInfoBox
        compact={false}
        icon={<InstitutionSettingsInfoIcon className="size-[20px]" />}
      >
        {ROLE_INFO[version]}
      </InstitutionSettingsInfoBox>

      {invitingOpen ? (
        <InstitutionInviteStaffCard
          seatsUsed={seatsUsed}
          seatCap={seatCap}
          prefill={prefill}
          onSend={send}
          onClose={closeModal}
        />
      ) : (
        <SettingsACard title="Staff">
          <ul className="m-0 flex list-none flex-col p-0">
            {team.staff.map((member) => (
              <InstitutionStaffRow
                key={member.id}
                member={member}
                onRole={changeRole}
                onRemove={(id) => {
                  log('open remove', id);
                  data.update({ modal: 'remove', at: id });
                }}
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
              Invite a staff member
            </Button>
          </div>
        </SettingsACard>
      )}

      <SettingsACard title="What each role can do" desc="Changes take effect right away.">
        {ROLE_CAPABILITIES[version].map((c, i) => (
          <SettingsARow key={c.id} first={i === 0} title={c.title} desc={c.desc}>
            {c.fixed ? (
              <InstitutionAlwaysOnChip>{c.fixed}</InstitutionAlwaysOnChip>
            ) : (
              <SettingsAToggle
                on={caps[version][c.id]}
                label={c.title}
                onChange={(v) => {
                  log('capability', { id: c.id, v });
                  setCaps((s) => ({ ...s, [version]: { ...s[version], [c.id]: v } }));
                }}
              />
            )}
          </SettingsARow>
        ))}
      </SettingsACard>

      <SettingsACard title="Staff seats">
        <SettingsARow
          first
          title={`${seatsUsed} of ${seatCap} seats used`}
          desc={STAFF_SEATS_COPY[version]}
        />
      </SettingsACard>
    </>
  );
};

export default InstitutionStaffTab;
