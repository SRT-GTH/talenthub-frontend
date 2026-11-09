import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import BannerToast from '../../../ui/BannerToast.jsx';
import { RecruiterSettingsCard, RecruiterSettingsRow } from '../../../ui/RecruiterSettingsCard.jsx';
import InviteDialog from '../account/InviteDialog.jsx';
import RemoveDialog from '../account/RemoveDialog.jsx';
import TeamMemberRow from '../account/TeamMemberRow.jsx';
import { teamError, useLiveTeam } from '../account/useLiveTeam.js';
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
// Live (signed-in recruiter): the real people at the organisation. Admins invite, change roles, remove people and
// answer join requests; everyone else sees the list. Roles the backend enforces: Admin and Recruiter.
const LIVE_ROLES = ROLES.filter((r) => ['admin', 'recruiter'].includes(r.value));
const LIVE_TEAM = {
  count: (n, org) => `${n} ${n === 1 ? 'person' : 'people'} at ${org || 'your organisation'}.`,
  manage:
    'Invite people by email. They create a recruiter account with that address and are let in straight away.',
  member: 'Only your organisation’s admins can invite people or change roles.',
  loading: 'Loading your team…',
  error: 'We couldn’t load your team. Refresh the page to try again.',
  empty: 'Your account isn’t linked to an organisation yet.',
  waiting: (org) =>
    `Your request to join ${org || 'this organisation'} is waiting for an admin. You’ll see the team once they let you in.`,
  requestChip: 'Asked to join',
  approve: 'Approve',
  decline: 'Decline',
  inviteBody: (org) =>
    `They’ll get an email to join ${org || 'your organisation'} on GTH. They join when they create a recruiter account with this address.`,
  removeBody: (first, org) =>
    `${first} will lose access to ${org || 'your organisation'} right away. Their postings, notes and feedback stay with your team.`,
};

const LiveTeam = ({ team }) => {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const [toast, setToast] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const orgName = team.organisation?.name || '';
  const people = team.members.filter((m) => m.status !== 'pending');

  const run = async (fn, done) => {
    setBusy(true);
    setProblem('');
    try {
      await fn();
      if (done) setToast(done);
      return true;
    } catch (err) {
      log.error('team action failed:', err?.response?.status);
      setProblem(teamError(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const pickMenu = (member, action) => {
    setMenuId(null);
    if (action === 'remove') setRemoveTarget(member);
    else if (action === 'resend')
      run(() => team.invite(member.email, member.role), TEAM_TOASTS['invite-resent'](member.email));
    else if (action === 'cancel')
      run(() => team.cancelInvite(member.email), TEAM_TOASTS['invite-cancelled'](member.email));
  };

  const intro =
    team.status === 'loading'
      ? LIVE_TEAM.loading
      : team.status === 'error'
        ? LIVE_TEAM.error
        : !team.organisation
          ? LIVE_TEAM.empty
          : team.waiting
            ? LIVE_TEAM.waiting(orgName)
            : team.canManage
              ? LIVE_TEAM.manage
              : LIVE_TEAM.member;

  return (
    <>
      <RecruiterSettingsCard
        title={TEAM_CARD.title}
        description={
          team.status === 'live' && team.organisation && !team.waiting
            ? LIVE_TEAM.count(people.length, orgName)
            : undefined
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[10px]">
          <p className="m-0 min-w-0 flex-1 basis-[240px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {intro}
          </p>
          {team.canManage ? (
            <Button
              variant="primary"
              size="sm"
              className={DIALOG_BUTTON}
              disabled={busy}
              onClick={() => setInviteOpen(true)}
            >
              {TEAM_CARD.invite}
            </Button>
          ) : null}
        </div>
        {problem ? (
          <p role="alert" className="m-0 font-sans text-[13px] leading-[20px] text-[#c0392b]">
            {problem}
          </p>
        ) : null}
        {team.members.length ? (
          <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
            {team.members.map((member) => (
              <li key={member.id} className="flex flex-col gap-[16px]">
                <hr className="m-0 h-px w-full border-0 bg-[#e5e8e3]" />
                <TeamMemberRow
                  member={member}
                  readOnly={!team.canManage}
                  roleOptions={LIVE_ROLES}
                  menuOpen={menuId === member.id}
                  onMenu={(open) => setMenuId(open ? member.id : null)}
                  onMenuPick={(action) => pickMenu(member, action)}
                  onRole={(role) =>
                    run(() => team.setRole(member.id, role), {
                      title: `Success - ${member.name} is now ${role === 'admin' ? 'an admin' : 'a recruiter'}`,
                      message: 'We let them know',
                    })
                  }
                  onResend={() => pickMenu(member, 'resend')}
                  requestActions={
                    team.canManage && member.status === 'request'
                      ? {
                          chip: LIVE_TEAM.requestChip,
                          approve: LIVE_TEAM.approve,
                          decline: LIVE_TEAM.decline,
                          busy,
                          onApprove: () =>
                            run(() => team.decide(member.id, true), {
                              title: `Success - ${member.name} joined ${orgName}`,
                              message: 'They can post jobs under your brand now',
                            }),
                          onDecline: () =>
                            run(() => team.decide(member.id, false), {
                              title: `Request from ${member.name} declined`,
                              message: 'We let them know',
                            }),
                        }
                      : null
                  }
                />
              </li>
            ))}
          </ul>
        ) : null}
      </RecruiterSettingsCard>

      <RecruiterSettingsCard title={ROLES_CARD.title}>
        {LIVE_ROLES.map((role) => (
          <RecruiterSettingsRow key={role.value} title={role.label} description={role.can} />
        ))}
      </RecruiterSettingsCard>

      {inviteOpen ? (
        <InviteDialog
          roleOptions={LIVE_ROLES}
          body={LIVE_TEAM.inviteBody(orgName)}
          hideAccess
          footerNote=""
          seatsLeft={Infinity}
          takenEmails={team.members.map((m) => String(m.email || '').toLowerCase())}
          busy={busy}
          onClose={() => setInviteOpen(false)}
          onSend={async ({ email, role }) => {
            const ok = await run(() => team.invite(email, role), TEAM_TOASTS['invite-sent'](email));
            if (ok) setInviteOpen(false);
          }}
        />
      ) : null}
      {removeTarget ? (
        <RemoveDialog
          member={removeTarget}
          body={LIVE_TEAM.removeBody(removeTarget.name.split(' ')[0], orgName)}
          onClose={() => setRemoveTarget(null)}
          onConfirm={async () => {
            const target = removeTarget;
            setRemoveTarget(null);
            await run(() => team.remove(target.id), TEAM_TOASTS['member-removed'](target.name));
          }}
        />
      ) : null}
      {toast ? (
        <BannerToast
          key={toast.title}
          tone="success"
          title={toast.title}
          message={toast.message}
          duration={TOAST_MS}
          placement={TOAST_PLACEMENT}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
};

const TeamTab = ({ settings }) => {
  const team = useLiveTeam();
  if (team.status !== 'demo') return <LiveTeam team={team} />;
  return <DemoTeamTab settings={settings} />;
};

const DemoTeamTab = ({ settings }) => {
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
