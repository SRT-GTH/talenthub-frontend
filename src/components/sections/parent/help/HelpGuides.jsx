import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import { ARTICLES } from './data/articleData.js';
import { HELP_COPY, HELP_TOPICS } from './data/helpData.js';

const log = debug('HelpGuides');

/*
 * HelpGuides — the "Help and guides" page body (Figma 10057:1591 behind PH-03; same page behind PH-03b 10057:1806): "Help and guides" 34/600 over the 16 #999 line; left (945) the "Search help" field and six topic
 * cards in three columns (300 wide, gap 16, white r24, p20, 56px spot art, 15/600 title over a 12.5 line); right (360) the mint "Talk to the GTH parent team" card (#ebf1ec, r24, p22, 64px art, 16/600 title,
 * 12.5 line, "Chat on WhatsApp" primary, "Report a concern" secondary).
 * Props: onReport() — "Report a concern" (the page opens PH-03).
 * ⚠️ ASSUMPTION: the search filters the six topics by title and text as you type; a topic card without a designed article, "Chat on WhatsApp" and the search only log (Figma draws no destination); "Report a concern" opens the report dialog.
 * Layout: the contact card sits right from 1280px, above the topics below that; the topic grid is 3 / 2 / 1 columns.
 */
const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_17px_rgba(28,42,33,0.03)]';

const HelpGuides = ({ onReport }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const topics = q
    ? HELP_TOPICS.filter((t) => `${t.title} ${t.text}`.toLowerCase().includes(q))
    : HELP_TOPICS;
  const contact = HELP_COPY.contact;
  log('render', { query: q, topics: topics.length });

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          {HELP_COPY.title}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#6b6b6b]">
          {HELP_COPY.subtitle}
        </p>
      </div>

      <div className="flex flex-col items-start gap-[24px] min-[1280px]:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">
          <ParentTextField
            label={HELP_COPY.searchLabel}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={HELP_COPY.searchHint}
            inputClassName="placeholder:!font-medium placeholder:!text-[#1c2a21] placeholder:!opacity-100"
          />

          {topics.length === 0 ? (
            <p className="m-0 font-sans text-[15px] leading-[18px] text-[#575755]">
              {HELP_COPY.noMatch}
            </p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 items-start gap-[16px] p-0 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1280px]:grid-cols-[repeat(3,300px)]">
              {topics.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (ARTICLES[t.id]) navigate(`/parent/help/${t.id}`);
                      else log('topic (no page designed yet):', t.id);
                    }}
                    className={`flex w-full cursor-pointer flex-col items-start gap-[8px] p-[20px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${CARD}`}
                  >
                    <img src={t.art} alt="" aria-hidden="true" className="size-[56px]" />
                    <span className="font-sans text-[15px] leading-normal font-semibold text-[#1c2a21]">
                      {t.title}
                    </span>
                    <span className="font-sans text-[12.5px] leading-[1.45] text-[#575755]">
                      {t.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside
          aria-label={contact.title}
          className="flex w-full shrink-0 flex-col items-start gap-[12px] rounded-[24px] bg-[#ebf1ec] p-[22px] min-[1280px]:w-[360px]"
        >
          <img src={contact.art} alt="" aria-hidden="true" className="size-[64px]" />
          <h2 className="m-0 font-sans text-[16px] leading-normal font-semibold text-[#1c2a21]">
            {contact.title}
          </h2>
          <p className="m-0 font-sans text-[12.5px] leading-[1.45] text-[#575755]">
            {contact.text}
          </p>
          <ParentButton onClick={() => log('Chat on WhatsApp (no destination drawn)')}>
            {contact.whatsapp}
          </ParentButton>
          <ParentButton variant="secondary" onClick={onReport}>
            {contact.report}
          </ParentButton>
        </aside>
      </div>
    </div>
  );
};

export default HelpGuides;
