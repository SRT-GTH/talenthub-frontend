import { formatCount } from '../../publicDataFormat.js';
import { at } from './reportLayout.js';

/*
 * ReportCaseBand — "GTH Report · Case band" (Figma 8896:136, used 3× on page 7): a 1027×176 band (radius 18) with the story photo on the left
 * (250px, left corners rounded), a region chip, the story title (Bricolage 17/21 600) and text (11.5/17, white at 85 %), then three stats
 * (value Bricolage 20/24 600 over a 10.5/14 label) divided by 1px white rules at 25 %. The page-7 instances override the stat size to 20px.
 * Props: bg, photo (url), region, chipWidth, title, text, stats [{ value, label }], top.
 */

const STAT_X = [730, 845, 960];

const ReportCaseBand = ({ bg, photo, region, chipWidth, title, text, stats, top }) => (
  <article className="rounded-[18px]" style={{ ...at(48, top, 1027, 176), backgroundColor: bg }}>
    <img
      src={photo}
      alt=""
      width="250"
      height="176"
      className="block h-[176px] w-[250px]"
      style={at(0, 0)}
    />
    <span
      className="rounded-full bg-white/[0.18] font-sans whitespace-nowrap text-[10px] leading-[12px] font-bold tracking-[0.6px] text-white uppercase"
      style={{ ...at(274, 20, chipWidth, 22), padding: '5px 12px', boxSizing: 'border-box' }}
    >
      {region}
    </span>
    <div className="flex flex-col gap-[8px]" style={at(274, 52, 380)}>
      <h3 className="m-0 font-heading text-[17px] leading-[21px] font-semibold text-white">
        {title}
      </h3>
      <p className="m-0 font-sans text-[11.5px] leading-[17px] text-white/85">{text}</p>
    </div>
    {stats.map((stat, index) => (
      <div key={stat.label}>
        {index > 0 ? (
          <span
            aria-hidden="true"
            className="bg-white/25"
            style={at(STAT_X[index] - 14 - 48 + 0, 56, 1, 70)}
          />
        ) : null}
        <p
          className="m-0 font-heading text-[20px] leading-[24px] font-semibold tracking-[-0.2px] text-white"
          style={at(STAT_X[index] - 48, 62)}
        >
          {typeof stat.value === 'number' ? formatCount(stat.value) : stat.value}
        </p>
        <p
          className="m-0 font-sans text-[10.5px] leading-[14px] text-white/80"
          style={at(STAT_X[index] - 48, 98, 105)}
        >
          {stat.label}
        </p>
      </div>
    ))}
  </article>
);

export default ReportCaseBand;
