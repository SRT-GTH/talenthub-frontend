// The school's own roster: exact numbers (formatCount masks small groups for public figures).
const formatCount = (n) => Number(n || 0).toLocaleString('en-GB');
import { TERM_STATS as T } from './data/institutionHomeData.js';

/*
 * InstitutionTermCard — the roster stats card (Figma "Background+Border" 8585:83, 878 wide, white, 1.5 #e5e5e5, r16, p 22/24, gap 24): three stat columns
 * (label 16/24 #999, value 22/28 600) split by #dfdfdc dividers and the three-bar glyph (Group 41232, 266 x 64, hidden below md).
 * Live: GET /institution/home — students on the roster, linked to GTH, and their average profile completion. The Figma "This term" range switch is dropped:
 * there is no term data behind it yet.
 * Props: home (the /institution/home response or null), className.
 */

const InstitutionTermCard = ({ home, className }) => {
  const stats = [
    {
      id: 'students',
      label: T.labels.students,
      value: home ? formatCount(home.total) : '…',
      ink: '#1f4a2b',
    },
    {
      id: 'linked',
      label: T.labels.linked,
      value: home ? formatCount(home.linked) : '…',
      ink: '#32683a',
    },
    {
      id: 'profile',
      label: T.labels.profile,
      value: home ? `${home.avgProfile}%` : '…',
      ink: '#32683a',
    },
  ];
  return (
    <section
      aria-label={T.title}
      className={`flex min-w-0 flex-col justify-center gap-[24px] rounded-[16px] border-[1.5px] border-solid border-[#e5e5e5] bg-white px-[24px] py-[22px] shadow-[0_1px_2px_rgba(15,15,10,0.05)] ${className ?? ''}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-[24px] gap-y-[16px]">
        <dl className="m-0 flex flex-wrap items-stretch gap-y-[16px]">
          {stats.map((s, i) => (
            <div key={s.id} className="flex items-stretch">
              {i > 0 ? (
                <span aria-hidden="true" className="w-px self-stretch bg-[#dfdfdc]" />
              ) : null}
              <div className="flex flex-col items-center gap-[6px] px-[clamp(8px,1.4vw,16px)] pt-[3px] xl:min-w-[150px]">
                <dt className="text-center font-sans text-[clamp(12px,1.1vw,16px)] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {s.label}
                </dt>
                <dd
                  style={{ color: s.ink }}
                  className="m-0 font-sans text-[22px] leading-[28px] font-semibold tracking-[-0.11px]"
                >
                  {s.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        <svg
          aria-hidden="true"
          viewBox="0 0 266 64"
          className="hidden h-[64px] w-[266px] shrink-0 md:block"
        >
          {T.bars.map((b) => (
            <path
              key={b.x}
              d={`M${b.x} ${b.y + 8}a8 8 0 0 1 8-8h${b.w - 16}a8 8 0 0 1 8 8V${b.y + b.h}H${b.x}Z`}
              fill={b.fill}
              fillOpacity={b.opacity}
            />
          ))}
        </svg>
      </div>
    </section>
  );
};

export default InstitutionTermCard;
