import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import HomeCardHead from './HomeCardHead.jsx';
import buddy from '../../../../assets/parent/parent-guide-buddy.webp';
import target from '../../../../assets/parent/home-target.svg';
import eye from '../../../../assets/parent/home-eye.svg';
import lock from '../../../../assets/parent/home-lock.svg';
import { GUIDE, READINESS, VIEWERS } from './data/parentHomeData.js';

const log = debug('ParentRail');

/*
 * ParentRail — the right column (448 wide) of the Overview. Figma "Right" 10027:1880:
 *   Parent guide 10027:1881 (layer "Career Buddy"): gradient #2e6436 -> #387440 r24 pad 22, white message r18, primary 3D button.
 *   Abena's readiness 10027:1956: score 47/600, 10px bar #eceee8 / #387440 (82%), amber "next step" box r16 (#faf4e8, border #f7efdd).
 *   Who viewed Abena 10027:1979: two recruiter rows (36px photo, 13px lines, 22px chip) + privacy note (#f8f8f4, r12).
 * ⚠️ ASSUMPTION: the "Streak and quests" card (10027:1895) is hidden in Figma and omitted.
 */
const Card = ({ labelId, children }) => (
  <section
    aria-labelledby={labelId}
    className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] shadow-[0_5px_8.5px_rgba(18,38,20,0.03)]"
  >
    {children}
  </section>
);

const ArrowGlyph = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="#e8f2ed"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" />
  </svg>
);

const ParentRail = () => (
  <div className="flex min-w-0 flex-col gap-[16px]">
    <section
      aria-labelledby="parent-guide-title"
      className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-gradient-to-r from-[#2e6436] to-[#387440] p-[22px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]"
    >
      <div className="flex items-center gap-[12px]">
        <span className="relative size-[48px] shrink-0 overflow-hidden rounded-full bg-white">
          <img
            src={buddy}
            alt=""
            className="absolute top-[-6px] left-[-5px] h-[53px] w-[57px] max-w-none"
          />
        </span>
        <div className="flex flex-col gap-[2px] leading-normal text-white">
          <h2 id="parent-guide-title" className="m-0 font-sans text-[16px] font-semibold">
            {GUIDE.title}
          </h2>
          <p className="m-0 font-sans text-[12px] font-medium">{GUIDE.sub}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[8px] rounded-[18px] bg-white p-[16px]">
        <p className="m-0 font-sans text-[12px] leading-normal font-bold tracking-[1.2px] text-[#387440]">
          {GUIDE.eyebrow}
        </p>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">{GUIDE.body}</p>
      </div>
      <div className="flex">
        <Button
          variant="primary"
          size="lg"
          onClick={() => log('Send Abena a note')}
          rightIcon={<ArrowGlyph />}
        >
          {GUIDE.cta}
        </Button>
      </div>
    </section>

    <Card labelId="parent-readiness-title">
      <HomeCardHead
        icon={target}
        title={<span id="parent-readiness-title">{READINESS.title}</span>}
        linkLabel={READINESS.link}
        to="/parent/wards/abena"
        onLink={() => log('Open Abena (readiness)')}
      />
      <div className="flex items-center gap-[12px]">
        <span className="font-sans text-[47px] leading-[1.1] font-semibold text-[#387440]">
          {READINESS.score}
        </span>
        <div className="flex flex-col gap-[2px] leading-normal">
          <p className="m-0 font-sans text-[14px] font-semibold text-[#1c2a21]">
            {READINESS.headline}
          </p>
          <p className="m-0 font-sans text-[13px] text-[#595959]">{READINESS.sub}</p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-label="Readiness score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={READINESS.score}
        className="h-[10px] w-full overflow-hidden rounded-[5px] bg-[#eceee8]"
      >
        <div
          className="h-full rounded-[5px] bg-[#387440]"
          style={{ width: `${READINESS.score}%` }}
        />
      </div>
      <div className="flex flex-col gap-[4px] rounded-[16px] border border-solid border-[#f7efdd] bg-[#faf4e8] p-[14px]">
        <p className="m-0 font-sans text-[12px] leading-normal font-bold tracking-[1.2px] text-[#c8951a]">
          {READINESS.eyebrow}
        </p>
        <p className="m-0 font-sans text-[15px] leading-normal font-semibold text-[#1c2a21]">
          {READINESS.step}
        </p>
        <p className="m-0 font-sans text-[13px] leading-normal text-[#595959]">
          {READINESS.stepSub}
        </p>
      </div>
    </Card>

    <Card labelId="parent-viewers-title">
      <HomeCardHead
        icon={eye}
        iconClass="h-[16px] w-[17px]"
        title={<span id="parent-viewers-title">{VIEWERS.title}</span>}
        linkLabel="See all"
        onLink={() => log('Who viewed: See all')}
      />
      <p className="m-0 font-sans text-[13px] leading-normal font-medium text-[#595959]">
        {VIEWERS.sub}
      </p>
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {VIEWERS.items.map((v) => (
          <li
            key={v.id}
            className="flex items-start gap-[10px] border-0 border-b border-solid border-[#e7e7e7] py-[10px]"
          >
            <img
              src={v.photo}
              alt=""
              width="36"
              height="36"
              className="size-[36px] shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-[6px] leading-normal">
              <p className="m-0 font-sans text-[13px] font-semibold text-[#1c2a21]">{v.name}</p>
              <p
                className={`m-0 font-sans text-[13px] ${v.lineStrong ? 'font-semibold text-[#387440]' : 'text-[#595959]'}`}
              >
                {v.line}
              </p>
              <div className="flex items-center gap-[6px]">
                <span className="font-sans text-[12px] text-[#595959]">{v.when}</span>
                <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-normal font-semibold whitespace-nowrap text-[#387440]">
                  {v.chip}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-[8px] rounded-[12px] bg-[#f8f8f4] px-[12px] py-[10px]">
        <img src={lock} alt="" className="size-[14px] shrink-0" />
        <p className="m-0 min-w-0 flex-1 font-sans text-[12px] leading-normal text-[#595959]">
          {VIEWERS.privacy}
        </p>
      </div>
    </Card>
  </div>
);

export default ParentRail;
