import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import StepHeading from '../../../components/sections/recruiterOnboarding/closing/StepHeading.jsx';
import Button from '../../../components/ui/Button.jsx';
import StickyActionBar from '../../../components/ui/form/StickyActionBar.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../../components/shared/assets.jsx';
import iconMarkerPin from '../../../assets/recruiter-onboarding/closing/icon-marker-pin.svg';
import iconMap from '../../../assets/recruiter-onboarding/closing/icon-map.svg';
import iconUsers from '../../../assets/recruiter-onboarding/closing/icon-users.svg';
import iconCheckCircle from '../../../assets/recruiter-onboarding/closing/icon-check-circle.svg';
import iconAlert from '../../../assets/recruiter-onboarding/closing/icon-alert.svg';
import iconShield from '../../../assets/recruiter-onboarding/closing/icon-shield.svg';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { savePreferences } from '../../../services/recruiterOnboarding.api.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterPreferencesPage');

/*
 * RecruiterPreferencesPage - /onboarding/recruiter/preferences (R07)
 * Figma: 7374:9004 default, 7374:9278 filled, 7374:9556 error (no scope).
 *
 * Provider slice written (setSection('preferences', ...)):
 *   { scope: 'local' | 'international' | 'both' | '',
 *     experience: string[]   (Entry-level, Mid-level, Senior, Executive),
 *     industries: string[] }
 * Hiring scope is a real radio group (required, "Pick one"); the two chip rows
 * are multi-select toggle buttons (aria-pressed) that wrap like Figma, so there
 * is no horizontal overflow. The CTA is grey/disabled until a scope is chosen
 * (Figma 9004/9556); clicking it while disabled shows the error frame state
 * (9556). Icons are exports of the Figma nodes (assets/recruiter-onboarding/closing). Continue -> /onboarding/recruiter/review after a short fake save.
 */

const SCOPES = [
  {
    value: 'local',
    title: 'Local',
    hint: 'Ghana only',
    icon: iconMarkerPin,
  },
  {
    value: 'international',
    title: 'International',
    hint: 'Outside Ghana',
    icon: iconMap,
  },
  {
    value: 'both',
    title: 'Both',
    hint: 'Local + international',
    icon: iconUsers,
  },
];
const EXPERIENCE = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Agriculture',
  'Hospitality',
  '+ Other (from taxonomy)',
];

const GroupLabel = ({ id, children, required, hint }) => (
  <div className="flex items-center justify-between gap-3">
    <span
      id={id}
      className="text-[14px] font-medium leading-6 text-[#111111]"
      style={{ letterSpacing: '0.2px' }}
    >
      {children}
      {required && <span className="text-brand-green"> *</span>}
    </span>
    <span className="text-[12px] leading-5 text-[#575755]" style={{ letterSpacing: '0.2px' }}>
      {hint}
    </span>
  </div>
);

const Chip = ({ label, selected, onToggle }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onToggle}
    className={classNames(
      'inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-[14px] leading-6 text-[#111111] transition-colors',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      selected
        ? 'border-[1.5px] border-brand-green bg-brand-green-light font-medium text-brand-green-dark shadow-[0_3px_0_0_rgba(34,70,38,0.8)]'
        : 'border border-[#d9dbd6] bg-white hover:border-brand-green-light-active hover:bg-brand-green-light/50'
    )}
    style={{ letterSpacing: '0.2px' }}
  >
    {label}
    {selected && (
      <img src={iconCheckCircle} alt="" aria-hidden="true" className="size-4 shrink-0" />
    )}
  </button>
);

// POST /api/recruiter/hiring-preferences (2026-10-18).
const saveRecruiterPreferences = (payload) => {
  log('saveRecruiterPreferences', { scope: payload.scope });
  return savePreferences(payload);
};

