import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { TextInput } from '../../../ui/form';
import {
  GroupCard,
  SettingRow,
  SettingsToggle,
  TextAction,
} from '../../talentSettings/SettingsBUi.jsx';
import AgencyStatusChip from '../../agency/settings/AgencyStatusChip.jsx';
import { AdminArrowRightIcon, AdminLock14Icon } from '../adminIcons.jsx';
import { AdminChipCheckIcon, AdminStaffUserIcon } from './settingsIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { CREATE, INFO, ROLE_SUMMARY, STAFF, SUPER_ADMINS } from './data/adminSettingsData.js';

const log = debug('StaffTab');

/*
 * StaffTab — Settings › Staff accounts (Figma 7.5.1a 8639:8, create form 7.5.1b 8639:540, the last-Super-Admin notice 7.5.1d 8639:1538): the cream rule banner (r16, 14/500
 * #463409) · "Staff" group (a yellow 44 tile, "Name · Role" 15/600 + Active / "Locked · 30 days" chip, the 13 #595959 line, a green underlined link) — or, with ?create=1, the
 * "Create a staff account" group (name + work email, four role pills, "Send set-up link →" + the permission preview) · "What each role can do" (a Policy chip and two switches) ·
 * "Super Admins". The groups are the talent Settings GroupCard / SettingRow.
 * Props: creating (bool), onChange(row) (the "Change" / "Review" links), onLastSuper().
 * ⚠️ ASSUMPTION: "Change" / "Review" on a staff row only log; "You" is inert; "Send set-up link" logs the invite and closes the form; the two switches are local state.
 */

const Pill = ({ children, selected, onClick }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={classNames(
      'inline-flex cursor-pointer items-center rounded-full border border-solid px-[14px] py-[8px] font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
        : 'border-[#1c2a21]/60 bg-white text-[#1c2a21]'
    )}
  >
    {children}
  </button>
);

const StaffTab = ({ creating, onClose, onChange, onLastSuper }) => {
  const [role, setRole] = useState(CREATE.roles[0]);
  const [name, setName] = useState(CREATE.name);
  const [email, setEmail] = useState(CREATE.email);
  const [on, setOn] = useState({ moderate: true, exports: true });
  return (
    <>
      <p className="m-0 flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#463409]">
        {INFO}
      </p>
      {creating ? (
        <GroupCard title={CREATE.title}>
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">{CREATE.sub}</p>
          <form
            className="flex w-full flex-col gap-[8px]"
            onSubmit={(e) => {
              e.preventDefault();
              log('send set-up link (mock)', { role });
              onClose();
            }}
          >
            <div className="grid grid-cols-1 gap-[16px] pt-[0px] sm:grid-cols-2">
              <TextInput
                label={CREATE.nameLabel}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextInput
                label={CREATE.emailLabel}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-[8px] pt-[8px]" role="group" aria-label="Role">
              {CREATE.roles.map((r) => (
                <Pill key={r} selected={role === r} onClick={() => setRole(r)}>
                  {r}
                </Pill>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-[12px] pt-[12px]">
              <button
                type="submit"
                className="inline-flex h-[56px] cursor-pointer items-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {CREATE.send}
                <AdminArrowRightIcon className="size-[20px]" />
              </button>
              <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                {CREATE.preview}
              </span>
            </div>
          </form>
        </GroupCard>
      ) : (
        <GroupCard title={STAFF.title} gap="gap-0">
          {STAFF.rows.map((r, i) => (
            <div
              key={r.id}
              className={classNames(
                'flex w-full items-center gap-[14px] py-[14px]',
                i > 0 && 'border-t border-[rgba(28,42,33,0.08)]'
              )}
            >
              <span
                aria-hidden="true"
                className="grid size-[44px] shrink-0 place-items-center rounded-[13px] bg-[#ffd86b]"
              >
                <AdminStaffUserIcon className="size-[21px] text-[#1c2a21]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <p className="m-0 flex flex-wrap items-center gap-[8px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {r.name}
                  <AgencyStatusChip
                    tone={r.locked ? 'invited' : 'active'}
                    icon={r.locked ? null : <AdminChipCheckIcon className="size-[14px]" />}
                  >
                    {r.chip}
                  </AgencyStatusChip>
                </p>
                <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">{r.sub}</p>
              </div>
              {r.link === 'You' ? (
                <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#387440] underline">
                  {r.link}
                </span>
              ) : (
                <TextAction
                  tone="green"
                  onClick={() => (r.id === 'nana' ? onLastSuper() : onChange(r))}
                >
                  {r.link}
                </TextAction>
              )}
            </div>
          ))}
        </GroupCard>
      )}
      <GroupCard title={ROLE_SUMMARY.title} description={ROLE_SUMMARY.sub}>
        {ROLE_SUMMARY.rows.map((r, i) => (
          <SettingRow
            key={r.title}
            title={r.title}
            description={r.text}
            top
            className={i === 0 ? '' : undefined}
            control={
              r.control === 'policy' ? (
                <span className="inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959]">
                  <AdminLock14Icon className="size-[14px]" />
                  Policy
                </span>
              ) : (
                <SettingsToggle
                  checked={on[r.title === 'Moderate content' ? 'moderate' : 'exports']}
                  onChange={(v) =>
                    setOn((s) => ({
                      ...s,
                      [r.title === 'Moderate content' ? 'moderate' : 'exports']: v,
                    }))
                  }
                  label={r.title}
                />
              )
            }
          />
        ))}
      </GroupCard>
      <GroupCard title={SUPER_ADMINS.title} gap="gap-0">
        <SettingRow
          title={SUPER_ADMINS.row.title}
          description={SUPER_ADMINS.row.text}
          top={false}
          control={null}
        />
      </GroupCard>
    </>
  );
};

export default StaffTab;
