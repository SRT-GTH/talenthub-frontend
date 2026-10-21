import { useId } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  WalletClockIcon,
  WalletMethodCardIcon,
  WalletMethodPhoneIcon,
} from '../../shared/assets.jsx';
import spotWallet from '../../../assets/talent-wallet/spot-wallet.svg';
import spotMobileMoney from '../../../assets/talent-wallet/spot-mobile-money.svg';
import spotReceipt from '../../../assets/talent-wallet/spot-receipt.svg';
import { TOPUP } from './walletData.js';
import { WALLET_BALANCE, formatAmount, parseAmount } from './walletMoney.js';
import {
  AmountField,
  ModalButtons,
  ModalHead,
  OptionList,
  QuickChips,
  WalletModal,
} from './WalletDialogParts.jsx';
import { HEADING, WalletButton } from './walletUi.jsx';
import { classNames } from '../../../utils/classNames.js';

const log = debug('TopUpDialogs');

const GLYPHS = { phone: WalletMethodPhoneIcon, card: WalletMethodCardIcon };
const METHODS = TOPUP.methods.map((m) => ({ ...m, icon: GLYPHS[m.glyph] }));

/*
 * Top up flow (Figma W-07 "Choose method" 8820:98 / 8820:465584, W-08 "Approve on your phone" 8820:1564 / 8820:466982,
 * W-09 "Success" 8820:2921 / 8820:468329). Opened by `?view=topup` (&step=method|approve|success) over the Wallet page.
 * Props: wallet (useTalentWalletState()), money ({ amount, setAmount, method, setMethod }) held by WalletDialogs so the amount
 * survives the three steps, onClose.
 */
const TopUpDialogs = ({ wallet, money, onClose }) => {
  const uid = useId();
  const amountNum = parseAmount(money.amount);
  const valid = Number.isFinite(amountNum) && amountNum >= TOPUP.minimum;
  const shown = formatAmount(amountNum) || money.amount;
  const activeQuick = TOPUP.quick.find((q) => parseAmount(q.value) === amountNum)?.id;
  log('render', { step: wallet.step, amount: money.amount, valid });

  if (wallet.step === 'approve') {
    return (
      <WalletModal width="max-w-[520px]" gaps={[16, 20]} labelledBy={`${uid}-t`} onClose={onClose}>
        <ModalHead
          id={`${uid}-t`}
          title={TOPUP.approve.title}
          subtitle={TOPUP.approve.subtitle}
          onClose={onClose}
        />
        <div className="flex flex-col items-center gap-[8px] rounded-[20px] bg-[#fff8e1] p-[20px]">
          <img src={spotMobileMoney} alt="" className="size-[104px]" />
          <p className={classNames(HEADING, 'm-0 text-[20px] leading-[1.25] text-[#1c2a21]')}>
            {TOPUP.approve.prompt}
          </p>
          <p className="m-0 text-center font-sans text-[13px] font-medium leading-[1.2] text-[#575755]">
            {TOPUP.approve.ref(shown)}
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <WalletClockIcon className="size-[16px] shrink-0 text-[#575755]" />
          <p
            role="status"
            className="m-0 font-sans text-[13px] font-semibold leading-[1.2] text-[#1c2a21]"
          >
            {TOPUP.approve.waiting}
          </p>
        </div>
        <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
          {TOPUP.approve.noPrompt}
        </p>
        <ModalButtons>
          <WalletButton onClick={onClose}>{TOPUP.approve.cancel}</WalletButton>
          <WalletButton
            tone="primary"
            onClick={() => {
              log('approved -> success');
              wallet.update({ step: 'success' });
            }}
          >
            {TOPUP.approve.done}
          </WalletButton>
        </ModalButtons>
      </WalletModal>
    );
  }

  if (wallet.step === 'success') {
    return (
      <WalletModal width="max-w-[480px]" gaps={[14, 14]} labelledBy={`${uid}-t`} onClose={onClose}>
        <ModalHead
          id={`${uid}-t`}
          title={TOPUP.success.title(shown)}
          subtitle={TOPUP.success.subtitle(formatAmount(WALLET_BALANCE + (amountNum || 0)))}
          onClose={onClose}
        />
        <div className="flex flex-col items-center gap-[6px] rounded-[18px] bg-[#eef6f0] p-[18px]">
          <img src={spotReceipt} alt="" className="size-[104px]" />
          <p className="m-0 text-center font-sans text-[13px] font-medium leading-[1.2] text-[#575755]">
            {TOPUP.success.from}
          </p>
        </div>
        <p className="m-0 self-start rounded-full bg-[#fff4d6] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2] text-[#967014]">
          {TOPUP.success.tip}
        </p>
        <ModalButtons>
          <WalletButton
            onClick={() => {
              // Figma prototype: "View receipt" → W-13 (the receipt drawer over Transactions)
              log('view receipt -> W-13');
              wallet.update({ view: null, step: null, tab: 'transactions', tx: 'stipend-sep' });
            }}
          >
            {TOPUP.success.receipt}
          </WalletButton>
          <WalletButton tone="primary" onClick={onClose}>
            {TOPUP.success.done}
          </WalletButton>
        </ModalButtons>
      </WalletModal>
    );
  }

  return (
    <WalletModal gaps={[14, 20]} labelledBy={`${uid}-t`} onClose={onClose}>
      <ModalHead
        id={`${uid}-t`}
        title={TOPUP.title}
        subtitle={TOPUP.subtitle}
        art={spotWallet}
        onClose={onClose}
      />
      <AmountField
        value={money.amount}
        invalid={!valid}
        hint={TOPUP.hint}
        onChange={money.setAmount}
        onBlur={() => Number.isFinite(amountNum) && money.setAmount(formatAmount(amountNum))}
      />
      <QuickChips
        items={TOPUP.quick}
        active={activeQuick}
        onPick={(c) => money.setAmount(c.value)}
      />
      <OptionList
        label={TOPUP.payFrom}
        options={METHODS}
        value={money.method}
        onChange={money.setMethod}
      />
      <ModalButtons>
        <WalletButton onClick={onClose}>{TOPUP.cancel}</WalletButton>
        <WalletButton
          tone="primary"
          aria-disabled={!valid || undefined}
          className={valid ? '' : 'cursor-not-allowed opacity-60'}
          onClick={() => {
            if (!valid) {
              log('blocked: amount below minimum', money.amount);
              return;
            }
            log('top up ->', { amount: amountNum, method: money.method });
            wallet.update({ view: 'topup', step: 'approve' });
          }}
        >
          {TOPUP.confirm(shown.replace(/\.00$/, ''))}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default TopUpDialogs;
