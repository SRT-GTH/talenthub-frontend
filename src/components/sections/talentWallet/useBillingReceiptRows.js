import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  billingV2Enabled,
  formatDate,
  formatMoney,
  formatMonth,
  listReceipts,
  methodLabel,
} from '../../../services/billing.api.js';

const log = debug('useBillingReceiptRows');

/*
 * Billing receipts as Transactions rows (VITE_BILLING_V2=1): one "Money out" row per receipt, opening the receipt drawer
 * with `&tx=rct:<id>`. Returns [] with the flag off or on any error, so the drawn transactions are untouched.
 */
export const useBillingReceiptRows = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!billingV2Enabled()) return undefined;
    let live = true;
    listReceipts({ limit: 20 })
      .then((res) => {
        const list = (res && res.receipts) || [];
        log('loaded', { n: list.length });
        if (!live) return;
        setRows(
          list.map((r) => ({
            id: `rct:${r.id}`,
            group: formatMonth(r.paidAt || r.issuedAt),
            kind: 'card',
            title:
              r.applied && r.applied[0] && r.applied[0].invoiceNumber
                ? `Payment · ${r.applied[0].invoiceNumber}`
                : 'Payment',
            meta: `${formatDate(r.paidAt || r.issuedAt)}${r.method ? ` · ${methodLabel(r.method)}` : ''} · ${r.number}`,
            amount: `− ${formatMoney(r.amount, r.currency)}`,
            money: 'out',
            status: r.status === 'voided' ? 'Voided' : 'Completed',
            tone: r.status === 'voided' ? 'warn' : 'ok',
            hasReceipt: true,
            at: r.paidAt || r.issuedAt,
          }))
        );
      })
      .catch((err) => log('receipts failed', err?.response?.status || err?.message));
    return () => {
      live = false;
    };
  }, []);
  return rows;
};
