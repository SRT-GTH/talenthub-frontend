import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import spotSavings from '../../../assets/talent-wallet/spot-savings.svg';
import { SAVINGS_POT } from './walletCyclesData.js';
import { HeroCard, Progress, SectionHead } from './WalletPanels.jsx';
import { CAPS_LABEL, HEADING, HERO_CARD, PLAIN_CARD, TxRow, WalletButton } from './walletUi.jsx';

const log = debug('WalletSavings');

/*
 * W-16 "Savings pot · Laptop fund" (Playful 8822:4564 / Focused 8823:4569; Main Content Canvas 8822:4572), URL `?view=savings`.
 * Mock only: Add money / Edit goal / Move to balance have no screen drawn, they are logged.
 * Props: wallet (useTalentWalletState()).
 */
const WalletSavings = () => {
  log('render');
  const s = SAVINGS_POT;
  return (
    <div className="grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]">
      <div className="flex min-w-0 flex-col gap-[18px]">
        <HeroCard gap={[16, 12]} aria-label={s.name}>
          <img src={spotSavings} alt="" className="size-[96px] shrink-0" />
          <p className={classNames(CAPS_LABEL, 'm-0 text-[#387440]')}>{s.label}</p>
          <p
            className={classNames(
              HEADING,
              'm-0 text-[clamp(26px,1.85vw,32px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
            )}
          >
            {s.name}
          </p>
          <div className="flex flex-wrap items-end gap-x-[10px] gap-y-[2px]">
            <span
              className={classNames(
                HEADING,
                'text-[clamp(32px,2.3vw,40px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
              )}
            >
              {s.saved}
            </span>
            <span className="font-sans text-[15px] leading-[1.2] text-[#575755]">{s.goal}</span>
          </div>
          <Progress value={s.progress} fill="#387455" height={12} className="max-w-[880px]" />
          <div className="grid gap-[14px] sm:grid-cols-3">
            {s.stats.map((st) => (
              <div
                key={st.id}
                className="flex flex-col gap-[2px] rounded-[14px] bg-[#f4f7f2] p-[14px]"
              >
                <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">
                  {st.label}
                </span>
                <span className="font-sans text-[16px] font-semibold leading-[1.2] text-[#1c2a21]">
                  {st.value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton tone="primary" onClick={() => log('add money (no screen is drawn)')}>
              {s.actions.add}
            </WalletButton>
            <WalletButton onClick={() => log('edit goal (no screen is drawn)')}>
              {s.actions.edit}
            </WalletButton>
            <WalletButton onClick={() => log('move to balance (no screen is drawn)')}>
              {s.actions.move}
            </WalletButton>
          </div>
        </HeroCard>

        <SectionHead
          title={s.boosts.title}
          sticker={s.boosts.sticker}
          link={s.boosts.link}
          onLink={() => log('how boosts work (no screen is drawn)')}
        />
        <section
          aria-label={s.boosts.title}
          className={classNames(PLAIN_CARD, 'flex flex-col gap-[8px] p-[18px]')}
        >
          {s.boosts.rows.map((r) => (
            <TxRow key={r.id} tx={r} />
          ))}
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-[16px]">
        <section
          aria-label={s.next.label}
          className={classNames(
            'flex flex-col gap-[14px] rounded-[24px] bg-[#387440] p-[20px] text-white',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0')}>{s.next.label}</p>
          <p className={classNames(HEADING, 'm-0 text-[22px] leading-[1.25]')}>{s.next.title}</p>
          <p className="m-0 font-sans text-[13px] leading-[1.2]">{s.next.text}</p>
        </section>
        <section
          aria-label={s.another.title}
          className={classNames(PLAIN_CARD, 'flex flex-col items-start gap-[14px] p-[18px]')}
        >
          <h2 className={classNames(HEADING, 'm-0 text-[18px] leading-[1.25] text-[#1c2a21]')}>
            {s.another.title}
          </h2>
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{s.another.text}</p>
          <WalletButton onClick={() => log('new savings pot (no screen is drawn)')}>
            {s.another.action}
          </WalletButton>
        </section>
      </div>
    </div>
  );
};

export default WalletSavings;
