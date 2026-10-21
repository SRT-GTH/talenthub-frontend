import { Fragment, useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import spotScoreGauge from '../../../assets/talent-wallet/spot-score-gauge.svg';
import { CREDIT, SCORE_MODAL } from './walletCreditData.js';
import { ModalButtons, ModalHead, WalletModal } from './WalletDialogParts.jsx';
import { Progress, SectionHead, SideCard } from './WalletPanels.jsx';
import {
  CAPS_LABEL,
  HEADING,
  HERO_CARD,
  PLAIN_CARD,
  StatusChip,
  StyleText,
  WalletButton,
} from './walletUi.jsx';

const log = debug('WalletCredit');

const COLUMNS = 'grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]';

/* Donut segment from Figma ellipse `arcData` (angles in radians, clockwise from 3 o'clock, innerRadius as a fraction of the outer radius). */
const donut = (cx, cy, R, inner, a0, a1) => {
  const r = R * inner;
  const p = (rad, a) =>
    `${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(R, a0)} A ${R} ${R} 0 ${large} 1 ${p(R, a1)} L ${p(r, a1)} A ${r} ${r} 0 ${large} 0 ${p(r, a0)} Z`;
};

/*
 * Gauge (Figma `gauge` 260 x 150 = two 240px ellipses at (10,10) with arcData: track π→2π #eceee9, progress π→4.9906 #387455, inner radius 0.82),
 * the score (Bricolage 48 at 97,72) and "out of 1000" (13px at 98,130).
 */
const Gauge = ({ score, label }) => (
  <div
    className="relative h-[150px] w-[260px] shrink-0 max-sm:mx-auto"
    role="img"
    aria-label={`${score} ${label}`}
  >
    <svg viewBox="0 0 260 150" className="absolute inset-0 size-full" aria-hidden="true">
      <path d={donut(130, 130, 120, 0.82, Math.PI, 2 * Math.PI)} fill="#eceee9" />
      <path d={donut(130, 130, 120, 0.82, Math.PI, 4.990644454956055)} fill="#387455" />
    </svg>
    <div className="absolute inset-x-0 top-[72px] flex flex-col items-center">
      <span
        className={classNames(
          HEADING,
          'text-[48px] leading-[55px] tracking-[-0.96px] text-[#1c2a21]'
        )}
      >
        {score}
      </span>
    </div>
    <span className="absolute inset-x-0 top-[130px] text-center font-sans text-[13px] leading-[16px] text-[#575755]">
      {label}
    </span>
  </div>
);

/*
 * WalletCredit — W-25 "Credit score · Overview" (Playful 8825:99 / Focused 8826:149; Main Content Canvas 8825:107), URL `?tab=credit`.
 * `&modal=score` opens "How your score works" (W-25b). Mock only.
 * Props: wallet (useTalentWalletState()).
 */
const WalletCredit = ({ wallet }) => {
  const c = CREDIT;
  log('render');
  return (
    <div className={COLUMNS}>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <section
          aria-label="Your talent credit score"
          className={classNames(
            'flex min-h-[239px] flex-col items-center gap-[32px] rounded-[26px] bg-white px-[clamp(16px,1.4vw,24px)] py-[22px] md:flex-row',
            HERO_CARD
          )}
        >
          <Gauge score={c.gauge.score} label={c.gauge.label} />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
            <StatusChip tone="ok">{c.chip}</StatusChip>
            <h2
              className={classNames(
                HEADING,
                'm-0 text-[28px] leading-[1.25] text-[#1c2a21] max-lg:text-[24px]'
              )}
            >
              {c.title}
            </h2>
            <p className="m-0 max-w-[560px] font-sans text-[15px] leading-[1.2] text-[#575755]">
              {c.text}
            </p>
            <p className="m-0 flex flex-wrap items-center gap-x-[8px] font-sans leading-[1.2]">
              <span className="text-[14px] font-semibold text-[#387440]">{c.trend}</span>
              <span className="text-[13px] text-[#575755]">{c.updated}</span>
            </p>
          </div>
        </section>

        <SectionHead
          title={c.factorsHead.title}
          sticker={c.factorsHead.sticker}
          link={c.factorsHead.link}
          onLink={() => wallet.update({ modal: 'score' })}
        />
        <section
          aria-label={c.factorsHead.title}
          className={classNames(PLAIN_CARD, 'flex flex-col gap-[14px] p-[18px] playful:gap-[24px]')}
        >
          {c.factors.map((f, i) => (
            <Fragment key={f.id}>
              <div className="grid items-center gap-x-[14px] gap-y-[6px] md:grid-cols-[307px_minmax(0,440px)_1fr]">
                <span className="font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
                  {f.label}
                </span>
                <Progress value={f.fill} fill={f.color} height={10} />
                <span className="justify-self-start md:justify-self-end">
                  <StatusChip tone={f.tone}>{f.chip}</StatusChip>
                </span>
              </div>
              {i === 0 ? (
                <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755] playful:hidden">
                  {c.privacyNote}
                </p>
              ) : null}
            </Fragment>
          ))}
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-[16px]">
        <section
          aria-label={c.improve.label}
          className={classNames(
            'flex flex-col gap-[16px] rounded-[24px] bg-[#387440] p-[20px] text-white playful:gap-[14px]',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0')}>{c.improve.label}</p>
          {c.improve.rows.map(([a, b]) => (
            <div
              key={a}
              className="flex justify-between gap-[12px] font-sans text-[14px] leading-[1.2]"
            >
              <span className="font-medium">{a}</span>
              <span className="font-semibold">{b}</span>
            </div>
          ))}
        </section>
        <SideCard title={c.history.title} gap={14} pad={18} aria-label={c.history.title}>
          <div
            className="flex h-[125px] items-end justify-between gap-[10px]"
            role="img"
            aria-label="Score over the last months"
          >
            {c.history.bars.map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-[4px]">
                <span className="font-sans text-[11px] font-semibold leading-[13px] text-[#575755] max-lg:text-[12px]">
                  {b.valueFocused ? (
                    <StyleText focused={b.valueFocused} playful={b.value} />
                  ) : (
                    b.value
                  )}
                </span>
                <span
                  className="block w-[clamp(18px,1.75vw,30px)] rounded-[6px]"
                  style={{ height: b.h, background: b.now ? '#387455' : '#c7d9cc' }}
                />
                <span className="font-sans text-[11px] leading-[13px] text-[#575755] max-lg:text-[12px]">
                  {b.month}
                </span>
              </div>
            ))}
          </div>
        </SideCard>
      </div>
    </div>
  );
};

