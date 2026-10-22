import PsSectionHead from './PsSectionHead.jsx';
import { SCHOOLS } from './ParentsSchoolsData.js';
import { ArrowRightGlyph, CheckGlyph, ShieldGlyph } from './ParentsSchoolsIcons.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('SchoolsSection');

/*
 * Section · Schools (Figma 7797:29743 desktop 1728x774 / tablet 7815:297339 / mobile 7815:298503): cohort dashboard mock
 * (#fffdf7 card: header + 3 stat tiles + readiness bars) beside the benefit list + "Bring GTH to my school" CTA; stacked below xl.
 */
const SchoolsSection = () => {
  const { dashboard } = SCHOOLS;
  log('render');
  return (
    <section className="bg-[linear-gradient(180deg,#eef4ea_0%,#e3eedd_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="mx-auto flex max-w-[1536px] flex-col gap-5 md:gap-10">
        <PsSectionHead
          chip={SCHOOLS.chip}
          title={SCHOOLS.title}
          accent="grow."
          subtitle={SCHOOLS.subtitle}
        />

        <div className="flex flex-col gap-5 md:gap-7 xl:flex-row xl:items-center xl:gap-10">
          <div className="flex w-full min-w-0 flex-col gap-4 rounded-[26px] border-[1.4px] border-[#1c2a21]/[0.32] bg-[#fffdf7] p-[26px] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)] xl:flex-[860]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-[10px]">
              <h3 className="m-0 font-heading text-[21px] font-semibold leading-[26.25px] text-[#1c2a21]">
                {dashboard.title}
              </h3>
              <span aria-hidden="true" className="hidden min-w-0 flex-1 md:block" />
              <span className="inline-flex h-[26px] items-center gap-[6px] rounded-full bg-[#ebf1ec] py-[6px] pl-[10px] pr-3 font-sans text-[12px] font-semibold leading-[14.3px] text-[#387440] md:w-fit">
                <span className="size-[14px]">
                  <ShieldGlyph />
                </span>
                {dashboard.badge}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {dashboard.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex min-w-[140px] flex-1 flex-col gap-[2px] rounded-[18px] border border-[#1c2a21]/10 px-4 py-[14px] ${i === 2 ? 'basis-full md:basis-0' : 'basis-[calc(50%-6px)] md:basis-0'}`}
                  style={{ background: s.bg }}
                >
                  <span className="font-heading text-[31px] font-semibold leading-[37.2px] text-[#1c2a21]">
                    {s.value}
                  </span>
                  <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="m-0 mt-[6px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[1.2px] text-[#387440]">
              {dashboard.classesTitle}
            </p>
            <div className="flex flex-col gap-4">
              {dashboard.classes.map((c) => (
                <div key={c.name} className="flex flex-col gap-3 xl:flex-row xl:items-center">
                  <span className="font-sans text-[14px] font-semibold leading-[16.7px] text-[#1c2a21] xl:w-[150px] xl:shrink-0">
                    {c.name}
                  </span>
                  <div
                    role="img"
                    aria-label={`${c.name} readiness ${c.pct}%`}
                    className="h-3 w-full overflow-hidden rounded-[6px] bg-[#eceee8] xl:flex-1"
                  >
                    <div
                      className="h-full rounded-[6px] bg-[linear-gradient(90deg,#387440,#84cc16)]"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <span className="font-sans text-[14px] font-bold leading-[16.7px] text-[#387440] xl:w-[31px] xl:shrink-0">
                    {c.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 xl:flex-[636]">
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              {SCHOOLS.benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
                    <span className="size-[15px]">
                      <CheckGlyph />
                    </span>
                  </span>
                  <span className="font-sans text-[16px] font-medium leading-[19px] text-[#1c2a21] md:text-[17px] md:leading-[20.3px]">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to={LANDING_ROUTES.getStarted}
              onClick={() => log('cta: bring GTH to my school')}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] border-2 border-[#2a5730] bg-[#387440] px-5 font-sans text-[16px] font-bold tracking-[0.1px] text-[#fef1e7] no-underline shadow-[0_4px_0_#224626] md:w-fit md:px-6 xl:px-7"
            >
              {SCHOOLS.cta}
              <span className="size-5 text-white">
                <ArrowRightGlyph />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
