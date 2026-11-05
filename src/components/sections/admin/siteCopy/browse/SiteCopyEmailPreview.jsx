import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { SiteCopyBanner } from './SiteCopyInfoCard.jsx';

const log = debug('SiteCopyEmailPreview');

/*
 * SiteCopyEmailPreview — "Welcome email · preview" (7.8.1h): the email as the person receives it (#f8f8f4 r16 panel, p28: subject 14/600, heading 24/600, body 15/22
 * #575755 and the green "Complete my profile" shelf button) and the blue banner about {curly brackets}. Verbatim from the frame; `{first name}` shows as the sample
 * "Abena".
 * Props: preview ({ title, subject, heading, body, button }).
 */
const SiteCopyEmailPreview = ({ preview }) => {
  useEffect(() => {
    log('render', { title: preview?.title });
  }, [preview?.title]);
  return (
    <section
      aria-label={preview.title}
      className="flex min-w-0 flex-1 flex-col gap-[14px] self-start rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,1.8vw,24px)] font-sans max-lg:w-full"
    >
      <h2 className="m-0 text-[19px] leading-[23px] font-semibold text-[#1c2a21]">
        {preview.title}
      </h2>
      <div className="flex flex-col gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[clamp(16px,2vw,28px)]">
        <p
          className={`m-0 w-fit max-w-full text-[14px] leading-[17px] font-semibold text-[#1c2a21]`}
        >
          {preview.subject}
        </p>
        <p
          className={`m-0 w-fit max-w-full text-[24px] leading-[29px] font-semibold text-[#1c2a21]`}
        >
          {preview.heading}
        </p>
        <p className={`m-0 w-fit max-w-full text-[15px] leading-[22px] text-[#575755]`}>
          {preview.body}
        </p>
        <span
          className={`mt-[4px] inline-flex min-h-[56px] w-fit max-w-full items-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] py-[16px] text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#e8f2ed] shadow-[0_4px_0_#2a5730]`}
        >
          {preview.button}
        </span>
      </div>
      <SiteCopyBanner tone="blue">
        Names in curly brackets, like {'{first name}'}, are filled in for each person. Product names
        update when they are renamed.
      </SiteCopyBanner>
    </section>
  );
};

export default SiteCopyEmailPreview;
