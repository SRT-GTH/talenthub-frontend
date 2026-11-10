import { useEffect } from 'react';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { useAdminData } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { StatusChip } from './AdminBillingParts.jsx';
import {
  formatDate,
  formatMoney,
  getInvoice,
  getReceipt,
  methodLabel,
  taxLabel,
} from '../../../../services/billing.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('AdminBillingDocDialog');

/*
 * AdminBillingDocDialog — one invoice or receipt for a staff member (/admin/billing?doc=inv:<id> | rct:<id>), read with the
 * ?customerId= staff lookup (audited). Shows what the customer's own document shows: charge lines, subtotal, the VAT / NHIL /
 * GETFund rows, total, and the payments (receipt number, method) — or for a receipt, what it paid and the invoice's tax rows.
 * Props: doc ('inv:<id>' | 'rct:<id>'), customerId, onClose.
 */

const Row = ({ label, value, strong = false, muted = false }) => (
  <div className="flex items-baseline justify-between gap-[16px] py-[5px]">
    <span className={muted ? 'text-[#737373]' : 'text-[#1c2a21]'}>{label}</span>
    <span
      className={
        strong ? 'font-bold whitespace-nowrap text-[#1c2a21]' : 'whitespace-nowrap text-[#1c2a21]'
      }
    >
      {value}
    </span>
  </div>
);

const Section = ({ title, children }) => (
  <section className="flex flex-col border-t border-solid border-[#e7e7e7] pt-[12px]">
    <h3 className="m-0 mb-[4px] font-sans text-[12px] font-semibold tracking-[0.4px] text-[#595959] uppercase">
      {title}
    </h3>
    {children}
  </section>
);

const InvoiceBody = ({ inv }) => {
  const cur = inv.currency;
  return (
    <>
      <Section title="Charges">
        {(inv.lines || []).map((l) => (
          <Row key={l.id} label={l.description} value={formatMoney(l.amount, cur)} />
        ))}
        {inv.discount ? (
          <Row label="Discount" value={`− ${formatMoney(inv.discount, cur)}`} />
        ) : null}
        <Row label="Subtotal" value={formatMoney(inv.subtotal, cur)} muted />
      </Section>
      <Section title="Taxes">
        {(inv.taxBreakdown || []).length === 0 ? (
          <Row label="No tax on this invoice" value="—" muted />
        ) : (
          inv.taxBreakdown.map((t) => (
            <Row key={t.code || t.label} label={taxLabel(t)} value={formatMoney(t.amount, cur)} />
          ))
        )}
        <Row label="Total" value={formatMoney(inv.total, cur)} strong />
        {inv.amountRemaining ? (
          <Row label="Still owed" value={formatMoney(inv.amountRemaining, cur)} strong />
        ) : null}
      </Section>
      <Section title="Payments">
        {(inv.payments || []).length === 0 ? (
          <Row label="No payment yet" value="—" muted />
        ) : (
          inv.payments.map((p) => (
            <Row
              key={p.receiptId}
              label={`${p.receiptNumber} · ${methodLabel(p.method) || 'Payment'} · ${formatDate(p.paidAt)}${p.status === 'voided' ? ' · voided' : ''}`}
              value={formatMoney(p.amount, cur)}
            />
          ))
        )}
      </Section>
    </>
  );
};

const ReceiptBody = ({ r }) => {
  const cur = r.currency;
  return (
    <>
      <Section title="Payment">
        <Row label="Amount received" value={formatMoney(r.amount, cur)} strong />
        <Row label="Method" value={methodLabel(r.method) || '—'} />
        <Row label="Paid on" value={formatDate(r.paidAt || r.issuedAt)} />
        {r.reference ? (
          <Row
            label="Gateway reference"
            value={<span className="font-mono text-[12.5px]">{r.reference}</span>}
          />
        ) : null}
        {r.unapplied ? (
          <Row label="Not yet applied (credit)" value={formatMoney(r.unapplied, cur)} />
        ) : null}
      </Section>
      <Section title="Paid towards">
        {(r.applied || []).map((a) => (
          <Row
            key={a.invoiceId}
            label={a.invoiceNumber || `Invoice ${a.invoiceId.slice(-6)}`}
            value={formatMoney(a.amount, cur)}
          />
        ))}
      </Section>
      {r.invoice ? (
        <Section title={`Taxes on ${r.invoice.number || 'the invoice'}`}>
          {(r.invoice.taxBreakdown || []).map((t) => (
            <Row key={t.code || t.label} label={taxLabel(t)} value={formatMoney(t.amount, cur)} />
          ))}
          <Row label="Invoice total" value={formatMoney(r.invoice.total, cur)} strong />
        </Section>
      ) : null}
    </>
  );
};

const AdminBillingDocDialog = ({ doc, customerId, onClose }) => {
  const [kind, id] = String(doc).split(':');
  const isInvoice = kind === 'inv';
  const res = useAdminData(
    () => (isInvoice ? getInvoice(id, { customerId }) : getReceipt(id, { customerId })),
    [doc, customerId]
  );
  useEffect(() => log('open', { kind }), [kind]);
  const d = res.data;
  const title = isInvoice ? d?.number || 'Invoice' : d?.number || 'Receipt';

  return (
    <AgencyDialog
      label={isInvoice ? 'Invoice' : 'Receipt'}
      onClose={onClose}
      panelClassName="w-[min(640px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-[24px] border border-solid border-[#1c2a21] bg-white p-[20px] md:p-[32px]"
    >
      <div className="flex flex-col gap-[14px] font-sans text-[14px] leading-[20px]">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex min-w-0 flex-col gap-[6px]">
            <span className="self-start rounded-full bg-[#eef5ef] px-[10px] py-[2px] text-[12px] font-semibold text-[#2a5730]">
              {isInvoice ? 'Invoice' : 'Receipt'} · staff view
            </span>
            <h2 className="m-0 text-[20px] leading-[26px] md:text-[24px] md:leading-[30px] font-semibold text-[#1c2a21]">
              {title}
            </h2>
            {d ? (
              <span className="text-[13px] text-[#737373]">
                {isInvoice
                  ? `Issued ${formatDate(d.issuedAt)}${d.periodStart ? ` · ${formatDate(d.periodStart)} – ${formatDate(d.periodEnd)}` : ''}`
                  : `Issued ${formatDate(d.issuedAt)}${d.status === 'voided' ? ' · voided' : ''}`}
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-[10px]">
            {isInvoice && d ? <StatusChip status={d.status} /> : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="h-[34px] w-[34px] cursor-pointer rounded-full border border-solid border-[#e1eae2] bg-white text-[18px] leading-none text-[#1c2a21]"
            >
              ×
            </button>
          </div>
        </div>
        {res.loading || res.error ? (
          <AdminLoadNotice
            loading={res.loading}
            error={res.error}
            status={res.status}
            onRetry={res.reload}
          />
        ) : isInvoice ? (
          <InvoiceBody inv={d} />
        ) : (
          <ReceiptBody r={d} />
        )}
        <p className="m-0 text-[12px] text-[#737373]">
          Read-only. Opening this document was written to the audit log.
        </p>
      </div>
    </AgencyDialog>
  );
};

export default AdminBillingDocDialog;
