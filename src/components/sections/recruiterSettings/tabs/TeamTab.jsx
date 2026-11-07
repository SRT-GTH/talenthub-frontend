import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import BannerToast from '../../../ui/BannerToast.jsx';
import { RecruiterSettingsCard, RecruiterSettingsRow } from '../../../ui/RecruiterSettingsCard.jsx';
import InviteDialog from '../account/InviteDialog.jsx';
import RemoveDialog from '../account/RemoveDialog.jsx';
import TeamMemberRow from '../account/TeamMemberRow.jsx';
import {
  DEFAULT_REMOVE_ID,
  DEFAULT_TOAST_EMAIL,
  ROLES,
  ROLES_CARD,
  TEAM_CARD,
  TEAM_MEMBERS,
  TEAM_PLAN,
  TEAM_TOASTS,
} from '../account/accountData.js';

const log = debug('TeamTab');

// SR-06: the toast sits at the top centre over the nav (Figma y = 22 in the 1728 frame), hugging its text.
const TOAST_PLACEMENT =
  'fixed top-[22px] left-1/2 z-[70] w-max max-w-[calc(100vw-32px)] -translate-x-1/2 max-md:top-[12px]';
const TOAST_MS = 10000;

// ⚠️ ASSUMPTION: a pending invite has no name yet, so the row shows the address' local part ("ama.k" -> "Ama K") with grey initials.
const pendingFromEmail = (email) => {
  const local = email.split('@')[0];
  const parts = local.split(/[._-]+/).filter(Boolean);
  const name = parts.map((p) => p[0].toUpperCase() + p.slice(1)).join(' ') || local;
  const initials = (parts.length > 1 ? parts[0][0] + parts[1][0] : local.slice(0, 2)).toUpperCase();
  return {
    id: `invite-${email}`,
    name,
    email,
    initials,
    role: 'viewer',
    status: 'pending',
    avatar: 'bg-[#bcb7a8] text-[#575755]',
  };
};

const DIALOG_BUTTON = '!h-[40px] !py-0 max-sm:w-full';

/*
 * TeamTab - `/recruiter/settings?tab=team`: SR-03 (10161:78103) Team members + "What each role can do"; SR-04 / SR-05 the invite dialog (`?modal=invite-teammate`, `&role=open`);
 * SR-06 the "Invite sent" toast (`?toast=invite-sent`); SR-07 the remove confirm (`?modal=remove-teammate&member=efua`). URL keys are listed at the top of account/accountData.js.
 * Mock, in memory: a role change updates the row, "Send invite" adds a pending row (and a seat), "Resend" / "Cancel invite" act on pending rows, "Remove teammate" drops the row.
 * Wiki: recruiter-settings-account.md.
 */
const TeamTab = ({ settings }) => {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const modal = settings.modal;
  const toastKind = settings.get('toast');
  const toastTo = settings.get('to');
  const menuId = settings.get('row');
  const seatsLeft = TEAM_PLAN.seats - members.length;

  useEffect(() => {
    log('mount', { modal, toast: toastKind, members: members.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, toastKind]);

  const toast = (kind, to) => settings.update({ toast: kind, to: to ?? null }, { replace: true });
  const closeDialog = () => settings.update({ modal: null, role: null, email: null, member: null });
  const setMenu = useCallback(
    (id, open) => settings.update({ row: open ? id : null }, { replace: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const changeRole = (id, role) => {
    log('role change', { id, role });
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  const pickMenu = (member, action) => {
    log('menu', { id: member.id, action });
    if (action === 'account') settings.update({ tab: 'account', row: null });
    else if (action === 'remove')
      settings.update({ modal: 'remove-teammate', member: member.id, row: null });
    else if (action === 'resend')
      settings.update({ row: null, toast: 'invite-resent', to: member.email }, { replace: true });
    else if (action === 'cancel') {
      setMembers((list) => list.filter((m) => m.id !== member.id));
      settings.update(
        { row: null, toast: 'invite-cancelled', to: member.email },
        { replace: true }
      );
    }
  };

  const sendInvite = ({ email, role }) => {
    const next = { ...pendingFromEmail(email), role };
    log('invite sent', { email, role });
    setMembers((list) => [...list, next]);
    settings.update({
      modal: null,
      role: null,
      email: null,
      row: null,
      toast: 'invite-sent',
      to: email,
    });
  };

  const removeId = modal === 'remove-teammate' ? settings.get('member') || DEFAULT_REMOVE_ID : '';
  const removeTarget = members.find((m) => m.id === removeId && !m.isYou);

  const toastCopy = (() => {
    if (!TEAM_TOASTS[toastKind]) return null;
    const fallback = toastKind === 'member-removed' ? '' : DEFAULT_TOAST_EMAIL;
    return TEAM_TOASTS[toastKind](toastTo || fallback);
  })();

  return (
    <>
      <RecruiterSettingsCard
        title={TEAM_CARD.title}
        description={TEAM_CARD.seatsUsed(members.length)}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[10px]">
          <p className="m-0 min-w-0 flex-1 basis-[240px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {TEAM_CARD.description}
          </p>
          <Button
            variant="primary"
            size="sm"
            className={DIALOG_BUTTON}
            onClick={() => settings.update({ modal: 'invite-teammate', row: null })}
          >
            {TEAM_CARD.invite}
          </Button>
        </div>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {members.map((member) => (
            <li key={member.id} className="flex flex-col gap-[16px]">
              <hr className="m-0 h-px w-full border-0 bg-[#e5e8e3]" />
              <TeamMemberRow
                member={member}
                menuOpen={menuId === member.id}
                onMenu={(open) => setMenu(member.id, open)}
                onMenuPick={(action) => pickMenu(member, action)}
                onRole={(role) => changeRole(member.id, role)}
                onResend={() => toast('invite-resent', member.email)}
              />
            </li>
          ))}
        </ul>
      </RecruiterSettingsCard>

      <RecruiterSettingsCard title={ROLES_CARD.title}>
        {ROLES.map((role) => (
          <RecruiterSettingsRow key={role.value} title={role.label} description={role.can} />
        ))}
      </RecruiterSettingsCard>

      {modal === 'invite-teammate' ? (
        <InviteDialog
          initialEmail={settings.get('email')}
          roleOpen={settings.get('role') === 'open'}
          onRoleOpen={(open) => settings.update({ role: open ? 'open' : null }, { replace: true })}
          seatsLeft={seatsLeft}
          takenEmails={members.map((m) => m.email.toLowerCase())}
          onClose={closeDialog}
          onSend={sendInvite}
        />
      ) : null}
      {modal === 'remove-teammate' && removeTarget ? (
        <RemoveDialog
          member={removeTarget}
          onClose={closeDialog}
          onConfirm={() => {
            log('removed', { id: removeTarget.id });
            setMembers((list) => list.filter((m) => m.id !== removeTarget.id));
            settings.update({
              modal: null,
              member: null,
              toast: 'member-removed',
              to: removeTarget.name,
            });
          }}
        />
      ) : null}
      {toastCopy ? (
        <BannerToast
          key={`${toastKind}-${toastTo}`}
          tone="success"
          title={toastCopy.title}
          message={toastCopy.message}
          duration={TOAST_MS}
          placement={TOAST_PLACEMENT}
          onClose={() => settings.update({ toast: null, to: null }, { replace: true })}
        />
      ) : null}
    </>
  );
};

export default TeamTab;
