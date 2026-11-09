import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { GroupCard, SettingRow } from '../../talentSettings/SettingsBUi.jsx';
import { CalendarIcon, UploadArrowIcon } from '../hiring/hiringIcons.jsx';
import { BILLING } from '../hiring/hiringData.js';

import { useRecruiterShell } from '../../../../hooks/useRecruiterShell.js';

const log = debug('BillingTab');

/* Signed in: the recruiter's real plan and this month's usage (useRecruiterShell: plan tier + postings). */
const PRICE = {
  free: 'Free',
  professional: 'GHS 450 / month · billed monthly',
  enterprise: 'Custom pricing · billed yearly',
};
const liveBilling = (shell) => {
  const plan = shell.plan || {};
  const used = shell.jobs?.postedThisMonth ?? 0;
  const limit = plan.jobPosts;
  return {
    name: plan.label || 'Free',
    price: PRICE[shell.tier] || PRICE.free,
    usage: [
      {
        id: 'job-posts',
        label: 'Job posts',
        used,
        limit: limit ?? Math.max(used, 1),
        unlimited: limit === null,
        note: limit === null ? 'Unlimited on your plan · this month' : 'This month',
        tone: limit !== null && used >= limit ? 'amber' : 'green',
      },
      {
        id: 'active',
        label: 'Active postings',
        used: shell.jobs?.active ?? 0,
        limit: Math.max(shell.jobs?.total ?? 0, 1),
        note: `${shell.jobs?.total ?? 0} postings in all`,
        tone: 'green',
      },
    ],
  };
};

// The plan and payment screens are drawn in "Recruiter - Onboarding Screens" (R05 Plan, R06 Payment: built at /onboarding/recruiter/*);
// the Settings frames wire no prototype links, so these hand-offs are ⚠️ ASSUMPTION (the only drawn plan / payment screens).
const PLAN_ROUTE = '/onboarding/recruiter/plan';
const PAYMENT_ROUTE = '/onboarding/recruiter/payment';

const BAR_TONES = { green: 'bg-[#387440]', amber: 'bg-[#c8951a]' };

// Plain green text link of the billing rows (Figma "Link · Change" / "Link · Download": 14/24 500, optional leading glyph).
const GreenLink = ({ onClick, label, children, className = '' }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`inline-flex min-h-[24px] min-w-[24px] shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${className}`}
  >
    {children}
  </button>
);

