import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { INSTITUTION } from '../../components/sections/institution/data/institutionCoreData.js';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import InstitutionCodeDialog from '../../components/sections/institution/onboarding/InstitutionCodeDialog.jsx';
import InstitutionDetailsForm from '../../components/sections/institution/onboarding/InstitutionDetailsForm.jsx';
import InstitutionDuplicateDialog from '../../components/sections/institution/onboarding/InstitutionDuplicateDialog.jsx';
import InstitutionSignUpLayout from '../../components/sections/institution/onboarding/InstitutionSignUpLayout.jsx';
import InstitutionVerifiedDialog from '../../components/sections/institution/onboarding/InstitutionVerifiedDialog.jsx';
import InstitutionVerifyForm from '../../components/sections/institution/onboarding/InstitutionVerifyForm.jsx';
import { SIGNUP } from '../../components/sections/institution/onboarding/data/institutionOnboardingData.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionSignUpPage');

/*
 * InstitutionSignUpPage — /institution/sign-up (Figma 11.1.1a 8589:8, a2 8589:482, b 8589:932, b2 8744:428424, c 8589:1478, d 8589:1937). Package A.
 * Decision: the sign-up frames draw the ONBOARDING layout (nav + step header + form column + green panel), not the rail, because the visitor is not signed in yet —
 * so this page does not use InstitutionFrame.
 * URL states: /institution/sign-up (step 03, the empty form, 11.1.1a) · ?state=filled (the filled form, 11.1.1a2) · ?state=already-registered (dialog over the filled form, 11.1.1c) ·
 * ?step=verify (step 04 form, not drawn alone) · ?state=code-sent (check your inbox, 11.1.1b) · ?state=wrong-code (11.1.1b2) · ?state=success (email verified, 11.1.1d).
 * Real flow: Continue to verification → ?step=verify → Send verification code → ?state=code-sent → the demo code (institutionOnboardingData.js VERIFY.demoCode, documented in
 * the data module and never shown in the UI) → ?state=success → Continue to accreditation → /institution/accreditation. A wrong code → ?state=wrong-code.
 * Esc / close removes the dialog.
 */

const VERIFY_STATES = ['code-sent', 'wrong-code', 'success'];

const InstitutionSignUpPage = () => {
  const data = useInstitutionState();
  const navigate = useNavigate();
  const state = data.state;
  const verifyStep = VERIFY_STATES.includes(state) || data.params.get('step') === 'verify';
  const filled = state === 'filled' || state === 'already-registered';

  useEffect(() => {
    log('mount', { state, step: verifyStep ? 'verify' : 'institution' });
  }, [state, verifyStep]);

  return (
    <InstitutionSignUpLayout
      stepKey={verifyStep ? 'verify' : 'institution'}
      variant={verifyStep ? 'verify' : state === 'already-registered' ? 'registered' : 'details'}
    >
      {verifyStep ? (
        <InstitutionVerifyForm
          verified={state === 'success'}
          onSend={() => data.update({ step: 'verify', state: 'code-sent' })}
        />
      ) : (
        <InstitutionDetailsForm
          filled={filled}
          onContinue={() => data.update({ step: 'verify', state: null })}
          onDuplicate={() => data.update({ state: 'already-registered' })}
        />
      )}
      {state === 'already-registered' ? (
        <InstitutionDuplicateDialog
          institutionName={SIGNUP.registeredName}
          registeredOn={SIGNUP.registeredOn}
          onClose={() => data.update({ state: 'filled' })}
        />
      ) : null}
      {state === 'code-sent' || state === 'wrong-code' ? (
        <InstitutionCodeDialog
          key="code"
          wrong={state === 'wrong-code'}
          onVerified={() => data.update({ state: 'success' })}
          onWrong={() => data.update({ state: 'wrong-code' }, { replace: true })}
          onClose={() => data.update({ step: 'verify', state: null })}
        />
      ) : null}
      {state === 'success' ? (
        <InstitutionVerifiedDialog
          institutionName={INSTITUTION.name}
          onContinue={() => navigate('/institution/accreditation')}
          onClose={() => data.update({ step: 'verify', state: null })}
        />
      ) : null}
    </InstitutionSignUpLayout>
  );
};

export default InstitutionSignUpPage;
