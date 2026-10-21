import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('talentWalletState');

/*
 * Talent Wallet — mock state source (frontend-only; mock data only, swap for an API later and keep the shape).
 * Figma "Talent Wallet" (canvas 8817:693; Playful + "· Focused" twins; "· collapsed sidebar" twins of everything).
 * Every frame is a URL on `/wallet`. Phase 1 (Home, money in and out — W-06 … W-13) is built; the other keys are reserved so
 * every phase shares one hook.
 *
 *   /wallet                                  W-06  Wallet · Home (Overview tab)
 *   /wallet?view=topup                       W-07  Top up · Choose method        (&step=method, default)
 *   /wallet?view=topup&step=approve          W-08  Top up · Approve on your phone
 *   /wallet?view=topup&step=success          W-09  Top up · Success
 *   /wallet?view=withdraw                    W-10  Withdraw · Amount and destination   (&step=amount, default)
 *   /wallet?view=withdraw&step=pin           W-11  Withdraw · Confirm with PIN
 *   /wallet?tab=transactions                 W-12  Transactions · All
 *   /wallet?tab=transactions&tx=<id>         W-13  Transaction detail (drawer over W-12)
 *   /wallet?tab=transactions&filter=Money in  (All | Money in | Money out | Cycles | Pending) — chip state of W-12
 *   /wallet?rail=collapsed                   the "collapsed sidebar" twins (icon rail); default is the opened sidebar
 *   /wallet?help=1                           help pop-over of the talent shell
 *
 * Phase 2 (set-up and KYC, W-01 … W-05c):
 *   /wallet?state=new                        W-01  Wallet · Not set up yet
 *   /wallet?view=kyc[&step=card|address|selfie]   W-02 Step 1 · Ghana Card (default) · W-03 Step 2 · Proof of address · W-04 Step 3 · Selfie check
 *   /wallet?state=checking                   W-05  KYC submitted · Checking
 *   /wallet?state=retake                     W-05b KYC · Needs a new photo
 *   /wallet?state=activated                  W-05c Wallet activated (modal over the empty wallet home)
 * Phase 3 (Cycles, savings and under-18s, W-14 … W-18):
 *   /wallet?tab=cycles                       W-14  Cycles · Earned and spent       (&toast=cycles = W-14b Cycles earned toast)
 *   /wallet?tab=cycles&modal=redeem          W-15  Redeem Cycles (620 Cycles)      (&modal=redeem-short = W-15b "Almost there", 340 Cycles)
 *   /wallet?view=savings                     W-16  Savings pot · Laptop fund
 *   /wallet?state=under18                    W-17  Under 18 · Starter wallet       (&modal=parent = W-18 "Sent to Mrs Agyekum")
 * Phase 4 (Tuition financing, W-20 … W-24):
 *   /wallet?tab=financing                    W-20  Fund your training              (&stage=apply W-21 · received W-22 · offer W-23 · declined W-23b · loan W-24)
 * Phase 5 (Credit score and payouts, W-25 … W-27b):
 *   /wallet?tab=credit                       W-25  Credit score · Overview         (&modal=score = W-25b How your score works)
 *   /wallet?view=escrow                      W-26  Payout · Gig in escrow
 *   /wallet?view=salary                      W-27  Get paid to your wallet (employer details)
 *   /wallet?toast=salary                     W-27b Salary received (notification over Home)
 * Dialog views stay `view=topup|withdraw`; `view=kyc|savings|escrow|salary` are pages.
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */
export const WALLET_TABS = ['overview', 'transactions', 'cycles', 'financing', 'credit'];
export const WALLET_VIEWS = ['topup', 'withdraw', 'kyc', 'savings', 'salary', 'escrow'];
export const WALLET_STATES = ['new', 'checking', 'retake', 'activated', 'under18'];
export const FINANCING_STAGES = ['apply', 'received', 'offer', 'declined', 'loan'];
export const WALLET_STEPS = {
  topup: ['method', 'approve', 'success'],
  withdraw: ['amount', 'pin'],
  kyc: ['card', 'address', 'selfie'],
};

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useTalentWalletState = () => {
  const [params, setParams] = useSearchParams();
  const view = pick(params.get('view'), WALLET_VIEWS);
  const stepList = view ? WALLET_STEPS[view] : null;
  const step = stepList ? pick(params.get('step'), stepList, stepList[0]) : null;
  const tab = pick(params.get('tab'), WALLET_TABS, 'overview');
  const tx = params.get('tx');
  const filter = params.get('filter');
  const modal = params.get('modal');
  const toast = params.get('toast');
  const state = pick(params.get('state'), WALLET_STATES);
  const stage = pick(params.get('stage'), FINANCING_STAGES);
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';

  return useMemo(() => {
    log('state', { view, step, tab, tx, modal, toast, state, rail });
    // Merge a patch into the query string (null/undefined/false/'' removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false || v === '') next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab,
      walletTab: tab,
      view,
      step,
      tx,
      filter,
      modal,
      toast,
      state,
      stage,
      rail,
      help,
      a11yMode: a11yParam,
      a11yParam,
      update,
      searchOpen: params.get('search') === '1',
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
    };
  }, [
    params,
    setParams,
    view,
    step,
    tab,
    tx,
    filter,
    modal,
    toast,
    state,
    stage,
    rail,
    help,
    a11yParam,
  ]);
};
