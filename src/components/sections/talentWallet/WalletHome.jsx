import { classNames } from '../../../utils/classNames.js';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { debug } from '../../../utils/debug.js';
import { WalletIdIcon, WalletPhoneIcon, WalletStatusShieldIcon } from '../../shared/assets.jsx';
import { PAYDAY_HOME } from './walletCreditData.js';
import {
  COMING_IN,
  CREDIT_CARD,
  CYCLES_CARD,
  RECENT_ACTIVITY,
  SAVINGS_CARD,
  TRANSACTIONS,
  WALLET,
} from './walletData.js';
import {
  CAPS_LABEL,
  HEADING,
  HERO_CARD,
  PLAIN_CARD,
  StatusChip,
  TxRow,
  WalletButton,
} from './walletUi.jsx';
import { GreenLink, Progress, SectionHead } from './WalletPanels.jsx';

const log = debug('WalletHome');

const META_ICONS = {
  wallet: WalletIdIcon,
  withdraw: WalletPhoneIcon,
  status: WalletStatusShieldIcon,
};

/*
 * WalletHome — W-06 "Wallet · Home (active)" Overview tab (Playful 8817:695 / Focused 8820:464667; Main Content Canvas 8817:703).
 * Two columns (965 + 24 + 340): balance card, "Coming in" payouts, "Recent activity" | Cycles, Savings pot, Credit score cards.
 * The Top up / Withdraw dialogs open from the buttons (`?view=topup|withdraw`, see talentWalletState.js).
 * Props: wallet (useTalentWalletState()).
 */
