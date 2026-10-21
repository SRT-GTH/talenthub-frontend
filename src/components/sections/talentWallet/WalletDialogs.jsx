import { useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { TOPUP, WITHDRAW } from './walletData.js';
import TopUpDialogs from './TopUpDialogs.jsx';
import WithdrawDialogs from './WithdrawDialogs.jsx';
import ReceiptDrawer from './ReceiptDrawer.jsx';
import ActivatedDialog from './WalletActivated.jsx';
import RedeemDialog from './RedeemDialog.jsx';
import AlmostThereDialog from './AlmostThereDialog.jsx';
import { ParentRequestDialog } from './WalletUnder18.jsx';
import { ScoreDialog } from './WalletCredit.jsx';
import WalletToast from './WalletToasts.jsx';

const log = debug('WalletDialogs');

/*
 * WalletDialogs — mounts whichever Wallet dialog the URL names (`?view=topup|withdraw`, `&tx=<id>` = the receipt drawer) and keeps the form values that must
 * survive between steps (top-up amount + method, withdraw amount + destination). Closing removes the view from the URL, leaving
 * the page behind.
 * Props: wallet (useTalentWalletState()).
 */
const WalletDialogs = ({ wallet }) => {
  const [topAmount, setTopAmount] = useState(TOPUP.defaultAmount);
  const [topMethod, setTopMethod] = useState('momo');
  const [wdAmount, setWdAmount] = useState(WITHDRAW.defaultAmount);
  const [wdDest, setWdDest] = useState('momo');
  const close = () => {
    log('close dialog', { view: wallet.view, step: wallet.step });
    wallet.update({ view: null, step: null });
  };
  log('render', { view: wallet.view, step: wallet.step });

  let dialog = null;
  if (wallet.view === 'topup') {
    dialog = (
      <TopUpDialogs
        wallet={wallet}
        money={{
          amount: topAmount,
          setAmount: setTopAmount,
          method: topMethod,
          setMethod: setTopMethod,
        }}
        onClose={close}
      />
    );
  } else if (wallet.view === 'withdraw') {
    dialog = (
      <WithdrawDialogs
        wallet={wallet}
        money={{ amount: wdAmount, setAmount: setWdAmount, dest: wdDest, setDest: setWdDest }}
        onClose={close}
      />
    );
  } else if (wallet.modal === 'redeem') dialog = <RedeemDialog wallet={wallet} />;
  else if (wallet.modal === 'score') dialog = <ScoreDialog wallet={wallet} />;
  else if (wallet.modal === 'parent') dialog = <ParentRequestDialog wallet={wallet} />;
  else if (wallet.modal === 'redeem-short') dialog = <AlmostThereDialog wallet={wallet} />;
  else if (wallet.state === 'activated' && wallet.modal !== 'closed')
    dialog = <ActivatedDialog wallet={wallet} />;
  else if (wallet.tx) dialog = <ReceiptDrawer txId={wallet.tx} wallet={wallet} />;

  return (
    <>
      {dialog}
      {wallet.toast ? <WalletToast kind={wallet.toast} wallet={wallet} /> : null}
    </>
  );
};

export default WalletDialogs;