const RecruiterPreferencesPage = () => {
  const navigate = useNavigate();
  const { data, setSection } = useRecruiterOnboarding();
  const saved = data.preferences || {};
  const [scope, setScope] = useState(saved.scope || '');
  const [experience, setExperience] = useState(saved.experience || []);
  const [industries, setIndustries] = useState(saved.industries || []);
  const [showError, setShowError] = useState(false);
  const [saving, setSaving] = useState(false);
  const alive = useRef(true);
  const uid = useId();
  const errId = `${uid}-scope-err`;

  useEffect(() => {
    alive.current = true;
    log('mount', { restored: Boolean(saved.scope) });
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (setter, list, v) => {
    log('toggle', v);
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!scope) {
      log('submit blocked: no scope');
      setShowError(true);
      return;
    }
    setSaving(true);
    const payload = { scope, experience, industries };
    setSection('preferences', payload);
    saveRecruiterPreferences(payload)
      .then(() => {
        if (!alive.current) return;
        log('navigate -> review');
        navigate(RECRUITER_ROUTES.review.path);
      })
      .catch((err) => {
        log('save preferences failed', err?.code);
        if (alive.current) setSaving(false);
      });
  };

  const invalid = showError && !scope;

  return (
    <RecruiterOnboardingShell routeKey="preferences">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full max-w-[699px] flex-col items-center gap-6 max-md:gap-3"
      >
        <StepHeading
          number="07"
          label="Preferences"
          title="What are you looking for?"
          subtitle="Tell us who you hire so we can surface the right talent first. These are suggestions, not hard filters."
        />

        <div className="flex w-full flex-col gap-5 text-left max-md:gap-4">
          <div
            role="radiogroup"
            aria-labelledby={`${uid}-scope`}
            aria-describedby={invalid ? errId : undefined}
            className="flex flex-col gap-2.5"
          >
            <GroupLabel id={`${uid}-scope`} required hint="Pick one">
              Hiring Scope
            </GroupLabel>
            <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-1">
              {SCOPES.map(({ value, title, hint, icon }) => {
                const on = scope === value;
                return (
                  <label
                    key={value}
                    className={classNames(
                      'relative flex min-h-[70px] cursor-pointer items-center gap-2 rounded-[10px] px-4 py-3 transition-colors',
                      'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-green',
                      on
                        ? 'border border-brand-green bg-brand-green-light shadow-[0_3px_0_0_rgba(34,70,38,0.8)]'
                        : invalid
                          ? 'border border-[#db4d40] bg-white'
                          : 'border border-[#d9dbd6] bg-white hover:bg-brand-green-light/50'
                    )}
                  >
                    <input
                      type="radio"
                      name={`${uid}-scope`}
                      value={value}
                      checked={on}
                      onChange={() => {
                        log('scope', value);
                        setScope(value);
                      }}
                      aria-invalid={invalid || undefined}
                      className="sr-only"
                    />
                    <img src={icon} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span
                        className="text-[14px] font-medium leading-6 text-[#111111]"
                        style={{ letterSpacing: '0.2px' }}
                      >
                        {title}
                      </span>
                      <span
                        className="text-[12px] leading-5 text-[#575755]"
                        style={{ letterSpacing: '0.2px' }}
                      >
                        {hint}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        'size-[18px] shrink-0 rounded-full',
                        on
                          ? 'border-[5px] border-brand-green bg-white'
                          : 'border-[1.5px] border-[#bfc2bd]'
                      )}
                    />
                  </label>
                );
              })}
            </div>
            {invalid && (
              <p
                id={errId}
                role="alert"
                className="flex items-center gap-1.5 text-[12px] leading-5 text-danger"
                style={{ letterSpacing: '0.2px' }}
              >
                <img src={iconAlert} alt="" aria-hidden="true" className="size-4 shrink-0" />
                Choose at least one hiring scope to continue
              </p>
            )}
          </div>

          <div role="group" aria-labelledby={`${uid}-exp`} className="flex flex-col gap-2.5">
            <GroupLabel id={`${uid}-exp`} hint="Select all that apply">
              Experience Levels
            </GroupLabel>
            <div className="flex flex-wrap gap-2.5">
              {EXPERIENCE.map((v) => (
                <Chip
                  key={v}
                  label={v}
                  selected={experience.includes(v)}
                  onToggle={() => toggle(setExperience, experience, v)}
                />
              ))}
            </div>
          </div>

          <div role="group" aria-labelledby={`${uid}-ind`} className="flex flex-col gap-2.5">
            <GroupLabel id={`${uid}-ind`} hint="Select all that apply">
              Industries of Interest
            </GroupLabel>
            <div className="flex flex-wrap gap-2.5">
              {INDUSTRIES.map((v) => (
                <Chip
                  key={v}
                  label={v}
                  selected={industries.includes(v)}
                  onToggle={() => toggle(setIndustries, industries, v)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 rounded-[10px] border border-brand-green/30 bg-brand-green-light/50 px-4 py-3">
            <img
              src={iconShield}
              alt=""
              aria-hidden="true"
              className="mt-0.5 size-[18px] shrink-0"
            />
            <p
              className="text-[14px] leading-6 text-brand-green-dark max-md:text-[13px] max-md:leading-5"
              style={{ letterSpacing: '0.2px' }}
            >
              You&apos;ll still see every talent who matches a search — preferences only change the
              ranking. Update them anytime in Settings.
            </p>
          </div>
        </div>

        <StickyActionBar bleed={16}>
          <div className="relative w-full">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              // Not `disabled`: it stays focusable and submitting without a scope reveals the
              // Figma error frame (9556). aria-disabled + the pinned grey look carry the state.
              disabled={saving}
              aria-disabled={!scope || saving}
              state={saving ? 'active' : !scope ? 'disabled' : undefined}
              leftIcon={saving ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="w-full"
              aria-busy={saving}
            >
              Save Preferences
            </Button>
          </div>
        </StickyActionBar>
      </form>
    </RecruiterOnboardingShell>
  );
};

export default RecruiterPreferencesPage;
