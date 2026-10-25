import { debug } from '../../../../utils/debug.js';
import { humanize, shortDate, timeAgo } from '../../../../services/admin.api.js';
import { ProfileCard, TabLayout } from '../../talentProfile/ProfileTabsUi.jsx';
import AdminAccountBar from './AdminAccountBar.jsx';
import AdminAccountHero from './AdminAccountHero.jsx';
import AdminAccountRail from './AdminAccountRail.jsx';

const log = debug('AdminAccountDetail');

/*
 * AdminAccountDetail — the account detail body (Figma 7.1.2a-c): dark account bar · profile hero · left column with the account facts, the override history
 * and the recent activity from the audit log · the admin right rail (Admin actions card, Account record).
 * The talent profile cards (About, Skills, Experience, Portfolio) are not drawn here: the admin API returns the account record only, not the talent profile.
 * Props: account (adminAccountModel.accountView), activity ({ records } from /api/audit/entity/:entityId, or null), activityError, onActions(), onMessage(),
 *        onReactivate(), onReverse(index), onCancelDelete().
 */

const Row = ({ label, value }) => (
  <div className="flex flex-wrap gap-x-[12px] gap-y-[2px] border-t border-solid border-[#eef2ee] py-[10px] first:border-t-0">
    <span className="w-[160px] shrink-0 font-sans text-[13px] leading-[18px] text-[#737373]">{label}</span>
    <span className="min-w-0 flex-1 font-sans text-[14px] leading-[18px] font-medium break-words text-[#1c2a21]">
      {value ?? '—'}
    </span>
  </div>
);

const fmt = (v) => (v === null || v === undefined || v === '' ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v));

const AdminAccountDetail = ({
  account,
  activity,
  activityError,
  onActions,
  onMessage,
  onReactivate,
  onReverse,
  onCancelDelete,
  onActivity,
}) => {
  const a = account.raw;
  const primary = account.deleted
    ? { label: 'Cancel deletion', onClick: onCancelDelete }
    : account.suspended
      ? { label: 'Reactivate', onClick: onReactivate }
      : { label: 'Admin actions', onClick: onActions };
  const events = activity?.records ?? [];
  return (
    <div className="flex flex-col gap-[20px] pt-[12px]">
      <AdminAccountBar bar={account.bar} onMessage={onMessage} onActions={onActions} />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)]">
        <AdminAccountHero account={account} cover={account.cover} primary={primary} onMessage={onMessage} />
        <TabLayout
          tab="overview"
          left={
            <>
              <ProfileCard title="Account details">
                <div className="flex flex-col">
                  <Row label="Name" value={account.name} />
                  <Row label="Account type" value={account.kind} />
                  <Row label="Username" value={a.username} />
                  <Row label="Email" value={a.email} />
                  <Row label="Phone" value={a.phoneNumber} />
                  <Row label="Status" value={account.status} />
                  {a.suspendedAt ? (
                    <Row
                      label="Suspended"
                      value={`${shortDate(a.suspendedAt)}${a.suspendedUntil ? ` until ${shortDate(a.suspendedUntil)}` : ' · indefinite'}${a.suspendedReason ? ` · ${a.suspendedReason}` : ''}`}
                    />
                  ) : null}
                  {a.softDeletedAt ? (
                    <Row
                      label="Deletion"
                      value={`Requested ${shortDate(a.softDeletedAt)}${a.softDeletedReason ? ` · ${a.softDeletedReason}` : ''}`}
                    />
                  ) : null}
                  {a.mergedInto ? <Row label="Merged into" value={String(a.mergedInto)} /> : null}
                  <Row label="Under 18" value={a.isMinor ? 'Yes' : 'No'} />
                  <Row label="Region" value={[a.locality || a.district, a.region].filter(Boolean).join(', ')} />
                  <Row label="Education" value={[a.educationLevel, a.educationInstitution].filter(Boolean).join(' · ')} />
                  <Row label="Onboarding" value={a.onboardingState ? humanize(a.onboardingState.status || a.onboardingState.step || 'started') : null} />
                  <Row label="Joined" value={shortDate(a.createdAt)} />
                  <Row label="Last sign-in" value={a.lastLogin ? `${shortDate(a.lastLogin)} (${timeAgo(a.lastLogin)})` : 'Never'} />
                  <Row label="Account id" value={account.id} />
                </div>
              </ProfileCard>
              <ProfileCard title="Admin history">
                {account.overrides.length === 0 ? (
                  <p className="m-0 font-sans text-[14px] text-[#737373]">No field overrides on this account.</p>
                ) : (
                  <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
                    {account.overrides.map((o, i) => (
                      <li key={`${o.fieldName}-${o.overriddenAt}`} className="flex flex-wrap items-center gap-[10px]">
                        <span className="min-w-0 flex-1 font-sans text-[14px] leading-[19px] text-[#1c2a21]">
                          <strong>{humanize(o.fieldName)}</strong>: {fmt(o.oldValue)} → {fmt(o.newValue)}
                          <span className="block text-[12.5px] text-[#737373]">
                            {shortDate(o.overriddenAt)} · {o.reason}
                            {o.reversedAt ? ` · reversed ${shortDate(o.reversedAt)}` : ''}
                          </span>
                        </span>
                        {!o.reversedAt && o.reversalAvailable !== false && onReverse ? (
                          <button
                            type="button"
                            onClick={() => onReverse(i)}
                            className="cursor-pointer rounded-full border border-solid border-[#1c2a21] bg-white px-[12px] py-[5px] font-sans text-[12.5px] font-semibold text-[#1c2a21]"
                          >
                            Reverse
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </ProfileCard>
              <ProfileCard title="Recent activity">
                {activityError ? (
                  <p className="m-0 font-sans text-[14px] text-[#737373]">{activityError}</p>
                ) : events.length === 0 ? (
                  <p className="m-0 font-sans text-[14px] text-[#737373]">
                    {activity ? 'No audit events for this account yet.' : 'Loading…'}
                  </p>
                ) : (
                  <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                    {events.map((e) => (
                      <li key={e._id || e.id} className="flex flex-wrap gap-x-[10px] font-sans text-[13.5px] leading-[18px]">
                        <span className="min-w-0 flex-1 font-semibold text-[#1c2a21]">{humanize(e.action)}</span>
                        <span className="text-[#737373]">
                          {humanize(e.actorType)} · {timeAgo(e.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </ProfileCard>
            </>
          }
          right={
            <AdminAccountRail
              account={account}
              text={account.railText}
              primary={primary}
              activityLabel="Open in audit log →"
              onActivity={() => {
                log('open audit log for', account.id);
                onActivity?.();
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default AdminAccountDetail;
