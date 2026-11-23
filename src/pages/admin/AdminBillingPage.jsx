import { useEffect, useState } from 'react';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import { useAdminSession } from '../../components/sections/admin/useAdminSession.js';
import { useAdminData } from '../../components/sections/admin/useAdminData.js';
import AdminLoadNotice from '../../components/sections/admin/AdminLoadNotice.jsx';
import AdminBillingDocDialog from '../../components/sections/admin/billing/AdminBillingDocDialog.jsx';
import {
  BillingTable,
  StatusChip,
  Tabs,
} from '../../components/sections/admin/billing/AdminBillingParts.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import PublicCard from '../../components/sections/publicData/ui/PublicCard.jsx';
import { TextInput } from '../../components/ui/form';
import {
  billingV2Enabled,
  formatDate,
  formatMoney,
  listInvoices,
  listReceipts,
  methodLabel,
  searchBillingCustomers,
} from '../../services/billing.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AdminBillingPage');

/*
 * AdminBillingPage — /admin/billing (Super Admin only). Billing support for GTH staff: find a billing customer, then read
 * their invoices and receipts exactly as the customer sees them (VAT / NHIL / GETFund breakdown, payments, receipt numbers).
 * Read-only. Backend: services/billingReads.service.js — GET /api/billing/customers (search) and the ?customerId= staff
 * lookups on /api/billing/invoices|receipts. Every search and lookup is written to the audit log (BILLING_CUSTOMERS_SEARCHED,
 * BILLING_HISTORY_VIEWED). Needs SUBSCRIPTION_V2=1 on the backend and VITE_BILLING_V2=1 in this build.
 * URL states: ?q= (email prefix or any id) · ?customer=<billing customer id> · ?tab=invoices|receipts
 *             ?doc=inv:<id> | rct:<id> (document dialog).
 */

const PAGE = 20;

/** What a customer owes on open invoices: their own currency first, any other currency after, never added together. */
const owed = (c) =>
  [
    ...(c.outstanding ? [formatMoney(c.outstanding, c.currency)] : []),
    ...(c.outstandingOther || []).map((o) => formatMoney(o.amount, o.currency)),
  ].join(' + ');

/** Keyset pages joined: loads page after page as `pages` grows. */
const usePaged = (load, key, pages) =>
  useAdminData(async () => {
    const out = { rows: [], hasMore: false };
    let cursor = null;
    for (let i = 0; i < pages; i += 1) {
      const res = await load(cursor);
      out.rows.push(...res.rows);
      out.hasMore = Boolean(res.nextCursor);
      cursor = res.nextCursor;
      if (!cursor) break;
    }
    return out;
  }, [key, pages]);

const Restricted = ({ data, message }) => (
  <AdminFrame data={data} title="Billing">
    <AdminLoadNotice error={message} status={403} />
  </AdminFrame>
);

