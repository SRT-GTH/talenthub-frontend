import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import RecruiterOnboardingPanel from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingPanel.jsx';
import OrganisationHeading from '../../../components/sections/recruiterOnboarding/organisation/OrganisationHeading.jsx';
import InfoNote from '../../../components/sections/recruiterOnboarding/organisation/InfoNote.jsx';
import OrganisationResultModal from '../../../components/sections/recruiterOnboarding/organisation/OrganisationResultModal.jsx';
import {
  ArrowheadDownIcon,
  BuildingIcon,
  PlaceholderCircle,
  StatusMailIcon,
} from '../../../components/sections/recruiterOnboarding/organisation/OrganisationIcons.jsx';
import {
  DISTRICTS_BY_REGION,
  INDUSTRY_OPTIONS,
  REGION_OPTIONS,
  SIZE_OPTIONS,
  createOrganisation,
  isValidWebsite,
  shortOrganisationName,
} from '../../../components/sections/recruiterOnboarding/organisation/organisationData.js';
import Button from '../../../components/ui/Button.jsx';
import { TextInput, Select, StickyActionBar } from '../../../components/ui/form';
import { ArrowRightIcon, LoadingSpinner } from '../../../components/shared/assets.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterCreateOrganisationPage');

/*
 * RecruiterCreateOrganisationPage - /onboarding/recruiter/organisation/create
 * (routeKey "createOrganisation")
 * Figma R04b: 7374:5818 default, 6038 filled, 6258 error, 6478 created (Primary Admin).
 *
 * Fields (Figma order): Organisation Legal Name*, Trading / Common Name (Optional),
 * Industry*, Organisation Size*, Website (Optional), Region*, District*.
 *  - default: empty form, CTA disabled (grey). Opened from the search step's "Create ..."
 *    link it pre-fills the legal name with what was typed (location.state.name).
 *  - filled: every required field set, CTA enabled.
 *  - error: shown per field on blur / after Enter is pressed in the form (the "demo
 *    trigger" for the Figma error frame): "Please select an industry", "Enter a valid URL,
 *    e.g. https://kentelabs.com.gh", "Please select a district" are Figma copy; the other
 *    required-field messages are assumptions (see notes).
 *  - created: CTA -> fake createOrganisation (~0.9 s) -> "Organisation created." modal
 *    (you are Primary Admin) -> Continue To Plan.
 *
 * State written through setSection:
 *   data.organisation = { mode: 'new', id, name, legalName, tradingName, industry, size,
 *                         website, region, district, affiliation: 'admin' }
 */

const EMPTY = {
  legalName: '',
  tradingName: '',
  industry: '',
  size: '',
  website: '',
  region: '',
  district: '',
};

const REQUIRED_MESSAGES = {
  legalName: 'Please enter the legal name',
  industry: 'Please select an industry',
  size: 'Please select a size',
  region: 'Please select a region',
  district: 'Please select a district',
};
const WEBSITE_MESSAGE = 'Enter a valid URL, e.g. https://kentelabs.com.gh';

// Figma helper rows under invalid fields: grey #575755 text with a green glyph (the
// shared Field paints them danger-red by default).
const FIELD_MESSAGE_TONE =
  '[&_[role=alert]]:text-[#575755]! [&_[role=alert]>span]:text-brand-green';

const RecruiterCreateOrganisationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSection } = useRecruiterOnboarding();

  const [values, setValues] = useState(() => ({
    ...EMPTY,
    legalName: typeof location.state?.name === 'string' ? location.state.name : '',
  }));
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const errors = useMemo(() => {
    const next = {};
    ['legalName', 'industry', 'size', 'region', 'district'].forEach((key) => {
      if (!values[key].trim()) next[key] = REQUIRED_MESSAGES[key];
    });
    if (!isValidWebsite(values.website)) next.website = WEBSITE_MESSAGE;
    return next;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;
  const show = (key) => (touched[key] || submitAttempted ? errors[key] : undefined);
  log('render', { valid: isValid, errorKeys: Object.keys(errors), submitting });

  // Figma 20-arrowhead-down: filled triangle - green once chosen, red when invalid.
  const chevron = (key) => (
    <ArrowheadDownIcon tone={show(key) ? 'red' : 'green'} className="size-5" />
  );

  const set = (key) => (value) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      // District options depend on region: drop a district that no longer belongs.
      if (key === 'region' && !(DISTRICTS_BY_REGION[value] ?? []).includes(prev.district)) {
        next.district = '';
      }
      return next;
    });
  };
  const onText = (key) => (e) => set(key)(e.target.value);
  const blur = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  const districtOptions = values.region
    ? (DISTRICTS_BY_REGION[values.region] ?? [])
    : Object.values(DISTRICTS_BY_REGION).flat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      log('submit blocked, revealing errors');
      setSubmitAttempted(true);
      return;
    }
    if (submitting) return;
    if (created) {
      setModalOpen(true);
      return;
    }
    const payload = {
      legalName: values.legalName.trim(),
      tradingName: values.tradingName.trim(),
      industry: values.industry,
      size: values.size,
      website: values.website.trim(),
      region: values.region,
      district: values.district,
    };
    setSubmitting(true);
    createOrganisation(payload)
      .then((org) => {
        const name = shortOrganisationName(payload.legalName);
        log('organisation created', org.id);
        setSection('organisation', {
          mode: 'new',
          ...payload,
          id: org.id,
          name,
          affiliation: 'admin',
        });
        setCreated({ ...org, name });
        setModalOpen(true);
      })
      .catch((err) => log('create organisation failed', err?.code))
      .finally(() => setSubmitting(false));
  };

  // The CTA is disabled while invalid (Figma), so Enter inside a field is the way to
  // reveal every error at once (also what the Figma error frame demonstrates).
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isValid && e.target.tagName === 'INPUT') {
      e.preventDefault();
      log('enter pressed while invalid, revealing errors');
      setSubmitAttempted(true);
    }
  };

  const continueToPlan = () => {
    log('continue to plan');
    setModalOpen(false);
    navigate(RECRUITER_ROUTES.plan.path);
  };

  return (
    <RecruiterOnboardingShell
      routeKey="createOrganisation"
      // Figma 7374:6478 (created) swaps the panel chips to "You become Primary Admin".
      panel={<RecruiterOnboardingPanel variant={modalOpen ? 'orgCreated' : 'profile'} />}
    >
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        noValidate
        className="flex w-full max-w-[698px] flex-col items-center gap-10 max-md:gap-3"
      >
        <div className="flex w-full flex-col items-center gap-4 max-md:gap-3">
          <OrganisationHeading
            number="04"
            label="Create Organisation"
            title="Add your organisation."
            subtitle="Just the basics — no documents or KYB checks. Your account is active right away and we monitor for misuse after sign-up."
          />

          <div className="flex w-full flex-col gap-3 text-left">
            <div className="grid grid-cols-2 items-start gap-x-4 gap-y-3 max-md:grid-cols-1">
              <TextInput
                className={`col-span-2 max-md:col-span-1 ${FIELD_MESSAGE_TONE}`}
                label="Organisation Legal Name"
                required
                placeholder="e.g. Kente Labs Ghana Limited"
                autoComplete="organization"
                leftIcon={<BuildingIcon />}
                value={values.legalName}
                onChange={onText('legalName')}
                onBlur={blur('legalName')}
                error={show('legalName')}
                inputClassName="max-md:text-[16px]!"
              />
              <TextInput
                className={FIELD_MESSAGE_TONE}
                label="Trading / Common Name"
                labelTrailing="Optional"
                labelTrailingClassName="text-[#595959]"
                placeholder="e.g. Kente Labs"
                leftIcon={<PlaceholderCircle />}
                value={values.tradingName}
                onChange={onText('tradingName')}
                inputClassName="max-md:text-[16px]!"
              />
              <Select
                className={FIELD_MESSAGE_TONE}
                label="Industry"
                required
                placeholder="Select industry"
                leftIcon={<PlaceholderCircle />}
                options={INDUSTRY_OPTIONS}
                value={values.industry || undefined}
                onChange={set('industry')}
                onBlur={blur('industry')}
                error={show('industry')}
                chevronIcon={chevron('industry')}
              />
              <Select
                className={FIELD_MESSAGE_TONE}
                label="Organisation Size"
                required
                placeholder="Select size"
                leftIcon={<PlaceholderCircle />}
                options={SIZE_OPTIONS}
                value={values.size || undefined}
                onChange={set('size')}
                onBlur={blur('size')}
                error={show('size')}
                chevronIcon={chevron('size')}
              />
              <TextInput
                className={FIELD_MESSAGE_TONE}
                label="Website"
                labelTrailing="Optional"
                labelTrailingClassName="text-[#595959]"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="https://"
                leftIcon={<PlaceholderCircle />}
                value={values.website}
                onChange={onText('website')}
                onBlur={blur('website')}
                error={show('website')}
                inputClassName={`max-md:text-[16px]! ${show('website') ? 'text-danger!' : ''}`}
              />
              <Select
                className={FIELD_MESSAGE_TONE}
                label="Region"
                required
                placeholder="Select region"
                leftIcon={<PlaceholderCircle />}
                options={REGION_OPTIONS}
                value={values.region || undefined}
                onChange={set('region')}
                onBlur={blur('region')}
                error={show('region')}
                chevronIcon={chevron('region')}
              />
              <Select
                className={FIELD_MESSAGE_TONE}
                label="District"
                required
                placeholder="Select district"
                leftIcon={<PlaceholderCircle />}
                options={districtOptions}
                value={values.district || undefined}
                onChange={set('district')}
                onBlur={blur('district')}
                error={show('district')}
                chevronIcon={chevron('district')}
              />
            </div>

            <InfoNote icon={<BuildingIcon size={20} className="size-5" />}>
              You&apos;ll be auto-assigned Primary Admin of this organisation you approve recruiters
              who ask to join, manage the subscription and billing. You can transfer this role
              later.
            </InfoNote>
          </div>
        </div>

        <StickyActionBar bleed={16}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid || submitting}
            state={submitting ? 'active' : undefined}
            leftIcon={submitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
            rightIcon={<ArrowRightIcon />}
            className="w-full"
            aria-busy={submitting}
          >
            Create Organisation
          </Button>
        </StickyActionBar>
      </form>

      {modalOpen && created && (
        <OrganisationResultModal
          title="Organisation created."
          caption="Primary Admin assigned"
          description={`${created.name} is live. Recruiters can now request to join you approve them.`}
          rows={[
            {
              icon: <BuildingIcon className="size-4" />,
              label: 'Organisation',
              value: created.name,
            },
            {
              icon: <StatusMailIcon className="size-3" />,
              label: 'Your role',
              value: 'Primary Admin',
            },
          ]}
          ctaLabel="Continue To Plan"
          onContinue={continueToPlan}
          onClose={() => setModalOpen(false)}
        />
      )}
    </RecruiterOnboardingShell>
  );
};

export default RecruiterCreateOrganisationPage;
