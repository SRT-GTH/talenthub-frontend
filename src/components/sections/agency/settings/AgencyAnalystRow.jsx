import { useEffect, useRef, useState } from 'react';
import { SettingsACheckIcon, SettingsAUserTileIcon } from '../../../shared/assets.jsx';
import AgencyStatusChip from './AgencyStatusChip.jsx';
import { ROLES } from './data/agencySettingsData.js';

const LINK =
  'shrink-0 cursor-pointer text-[14px] leading-[17px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/*
 * AgencyAnalystRow — one "guardian" row of Figma 11.6.1b (8611:583): 44 #ffd86b tile, "<name> · <role>" 15/600 + Active / Invited chip,
 * 13px detail line, and the right-hand action: "You" (self, text), "Change" (role select), "Resend" (invited).
 * "Change" turns into a role <select> (Esc or choosing closes it); ⚠️ ASSUMPTION: "Remove access" (the dialog's own label) sits next to Change
 * for analysts other than you, since the frames draw the dialog but not its trigger.
 * Props: analyst, onRole(id, role), onRemove(id), onResend(id).
 */
const AgencyAnalystRow = ({ analyst, onRole, onRemove, onResend }) => {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef(null);
  const active = analyst.status === 'active';

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  return (
    <li className="flex items-center gap-[14px] border-t border-[rgba(28,42,33,0.08)] py-[14px] first:border-t-0">
      <span
        aria-hidden="true"
        className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b]"
      >
        <SettingsAUserTileIcon className="size-[19px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
          <span className="text-[15px] leading-[18px] font-semibold break-all text-[#1c2a21]">
            {active ? `${analyst.name} · ${analyst.role}` : analyst.name}
          </span>
          {active ? (
            <AgencyStatusChip tone="active" icon={<SettingsACheckIcon className="size-[14px]" />}>
              Active
            </AgencyStatusChip>
          ) : (
            <AgencyStatusChip tone="invited">Invited</AgencyStatusChip>
          )}
        </div>
        <span className="text-[13px] leading-[16px] break-words text-[#595959]">
          {active ? `${analyst.email} · ${analyst.note}` : analyst.note}
        </span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-[14px] gap-y-[4px]">
        {analyst.self ? (
          <span className="text-[14px] leading-[17px] font-semibold text-[#387440] underline">
            You
          </span>
        ) : null}
        {active && !analyst.self && editing ? (
          <select
            ref={selectRef}
            aria-label={`Role for ${analyst.name}`}
            value={analyst.role}
            onChange={(e) => {
              onRole(analyst.id, e.target.value);
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
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : null}
        {active && !analyst.self && !editing ? (
          <>
            <button
              type="button"
              className={LINK}
              aria-label={`Change role of ${analyst.name}`}
              onClick={() => setEditing(true)}
            >
              Change
            </button>
            <button
              type="button"
              className="shrink-0 cursor-pointer text-[14px] leading-[17px] font-semibold text-[#902b20] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              aria-label={`Remove access for ${analyst.name}`}
              onClick={() => onRemove(analyst.id)}
            >
              Remove access
            </button>
          </>
        ) : null}
        {!active ? (
          <button
            type="button"
            className={LINK}
            aria-label={`Resend invite to ${analyst.email}`}
            onClick={() => onResend(analyst.id)}
          >
            Resend
          </button>
        ) : null}
      </div>
    </li>
  );
};

export default AgencyAnalystRow;
