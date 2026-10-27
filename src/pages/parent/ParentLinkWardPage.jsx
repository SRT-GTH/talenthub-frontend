import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import InstitutionDialog from '../../components/sections/parent/link/InstitutionDialog.jsx';
import LinkCodeDialog from '../../components/sections/parent/link/LinkCodeDialog.jsx';
import LinkWardSearch from '../../components/sections/parent/link/LinkWardSearch.jsx';
import LinkWardSent from '../../components/sections/parent/link/LinkWardSent.jsx';
import { useLinkWardState } from '../../components/sections/parent/link/linkWardState.js';
import {
  LINK_SUBTITLE,
  LINK_TITLE,
  MOCK_CODES,
} from '../../components/sections/parent/link/data/linkWardData.js';

const log = debug('ParentLinkWardPage');

/*
 * ParentLinkWardPage — /parent/link-ward (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 04 Link a ward" 10057:1093; persona Emma Mensah, sidebar "My wards" active). One page, frames chosen by the URL:
 *   (form values) ?name=Kwesi Mensah&dob=04062011&rel=nephew   PW-07   10034:141501  search + "1 match"
 *   + &result=none                                             PW-07c  10052:2534   "No match yet"
 *   ?step=sent                                                 PW-08   10034:142187  "Request sent to Kwesi"
 *   ?modal=code&code=K7M4                                      PW-07b  10052:530    link-code dialog (+ &rel=nephew)
 *   ?modal=code-error&code=K7M4Q2                              PW-07e  10077:18651  "That code didn’t work"
 *   ?modal=code-expired&code=K7M4Q2                            PW-07f  10077:18999  "This code has expired"
 *   ?modal=institution                                         PW-07d  10052:3470   "Caring for 100 or more children?"
 * PW-09 (ward linked automatically) lives on the home: /parent?modal=ward-linked. PW-08c / PW-08b are the My wards page (toast / expired row), built with that page.
 * Mock only. ⚠️ ASSUMPTIONS: results appear as the form completes; a typed code outcome is picked from MOCK_CODES (a good code goes to /parent/wards?toast=accepted);
 * "Register an institution" goes to /onboarding/institution/guidelines; Figma draws no trigger for the 100+ dialog, so it is reachable by URL only.
 */
const DEFAULT_ERROR_CODE = MOCK_CODES.wrong;

const ParentLinkWardPage = () => {
  const link = useLinkWardState();
  const navigate = useNavigate();
  const { step, modal, code, rel, update } = link;

  useEffect(() => {
    log('mount', { step, modal: modal || '(none)' });
  }, [step, modal]);

  const closeModal = () => {
    log('close modal', { modal });
    update({ modal: null, code: null });
  };

  const submitCode = () => {
    if (code === MOCK_CODES.wrong) {
      log('code outcome: wrong');
      update({ modal: 'code-error' });
    } else if (code === MOCK_CODES.expired) {
      log('code outcome: expired');
      update({ modal: 'code-expired' });
    } else {
      log('code outcome: linked');
      navigate('/parent/wards?toast=accepted');
    }
  };

  const codeVariant =
    modal === 'code-error' ? 'error' : modal === 'code-expired' ? 'expired' : 'entry';
  const shownCode = code || (codeVariant === 'entry' ? '' : DEFAULT_ERROR_CODE);

  return (
    <ParentFrame sidebar="linked" active="wards">
      <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
        <header className="flex flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[clamp(26px,2vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
            {LINK_TITLE}
          </h1>
          {step === 'search' ? (
            <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
              {LINK_SUBTITLE}
            </p>
          ) : null}
        </header>

        {step === 'sent' ? (
          <LinkWardSent onCancel={() => update({ step: null })} />
        ) : (
          <LinkWardSearch
            link={link}
            onSend={() => update({ step: 'sent' })}
            onOpenCode={() => update({ modal: 'code' })}
          />
        )}
      </div>

      {modal === 'code' || modal === 'code-error' || modal === 'code-expired' ? (
        <LinkCodeDialog
          variant={codeVariant}
          code={shownCode}
          rel={rel}
          onCodeChange={(v) => update({ code: v }, { replace: true })}
          onRelChange={(id) => update({ rel: id }, { replace: true })}
          onSubmit={submitCode}
          onRetry={() => update({ modal: 'code', code: null })}
          onClose={closeModal}
        />
      ) : null}
      {modal === 'institution' ? (
        <InstitutionDialog
          onClose={closeModal}
          onRegister={() => navigate('/onboarding/institution/guidelines')}
        />
      ) : null}
    </ParentFrame>
  );
};

export default ParentLinkWardPage;
