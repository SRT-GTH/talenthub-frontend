import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import LandingFaqItem from '../shared/LandingFaqItem.jsx';
import { AccentTitle, Chip, SectionHead } from './LpBParts.jsx';
import { FAQ_DEFAULT_OPEN } from './FaqData.js';
import { useCopySection } from '../../../../copy/useCopySection.js';
import { HOME_FAQ_COPY } from '../../../../copy/landingHomeCopy.js';

const log = debug('FaqSection');
const HELP_MAILTO = 'mailto:info@ghanatalenthub.com';

/*
 * S9 · FAQ — Figma 7797:14848 (1728x1034), tablet 7815:271425 (834x968), mobile 7815:279242 (430x993).
 * Accordion exactly as drawn: first item open (white card, green toggle with ×), the rest closed (#fffdf7 card, white toggle with +).
 * One item open at a time (opening one closes the other; user-confirmed). Expanded = white card + green hard shadow + green × toggle; collapsed = cream card + grey shadow + + toggle.
 * The answer expands with a height + fade animation; the toggle swaps + / ×.
 */
const FaqSection = () => {
  // Text: the page's own copy with what staff published in Site copy (Platform Admin 7.8) applied.
  const { FAQ_HEAD, FAQ_HELP, FAQ_ITEMS, TITLE } = useCopySection(HOME_FAQ_COPY);
  const [openId, setOpenId] = useState(FAQ_DEFAULT_OPEN);

  useEffect(() => {
    log('mount, items:', FAQ_ITEMS.length, 'open:', FAQ_DEFAULT_OPEN);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount log only

  const toggle = (id) => {
    const next = openId === id ? null : id;
    log('toggle:', id, '->', next === id ? 'open' : 'closed', '(one open at a time)');
    setOpenId(next);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fbf3e4_0%,#f1ede2_100%)]"
    >
      <div className="relative mx-auto flex max-w-[1728px] flex-col items-center gap-5 px-5 py-14 md:gap-9 md:px-10 md:py-[72px] xl:px-24 xl:py-[110px]">
        <SectionHead
          maxW="max-w-[1200px]"
          chip={
            <Chip className="border border-solid border-[#c1d4c4] bg-white text-[#387440]">
              {FAQ_HEAD.chip}
            </Chip>
          }
          title={
            <AccentTitle
              lead={`${TITLE.lead} `}
              accent={TITLE.accent}
              accentClass="text-[#387440]"
            />
          }
          titleClass="font-heading font-semibold text-[#1c2a21]"
        />

        <div className="flex w-full max-w-[1000px] flex-col gap-[14px]">
          {FAQ_ITEMS.map((item) => (
            <LandingFaqItem
              key={item.id}
              variant="home"
              id={item.id}
              question={item.question}
              answer={item.answer}
              open={item.id === openId}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        <p className="m-0 flex flex-col items-start gap-3 text-left font-sans text-[15px] leading-[17.9px] md:flex-row md:items-center md:gap-[10px] md:text-center">
          <span className="font-medium text-[#595959]">{FAQ_HELP.lead}</span>
          {/* Not linked in Figma: opens the visitor's mail app addressed to GTH (product owner, 2026-11-12). */}
          <a
            href={HELP_MAILTO}
            onClick={() => log('help link ->', HELP_MAILTO)}
            className="lp-ul cursor-pointer font-semibold text-[#387440] no-underline"
          >
            {FAQ_HELP.link}
          </a>
        </p>
      </div>
    </section>
  );
};

export default FaqSection;
