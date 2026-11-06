import { classNames } from '../../../../../utils/classNames.js';
import SectionOutline from './SectionOutline.jsx';

/*
 * MockHowItWorks — the "How it works" section of the mock public page (Figma 7.8.3a: p 28/40, gap 14, title 22/26 600, three step cards r14 #f8f8f4 p14 with
 * the number 18/700 #387440 and the label 14/600; phone: p 22/18, title 18/21, cards stacked). Props: device, t(key), outline (SectionOutline props).
 */
const STEPS = [
  { n: 1, key: 'step1' },
  { n: 2, key: 'step2' },
  { n: 3, key: 'step3' },
];

const MockHowItWorks = ({ device, t, outline }) => {
  const phone = device === 'phone';
  return (
    <SectionOutline label="How it works" name="How it works section" {...outline}>
      <div
        className={classNames(
          'flex flex-col gap-[14px]',
          phone ? 'px-[18px] py-[22px]' : 'px-[40px] py-[28px]'
        )}
      >
        <h2
          className={classNames(
            'm-0 font-sans font-semibold text-[#1c2a21]',
            phone ? 'text-[18px] leading-[21px]' : 'text-[22px] leading-[26px]'
          )}
        >
          {t('title')}
        </h2>
        <ol
          className={classNames(
            'm-0 grid list-none gap-[14px] p-0',
            phone ? 'grid-cols-1' : 'grid-cols-3'
          )}
        >
          {STEPS.map(({ n, key }) => (
            <li
              key={key}
              className="flex min-w-0 flex-col gap-[6px] rounded-[14px] bg-[#f8f8f4] p-[14px]"
            >
              <span className="font-sans text-[18px] leading-[21px] font-bold text-[#387440]">
                {n}
              </span>
              <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                {t(key)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </SectionOutline>
  );
};

export default MockHowItWorks;
