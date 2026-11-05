import { useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ChoiceChips from '../../../../ui/ChoiceChips.jsx';
import ParentButton from '../../ParentButton.jsx';
import ParentTextField from '../../ParentTextField.jsx';
import spotCoins from '../../../../../assets/parent/help-spot-salary.svg';
import spotPhone from '../../../../../assets/parent/wallets-spot-phone.svg';
import spotFailed from '../../../../../assets/parent/wallets-spot-failed.svg';
import hourglass from '../../../../../assets/parent/wallets-hourglass.svg';
import shieldRed from '../../../../../assets/parent/link-shield-red.svg';
import { PAY_FROM, TOP_UP_AMOUNTS, TOP_UP_COPY as C } from '../data/walletsData.js';

const log = debug('TopUpDialogs');

/*
 * TopUpDialogs — the three top-up dialogs of the Ward wallets flow, each 540 / 500 wide, p28, gap16, r24, an 80px spot art over the title (24/600) with the green-tone close beside it:
 *   TopUpDialog        PWa-06  10053:530   "Top up Abena’s wallet": amount chips (GHS 20 / 50 / 100 / Other), "Amount (GHS)*" with "Her balance will be GHS 135.00", "Pay from*" (MTN MoMo · 024 ••• 0192), "Note to Abena", Cancel + "Send GHS 50.00"
 *   TopUpPhoneDialog   PWa-06b 10056:155603 "Approve on your phone": the request text, a #f8f8f4 hourglass line, "Cancel top up" + "I’ve approved it"
 *   TopUpFailedDialog  PWa-06d 10077:19695 "Top up didn’t go through": the decline text, the red "Common reasons" callout, Cancel + "Try again"
 * Props — TopUpDialog: ward, balance (current wallet balance), initial { amount, note }, onClose, onSend({ amount, note }). TopUpPhoneDialog: amount, onClose (Cancel top up), onDone. TopUpFailedDialog: amount, onClose, onRetry.
 * ⚠️ ASSUMPTION: "Pay from" is the one saved MoMo number, so it is a read-only field; the mock never fails, so the failed dialog is only reached from its frame URL, and "Try again" goes back to "Approve on your phone".
 */
const Top = ({ art, onClose }) => (
  <div className="flex w-full items-start justify-between">
    <img src={art} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
    <DialogCloseButton onClose={onClose} />
  </div>
);

const Title = ({ children }) => (
  <h2 className="m-0 w-full text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
    {children}
  </h2>
);

const Buttons = ({ children }) => (
  <div className="flex w-full flex-wrap items-center justify-end gap-[12px]">{children}</div>
);

const toAmount = (s) => (String(s).trim() === '' ? NaN : Number(String(s).replace(/,/g, '')));

export const TopUpDialog = ({ ward, balance, initial, onClose, onSend }) => {
  const [amount, setAmount] = useState(String(initial.amount));
  const [note, setNote] = useState(initial.note);
  const [tried, setTried] = useState(false);
  const amountRef = useRef(null);
  const n = toAmount(amount);
  const bad = !(n > 0);
  const chip = TOP_UP_AMOUNTS.includes(n) ? String(n) : 'other';
  const title = C.title(ward);
  log('render', { amount });

  const send = () => {
    setTried(true);
    if (bad) {
      amountRef.current?.focus();
      return;
    }
    log('send', { amount: n });
    onSend?.({ amount: n, note: note.trim() });
  };

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={540}
      gap={16}
      focusCard={false}
      className="items-start"
    >
      <Top art={spotCoins} onClose={onClose} />
      <Title>{title}</Title>
      <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{C.intro}</p>
      <ChoiceChips
        label="Amount"
        value={chip}
        options={[
          ...TOP_UP_AMOUNTS.map((v) => ({ id: String(v), label: `GHS ${v}` })),
          { id: 'other', label: C.other },
        ]}
        onChange={(id) => {
          if (id === 'other') {
            setAmount('');
            amountRef.current?.focus();
          } else setAmount(String(Number(id)));
        }}
      />
      <ParentTextField
        ref={amountRef}
        label={C.amount}
        required
        inputMode="decimal"
        data-autofocus=""
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onBlur={() => !bad && setAmount(n.toFixed(2))}
        error={tried && bad ? C.amountError : undefined}
        helperText={bad ? C.amountHelper(balance) : C.amountHelper(balance + n)}
      />
      <ParentTextField
        label={C.payFrom}
        required
        readOnly
        value={PAY_FROM}
        helperText={C.payFromHelper}
      />
      <ParentTextField
        label={C.note(ward)}
        value={note}
        maxLength={200}
        helperText={C.noteHelper}
        onChange={(e) => setNote(e.target.value)}
      />
      <Buttons>
        <ParentButton variant="secondary" onClick={onClose}>
          {C.cancel}
        </ParentButton>
        <ParentButton onClick={send}>{C.send(bad ? 0 : n)}</ParentButton>
      </Buttons>
    </DialogCard>
  );
};

export const TopUpPhoneDialog = ({ amount, onClose, onDone }) => (
  <DialogCard label={C.phone.title} onClose={onClose} width={500} gap={16} className="items-start">
    <Top art={spotPhone} onClose={onClose} />
    <Title>{C.phone.title}</Title>
    <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{C.phone.body(amount)}</p>
    <div
      role="status"
      className="flex w-full items-center gap-[10px] rounded-[14px] bg-[#f8f8f4] p-[16px]"
    >
      <img src={hourglass} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
      <p className="m-0 text-[13px] leading-[16px] font-medium text-[#575755]">{C.phone.waiting}</p>
    </div>
    <Buttons>
      <ParentButton variant="secondary" onClick={onClose}>
        {C.phone.cancel}
      </ParentButton>
      <ParentButton onClick={onDone}>{C.phone.done}</ParentButton>
    </Buttons>
  </DialogCard>
);

export const TopUpFailedDialog = ({ amount, onClose, onRetry }) => (
  <DialogCard label={C.failed.title} onClose={onClose} width={500} gap={16} className="items-start">
    <Top art={spotFailed} onClose={onClose} />
    <Title>{C.failed.title}</Title>
    <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{C.failed.body(amount)}</p>
    <div
      role="alert"
      className="flex w-full items-start gap-[12px] rounded-[12px] border border-solid border-[#c0392b]/25 bg-[#fcece9] px-[16px] py-[14px]"
    >
      <img src={shieldRed} alt="" aria-hidden="true" className="mt-[1px] size-[18px]" />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="m-0 text-[14px] leading-[17px] font-semibold text-[#c0392b]">
          {C.failed.calloutTitle}
        </p>
        <p className="m-0 text-[13px] leading-[16px] text-[#1c2a21]/85">{C.failed.calloutBody}</p>
      </div>
    </div>
    <Buttons>
      <ParentButton variant="secondary" onClick={onClose}>
        {C.failed.cancel}
      </ParentButton>
      <ParentButton onClick={onRetry}>{C.failed.retry}</ParentButton>
    </Buttons>
  </DialogCard>
);
