import { useEffect } from 'react';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { debug } from '../../../../utils/debug.js';
import { LpBIcon } from './LpBIcons.jsx';
import { useFitScale } from './useFitScale.js';
import { AccentTitle, CARD_SHADOW, Chip, GreenButton, SectionHead, Sticker } from './LpBParts.jsx';
import {
  FAN_H,
  FAN_W,
  OPPORTUNITIES_CTA,
  OPPORTUNITIES_HEAD,
  OPPORTUNITY_CARDS,
  OPPORTUNITY_STATS,
} from './OpportunitiesData.js';

const log = debug('OpportunitiesSection');

/*
 * S5 · Opportunities — Figma 7797:13091 (1728x960), tablet 7815:269668 (834x735), mobile 7815:277485 (430x713).
 * Desktop bg #fff; tablet/mobile gradient #f7ebcf -> #fbf6ea. The job-card fan is drawn once at 1400x347 and scaled down
 * uniformly on smaller frames (Figma: 0.538 tablet, 0.279 mobile).
 */
const JobCard = ({ card }) => {
  const solid = card.tile === 'solid';
  const handleCta = () => log('card cta (inert):', card.id, card.cta.label);
  return (
    <div className="flex w-[400px] flex-col gap-3 rounded-[26px] border-[1.2px] border-solid border-[#1c2a21]/[.22] bg-white p-[22px] shadow-[4px_4px_0_rgba(28,42,33,.14),0_8px_20px_rgba(28,42,33,.05)] transition-[border-color,box-shadow] duration-[250ms] ease-out hover:border-[#1c2a21] hover:shadow-[0_6px_0_#387440] motion-reduce:transition-none">
      <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch max-md:gap-[43px]">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-[14px] max-md:self-center ${solid ? 'bg-[#387440] text-white' : 'bg-[#ebf1ec] text-[#387440]'}`}
        >
          <LpBIcon name="company" size={24} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px] max-md:flex-none">
          <span className="font-sans text-[18px] font-semibold leading-[21.5px] text-[#1c2a21]">
            {card.title}
          </span>
          <span className="font-sans text-[13px] leading-[15.5px] text-[#595959]">
            {card.company}
          </span>
          {/* Mobile frame (7815:280143): the match % sits under the company line instead of at the right. */}
          <span className="font-heading text-[31px] font-semibold leading-[37.2px] text-[#387440] md:hidden">
            {card.match}
          </span>
        </div>
        <span className="font-heading text-[31px] font-semibold leading-[37.2px] text-[#387440] max-md:hidden">
          {card.match}
        </span>
      </div>
      <div className="flex gap-[6px]">
        {card.chips.map((c) => (
          <span
            key={c.label}
            className={`inline-flex items-center rounded-full px-[10px] py-1 font-sans text-[12px] font-semibold leading-[14.3px] ${
              c.tone === 'green'
                ? 'bg-[#ebf1ec] text-[#387440]'
                : 'border border-solid border-[#e7e7e7] bg-[#f7f8f4] text-[#595959]'
            }`}
          >
            {c.label}
          </span>
        ))}
      </div>
      <span className="font-sans text-[12px] font-bold uppercase leading-[14.3px] tracking-[1.2px] text-[#595959]">
        Matching skills
      </span>
      {/* Mobile frame: skill chips fill their cell, two per row with the last one full width (Figma 7815:280157). */}
      <div className="flex gap-[6px] max-md:grid max-md:grid-cols-2">
        {card.skills.map((s) => (
          <span
            key={s.label}
            className={`inline-flex items-center gap-[5px] rounded-full py-[5px] pl-2 pr-[10px] max-md:last:col-span-2 font-sans text-[12px] font-semibold leading-[14.3px] ${
              s.ok ? 'bg-[#ebf1ec] text-[#387440]' : 'bg-[#f9ebea] text-[#c0392b]'
            }`}
          >
            <LpBIcon name={s.ok ? 'check' : 'close'} size={14} strokeWidth={2.4} />
            {s.label}
          </span>
        ))}
      </div>
      {card.cta.primary ? (
        <button
          type="button"
          onClick={handleCta}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] py-3 font-sans text-[16px] font-bold leading-6 tracking-[0.1px] text-white shadow-[0_4px_0_#224626]"
        >
          {card.cta.label}
          <LpBIcon name="arrowRight" size={20} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCta}
          className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[18px] py-3 font-sans text-[16px] font-bold leading-6 tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,.12)]"
        >
          {card.cta.label}
        </button>
      )}
    </div>
  );
};

