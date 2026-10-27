import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { useInstitutionSessionState } from '../../components/sections/institution/institutionSessionStore.js';
import InstitutionCodeDialog from '../../components/sections/institution/onboarding/InstitutionCodeDialog.jsx';
import InstitutionDetailsForm from '../../components/sections/institution/onboarding/InstitutionDetailsForm.jsx';
import InstitutionDuplicateDialog from '../../components/sections/institution/onboarding/InstitutionDuplicateDialog.jsx';
import InstitutionSignUpLayout from '../../components/sections/institution/onboarding/InstitutionSignUpLayout.jsx';
import InstitutionVerifiedDialog from '../../components/sections/institution/onboarding/InstitutionVerifiedDialog.jsx';
import InstitutionVerifyForm from '../../components/sections/institution/onboarding/InstitutionVerifyForm.jsx';
import { getApiErrorCode } from '../../services/apiErrors.js';
import {
  apiMessage,
  institutionSignupCheck,
  registerPortalInstitution,
  sendInstitutionCode,
  uploadInstitutionCrest,
  verifyInstitutionCode,
} from '../../services/institutionPortal.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionSignUpPage');

/*
 * InstitutionSignUpPage — /institution/sign-up (Figma 11.1.1a 8589:8, a2 8589:482, b 8589:932, b2 8744:428424, c 8589:1478, d 8589:1937). Package A.
 * The onboarding layout (nav + step header + form column + green panel), not the rail: the visitor is not signed in yet.
 * Live flow:
 *   step 03  details form -> POST /api/institution-signup/check (GES number / email already on GTH -> "already on GTH" dialog / field error)
 *   step 04  ?step=verify: phone + work email -> POST /auth/contact-verification/send -> code dialog
 *            code -> POST /auth/contact-verification/verify -> POST /auth/register-organization-with-contact (education organisation, you as its admin,
 *            signed in) -> crest uploaded (optional) -> "Email verified" dialog -> /institution/accreditation
 * The password and the crest stay in memory only: a page reload goes back to step 03.
 */

const InstitutionSignUpPage = () => {
  const data = useInstitutionState();
  const navigate = useNavigate();
  const session = useInstitutionSessionState();
  const [details, setDetails] = useState(null);
  const [crestFile, setCrestFile] = useState(null);
  const [contact, setContact] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [registered, setRegistered] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const verificationToken = useRef(null);
  // step 04 needs the details of step 03 (kept in memory only)
  const verifyStep = Boolean(details) && data.params.get('step') === 'verify';

  useEffect(() => {
    log('mount', { step: verifyStep ? 'verify' : 'institution' });
  }, [verifyStep]);

  const toDetails = async (values, crest) => {
    setBusy(true);
    try {
      const check = await institutionSignupCheck({
        gesNumber: values.gesNumber,
        email: values.email,
      });
      if (check?.taken === 'gesNumber') {
        setDuplicate({
          name: check.name,
          registeredOn: check.registeredOn
            ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
                new Date(check.registeredOn)
              )
            : 'an earlier date',
        });
        return null;
      }
      if (check?.taken === 'email') {
        return {
          field: 'email',
          message: 'An account already uses this email. Log in instead, or use another work email.',
        };
      }
      setDetails(values);
      setCrestFile(crest);
      setError('');
      data.update({ step: 'verify' });
      return null;
    } catch (err) {
      return { field: 'name', message: apiMessage(err) };
    } finally {
      setBusy(false);
    }
  };

  const sendCode = async (values) => {
    setBusy(true);
    setError('');
    try {
      const out = await sendInstitutionCode({
        email: values.email.trim().toLowerCase(),
        firstName: details.contactName.split(/\s+/)[0],
      });
      setContact(values);
      setChallenge({ token: out.challengeToken, masked: out.maskedEmail || values.email });
      log('code sent');
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const verifyAndRegister = async (code) => {
    try {
      if (!verificationToken.current) {
        const v = await verifyInstitutionCode({ challengeToken: challenge.token, otp: code });
        verificationToken.current = v.verificationToken;
      }
    } catch (err) {
      const c = getApiErrorCode(err);
      return c === 'OTP_INVALID' ? 'wrong' : apiMessage(err);
    }
    try {
      const out = await registerPortalInstitution({
        details: { ...details, email: contact.email },
        contact,
        verificationToken: verificationToken.current,
      });
      if (crestFile && out.loggedIn) {
        await uploadInstitutionCrest(crestFile).catch((err) =>
          log('crest upload failed', apiMessage(err))
        );
      }
      if (out.loggedIn) await session?.reload?.();
      setChallenge(null);
      setRegistered(out);
      return true;
    } catch (err) {
      const c = getApiErrorCode(err);
      if (c === 'CONTACT_NOT_VERIFIED') verificationToken.current = null;
      return apiMessage(err);
    }
  };

  return (
    <InstitutionSignUpLayout
      stepKey={verifyStep ? 'verify' : 'institution'}
      variant={verifyStep ? 'verify' : duplicate ? 'registered' : 'details'}
    >
      {verifyStep ? (
        <InstitutionVerifyForm
          initial={contact || { email: details.email }}
          verified={Boolean(registered)}
          busy={busy}
          error={error}
          onSend={sendCode}
          onBack={() => data.update({ step: null })}
        />
      ) : (
        <InstitutionDetailsForm
          key={details ? 'back' : 'new'}
          initial={details}
          initialCrest={crestFile}
          busy={busy}
          onContinue={toDetails}
        />
      )}
      {duplicate ? (
        <InstitutionDuplicateDialog
          institutionName={duplicate.name}
          registeredOn={duplicate.registeredOn}
          onClose={() => setDuplicate(null)}
        />
      ) : null}
      {challenge ? (
        <InstitutionCodeDialog
          key={challenge.token}
          masked={challenge.masked}
          onSubmit={verifyAndRegister}
          onResend={async () => {
            try {
              const out = await sendInstitutionCode({
                email: contact.email.trim().toLowerCase(),
                firstName: details.contactName.split(/\s+/)[0],
              });
              verificationToken.current = null;
              setChallenge((c) => ({
                ...c,
                token: out.challengeToken,
                masked: out.maskedEmail || c.masked,
              }));
              return null;
            } catch (err) {
              return apiMessage(err);
            }
          }}
          onClose={() => setChallenge(null)}
        />
      ) : null}
      {registered ? (
        <InstitutionVerifiedDialog
          institutionName={details.name}
          onContinue={() => navigate(registered.loggedIn ? '/institution/accreditation' : '/login')}
          onClose={() => navigate(registered.loggedIn ? '/institution/accreditation' : '/login')}
        />
      ) : null}
    </InstitutionSignUpLayout>
  );
};

export default InstitutionSignUpPage;
