import { debug } from '../../../../../utils/debug.js';
import ParentButton from '../../ParentButton.jsx';
import spotCelebrate from '../../../../../assets/parent/eval-spot-celebrate.svg';
import { OUTCOME_TITLE, TURNED18 } from './data/resultsData.js';

const log = debug('Turned18Screen');

/*
 * Turned18Screen — PE-06 "Ward turned 18 (Abena, March 2028)" (Figma 10034:150815): "Evaluate my child" title, one centred card (r24, p44, gap 14): Spot · Celebrate 96,
 * "Abena turned 18" 26/600, 15 #575755 copy (620 wide), secondary "Evaluate Elliot" -> /parent/evaluate.
 */
const Turned18Screen = () => {
  log('render');
  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
        {OUTCOME_TITLE}
      </h1>
      <section
        aria-label={TURNED18.title}
        className="flex flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(24px,2.55vw,44px)] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]"
      >
        <img src={spotCelebrate} alt="" aria-hidden="true" className="size-[96px]" />
        <h2 className="m-0 text-center font-sans text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
          {TURNED18.title}
        </h2>
        <p className="m-0 w-full max-w-[620px] text-center font-sans text-[15px] leading-[normal] text-[#575755]">
          {TURNED18.body}
        </p>
        <ParentButton
          variant="secondary"
          to="/parent/evaluate"
          onClick={() => log('evaluate Elliot')}
        >
          {TURNED18.cta}
        </ParentButton>
      </section>
    </div>
  );
};

export default Turned18Screen;
