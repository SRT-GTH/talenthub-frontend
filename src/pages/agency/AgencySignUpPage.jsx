import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import AgencyDetailsForm from '../../components/sections/agency/onboarding/AgencyDetailsForm.jsx';
import AgencyDuplicateDialog from '../../components/sections/agency/onboarding/AgencyDuplicateDialog.jsx';
import AgencySignUpHeading from '../../components/sections/agency/onboarding/AgencySignUpHeading.jsx';
import AgencySignUpLayout from '../../components/sections/agency/onboarding/AgencySignUpLayout.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencySignUpPage');

/*
 * AgencySignUpPage — /agency/sign-up (Figma 11.4.1a). The sign-up draws the ONBOARDING layout (nav + step header + form column + green panel), not the
 * rail, because the visitor is not signed in yet.
 * Live flow (matches the platform's agency onboarding): the agency sends an access request (POST /government/register) → a Super / Senior Admin
 * reviews it in Platform Admin › Agencies → on approval the account is created and the contact gets a temporary password → the agency signs in
 * and lands in the portal. URL: ?state=sent (the request was sent; kept so a reload still shows the confirmation) · ?state=already-registered
 * (a pending request or an active account for this email: the server's sentence in the dialog).
 */

const AgencySignUpPage = () => {
  const data = useAgencyState();
  const { state } = data;
  const [duplicate, setDuplicate] = useState('');

  useEffect(() => {
    log('mount', { state });
  }, [state]);

  return (
    <AgencySignUpLayout
      stepKey="agency"
      variant={state === 'already-registered' ? 'registered' : 'details'}
    >
      {state === 'sent' ? (
        <section
          aria-live="polite"
          className="flex w-full max-w-[696px] flex-col gap-[20px] font-sans"
        >
          <AgencySignUpHeading
            step="03"
            label="Request sent"
            title={['Thanks, your request ', 'is in.']}
            lead="A GTH administrator reviews every agency request. When yours is approved, the contact person gets an email with a temporary password to sign in and set their own."
          />
          <p className="m-0 text-[15px] leading-[22px] text-[#575755]">
            Nothing else is needed from you now. If your MoU is not signed yet, the reviewer will
            contact you about it.
          </p>
          <Link
            to="/agency"
            className="inline-flex min-h-[48px] w-fit items-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] font-bold text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Go to sign in
          </Link>
        </section>
      ) : (
        <AgencyDetailsForm
          onSubmitted={() => data.update({ state: 'sent' })}
          onDuplicate={(message) => {
            setDuplicate(message);
            data.update({ state: 'already-registered' });
          }}
        />
      )}
      {state === 'already-registered' ? (
        <AgencyDuplicateDialog
          message={duplicate || 'A request from this email is already pending review.'}
          onClose={() => data.update({ state: null })}
        />
      ) : null}
    </AgencySignUpLayout>
  );
};

export default AgencySignUpPage;
