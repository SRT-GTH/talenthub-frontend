import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { WalletStarIcon } from '../../shared/assets.jsx';
import spotGraduation from '../../../assets/talent-wallet/spot-graduation.svg';
import spotPending from '../../../assets/talent-wallet/spot-pending.svg';
import spotCelebrate from '../../../assets/talent-wallet/spot-celebrate.svg';
import spotReadiness from '../../../assets/talent-wallet/spot-readiness.svg';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import {
  FIN_APPLY,
  FIN_DECLINED,
  FIN_LANDING,
  FIN_LOAN,
  FIN_OFFER,
  FIN_RECEIVED,
} from './walletFinancingData.js';
import { WalletField } from './WalletDialogParts.jsx';
import {
  CreditMiniCard,
  GreenLink,
  HeroCard,
  HeroHead,
  InfoTile,
  Progress,
  RowsBox,
  SectionHead,
  SideCard,
  TimelineRow,
} from './WalletPanels.jsx';
import {
  CAPS_LABEL,
  HEADING,
  HERO_CARD,
  PLAIN_CARD,
  StatusChip,
  StyleText,
  TxRow,
  WalletButton,
} from './walletUi.jsx';

const log = debug('WalletFinancing');

const COLUMNS = 'grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]';

const TermTile = ({ label, value, big = false }) => (
  <InfoTile className="flex flex-col gap-[4px] !rounded-[14px] !p-[14px]">
    <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">{label}</span>
    <span
      className={classNames(
        'font-sans font-semibold leading-[1.2] text-[#1c2a21]',
        big ? 'text-[16px]' : 'text-[15px]'
      )}
    >
      {value}
    </span>
  </InfoTile>
);

const GreenCard = ({ label, gap = 24, children, ...rest }) => (
  <section
    {...rest}
    className={classNames(
      'flex flex-col rounded-[24px] bg-[#387440] p-[22px] text-white',
      gap === 20 ? 'gap-[20px]' : 'gap-[24px]',
      HERO_CARD
    )}
  >
    <p className={classNames(CAPS_LABEL, 'm-0')}>{label}</p>
    {children}
  </section>
);

/* W-20 "Financing · Fund your training" (Playful 8824:99 / Focused 8824:467370), URL `?tab=financing`. */
const Landing = ({ wallet }) => {
  const l = FIN_LANDING;
  return (
    <div className={COLUMNS}>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <HeroCard gap={16} aria-label="Fund your training">
          <HeroHead
            art={spotGraduation}
            wide
            artChipGap
            headGap={15}
            chip={{ tone: 'ok', text: l.chip }}
            title={<StyleText focused={l.titleFocused} playful={l.title} />}
            titleClass="text-[clamp(26px,1.85vw,32px)] tracking-[-0.02em]"
            text={l.text}
          />
          <div className="grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
            {l.terms.map((t) => (
              <TermTile key={t.id} label={t.label} value={t.value} />
            ))}
          </div>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton tone="primary" onClick={() => wallet.update({ stage: 'apply' })}>
              {l.apply}
            </WalletButton>
            <WalletButton onClick={() => log('how it works (no screen is drawn)')}>
              {l.how}
            </WalletButton>
          </div>
        </HeroCard>
        <SectionHead
          title={l.courses.title}
          sticker={l.courses.sticker}
          link={l.courses.link}
          onLink={() => log('from your matches (no screen is drawn)')}
        />
        <section
          aria-label={l.courses.title}
          className={classNames(PLAIN_CARD, 'flex flex-col gap-0 p-[19px] playful:gap-[8px]')}
        >
          {l.courses.rows.map((r) => (
            <TxRow
              key={r.id}
              tx={{
                kind: 'book',
                title: r.title,
                meta: r.meta,
                amount: r.price,
                money: 'out',
                status: l.courses.chip,
                tone: 'ok',
              }}
            />
          ))}
        </section>
      </div>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <CreditMiniCard />
      </div>
    </div>
  );
};

