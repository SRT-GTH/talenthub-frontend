import PsSectionHead from './PsSectionHead.jsx';
import { PARENTS } from './ParentsSchoolsData.js';
import {
  ArrowRightGlyph,
  BellGlyph,
  CheckCircleFillGlyph,
  CheckGlyph,
  EyeGlyph,
  GlobeGlyph,
} from './ParentsSchoolsIcons.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ParentsSection');

const CARD =
  'border-[1.4px] border-[#1c2a21]/[0.32] bg-[#fffdf7] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';
const ICONS = { bell: BellGlyph, check: CheckCircleFillGlyph, eye: EyeGlyph, globe: GlobeGlyph };

const PhoneMock = () => {
  const { phone } = PARENTS;
  return (
    <div className="relative mx-auto w-full max-w-[695px] pt-[30px] xl:py-[30px]">
      <div
        className={classNames(
          'flex flex-col gap-[14px] rounded-[44px] border-[1.4px] border-[#1c2a21]/[0.32] bg-[#14301a] px-5 py-6',
          'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]'
        )}
      >
        <p className="m-0 text-center font-sans text-[13px] font-semibold leading-[15.5px] text-white">
          {phone.time}
        </p>
        <div className="flex flex-col gap-3 rounded-[24px] bg-white p-[18px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#387440] text-white">
              <span className="size-[18px]">
                <BellGlyph />
              </span>
            </span>
            <div className="flex flex-col gap-px">
              <p className="m-0 font-sans text-[13px] font-bold leading-[15.5px] text-[#1c2a21]">
                {phone.app}
              </p>
              <p className="m-0 font-sans text-[12px] leading-[14.3px] text-[#595959]">
                {phone.when}
              </p>
            </div>
          </div>
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">{phone.message}</p>
          <div className="flex flex-col gap-3 xl:flex-row xl:gap-2">
            <button
              type="button"
              onClick={() => log('approve (inert)')}
              className="inline-flex cursor-pointer items-center justify-center gap-[6px] rounded-[12px] border-0 bg-[#387440] px-[14px] py-[10px] font-sans text-[14px] font-bold leading-[16.7px] text-white"
            >
              <span className="size-[14px]">
                <CheckGlyph />
              </span>
              {phone.approve}
            </button>
            <button
              type="button"
              onClick={() => log('review first (inert)')}
              className="inline-flex cursor-pointer items-center justify-center rounded-[12px] border-[1.5px] border-[#1c2a21] bg-transparent px-[14px] py-[10px] font-sans text-[14px] font-bold leading-[16.7px] text-[#1c2a21]"
            >
              {phone.review}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-[20px] border border-white/25 bg-white/10 px-[18px] py-4">
          <p className="m-0 font-sans text-[14px] font-bold leading-[16.7px] text-[#ffd86b]">
            {phone.weeklyTitle}
          </p>
          {phone.weekly.map((line) => (
            <p
              key={line}
              className="m-0 font-sans text-[13px] font-medium leading-[15.5px] text-white"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      <span className="absolute right-[-13px] top-[10px] -rotate-6 rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#84cc16] px-[11px] py-[5px] font-sans text-[12px] font-bold tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] xl:-top-[10px] xl:-right-3">
        {phone.sticker}
      </span>
    </div>
  );
};

/*
 * Section · Parents (Figma 7797:29670 desktop 1728x1121 / tablet 7815:297266 / mobile 7815:298430): head, benefits + phone mock
 * (side by side on desktop; benefits 2x2 then phone on tablet; single column on mobile), 3 consent steps, "Invite my parent" CTA.
 */
const ParentsSection = () => {
  log('render');
  return (
    <section className="bg-[linear-gradient(180deg,#fbf6ea_0%,#f7ebcf_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="mx-auto flex max-w-[1536px] flex-col gap-5 md:gap-10">
        <PsSectionHead
          chip={PARENTS.chip}
          title={PARENTS.title}
          accent="not paperwork."
          subtitle={PARENTS.subtitle}
        />

        <div className="flex flex-col gap-5 md:gap-7 xl:flex-row xl:items-center xl:gap-10">
          <ul className="m-0 grid w-full list-none grid-cols-1 items-start gap-4 p-0 md:grid-cols-2 xl:flex xl:w-[700px] xl:items-stretch xl:shrink-0 xl:flex-col">
            {PARENTS.benefits.map((b) => {
              const Icon = ICONS[b.icon];
              return (
                <li
                  key={b.id}
                  className={classNames(
                    'flex items-center gap-[14px] rounded-[20px] py-4 pl-4 pr-[18px]',
                    CARD
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]">
                    <span className="size-[22px]">
                      <Icon />
                    </span>
                  </span>
                  <div className="flex min-w-0 flex-col gap-[2px]">
                    <h3 className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21] md:text-[18px] md:leading-[21.5px]">
                      {b.title}
                    </h3>
                    <p className="m-0 font-sans text-[14px] leading-5 text-[#595959]">{b.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="min-w-0 xl:flex-1">
            <PhoneMock />
          </div>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
          {PARENTS.steps.map((s, i) => (
            <li
              key={s.n}
              className={classNames(
                'flex flex-col gap-[10px] rounded-[26px] p-[22px]',
                CARD,
                i === 2 && 'md:col-span-2 xl:col-span-1'
              )}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[#1c2a21] font-sans text-[16px] font-bold leading-[19px] text-[#ffd86b]">
                {s.n}
              </span>
              <h3 className="m-0 font-heading text-[22px] font-semibold leading-[27.5px] text-[#1c2a21]">
                {s.title}
              </h3>
              <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="flex justify-center">
          <Link
            to={LANDING_ROUTES.getStarted}
            onClick={() => log('cta: invite my parent')}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[10px] border-2 border-[#2a5730] bg-[#387440] px-5 font-sans text-[16px] font-bold tracking-[0.1px] text-[#fef1e7] no-underline shadow-[0_4px_0_#224626] md:px-6 xl:px-7"
          >
            {PARENTS.cta}
            <span className="size-5 text-white">
              <ArrowRightGlyph />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ParentsSection;
