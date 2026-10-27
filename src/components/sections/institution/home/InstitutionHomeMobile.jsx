import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import AgencyMobileChip from '../../agency/home/AgencyMobileChip.jsx';
import AgencyMobileWidget from '../../agency/home/AgencyMobileWidget.jsx';
import {
  AgMAlert,
  AgMArrowRight,
  AgMCheck,
  AgMClock,
  AgMInfo,
  AgMShieldCheck,
  AgMUpload,
  AgMUsers,
} from '../../agency/home/agencyHomeIcons.jsx';
// The school's own roster: exact numbers (formatCount masks small groups for public figures).
const formatCount = (n) => Number(n || 0).toLocaleString('en-GB');

/*
 * InstitutionHomeMobile — the body of the institution home below lg (Figma 11.2.1c "Institution home · Mobile" 8588:960, 360 wide; the top bar is the chrome's).
 * Live: greeting from the session; Verification from the session's accreditation (head, status, renewal date); "Your students" from GET /institution/home
 * (link rate, consent, the next step and the four most recent students).
 * The drawn Records / Programmes / Student journey / Top students / In-demand skills widgets are left out until those areas are integrated: there is no data
 * behind them yet, and showing sample figures to a school would mislead.
 * Props: session (useInstitutionSession()), home (the /institution/home response or null).
 */

const SHELF_BTN =
  'flex min-h-[46px] items-center justify-center gap-[6px] rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111] no-underline shadow-[0_3px_0_rgba(34,70,38,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const PRIMARY_BTN =
  'flex min-h-[46px] items-center justify-center gap-[6px] rounded-[10px] bg-[#387440] px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning, ' : h < 17 ? 'Good afternoon, ' : 'Good evening, ';
};
const day = (iso) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(iso)
      )
    : '';

const InstitutionHomeMobile = ({ session, home }) => {
  const { admin, institution, head, verify } = session;
  const consentNeeded = home?.consentNeeded ?? 0;
  const toConfirm = home?.notLinked ?? 0;
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#111111]">
          <span className="text-[#0f1712]">{greeting()}</span>
          <span className="text-[#387440]">{admin.firstName}</span>
        </h1>
        <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
          Here’s what needs you at {institution.short || institution.name} today.
        </p>
      </div>

      <AgencyMobileWidget
        id="im-verification"
        icon={<AgMShieldCheck className="size-[16px]" />}
        title="Verification"
        subtitle={verify.approved ? 'Your institution is verified' : verify.label}
      >
        <div className="flex flex-col gap-[12px]">
          {[
            head?.name
              ? {
                  title: `${head.title || 'Head'} · ${head.name}`,
                  sub: 'Named on your accreditation',
                  chip: 'On file',
                  ok: true,
                }
              : {
                  title: 'Head of institution',
                  sub: 'Add their ID on the Accreditation page',
                  chip: 'Missing',
                  ok: false,
                },
            {
              title: 'GES accreditation',
              sub: verify.approved
                ? `Approved${verify.decided ? ` on ${day(verify.decided)}` : ''}`
                : verify.submitted
                  ? `Sent ${day(verify.submitted)}`
                  : 'Not sent yet',
              chip: verify.approved
                ? 'Verified'
                : verify.status === 'under-review'
                  ? 'In review'
                  : 'Action needed',
              ok: verify.approved,
            },
          ].map((row) => (
            <div
              key={row.title}
              className={classNames(
                'flex items-center gap-[12px] rounded-[10px] px-[16px] py-[12px]',
                row.ok ? 'bg-[#ebf1ec]/50' : 'bg-[#faf4e8]'
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111111]">
                  {row.title}
                </span>
                <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                  {row.sub}
                </span>
              </div>
              <AgencyMobileChip
                tone={row.ok ? 'ok' : 'warn'}
                icon={
                  row.ok ? (
                    <AgMCheck className="size-[12px]" />
                  ) : (
                    <AgMClock className="size-[12px]" />
                  )
                }
              >
                {row.chip}
              </AgencyMobileChip>
            </div>
          ))}
          {verify.renewalDue ? (
            <p className="m-0 flex items-center gap-[8px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              <AgMInfo className="size-[16px] shrink-0" />
              Renewal due {day(verify.renewalDue)}.
            </p>
          ) : null}
          <Link to="/institution/accreditation?view=list" className={PRIMARY_BTN}>
            <AgMUpload className="size-[16px]" />
            View documents
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="im-students"
        icon={<AgMUsers className="size-[16px]" />}
        title="Your students"
        subtitle={
          home
            ? `${formatCount(home.total)} on the roster · ${home.linkedPct}% linked to GTH`
            : 'Loading…'
        }
      >
        <div className="flex flex-col gap-[12px]">
          {consentNeeded || toConfirm ? (
            <div className="flex flex-wrap gap-[8px]">
              {consentNeeded ? (
                <AgencyMobileChip tone="hot" icon={<AgMAlert className="size-[12px]" />}>
                  {consentNeeded} need guardian consent
                </AgencyMobileChip>
              ) : null}
              {toConfirm ? (
                <AgencyMobileChip tone="warn" icon={<AgMClock className="size-[12px]" />}>
                  {toConfirm} not linked yet
                </AgencyMobileChip>
              ) : null}
            </div>
          ) : null}
          {home && !home.recent.length ? (
            <p className="m-0 font-sans text-[14px] leading-[22px] text-[#575755]">
              No students yet. Add them one by one or upload a CSV.
            </p>
          ) : null}
          {(home?.recent ?? []).map((s) => (
            <Link
              key={s.id}
              to={`/institution/students/${s.id}`}
              className="flex items-center gap-[12px] rounded-[10px] border border-solid border-[#eceee9] px-[12px] py-[10px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <span
                aria-hidden="true"
                className="grid size-[36px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] font-sans text-[13px] font-bold text-[#2a5730]"
              >
                {s.initials}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-sans text-[14px] leading-[22px] font-semibold text-[#111111]">
                  {s.name}
                </span>
                <span className="truncate font-sans text-[12px] leading-[18px] text-[#575755]">
                  {s.linked
                    ? `${s.pill || 'Linked'} · profile ${s.profile}%`
                    : s.note || 'Not linked yet'}
                </span>
              </span>
              <AgMArrowRight className="size-[16px] shrink-0 text-[#575755]" />
            </Link>
          ))}
          <Link to="/institution/students" className={SHELF_BTN}>
            Open the roster
          </Link>
        </div>
      </AgencyMobileWidget>
    </div>
  );
};

export default InstitutionHomeMobile;
