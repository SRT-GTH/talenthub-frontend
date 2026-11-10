import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('billing.api');

/*
 * Billing history (backend services/billingReads.service.js, Billing Phase 1 slice I1). Read-only, the signed-in user's
 * own documents. The routes exist only while the backend runs with SUBSCRIPTION_V2=1; the screens use them only when
 * this build has VITE_BILLING_V2=1 (otherwise they keep the drawn mock data).
 *   GET /billing/invoices            { invoices: [InvoiceSummary], hasMore }
 *   GET /billing/invoices/:id        InvoiceSummary + { lines: [...], payments: [...] }
 *   GET /billing/receipts            { receipts: [ReceiptSummary], hasMore }
 *   GET /billing/receipts/:id        ReceiptSummary + { invoice: InvoiceSummary + lines | null }
 * InvoiceSummary: { id, number, status, currency, subtotal, discount, tax, total, amountPaid, amountRemaining,
 *                   periodStart, periodEnd, issuedAt, paidAt, dueDate, receiptNumber,
 *                   taxBreakdown: [{ code: VAT|NHIL|GETFUND|COVID, label, rateBp, amount }] }
 * Amounts are integer minor units (pesewas).
 */

export const billingV2Enabled = () => import.meta.env.VITE_BILLING_V2 === '1';

const unwrap = (res) => {
  const d = res?.data;
  return d && d.data && !d.type ? d.data : d;
};

export const listInvoices = async ({ limit = 20, status } = {}) => {
  log('list invoices', { limit, status });
  return unwrap(
    await api.get('/billing/invoices', { params: { limit, ...(status ? { status } : {}) } })
  );
};

export const getInvoice = async (id) =>
  unwrap(await api.get(`/billing/invoices/${encodeURIComponent(id)}`));

export const listReceipts = async ({ limit = 20 } = {}) => {
  log('list receipts', { limit });
  return unwrap(await api.get('/billing/receipts', { params: { limit } }));
};

export const getReceipt = async (id) =>
  unwrap(await api.get(`/billing/receipts/${encodeURIComponent(id)}`));

/** 6000, 'GHS' -> 'GHS 60.00' */
export const formatMoney = (minor, currency = 'GHS') => {
  const n = Number(minor || 0) / 100;
  return `${currency} ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/** 1500 -> '15%', 250 -> '2.5%' */
export const formatRate = (bp) => {
  if (bp == null) return '';
  const pct = Number(bp) / 100;
  return `${Number.isInteger(pct) ? pct : Number(pct.toFixed(2))}%`;
};

/** '2026-11-10T00:00:00Z' -> '10 Nov 2026' (Accra time) */
export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Africa/Accra',
      })
    : '';

export const formatMonth = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Africa/Accra',
      })
    : '';

export const INVOICE_STATUS = {
  open: { label: 'Due', color: '#8a6512' },
  paid: { label: 'Paid', color: '#387440' },
  void: { label: 'Cancelled', color: '#575755' },
  uncollectible: { label: 'Written off', color: '#b3261e' },
};

/** Short tax name for a breakdown row: 'VAT 15%', 'NHIL 2.5%', 'GETFund 2.5%'. */
export const taxLabel = (t) => {
  const names = { VAT: 'VAT', NHIL: 'NHIL', GETFUND: 'GETFund', COVID: 'COVID-19 levy' };
  return `${names[t.code] || t.label || 'Tax'}${t.rateBp != null ? ` ${formatRate(t.rateBp)}` : ''}`;
};

/** Payment method as people say it. */
export const methodLabel = (m) =>
  ({
    mobile_money: 'Mobile money',
    card: 'Card',
    bank: 'Bank',
    bank_transfer: 'Bank transfer',
    ussd: 'USSD',
  })[m] || (m ? String(m).replace(/_/g, ' ') : '');
