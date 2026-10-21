import { useId } from 'react';
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
import { BARCODE_WIDTHS, RECEIPTS, RECEIPT_COPY, TRANSACTIONS } from './walletData.js';
import { HEADING, WalletButton } from './walletUi.jsx';
import { useRef } from 'react';

const log = debug('ReceiptDrawer');

const Rule = () => <img src={dashedRule} alt="" className="block h-[1.5px] w-full" />;

/* Barcode: 42 bars, 40px tall, 2px apart (Figma `barcode` 8849:463139, widths copied from the nodes). */
const Barcode = () => (
  <div aria-hidden="true" className="flex items-end gap-[2px]">
    {BARCODE_WIDTHS.map((w, i) => (
      <span key={i} className="block h-[40px] bg-[#1c2a21]" style={{ width: w }} />
    ))}
  </div>
);

/*
 * ReceiptDrawer — W-13 "Transaction detail (drawer)" (Playful 8820:7855 / Focused 8820:473223; Drawer 8820:8625): a 520px panel on
 * the right over the Transactions page, with a paper receipt (brand row, amount, line items, total, barcode) and the actions below.
 * Opened by `&tx=<id>`; Esc / scrim / × close it. Props: tx (id), wallet (useTalentWalletState()).
 */
const ReceiptDrawer = ({ txId, wallet }) => {
  const uid = useId();
  const ref = useRef(null);
  const tx = TRANSACTIONS.find((t) => t.id === txId && t.hasReceipt);
  const close = () => {
    log('close');
    wallet.update({ tx: null });
  };
  usePlayfulDialogA11y({ open: Boolean(tx), dialogRef: ref, onEscape: close, lockScroll: true });
  if (!tx) {
    log('branch: unknown transaction', txId);
    return null;
  }
  const r = RECEIPTS[tx.id];
  if (!r) return null;
  log('render', { tx: tx.id });

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
            {RECEIPT_COPY.title}
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

        <div className="flex flex-col drop-shadow-[0_6px_16px_rgba(28,42,33,0.08)]">
          <div className="flex flex-col gap-[20px] rounded-t-[20px] bg-white px-[26px] pb-[22px] pt-[24px]">
            <div className="flex items-center justify-between gap-[12px]">
              <div className="flex items-center gap-[10px]">
                <img src={receiptLogo} alt="" className="h-[37px] w-[40px] object-contain" />
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                    {RECEIPT_COPY.brand}
                  </span>
                  <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">
                    {RECEIPT_COPY.brandSub}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end whitespace-nowrap font-sans text-[12px] leading-[1.2] text-[#575755]">
                <span className="font-semibold">{r.no}</span>
                <span>{r.date}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[12px] rounded-[16px] bg-[#eef6f0] p-[18px]">
              <img src={spotReceipt} alt="" className="size-[72px]" />
              <p className="m-0 font-sans text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.72px] text-[#387440]">
                {RECEIPT_COPY.amountLabel}
              </p>
              <p
                className={classNames(
                  HEADING,
                  'm-0 text-[36px] leading-[1.15] tracking-[-0.72px] text-[#1c2a21]'
                )}
              >
                {r.amount}
              </p>
              <span className="inline-flex items-center gap-[6px] rounded-full border-[1.5px] border-solid border-[#387440] px-[12px] py-[5px] font-sans text-[12px] font-semibold leading-[1.2] text-[#387440]">
                <WalletCheckCircleIcon className="size-[14px] text-[#387440]" />
                {r.stamp}
              </span>
            </div>

            <Rule />
            <dl className="m-0 flex flex-col gap-[20px] font-sans text-[14px] leading-[1.2]">
              {RECEIPT_COPY.rows.map((label, i) => (
                <div key={label} className="flex justify-between gap-[12px]">
                  <dt className="leading-[17px] text-[#575755]">{label}</dt>
                  <dd className="m-0 text-right font-semibold leading-[17px] text-[#1c2a21]">
                    {r.values[i]}
                  </dd>
                </div>
              ))}
            </dl>
            <Rule />
            <div className="flex items-center justify-between whitespace-nowrap">
              <span className="font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
                {RECEIPT_COPY.total}
              </span>
              <span className={classNames(HEADING, 'text-[20px] leading-[1.25] text-[#387440]')}>
                {r.amount}
              </span>
            </div>
            <Rule />
            <div className="flex flex-col items-center gap-[8px]">
              <Barcode />
              <p className="m-0 font-['DM_Mono',monospace] text-[13px] font-medium leading-[1.2] tracking-[0.52px] text-[#1c2a21]">
                {r.reference}
              </p>
              <p className="m-0 font-sans text-[12px] font-semibold leading-[1.2] text-[#387440]">
                {RECEIPT_COPY.check}
              </p>
            </div>
          </div>
          <img src={tornEdge} alt="" aria-hidden="true" className="block h-[12px] w-full" />
        </div>

        <p className="m-0 font-sans text-[12px] leading-[1.2] text-[#575755]">
          {RECEIPT_COPY.legal}
        </p>
        <div className="flex flex-wrap justify-end gap-[12px]">
          <WalletButton
            tone="primary"
            onClick={() => log('download PDF (mock, nothing is downloaded)')}
          >
            {RECEIPT_COPY.actions.download}
          </WalletButton>
          <WalletButton onClick={() => log('share receipt (mock)')}>
            {RECEIPT_COPY.actions.share}
          </WalletButton>
        </div>
        <button
          type="button"
          onClick={() => log('report a problem (no screen is drawn for it)')}
          className={classNames(
            'min-h-[24px] w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[13px] font-semibold leading-[1.2] text-[#387440]',
            FOCUS_RING
          )}
        >
          {RECEIPT_COPY.report}
        </button>
      </aside>
    </div>,
    document.body
  );
};

export default ReceiptDrawer;
