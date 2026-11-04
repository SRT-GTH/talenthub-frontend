import { classNames } from '../../../../../utils/classNames.js';
import MockSiteNav from './MockSiteNav.jsx';

/*
 * PreviewStage — the grey stage with the device frame of the preview (Figma 7.8.3a "preview stage": #f8f8f4, r20, p24, and the white "page preview" frame
 * inside it: desktop 1281 wide with a 1 px #e7e7e7 border and no radius, tablet 820 and phone 390 with r20, centred; the phone stage hugs the frame so the
 * "How it fits" card sits beside it, 7.8.3c). The frame keeps its device width and scrolls inside the stage when the window is narrower (no page scroll).
 * Props: device, withNav (the faq page draws no site nav), label (aria name), className, frameClassName, children.
 */
const FRAME = {
  desktop: 'w-full min-w-[960px] border border-solid border-[#e7e7e7] bg-white',
  tablet: 'mx-auto w-[820px] shrink-0 rounded-[20px] border border-solid border-[#e7e7e7] bg-white',
  phone: 'w-[390px] shrink-0 rounded-[20px] border border-solid border-[#e7e7e7] bg-white',
};

const PreviewStage = ({ device, withNav = true, label, className, frameClassName, children }) => (
  <div
    role="region"
    aria-label={label}
    tabIndex={0}
    className={classNames(
      'min-w-0 overflow-x-auto rounded-[20px] bg-[#f8f8f4] p-[clamp(12px,1.4vw,24px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      device === 'phone' ? 'w-fit max-w-full' : 'w-full',
      className
    )}
  >
    <div className={classNames('overflow-hidden', FRAME[device] ?? FRAME.desktop, frameClassName)}>
      {withNav ? <MockSiteNav device={device} /> : null}
      {children}
    </div>
  </div>
);

export default PreviewStage;
