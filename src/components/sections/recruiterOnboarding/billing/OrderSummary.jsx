import { CheckCircleFillIcon } from './billingIcons.jsx';

/*
 * OrderSummary - plan line at the top of the Payment step.
 * Figma R06 7374:7507 "Order summary": 699x84, white, border #e0e3de, r16, pad
 * 16/20, gap 12, 2-layer card shadow. 44px #ebf1ec r10 tile with a 22px green
 * check-circle, title 16/500 #111, sub 12/20 #575755, price Bricolage 29/600
 * #2a5730 on the right.
 *
 * Props: title ("Professional · Monthly"), subtitle, price ("$50").
 */
const OrderSummary = ({ title, subtitle, price }) => (
  <section
    aria-label="Order summary"
    className="flex items-center gap-3 rounded-2xl border border-[#e0e3de] bg-white px-5 py-4 max-sm:gap-2.5 shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_rgba(15,15,10,0.07)] max-md:px-4"
  >
    <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
      <CheckCircleFillIcon className="size-[22px] text-[#387440]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <p className="whitespace-nowrap text-[16px] font-medium leading-7 max-sm:text-[14px] max-sm:leading-6 tracking-[0.2px] text-[#111111]">
        {title}
      </p>
      <p className="text-[12px] leading-5 tracking-[0.2px] text-[#575755]">{subtitle}</p>
    </div>
    <p className="shrink-0 font-heading text-[29px] font-semibold leading-[35px] text-[#2a5730] max-sm:text-[24px]">
      {price}
    </p>
  </section>
);

export default OrderSummary;
