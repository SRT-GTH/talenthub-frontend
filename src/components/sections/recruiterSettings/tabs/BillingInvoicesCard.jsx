import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { GroupCard, SettingRow } from '../../talentSettings/SettingsBUi.jsx';
import {
  INVOICE_STATUS,
  formatDate,
  formatMoney,
  getInvoice,
  listInvoices,
  methodLabel,
  taxLabel,
} from '../../../../services/billing.api.js';

const log = debug('BillingInvoicesCard');

const LINK =
  'inline-flex min-h-[24px] min-w-[24px] shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Row = ({ label, value, strong = false, muted = false }) => (
  <div className="flex items-baseline justify-between gap-[12px]">
    <dt className={`text-[14px] leading-[24px] ${muted ? 'text-[#575755]' : 'text-[#111]'}`}>
      {label}
    </dt>
    <dd
      className={`m-0 text-right text-[14px] leading-[24px] whitespace-nowrap ${strong ? 'font-semibold text-[#111]' : 'text-[#111]'}`}
    >
      {value}
    </dd>
  </div>
);

/* The invoice opened under its row: what was charged, then net + each Ghana levy = total, then what was paid. */
const InvoiceDetail = ({ id }) => {
  const [state, setState] = useState({ status: 'loading', invoice: null });
  useEffect(() => {
    let live = true;
    getInvoice(id)
      .then((invoice) => live && setState({ status: 'ready', invoice }))
      .catch((err) => {
        log('detail failed', err?.response?.status || err?.message);
        if (live) setState({ status: 'error', invoice: null });
      });
    return () => {
      live = false;
    };
  }, [id]);

  if (state.status === 'loading') {
    return <p className="m-0 text-[14px] leading-[24px] text-[#575755]">Loading the invoice…</p>;
  }
  if (state.status === 'error') {
    return (
      <p role="alert" className="m-0 text-[14px] leading-[24px] text-[#b3261e]">
        We couldn’t open this invoice. Try again in a moment.
      </p>
    );
  }
  const inv = state.invoice;
  const cur = inv.currency;
  return (
    <div className="flex w-full flex-col gap-[12px] rounded-[16px] border border-[#e5e8e3] bg-[#fbfbf9] p-[16px]">
      <dl className="m-0 flex flex-col gap-[4px]">
        {inv.lines.map((l) => (
          <Row key={l.id} label={l.description} value={formatMoney(l.amount, cur)} />
        ))}
      </dl>
      <div className="h-px w-full bg-[#e5e8e3]" />
      <dl className="m-0 flex flex-col gap-[4px]" aria-label="Tax breakdown">
        <Row label="Subtotal" value={formatMoney(inv.subtotal, cur)} muted />
        {inv.discount > 0 && (
          <Row label="Discount" value={`− ${formatMoney(inv.discount, cur)}`} muted />
        )}
        {inv.taxBreakdown.map((t) => (
          <Row
            key={t.code || t.label}
            label={taxLabel(t)}
            value={formatMoney(t.amount, cur)}
            muted
          />
        ))}
        <Row label="Total" value={formatMoney(inv.total, cur)} strong />
      </dl>
      {inv.payments.length > 0 && (
        <>
          <div className="h-px w-full bg-[#e5e8e3]" />
          <dl className="m-0 flex flex-col gap-[4px]" aria-label="Payments">
            {inv.payments.map((p) => (
              <Row
                key={p.receiptId}
                label={`Paid ${formatDate(p.paidAt)}${p.method ? ` · ${methodLabel(p.method)}` : ''} · receipt ${p.receiptNumber}`}
                value={formatMoney(p.amount, cur)}
                muted
              />
            ))}
            {inv.amountRemaining > 0 && (
              <Row label="Still to pay" value={formatMoney(inv.amountRemaining, cur)} strong />
            )}
          </dl>
        </>
      )}
      <p className="m-0 text-[12px] leading-[20px] text-[#575755]">
        {inv.periodStart && inv.periodEnd
          ? `Covers ${formatDate(inv.periodStart)} to ${formatDate(inv.periodEnd)}. `
          : ''}
        Prices include VAT, NHIL and GETFund as shown.
      </p>
    </div>
  );
};

/*
 * BillingInvoicesCard - the "Invoices" card of recruiter Settings › Billing, from GET /api/billing/invoices
 * (VITE_BILLING_V2=1). Each row: issue date, number · status, total, "View" opens the invoice under the row.
 */
const BillingInvoicesCard = () => {
  const [state, setState] = useState({ status: 'loading', invoices: [] });
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let live = true;
    listInvoices({ limit: 12 })
      .then((res) => {
        log('loaded', { n: res?.invoices?.length || 0 });
        if (live) setState({ status: 'ready', invoices: res?.invoices || [] });
      })
      .catch((err) => {
        log('list failed', err?.response?.status || err?.message);
        if (live) setState({ status: 'error', invoices: [] });
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <GroupCard recruiter title="Invoices" aria-label="Invoices">
      {state.status === 'loading' && (
        <p className="m-0 text-[14px] leading-[24px] text-[#575755]">Loading your invoices…</p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="m-0 text-[14px] leading-[24px] text-[#b3261e]">
          We couldn’t load your invoices. Refresh the page to try again.
        </p>
      )}
      {state.status === 'ready' && state.invoices.length === 0 && (
        <p className="m-0 text-[14px] leading-[24px] text-[#575755]">
          No invoices yet. Your first one appears here when your plan renews.
        </p>
      )}
      {state.invoices.map((inv) => {
        const st = INVOICE_STATUS[inv.status] || { label: inv.status, color: '#575755' };
        const open = openId === inv.id;
        return (
          <div key={inv.id} className="flex w-full flex-col gap-[12px]">
            <SettingRow
              recruiter
              title={formatDate(inv.issuedAt)}
              description={
                <>
                  {inv.number ? `${inv.number} · ` : ''}
                  <span className="font-medium" style={{ color: st.color }}>
                    {st.label}
                  </span>
                </>
              }
              control={
                <div className="flex shrink-0 items-center gap-[12px]">
                  <span className="text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#111]">
                    {formatMoney(inv.total, inv.currency)}
                  </span>
                  <button
                    type="button"
                    className={LINK}
                    aria-expanded={open}
                    aria-label={`${open ? 'Hide' : 'View'} invoice ${inv.number || formatDate(inv.issuedAt)}`}
                    onClick={() => {
                      log(open ? 'close' : 'open', inv.id);
                      setOpenId(open ? null : inv.id);
                    }}
                  >
                    {open ? 'Hide' : 'View'}
                  </button>
                </div>
              }
            />
            {open && <InvoiceDetail id={inv.id} />}
          </div>
        );
      })}
    </GroupCard>
  );
};

export default BillingInvoicesCard;