const WalletHome = ({ wallet }) => {
  log('render', { rail: wallet.rail });
  // W-27b ("Salary received") draws the Home page after payday: other balance, payout tile, first two activity rows and savings.
  const payday = wallet.toast === 'salary';
  const base = RECENT_ACTIVITY.ids
    .map((id) => TRANSACTIONS.find((t) => t.id === id))
    .filter(Boolean);
  const recent = payday ? [...PAYDAY_HOME.activity, ...base.slice(2)] : base;
  const balance = payday ? PAYDAY_HOME.balance : WALLET.balance;
  const comingIn = payday ? [PAYDAY_HOME.payout, ...COMING_IN.items.slice(1)] : COMING_IN.items;
  const saved = payday
    ? { ...SAVINGS_CARD, saved: PAYDAY_HOME.savedPot, progress: PAYDAY_HOME.savedProgress }
    : SAVINGS_CARD;
  const openTx = (id) => {
    log('open transaction', id);
    wallet.update({ tab: 'transactions', tx: id });
  };

  return (
    <div className="grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]">
      <div className={classNames('flex min-w-0 flex-col', payday ? 'gap-[20px]' : 'gap-[18px]')}>
        {/* Balance card 965 x 239, r26, padding 22/24 */}
        <section
          aria-label="Balance"
          className={classNames(
            'flex min-h-[238px] flex-col gap-[24px] rounded-[26px] bg-white px-[clamp(16px,1.4vw,24px)] py-[22px] playful:min-h-[239px] md:flex-row md:items-center',
            HERO_CARD
          )}
        >
          <div
            className={classNames(
              'flex min-w-0 flex-1 flex-col items-start',
              payday ? 'gap-[16px]' : 'gap-[8px]'
            )}
          >
            <p className={classNames(CAPS_LABEL, 'm-0 text-[#387440]')}>{WALLET.balanceLabel}</p>
            <p
              className={classNames(
                HEADING,
                'm-0 text-[clamp(34px,2.55vw,44px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
              )}
            >
              {balance}
            </p>
            <p className="m-0 max-w-[520px] font-sans text-[14px] leading-[1.2] text-[#575755]">
              {WALLET.hold}
            </p>
            <div className="flex flex-wrap items-center gap-[12px]">
              <WalletButton
                tone="primary"
                onClick={() => {
                  log('open top up');
                  wallet.update({ view: 'topup', step: null });
                }}
              >
                {WALLET.actions.topUp}
              </WalletButton>
              <WalletButton
                onClick={() => {
                  log('open withdraw');
                  wallet.update({ view: 'withdraw', step: null });
                }}
              >
                {WALLET.actions.withdraw}
              </WalletButton>
              <WalletButton
                onClick={() => log('redeem cycles (dialog is built in a later phase, W-15)')}
              >
                {WALLET.actions.redeem}
              </WalletButton>
            </div>
          </div>
          <dl
            className={classNames(
              'm-0 flex w-full shrink-0 flex-col gap-[16px] rounded-[18px] bg-[#f4f7f2] p-[16px] md:w-[300px]',
              !payday && 'playful:gap-[10px]'
            )}
          >
            {WALLET.meta.map((m) => {
              const Icon = META_ICONS[m.id];
              return (
                <div key={m.id} className="flex items-center gap-[10px]">
                  <Icon className="size-[18px] shrink-0 text-[#387455]" />
                  <div className="flex min-w-0 flex-col gap-[4px] playful:gap-0">
                    <dt className="font-sans text-[12px] leading-[1.2] text-[#575755]">
                      {m.label}
                    </dt>
                    <dd className="m-0 whitespace-nowrap font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                      {m.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </section>

        <SectionHead
          title={COMING_IN.title}
          sticker={payday ? PAYDAY_HOME.sticker : COMING_IN.sticker}
          link={COMING_IN.link}
          onLink={() => log('see payouts (payout screens are a later phase)')}
        />
        <div className="grid gap-[16px] sm:grid-cols-2">
          {comingIn.map((p) => (
            <div
              key={p.id}
              className={classNames(
                PLAIN_CARD,
                'flex flex-col p-[18px]',
                payday ? 'min-h-[133px] gap-[16px]' : 'min-h-[117px] gap-[8px]'
              )}
            >
              <p className="m-0 font-sans text-[16px] font-semibold leading-[1.2] text-[#1c2a21]">
                {p.title}
              </p>
              <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{p.note}</p>
              <div className="flex flex-wrap items-center justify-between gap-[8px]">
                <span className={classNames(HEADING, 'text-[22px] leading-[1.25] text-[#1c2a21]')}>
                  {p.amount}
                </span>
                <StatusChip tone={p.tone}>{p.status}</StatusChip>
              </div>
            </div>
          ))}
        </div>

        <SectionHead
          title={RECENT_ACTIVITY.title}
          link={RECENT_ACTIVITY.link}
          onLink={() => wallet.update({ tab: 'transactions' })}
        />
        <section
          aria-label="Recent activity"
          className={classNames(
            PLAIN_CARD,
            'flex flex-col p-[18px]',
            payday ? 'gap-0' : 'gap-[8px]'
          )}
        >
          {recent.map((tx) => (
            <TxRow key={tx.id} tx={tx} onOpen={tx.hasReceipt ? openTx : undefined} />
          ))}
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-[16px]">
        {/* Cycles card: green, r24 */}
        <section
          aria-label="Cycles"
          className={classNames(
            'flex flex-col items-start gap-[16px] rounded-[24px] bg-[#387440] p-[20px] text-white playful:gap-[14px]',
            payday && '!gap-[20px]',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0 text-white')}>{CYCLES_CARD.label}</p>
          <div className="flex items-end gap-[10px]">
            <span className={classNames(HEADING, 'text-[44px] leading-[1.15] tracking-[-0.02em]')}>
              {CYCLES_CARD.value}
            </span>
            <span className="whitespace-nowrap font-sans text-[15px] font-semibold leading-[1.2]">
              {CYCLES_CARD.worth}
            </span>
          </div>
          <p className="m-0 font-sans text-[13px] leading-[1.2]">{CYCLES_CARD.note}</p>
          <Progress value={CYCLES_CARD.progress} fill="#f5c344" />
          <p className="m-0 font-sans text-[12px] font-semibold leading-[1.2]">
            {CYCLES_CARD.more}
          </p>
        </section>

        <section
          aria-label="Savings pot"
          className={classNames(
            PLAIN_CARD,
            'flex flex-col items-start gap-[16px] p-[18px] playful:gap-[14px]',
            payday && '!gap-[20px]'
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0 text-[#575755]')}>{saved.label}</p>
          <button
            type="button"
            onClick={() => wallet.update({ view: 'savings' })}
            className={classNames(
              HEADING,
              'm-0 min-h-[24px] cursor-pointer border-0 bg-transparent p-0 text-left text-[20px] leading-[1.25] text-[#1c2a21]',
              FOCUS_RING
            )}
          >
            {saved.name}
          </button>
          <div className="flex items-end gap-[6px]">
            <span className={classNames(HEADING, 'text-[24px] leading-[1.25] text-[#1c2a21]')}>
              {saved.saved}
            </span>
            <span className="font-sans text-[13px] leading-[1.2] text-[#575755]">{saved.goal}</span>
          </div>
          <Progress value={saved.progress} fill="#387455" />
          <StatusChip tone="warn">{saved.boost}</StatusChip>
        </section>

        <section
          aria-label="Talent credit score"
          className={classNames(
            PLAIN_CARD,
            'flex flex-col items-start gap-[16px] p-[18px] playful:gap-[14px]',
            payday && '!gap-[20px]'
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0 text-[#575755]')}>{CREDIT_CARD.label}</p>
          <div className="flex items-center gap-[8px]">
            <span
              className={classNames(
                HEADING,
                'text-[32px] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
              )}
            >
              {CREDIT_CARD.score}
            </span>
            <StatusChip tone="ok">{CREDIT_CARD.band}</StatusChip>
          </div>
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
            {CREDIT_CARD.note}
          </p>
          <GreenLink onClick={() => log('view your score (no destination in the prototype)')}>
            {CREDIT_CARD.link}
          </GreenLink>
        </section>
      </div>
    </div>
  );
};

export default WalletHome;
