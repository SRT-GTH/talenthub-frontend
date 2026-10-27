import { useEffect, useRef, useState } from 'react';
import { SettingsACheckIcon, SettingsAUserTileIcon } from '../../../shared/assets.jsx';
import InstitutionStatusChip from './InstitutionStatusChip.jsx';
import { ROLES } from './data/institutionSettingsData.js';

const LINK =
  'inline-flex min-h-[24px] shrink-0 cursor-pointer items-center text-[14px] leading-[17px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const RED_LINK =
  'inline-flex min-h-[24px] shrink-0 cursor-pointer items-center text-[14px] leading-[17px] font-semibold text-[#902b20] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/*
 * InstitutionStaffRow — one row of the staff list, Figma 11.6.1b (8597:396377): 44 #ffd86b tile, "<name> · <role>" 15/600 + Active / Invited chip,
 * 13px detail line, and the right-hand actions. Admins (canManage) get: "Change" (role select) and "Remove access" for others who joined; "Change",
 * "Resend" and "Cancel invite" for invites. Everyone sees "You" on their own row.
 * Props: member (a /institution/staff item), canManage, onRole(id, role), onRemove(id), onResend(id).
 */
const InstitutionStaffRow = ({ member, canManage, onRole, onRemove, onResend }) => {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef(null);
  const active = member.status === 'active';
  const roleRow = ROLES.find((r) => r.id === member.role)?.row ?? member.roleLabel ?? member.role;
  const manage = canManage && !member.self;

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  return (
    <li className="flex items-center gap-[14px] border-t border-[rgba(28,42,33,0.08)] py-[14px] first:border-t-0 max-sm:flex-wrap">
      <span
        aria-hidden="true"
        className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b]"
      >
        <SettingsAUserTileIcon className="size-[19px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
          <span className="text-[15px] leading-[18px] font-semibold break-all text-[#1c2a21]">
            {`${member.name} · ${roleRow}`}
          </span>
          {active ? (
            <InstitutionStatusChip
              tone="active"
              icon={<SettingsACheckIcon className="size-[14px]" />}
            >
              Active
            </InstitutionStatusChip>
          ) : (
            <InstitutionStatusChip tone="invited">Invited</InstitutionStatusChip>
          )}
        </div>
        <span className="text-[13px] leading-[16px] break-words text-[#595959]">
          {`${member.email} · ${member.note}`}
        </span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-[14px] gap-y-[4px]">
        {member.self ? (
          <span className="text-[14px] leading-[17px] font-semibold text-[#387440] underline">
            You
          </span>
        ) : null}
        {manage && editing ? (
          <select
            ref={selectRef}
            aria-label={`Role for ${member.name}`}
            value={member.role}
            onChange={(e) => {
              onRole(member.id, e.target.value);
              setEditing(false);
            }}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                setEditing(false);
              }
            }}
            className="h-[34px] rounded-[10px] border border-[#c1d4c4] bg-white px-[8px] text-[14px] font-semibold text-[#1c2a21]"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.row}
              </option>
            ))}
          </select>
        ) : null}
        {manage && !editing ? (
          <>
            <button
              type="button"
              className={LINK}
              aria-label={`Change role of ${member.name}`}
              onClick={() => setEditing(true)}
            >
              Change
            </button>
            {!active ? (
              <button
                type="button"
                className={LINK}
                aria-label={`Resend invite to ${member.email}`}
                onClick={() => onResend(member.id)}
              >
                Resend
              </button>
            ) : null}
            <button
              type="button"
              className={RED_LINK}
              aria-label={
                active ? `Remove access for ${member.name}` : `Cancel invite to ${member.email}`
              }
              onClick={() => onRemove(member.id)}
            >
              {active ? 'Remove access' : 'Cancel invite'}
            </button>
          </>
        ) : null}
      </div>
    </li>
  );
};

export default InstitutionStaffRow;