const OpportunitiesSection = () => {
  const [fanRef, scale, fanWidth] = useFitScale(FAN_W);
  /* Mobile: the cards are taller than the artboard height, so the bottoms tuck UNDER the stats row (stats get z-10) as in Figma. */
  const fanH = FAN_H;

  useEffect(() => {
    log('mount');
  }, []);
  useEffect(() => {
    log('fan scale:', scale.toFixed(3), 'wrapper width:', fanWidth);
  }, [scale, fanWidth]);

  return (
    <section
      id="opportunities"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f7ebcf_0%,#fbf6ea_100%)] xl:bg-none xl:bg-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6px] top-[300px] size-[600px] rounded-full bg-[#f9c9b6]/50 blur-[90px] md:left-[228px] xl:left-[72.3%]"
      />
      <div className="relative mx-auto flex max-w-[1728px] flex-col items-center gap-5 px-5 py-14 md:gap-9 md:px-10 md:py-[72px] xl:px-24 xl:pb-24 xl:pt-[95px]">
        <SectionHead
          maxW="max-w-[1200px]"
          chip={<Chip className="bg-[#387440] text-white">{OPPORTUNITIES_HEAD.chip}</Chip>}
          title={
            <AccentTitle
              lead="Opportunities that "
              accent="know your worth."
              accentClass="text-[#387440]"
            />
          }
          titleClass="font-heading font-semibold text-[#1c2a21]"
          sub={
            <p className="m-0 max-w-[700px] font-sans text-[16px] leading-[27px] text-[#595959] md:text-[18px]">
              {OPPORTUNITIES_HEAD.sub}
            </p>
          }
        />

        <div
          ref={fanRef}
          className="relative z-0 w-full max-w-[1400px]"
          style={{ height: fanH * scale }}
        >
          <div
            className="absolute top-0"
            style={{
              width: FAN_W,
              height: fanH,
              left: Math.max(0, (fanWidth - FAN_W * scale) / 2),
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {OPPORTUNITY_CARDS.map((card) => (
              <div
                key={card.id}
                className="absolute"
                style={{
                  left: card.x,
                  top: card.y,
                  width: 400,
                  paddingTop: 10,
                  transform: `rotate(${card.tilt}deg)`,
                }}
              >
                <JobCard card={card} />
              </div>
            ))}
            <Sticker tilt={4} className="left-[789px] top-[-8px] bg-[#ffd86b]">
              BEST MATCH
            </Sticker>
          </div>
        </div>

        <div className="relative z-10 flex w-full max-w-[1100px] flex-wrap gap-5">
          {OPPORTUNITY_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex min-w-0 flex-col items-center gap-[2px] rounded-[20px] bg-white px-6 py-[18px] text-center max-md:basis-[calc(50%-10px)] md:flex-1 ${CARD_SHADOW} ${i === 2 ? 'max-md:!basis-full' : ''}`}
            >
              <span className="font-heading text-[30px] font-semibold leading-[36px] text-[#387440] md:text-[34px] md:leading-[40.8px] xl:text-[37px] xl:leading-[44.4px]">
                {s.value}
              </span>
              <span className="font-sans text-[14px] font-semibold leading-[16.7px] text-[#1c2a21]">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <GreenButton
          to={LANDING_ROUTES.opportunities}
          onClick={() => log('browse all opportunities click')}
          className="max-md:w-full"
        >
          {OPPORTUNITIES_CTA}
        </GreenButton>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
