import { useState } from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import Button from '../components/ui/Button.jsx';
import Captions from '../components/ui/Captions.jsx';
import Card from '../components/ui/Card.jsx';
import Loader from '../components/ui/Loader.jsx';
import MiniCard from '../components/ui/MiniCard.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Tag from '../components/ui/Tag.jsx';
import WatchTutorial from '../components/ui/WatchTutorial.jsx';
import {
  Checkbox,
  Select,
  Textarea,
  TextInput,
  Upload,
  VerificationCode,
} from '../components/ui/form';
import { debug } from '../utils/debug.js';

const log = debug('HomePage');

// Inline icons used in showcase. Production code should pull from a real icon set.
const ArrowRight = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path
      d="M4 10h12m0 0-5-5m5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="m2 4 6 4.5L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const LockIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <rect x="2.5" y="7" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 7V5a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const EyeIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path d="M2 10s2.5-5 8-5 8 5 8 5-2.5 5-8 5-8-5-8-5Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path
      d="M3.5 5 16.5 15M5 7.4C3.4 8.6 2 10 2 10s2.5 5 8 5c1.4 0 2.6-.3 3.7-.8M9 5.1c.3 0 .7-.1 1-.1 5.5 0 8 5 8 5s-.7 1.5-2.2 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PhoneIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path
      d="M3 3.5C3 2.7 3.7 2 4.5 2H6l1.5 3.5L6 7c.8 1.7 2.3 3.2 4 4l1.5-1.5L15 11v1.5c0 .8-.7 1.5-1.5 1.5C7.6 14 2 8.4 2 4.5 2 3.7 3 3.5 3 3.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

// mortarboard-02 — pulled directly from Figma node 2153:11813.
// Composed of three SVG paths positioned by % inset to match Figma's
// nested-SVG layout exactly. Stroke colour comes from `currentColor`
// so the parent (Card) controls neutral grey vs brand-green tint.
const MortarboardIcon = (props) => (
  <span
    className="relative block size-full"
    aria-hidden="true"
    style={{ color: 'currentColor' }}
    {...props}
  >
    {/* Cap top */}
    <span
      className="absolute"
      style={{ top: '12.5%', left: '8.33%', right: '8.45%', bottom: '45.83%' }}
    >
      <svg
        viewBox="0 0 44.7731 23.1667"
        preserveAspectRatio="none"
        fill="none"
        className="block size-full overflow-visible"
      >
        <path
          d="M0.75 11.5833C0.75 14.4905 18.289 22.4167 22.3866 22.4167C26.4839 22.4167 44.0231 14.4905 44.0231 11.5833C44.0231 8.67614 26.4839 0.75 22.3866 0.75C18.289 0.75 0.75 8.67614 0.75 11.5833Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    {/* Cap brim (the curve under the top) */}
    <span
      className="absolute"
      style={{ top: '45.83%', left: '24.98%', right: '25.09%', bottom: '20.83%' }}
    >
      <svg
        viewBox="0 0 27.4638 18.8333"
        preserveAspectRatio="none"
        fill="none"
        className="block size-full overflow-visible"
      >
        <path
          d="M0.750013 0.750013L1.28109 12.9481C1.2917 13.1923 1.31811 13.4369 1.3889 13.6709C1.60767 14.3942 2.01088 15.0513 2.62604 15.4929C7.43921 18.9468 20.0246 18.9468 24.8376 15.4929C25.4532 15.0513 25.8562 14.3942 26.075 13.6709C26.1456 13.4369 26.1721 13.1923 26.1829 12.9481L26.7137 0.750013"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    {/* Tassel hanging on the right */}
    <span
      className="absolute"
      style={{ top: '39.58%', left: '78.94%', right: '8.33%', bottom: '12.5%' }}
    >
      <svg
        viewBox="0 0 8.11997 26.4167"
        preserveAspectRatio="none"
        fill="none"
        className="block size-full overflow-visible"
      >
        <path
          d="M4.06079 0.75V15.9167M4.06079 15.9167C2.34479 19.0503 1.58602 20.7293 0.815336 23.5C0.648069 24.4858 0.780883 24.9826 1.46035 25.4238C1.73638 25.603 2.0681 25.6667 2.397 25.6667H5.6912C6.04155 25.6667 6.39493 25.5936 6.68332 25.3947C7.3149 24.9592 7.4774 24.4815 7.30624 23.5C6.63067 20.9273 5.77007 19.1684 4.06079 15.9167Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </span>
);

