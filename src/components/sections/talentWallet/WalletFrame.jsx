import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';

const log = debug('WalletFrame');

/*
 * WalletFrame — the talent shell every Wallet screen sits in (Figma W-01…W-27b: expanded sidebar with "Wallet" active,
 * badges My Assessment 142 · Job Postings 2 · Messages 4, nav streak 12). `?rail=collapsed` = icon rail ("collapsed sidebar" frames).
 * Props: wallet (useTalentWalletState()), children.
 * Mock data only (no live shell): every wallet URL draws the Kofi shell, as in Figma.
 */
const WalletFrame = ({ wallet, children }) => {
  useEffect(() => {
    ensurePlayfulFont();
    log('mount', { rail: wallet.rail });
  }, [wallet.rail]);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  return (
    <DashboardShell
      role="talent"
      activeNav="wallet"
      talentHome={{ ...wallet, navStreak: '12', railHome: true }}
      rail={wallet.rail}
      onToggleRail={() => wallet.update({ rail: wallet.rail === 'collapsed' ? null : 'collapsed' })}
      railActiveId="wallet"
      railBadges={{ assessment: '142', opportunities: '2', messages: '4' }}
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={wallet} />
    </DashboardShell>
  );
};

export default WalletFrame;
