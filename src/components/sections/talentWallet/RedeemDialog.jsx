import { useId, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { WalletBookIcon, WalletChartLineIcon, WalletWalletIcon } from '../../shared/assets.jsx';
import spotCycles from '../../../assets/talent-wallet/spot-cycles.svg';
import { REDEEM } from './walletCyclesData.js';
import { formatAmount } from './walletMoney.js';
import {
  ModalButtons,
  ModalHead,
  OptionList,
  WalletField,
  WalletModal,
} from './WalletDialogParts.jsx';
import { WalletButton } from './walletUi.jsx';

const log = debug('RedeemDialog');

const ICONS = { cash: WalletWalletIcon, tuition: WalletBookIcon, boost: WalletChartLineIcon };

/*
 * W-15 "Redeem Cycles (modal)" (Playful 8822:1914 / Focused 8823:1939; modal 8822:2789), URL `?tab=cycles&modal=redeem`.
 * Mock only: nothing is redeemed. Steps of 100, minimum 500, at most the 620 Cycles held.
 * Props: wallet (useTalentWalletState()).
 */
const RedeemDialog = ({ wallet }) => {
  const uid = useId();
  const [text, setText] = useState(REDEEM.defaultCycles);
  const [use, setUse] = useState('cash');
  const n = Number.parseInt(text, 10);
  const valid = Number.isFinite(n) && n >= REDEEM.min && n <= REDEEM.held && n % REDEEM.step === 0;
  const ghs = (Number.isFinite(n) ? n : 0) / REDEEM.perGhs;
  const options = REDEEM.options.map((o) => ({
    ...o,
    icon: ICONS[o.id],
    note: o.note(ghs, formatAmount),
  }));
  const close = () => {
    log('close');
    wallet.update({ modal: null });
  };
  log('render', { n, valid, use });

  return (
    <WalletModal gaps={[16, 16]} labelledBy={`${uid}-t`} onClose={close}>
      <ModalHead
        id={`${uid}-t`}
        title={REDEEM.title}
        subtitle={REDEEM.subtitle}
        art={spotCycles}
        onClose={close}
      />
      <WalletField
        label={REDEEM.field}
        inputMode="numeric"
        value={text}
        invalid={!valid}
        hint={REDEEM.hint}
        onChange={setText}
      />
      <OptionList
        label={REDEEM.use}
        options={options}
        value={use}
        onChange={setUse}
        radio={false}
      />
      <ModalButtons>
        <WalletButton onClick={close}>{REDEEM.cancel}</WalletButton>
        <WalletButton
          tone="primary"
          aria-disabled={!valid || undefined}
          className={valid ? '' : 'cursor-not-allowed opacity-60'}
          onClick={() => {
            if (!valid) {
              log('blocked: invalid Cycles', text);
              return;
            }
            // Figma prototype: "Redeem 600 Cycles" navigates back (closes the dialog)
            log('redeem (mock)', { cycles: n, use });
            close();
          }}
        >
          {REDEEM.confirm(Number.isFinite(n) ? n : 0)}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default RedeemDialog;
