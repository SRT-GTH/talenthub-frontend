import { Link } from 'react-router-dom';
import { NEXT_STEP as N } from './data/agencyHomeData.js';

/*
 * AgencyNextStepCard — the dark-green "Next step" card (Figma 8597:398384, 427 x 173, #1f6b3f, 1px #00522b, r16, p 21/22/22/22, gap 12):
 * eyebrow 14/15 500 #b9d6c8 (+0.44), title 20/25 600 white, body 16/22 500 #b9cdbd.
 * Props: step (GET /agency/home → nextStep { title, body, to }); the whole card links to `to`.
 */

const AgencyNextStepCard = ({ step, className }) => {
  const s = step || { title: '', body: 'Loading…', to: null };
  const inner = (
    <>
      <p className="m-0 font-sans text-[14px] leading-[15px] font-medium tracking-[0.44px] text-[#b9d6c8]">
        {N.eyebrow}
      </p>
      <div className="flex flex-col gap-[8px]">
        <h2 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-white">
          {s.title}
        </h2>
        <p className="m-0 font-sans text-[16px] leading-[22px] font-medium text-[#b9cdbd]">
          {s.body}
        </p>
      </div>
    </>
  );
  const cls = `flex flex-col gap-[12px] rounded-[16px] border border-solid border-[#00522b] bg-[#1f6b3f] px-[22px] pt-[21px] pb-[22px] ${className ?? ''}`;
  return s.to ? (
    <Link
      to={s.to}
      aria-label={`${N.eyebrow}: ${s.title}`}
      className={`${cls} no-underline hover:bg-[#1b5f38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]`}
    >
      {inner}
    </Link>
  ) : (
    <section aria-label={N.eyebrow} className={cls}>
      {inner}
    </section>
  );
};

export default AgencyNextStepCard;
