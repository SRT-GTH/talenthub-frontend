import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import WardChip from '../wards/WardChip.jsx';
import TabRow from '../wards/tabs/TabRow.jsx';
import refreshIcon from '../../../../assets/parent/wards-refresh.svg';
import flagTileIcon from '../../../../assets/parent/flag-tile.svg';
import checkCircleIcon from '../../../../assets/parent/wards-check-circle.svg';
import { FLAGS_COPY, SEVERITIES, STATUS_KEY, STATUS_LABEL } from './data/flagsData.js';

const log = debug('WardFlagsTab');

/*
 * WardFlagsTab — the Flags tab, PW-05 "Ward · Flags tracker" (Figma 10034:140037): left a white card (r24, p 8 / 22, gap 14) of flag rows — a 40px #eef4ef tile (r12) with a 20px icon, the field name 15/600 over
 * a 13 #575755 line, a status chip, and the green "Review fix" button (r10, p 12 / 18) only on a corrected flag; right a 360px "Flag statuses" key card (r24, p22) with the four chips and one line each.
 * Props: ward ({ firstName }), flags (flagsStore flags), onReview(flag) — opens the PW-06 dialog.
 * Layout: key card right from 1280px, below the list otherwise. Status chip: white for Pending / Corrected / Re-reviewing, green for Approved (same chips as the Profile tab).
 */
const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]';
const ICONS = { refresh: refreshIcon, flag: flagTileIcon, check: checkCircleIcon };

const StatusChip = ({ status }) => (
  <WardChip tone={status === 'approved' ? 'active' : 'pending'}>{STATUS_LABEL[status]}</WardChip>
);

const rowSub = (flag, ward) => {
  const severity = SEVERITIES.find((s) => s.id === flag.severity) ?? SEVERITIES[1];
  return FLAGS_COPY.rowSub[flag.status](flag, ward, severity);
};

const WardFlagsTab = ({ ward, flags, onReview }) => {
  log('render', { flags: flags.length });

  return (
    <div className="flex flex-col items-start gap-[24px] min-[1280px]:flex-row">
      <section
        id="flags-list"
        tabIndex={-1}
        aria-label="Flags"
        className={`flex w-full min-w-0 flex-1 flex-col gap-[14px] px-[22px] py-[8px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-sm:px-[14px] ${CARD}`}
      >
        <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
          {flags.map((flag, i) => (
            <TabRow
              key={flag.id}
              size="roomy"
              icon={ICONS[flag.icon]}
              title={flag.label}
              sub={rowSub(flag, ward)}
              last={i === flags.length - 1}
            >
              <StatusChip status={flag.status} />
              {flag.status === 'corrected' ? (
                <ParentButton
                  className="!rounded-[10px] !px-[18px] !py-[12px]"
                  onClick={() => {
                    log('review fix', { flag: flag.id });
                    onReview(flag);
                  }}
                >
                  Review fix
                </ParentButton>
              ) : null}
            </TabRow>
          ))}
        </ul>
      </section>

      <aside
        aria-label={FLAGS_COPY.keyTitle}
        className={`flex w-full shrink-0 flex-col gap-[14px] p-[22px] min-[1280px]:w-[360px] ${CARD}`}
      >
        <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
          {FLAGS_COPY.keyTitle}
        </h3>
        {STATUS_KEY.map((row) => (
          <div key={row.status} className="flex flex-col items-start gap-[4px]">
            <StatusChip status={row.status} />
            <span className="font-sans text-[12px] leading-[14px] text-[#575755]">
              {row.text.replace('Abena', ward.firstName)}
            </span>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default WardFlagsTab;
