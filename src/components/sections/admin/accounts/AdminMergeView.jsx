import { useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import AgencyPageHero from '../../agency/AgencyPageHero.jsx';
import { PRIMARY_ID, SECONDARY_ID, MERGE } from './data/adminMergeData.js';

const log = debug('AdminMergeView');

/*
 * AdminMergeView — /admin/accounts/merge (Figma 7.1.5a 8625:6980 adults, 7.1.5c 8666:10792 minors): green hero "Merge accounts" (+ the white "Merge accounts" action) ·
 * breadcrumb "Accounts › Merge accounts" · title 34/41 600 with the two account pills (green dot "TAL-118-2093 · primary", orange dot "TAL-311-0442 · secondary", 14/600,
 * ✕) and the dashed "Swap primary" · the "Fields" card (white, 1px #e7e7e7, r24): "Conflicts are highlighted", the column heads and one row per field with the two
 * values (18/500) and a 8px track whose bar is green (primary) / orange (secondary).
 * Props: variant 'adults' | 'minors', onMerge().
 * ⚠️ ASSUMPTION: "Swap primary" exchanges the two columns; the ✕ on a pill only logs (no flow drawn); the bars are decoration copied from Figma.
 */

const Dot = ({ color }) => (
  <span
    aria-hidden="true"
    className="size-[10px] shrink-0 rounded-full"
    style={{ background: color }}
  />
);

const Cell = ({ value, fill, color }) => (
  <div className="flex min-w-0 flex-col gap-[6px]">
    <span className="font-sans text-[18px] leading-[21px] font-medium break-words text-[#1c2a21]">
      {value}
    </span>
    <span aria-hidden="true" className="block h-[8px] overflow-hidden rounded-[4px] bg-[#efefea]">
      <span
        className="block h-full rounded-[4px]"
        style={{ width: `${Math.round(fill * 100)}%`, background: color }}
      />
    </span>
  </div>
);

const GREEN = '#387440';
const ORANGE = '#eb6834';

const AdminMergeView = ({ variant = 'adults', onMerge }) => {
  const [swapped, setSwapped] = useState(false);
  const m = MERGE[variant];
  const ids = swapped ? [SECONDARY_ID, PRIMARY_ID] : [PRIMARY_ID, SECONDARY_ID];
  return (
    <>
      <AgencyPageHero
        title="Merge accounts"
        subtitle={m.sub}
        actions={<AgencyButton onClick={onMerge}>Merge accounts</AgencyButton>}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-[8px] font-sans text-[14px] leading-[17px]"
      >
        <Link
          to="/admin/accounts"
          className="font-semibold text-[#387440] no-underline hover:underline"
        >
          Accounts
        </Link>
        <span aria-hidden="true" className="text-[#595959]">
          ›
        </span>
        <span aria-current="page" className="font-medium text-[#1c2a21]">
          Merge accounts
        </span>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <h2 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
          Merge accounts
        </h2>
        <div className="flex flex-wrap items-center gap-[10px]">
          {[
            { id: ids[0], role: 'primary', color: GREEN },
            { id: ids[1], role: 'secondary', color: ORANGE },
          ].map((p) => (
            <span
              key={p.role}
              className="inline-flex items-center gap-[8px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[14px] py-[9px] font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
            >
              <Dot color={p.color} />
              {p.id} · {p.role}
              <button
                type="button"
                aria-label={`Remove ${p.id}`}
                onClick={() => log('remove account (no flow drawn)', p.id)}
                className="cursor-pointer border-0 bg-transparent p-0 text-[11px] leading-[13px] font-bold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                ✕
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setSwapped((s) => !s)}
            className="inline-flex cursor-pointer items-center rounded-full border border-dashed border-[#387440] bg-transparent px-[14px] py-[9px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Swap primary
          </button>
        </div>
      </div>
      <section
        aria-label="Fields"
        className="overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white"
      >
        <header className="flex items-center justify-between gap-[12px] px-[24px] pt-[20px] pb-[16px]">
          <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
            Fields
          </h3>
          <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
            Conflicts are highlighted
          </span>
        </header>
        <div role="table" aria-label="Account fields" className="px-[24px] pb-[20px]">
          <div
            role="row"
            className="grid grid-cols-[minmax(80px,0.5fr)_1fr_1fr] gap-x-[24px] px-[8px] pt-[8px] pb-[8px] font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21] md:grid-cols-[240px_1fr_1fr]"
          >
            <span role="columnheader" className="text-[12px] leading-[14px] text-[#595959]">
              FIELD
            </span>
            {[
              { id: ids[0], role: 'primary', color: GREEN },
              { id: ids[1], role: 'secondary', color: ORANGE },
            ].map((p) => (
              <span key={p.role} role="columnheader" className="flex items-center gap-[8px]">
                <Dot color={p.color} />
                {p.id} · {p.role}
              </span>
            ))}
          </div>
          {m.rows.map((r) => {
            const left = swapped ? { v: r.b, f: r.fb } : { v: r.a, f: r.fa };
            const right = swapped ? { v: r.a, f: r.fa } : { v: r.b, f: r.fb };
            return (
              <div
                key={r.field}
                role="row"
                className="grid grid-cols-[minmax(80px,0.5fr)_1fr_1fr] items-center gap-x-[24px] border-t border-solid border-[#e7e7e7] px-[8px] py-[14px] md:grid-cols-[240px_1fr_1fr]"
              >
                <span
                  role="rowheader"
                  className="font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21]"
                >
                  {r.field}
                </span>
                <div role="cell">
                  <Cell value={left.v} fill={left.f} color={GREEN} />
                </div>
                <div role="cell">
                  <Cell value={right.v} fill={right.f} color={ORANGE} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default AdminMergeView;
