import { useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { WalletMethodCardIcon, WalletMethodPhoneIcon } from '../../shared/assets.jsx';
import spotWithdraw from '../../../assets/talent-wallet/spot-withdraw.svg';
import spotSecurePin from '../../../assets/talent-wallet/spot-secure-pin.svg';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { WITHDRAW } from './walletData.js';
import { formatAmount, parseAmount } from './walletMoney.js';
import {
  AmountField,
  ModalButtons,
  ModalHead,
  OptionList,
  QuickChips,
  WalletModal,
} from './WalletDialogParts.jsx';
import { WalletButton } from './walletUi.jsx';

const log = debug('WithdrawDialogs');

const GLYPHS = { phone: WalletMethodPhoneIcon, card: WalletMethodCardIcon };
const DESTINATIONS = WITHDRAW.destinations.map((d) => ({ ...d, icon: GLYPHS[d.glyph] }));
const PIN_LENGTH = 4;

/* 4 digit boxes (56 x 60, r12): filled digit = #387455 1px border, the box being typed = 2px #d9dcd3, empty = 1px #d9dcd3. */
const PinInput = ({ value, onChange, labelId }) => {
  const refs = useRef([]);
  const focusAt = (i) => refs.current[Math.max(0, Math.min(PIN_LENGTH - 1, i))]?.focus();
  return (
    <div role="group" aria-labelledby={labelId} className="flex gap-[10px]">
      {Array.from({ length: PIN_LENGTH }, (_, i) => {
        const filled = i < value.length;
        const next = i === value.length;
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={1}
            aria-label={`PIN digit ${i + 1}`}
            value={filled ? value[i] : ''}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, '').slice(-1);
              if (!d) return;
              const nextValue = (value.slice(0, i) + d + value.slice(i + 1)).slice(0, PIN_LENGTH);
              log('pin digit entered', { count: nextValue.length });
              onChange(nextValue);
              focusAt(i + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault();
                onChange(value.slice(0, Math.max(0, filled ? i : value.length - 1)));
                focusAt(i - (filled ? 0 : 1));
              }
            }}
            className={classNames(
              'box-border h-[60px] w-[56px] rounded-[12px] border-solid bg-white p-0 text-center font-sans text-[24px] font-semibold leading-[1.2] text-[#1c2a21] outline-none',
              FOCUS_RING,
              filled
                ? 'border border-[#387455]'
                : next
                  ? 'border-2 border-[#d9dcd3]'
                  : 'border border-[#d9dcd3]'
            )}
          />
        );
      })}
    </div>
  );
};

/*
 * Withdraw flow (Figma W-10 "Amount and destination" 8820:4273 / 8820:469671, W-11 "Confirm with PIN" 8820:5666 / 8820:471054).
 * Opened by `?view=withdraw` (&step=amount|pin) over the Wallet page. Mock only: any 4 digits are accepted, nothing is sent.
 * Props: wallet (useTalentWalletState()), money ({ amount, setAmount, dest, setDest }) held by WalletDialogs, onClose.
 */
