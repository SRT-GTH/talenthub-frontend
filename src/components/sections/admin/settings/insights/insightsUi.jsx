import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { fmt, pctOf } from './insightsFormat.js';

/* Small read-only building blocks for the Settings › Overview / Security / Accessibility screens. */

export const Card = ({ title, sub, action, children, id }) => (
  <section
    id={id}
    className="flex flex-col gap-[14px] rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[20px] max-sm:p-[14px]"
  >
    <div className="flex flex-wrap items-start justify-between gap-[10px]">
      <div className="flex min-w-0 flex-col gap-[2px]">
        <h2 className="m-0 font-sans text-[18px] leading-[24px] font-semibold text-[#1c2a21]">
          {title}
        </h2>
        {sub ? (
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{sub}</p>
        ) : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const GoLink = ({ to, children }) => (
  <Link
    to={to}
    className="font-sans text-[14px] font-semibold text-[#387440] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {children} →
  </Link>
);

export const Kpi = ({ label, value, hint, tone }) => (
  <div className="flex min-w-[140px] flex-1 flex-col gap-[2px] rounded-[14px] bg-[#f6f8f5] px-[14px] py-[12px]">
    <span className="font-sans text-[13px] text-[#595959]">{label}</span>
    <span
      className={classNames(
        'font-sans text-[24px] leading-[30px] font-semibold',
        tone === 'warn' ? 'text-[#9a3b0a]' : 'text-[#1c2a21]'
      )}
    >
      {value}
    </span>
    {hint ? <span className="font-sans text-[12px] text-[#737373]">{hint}</span> : null}
  </div>
);

export const Kpis = ({ children }) => <div className="flex flex-wrap gap-[10px]">{children}</div>;

/** Horizontal bars: rows [{ label, count }]. With `total`, each bar is a share of it. */
export const Bars = ({ rows, total, empty = 'Nothing recorded yet.' }) => {
  if (!rows?.length) return <p className="m-0 font-sans text-[14px] text-[#737373]">{empty}</p>;
  const max = total || Math.max(...rows.map((r) => r.count), 1);
  return (
    <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
      {rows.map((r) => (
        <li
          key={r.label}
          className="grid grid-cols-[minmax(110px,200px)_1fr_auto] items-center gap-[10px] max-sm:grid-cols-[100px_1fr_auto]"
        >
          <span className="truncate font-sans text-[14px] text-[#1c2a21]" title={r.label}>
            {r.label}
          </span>
          <span className="h-[10px] overflow-hidden rounded-full bg-[#eef2ee]" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-[#387440]"
              style={{ width: `${r.count ? Math.max(2, (r.count / max) * 100) : 0}%` }}
            />
          </span>
          <span className="min-w-[56px] text-right font-sans text-[14px] font-semibold text-[#1c2a21] tabular-nums">
            {fmt(r.count)}
            {total ? (
              <span className="font-normal text-[#737373]"> · {pctOf(r.count, total)}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const Table = ({ head, rows, empty }) =>
  rows.length ? (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans text-[14px] text-[#1c2a21]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-0 border-b border-solid border-[#e7e7e7] px-[8px] py-[8px] text-left text-[13px] font-semibold whitespace-nowrap text-[#595959]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((c, j) => (
                <td
                  key={j}
                  className="border-0 border-b border-solid border-[#f0f0ec] px-[8px] py-[10px] align-top"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="m-0 font-sans text-[14px] text-[#737373]">{empty}</p>
  );
