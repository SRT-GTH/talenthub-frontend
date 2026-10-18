import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import OrganisationHeading from '../../../components/sections/recruiterOnboarding/organisation/OrganisationHeading.jsx';
import InfoNote from '../../../components/sections/recruiterOnboarding/organisation/InfoNote.jsx';
import {
  TypeDedicatedIcon,
  TypeFreelanceIcon,
} from '../../../components/sections/recruiterOnboarding/organisation/OrganisationIcons.jsx';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import { StickyActionBar } from '../../../components/ui/form';
import { ArrowRightIcon } from '../../../components/shared/assets.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { setRecruiterType } from '../../../services/recruiterOnboarding.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterTypePage');

/*
 * RecruiterTypePage - /onboarding/recruiter/type  (routeKey "type")
 * Figma R03: 7374:3747 none selected, 7374:3962 Dedicated selected, 7374:4177 Freelance selected.
 *
 * Two radio-style cards (a real radiogroup: roving tabindex, arrow keys move + select),
 * a help banner whose copy follows the selection, and a Continue button that stays disabled
 * until a card is chosen. The CTA label follows the choice, verbatim from Figma.
 *   Dedicated -> /onboarding/recruiter/organisation
 *   Freelance -> skips the organisation step ("Skip organisation now and affiliate with
 *                several organisations later") -> /onboarding/recruiter/plan
 *
 * State written through setSection:
 *   data.recruiterType = 'dedicated' | 'freelance'
 */

const OPTIONS = [
  {
    value: 'dedicated',
    tag: 'DEDICATED RECRUITER',
    headline: 'I hire for one organisation.',
    description:
      "You work in-house (e.g. HR at MTN Ghana). Next, you'll find your organisation or create it.",
    Icon: TypeDedicatedIcon,
    banner:
      "Dedicated recruiters link to one organisation. If it's already on GTH, its Primary Admin approves your request.",
    cta: 'Continue As Dedicated Recruiter',
    next: RECRUITER_ROUTES.organisation.path,
  },
  {
    value: 'freelance',
    tag: 'PROFESSIONAL / FREELANCE',
    headline: 'I recruit for clients.',
    description:
      'Talent broker or agency recruiter. Skip organisation now and affiliate with several organisations later.',
    Icon: TypeFreelanceIcon,
    banner:
      'As a freelance recruiter, jobs you post show your name. You can affiliate with multiple organisations anytime from Settings.',
    cta: 'Continue As Freelance Recruiter',
    next: RECRUITER_ROUTES.plan.path,
  },
];

const IDLE_BANNER =
  'Not sure? Pick Dedicated if your employer pays your salary; pick Freelance if you place talent for clients.';

const RecruiterTypePage = () => {
  const navigate = useNavigate();
  const { data, setSection } = useRecruiterOnboarding();
  const [choice, setChoice] = useState(data.recruiterType ?? null);
  const cardRefs = useRef([]);

  const selected = OPTIONS.find((o) => o.value === choice) ?? null;
  log('render', { choice });

  const pick = (value, index) => {
    log('pick', value);
    setChoice(value);
    if (index !== undefined) cardRefs.current[index]?.focus();
  };

  // Radio-group keyboard model: arrows move focus AND selection, wrapping.
  const onKeyDown = (e, index) => {
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (!forward && !backward) return;
    e.preventDefault();
    const nextIndex = (index + (forward ? 1 : -1) + OPTIONS.length) % OPTIONS.length;
    pick(OPTIONS[nextIndex].value, nextIndex);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    log('continue', selected.value, '->', selected.next);
    setRecruiterType(selected.value)
      .then(() => {
        setSection('recruiterType', selected.value);
        navigate(selected.next);
      })
      .catch((err) => log('save type failed', err?.code));
  };

  return (
    <RecruiterOnboardingShell routeKey="type">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[698px] flex-col items-center gap-10 max-md:gap-3"
      >
        <div className="flex w-full flex-col items-center gap-4 max-md:gap-3">
          <OrganisationHeading
            number="03"
            label="Recruiter Type"
            title="How do you recruit?"
            subtitle="Tell us how you work so we can set up the right workspace. You can change this later in Settings."
          />

          <div className="flex w-full flex-col gap-4 max-md:gap-3">
            <div
              role="radiogroup"
              aria-label="Recruiter Type"
              className="grid w-full grid-cols-2 gap-4 pb-1.5 max-sm:grid-cols-1 max-md:gap-3"
            >
              {OPTIONS.map((option, index) => {
                const { value, tag, headline, description } = option;
                const Icon = option.Icon;
                const isSelected = choice === value;
                // Roving tabindex: the checked card, else the first card, is the tab stop.
                const tabStop = choice ? isSelected : index === 0;
                return (
                  <Card
                    key={value}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-pressed={undefined}
                    tabIndex={tabStop ? 0 : -1}
                    selected={isSelected}
                    onClick={() => pick(value)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                    icon={<Icon selected={isSelected} className="size-[50px]" />}
                    tag={tag}
                    headline={headline}
                    headlineVariant="heading"
                    description={description}
                    className="h-auto! min-h-[267px] max-md:min-h-0"
                  />
                );
              })}
            </div>

            <div aria-live="polite">
              <InfoNote>{selected ? selected.banner : IDLE_BANNER}</InfoNote>
            </div>
          </div>
        </div>

        <StickyActionBar bleed={16}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!selected}
            rightIcon={<ArrowRightIcon />}
            className="w-full"
          >
            {selected ? selected.cta : 'Continue'}
          </Button>
        </StickyActionBar>
      </form>
    </RecruiterOnboardingShell>
  );
};

export default RecruiterTypePage;
