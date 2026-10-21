import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { MONTH_SUMMARY, STATEMENTS, TRANSACTIONS, TRANSACTION_FILTERS } from './walletData.js';
import { HEADING, PLAIN_CARD, TxRow } from './walletUi.jsx';

const log = debug('WalletTransactions');

// Which transactions each filter chip keeps. `Pending` has none in the drawn data.
const FILTERS = {
  All: () => true,
  'Money in': (t) => t.money === 'in' && t.status !== 'Cycles',
  'Money out': (t) => t.money === 'out',
  Cycles: (t) => t.status === 'Cycles',
  Pending: () => false,
};

const groupByMonth = (rows) =>
  rows.reduce((acc, t) => {
    const last = acc[acc.length - 1];
    if (last && last.group === t.group) last.rows.push(t);
    else acc.push({ group: t.group, rows: [t] });
    return acc;
  }, []);

const SideCard = ({ title, children }) => (
  <section
    aria-label={title}
    className={classNames(PLAIN_CARD, 'flex flex-col gap-[20px] p-[18px]')}
  >
    <h2 className={classNames(HEADING, 'm-0 text-[18px] leading-[1.25] text-[#1c2a21]')}>
      {title}
    </h2>
    {children}
  </section>
);

/*
 * WalletTransactions — W-12 "Transactions · All" (Playful 8820:7035 / Focused 8820:472421; Main Content Canvas 8820:7043 / 8820:472421's child).
 * Filter chips + month-grouped list | Statements + "October so far" cards. A row opens the receipt drawer (`&tx=<id>`, W-13).
 * Props: wallet (useTalentWalletState()).
 */
const WalletTransactions = ({ wallet }) => {
  const filter = TRANSACTION_FILTERS.includes(wallet.filter) ? wallet.filter : 'All';
  const rows = TRANSACTIONS.filter(FILTERS[filter]);
  const groups = groupByMonth(rows);
  log('render', { filter, rows: rows.length });

  return (
    <div className="grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]">
      <div className="flex min-w-0 flex-col gap-[18px]">
        <div
          role="group"
          aria-label="Filter transactions"
          className="flex flex-wrap items-center gap-[8px]"
        >
          {TRANSACTION_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === filter}
              onClick={() => {
                log('filter ->', f);
                wallet.update({ filter: f === 'All' ? null : f });
              }}
              className={classNames(
                'inline-flex min-h-[24px] cursor-pointer items-center rounded-full border-0 px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2]',
                FOCUS_RING,
                f === filter ? 'bg-[#1c2a21] text-white' : 'bg-[#f1f1ee] text-[#575755]'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <section
          aria-label="Transactions"
          className={classNames(PLAIN_CARD, 'flex flex-col gap-[12px] p-[18px]')}
        >
          {groups.length
            ? groups.map((g) => (
                <div key={g.group} className="contents">
                  <p className="m-0 font-sans text-[13px] font-semibold uppercase leading-[1.2] tracking-[0.78px] text-[#575755]">
                    {g.group}
                  </p>
                  <div className="contents">
                    {g.rows.map((tx) => (
                      <TxRow
                        key={tx.id}
                        tx={tx}
                        onOpen={
                          tx.hasReceipt
                            ? (id) => {
                                log('open receipt', id);
                                wallet.update({ tx: id });
                              }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
            : null}
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-[16px]">
        <SideCard title={STATEMENTS.title}>
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
            {STATEMENTS.note}
          </p>
          {STATEMENTS.rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-[12px] font-sans text-[14px] font-semibold leading-[1.2]"
            >
              <span className="text-[#1c2a21]">{r.label}</span>
              <button
                type="button"
                aria-label={`${r.action} ${r.label} statement`}
                onClick={() => log('download statement (mock, nothing is downloaded)', r.id)}
                className={classNames(
                  'min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440]',
                  FOCUS_RING
                )}
              >
                {r.action}
              </button>
            </div>
          ))}
        </SideCard>
        <SideCard title={MONTH_SUMMARY.title}>
          {MONTH_SUMMARY.rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-[12px] whitespace-nowrap"
            >
              <span className="font-sans text-[14px] leading-[1.2] text-[#575755]">{r.label}</span>
              <span
                className={classNames(
                  'font-sans text-[15px] font-semibold leading-[1.2]',
                  r.tone === 'in' ? 'text-[#387440]' : 'text-[#1c2a21]'
                )}
              >
                {r.value}
              </span>
            </div>
          ))}
        </SideCard>
      </div>
    </div>
  );
};

export default WalletTransactions;
