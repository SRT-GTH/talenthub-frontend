import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import WardChip from './WardChip.jsx';
import iconStar from '../../../../assets/parent/ward-star.svg';
import iconBook from '../../../../assets/parent/ward-book.svg';
import iconHeart from '../../../../assets/parent/ward-heart.svg';
import iconFile from '../../../../assets/parent/ward-file.svg';
import iconEye from '../../../../assets/parent/ward-eye.svg';
import iconEyeOff from '../../../../assets/parent/ward-eye-off.svg';

const log = debug('WardOverview');

/*
 * WardOverview — the Overview tab under <WardShell>: PW-02 Abena 10034:3257 and PW-02b Elliot 10041:3643 (content differs per ward, all text comes from wardsData).
 * Four KPI cards (white r24 p18 gap, value 26/600, label 13/600, note 12 #575755), "Recent activity" head (20/600 + "All activity →" 14 green), activity card (rows py14 gap14: 40px tile #eef4ef r12 + 20px icon, title 15/600, sub 13, optional chip).
 * Side cards (PW-10 10041:4106 only, Abena): "What you can see" (#f8f8f4 r24 p22, five 13px rows with eye / eye-off) + "How flags work" (#ebf1ec r24 p22, three bullets), 360 wide.
 * Props: ward (wardsData entry), showSide (default false: PW-02 / PW-02b draw no side cards; pass showSide when notice="turning18" to match PW-10).
 * "All activity →" links to ?tab=activity. Layout: side cards sit right >= 1280px, below otherwise.
 * ⚠️ ASSUMPTION: the side cards are only drawn behind the PW-10 modal, so they are opt-in.
 */
const ICONS = { star: iconStar, book: iconBook, heart: iconHeart, file: iconFile };
const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]';

const SEE_ROWS = (w) => [
  { id: 'profile', on: true, text: 'Profile, badges and progress' },
  { id: 'assess', on: true, text: 'Assessment results (you can flag)' },
  { id: 'wallet', on: true, text: 'Wallet balance and payment requests' },
  { id: 'chat', on: false, text: `${cap(w.possessive)} private chats with Career Buddy` },
  { id: 'clubs', on: false, text: `${cap(w.possessive)} messages in clubs` },
];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SideCards = ({ ward }) => (
  <aside className="flex w-full flex-col gap-[16px] xl:w-[360px] xl:shrink-0">
    <section className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[22px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]">
      <h3 className="m-0 font-sans text-[18px] leading-normal font-semibold text-[#1c2a21]">
        What you can see
      </h3>
      {SEE_ROWS(ward).map((r) => (
        <p
          key={r.id}
          className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-normal text-[#1c2a21]"
        >
          <img src={r.on ? iconEye : iconEyeOff} alt="" className="size-[16px] shrink-0" />
          {r.text}
        </p>
      ))}
    </section>
    <section className="flex flex-col gap-[14px] rounded-[24px] bg-[#ebf1ec] p-[22px] text-[#1c2a21]">
      <h3 className="m-0 font-sans text-[18px] leading-normal font-semibold">How flags work</h3>
      <p className="m-0 font-sans text-[13px] leading-normal">
        • You flag, {ward.firstName} fixes. Parents can’t edit a ward’s profile.
      </p>
      <p className="m-0 font-sans text-[13px] leading-normal">
        • Flagged fields are hidden from recruiters until you approve the fix.
      </p>
      <p className="m-0 font-sans text-[13px] leading-normal">
        • {ward.firstName} gets a notification within 5 minutes.
      </p>
    </section>
  </aside>
);

const WardOverview = ({ ward, showSide = false }) => {
  const side = showSide;
  log('render', { ward: ward.id, kpis: ward.kpis.length, activity: ward.activity.length, side });

  return (
    <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
        <div className="grid grid-cols-2 gap-[16px] lg:grid-cols-4">
          {ward.kpis.map((k) => (
            <div key={k.label} className={`flex min-w-0 flex-col gap-[4px] p-[18px] ${CARD}`}>
              <p className="m-0 font-sans text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
                {k.value}
              </p>
              <p className="m-0 font-sans text-[13px] leading-normal font-semibold text-[#1c2a21]">
                {k.label}
              </p>
              <p className="m-0 font-sans text-[12px] leading-normal text-[#575755]">{k.note}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-[12px]">
          <h2 className="m-0 font-sans text-[20px] leading-[1.25] font-semibold tracking-[-0.1px] text-[#1c2a21]">
            Recent activity
          </h2>
          <Link
            to={{ search: '?tab=activity' }}
            onClick={() => log('All activity')}
            className="rounded-[4px] font-sans text-[14px] leading-normal font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            All activity →
          </Link>
        </div>

        <ul className={`m-0 flex list-none flex-col gap-[16px] px-[22px] py-[8px] ${CARD}`}>
          {ward.activity.map((a, i) => (
            <li
              key={a.id}
              className={`flex items-center gap-[14px] py-[14px] ${
                i === ward.activity.length - 1 ? '' : 'border-b border-solid border-[#eeeee9]'
              }`}
            >
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ef]">
                <img src={ICONS[a.icon]} alt="" className="size-[20px]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-normal">
                <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">{a.title}</p>
                <p className="m-0 font-sans text-[13px] text-[#575755]">{a.sub}</p>
              </div>
              {a.chip && <WardChip tone="pending">{a.chip}</WardChip>}
            </li>
          ))}
        </ul>
      </div>
      {side && <SideCards ward={ward} />}
    </div>
  );
};

export default WardOverview;
