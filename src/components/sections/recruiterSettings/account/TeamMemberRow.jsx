import { useEffect, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Chip from '../../../ui/Chip.jsx';
import { RecruiterSettingsLink } from '../../../ui/RecruiterSettingsCard.jsx';
import { ClockGlyph, DotsGlyph } from '../../recruiterJobs/jobIcons.jsx';
import RoleSelect from './RoleSelect.jsx';
import { MEMBER_MENU, ROLES, TEAM_CARD } from './accountData.js';

const log = debug('TeamMemberRow');

/* "…" menu of one row: a small card under the 36px button. ⚠️ ASSUMPTION: the open menu is not drawn (entries in accountData.js MEMBER_MENU). Escape / outside click close it; the URL keeps `?menu=<id>`. */
const MemberMenu = ({ member, open, onToggle, onPick }) => {
  const wrapRef = useRef(null);
  const items = member.isYou
    ? MEMBER_MENU.you
    : member.status === 'pending'
      ? MEMBER_MENU.pending
      : MEMBER_MENU.active;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) onToggle(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onToggle(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onToggle]);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={TEAM_CARD.menuLabel(member.name)}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => onToggle(!open)}
        className="flex size-[36px] cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white p-0 text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-lg:size-[44px]"
      >
        <DotsGlyph size={18} />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={TEAM_CARD.menuLabel(member.name)}
          className="absolute top-full right-0 z-30 mt-[6px] flex min-w-[180px] flex-col gap-[2px] rounded-[12px] border border-solid border-[#e5e8e3] bg-white p-[6px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_rgba(15,15,10,0.1)]"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => onPick(item.id)}
              className={classNames(
                'min-h-[36px] cursor-pointer rounded-[8px] border-0 bg-transparent px-[10px] py-[6px] text-left font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap hover:bg-[#ebf1ec]/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
                item.tone === 'danger' ? 'text-[#c0392b]' : 'text-[#111]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/*
 * TeamMemberRow - one "Member · …" line of the Team members card (Figma 10161:78513 / 78525 / 78561): 40px initials avatar, name (+ " (you)") over the email,
 * then the role select + "…" menu, or - for an invite not accepted yet - the "Invite pending" chip, "Resend" and the menu.
 * Rows with a role select are 103px high (the design-system dropdown reserves a 21px label slot above and a 15px hint line below); the "you" row is 80px (disabled Admin, no hint line).
 */
const TeamMemberRow = ({
  member,
  menuOpen,
  onMenu,
  onMenuPick,
  onRole,
  onResend,
  readOnly = false,
}) => {
  const pending = member.status === 'pending';
  log('render', { id: member.id, role: member.role, pending, menuOpen });
  return (
    <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px]">
      <div className="flex min-w-0 flex-1 basis-[220px] items-center gap-[12px]">
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[40px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px]',
            member.avatar
          )}
        >
          {member.initials}
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <p className="m-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] break-words text-[#111]">
            {member.name}
            {member.isYou ? ' (you)' : ''}
          </p>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] break-all text-[#575755]">
            {member.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-[10px] max-sm:w-full">
        {pending ? (
          <>
            <Chip tone="amber">
              <ClockGlyph size={12} />
              {TEAM_CARD.pendingChip}
            </Chip>
            {readOnly ? null : (
              <RecruiterSettingsLink
                onClick={onResend}
                aria-label={`${TEAM_CARD.resend} invite to ${member.email}`}
              >
                {TEAM_CARD.resend}
              </RecruiterSettingsLink>
            )}
          </>
        ) : (
          <div
            className={classNames(
              'w-[180px] max-sm:w-auto max-sm:flex-1 md:pt-[29px]',
              !member.isYou && 'md:pb-[23px]'
            )}
          >
            <RoleSelect
              ariaLabel={TEAM_CARD.roleLabel(member.name)}
              value={member.role}
              options={ROLES}
              disabled={member.isYou || readOnly}
              onChange={onRole}
            />
          </div>
        )}
        {readOnly ? null : (
          <MemberMenu member={member} open={menuOpen} onToggle={onMenu} onPick={onMenuPick} />
        )}
      </div>
    </div>
  );
};

export default TeamMemberRow;
