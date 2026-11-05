import { useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import { CYCLES_PER_GHS } from './data/walletsData.js';

const log = debug('walletsStore');

/*
 * walletsStore — the in-memory mock of the wards' wallets for the Ward wallets flow (Figma "Parent · 08 Ward wallets" 10057:66889), shared by /parent/wallets and the ward page's Wallet tab, so approving a
 * payment or topping up on one screen shows on the other. Module-level store (no provider); a reload resets it, so the frame URLs (`?view=`, `?toast=`) re-apply the drawn state.
 * State: { abena: { balance, cycles, laptop, spent, limits { askAbove, monthly }, request { status 'pending' | 'approved' | 'declined' | 'expired', amount, what, who, askedAgo, expiresIn, note } },
 *          elliot: { opened, balance, cycles } }.
 * Actions: approve(), decline(note), undoDecline(), topUp(amount), setLimits({ askAbove, monthly }), openWallet(), the idempotent ensure* twins for the frame URLs, reset().
 * Approve pays the cash balance first and the rest in Cycles (10 Cycles = GHS 1): GHS 90 from GHS 85 + 50 Cycles leaves GHS 0.00 and 130 Cycles, as PWa-03 draws.
 */
const initial = () => ({
  abena: {
    balance: 85,
    cycles: 180,
    laptop: 40,
    spent: 35,
    limits: { askAbove: 50, monthly: 200 },
    request: {
      status: 'pending',
      amount: 90,
      what: 'Python Basics',
      who: 'GTH Academy',
      askedAgo: '2 h ago',
      expiresIn: '46 h',
      note: '',
    },
  },
  elliot: { opened: false, balance: 0, cycles: 60 },
});

let state = initial();
const listeners = new Set();
const emit = (next) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getState = () => state;

const setRequest = (patch) =>
  emit({ ...state, abena: { ...state.abena, request: { ...state.abena.request, ...patch } } });

// The cash and Cycles one payment takes.
export const paymentSplit = (wallet, amount) => {
  const cash = Math.min(wallet.balance, amount);
  const cycles = Math.round((amount - cash) * CYCLES_PER_GHS);
  return { cash, cycles };
};

export const walletsActions = {
  approve() {
    const a = state.abena;
    if (a.request.status !== 'pending') return;
    const { cash, cycles } = paymentSplit(a, a.request.amount);
    log('approve', { cash, cycles });
    emit({
      ...state,
      abena: {
        ...a,
        balance: a.balance - cash,
        cycles: a.cycles - cycles,
        spent: a.spent + a.request.amount,
        request: { ...a.request, status: 'approved' },
      },
    });
  },
  decline(note = '') {
    if (state.abena.request.status !== 'pending') return;
    log('decline', { noteLength: note.length });
    setRequest({ status: 'declined', note });
  },
  undoDecline() {
    if (state.abena.request.status !== 'declined') return;
    log('undoDecline');
    setRequest({ status: 'pending', note: '' });
  },
  expire() {
    if (state.abena.request.status !== 'pending') return;
    setRequest({ status: 'expired' });
  },
  topUp(amount) {
    log('topUp', { amount });
    emit({ ...state, abena: { ...state.abena, balance: state.abena.balance + amount } });
  },
  setLimits(limits) {
    log('setLimits', limits);
    emit({ ...state, abena: { ...state.abena, limits } });
  },
  openWallet() {
    if (state.elliot.opened) return;
    log('openWallet');
    emit({ ...state, elliot: { ...state.elliot, opened: true } });
  },
  // Frame-URL seeds (PWa-03 / 04b / 07 / 06c / 08b): apply the drawn state once, whatever the store holds.
  ensureApproved() {
    walletsActions.approve();
  },
  ensureDeclined(note) {
    walletsActions.decline(note);
  },
  ensureExpired() {
    walletsActions.expire();
  },
  ensureToppedUp(amount) {
    if (state.abena.balance < 100) walletsActions.topUp(amount);
  },
  ensureOpened() {
    walletsActions.openWallet();
  },
  reset() {
    emit(initial());
  },
};

export const useWallets = () => useSyncExternalStore(subscribe, getState, getState);
