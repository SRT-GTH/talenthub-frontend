import { debug } from '../../../../../utils/debug.js';
import ParentButton from '../../ParentButton.jsx';
import WardChip from '../WardChip.jsx';
import TabCard from './TabCard.jsx';
import TabRow from './TabRow.jsx';
import { ICONS, walletData } from './data/tabsData.js';
import { useWallets } from '../../wallets/walletsStore.js';
import { ghs, ghsShort } from '../../wallets/data/walletsData.js';

const log = debug('WalletTab');

/*
 * WalletTab — PW-12 10049:1231, content under the ward header + tabs: left column 945 (4 stat cards gap 16, "Recent payments" card) + right column 360 (gap 24).
 * Stat card: white r24 pad 20, 24/600 value, 12.5/600 label, 11.5 #575755 note. Payment chips: "Decide" is the dark #1c2a21 pill, others WardChip.
 * Right: mint #ebf1ec info card r24 pad 22 "You can see" + two secondary 3D buttons ("Top up", "Change limits").
 * Props: ward (wardsData entry), onDecide / onTopUp / onLimits (the Ward wallets dialogs, wallets/WalletsLayer; without them the buttons only log).
 * Abena's numbers and her Python Basics row come live from wallets/walletsStore (approve, decline, top-up and limits show here); the other wards keep wardsData.
 * Under 1024px the columns stack; stats go 2 x 2 under 640px.
 */
// The Python Basics row once the parent has answered it (wallets/data/walletsData requestRow wording).
const ANSWERED = {
  approved: { sub: 'Approved · paid just now', chip: { tone: 'active', label: 'Approved' } },
  declined: { sub: 'Declined · nothing charged', chip: { tone: 'pending', label: 'Declined' } },
  expired: { sub: 'Expired · nothing charged', chip: { tone: 'pending', label: 'Expired' } },
};

const Stat = ({ s }) => (
  <div className="flex min-w-0 flex-col gap-[4px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[20px] shadow-[0_5px_17px_rgba(28,42,33,0.03)]">
    <p className="m-0 font-sans text-[24px] leading-normal font-semibold text-[#1c2a21]">
      {s.value}
    </p>
    <p className="m-0 font-sans text-[12.5px] leading-normal font-semibold text-[#1c2a21]">
      {s.label}
    </p>
    <p className="m-0 font-sans text-[11.5px] leading-normal max-lg:text-[12px] text-[#575755]">
      {s.note}
    </p>
  </div>
);

const WalletTab = ({ ward, onDecide, onTopUp, onLimits }) => {
  const wallets = useWallets();
  const live = ward.id === 'abena' ? wallets.abena : null;
  const base = walletData(ward);
  const answered = live ? ANSWERED[live.request.status] : null;
  const d = live
    ? {
        ...base,
        stats: [
          { ...base.stats[0], value: ghs(live.balance) },
          { ...base.stats[1], value: String(live.cycles), note: `≈ ${ghsShort(live.cycles / 10)}` },
          base.stats[2],
          {
            ...base.stats[3],
            value: ghsShort(live.spent),
            note: `of ${ghsShort(live.limits.monthly)} limit`,
          },
        ],
        payments: base.payments.map((p) =>
          p.id === 'python' && answered
            ? { ...p, sub: `${answered.sub} · ${ghs(live.request.amount)}`, chip: answered.chip }
            : p
        ),
      }
    : base;
  log('render, ward:', ward.id, 'payments:', d.payments.length);
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-[24px] lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-col gap-[20px] lg:flex-[945_1_0]">
        <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4">
          {d.stats.map((s) => (
            <Stat key={s.label} s={s} />
          ))}
        </div>
        <TabCard title={d.paymentsTitle} id="wallet-payments-title" gap={4}>
          <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
            {d.payments.map((p, i) => (
              <TabRow
                key={p.id}
                icon={ICONS[p.icon]}
                title={p.title}
                sub={p.sub}
                last={i === d.payments.length - 1}
              >
                {p.chip.tone === 'dark' ? (
                  <button
                    type="button"
                    onClick={() => {
                      log('decide payment:', p.id);
                      onDecide?.();
                    }}
                    className="inline-flex h-[32px] shrink-0 cursor-pointer items-center rounded-full border border-solid border-[#1c2a21] bg-[#1c2a21] px-[14px] font-sans text-[13px] leading-normal font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    {p.chip.label}
                  </button>
                ) : (
                  <WardChip tone={p.chip.tone}>{p.chip.label}</WardChip>
                )}
              </TabRow>
            ))}
          </ul>
        </TabCard>
      </div>
      <aside className="flex min-w-0 flex-col items-start gap-[12px] rounded-[24px] bg-[#ebf1ec] p-[22px] lg:w-[360px] lg:shrink-0">
        <h2 className="m-0 font-sans text-[16px] leading-normal font-semibold text-[#1c2a21]">
          {d.info.title}
        </h2>
        <p className="m-0 font-sans text-[12.5px] leading-[1.5] text-[#575755]">{d.info.body}</p>
        <ParentButton
          variant="secondary"
          onClick={() => {
            log('top up', ward.id);
            onTopUp?.();
          }}
        >
          {d.info.topUp}
        </ParentButton>
        <ParentButton
          variant="secondary"
          onClick={() => {
            log('change limits', ward.id);
            onLimits?.();
          }}
        >
          {d.info.limits}
        </ParentButton>
      </aside>
    </div>
  );
};

export default WalletTab;