/* W-21 "Financing · Application" (Playful 8824:980 / Focused 8824:468189), URL `?tab=financing&stage=apply`. */
const Apply = ({ wallet }) => {
  const a = FIN_APPLY;
  const [course, setCourse] = useState(a.course.value);
  const [fee, setFee] = useState(a.fee.value);
  const [purpose, setPurpose] = useState(a.purposes[0]);
  const [repay, setRepay] = useState('after');
  const [income, setIncome] = useState(a.income.value);
  return (
    <div className={COLUMNS}>
      <HeroCard gap={24} aria-label={a.title} className="min-w-0 self-start">
        <div className="contents">
          <h2 className={classNames(HEADING, 'm-0 text-[28px] leading-[1.25] text-[#1c2a21]')}>
            {a.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[1.2] text-[#575755]">{a.text}</p>
        </div>
        <div className="grid gap-[16px] md:grid-cols-2">
          <WalletField
            label={a.course.label}
            value={course}
            onChange={setCourse}
            hint={a.course.hint}
          />
          <WalletField
            label={a.fee.label}
            value={fee}
            onChange={setFee}
            hint={a.fee.hint}
            inputMode="decimal"
          />
        </div>
        <div className="contents">
          <p className="m-0 font-sans text-[13px] font-semibold leading-[1.2] text-[#575755]">
            {a.purposeLabel}
          </p>
          <div role="radiogroup" aria-label={a.purposeLabel} className="flex flex-wrap gap-[8px]">
            {a.purposes.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={p === purpose}
                onClick={() => setPurpose(p)}
                className={classNames(
                  'inline-flex min-h-[24px] cursor-pointer items-center rounded-full border-0 px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2]',
                  FOCUS_RING,
                  p === purpose ? 'bg-[#1c2a21] text-white' : 'bg-[#f1f1ee] text-[#575755]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="contents">
          <p className="m-0 font-sans text-[13px] font-semibold leading-[1.2] text-[#575755]">
            {a.repayLabel}
          </p>
          <div
            role="radiogroup"
            aria-label={a.repayLabel}
            className="grid gap-[12px] md:grid-cols-3"
          >
            {a.repay.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={r.id === repay}
                aria-label={`${r.title}, ${r.note}`}
                onClick={() => setRepay(r.id)}
                className={classNames(
                  'flex cursor-pointer flex-col gap-[4px] rounded-[14px] border border-solid p-[14px] text-left',
                  FOCUS_RING,
                  r.id === repay ? 'border-[#387455] bg-[#eef6f0]' : 'border-[#e3e5de] bg-white'
                )}
              >
                <span className="font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
                  {r.title}
                </span>
                <span
                  aria-hidden="true"
                  data-note={r.note}
                  className="font-sans text-[13px] leading-[1.2] text-[#575755] after:content-[attr(data-note)]"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="md:max-w-[435px]">
          <WalletField
            label={a.income.label}
            required={false}
            value={income}
            onChange={setIncome}
            hint={a.income.hint}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{a.agree}</p>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton onClick={() => log('save for later (no destination in the prototype)')}>
              {a.save}
            </WalletButton>
            <WalletButton
              tone="primary"
              onClick={() => {
                // Figma prototype: "Submit application" → W-22
                log('submit application (mock)');
                wallet.update({ stage: 'received' });
              }}
            >
              {a.submit}
            </WalletButton>
          </div>
        </div>
      </HeroCard>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <GreenCard label={a.estimate.label} gap={20} aria-label={a.estimate.label}>
          <p className={classNames(HEADING, 'm-0 text-[28px] leading-[1.25]')}>
            {a.estimate.value}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[1.2]">{a.estimate.text}</p>
          <p className="m-0 font-sans text-[13px] font-semibold leading-[1.2]">{a.estimate.note}</p>
        </GreenCard>
        <CreditMiniCard />
      </div>
    </div>
  );
};

/* W-22 "Application received" (Playful 8824:1835 / Focused 8824:469029), URL `?tab=financing&stage=received`. */
const Received = () => {
  const r = FIN_RECEIVED;
  return (
    <div className={COLUMNS}>
      <HeroCard gap={[20, 14]} aria-label={r.title} className="min-w-0 self-start">
        <HeroHead
          art={spotPending}
          wide
          headGap={14}
          chip={{ tone: 'warn', text: r.chip }}
          title={r.title}
          titleClass="text-[30px] tracking-[-0.02em]"
          text={r.text}
        />
        <div className="flex flex-col gap-[20px]">
          {r.timeline.map((t) => (
            <TimelineRow
              key={t.id}
              dot={t.dot}
              label={t.label}
              note={t.note}
              labelClass="text-[#2d5d33]"
            />
          ))}
        </div>
        <div>
          <WalletButton
            onClick={() => log('withdraw application (no destination in the prototype)')}
          >
            {r.withdraw}
          </WalletButton>
        </div>
      </HeroCard>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <CreditMiniCard />
      </div>
    </div>
  );
};

/* W-23 "Loan offer" (Playful 8824:2572 / Focused 8824:469756), URL `?tab=financing&stage=offer`. */
const Offer = ({ wallet }) => {
  const o = FIN_OFFER;
  return (
    <div className={COLUMNS}>
      <HeroCard gap={18} aria-label={o.title} className="min-w-0 self-start">
        <HeroHead
          art={spotCelebrate}
          wide
          headGap={18}
          chip={{ tone: 'ok', text: o.chip }}
          title={o.title}
          titleClass="text-[clamp(26px,1.85vw,32px)] tracking-[-0.02em]"
          text={o.text}
        />
        <div className="grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {o.terms.map((t) => (
            <TermTile key={t.id} label={t.label} value={t.value} big />
          ))}
        </div>
        <div className="flex items-start gap-[12px] rounded-[14px] bg-[#fff8e1] p-[16px]">
          <WalletStarIcon className="size-[22px] shrink-0 text-[#c8951a]" />
          <p className="m-0 font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
            {o.learn}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          <GreenLink onClick={() => log('read the loan agreement (mock, nothing is downloaded)')}>
            {o.agreement}
          </GreenLink>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton onClick={() => wallet.update({ stage: null })}>{o.decline}</WalletButton>
            <WalletButton
              tone="primary"
              onClick={() => {
                // Figma prototype: "Accept and pay AmaliTech" → W-24
                log('accept offer (mock)');
                wallet.update({ stage: 'loan' });
              }}
            >
              {o.accept}
            </WalletButton>
          </div>
        </div>
      </HeroCard>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <SideCard title={o.plan.title} gap={[16, 14]} aria-label={o.plan.title}>
          <RowsBox rows={o.plan.rows} gap={20} />
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{o.plan.note}</p>
        </SideCard>
      </div>
    </div>
  );
};

/* W-23b "Not approved yet" (Playful 8824:3324 / Focused 8824:470498), URL `?tab=financing&stage=declined`. */
const Declined = ({ wallet }) => {
  const d = FIN_DECLINED;
  return (
    <div className={COLUMNS}>
      <HeroCard gap={20} aria-label={d.title} className="min-w-0 self-start">
        <HeroHead
          art={spotReadiness}
          wide
          headGap={20}
          chip={{ tone: 'bad', text: d.chip }}
          title={<StyleText focused={d.titleFocused} playful={d.title} />}
          titleClass="text-[30px] tracking-[-0.02em]"
          text={d.text}
        />
        <p className="m-0 font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
          {d.fastest}
        </p>
        {d.ways.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between gap-[12px] rounded-[14px] bg-[#f4f7f2] px-[12px] py-[16px]"
          >
            <span className="font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
              {w.text}
            </span>
            <StatusChip tone="ok">{w.chip}</StatusChip>
          </div>
        ))}
        <div className="flex flex-wrap gap-[12px]">
          <WalletButton
            tone="primary"
            onClick={() => wallet.update({ tab: 'credit', stage: null })}
          >
            {d.score}
          </WalletButton>
          <WalletButton
            onClick={() => log('fund a smaller course (no destination in the prototype)')}
          >
            {d.smaller}
          </WalletButton>
        </div>
      </HeroCard>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <GreenCard label={d.other.label} aria-label={d.other.label}>
          <p className="m-0 font-sans text-[14px] font-medium leading-[1.2]">{d.other.text}</p>
          <button
            type="button"
            onClick={() => log('see scholarships (no screen is drawn)')}
            className={classNames(
              'min-h-[24px] w-fit cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[1.2] text-white',
              FOCUS_RING
            )}
          >
            {d.other.link}
          </button>
        </GreenCard>
      </div>
    </div>
  );
};

/* W-24 "Financing · My loan" (Playful 8824:4086 / Focused 8824:471250), URL `?tab=financing&stage=loan`. */
const Loan = () => {
  const l = FIN_LOAN;
  return (
    <div className={COLUMNS}>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <HeroCard gap={20} aria-label={l.label}>
          <p className={classNames(CAPS_LABEL, 'm-0 text-[#387440]')}>{l.label}</p>
          <div className="flex flex-wrap items-end gap-x-[10px] gap-y-[2px]">
            <span
              className={classNames(
                HEADING,
                'text-[clamp(32px,2.3vw,40px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
              )}
            >
              {l.left}
            </span>
            <span className="font-sans text-[15px] leading-[1.2] text-[#575755]">{l.of}</span>
          </div>
          <Progress value={l.progress} fill="#387455" height={12} className="max-w-[880px]" />
          <div className="grid gap-[14px] md:grid-cols-3">
            {l.stats.map((s) => (
              <TermTile key={s.id} label={s.label} value={s.value} />
            ))}
          </div>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton tone="primary" onClick={() => log('pay early (no screen is drawn)')}>
              {l.actions.early}
            </WalletButton>
            <WalletButton onClick={() => log('change repayment plan (no screen is drawn)')}>
              {l.actions.change}
            </WalletButton>
            <WalletButton onClick={() => log('pause payments (no screen is drawn)')}>
              {l.actions.pause}
            </WalletButton>
          </div>
        </HeroCard>
        <SectionHead
          title={l.activity.title}
          sticker={l.activity.sticker}
          link={l.activity.link}
          onLink={() => log('statement (mock)')}
        />
        <section
          aria-label={l.activity.title}
          className={classNames(PLAIN_CARD, 'flex flex-col gap-[8px] p-[19px]')}
        >
          {l.activity.rows.map((r) => (
            <TxRow
              key={r.id}
              tx={
                r.metaFocused
                  ? { ...r, meta: <StyleText focused={r.metaFocused} playful={r.meta} /> }
                  : r
              }
            />
          ))}
        </section>
      </div>
      <div className="flex min-w-0 flex-col gap-[16px]">
        <SideCard title={l.upcoming.title} gap={20} aria-label={l.upcoming.title}>
          <RowsBox rows={l.upcoming.rows} />
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
            {l.upcoming.note}
          </p>
        </SideCard>
        <CreditMiniCard />
      </div>
    </div>
  );
};

const STAGES = { apply: Apply, received: Received, offer: Offer, declined: Declined, loan: Loan };

/*
 * WalletFinancing — the Financing tab (Figma W-20 … W-24, canvas 8824:98), `?tab=financing[&stage=apply|received|offer|declined|loan]`.
 * Mock only. Built from the node tree + exports (the node-level style data could not be fetched, Figma limit) — see wiki/talent-wallet.md.
 * Props: wallet (useTalentWalletState()).
 */
const WalletFinancing = ({ wallet }) => {
  const Stage = STAGES[wallet.stage] ?? Landing;
  log('render', { stage: wallet.stage });
  return <Stage wallet={wallet} />;
};

export default WalletFinancing;
