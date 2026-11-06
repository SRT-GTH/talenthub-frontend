import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../../utils/debug.js';
import FieldButton from '../fields/FieldButton.jsx';
import { LockIcon } from '../fields/FieldsIcons.jsx';

const log = debug('TalentNotAllowed');

/*
 * TalentNotAllowed — Platform Admin 7.8.7f "Talent opens an editor link · not allowed" (Figma 7.8.7f).
 *   /admin/site-copy/section/:sectionId?viewer=talent        (e.g. /admin/site-copy/section/public.home.hero?viewer=talent)
 * What a signed-in talent sees when they open a staff editor link: NOT the admin chrome but a plain 403 page — a white site bar ("Ghana Talent Hub", "Signed in as Abena Mensah (talent)"),
 * then a full-width white message with a lock disc, "This page is for GTH staff", "You don’t need anything here. Your dashboard has everything for your profile, skills and opportunities.",
 * the green "Back to my dashboard" and "Error 403 · gth.com/admin/copy". Drawn as a full-viewport page portalled over the admin frame (the registry can only render inside it); high priority
 * so it wins for `?viewer=talent` only.
 * ⚠️ ASSUMPTION: the persona "Abena Mensah (talent)" is the drawn mock; "Back to my dashboard" goes to the talent home `/home`; the error line is the drawn text, not the real address.
 */
const TalentNotAllowed = () => {
  useEffect(() => {
    log('mount: a talent opened a staff editor link → 403');
    const prev = document.title;
    document.title = 'Not allowed · Ghana Talent Hub';
    return () => {
      document.title = prev;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#f8f8f4] font-sans text-[#1c2a21]">
      <header className="flex min-h-[68px] shrink-0 flex-wrap items-center justify-between gap-x-[16px] gap-y-[4px] bg-white px-[clamp(16px,3.7vw,64px)] py-[22px] max-sm:py-[14px]">
        <span className="text-[20px] leading-[24px] font-bold text-[#2a5730]">
          Ghana Talent Hub
        </span>
        <span className="text-[14px] leading-[17px] font-medium text-[#575755] max-sm:text-[12px]">
          Signed in as Abena Mensah (talent)
        </span>
      </header>
      <main className="pt-[clamp(32px,6.9vw,120px)]">
        <section
          aria-labelledby="not-allowed-title"
          className="flex flex-col items-center gap-[16px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(20px,2.8vw,48px)] text-center"
        >
          <span
            aria-hidden="true"
            className="flex size-[66px] items-center justify-center rounded-full bg-[#f8f8f4] text-[#575755]"
          >
            <LockIcon className="size-[30px]" />
          </span>
          <h1
            id="not-allowed-title"
            className="m-0 text-[clamp(22px,1.5vw,26px)] leading-[31px] font-semibold"
          >
            This page is for GTH staff
          </h1>
          <p className="m-0 max-w-[520px] text-[16px] leading-[24px] text-[#575755]">
            You don’t need anything here. Your dashboard has everything for your profile, skills and
            opportunities.
          </p>
          <FieldButton tone="primary" size="lg" to="/home">
            Back to my dashboard
          </FieldButton>
          <p className="m-0 text-[12.5px] leading-[15px] font-medium text-[#575755]">
            Error 403 · gth.com/admin/copy
          </p>
        </section>
      </main>
    </div>,
    document.body
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.7f',
    area: 'site-copy',
    priority: 90,
    match: (ctx) => ctx.segments[0] === 'section' && ctx.params.get('viewer') === 'talent',
    Component: TalentNotAllowed,
  },
];

export default TalentNotAllowed;
