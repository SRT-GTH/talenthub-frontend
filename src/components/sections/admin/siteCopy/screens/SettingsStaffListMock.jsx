import { useEffect } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import FieldChip from '../fields/FieldChip.jsx';
import { CheckCircleIcon } from '../fields/FieldsIcons.jsx';
import SettingsMockShell from '../roles/SettingsMockShell.jsx';
import {
  NAV_LABELS_STAFF,
  SETTINGS_ROLE_LABELS,
  SETTINGS_SUBTITLE,
  STAFF_LIST,
} from '../roles/settingsMockData.js';

const log = debug('SettingsStaffListMock');

/*
 * SettingsStaffListMock — Platform Admin 7.8.7e "Settings → Staff accounts · Content Editor listed" (Figma 7.8.7e).
 *   /admin/site-copy/settings/staff-list                         the list: NAME · ROLE · LAST SIGN-IN · STATUS, the new Content Editor "Ama Owusu" first (row tinted)
 *   …?sent=1                                                     adds the green banner "Set-up link sent to Ama Owusu. She’ll see Site copy, Product names and Media library when she signs in."
 *   …?sent=1&name=<full name>&who=<support|moderator|senior|editor|super>   the banner and the first row of an account created in 7.8.7b
 * A MOCK copy of Settings → Staff accounts (the real page is `/admin/settings/staff`, backed by the API and not edited), with the new "Content Editor" account type listed.
 * ⚠️ ASSUMPTION: an account other than Ama Owusu created in 7.8.7b appears first as "<type> · new", last sign-in "Not yet", status "Invited" (not drawn); the table scrolls inside its card below lg;
 * "Create a staff account" leads to 7.8.7b (/admin/site-copy/settings/staff).
 */
const SettingsStaffListMock = ({ ctx, data }) => {
  const sent = data.params.get('sent') === '1';
  const name = data.params.get('name') || 'Ama Owusu';
  const who = data.params.get('who') || 'editor';
  const created = sent && name !== 'Ama Owusu';

  useEffect(() => {
    log('mount', { sent, name, who, created });
  }, [sent, name, who, created]);

  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const rows = created
    ? [
        {
          id: 'created',
          initials,
          name,
          role: `${SETTINGS_ROLE_LABELS[who] ?? SETTINGS_ROLE_LABELS.editor} · new`,
          last: 'Not yet',
          status: 'Invited',
          fresh: true,
        },
        ...STAFF_LIST.rows.map((r) => ({ ...r, fresh: false })),
      ]
    : STAFF_LIST.rows;

  return (
    <SettingsMockShell
      ctx={ctx}
      subtitle={SETTINGS_SUBTITLE}
      labels={NAV_LABELS_STAFF}
      activeLabel="Staff accounts"
      itemWeight={500}
      action={{ label: STAFF_LIST.action, to: '/admin/site-copy/settings/staff' }}
      banner={
        sent ? (
          <div
            role="status"
            className="flex items-start gap-[12px] rounded-[16px] bg-[#ebf1ec]/50 p-[16px]"
          >
            <CheckCircleIcon className="mt-[1px] size-[18px] shrink-0 text-[#387440]" />
            <p className="m-0 min-w-0 font-sans text-[14px] leading-[20px] font-medium text-[#2a5730]">
              {STAFF_LIST.sentBanner(name)}
            </p>
          </div>
        ) : null
      }
    >
      <section
        aria-label="Staff accounts"
        className="overflow-hidden rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white"
      >
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f8f8f4]">
                {STAFF_LIST.columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={classNames(
                      'px-[20px] py-[14px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#575755]',
                      i === 0 && 'w-[34%]',
                      i === 1 && 'w-[26%]',
                      i === 2 && 'w-[20%]'
                    )}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className={classNames(
                    'border-t border-solid border-[#1c2a21]/8',
                    r.fresh && 'bg-[#ebf1ec]/50'
                  )}
                >
                  <td className="px-[20px] py-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <span
                        aria-hidden="true"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#f8f8f4] font-sans text-[12px] leading-[14px] font-bold text-[#1c2a21]"
                      >
                        {r.initials}
                      </span>
                      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                        {r.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[14px] font-sans text-[14px] leading-[17px] text-[#1c2a21]">
                    {r.role}
                  </td>
                  <td className="px-[20px] py-[14px] font-sans text-[14px] leading-[17px] text-[#1c2a21]">
                    {r.last}
                  </td>
                  <td className="px-[20px] py-[14px]">
                    {r.status === 'Active' ? (
                      <FieldChip tone="active" icon={<CheckCircleIcon className="size-[14px]" />}>
                        Active
                      </FieldChip>
                    ) : (
                      <FieldChip tone="neutral">{r.status}</FieldChip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SettingsMockShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.7e',
    area: 'site-copy',
    priority: 5,
    match: (ctx) =>
      ctx.segments.length === 2 &&
      ctx.segments[0] === 'settings' &&
      ctx.segments[1] === 'staff-list',
    Component: SettingsStaffListMock,
  },
];

export default SettingsStaffListMock;
