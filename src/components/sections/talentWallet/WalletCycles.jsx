import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { WalletBookIcon, WalletChartLineIcon, WalletWalletIcon } from '../../shared/assets.jsx';
import { CYCLES_HERO, CYCLES_LEDGER, SPEND_CYCLES, WAYS_TO_EARN } from './walletCyclesData.js';
import { Progress, SectionHead } from './WalletPanels.jsx';
import { CAPS_LABEL, HEADING, HERO_CARD, PLAIN_CARD, TxRow, WalletButton } from './walletUi.jsx';

const log = debug('WalletCycles');

const SPEND_ICONS = { wallet: WalletWalletIcon, book: WalletBookIcon, chart: WalletChartLineIcon };

/*
 * WalletCycles — W-14 "Cycles · Earned and spent" (Playful 8822:99 / Focused 8823:149; Main Content Canvas 8822:107), URL `?tab=cycles`.
 * W-15 / W-15b draw the same page behind their dialog with 620 Cycles ("ready") and tighter spacing (gap 18, hero 239px, cards gap 14) —
 * `?tab=cycles&modal=redeem` follows that frame; `modal=redeem-short` ("Almost there") follows the 340-Cycles layout.
 * Props: wallet (useTalentWalletState()).
 */
const WalletCycles = ({ wallet }) => {
  const ready = wallet.modal === 'redeem';
  // Every frame with a dialog (W-15 / W-15b) draws the tighter spacing; W-14 / W-14b the looser one.
  const tight = Boolean(wallet.modal?.startsWith('redeem'));
  const toast = wallet.toast === 'cycles';
  // Spacing per frame: dialog frames are tight; the toast frame is loose in both styles; the plain page is tight in Focused, loose in Playful.
  const pick = (t, l, pl) => (tight ? t : toast ? l : `${t} ${pl}`);
  const hero = ready ? CYCLES_HERO.ready : CYCLES_HERO.default;
  log('render', { ready });
  const ledger = CYCLES_LEDGER.rows.map((r) => ({ ...r, status: r.chip }));

  return (
    <div className="grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]">
      <div
        className={classNames(
          'flex min-w-0 flex-col',
          pick('gap-[18px]', 'gap-[18px]', 'playful:gap-[24px]')
        )}
      >
        <section
          aria-label="Your Cycles"
          className={classNames(
            'flex flex-col gap-[24px] rounded-[26px] bg-white px-[clamp(16px,1.4vw,24px)] py-[22px] md:flex-row md:items-center',
            tight ? 'md:h-[239px]' : 'md:h-[291px]',
            HERO_CARD
          )}
        >
          <div
            className={classNames(
              'flex min-w-0 flex-1 flex-col items-start',
              pick('gap-[8px]', 'gap-[12px]', 'playful:gap-[12px]')
            )}
          >
            <p className={classNames(CAPS_LABEL, 'm-0 text-[#387440]')}>{CYCLES_HERO.label}</p>
            <div className="flex items-end gap-[10px] whitespace-nowrap">
              <span
                className={classNames(
                  HEADING,
                  'text-[clamp(38px,2.78vw,48px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
                )}
              >
                {hero.value}
              </span>
              <span className="font-sans text-[16px] font-semibold leading-[1.2] text-[#575755]">
                {hero.worth}
              </span>
            </div>
            <p className="m-0 max-w-[520px] font-sans text-[14px] leading-[1.2] text-[#575755]">
              {CYCLES_HERO.note}
            </p>
            <Progress value={hero.progress} fill="#f5c344" height={10} className="max-w-[520px]" />
            <p className="m-0 font-sans text-[13px] font-semibold leading-[1.2] text-[#1c2a21]">
              {hero.line}
            </p>
            <div className="flex flex-wrap gap-[12px]">
              <WalletButton
                tone="primary"
                onClick={() => {
                  log('open redeem');
                  wallet.update({ modal: ready ? 'redeem' : 'redeem-short' });
                }}
              >
                {CYCLES_HERO.redeem}
              </WalletButton>
              <WalletButton onClick={() => log('how Cycles work (no screen is drawn for it)')}>
                {CYCLES_HERO.how}
              </WalletButton>
            </div>
          </div>
          <div
            className={classNames(
              'flex w-full shrink-0 flex-col rounded-[18px] bg-[#fff8e1] p-[16px] md:w-[300px]',
              pick('gap-[8px]', 'gap-[8px]', 'playful:gap-[12px]')
            )}
          >
            <p className={classNames(CAPS_LABEL, 'm-0 text-[#967014]')}>{CYCLES_HERO.rate.label}</p>
            <p className={classNames(HEADING, 'm-0 text-[22px] leading-[1.25] text-[#1c2a21]')}>
              {CYCLES_HERO.rate.value}
            </p>
            <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
              {CYCLES_HERO.rate.note}
            </p>
          </div>
        </section>

        <SectionHead
          title={CYCLES_LEDGER.title}
          sticker={CYCLES_LEDGER.sticker}
          link={CYCLES_LEDGER.link}
          onLink={() => log('export (mock, nothing is downloaded)')}
        />
        <section
          aria-label="Cycles history"
          className={classNames(PLAIN_CARD, 'flex flex-col p-[18px]')}
        >
          {ledger.map((r) => (
            <TxRow key={r.id} tx={r} />
          ))}
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-[16px]">
        <section
          aria-label={WAYS_TO_EARN.label}
          className={classNames(
            'flex flex-col rounded-[24px] bg-[#387440] p-[20px] text-white',
            pick('gap-[14px]', 'gap-[20px]', 'playful:gap-[20px]'),
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0')}>{WAYS_TO_EARN.label}</p>
          {WAYS_TO_EARN.rows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-[12px] font-sans text-[14px] leading-[1.2]"
            >
              <span className="font-medium">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
          <p className="m-0 font-sans text-[12px] leading-[1.2]">{WAYS_TO_EARN.note}</p>
        </section>
        <section
          aria-label={SPEND_CYCLES.title}
          className={classNames(
            PLAIN_CARD,
            'flex flex-col p-[18px]',
            pick('gap-[14px]', 'gap-[20px]', 'playful:gap-[20px]')
          )}
        >
          <h2 className={classNames(HEADING, 'm-0 text-[18px] leading-[1.25] text-[#1c2a21]')}>
            {SPEND_CYCLES.title}
          </h2>
          {SPEND_CYCLES.rows.map((r) => {
            const Icon = SPEND_ICONS[r.icon];
            return (
              <div key={r.id} className="flex items-center gap-[10px]">
                <Icon className="size-[18px] shrink-0 text-[#387455]" />
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                    {r.title}
                  </span>
                  <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">
                    {r.note}
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default WalletCycles;
