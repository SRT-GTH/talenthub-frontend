import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import WardChip from './WardChip.jsx';
import { STATUS_LEGEND, WARD_LIST, WARDS_SUBTITLE, WARDS_TITLE } from './data/wardsData.js';

const log = debug('WardsAll');

/*
 * WardsAll — PW-01 "My wards · All" (Figma 10033:5115). Renders ONLY the main column (the page supplies <ParentFrame active="wards">).
 * Column 1329 wide, gap 24: title row (34/600 "My wards" + 16 #999 subtitle, "Link another ward" secondary 3D button right),
 * "Ward table" card (white, r24, px22 py8, rows py14 gap14: avatar 40 + name/line + chip + action link), "Statuses" legend (#ebf1ec r24 p22, three 360-wide notes).
 * Props: onLink (optional, defaults to log). Rows link to /parent/wards/:id (pending ward: "Resend" only logs).
 * ⚠️ ASSUMPTION: the "Opted out" legend chip is only a legend (no ward is opted out in the mock); "Link another ward" only logs.
 * Legend wraps to a column below 1024px; rows wrap their chip under the text on phones.
 */
const WardRow = ({ ward, last }) => {
  const pending = ward.status === 'pending';
  const opted = Boolean(ward.optedOut);
  const linkCls =
    'shrink-0 rounded-[4px] font-sans text-[14px] leading-normal font-semibold whitespace-nowrap text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
  return (
    <li
      className={`flex flex-wrap items-center gap-x-[14px] gap-y-[8px] py-[14px] ${
        last ? '' : 'border-b border-solid border-[#eeeee9]'
      }`}
    >
      <img
        src={ward.photo}
        alt=""
        width="40"
        height="40"
        className="size-[40px] shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-[200px] flex-1 flex-col gap-[3px] leading-normal">
        <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
          {ward.name} · {ward.relation}
        </p>
        <p className="m-0 font-sans text-[13px] text-[#575755]">{ward.listLine}</p>
      </div>
      <WardChip tone={pending ? 'pending' : opted ? 'opted' : 'active'}>
        {pending ? 'Pending link' : opted ? 'Opted out' : 'Active'}
      </WardChip>
      {pending ? (
        <button
          type="button"
          onClick={() => log('Resend link request:', ward.id)}
          className={`cursor-pointer border-0 bg-transparent p-0 ${linkCls}`}
        >
          {ward.action}
        </button>
      ) : (
        <Link
          to={`/parent/wards/${ward.id}`}
          onClick={() => log('open ward:', ward.id)}
          className={linkCls}
        >
          {ward.action}
        </Link>
      )}
    </li>
  );
};

// Live passes `wards` (parentLiveView wardView rows) and `empty` copy for a parent with no ward yet.
const WardsAll = ({ onLink, hide = [], wards = WARD_LIST, empty }) => {
  const list = wards.filter((w) => !hide.includes(w.id));
  log('render, wards:', list.length);
  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <div className="flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[16px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
            {WARDS_TITLE}
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
            {WARDS_SUBTITLE}
          </p>
        </div>
        <ParentButton
          variant="secondary"
          onClick={() => {
            log('Link another ward');
            onLink?.();
          }}
        >
          Link another ward
        </ParentButton>
      </div>

      <div className="flex flex-col gap-[20px]">
        <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[22px] py-[8px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]">
          {list.length === 0 && empty ? (
            <li className="py-[14px] font-sans text-[15px] leading-normal text-[#575755]">
              {empty}
            </li>
          ) : null}
          {list.map((w, i) => (
            <WardRow key={w.id} ward={w} last={i === list.length - 1} />
          ))}
        </ul>

        <section
          aria-label="Ward statuses"
          className="grid grid-cols-1 gap-[20px] rounded-[24px] bg-[#ebf1ec] p-[22px] lg:min-h-[100px] lg:grid-cols-3 lg:items-center lg:gap-[clamp(24px,6.5vw,112px)]"
        >
          {STATUS_LEGEND.map((s) => (
            <div key={s.id} className="flex flex-col items-start gap-[6px]">
              <WardChip
                tone={s.id === 'opted' ? 'opted' : s.id === 'pending' ? 'pending' : 'active'}
              >
                {s.chip}
              </WardChip>
              <p className="m-0 max-w-[360px] font-sans text-[13px] leading-normal text-[#575755]">
                {s.text}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default WardsAll;
