import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { AGENCY } from '../../components/sections/agency/data/agencyCoreData.js';
import AgencyCodeDialog from '../../components/sections/agency/onboarding/AgencyCodeDialog.jsx';
import AgencyDetailsForm from '../../components/sections/agency/onboarding/AgencyDetailsForm.jsx';
import AgencyDuplicateDialog from '../../components/sections/agency/onboarding/AgencyDuplicateDialog.jsx';
import AgencySignUpLayout from '../../components/sections/agency/onboarding/AgencySignUpLayout.jsx';
import AgencyVerifiedDialog from '../../components/sections/agency/onboarding/AgencyVerifiedDialog.jsx';
import AgencyVerifyForm from '../../components/sections/agency/onboarding/AgencyVerifyForm.jsx';
import { SIGNUP } from '../../components/sections/agency/onboarding/data/agencyOnboardingData.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencySignUpPage');

/*
 * AgencySignUpPage — /agency/sign-up (Figma 11.4.1a-a5). Package A. Decision: the sign-up and MoU upload frames draw the ONBOARDING layout (nav + step header +
 * form column + green panel), not the rail, because the visitor is not signed in yet — so this page does not use AgencyFrame.
 * URL states: /agency/sign-up (step 03 form, 11.4.1a) · ?state=already-registered (dialog over step 03, 11.4.1a5) · ?step=verify (step 04 form: my key, not drawn alone) ·
 * ?state=code-sent (check your inbox, 11.4.1a3) · ?state=wrong-code (11.4.1a4) · ?state=email-verified (11.4.1a2).
 * Real flow: Continue to verification → ?step=verify → Send verification code → ?state=code-sent → the demo code (agencyOnboardingData.js VERIFY.demoCode, documented in the
 * data module and never shown in the UI) → ?state=email-verified → Continue to MoU → /agency/mou. A wrong code → ?state=wrong-code. Esc / close removes the dialog.
 */

const VERIFY_STATES = ['code-sent', 'wrong-code', 'email-verified'];

const AgencySignUpPage = () => {
  const data = useAgencyState();
  const navigate = useNavigate();
  const state = data.state;
  const verifyStep = VERIFY_STATES.includes(state) || data.params.get('step') === 'verify';

  useEffect(() => {
    log('mount', { state, step: verifyStep ? 'verify' : 'agency' });
  }, [state, verifyStep]);

  const closeDialog = () => data.update({ state: null });

  return (
    <AgencySignUpLayout
      stepKey={verifyStep ? 'verify' : 'agency'}
      variant={verifyStep ? 'verify' : state === 'already-registered' ? 'registered' : 'details'}
    >
      {verifyStep ? (
        <AgencyVerifyForm
          verified={state === 'email-verified'}
          onSend={() => data.update({ step: 'verify', state: 'code-sent' })}
        />
      ) : (
        <AgencyDetailsForm
          registered={state === 'already-registered'}
          onContinue={() => data.update({ step: 'verify', state: null })}
          onDuplicate={() => data.update({ state: 'already-registered' })}
        />
      )}
      {state === 'already-registered' ? (
        <AgencyDuplicateDialog
          agencyName={AGENCY.name}
          registeredOn={SIGNUP.registeredOn}
          onClose={closeDialog}
        />
      ) : null}
      {state === 'code-sent' || state === 'wrong-code' ? (
        <AgencyCodeDialog
          key="code"
          wrong={state === 'wrong-code'}
          onVerified={() => data.update({ state: 'email-verified' })}
          onWrong={() => data.update({ state: 'wrong-code' }, { replace: true })}
          onClose={closeDialog}
        />
      ) : null}
      {state === 'email-verified' ? (
        <AgencyVerifiedDialog
          agencyName={AGENCY.name}
          onContinue={() => navigate('/agency/mou')}
          onClose={closeDialog}
        />
      ) : null}
    </AgencySignUpLayout>
  );
};

export default AgencySignUpPage;
