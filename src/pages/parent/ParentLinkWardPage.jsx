import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentButton from '../../components/sections/parent/ParentButton.jsx';
import { loadParentMe, useParentMe } from '../../components/sections/parent/live/parentLive.js';
import { linkWardWithCode, parentError, parentErrorCode } from '../../services/parent.api.js';
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
 * Live (signed in): linking is by the child's 6-character code (POST /parent/link-with-code); the code dialog's three
 * states follow the API (CODE_INVALID -> error, CODE_EXPIRED -> expired) and a good code lands on My wards with a toast.
 * Search by name / date of birth has no backend yet (no link requests), so the live page offers the code instead of
 * showing mock matches.
 */
const DEFAULT_ERROR_CODE = MOCK_CODES.wrong;

// Code dialog chips (the child's role) -> the backend relationship (the parent's role).
const relationshipFor = (relId, parentRelationship) => {
  if (relId === 'son' || relId === 'daughter') {
    return ['mother', 'father'].includes(parentRelationship) ? parentRelationship : 'guardian';
  }
  if (relId === 'younger-sibling') return 'older_sibling';
  return 'guardian';
};

const ParentLinkWardPage = () => {
  const link = useLinkWardState();
  const navigate = useNavigate();
  const me = useParentMe();
  const [linkError, setLinkError] = useState(null);
  const [busy, setBusy] = useState(false);
  const { step, modal, code, rel, update } = link;

  useEffect(() => {
    log('mount', { step, modal: modal || '(none)' });
  }, [step, modal]);

  const closeModal = () => {
    log('close modal', { modal });
    update({ modal: null, code: null });
  };

  const submitCode = async () => {
    if (me.live) {
      if (busy) return;
      setBusy(true);
      setLinkError(null);
      try {
        const res = await linkWardWithCode({
          code: String(code || '').toUpperCase(),
          relationship: relationshipFor(rel, me.data?.parent?.relationship),
        });
        log('code outcome: linked (live)');
        await loadParentMe(true);
        navigate('/parent/wards', {
          state: { linked: { id: res.wardId, firstName: res.firstName || 'Your ward' } },
        });
      } catch (err) {
        const type = parentErrorCode(err);
        log('code outcome (live):', type);
        if (type === 'CODE_INVALID') update({ modal: 'code-error' });
        else if (type === 'CODE_EXPIRED') update({ modal: 'code-expired' });
        else {
          // Already linked, ward limit, offline…: close the dialog so the reason shows on the page.
          update({ modal: null, code: null });
          setLinkError(parentError(err));
        }
      } finally {
        setBusy(false);
      }
      return;
    }
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
          {step === 'search' && !me.live ? (
            <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
              {LINK_SUBTITLE}
            </p>
          ) : null}
        </header>

        {me.live ? (
          <section className="flex max-w-[640px] flex-col items-start gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]">
            <h2 className="m-0 font-sans text-[18px] leading-normal font-semibold text-[#1c2a21]">
              Link with your child’s code
            </h2>
            <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
              Your child can make a 6-character code in their GTH Settings › Parent or guardian.
              Codes last 24 hours and work once.
            </p>
            {linkError ? (
              <p
                role="alert"
                className="m-0 font-sans text-[14px] leading-normal font-semibold text-danger"
              >
                {linkError}
              </p>
            ) : null}
            <ParentButton onClick={() => update({ modal: 'code' })}>
              I have a link code
            </ParentButton>
          </section>
        ) : step === 'sent' ? (
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