const WithdrawDialogs = ({ wallet, money, onClose }) => {
  const uid = useId();
  // W-11 is drawn with two digits already typed; a direct visit to ?step=pin reproduces that frame (mock digits).
  const [pin, setPin] = useState(() => (wallet.step === 'pin' ? '00' : ''));
  const amountNum = parseAmount(money.amount);
  const dest = DESTINATIONS.find((d) => d.id === money.dest) ?? DESTINATIONS[0];
  const valid =
    Number.isFinite(amountNum) && amountNum > dest.fee && amountNum <= WITHDRAW.available;
  const shown = formatAmount(amountNum) || money.amount;
  const activeQuick = WITHDRAW.quick.find((q) => parseAmount(q.value) === amountNum)?.id;
  log('render', { step: wallet.step, amount: money.amount, valid, dest: dest.id });

  if (wallet.step === 'pin') {
    const rows = [
      shown ? `GHS ${shown}` : '',
      `GHS ${formatAmount(dest.fee)}`,
      `GHS ${formatAmount(amountNum - dest.fee)}`,
      dest.arrives,
    ];
    return (
      <WalletModal width="max-w-[480px]" gaps={[16, 16]} labelledBy={`${uid}-t`} onClose={onClose}>
        <ModalHead
          id={`${uid}-t`}
          title={WITHDRAW.pin.title}
          subtitle={WITHDRAW.pin.subtitle(shown, dest.to)}
          art={spotSecurePin}
          onClose={onClose}
        />
        <dl className="m-0 flex flex-col gap-[8px] rounded-[16px] bg-[#f4f7f2] p-[16px] font-sans text-[14px] leading-[1.2] playful:gap-[16px]">
          {WITHDRAW.pin.summary.map((label, i) => (
            <div key={label} className="flex justify-between gap-[12px] whitespace-nowrap">
              <dt className="text-[#575755]">{label}</dt>
              <dd className="m-0 font-semibold text-[#1c2a21]">{rows[i]}</dd>
            </div>
          ))}
        </dl>
        <div className="contents">
          <p
            id={`${uid}-pin`}
            className="m-0 font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]"
          >
            {WITHDRAW.pin.label}
          </p>
          <PinInput value={pin} onChange={setPin} labelId={`${uid}-pin`} />
          <button
            type="button"
            onClick={() => log('forgot PIN (selfie reset is a later phase)')}
            className={classNames(
              'min-h-[24px] w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[13px] font-semibold leading-[1.2] text-[#387440]',
              FOCUS_RING
            )}
          >
            {WITHDRAW.pin.forgot}
          </button>
        </div>
        <ModalButtons>
          <WalletButton onClick={() => wallet.update({ view: 'withdraw', step: 'amount' })}>
            {WITHDRAW.pin.back}
          </WalletButton>
          <WalletButton
            tone="primary"
            onClick={() => {
              // Figma prototype: "Withdraw GHS 300" navigates back (closes the dialog); the drawn button is enabled with two digits typed.
              log('withdraw confirmed (mock, nothing is sent)', {
                amount: amountNum,
                dest: dest.id,
              });
              wallet.update({ view: null, step: null });
            }}
          >
            {WITHDRAW.pin.confirm(shown.replace(/\.00$/, ''))}
          </WalletButton>
        </ModalButtons>
      </WalletModal>
    );
  }

  return (
    <WalletModal gaps={[14, 18]} labelledBy={`${uid}-t`} onClose={onClose}>
      <ModalHead
        id={`${uid}-t`}
        title={WITHDRAW.title}
        subtitle={WITHDRAW.subtitle}
        art={spotWithdraw}
        onClose={onClose}
      />
      <AmountField
        value={money.amount}
        invalid={!valid}
        hint={WITHDRAW.hint}
        onChange={money.setAmount}
        onBlur={() => Number.isFinite(amountNum) && money.setAmount(formatAmount(amountNum))}
      />
      <QuickChips
        items={WITHDRAW.quick}
        active={activeQuick}
        onPick={(c) => money.setAmount(c.value)}
      />
      <OptionList
        label={WITHDRAW.sendTo}
        options={DESTINATIONS}
        value={dest.id}
        onChange={money.setDest}
      />
      <button
        type="button"
        onClick={() => log('add a new account (no screen is drawn for it)')}
        className={classNames(
          'min-h-[24px] w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[14px] font-semibold leading-[1.2] text-[#387440]',
          FOCUS_RING
        )}
      >
        {WITHDRAW.addAccount}
      </button>
      <ModalButtons>
        <WalletButton onClick={onClose}>{WITHDRAW.cancel}</WalletButton>
        <WalletButton
          tone="primary"
          aria-disabled={!valid || undefined}
          className={valid ? '' : 'cursor-not-allowed opacity-60'}
          onClick={() => {
            if (!valid) {
              log('blocked: invalid amount', money.amount);
              return;
            }
            log('continue -> pin', { amount: amountNum, dest: dest.id });
            wallet.update({ view: 'withdraw', step: 'pin' });
          }}
        >
          {WITHDRAW.next}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default WithdrawDialogs;