// One usage card (Figma "Use · …": 16px radius, #e5e8e3 line, label + "3 / 20", an 8px bar, the note). The bar is used / limit of the track.
const UsageCard = ({ item }) => {
  const percent = Math.round((item.used / item.limit) * 100);
  return (
    <div
      role="group"
      aria-label={item.label}
      className="flex min-w-0 flex-col gap-[8px] rounded-[16px] border border-[#e5e8e3] bg-white p-[16px]"
    >
      <div className="flex items-center justify-between gap-[12px]">
        <p className="m-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
          {item.label}
        </p>
        <p className="m-0 text-[14px] leading-[24px] font-semibold tracking-[0.1px] whitespace-nowrap text-[#111]">
          {item.unlimited ? item.used : `${item.used} / ${item.limit}`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={`${item.label} used`}
        aria-valuemin={0}
        aria-valuemax={item.limit}
        aria-valuenow={item.used}
        className="h-[8px] w-full max-w-[240px] overflow-hidden rounded-[8px] bg-[#fefefe]"
      >
        <div
          className={`h-full rounded-[8px] ${BAR_TONES[item.tone]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="m-0 text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">{item.note}</p>
    </div>
  );
};

/*
 * BillingTab - recruiter Settings `?tab=billing` (Figma SR-11 10161:81038): Your plan (Professional, renewal chip, price, Compare plans / Upgrade, three usage bars),
 * Payment method (MTN Mobile Money, Default chip, Change) and Invoices (three paid invoices with a Download link each).
 * Mock payload in hiringData.js (BILLING). Nothing else is drawn for billing, so every action here only logs (see the wiki "not drawn" list): no plan comparison, upgrade checkout,
 * payment-method form or invoice file exists in Figma.
 */
const BillingTab = () => {
  const navigate = useNavigate();
  const shell = useRecruiterShell();
  const live = shell ? liveBilling(shell) : null;
  const go = (to, what) => {
    log('hand-off', what, '->', to);
    navigate(to);
  };
  useEffect(() => {
    log('mount', { plan: BILLING.plan.name, invoices: BILLING.invoices.rows.length });
  }, []);

  return (
    <>
      <GroupCard recruiter title="Your plan" aria-label="Your plan">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-[12px] gap-y-[12px]">
          <div className="flex min-w-0 flex-col gap-[4px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              <p className="font-heading m-0 text-[26px] leading-[31px] font-semibold tracking-[-0.52px] text-[#111]">
                {live ? live.name : BILLING.plan.name}
              </p>
              {live ? null : (
                <span className="inline-flex items-center gap-[4px] rounded-full bg-[#fefefe] px-[8px] py-[3px] text-[12px] leading-[20px] font-medium tracking-[0.2px] whitespace-nowrap text-[#575755]">
                  <CalendarIcon className="size-[12px]" />
                  {BILLING.plan.renews}
                </span>
              )}
            </div>
            <p className="m-0 text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
              {live ? live.price : BILLING.plan.price}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-[10px]">
            <Button
              variant="tertiary"
              size="lg"
              onClick={() => go(`${PLAN_ROUTE}?state=professional`, 'compare plans')}
            >
              {BILLING.plan.compare}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => go(`${PLAN_ROUTE}?state=enterprise`, 'upgrade')}
            >
              {BILLING.plan.upgrade}
            </Button>
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-[16px] max-lg:grid-cols-1">
          {(live ? live.usage : BILLING.usage).map((item) => (
            <UsageCard key={item.id} item={item} />
          ))}
        </div>
      </GroupCard>

      {live ? (
        <GroupCard recruiter title="Payments and invoices" aria-label="Payments and invoices">
          <SettingRow
            recruiter
            title={
              live.name === 'Free'
                ? 'No payments on the Free plan'
                : 'Payments are handled with our team'
            }
            description={
              live.name === 'Free'
                ? 'Upgrade to post more jobs and send more invites.'
                : 'Online receipts aren’t available yet. Contact support for a copy of any invoice.'
            }
            control={
              <GreenLink onClick={() => go('/recruiter/help?help=contact', 'billing support')}>
                Contact support
              </GreenLink>
            }
          />
        </GroupCard>
      ) : null}
      {live ? null : (
        <GroupCard recruiter title={BILLING.payment.title} aria-label={BILLING.payment.title}>
          <SettingRow
            recruiter
            title={BILLING.payment.method}
            description={BILLING.payment.holder}
            control={
              <div className="flex shrink-0 items-center gap-[12px]">
                <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#2a5730]">
                  {BILLING.payment.badge}
                </span>
                <GreenLink onClick={() => go(PAYMENT_ROUTE, 'change payment method')}>
                  {BILLING.payment.change}
                </GreenLink>
              </div>
            }
          />
        </GroupCard>
      )}

      {live ? null : (
        <GroupCard recruiter title={BILLING.invoices.title} aria-label={BILLING.invoices.title}>
          {BILLING.invoices.rows.map((row) => (
            <SettingRow
              key={row.id}
              recruiter
              title={row.date}
              description={
                <>
                  {row.plan}
                  <span className="font-medium" style={{ color: row.paidColor }}>
                    {row.status}
                  </span>
                </>
              }
              control={
                <div className="flex shrink-0 items-center gap-[12px]">
                  <span className="text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#111]">
                    {row.amount}
                  </span>
                  <GreenLink
                    label={`${BILLING.invoices.download} invoice ${row.date}`}
                    onClick={() => log('download invoice (not drawn)', row.id)}
                  >
                    <UploadArrowIcon className="size-[16px]" />
                    {BILLING.invoices.download}
                  </GreenLink>
                </div>
              }
            />
          ))}
        </GroupCard>
      )}
    </>
  );
};

export default BillingTab;