/* W-25b "Credit score · How it works (modal)" (Playful 8825:998 / Focused 8826:1035; modal 8825:1694), URL `?tab=credit&modal=score`. */
export const ScoreDialog = ({ wallet }) => {
  const uid = useId();
  const close = () => {
    log('close score modal');
    wallet.update({ modal: null });
  };
  return (
    <WalletModal width="max-w-[620px]" gaps={[16, 16]} labelledBy={`${uid}-t`} onClose={close}>
      <ModalHead
        id={`${uid}-t`}
        title={SCORE_MODAL.title}
        subtitle={SCORE_MODAL.subtitle}
        art={spotScoreGauge}
        onClose={close}
      />
      <dl className="m-0 flex flex-col gap-[24px] rounded-[16px] bg-[#f4f7f2] p-[16px] font-sans text-[14px] leading-[1.2]">
        {SCORE_MODAL.weights.map(([a, b]) => (
          <div key={a} className="flex justify-between gap-[12px]">
            <dt className="font-medium text-[#1c2a21]">{a}</dt>
            <dd className="m-0 font-semibold text-[#387440]">{b}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{SCORE_MODAL.text}</p>
      <ModalButtons>
        <WalletButton onClick={() => log('connect my bank (no screen is drawn)')}>
          {SCORE_MODAL.bank}
        </WalletButton>
        <WalletButton tone="primary" onClick={close}>
          {SCORE_MODAL.ok}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default WalletCredit;
