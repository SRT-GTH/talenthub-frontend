import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotWard from '../../../../assets/parent/spot-ward.svg';

const log = debug('ParentNoWard');

/*
 * ParentNoWard — PD-01c "Parent home · No linked ward yet" (Figma 10034:2499): "Welcome, Emma" 34/600 + #999 sub, one empty card (r24, p48, gap 24): the 96 ward spot, "No ward linked yet" 26/600,
 * the 15 #575755 explainer (620 wide), "Find my ward" + "I have a link code", and the green institution link.
 * Props: none. ⚠️ ASSUMPTION: the two buttons and the institution link only log — Figma draws none of the screens they open.
 */
const ParentNoWard = () => (
  <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
    <div className="flex flex-col gap-[3px]">
      <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
        Welcome, Emma
      </h1>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
        Link your child to see their progress and support them.
      </p>
    </div>
    <section
      aria-label="No ward linked"
      className="flex flex-col items-center gap-[24px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(24px,2.78vw,48px)] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]"
    >
      <img src={spotWard} alt="" draggable="false" className="size-[96px]" />
      <h2 className="m-0 text-center font-sans text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
        No ward linked yet
      </h2>
      <p className="m-0 w-full max-w-[620px] text-center font-sans text-[15px] leading-[normal] text-[#575755]">
        If your child already signed up with your phone or email, they link automatically.
        Otherwise, search for them and they’ll get a request to accept.
      </p>
      <div className="flex flex-wrap items-start justify-center gap-[12px]">
        <ParentButton onClick={() => log('find my ward (no screen drawn)')}>
          Find my ward
        </ParentButton>
        <ParentButton
          variant="secondary"
          onClick={() => log('I have a link code (no screen drawn)')}
        >
          I have a link code
        </ParentButton>
      </div>
      <button
        type="button"
        onClick={() => log('register as an institution (no screen drawn)')}
        className="cursor-pointer border-0 bg-transparent p-0 text-center font-sans text-[13px] leading-[normal] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        Caring for 100+ children? Register as an institution instead.
      </button>
    </section>
  </div>
);

export default ParentNoWard;
