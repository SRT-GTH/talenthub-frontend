import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import { apiMessage } from '../../../../services/institutionPortal.api.js';
import InstitutionAlwaysOnChip from './InstitutionAlwaysOnChip.jsx';
import InstitutionInviteStaffCard from './InstitutionInviteStaffCard.jsx';
import InstitutionSettingsInfoBox from './InstitutionSettingsInfoBox.jsx';
import InstitutionStaffRow from './InstitutionStaffRow.jsx';
import { InstitutionSettingsInfoIcon } from './institutionSettingsIcons.jsx';
import {
  ROLE_CAPABILITIES,
  ROLE_INFO,
  STAFF_SEATS_COPY,
  TOASTS,
} from './data/institutionSettingsData.js';

const log = debug('InstitutionStaffTab');

/*
 * InstitutionStaffTab — Figma 11.6.1b staff list (8597:396377), 11.6.1e invite (8746:207, ?modal=invite), 11.6.1f remove (the dialog is mounted by the page).
 * Live (GET /institution/staff): staff who joined and pending invites, seats, the role switches. Admins invite (an email link valid 7 days), change roles,
 * resend invites and remove access; other staff see the list read-only. The role switches save right away (PATCH /institution/settings/capabilities).
 * Props: data (useInstitutionState()), team (useInstitutionStaff()), revised, onToast(toast).
 */
const InstitutionStaffTab = ({ data, team, revised, onToast }) => {
  const [busyCap, setBusyCap] = useState('');
  const invitingOpen = data.modal === 'invite' && team.canManage;
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

  const fail = (err) => onToast({ ...TOASTS.failed, body: apiMessage(err) });

  const send = async (invite) => {
    await team.invite(invite);
    closeModal(false);
    onToast({
      ...TOASTS.invited,
      body: `${invite.email} gets an email link to join. It works for 7 days.`,
    });
  };

  const changeRole = async (id, role) => {
    try {
      await team.changeRole(id, role);
      onToast(TOASTS.roleChanged);
    } catch (err) {
      fail(err);
    }
  };

  const resend = async (id) => {
    try {
      await team.resend(id);
      onToast(TOASTS.resent);
    } catch (err) {
      fail(err);
    }
  };

  const toggleCap = async (id, v) => {
    setBusyCap(id);
    try {
      await team.setCapability(id, v);
      onToast(TOASTS.saved);
    } catch (err) {
      fail(err);
    } finally {
      setBusyCap('');
    }
  };

  return (
    <>
      <InstitutionSettingsInfoBox
        compact={false}
        icon={<InstitutionSettingsInfoIcon className="size-[20px]" />}
      >
        {ROLE_INFO[revised ? 'rev' : 'base']}
      </InstitutionSettingsInfoBox>

      {invitingOpen ? (
        <InstitutionInviteStaffCard
          seatsUsed={team.used}
          seatCap={team.seats}
          prefill={prefill}
          onSend={send}
          onClose={closeModal}
        />
      ) : (
        <SettingsACard title="Staff">
          {team.loading ? (
            <p className="m-0 text-[14px] text-[#595959]">Loading staff…</p>
          ) : team.error ? (
            <p role="alert" className="m-0 text-[14px] text-[#902b20]">
              Could not load your staff: {team.error}{' '}
              <button
                type="button"
                className="cursor-pointer font-semibold underline"
                onClick={team.reload}
              >
                Try again
              </button>
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {team.staff.map((member) => (
                <InstitutionStaffRow
                  key={member.id}
                  member={member}
                  canManage={team.canManage}
                  onRole={changeRole}
                  onRemove={(id) => {
                    log('open remove', id);
                    data.update({ modal: 'remove', at: id });
                  }}
                  onResend={resend}
                />
              ))}
            </ul>
          )}
          {team.canManage ? (
            <div className="pt-[8px]">
              <Button
                variant="tertiary"
                size="sm"
                data-invite-trigger=""
                disabled={team.used >= team.seats}
                onClick={() => data.update({ modal: 'invite' })}
              >
                Invite a staff member
              </Button>
            </div>
          ) : (
            <p className="m-0 pt-[8px] text-[13px] text-[#595959]">
              Only your school’s admins can invite or remove staff.
            </p>
          )}
        </SettingsACard>
      )}

      <SettingsACard
        title="What each role can do"
        desc={team.canManage ? 'Changes take effect right away.' : 'Set by your school’s admins.'}
      >
        {ROLE_CAPABILITIES.map((c, i) => (
          <SettingsARow key={c.id} first={i === 0} title={c.title} desc={c.desc}>
            {c.fixed ? (
              <InstitutionAlwaysOnChip>{c.fixed}</InstitutionAlwaysOnChip>
            ) : (
              <SettingsAToggle
                on={team.capabilities[c.id] !== false}
                label={c.title}
                disabled={!team.canManage || busyCap === c.id}
                onChange={(v) => team.canManage && toggleCap(c.id, v)}
              />
            )}
          </SettingsARow>
        ))}
      </SettingsACard>

      <SettingsACard title="Staff seats">
        <SettingsARow
          first
          title={`${team.used} of ${team.seats} seats used`}
          desc={STAFF_SEATS_COPY}
        />
      </SettingsACard>
    </>
  );
};

export default InstitutionStaffTab;
