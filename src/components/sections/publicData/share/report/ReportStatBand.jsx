import { formatCount } from '../../publicDataFormat.js';
import { at } from './reportLayout.js';

/*
 * ReportStatBand — "GTH Report · Stat band" (Figma 8896:109): a full-width #387440 band (130px) with up to five stats — value (Bricolage
 * 34/41 600, ls -0.34, white) over label (11/13, white at 80 %) — separated by 1px white dividers at 25 %. Stats sit 210px apart from x 48.
 * Props: stats [{ value (number or text), label }], top (664).
 */

const ReportStatBand = ({ stats, top = 664 }) => (
  <div className="bg-[#387440]" style={at(0, top, 1123, 130)}>
    {stats.map((stat, index) => (
      <div key={stat.label}>
        {index > 0 ? (
          <span
            aria-hidden="true"
            className="bg-white/25"
            style={at(240 + (index - 1) * 210, 26, 1, 56)}
          />
        ) : null}
        <div style={at(index === 0 ? 48 : 258 + (index - 1) * 210, 20)}>
          <p className="m-0 font-heading text-[34px] leading-[41px] font-semibold tracking-[-0.34px] text-white">
            {typeof stat.value === 'number' ? formatCount(stat.value) : stat.value}
          </p>
          <p className="m-0 mt-[2px] font-sans text-[11px] leading-[13px] text-white/80">
            {stat.label}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default ReportStatBand;
