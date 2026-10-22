import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { LpBIcon } from './LpBIcons.jsx';
import { AccentTitle, Chip, SectionHead } from './LpBParts.jsx';
import { FAQ_DEFAULT_OPEN, FAQ_HEAD, FAQ_HELP, FAQ_ITEMS } from './FaqData.js';

const log = debug('FaqSection');

/*
 * S9 · FAQ — Figma 7797:14848 (1728x1034), tablet 7815:271425 (834x968), mobile 7815:279242 (430x993).
 * Accordion exactly as drawn: first item open (white card, green toggle with ×), the rest closed (#fffdf7 card, white toggle with +).
 * One item open at a time (opening one closes the other; user-confirmed). Expanded = white card + green hard shadow + green × toggle; collapsed = cream card + grey shadow + + toggle.
 * The answer expands with a height + fade animation; the toggle swaps + / ×.
 */
const FaqSection = () => {
  const [openId, setOpenId] = useState(FAQ_DEFAULT_OPEN);

  useEffect(() => {
    log('mount, items:', FAQ_ITEMS.length, 'open:', FAQ_DEFAULT_OPEN);
  }, []);

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
            <AccentTitle lead="Questions? We’ve " accent="got you." accentClass="text-[#387440]" />
          }
          titleClass="font-heading font-semibold text-[#1c2a21]"
        />

        <div className="flex w-full max-w-[1000px] flex-col gap-[14px]">
          {FAQ_ITEMS.map((item) => {
            const open = item.id === openId;
            return (
              <div
                key={item.id}
                className={`flex flex-col rounded-[22px] border-[1.4px] border-solid border-[#1c2a21]/[.32] py-[22px] pl-[26px] pr-[22px] transition-[background-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${open ? 'bg-white shadow-[0_6px_0_#387440,0_10px_24px_rgba(28,42,33,.06)]' : 'bg-[#fffdf7] shadow-[5px_5px_0_rgba(28,42,33,.2),0_10px_24px_rgba(28,42,33,.06)]'}`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`faq-q-${item.id}`}
                    aria-expanded={open}
                    aria-controls={`faq-a-${item.id}`}
                    onClick={() => toggle(item.id)}
                    className="flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent p-0 text-left"
                  >
                    <span className="min-w-0 flex-1 font-sans text-[20px] font-semibold leading-[23.9px] text-[#1c2a21]">
                      {item.question}
                    </span>
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-[#1c2a21] transition-[background-color,color,rotate] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'rotate-90 bg-[#387440] text-white' : 'bg-white text-[#1c2a21]'}`}
                    >
                      <LpBIcon name={open ? 'close' : 'plus'} size={16} strokeWidth={2.2} />
                    </span>
                  </button>
                </h3>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p
                      id={`faq-a-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-q-${item.id}`}
                      aria-hidden={!open}
                      className="m-0 pt-3 font-sans text-[16px] leading-[25px] text-[#595959]"
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="m-0 flex flex-col items-start gap-3 text-left font-sans text-[15px] leading-[17.9px] md:flex-row md:items-center md:gap-[10px] md:text-center">
          <span className="font-medium text-[#595959]">{FAQ_HELP.lead}</span>
          <span className="lp-ul cursor-pointer font-semibold text-[#387440]">{FAQ_HELP.link}</span>
        </p>
      </div>
    </section>
  );
};

export default FaqSection;
