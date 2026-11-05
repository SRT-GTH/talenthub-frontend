import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { copyUrl, COPY_PATHS } from '../copyUrl.js';
import FieldButton from '../fields/FieldButton.jsx';
import { LockIcon } from '../fields/FieldsIcons.jsx';
import { SETTINGS_ROLE_LABELS } from '../roles/settingsMockData.js';

const log = debug('NoCopyAccess');

/*
 * NoCopyAccess — Platform Admin 7.8.7d "No copy access · not available for this role" (Figma 7.8.7d). The `noaccess` screen: AdminCopyArea mounts it instead of every Site copy /
 * Product names / Media library screen when `!session.copy.read` (the Data Protection Officer: `/admin/site-copy?role=dpo`, also `/admin/product-names?role=dpo`, `/admin/media?role=dpo`).
 * Drawn as the frame: page title "Site copy" with the role as sub copy, then one white card (64 padding, r20) with a lock disc, "Site copy isn’t part of your role", the explanation and
 * two buttons: "Back to my home" (goes to /admin) and "Ask for access".
 * ⚠️ ASSUMPTION: "Ask for access" has no drawn target (no backend): it logs and answers "Request sent." (not drawn) once, so the button is not dead; the answer disappears when the page is left.
 */
const NoCopyAccess = ({ ctx, session }) => {
  const [asked, setAsked] = useState(false);
  const roleLabel = SETTINGS_ROLE_LABELS[session.role] ?? session.staff?.roleLabel ?? '';

  useEffect(() => {
    log('mount', { role: session.role, read: session.copy?.read });
  }, [session.role, session.copy?.read]);

  return (
    <div className="flex flex-col gap-[24px] pt-[16px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(28px,1.97vw,34px)] leading-[41px] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Site copy
        </h1>
        {roleLabel ? (
          <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
            {roleLabel}
          </p>
        ) : null}
      </header>
      <section
        aria-labelledby="no-copy-access-title"
        className="flex flex-col items-center gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(24px,5vw,64px)] text-center"
      >
        <span
          aria-hidden="true"
          className="flex size-[66px] items-center justify-center rounded-full bg-[#f8f8f4] text-[#387440]"
        >
          <LockIcon className="size-[30px]" />
        </span>
        <h2
          id="no-copy-access-title"
          className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]"
        >
          Site copy isn’t part of your role
        </h2>
        <p className="m-0 max-w-[560px] font-sans text-[15px] leading-[22px] text-[#575755]">
          Changing the platform’s words needs the “Read site copy” permission. Ask a super admin if
          your work needs it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[8px]">
          <FieldButton size="lg" to={copyUrl(ctx, COPY_PATHS.home)}>
            Back to my home
          </FieldButton>
          <FieldButton
            tone="primary"
            size="lg"
            onClick={() => {
              log('ask for access (no backend: nothing is sent)', { role: session.role });
              setAsked(true);
            }}
          >
            Ask for access
          </FieldButton>
        </div>
        {asked ? (
          <p
            role="status"
            className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730]"
          >
            Request sent.
          </p>
        ) : null}
      </section>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.7d',
    area: 'noaccess',
    priority: 0,
    match: () => true,
    Component: NoCopyAccess,
  },
];

export default NoCopyAccess;
