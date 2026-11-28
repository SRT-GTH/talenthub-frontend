/*
 * notYetCopy — the lines a signed-in parent sees where the parent backend has no endpoint yet (ParentNotYet). Same wording pattern as the live ward page's
 * Wallet / Evaluations tabs (pages/parent/ParentWardPage.jsx NOT_YET). ⚠️ ASSUMPTION: our copy, no Figma frame.
 */
export const NOT_YET_PAGES = {
  wallets: {
    title: 'Ward wallets',
    body: 'Ward wallets are not available yet. Nothing has been charged or paid.',
  },
  evaluate: {
    title: 'Evaluate my child',
    body: 'Evaluations are not available online yet. When they are, you will write them here and they will show on your ward’s page.',
    action: { label: 'Go to My wards', to: '/parent/wards' },
  },
};
