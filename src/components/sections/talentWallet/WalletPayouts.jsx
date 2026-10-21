import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import spotEscrow from '../../../assets/talent-wallet/spot-escrow.svg';
import spotSalaryCoins from '../../../assets/talent-wallet/spot-salary-coins.svg';
import { ESCROW, SALARY } from './walletCreditData.js';
import { GreenLink, HeroCard, HeroHead, SideCard, SectionHead } from './WalletPanels.jsx';
import { CAPS_LABEL, HERO_CARD, PLAIN_CARD, TxRow, WalletButton } from './walletUi.jsx';

const log = debug('WalletPayouts');

const COLUMNS = 'grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]';

const STEP_STYLE = {
  done: 'bg-[#e8f2ed]',
  now: 'bg-[#fff4d6]',
  todo: 'bg-[#f1f1ee]',
};

/*
 * W-26 "Payout · Gig in escrow" (Playful 8825:2137 / Focused 8826:2162; Main Content Canvas 8825:2145), URL `?view=escrow`; the Transactions tab is selected.
 * Props: wallet (useTalentWalletState()).
 */
export const WalletEscrow = () => {
  const e = ESCROW;
  log('render escrow');
  return (
    <div className={COLUMNS}>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <HeroCard gap={[12, 20]} aria-label={e.title}>
          <HeroHead
            art={spotEscrow}
            wide
            headGap={20}
            chip={{ tone: 'warn', text: e.chip }}
            title={e.title}
            titleClass="text-[30px] max-lg:text-[24px] tracking-[-0.02em]"
            text={e.text}
          />
          <ol className="m-0 grid list-none gap-[10px] p-0 sm:grid-cols-2 lg:grid-cols-4">
            {e.steps.map((s) => (
              <li
                key={s.id}
                className={classNames(
                  'flex flex-col gap-[4px] rounded-[14px] p-[12px]',
                  STEP_STYLE[s.state]
                )}
                aria-current={s.state === 'now' ? 'step' : undefined}
              >
                <span className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                  {s.label}
                </span>
                <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">{s.note}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton tone="primary" onClick={() => log('message Hubtel (no screen is drawn)')}>
              {e.message}
            </WalletButton>
            <WalletButton onClick={() => log('raise a dispute (no screen is drawn)')}>
              {e.dispute}
            </WalletButton>
          </div>
        </HeroCard>
        <SectionHead title={e.other} />
        <section aria-label={e.other} className={classNames(PLAIN_CARD, 'flex flex-col p-[19px]')}>
          {e.rows.map((r) => (
            <TxRow key={r.id} tx={r} />
          ))}
        </section>
      </div>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <section
          aria-label={e.guarantee.label}
          className={classNames(
            'flex flex-col gap-[16px] rounded-[24px] bg-[#387440] p-[22px] text-white',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0')}>{e.guarantee.label}</p>
          <p className="m-0 font-sans text-[14px] font-medium leading-[1.2]">{e.guarantee.text}</p>
        </section>
      </div>
    </div>
  );
};

/*
 * W-27 "Get paid to your wallet (employer details)" (Playful 8825:2934 / Focused 8826:2949; Main Content Canvas 8825:2942), URL `?view=salary`.
 * Mock only (nothing is copied, downloaded or shared).
 */
export const WalletSalary = () => {
  const s = SALARY;
  log('render salary');
  return (
    <div className={COLUMNS}>
      <HeroCard gap={14} aria-label={s.title} className="min-w-0 self-start">
        <HeroHead
          art={spotSalaryCoins}
          wide
          headGap={14}
          title={s.title}
          titleClass="text-[30px] max-lg:text-[24px] tracking-[-0.02em]"
          text={s.text}
        />
        <dl className="m-0 flex flex-col gap-[20px] rounded-[16px] bg-[#f4f7f2] p-[18px] font-sans text-[14px] leading-[1.2]">
          {s.rows.map(([a, b]) => (
            <div key={a} className="flex flex-wrap justify-between gap-x-[12px] gap-y-[2px]">
              <dt className="text-[#575755]">{a}</dt>
              <dd className="m-0 text-right font-semibold text-[#2d5d33]">{b}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-[12px]">
          <WalletButton tone="primary" onClick={() => log('copy all details (mock)')}>
            {s.copy}
          </WalletButton>
          <WalletButton onClick={() => log('download letter (mock, nothing is downloaded)')}>
            {s.letter}
          </WalletButton>
          <WalletButton onClick={() => log('share by WhatsApp (mock)')}>{s.share}</WalletButton>
        </div>
      </HeroCard>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <SideCard title={s.paying.title} gap={20} aria-label={s.paying.title}>
          {s.paying.rows.map((r) => (
            <div key={r.id} className="flex flex-col gap-[2px]">
              <span className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                {r.name}
              </span>
              <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">{r.note}</span>
            </div>
          ))}
        </SideCard>
        <section
          aria-label={s.split.label}
          className={classNames(
            'flex flex-col gap-[16px] rounded-[24px] bg-[#387440] p-[22px] text-white',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0')}>{s.split.label}</p>
          <p className="m-0 font-sans text-[14px] font-medium leading-[1.2]">{s.split.text}</p>
          <GreenLink className="!text-white" onClick={() => log('turn on payday split (mock)')}>
            {s.split.action}
          </GreenLink>
        </section>
      </div>
    </div>
  );
};
