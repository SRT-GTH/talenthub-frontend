import { useEffect } from 'react';
import Button from '../../../../ui/Button.jsx';
import { debug } from '../../../../../utils/debug.js';
import { PreviewLockIcon } from './PreviewIcons.jsx';
import { NON_STAFF_VISITOR, PREVIEW_LINK_MINUTES } from './previewHistoryData.js';

const log = debug('PreviewNonStaff');

/*
 * PreviewNonStaff — what a signed-in person who is not staff sees when they open a preview link (Figma 7.8.3h, 1728 x 1117, no admin chrome): the public site nav
 * with "Signed in as Abena Mensah (talent)", and a full-width white card: 66 px lock circle, 26/31 600 title, 16/24 text, primary "Go to the home page" and the
 * 12.5/500 note. It is drawn as a full-screen layer over the admin chrome (a visitor would never see the chrome; the URL is `?state=nonstaff`, mock only).
 * ⚠️ ASSUMPTION: "Go to the home page" opens the public home page (`/`). Props: none.
 */
const PreviewNonStaff = () => {
  useEffect(() => {
    log('mount: non-staff visitor', NON_STAFF_VISITOR);
  }, []);
  return (
    <div
      role="region"
      aria-label="Preview is for GTH staff only"
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#f8f8f4]"
    >
      <div className="flex min-h-[68px] flex-wrap items-center gap-x-[16px] gap-y-[4px] bg-white px-[clamp(16px,3.7vw,64px)] py-[22px]">
        <span className="font-sans text-[20px] leading-[24px] font-bold text-[#2a5730]">
          Ghana Talent Hub
        </span>
        <span className="min-w-0 flex-1" />
        <span className="font-sans text-[14px] leading-[17px] font-medium text-[#575755]">
          {`Signed in as ${NON_STAFF_VISITOR}`}
        </span>
      </div>
      <div className="pt-[clamp(32px,7vw,120px)]">
        <section className="flex flex-col items-center gap-[16px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(20px,2.8vw,48px)] text-center">
          <span className="inline-flex size-[66px] items-center justify-center rounded-full bg-[#f8f8f4] text-[#575755]">
            <PreviewLockIcon className="size-[30px]" />
          </span>
          <h1 className="m-0 font-sans text-[26px] leading-[31px] font-semibold text-[#1c2a21]">
            This preview is for GTH staff only
          </h1>
          <p className="m-0 max-w-[520px] font-sans text-[16px] leading-[24px] text-[#575755]">
            Preview links show changes that aren’t live yet, so they only open for signed-in staff
            with copy access. Here’s the page everyone can see.
          </p>
          <Button to="/" variant="primary" size="lg" data-autofocus>
            Go to the home page
          </Button>
          <p className="m-0 font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
            {`Preview links also expire after ${PREVIEW_LINK_MINUTES} minutes.`}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PreviewNonStaff;
