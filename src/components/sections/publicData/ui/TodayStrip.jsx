import { classNames } from '../../../../utils/classNames.js';
import { formatCount } from '../publicDataFormat.js';

/*
 * TodayStrip — Figma "T8 · Today strip" (8487:346285 desktop 1360x93, tablet 8508:351145 888x93; mobile block 8507:217 358x149): the dark
 * "Today on GTH" band at the foot of the overview.
 *   >= md : H, p 22/32, bg #2a5730, r20; left: 10px dot #c1d4c4 + "Live · today" (12/14 600 caps +0.72 #c1d4c4) + "Today on GTH" (20/24 600 white);
 *           right: stats gap 40, value 28/33 700 white over label 12/14 500 #c1d4c4
 *   < md  : V, p 16/18, gap 10; "Today on GTH" 16/19; 2x2 grid of stats (value 22/26, label 12 — Figma 11px — with the shorter copy)
 * Props
 *   stats    [{ key, value, prefix?, label, labelShort? }]   value: number (printed with formatCount; a count < 5 reads "<5") or a string
 *            e.g. { key:'signups', value:328, prefix:'+', label:'New sign-ups', labelShort:'Sign-ups' }
 *   title    string   default "Today on GTH"
 *   eyebrow  string   default "Live · today"
 *   loading  boolean  ⚠️ ASSUMPTION: not drawn; dims the values to "–" and sets aria-busy
 *   className
 * a11y: a labelled region; the stats are a list (value + label text), the dot is decorative.
 */

const TodayStrip = ({
  stats = [],
  title = 'Today on GTH',
  eyebrow = 'Live · today',
  loading = false,
  className,
}) => (
  <section
    aria-label={title}
    aria-busy={loading || undefined}
    className={classNames(
      'flex flex-col gap-[10px] rounded-[20px] bg-[#2a5730] px-[18px] py-[16px] font-sans',
      'md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-[32px] md:gap-y-[16px] md:px-[32px] md:py-[22px]',
      className
    )}
  >
    <div className="flex items-center gap-[12px]">
      <span
        aria-hidden="true"
        className="hidden size-[10px] shrink-0 rounded-full bg-[#c1d4c4] md:block"
      />
      <span className="hidden text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#c1d4c4] uppercase md:inline">
        {eyebrow}
      </span>
      <h2 className="m-0 text-[16px] leading-[19px] font-semibold text-white md:text-[20px] md:leading-[24px]">
        {title}
      </h2>
    </div>
    <ul className="m-0 grid list-none grid-cols-2 gap-x-[16px] gap-y-[10px] p-0 md:flex md:flex-wrap md:gap-x-[40px] md:gap-y-[12px]">
      {stats.map((s) => {
        const printed = typeof s.value === 'number' ? formatCount(s.value) : s.value;
        return (
          <li key={s.key} className="flex flex-col gap-[2px]">
            <span className="text-[22px] leading-[26px] font-bold text-white md:text-[28px] md:leading-[33px]">
              {loading ? '–' : `${s.prefix ?? ''}${printed}`}
            </span>
            <span className="text-[12px] leading-[14px] font-medium text-[#c1d4c4]">
              {s.labelShort ? (
                <>
                  <span className="md:hidden">{s.labelShort}</span>
                  <span className="hidden md:inline">{s.label}</span>
                </>
              ) : (
                s.label
              )}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);

export default TodayStrip;