const BriefcaseIcon = (props) => (
  <svg viewBox="0 0 52 52" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <rect x="6" y="16" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2.2" />
    <path d="M18 16v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" stroke="currentColor" strokeWidth="2.2" />
    <path d="M6 28h40" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

const SparklesIcon = (props) => (
  <svg viewBox="0 0 52 52" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path
      d="M26 8 28.5 19l11 2.5-11 2.5L26 35l-2.5-11-11-2.5 11-2.5L26 8Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M40 36l1.2 4.4L45.6 42l-4.4 1.2L40 47.6 38.8 43 34 42l4.8-1.6L40 36Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const IdIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="6" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M9.5 7h3M9.5 9.5h3M4 11.5h5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const VARIANTS = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'tertiary', label: 'Tertiary (white shelf)' },
  { id: 'tertiary-subtle', label: 'Tertiary subtle (green pill)' },
  { id: 'tertiary-cream', label: 'Tertiary cream' },
];

const SIZES = ['lg', 'md', 'sm'];
const STATES = ['default', 'hover', 'active', 'disabled'];

const VariantSection = ({ variant, label }) => {
  log('render variant section:', variant);
  return (
    <section className="mb-16">
      <h3 className="text-strong-300 text-content-primary mb-6">{label}</h3>

      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-x-6 border-spacing-y-4">
          <thead>
            <tr>
              <th className="text-medium-75 text-content-tertiary text-left">size</th>
              {STATES.map((state) => (
                <th
                  key={state}
                  className="text-medium-75 text-content-tertiary text-left capitalize"
                >
                  {state}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size) => (
              <tr key={size}>
                <td className="text-medium-75 text-content-tertiary uppercase">{size}</td>
                {STATES.map((state) => (
                  <td key={state}>
                    <Button variant={variant} size={size} state={state}>
                      Get started Free
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const HomePage = () => {
  log('mount');
  return (
    <section className="px-6 pt-[140px] pb-16 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-display-lg text-content-primary mb-3">TalentHub</h1>
        <p className="text-medium-200 text-content-secondary">
          Design-system playground. Each section below renders Figma component variants and states.
          See <code>wiki/components.md</code> for the component catalogue.
        </p>
      </header>

      <h2 className="text-display-md text-content-primary mb-8">Buttons</h2>

      {/* Interactive row — real :hover / :active behaviour. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          Interactive (hover / click to see live transitions)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Each button below uses the same base component as the static states below — the visuals
          come from <code>:hover</code>, <code>:active</code> and <code>:disabled</code> CSS
          pseudo-classes.
        </p>
        <div className="flex flex-wrap gap-4">
          {VARIANTS.map(({ id, label }) => (
            <Button
              key={id}
              variant={id}
              size="lg"
              rightIcon={<ArrowRight />}
              onClick={() => log('clicked:', id)}
            >
              {label}
            </Button>
          ))}
          <Button variant="primary" size="lg" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Static state matrices — every variant × size × state. */}
      {VARIANTS.map(({ id, label }) => (
        <VariantSection key={id} variant={id} label={label} />
      ))}

      {/* Icon variants demo. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-6">With icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" leftIcon={<ArrowRight />}>
            Left icon
          </Button>
          <Button variant="primary" rightIcon={<ArrowRight />}>
            Right icon
          </Button>
          <Button variant="primary" leftIcon={<ArrowRight />} rightIcon={<ArrowRight />}>
            Both icons
          </Button>
          <Button variant="secondary" rightIcon={<ArrowRight />} size="md">
            Secondary md
          </Button>
          <Button variant="tertiary" leftIcon={<ArrowRight />} size="sm">
            Tertiary sm
          </Button>
        </div>
      </section>

      <FormsSection />
    </section>
  );
};

const INPUT_STATES = [
  {
    state: 'default',
    label: 'Default',
    helperText: 'Helper text appears below the input',
  },
  {
    state: 'focus',
    label: 'Focus',
    helperText: 'Active state — green border + warm background',
  },
  {
    state: 'verified',
    label: 'Verified',
    helperText: 'Validated input — same green tone, lighter border',
  },
  {
    state: 'error',
    label: 'Error',
    error: 'Please enter a valid value',
  },
  {
    state: 'disabled',
    label: 'Disabled',
    helperText: 'Field is locked',
  },
];

const FormsSection = () => {
  log('render forms section');
  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Form inputs</h2>

      {/* Pinned states for documentation. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          The <code>state</code> prop is showcase-only — in production usage, focus is driven
          automatically by <code>:focus-within</code>, and <code>error</code> /{' '}
          <code>verified</code> / <code>disabled</code> are real props you'd toggle from form state.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {INPUT_STATES.map((entry) => (
            <TextInput
              key={entry.state}
              label={entry.label}
              required
              optional
              state={entry.state}
              placeholder="abena@example.com"
              defaultValue={entry.state !== 'default' ? 'abena@example.com' : ''}
              leftIcon={<MailIcon />}
              helperText={entry.helperText}
              error={entry.error}
            />
          ))}
        </div>
      </section>

      {/* Real-world examples. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-6">Real-world examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <TextInput
            label="Email"
            required
            type="email"
            placeholder="youremail@gmail.com"
            leftIcon={<MailIcon />}
            helperText="Enter your email address"
          />
          <TextInput
            label="Phone number"
            required
            type="tel"
            placeholder="+233 XXXXXXXXX"
            leftIcon={<PhoneIcon />}
            helperText="Ghana format · +233XXXXXXXXX"
          />
          <PasswordInput />
          <TextInput
            label="ID number"
            optional
            placeholder="GHA-XXXXXXXXX-X"
            leftIcon={<IdIcon />}
            helperText="At least one ID required · stored encrypted"
          />
        </div>
      </section>

      {/* Interactive — type into inputs to see focus state and validation. */}
      <InteractiveForm />

      <TextareasSection />

      <CheckboxesSection />

      <VerificationCodesSection />

      <SelectsSection />

      <UploadsSection />

      <CardsSection />

      <MiniCardsSection />

      <TagsSection />

      <ProgressBarsSection />

      <LoadersSection />

      <OtherComponentsSection />
    </>
  );
};

const CARD_STATES = [
  { state: 'default', label: 'Default' },
  { state: 'hover', label: 'Hover' },
  { state: 'selected', label: 'Selected' },
  { state: 'disabled', label: 'Disabled' },
];

const STUDENT_CARD = {
  icon: <MortarboardIcon />,
  tag: 'STUDENT/GRADUATE',
  headline: 'Build my future.',
  description:
    'Discover your strengths, build a verified profile and get matched with real opportunities',
};

const CardsSection = () => {
  log('render cards section');
  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Cards</h2>

      {/* Pinned states grid. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Same shelf-shadow language as Button. At rest the card sits on a subtle elevation; on
          hover it lifts onto a 6px grey shelf; selected pins to a 6px brand-green shelf with
          brand-green accents on the icon, tag, and headline.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARD_STATES.map(({ state, label }) => (
            <div key={state} className="flex flex-col gap-2">
              <span className="text-medium-75 text-content-tertiary uppercase">{label}</span>
              <Card state={state} {...STUDENT_CARD} />
            </div>
          ))}
        </div>
      </section>

      {/* Interactive selection group. */}
      <InteractiveCards />
    </>
  );
};

const ROLES = [
  {
    value: 'student',
    icon: <MortarboardIcon />,
    tag: 'STUDENT/GRADUATE',
    headline: 'Build my future.',
    description:
      'Discover your strengths, build a verified profile and get matched with real opportunities',
  },
  {
    value: 'employer',
    icon: <BriefcaseIcon />,
    tag: 'EMPLOYER/PARTNER',
    headline: 'Find great talent.',
    description:
      'Post roles, browse verified candidates, and connect with the next generation of African talent',
  },
  {
    value: 'mentor',
    icon: <SparklesIcon />,
    tag: 'MENTOR',
    headline: 'Pay it forward.',
    description:
      'Share your experience and guide students through career decisions on a curated calendar',
  },
];

const InteractiveCards = () => {
  const [selected, setSelected] = useState(null);
  log('InteractiveCards render, selected:', selected);

  return (
    <section className="mb-16">
      <h3 className="text-strong-300 text-content-primary mb-2">
        Interactive (radio-style selection group)
      </h3>
      <p className="text-medium-75 text-content-secondary mb-6">
        Click a card to select it. Each card uses the same component — only <code>selected</code>{' '}
        differs based on the parent's chosen value. The wrapper has <code>role="radiogroup"</code>{' '}
        for accessibility.
      </p>
      <div
        role="radiogroup"
        aria-label="Choose your role"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {ROLES.map((role) => (
          <Card
            key={role.value}
            icon={role.icon}
            tag={role.tag}
            headline={role.headline}
            description={role.description}
            selected={selected === role.value}
            onClick={() => {
              log('selected:', role.value);
              setSelected(role.value);
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-medium-75 text-content-secondary">
        {selected ? (
          <>
            Selected: <code>{selected}</code>
          </>
        ) : (
          'No card selected yet'
        )}
      </p>
    </section>
  );
};

const COUNTRY_OPTIONS = [
  { value: 'gh', label: 'Ghana' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'ke', label: 'Kenya' },
  { value: 'za', label: 'South Africa' },
  { value: 'tz', label: 'Tanzania' },
  { value: 'ug', label: 'Uganda' },
];

const SELECT_STATES = [
  { state: 'default', label: 'Default', helperText: 'Tap to open the menu' },
  {
    state: 'open',
    label: 'Open',
    helperText: 'Pinned-open menu (showcase only)',
  },
  {
    state: 'verified',
    label: 'Verified',
    helperText: '✓ Level selected',
    pinnedValue: 'gh',
  },
  {
    state: 'error',
    label: 'Error',
    error: 'Please pick an option',
  },
  {
    state: 'disabled',
    label: 'Disabled',
    helperText: 'Field is locked',
  },
];

const SelectsSection = () => {
  log('render selects section');
  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Dropdowns</h2>

      {/* Pinned states. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          The closed-state visuals reuse the TextInput state ladder; the open variant adds a 2px
          green-bordered popover with an inverse 4px shelf shadow above it (so trigger + menu look
          connected).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {SELECT_STATES.map((entry) => (
            <Select
              key={entry.state}
              label={entry.label}
              required
              optional
              state={entry.state}
              placeholder="Select your country"
              options={COUNTRY_OPTIONS}
              defaultValue={entry.pinnedValue}
              helperText={entry.helperText}
              error={entry.error}
            />
          ))}
        </div>
      </section>

      {/* Cascading example — Level + Grade where Grade is locked until Level chosen. */}
      <CascadingExample />

      {/* Interactive Select with searchable filter. */}
      <InteractiveSelect />
    </>
  );
};

const LEVEL_OPTIONS = [
  { value: 'undergrad', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'phd', label: 'PhD' },
];

const GRADE_OPTIONS_BY_LEVEL = {
  undergrad: [
    { value: 'first', label: 'First Class' },
    { value: 'upper-second', label: 'Upper Second' },
    { value: 'lower-second', label: 'Lower Second' },
    { value: 'third', label: 'Third Class' },
  ],
  graduate: [
    { value: 'distinction', label: 'Distinction' },
    { value: 'merit', label: 'Merit' },
    { value: 'pass', label: 'Pass' },
  ],
  phd: [
    { value: 'awarded', label: 'Awarded' },
    { value: 'in-progress', label: 'In progress' },
  ],
};

const CascadingExample = () => {
  const [level, setLevel] = useState();
  const [grade, setGrade] = useState();
  log('CascadingExample render', { level, grade });

  // Reset grade when level changes — different levels have different grade options.
  const handleLevelChange = (next) => {
    log('level change:', next);
    setLevel(next);
    setGrade(undefined);
  };

  return (
    <section className="mb-16">
      <h3 className="text-strong-300 text-content-primary mb-2">
        Cascading (parent unlocks child)
      </h3>
      <p className="text-medium-75 text-content-secondary mb-6">
        Cascading is composed at the parent level — pass <code>disabled={'{!level}'}</code> from the
        child Select. No special prop required on the component.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Select
          label="Education Level"
          required
          placeholder="Select your level"
          options={LEVEL_OPTIONS}
          value={level}
          onChange={handleLevelChange}
          helperText="This unlocks the Grade field"
        />
        <Select
          label="Grade"
          required
          placeholder={level ? 'Select your grade' : 'Cannot be edited'}
          options={level ? GRADE_OPTIONS_BY_LEVEL[level] : []}
          value={grade}
          onChange={setGrade}
          disabled={!level}
          helperText={!level ? 'Select Level first' : 'Pick from the grade scale'}
        />
      </div>
    </section>
  );
};

const InteractiveSelect = () => {
  const [country, setCountry] = useState();
  log('InteractiveSelect render, country:', country);

  return (
    <section className="mb-16">
      <h3 className="text-strong-300 text-content-primary mb-2">Interactive (with search)</h3>
      <p className="text-medium-75 text-content-secondary mb-6">
        Click the trigger or press <kbd>↓</kbd> to open. Type to filter. Click an option or press{' '}
        <kbd>Esc</kbd> to close.
      </p>
      <div className="max-w-md">
        <Select
          label="Country"
          required
          placeholder="Select your country"
          options={COUNTRY_OPTIONS}
          value={country}
          onChange={setCountry}
          searchable
          verified={Boolean(country)}
          helperText={country ? `✓ Selected: ${country.toUpperCase()}` : 'Search from 6 countries'}
        />
      </div>
    </section>
  );
};

const TEXTAREA_STATES = [
  { state: 'default', label: 'Default', helperText: 'Helper text below the textarea' },
  { state: 'focus', label: 'Focus / filled' },
  { state: 'verified', label: 'Verified' },
  { state: 'error', label: 'Error', error: 'Please tell us a bit more' },
  { state: 'disabled', label: 'Disabled' },
];

const TextareasSection = () => {
  const [bio, setBio] = useState(
    "Software engineer with 5 years of experience building web apps. I'm passionate about clean APIs and design systems."
  );
  log('TextareasSection render, bioLen:', bio.length);

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Text area</h2>

      {/* Pinned states. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Same state ladder as TextInput — but the active visual is a green-tinted bg (
          <code>#eef7f2</code>) instead of yellow-light. Default height 100px, drag the corner to
          grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {TEXTAREA_STATES.map((entry) => (
            <Textarea
              key={entry.state}
              label={entry.label}
              optional
              state={entry.state}
              placeholder="Describe what needs correcting and why…"
              defaultValue={
                entry.state === 'focus' || entry.state === 'verified'
                  ? 'This is what filled content looks like in the active visual.'
                  : ''
              }
              maxLength={500}
              helperText={entry.helperText}
              error={entry.error}
            />
          ))}
        </div>
      </section>

      {/* Interactive — character counter ladder. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          Interactive (character counter)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Type to see the counter shift colour: neutral until 90% of the limit, gold at 90%, red
          when over.
        </p>
        <div className="max-w-2xl">
          <Textarea
            label="Bio"
            required
            placeholder="Tell us about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            helperText="Markdown is not supported"
          />
        </div>
      </section>
    </>
  );
};

const UPLOAD_STATES = [
  { state: 'default', label: 'Default' },
  { state: 'hover', label: 'Hover (drag-over)' },
  { state: 'loading', label: 'Loading', progress: 60 },
  { state: 'received', label: 'Received', filename: 'UIUX_TEAM_DEVELOPMENT_TRACKER.xlsx' },
];

const UploadsSection = () => {
  const [picked, setPicked] = useState(null);
  const [progress, setProgress] = useState(null);
  const [done, setDone] = useState(null);
  log('UploadsSection render', { picked: picked?.name, progress, done });

  const handlePick = (file) => {
    log('picked file:', file.name, file.size);
    setPicked(file);
    setDone(null);
    setProgress(0);
    // Simulate an upload — increment progress, then mark done.
    let pct = 0;
    const tick = () => {
      pct += 12;
      if (pct >= 100) {
        setProgress(null);
        setDone(file.name);
      } else {
        setProgress(pct);
        setTimeout(tick, 300);
      }
    };
    setTimeout(tick, 300);
  };

  const handleReset = () => {
    log('reset upload');
    setPicked(null);
    setProgress(null);
    setDone(null);
  };

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Upload</h2>

      {/* Pinned states. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          The upload visual is derived from props — pass <code>filename</code> for received,
          <code>progress</code> for loading. Drag-over (hover) is driven automatically by browser
          drag events; <code>state</code> is showcase-only.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {UPLOAD_STATES.map((entry) => (
            <Upload
              key={entry.state}
              label={entry.label}
              optional
              acceptLabels={['.csv', '.xlsx', '.xls']}
              state={entry.state}
              progress={entry.progress}
              filename={entry.filename}
            />
          ))}
        </div>
      </section>

      {/* Interactive — pick a real file from disk. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Interactive</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Drag a file onto the dropzone or click "browse" to pick one. The component walks through
          loading → received automatically (simulated; real uploads are consumer-driven).
        </p>
        <div className="max-w-2xl flex flex-col gap-4">
          <Upload
            label="Upload a CSV"
            required
            accept=".csv,.xlsx,.xls"
            acceptLabels={['.csv', '.xlsx', '.xls']}
            onFileSelect={handlePick}
            progress={progress}
            filename={done}
            helperText="Max 25MB · stored encrypted"
          />
          {(picked || done) && (
            <Button variant="tertiary" size="sm" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

// user-star-01 — pulled directly from Figma node 3176:29383
const UserStarIcon = (props) => (
  <svg viewBox="0 0 21 21" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path
      d="M13.125 7C13.125 4.58376 11.1662 2.625 8.75 2.625C6.33376 2.625 4.375 4.58376 4.375 7C4.375 9.41622 6.33376 11.375 8.75 11.375C11.1662 11.375 13.125 9.41622 13.125 7Z"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.625 17.5C2.625 14.1173 5.36726 11.375 8.75 11.375C9.86562 11.375 10.9116 11.6733 11.8125 12.1944"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8416 12.6923L16.3805 13.7791C16.454 13.9304 16.65 14.0754 16.8153 14.1033L17.7922 14.2669C18.4168 14.3719 18.5638 14.8288 18.1137 15.2796L17.3543 16.0452C17.2257 16.1749 17.1553 16.4251 17.1951 16.6041L17.4125 17.552C17.584 18.3022 17.189 18.5924 16.5306 18.2003L15.615 17.6538C15.4496 17.555 15.1772 17.555 15.0087 17.6538L14.0931 18.2003C13.4378 18.5924 13.0397 18.2991 13.2112 17.552L13.4286 16.6041C13.4685 16.4251 13.398 16.1749 13.2694 16.0452L12.51 15.2796C12.0629 14.8288 12.2068 14.3719 12.8315 14.2669L13.8083 14.1033C13.9706 14.0754 14.1666 13.9304 14.2401 13.7791L14.779 12.6923C15.073 12.1026 15.5507 12.1026 15.8416 12.6923Z"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SchoolIcon = (props) => (
  <svg viewBox="0 0 21 21" fill="none" aria-hidden="true" width="100%" height="100%" {...props}>
    <path
      d="M10.5 3 2 7l8.5 4L19 7l-8.5-4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M5 9v4c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3V9" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const MiniCardsSection = () => {
  const [selectedStep, setSelectedStep] = useState(null);
  log('MiniCardsSection render', { selectedStep });

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Mini cards</h2>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Horizontal step / task card with icon, heading + status badge, description, meta tags, and
          a forward action button. <code>selected</code> flips the border + 3px shelf to
          brand-green.
        </p>
        <div className="flex flex-col gap-4">
          <MiniCard
            icon={<UserStarIcon />}
            heading="Avatar"
            status="✓ Done"
            description="show up as you"
            tags={
              <>
                <Tag variant="chip" color="brand">
                  Avatar set
                </Tag>
                <Tag variant="chip" color="neutral">
                  ~3 min
                </Tag>
              </>
            }
            onAction={() => log('avatar action')}
          />
          <MiniCard
            icon={<UserStarIcon />}
            heading="Avatar"
            status="✓ Done"
            description="show up as you"
            tags={
              <>
                <Tag variant="chip" color="brand">
                  Avatar set
                </Tag>
                <Tag variant="chip" color="neutral">
                  ~3 min
                </Tag>
              </>
            }
            selected
            onAction={() => log('avatar action selected')}
          />
        </div>
      </section>

      {/* Interactive checklist. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          Interactive (onboarding checklist)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Click a card&apos;s arrow to mark it as the active step. Selection state lives in the
          parent — same compose-at-consumer pattern as Card.
        </p>
        <div className="flex flex-col gap-4 max-w-3xl">
          <MiniCard
            icon={<UserStarIcon />}
            heading="Set your avatar"
            status="✓ Done"
            description="Show up as you"
            tags={
              <>
                <Tag variant="chip" color="success">
                  Complete
                </Tag>
                <Tag variant="chip" color="neutral">
                  ~3 min
                </Tag>
              </>
            }
            selected={selectedStep === 'avatar'}
            onAction={() => setSelectedStep('avatar')}
          />
          <MiniCard
            icon={<SchoolIcon />}
            heading="Verify your education"
            description="Upload your transcript or letter"
            tags={
              <>
                <Tag variant="chip" color="warning">
                  Required
                </Tag>
                <Tag variant="chip" color="neutral">
                  ~5 min
                </Tag>
              </>
            }
            selected={selectedStep === 'education'}
            onAction={() => setSelectedStep('education')}
          />
          <MiniCard
            icon={<UserStarIcon />}
            heading="Tell us your story"
            description="A short bio shown on your profile"
            tags={
              <>
                <Tag variant="chip">Optional</Tag>
                <Tag variant="chip" color="neutral">
                  ~2 min
                </Tag>
              </>
            }
            selected={selectedStep === 'bio'}
            onAction={() => setSelectedStep('bio')}
          />
        </div>
        {selectedStep && (
          <p className="mt-4 text-medium-75 text-content-secondary">
            Active step: <code>{selectedStep}</code>
          </p>
        )}
      </section>
    </>
  );
};

const TAG_COLORS = [
  { color: 'brand', label: 'Brand (default)' },
  { color: 'success', label: 'Success' },
  { color: 'warning', label: 'Warning' },
  { color: 'danger', label: 'Danger' },
  { color: 'neutral', label: 'Neutral' },
];

const TagsSection = () => {
  log('TagsSection render');

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Tags</h2>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Colors</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Five semantic colors. The Figma source shows the brand variant; the others extend the
          token ladder for status / warn / danger / muted callouts.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {TAG_COLORS.map(({ color, label }) => (
            <Tag key={color} color={color}>
              {label}
            </Tag>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Sizes (pill only)</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          <code>md</code> matches Figma (px-12 py-8); <code>sm</code> is denser for
          inline-with-text.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Chip variant</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Flat-cornered (4px), denser, semibold weight — matches the meta-tags inside MiniCard
          (Figma <code>3179:29793</code> brand and <code>3179:29795</code> neutral). Use{' '}
          <code>variant=&quot;chip&quot;</code> when stacking compact metadata inline (status,
          duration, category).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {TAG_COLORS.map(({ color, label }) => (
            <Tag key={color} variant="chip" color={color}>
              {label}
            </Tag>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Composition</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Children are ReactNode — embed structured content like a bold leading value.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Tag>
            <strong className="text-brand-green">11%</strong>{' '}
            <span className="text-neutral-dark-active">Completed</span>
          </Tag>
          <Tag color="success">✓ Verified</Tag>
          <Tag color="warning">⚠ Pending review</Tag>
          <Tag color="danger">Profile incomplete</Tag>
        </div>
      </section>
    </>
  );
};

const ProgressBarsSection = () => {
  const [pct, setPct] = useState(35);
  log('ProgressBarsSection render, pct:', pct);

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Progress bars</h2>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Brand-green fill on a brand-green-light track. <code>md</code> matches Figma (6px),{' '}
          <code>sm</code> is 4px (used inside Upload's loading state).
        </p>
        <div className="flex flex-col gap-6 max-w-md">
          {[0, 33, 66, 100].map((value) => (
            <div key={value} className="flex flex-col gap-2">
              <span className="text-medium-75 text-content-tertiary uppercase">{value}%</span>
              <ProgressBar value={value} label={`${value}% complete`} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Sizes</h3>
        <div className="flex flex-col gap-6 max-w-md">
          <ProgressBar value={50} size="sm" label="50% — small" />
          <ProgressBar value={50} size="md" label="50% — medium" />
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Indeterminate</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Use when the duration is unknown (loading data of indeterminate size). Falls back to a
          pulsing full-width bar.
        </p>
        <div className="max-w-md">
          <ProgressBar indeterminate label="Loading…" />
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Interactive</h3>
        <div className="flex flex-col gap-4 max-w-md">
          <ProgressBar value={pct} max={100} label={`${pct}% complete`} />
          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            aria-label="Adjust progress"
            className="w-full"
          />
          <p className="text-medium-75 text-content-secondary">
            Value: <code>{pct}</code>
          </p>
        </div>
      </section>
    </>
  );
};

const TUTORIAL_LOG = (label) => () => log('watch tutorial click:', label);

const OtherComponentsSection = () => {
  const [step, setStep] = useState(2);
  log('OtherComponentsSection render, step:', step);

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Other components</h2>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Watch tutorial widget</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Floating helper that links to the onboarding tutorial. Same shelf-shadow DNA as Button —
          the circular play button presses down on click. Pass <code>showLabel={'{false}'}</code> to
          render the icon-only variant.
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex flex-col gap-3 items-start">
            <span className="text-medium-75 text-content-tertiary uppercase">With label</span>
            <WatchTutorial onClick={TUTORIAL_LOG('with-label')} />
          </div>
          <div className="flex flex-col gap-3 items-start">
            <span className="text-medium-75 text-content-tertiary uppercase">Icon only</span>
            <WatchTutorial showLabel={false} onClick={TUTORIAL_LOG('icon-only')} />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Breadcrumbs (vertical steps)</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Vertical step list. Click a step below to advance the active marker. Past steps render as
          completed (green check, grey label); the current step is brand-green semibold; future
          steps are grey.
        </p>
        <div className="flex flex-wrap gap-12 items-start">
          <Breadcrumbs
            items={['Profile', 'Documents', 'Verification', 'Review']}
            currentIndex={step}
          />
          <div className="flex flex-col gap-2 max-w-xs">
            <span className="text-medium-75 text-content-tertiary uppercase">Advance</span>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Button
                  key={i}
                  variant={i === step ? 'primary' : 'tertiary'}
                  size="sm"
                  onClick={() => setStep(i)}
                >
                  Step {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Captions (horizontal journey)</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Compact "you are here" indicator with chevron-separated steps. Used as a header strip on
          onboarding screens to show progress at a glance.
        </p>
        <div className="flex flex-col gap-3 items-start">
          <Captions items={['Register', 'Get Assessed', 'Get Matched']} currentIndex={2} />
          <Captions items={['Register', 'Get Assessed', 'Get Matched']} currentIndex={0} />
          <Captions items={['Register', 'Get Assessed', 'Get Matched']} currentIndex={1} />
        </div>
      </section>
    </>
  );
};

const LOADER_SIZES = [
  { size: 'sm', label: 'Small (32px)' },
  { size: 'md', label: 'Medium (60px) — default' },
  { size: 'lg', label: 'Large (96px)' },
];

const LoadersSection = () => {
  log('LoadersSection render');

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Loaders</h2>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Sizes</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          A brand-green circular spinner with three preset sizes. Uses native CSS spin via
          Tailwind&apos;s <code>animate-spin</code>; the SVG arc covers 75% of the circumference,
          leaving a leading gap.
        </p>
        <div className="flex flex-wrap items-center gap-12">
          {LOADER_SIZES.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Loader size={size} />
              <span className="text-medium-75 text-content-tertiary uppercase text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Inline with text</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          The loader is an inline-flex element so it composes naturally inside buttons, list rows,
          and inline labels.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <span className="inline-flex items-center gap-2 text-medium-75 text-content-primary">
            <Loader size="sm" /> Loading your profile…
          </span>
          <Button variant="primary" size="md" disabled>
            <span className="inline-flex items-center gap-2">
              <Loader size="sm" /> Submitting
            </span>
          </Button>
        </div>
      </section>
    </>
  );
};

const CHECKBOX_STATES = [
  { state: 'default', label: 'Default' },
  { state: 'checked', label: 'Checked' },
  { state: 'error', label: 'Error (unchecked)' },
  { state: 'error-checked', label: 'Error (checked)' },
  { state: 'disabled', label: 'Disabled' },
  { state: 'disabled-checked', label: 'Disabled (checked)' },
];

const CheckboxesSection = () => {
  const [marketing, setMarketing] = useState(false);
  const [terms, setTerms] = useState(false);
  const [consent, setConsent] = useState(true);
  log('CheckboxesSection render', { marketing, terms, consent });

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Checkboxes</h2>

      {/* Pinned states. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          States (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Same shelf DNA as Button — the box presses down on click (2px grey shelf collapses to a
          1.2px brand-green shelf). Error / disabled visuals are derived from the existing token
          ladder.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {CHECKBOX_STATES.map((entry) => (
            <Checkbox
              key={entry.state}
              state={entry.state}
              label={entry.label}
              helperText={
                entry.state.startsWith('error') ? undefined : 'Helper text appears below the row'
              }
              error={entry.state.startsWith('error') ? 'You must accept to continue' : undefined}
            />
          ))}
        </div>
      </section>

      {/* Real-world / interactive group. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">Interactive</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Click each checkbox to toggle. Labels accept ReactNode so you can embed inline links (e.g.
          T&C / Privacy Policy).
        </p>
        <div className="flex flex-col gap-4 max-w-xl">
          <Checkbox
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            required
            label={
              <>
                I accept the{' '}
                <a href="#" className="text-brand-green underline">
                  Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-brand-green underline">
                  Privacy Policy
                </a>
              </>
            }
            error={!terms ? 'You must accept to continue' : undefined}
          />
          <Checkbox
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            label="I consent to my data being processed for career matching and guidance"
          />
          <Checkbox
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            label={
              <>
                Send me career tips and opportunity alerts via email{' '}
                <span className="text-content-tertiary">(optional)</span>
              </>
            }
          />
        </div>
      </section>
    </>
  );
};

const VERIFICATION_STATES = [
  { state: 'default', label: 'Default' },
  { state: 'active', label: 'Active' },
  { state: 'error', label: 'Error' },
  { state: 'disabled', label: 'Disabled' },
];

const VerificationCodesSection = () => {
  const [code, setCode] = useState('');
  const [shortCode, setShortCode] = useState('');
  log('VerificationCodesSection render', { code, shortCode });

  const filled = code.length === 6;

  return (
    <>
      <h2 className="text-display-md text-content-primary mt-16 mb-8">Verification code</h2>

      {/* Pinned states (single boxes for documentation). */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          Per-box states (pinned for documentation)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Each digit box is a 62×62 square that mirrors TextInput&apos;s state ladder (with a 3px
          shelf instead of 2.5px). In production, &quot;active&quot; is driven automatically by
          focus / fill — error and disabled apply globally to all boxes.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {VERIFICATION_STATES.map(({ state, label }) => (
            <div key={state} className="flex flex-col gap-2">
              <span className="text-medium-75 text-content-tertiary uppercase">{label}</span>
              <VerificationCode
                length={1}
                state={state}
                defaultValue={state === 'active' ? '4' : ''}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Interactive 6-digit code with split. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">
          Interactive (6-digit code, split 3 + 3)
        </h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          Type a digit to advance · Backspace to go back · Paste a full code into any box to
          distribute · Arrow keys move between boxes.
        </p>
        <div className="max-w-2xl flex flex-col gap-4">
          <VerificationCode
            length={6}
            splitAfter={3}
            value={code}
            onChange={setCode}
            label={
              <>
                Code sent to <span className="text-brand-green">+233 XX XXX 4821</span>
              </>
            }
            helperText={
              filled ? (
                <>
                  ✓ Entered: <code>{code}</code>
                </>
              ) : (
                <>
                  Expires in <strong>08:42</strong> ·{' '}
                  <a href="#" className="text-brand-green underline">
                    Resend code
                  </a>
                </>
              )
            }
          />
          <Button
            variant="primary"
            size="md"
            disabled={!filled}
            onClick={() => log('verify clicked:', code)}
            rightIcon={<ArrowRight />}
          >
            Verify
          </Button>
        </div>
      </section>

      {/* 4-digit short code. */}
      <section className="mb-16">
        <h3 className="text-strong-300 text-content-primary mb-2">4-digit short code</h3>
        <p className="text-medium-75 text-content-secondary mb-6">
          The same component with <code>length={'{4}'}</code> and no split.
        </p>
        <div className="max-w-md">
          <VerificationCode
            length={4}
            value={shortCode}
            onChange={setShortCode}
            label="Enter your 4-digit PIN"
            required
            helperText="Mock example — not stored anywhere"
          />
        </div>
      </section>
    </>
  );
};

const PasswordInput = () => {
  const [show, setShow] = useState(false);
  log('PasswordInput render, show:', show);
  return (
    <TextInput
      label="Password"
      required
      type={show ? 'text' : 'password'}
      placeholder="min characters 8"
      leftIcon={<LockIcon />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="cursor-pointer text-content-tertiary hover:text-content-primary inline-flex"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      helperText="1 uppercase · 1 lowercase · 1 number"
    />
  );
};

const InteractiveForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  log('InteractiveForm render, email:', email);

  const trimmed = email.trim();
  const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const error = submitted && !looksValid ? 'Please enter a valid email address' : null;
  const verified = looksValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    log('submit, valid:', looksValid);
    setSubmitted(true);
  };

  return (
    <section className="mb-16">
      <h3 className="text-strong-300 text-content-primary mb-2">Interactive</h3>
      <p className="text-medium-75 text-content-secondary mb-6">
        Type a real email to see <code>:focus-within</code> activate, then submit to see error /
        verified states swap automatically.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md flex flex-col gap-6">
        <TextInput
          label="Email"
          required
          type="email"
          placeholder="abena@example.com"
          leftIcon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          verified={verified}
          helperText={!error && !verified ? "We'll never share this" : undefined}
        />
        <Button type="submit" variant="primary" size="md" rightIcon={<ArrowRight />}>
          Submit
        </Button>
      </form>
    </section>
  );
};

export default HomePage;
