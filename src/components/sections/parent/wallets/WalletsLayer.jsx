import { useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentToast from '../wards/dialogs/ParentToast.jsx';
import { focusAfterRender } from '../focusAfterRender.js';
import ApproveDialog from './dialogs/ApproveDialog.jsx';
import DeclineDialog from './dialogs/DeclineDialog.jsx';
import LimitsDialog from './dialogs/LimitsDialog.jsx';
import OpenWalletDialog from './dialogs/OpenWalletDialog.jsx';
import { TopUpDialog, TopUpFailedDialog, TopUpPhoneDialog } from './dialogs/TopUpDialogs.jsx';
import { useWallets, walletsActions } from './walletsStore.js';
import {
  DEFAULT_DECLINE_NOTE,
  DEFAULT_TOP_UP,
  DEFAULT_TOP_UP_NOTE,
  TOASTS,
} from './data/walletsData.js';

const log = debug('WalletsLayer');

/*
 * WalletsLayer — the dialogs, toasts and frame-URL seeds of the Ward wallets flow (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 08 Ward wallets" 10057:66889, wiki/parent-wallets.md). Mounted by
 * /parent/wallets (ParentWalletsPage) and by the ward page while its Wallet tab shows (ParentWardPage), over the same store, so both screens agree. URLs (extra query keys are kept):
 *   (none)                                   PWa-01  10034:151435  the page · PW-12 10057:66907 is the ward page's Wallet tab (?tab=wallet on /parent/wards/abena)
 *   ?modal=approve                           PWa-02  10034:152108  "Approve GHS 90.00 for Abena?"
 *   ?modal=approve-error                     PWa-02c 10077:19347  the same with "Your approval didn’t go through"
 *   ?toast=approved                          PWa-03  10042:530    the page after approving (balance GHS 0.00 · 130 Cycles, row "You approved…") + "Payment approved"
 *   ?modal=decline[&wreason=talk&wnote=…]    PWa-04  10042:973    "Decline Abena’s GHS 90 payment?"
 *   ?toast=declined                          PWa-04b 10056:3754   the page after declining + "Payment declined" (Undo)
 *   ?view=expired                            PWa-07  10053:2607   "Request expired" (no toast)
 *   ?modal=limits                            PWa-05  10042:2958   "Abena’s limits"        ?toast=limits-saved   PWa-05b 10056:4078
 *   ?modal=topup[&wamount=50&wnote=…]        PWa-06  10053:530    "Top up Abena’s wallet"
 *   ?modal=topup-phone[&wamount=50]          PWa-06b 10056:155603 "Approve on your phone"
 *   ?toast=topup-done                        PWa-06c 10056:155946 balance GHS 135.00 + "GHS 50.00 sent to Abena"
 *   ?modal=topup-error[&wamount=50]          PWa-06d 10077:19695  "Top up didn’t go through"
 *   ?modal=open-wallet                       PWa-08  10053:2986   "Elliot wants a Starter wallet"
 *   ?toast=elliot-open                       PWa-08b 10056:156342 Elliot’s card open + "Elliot’s wallet is open"
 * Real flow: Approve -> store pays (cash first, then Cycles) -> toast; Decline (also from the approve dialog) -> note -> toast with Undo; Top up -> "Approve on your phone" -> "I’ve approved it" -> balance + toast;
 * Save limits -> toast; Open Elliot’s wallet -> his card + toast. The wallet params are all `modal`, `view`, `toast` (own values only) and `w…` drafts, so the ward page keeps its own `modal` values.
 * Props: ward (the Abena wardsData entry), openWalletFor (Elliot wardsData entry, only on the wallets page).
 */
const OWN_MODALS = [
  'approve',
  'approve-error',
  'decline',
  'limits',
  'topup',
  'topup-phone',
  'topup-error',
  'open-wallet',
];
const OWN_TOASTS = ['approved', 'declined', 'limits-saved', 'topup-done', 'elliot-open'];
const DRAFT_KEYS = ['wamount', 'wnote', 'wreason'];

const WalletsLayer = ({ ward, openWalletFor }) => {
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const seeded = useRef(false);
  const wallets = useWallets();
  const wallet = wallets.abena;
  const modal = OWN_MODALS.includes(params.get('modal')) ? params.get('modal') : null;
  const draftAmount = Number(params.get('wamount')) || DEFAULT_TOP_UP;
  const draftNote = params.get('wnote') ?? DEFAULT_TOP_UP_NOTE;

  // Frame URLs: apply the drawn state before the first paint.
  useLayoutEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const view = params.get('view');
    const seedToast = params.get('toast');
    if (view === 'expired') walletsActions.ensureExpired();
    if (view === 'approved' || seedToast === 'approved') walletsActions.ensureApproved();
    if (view === 'declined' || seedToast === 'declined')
      walletsActions.ensureDeclined(params.get('wnote') ?? DEFAULT_DECLINE_NOTE);
    if (seedToast === 'topup-done') walletsActions.ensureToppedUp(DEFAULT_TOP_UP);
    if (view === 'elliot-open' || seedToast === 'elliot-open') walletsActions.ensureOpened();
    if (seedToast === 'approved') setToast(TOASTS.approved(ward));
    if (seedToast === 'declined')
      setToast({
        ...TOASTS.declined(ward, params.get('wnote') ?? DEFAULT_DECLINE_NOTE),
        onAction: walletsActions.undoDecline,
      });
    if (seedToast === 'limits-saved') setToast(TOASTS.limits(ward, wallet.limits));
    if (seedToast === 'topup-done')
      setToast(TOASTS.topUp(ward, DEFAULT_TOP_UP, wallets.abena.balance + DEFAULT_TOP_UP));
    if (seedToast === 'elliot-open' && openWalletFor) setToast(TOASTS.openWallet(openWalletFor));
    log('seeds', { view, seedToast, modal });
  }, [params, ward, wallet.limits, wallets.abena.balance, openWalletFor, modal]);

  // Replace the dialog params (and optionally open another dialog) in one URL update.
  const go = (next, extra = {}) => {
    const p = new URLSearchParams(params);
    if (OWN_MODALS.includes(p.get('modal'))) p.delete('modal');
    DRAFT_KEYS.forEach((k) => p.delete(k));
    if (OWN_TOASTS.includes(p.get('toast'))) p.delete('toast');
    p.delete('view');
    if (next) p.set('modal', next);
    Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    setParams(p, { replace: true });
  };
  const close = () => go(null);

  return (
    <>
      {modal === 'approve' || modal === 'approve-error' ? (
        <ApproveDialog
          ward={ward}
          wallet={wallet}
          error={modal === 'approve-error'}
          onClose={close}
          onDecline={() => go('decline')}
          onApprove={() => {
            walletsActions.approve();
            close();
            focusAfterRender('main h1');
            setToast(TOASTS.approved(ward));
          }}
        />
      ) : null}

      {modal === 'decline' ? (
        <DeclineDialog
          ward={ward}
          request={wallet.request}
          initial={{
            reason: params.get('wreason') ?? undefined,
            note: params.get('wnote') ?? undefined,
          }}
          onClose={close}
          onConfirm={(note) => {
            walletsActions.decline(note);
            close();
            focusAfterRender('main h1');
            setToast({
              ...TOASTS.declined(ward, note),
              onAction: walletsActions.undoDecline,
            });
          }}
        />
      ) : null}

      {modal === 'limits' ? (
        <LimitsDialog
          ward={ward}
          limits={wallet.limits}
          onClose={close}
          onSave={(limits) => {
            walletsActions.setLimits(limits);
            close();
            setToast(TOASTS.limits(ward, limits));
          }}
        />
      ) : null}

      {modal === 'topup' ? (
        <TopUpDialog
          ward={ward}
          balance={wallet.balance}
          initial={{ amount: draftAmount, note: draftNote }}
          onClose={close}
          onSend={({ amount, note }) => go('topup-phone', { wamount: amount, wnote: note })}
        />
      ) : null}

      {modal === 'topup-phone' ? (
        <TopUpPhoneDialog
          amount={draftAmount}
          onClose={close}
          onDone={() => {
            walletsActions.topUp(draftAmount);
            close();
            setToast(TOASTS.topUp(ward, draftAmount, wallet.balance + draftAmount));
          }}
        />
      ) : null}

      {modal === 'topup-error' ? (
        <TopUpFailedDialog
          amount={draftAmount}
          onClose={close}
          onRetry={() => go('topup-phone', { wamount: draftAmount, wnote: draftNote })}
        />
      ) : null}

      {modal === 'open-wallet' && openWalletFor ? (
        <OpenWalletDialog
          ward={openWalletFor}
          cycles={wallets.elliot.cycles}
          onClose={close}
          onOpen={() => {
            walletsActions.openWallet();
            close();
            setToast(TOASTS.openWallet(openWalletFor));
          }}
        />
      ) : null}

      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </>
  );
};

export default WalletsLayer;