const AdminBillingPage = () => {
  const data = useAdminState();
  const { role } = useAdminSession();
  const q = data.q.trim();
  const customerId = data.params.get('customer');
  const tab = data.tab === 'receipts' ? 'receipts' : 'invoices';
  const doc = data.params.get('doc');
  const [draft, setDraft] = useState(q);
  const [custPages, setCustPages] = useState(1);
  const [docPages, setDocPages] = useState(1);
  const allowed = role === 'super' && billingV2Enabled();

  useEffect(() => setDraft(q), [q]);
  useEffect(() => setCustPages(1), [q]);
  useEffect(() => setDocPages(1), [customerId, tab]);
  useEffect(
    () => log('mount', { role, hasQuery: Boolean(q), customerId, tab, doc }),
    [role, q, customerId, tab, doc]
  );

  const customers = usePaged(
    async (cursor) => {
      if (!allowed) return { rows: [] };
      const r = await searchBillingCustomers({ q: q || undefined, limit: PAGE, cursor });
      return { rows: r.customers || [], nextCursor: r.nextCursor };
    },
    `${allowed}|${q}`,
    custPages
  );
  const listed = (customers.data?.rows || []).find((c) => c.id === customerId) || null;
  // A customer opened from a link may not be on the current search page: look it up by its id.
  const direct = useAdminData(
    async () =>
      allowed && customerId && !listed && !customers.loading
        ? (await searchBillingCustomers({ q: customerId, limit: 1 })).customers?.[0] || null
        : null,
    [allowed, customerId, Boolean(listed), customers.loading]
  );
  const customer = listed || direct.data;

  const docs = usePaged(
    async (cursor) => {
      if (!allowed || !customerId) return { rows: [] };
      if (tab === 'receipts') {
        const r = await listReceipts({ customerId, limit: PAGE, cursor });
        return { rows: r.receipts || [], nextCursor: r.nextCursor };
      }
      const r = await listInvoices({ customerId, limit: PAGE, cursor });
      return { rows: r.invoices || [], nextCursor: r.nextCursor };
    },
    `${allowed}|${customerId}|${tab}`,
    docPages
  );

  if (!billingV2Enabled()) {
    return (
      <Restricted
        data={data}
        message="Billing v2 is switched off in this build (VITE_BILLING_V2)."
      />
    );
  }
  if (role !== 'super') {
    return <Restricted data={data} message="Customer billing is for Super Admins." />;
  }

  const custRows = customers.data?.rows || [];
  const docRows = docs.data?.rows || [];

  return (
    <AdminFrame data={data} title="Billing">
      <div className="flex min-w-0 flex-col gap-[24px]">
        <AgencyPageHero
          title="Billing"
          subtitle="Find a customer and read their invoices and receipts as they see them. Read-only; every search and lookup goes in the audit log."
          actions={
            <AgencyButton onClick={() => (customerId ? docs.reload() : customers.reload())}>
              Refresh
            </AgencyButton>
          }
        />

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            data.update({ q: draft.trim() || null, customer: null, tab: null, doc: null });
          }}
          className="flex flex-wrap items-end gap-[12px] rounded-[20px] border border-solid border-[#e1eae2] bg-white p-[16px]"
        >
          <div className="min-w-0 flex-1 basis-[240px]">
            <TextInput
              label="Find a customer"
              placeholder="Start of an email, or a customer / user / organisation id"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="h-[46px] cursor-pointer rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[15px] font-bold text-white"
          >
            Search
          </button>
          {q ? (
            <button
              type="button"
              onClick={() => data.update({ q: null, customer: null, tab: null, doc: null })}
              className="h-[46px] cursor-pointer rounded-[10px] border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[14px] font-semibold text-[#595959]"
            >
              Clear
            </button>
          ) : null}
        </form>

        <PublicCard
          title={q ? `Customers matching “${q}”` : 'Newest billing customers'}
          hint={
            customers.data ? `${custRows.length}${customers.data.hasMore ? '+' : ''} shown` : ''
          }
        >
          {customers.loading || customers.error ? (
            <AdminLoadNotice
              loading={customers.loading}
              error={customers.error}
              status={customers.status}
              onRetry={customers.reload}
            />
          ) : custRows.length === 0 ? (
            <p className="m-0 font-sans text-[14px] text-[#737373]">
              {q
                ? 'No billing customer matches that. Emails match from the start.'
                : 'No billing customers yet.'}
            </p>
          ) : (
            <BillingTable
              label="Billing customers"
              columns={['Customer', 'Invoices', 'Owes', 'Last invoice', 'Customer since']}
              numeric={[1, 2]}
              rows={custRows.map((c) => ({
                id: c.id,
                selected: c.id === customerId,
                onOpen: () => data.update({ customer: c.id, tab: null, doc: null }),
                cells: [
                  <span key="e" className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold text-[#1c2a21]">{c.email}</span>
                    <span className="text-[12px] text-[#737373]">
                      {c.organizationId ? 'Organisation billing' : 'Personal billing'} ·{' '}
                      {c.currency}
                      {c.active ? '' : ' · inactive'}
                    </span>
                  </span>,
                  c.invoices.toLocaleString('en-GB'),
                  owed(c) ? (
                    <span key="o" className="font-semibold text-[#8a6512]">
                      {owed(c)}
                    </span>
                  ) : (
                    '—'
                  ),
                  c.lastInvoiceAt ? formatDate(c.lastInvoiceAt) : '—',
                  formatDate(c.createdAt),
                ],
              }))}
            />
          )}
          {customers.data?.hasMore ? (
            <div className="mt-[12px]">
              <AgencyButton size="xs" onClick={() => setCustPages((n) => n + 1)}>
                Load more
              </AgencyButton>
            </div>
          ) : null}
        </PublicCard>

        {customerId ? (
          <PublicCard
            title={customer ? customer.email : 'Customer'}
            hint={
              customer ? `${customer.invoices} invoice${customer.invoices === 1 ? '' : 's'}` : ''
            }
            headerExtra={
              <button
                type="button"
                onClick={() => data.update({ customer: null, tab: null, doc: null })}
                className="cursor-pointer border-0 bg-transparent font-sans text-[13px] font-semibold text-[#387440]"
              >
                Close
              </button>
            }
          >
            <div className="flex min-w-0 flex-col gap-[16px]">
              {customer ? (
                <dl className="m-0 grid grid-cols-1 gap-x-[24px] gap-y-[6px] font-sans text-[13px] sm:grid-cols-2">
                  {[
                    ['Billing customer', customer.id],
                    ['User', customer.userId],
                    ['Entity', customer.entityId],
                    ['Organisation', customer.organizationId || 'None (personal)'],
                    ['Owes now', owed(customer) || 'Nothing'],
                    ['Customer since', formatDate(customer.createdAt)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex min-w-0 gap-[8px]">
                      <dt className="shrink-0 text-[#737373]">{k}</dt>
                      <dd className="m-0 min-w-0 truncate font-mono text-[12.5px] text-[#1c2a21]">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <Tabs
                label="Documents"
                value={tab}
                options={[
                  { id: 'invoices', label: 'Invoices' },
                  { id: 'receipts', label: 'Receipts' },
                ]}
                onChange={(id) => data.update({ tab: id === 'invoices' ? null : id, doc: null })}
              />
              {docs.loading || docs.error ? (
                <AdminLoadNotice
                  loading={docs.loading}
                  error={docs.error}
                  status={docs.status}
                  onRetry={docs.reload}
                />
              ) : docRows.length === 0 ? (
                <p className="m-0 font-sans text-[14px] text-[#737373]">
                  {tab === 'receipts'
                    ? 'No receipts yet.'
                    : 'No invoices yet (drafts aren’t shown).'}
                </p>
              ) : tab === 'invoices' ? (
                <BillingTable
                  label="Invoices"
                  columns={['Invoice', 'Period', 'Status', 'Total', 'Tax', 'Paid on']}
                  numeric={[3, 4]}
                  rows={docRows.map((i) => ({
                    id: i.id,
                    selected: doc === `inv:${i.id}`,
                    onOpen: () => data.update({ doc: `inv:${i.id}` }),
                    cells: [
                      <span key="n" className="font-semibold text-[#1c2a21]">
                        {i.number || 'Not numbered'}
                      </span>,
                      i.periodStart
                        ? `${formatDate(i.periodStart)} – ${formatDate(i.periodEnd)}`
                        : '—',
                      <StatusChip key="s" status={i.status} />,
                      formatMoney(i.total, i.currency),
                      formatMoney(i.tax, i.currency),
                      i.paidAt
                        ? formatDate(i.paidAt)
                        : i.status === 'open' && i.dueDate
                          ? `Due ${formatDate(i.dueDate)}`
                          : '—',
                    ],
                  }))}
                />
              ) : (
                <BillingTable
                  label="Receipts"
                  columns={['Receipt', 'Issued', 'Method', 'Amount', 'Status']}
                  numeric={[3]}
                  rows={docRows.map((r) => ({
                    id: r.id,
                    selected: doc === `rct:${r.id}`,
                    onOpen: () => data.update({ doc: `rct:${r.id}` }),
                    cells: [
                      <span key="n" className="font-semibold text-[#1c2a21]">
                        {r.number}
                      </span>,
                      formatDate(r.issuedAt),
                      methodLabel(r.method) || '—',
                      formatMoney(r.amount, r.currency),
                      r.status === 'voided' ? 'Voided' : 'Issued',
                    ],
                  }))}
                />
              )}
              {docs.data?.hasMore ? (
                <div>
                  <AgencyButton size="xs" onClick={() => setDocPages((n) => n + 1)}>
                    Load more
                  </AgencyButton>
                </div>
              ) : null}
            </div>
          </PublicCard>
        ) : null}
      </div>
      {customerId && doc ? (
        <AdminBillingDocDialog
          key={doc}
          doc={doc}
          customerId={customerId}
          onClose={() => data.update({ doc: null })}
        />
      ) : null}
    </AdminFrame>
  );
};

export default AdminBillingPage;
