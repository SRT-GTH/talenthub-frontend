import { useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import FaqRichText from './FaqRichText.jsx';
import { PreviewChevronDownIcon, PreviewChevronRightIcon } from './PreviewIcons.jsx';
import SectionOutline from './SectionOutline.jsx';

const log = debug('MockFaq');

/*
 * MockFaq — the FAQ page of the mock public site (Figma 7.8.3f "page preview · FAQ": 1100 wide, p 32/40, title 26/31 700, items r14 #f8f8f4 p18 with the
 * question 17/20 600 and a chevron; the drafted item is open with a 2.5 px #387440 outline, #ebf1ec at 50 % and a "FAQ · draft" tag straddling its top edge).
 * The items are real accordion buttons. Props: device, t(key), drafted (the item index with unpublished text, or -1), outline (SectionOutline props), draftTag.
 */
const ITEMS = [
  { n: 1, q: 'q1', a: 'a1' },
  { n: 2, q: 'q2', a: 'a2' },
  { n: 3, q: 'q3', a: 'a3' },
];

const MockFaq = ({ device, t, drafted, outline }) => {
  const [open, setOpen] = useState(drafted >= 0 ? drafted : -1);
  const toggle = (i) => {
    log('toggle', { item: i, wasOpen: open === i });
    setOpen((cur) => (cur === i ? -1 : i));
  };
  return (
    <div
      className={classNames(
        'flex flex-col gap-[14px] border border-solid border-[#e7e7e7] bg-white py-[32px]',
        device === 'phone' ? 'px-[18px]' : 'px-[40px]'
      )}
    >
      <h2 className="m-0 font-sans text-[26px] leading-[31px] font-bold text-[#1c2a21]">
        {t('heading')}
      </h2>
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        const isDraft = drafted === i;
        const body = (
          <div
            className={classNames(
              'flex flex-col gap-[10px] rounded-[14px] p-[18px]',
              isDraft && outline.active
                ? 'bg-[#ebf1ec]/50'
                : isOpen
                  ? 'bg-[#ebf1ec]/50'
                  : 'bg-[#f8f8f4]'
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              className="flex min-h-[24px] w-full cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0 text-left font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387440]"
            >
              <span className="min-w-0 flex-1">{t(item.q)}</span>
              {isOpen ? (
                <PreviewChevronDownIcon className="size-[16px] shrink-0" />
              ) : (
                <PreviewChevronRightIcon className="size-[16px] shrink-0 rotate-180" />
              )}
            </button>
            {isOpen ? <FaqRichText text={t(item.a)} /> : null}
          </div>
        );
        return isDraft ? (
          <SectionOutline
            key={item.n}
            label="FAQ · draft"
            name="FAQ answer"
            {...outline}
            selected
            tagClassName="-top-[10px] right-[72px]"
            className="rounded-[14px]"
          >
            {body}
          </SectionOutline>
        ) : (
          <div key={item.n}>{body}</div>
        );
      })}
    </div>
  );
};

export default MockFaq;
