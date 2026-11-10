import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { WalletCheckCircleIcon, WalletCloseIcon } from '../../shared/assets.jsx';
import spotReceipt from '../../../assets/talent-wallet/spot-receipt.svg';
import receiptLogo from '../../../assets/talent-wallet/receipt-gth-logo.png';
import tornEdge from '../../../assets/talent-wallet/receipt-torn-edge.svg';
import dashedRule from '../../../assets/talent-wallet/receipt-dashed-rule.svg';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { HEADING } from './walletUi.jsx';
import {
  formatDate,
  formatMoney,
  getReceipt,
  methodLabel,
  taxLabel,
} from '../../../services/billing.api.js';

const log = debug('BillingReceiptDrawer');

const Rule = () => <img src={dashedRule} alt="" className="block h-[1.5px] w-full" />;

const Line = ({ label, value, strong = false }) => (
  <div className="flex justify-between gap-[12px]">
    <dt className="leading-[17px] text-[#575755]">{label}</dt>
    <dd
      className={classNames(
        'm-0 text-right leading-[17px] text-[#1c2a21]',
        strong && 'font-semibold'
      )}
    >
      {value}
    </dd>
  </div>
);

/*
 * BillingReceiptDrawer - a payment receipt from billing (GET /api/billing/receipts/:id, VITE_BILLING_V2=1), drawn like the
 * W-13 wallet receipt: brand row, amount paid, what it paid for, the VAT / NHIL / GETFund breakdown, total, reference.
 * Opened from Transactions with `&tx=rct:<receiptId>`; Esc / scrim / × close it.
 */
const BillingReceiptDrawer = ({ receiptId, wallet }) => {
  const uid = useId();
  const ref = useRef(null);
  const [state, setState] = useState({ status: 'loading', receipt: null });
  const close = () => {
    log('close');
    wallet.update({ tx: null });
  };
  usePlayfulDialogA11y({ open: true, dialogRef: ref, onEscape: close, lockScroll: true });

  useEffect(() => {
    let live = true;
    getReceipt(receiptId)
      .then((receipt) => live && setState({ status: 'ready', receipt }))
      .catch((err) => {
        log('load failed', err?.response?.status || err?.message);
        if (live) setState({ status: 'error', receipt: null });
      });
    return () => {
      live = false;
    };
  }, [receiptId]);

  const r = state.receipt;
  const inv = r && r.invoice;
  const cur = (r && r.currency) || 'GHS';

  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[70] flex justify-end bg-[rgba(28,42,33,0.55)]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        tabIndex={-1}
        className="flex h-full w-full max-w-[520px] flex-col gap-[18px] overflow-y-auto bg-[#f8f8f4] px-[clamp(16px,1.85vw,32px)] pb-[24px] pt-[28px] outline-none"
      >
        <div className="flex items-center justify-between">
          <h2
            id={`${uid}-t`}
            className={classNames(HEADING, 'm-0 text-[24px] leading-[1.25] text-[#1c2a21]')}
          >
            Receipt
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={classNames(
              'flex size-[36px] cursor-pointer items-center justify-center rounded-full border-0 bg-white p-0 text-[#595959]',
              FOCUS_RING
            )}
          >
            <WalletCloseIcon className="size-[16px]" />
          </button>
        </div>

        {state.status === 'loading' && (
          <p className="m-0 font-sans text-[14px] text-[#575755]">Loading your receipt…</p>
        )}
        {state.status === 'error' && (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#b3261e]">
            We couldn’t open this receipt. Try again in a moment.
          </p>
        )}

        {r && (
          <div className="flex flex-col drop-shadow-[0_6px_16px_rgba(28,42,33,0.08)]">
            <div className="flex flex-col gap-[20px] rounded-t-[20px] bg-white px-[26px] pb-[22px] pt-[24px]">
              <div className="flex items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[10px]">
                  <img src={receiptLogo} alt="" className="h-[37px] w-[40px] object-contain" />
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                      Ghana Talent Hub
                    </span>
                    <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">
                      Payment receipt
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end whitespace-nowrap font-sans text-[12px] leading-[1.2] text-[#575755]">
                  <span className="font-semibold">{r.number}</span>
                  <span>{formatDate(r.paidAt || r.issuedAt)}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-[12px] rounded-[16px] bg-[#eef6f0] p-[18px]">
                <img src={spotReceipt} alt="" className="size-[72px]" />
                <p className="m-0 font-sans text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.72px] text-[#387440]">
                  Amount paid
                </p>
                <p
                  className={classNames(
                    HEADING,
                    'm-0 text-[36px] leading-[1.15] tracking-[-0.72px] text-[#1c2a21]'
                  )}
                >
                  {formatMoney(r.amount, cur)}
                </p>
                <span className="inline-flex items-center gap-[6px] rounded-full border-[1.5px] border-solid border-[#387440] px-[12px] py-[5px] font-sans text-[12px] font-semibold leading-[1.2] text-[#387440]">
                  <WalletCheckCircleIcon className="size-[14px] text-[#387440]" />
                  {r.status === 'voided' ? 'Voided' : 'Paid'}
                </span>
              </div>

              <Rule />
              <dl className="m-0 flex flex-col gap-[16px] font-sans text-[14px] leading-[1.2]">
                {inv
                  ? inv.lines.map((l, i) => (
                      <Line key={i} label={l.description} value={formatMoney(l.amount, cur)} />
                    ))
                  : null}
                {inv && <Line label="Invoice" value={inv.number || '-'} />}
                {r.method && <Line label="Method" value={methodLabel(r.method)} />}
              </dl>
              {inv && inv.taxBreakdown.length > 0 && (
                <>
                  <Rule />
                  <dl
                    className="m-0 flex flex-col gap-[12px] font-sans text-[14px] leading-[1.2]"
                    aria-label="Tax breakdown"
                  >
                    <Line
                      label="Before tax"
                      value={formatMoney(inv.subtotal - (inv.discount || 0), cur)}
                    />
                    {inv.taxBreakdown.map((t) => (
                      <Line
                        key={t.code || t.label}
                        label={taxLabel(t)}
                        value={formatMoney(t.amount, cur)}
                      />
                    ))}
                  </dl>
                </>
              )}
              <Rule />
              <div className="flex items-center justify-between whitespace-nowrap">
                <span className="font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
                  Total paid
                </span>
                <span className={classNames(HEADING, 'text-[20px] leading-[1.25] text-[#387440]')}>
                  {formatMoney(r.amount, cur)}
                </span>
              </div>
              {r.unapplied > 0 && (
                <p className="m-0 font-sans text-[12px] leading-[1.3] text-[#575755]">
                  {formatMoney(r.unapplied, cur)} of this payment is held as credit on your account.
                </p>
              )}
              {r.reference && (
                <>
                  <Rule />
                  <p className="m-0 text-center font-['DM_Mono',monospace] text-[13px] font-medium leading-[1.2] tracking-[0.52px] text-[#1c2a21]">
                    {r.reference}
                  </p>
                </>
              )}
            </div>
            <img src={tornEdge} alt="" aria-hidden="true" className="block h-[12px] w-full" />
          </div>
        )}

        <p className="m-0 font-sans text-[12px] leading-[1.2] text-[#575755]">
          Ghana Talent Hub · Accra. This receipt is proof of payment. Prices include VAT, NHIL and
          GETFund as shown.
        </p>
      </aside>
    </div>,
    document.body
  );
};

export default BillingReceiptDrawer;
