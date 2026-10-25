import { classNames } from '../../../../utils/classNames.js';
import AgencyButton from '../AgencyButton.jsx';

/*
 * RequestHero — the banner of a request page (Figma 11.4.3c–g, i "Welcome hero" 8597:1356 / 8597:2357): 1329×176, r16, white 1.5 border;
 * green gradient (#1f4a2b → #3f7f4c) for pending / approved / needs-detail, solid #c0392b for rejected / ended. Title 22/28 600 (the page <h1>),
 * text 14/20, one white action button at the right. Props: tone ('green' | 'red'), title, text, action { label }, onAction().
 */

const RequestHero = ({ tone, title, text, action, onAction }) => (
  <section
    aria-label={title}
    className={classNames(
      'flex min-h-[176px] flex-col justify-center gap-[18px] rounded-[16px] border-[1.5px] border-solid border-white px-[20px] py-[28px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] md:flex-row md:items-center md:justify-between md:px-[24px] md:py-[40px]',
      tone === 'red' ? 'bg-[#c0392b]' : 'bg-[linear-gradient(135deg,#1f4a2b_14.6%,#3f7f4c_85.4%)]'
    )}
  >
    <div className="flex min-w-0 flex-col gap-[4px]">
      <h1 className="m-0 font-sans text-[22px] leading-[28px] font-semibold tracking-[-0.11px] text-[#fefefe]">
        {title}
      </h1>
      <p className="m-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#fefefe]">
        {text}
      </p>
    </div>
    <AgencyButton size="sm" onClick={onAction} className="md:shrink-0">
      {action.label}
    </AgencyButton>
  </section>
);

export default RequestHero;
