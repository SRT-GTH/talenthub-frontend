import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import photoPen from '../../../../assets/landing/page-hero-how-it-works.webp';
import photoStudents from '../../../../assets/landing/stories-feature-photo.webp';
import photoTable from '../../../../assets/landing/features-preview-photo.webp';
import { LpBIcon } from './LpBIcons.jsx';
import { AccentTitle, CARD_SHADOW, Chip, GreenButton, SectionHead, Sticker } from './LpBParts.jsx';
import {
  AUDIENCE_PANELS,
  AUDIENCE_TABS,
  DEFAULT_AUDIENCE_TAB,
  FOR_EVERYONE_HEAD,
} from './ForEveryoneData.js';

const log = debug('ForEveryoneSection');

const PHOTOS = { students: photoStudents, pen: photoPen, table: photoTable };
/* Tab change = Figma SMART_ANIMATE, 350ms ease-out: the old copy fades/slides out, the new one fades/slides in. */
const OUT_MS = 180;

/* Dot-grid texture (Figma "Texture · dot grid": 2px dots every 36px, #9db89f @ .30, 1728x1100 from the top-left). */
const DOTS =
  'radial-gradient(circle at 19px 19px, rgba(157,184,159,.3) 0, rgba(157,184,159,.3) 1px, transparent 1.4px)';

/*
 * S7 · For everyone — Figma 7797:13315 (1728x956), tablet 7815:269892 (834x1330), mobile 7815:277709 (430x1438).
 * The audience card is row-based on desktop (copy 760 + photo 620x520, gap 56) and stacked on tablet/mobile.
 * All four tabs have their variant content (Tab=Students/Parents/Schools/Recruiters); switching animates the copy + photo out/in (350ms ease-out).
 */
const ForEveryoneSection = () => {
  const [active, setActive] = useState(DEFAULT_AUDIENCE_TAB);
  const [shown, setShown] = useState(DEFAULT_AUDIENCE_TAB);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);
  const panel = AUDIENCE_PANELS[shown];

  useEffect(() => {
    log('mount, active tab:', active);
  }, [active]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleTab = (id) => {
    if (id === active || !AUDIENCE_PANELS[id]) return;
    log('tab select:', id);
    setActive(id);
    setLeaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShown(id);
      setLeaving(false);
    }, OUT_MS);
  };

  const fade = `transition-[opacity,translate] ease-out motion-reduce:transition-none ${
    leaving
      ? 'translate-y-2 opacity-0 duration-[180ms]'
      : 'translate-y-0 opacity-100 duration-[350ms]'
  }`;

  return (
    <section
      id="for-everyone"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#eef4ea_0%,#e3eedd_100%)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
        style={{ backgroundImage: DOTS, backgroundSize: '36px 36px' }}
      />
      <div className="relative mx-auto flex max-w-[1728px] flex-col items-center gap-5 px-5 py-14 md:gap-10 md:px-10 md:py-[72px] xl:px-24 xl:pb-[109px] xl:pt-[108px]">
        <SectionHead
          maxW="max-w-[1200px]"
          chip={
            <Chip className="border border-solid border-[#c1d4c4] bg-white text-[#387440]">
              {FOR_EVERYONE_HEAD.chip}
            </Chip>
          }
          title={
            <AccentTitle
              lead="One platform, "
              accent="for all of you."
              accentClass="text-[#387440]"
            />
          }
          titleClass="font-heading font-semibold text-[#1c2a21]"
        />

        <div
          className={`relative flex w-full max-w-[1536px] flex-col items-center gap-6 rounded-[36px] bg-[#fffdf7] px-5 py-10 md:gap-8 md:px-6 xl:flex-row xl:justify-center xl:gap-14 xl:py-10 xl:pl-12 xl:pr-10 ${CARD_SHADOW}`}
        >
          <div className="flex w-full min-w-0 flex-col gap-[22px] xl:max-w-[760px] xl:flex-[1_1_760px]">
            <div
              role="tablist"
              aria-label="Audience"
              className="flex w-full flex-wrap gap-2 rounded-full bg-[#f1ede2] p-[6px] xl:w-fit"
            >
              {AUDIENCE_TABS.map((t) => {
                const selected = t.id === active;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => handleTab(t.id)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-0 py-[10px] pl-[14px] pr-[18px] font-sans text-[15px] font-semibold leading-[17.9px] max-md:basis-[calc(50%-4px)] ${
                      selected ? 'bg-[#387440] text-white' : 'bg-[#f1ede2] text-[#387440]'
                    }`}
                  >
                    <LpBIcon
                      name={t.icon}
                      size={16}
                      className={selected ? 'text-[#ffd86b]' : 'text-[#1c2a21]'}
                    />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className={`flex flex-col gap-[22px] ${fade}`}>
              <h3 className="m-0 font-heading text-[40px] font-semibold leading-[1.1] text-[#111111]">
                {panel.heading[0]}
                <span className="text-[#387440]">{panel.heading[1]}</span>
              </h3>
              <p className="m-0 font-sans text-[17px] leading-[26px] text-[#595959]">
                {panel.body}
              </p>
              <ul className="m-0 flex list-none flex-col gap-[22px] p-0">
                {panel.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-[10px]">
                    <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
                      <LpBIcon name="check" size={14} strokeWidth={2.6} />
                    </span>
                    <span className="font-sans text-[16px] font-medium leading-[19.1px] text-[#1c2a21]">
                      {it.textCompact ? (
                        <>
                          <span className="hidden xl:inline">{it.text}</span>
                          <span className="xl:hidden">{it.textCompact}</span>
                        </>
                      ) : (
                        it.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div>
                <GreenButton
                  bordered
                  onClick={() => log('cta click (inert):', panel.cta)}
                  className="max-md:w-full"
                >
                  {panel.cta}
                </GreenButton>
              </div>
            </div>
          </div>

          <img
            src={PHOTOS[panel.photo]}
            alt=""
            className={`h-[520px] w-full min-w-0 rounded-[28px] border border-solid border-[#1c2a21] object-cover xl:w-auto xl:flex-[0_1_620px] ${fade}`}
          />

          <Sticker
            tilt={-5.73}
            style={{ backgroundColor: panel.stickerBg }}
            className={`-top-[25px] right-[5px] xl:right-[54px] xl:top-[13px] ${fade}`}
          >
            {panel.sticker}
          </Sticker>
        </div>
      </div>
    </section>
  );
};

export default ForEveryoneSection;
