import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import WardChip from '../wards/WardChip.jsx';
import TabRow from '../wards/tabs/TabRow.jsx';
import refreshIcon from '../../../../assets/parent/wards-refresh.svg';
import { CORRECTION_ROW, EMPTY_TAB, ITEMS } from './data/reviewData.js';

const log = debug('ReviewQueue');

/*
 * ReviewQueue — the white queue card of the To review tabs (Figma "Queue" 10034:145275: r24, #e7e7e7 hairline, soft shadow, p 8 / 22, gap14) with one row per waiting thing:
 * mint icon tile + 15/600 title over a 13 #575755 line + the ward chip + a small 3D button (r10, 18 x 12) — certificate "Review", evaluation "Review", correction "Check", payment "Decide".
 * Props: rows [{ kind: 'certificate' | 'evaluation' | 'correction' | 'payment', flag? }], ward (for the correction line), label (the list's accessible name),
 * hrefFor(kind, flag) -> a link for a row's button (omit to use onAction), onAction(kind, flag).
 * An empty list shows EMPTY_TAB (⚠️ ASSUMPTION, the same note as the corrections tab; no empty frame is drawn for a single tab).
 * ⚠️ ASSUMPTION: the payment "Decide" button only logs (no payment decision screen is drawn in this canvas).
 */
const ReviewQueue = ({ rows, ward, label, hrefFor, onAction }) => {
  log('render', { rows: rows.map((r) => r.kind) });
  return (
    <section
      aria-label={label}
      className="flex flex-col rounded-[24px] border border-solid border-black-light bg-white px-[22px] py-[8px] shadow-[0_5px_17px_rgba(28,42,33,0.03)] max-sm:px-[14px]"
    >
      {rows.length === 0 ? (
        <p className="m-0 py-[22px] font-sans text-[15px] leading-[18px] text-[#575755]">
          {EMPTY_TAB}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
          {rows.map((row, i) => {
            const item = row.kind === 'correction' ? CORRECTION_ROW : ITEMS[row.kind];
            const title = row.kind === 'correction' ? item.title(row.flag) : item.title;
            const sub = row.kind === 'correction' ? item.sub(row.flag, ward) : item.sub;
            const icon = row.kind === 'correction' ? refreshIcon : item.icon;
            const to = hrefFor?.(row.kind, row.flag);
            return (
              <TabRow
                key={`${row.kind}-${row.flag?.id ?? ''}`}
                size="roomy"
                icon={icon}
                title={title}
                sub={sub}
                last={i === rows.length - 1}
              >
                <WardChip tone="pending">{item.chip}</WardChip>
                <Button
                  variant="primary"
                  size="sm"
                  to={to}
                  className="!px-[16px] !pt-[11px] !pb-[10px]"
                  onClick={() => {
                    log('row action', { kind: row.kind });
                    onAction?.(row.kind, row.flag);
                  }}
                >
                  {item.action}
                </Button>
              </TabRow>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ReviewQueue;
