import { classNames } from '../../../utils/classNames.js';
import {
  AreaBox,
  CheckRow,
  Field,
  Select,
  SetupPills,
  SkillPill,
  TextBox,
} from './jobFormControls.jsx';
import {
  DEPARTMENTS,
  EMPLOYMENT_MENU_LABEL,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  FORM_SECTIONS,
  LOCATIONS,
  PAY_TYPES,
  SCREENING_GROUPS,
  SCREENING_NEW_LABEL,
  SCREENING_NONE_LABEL,
  SETTINGS_CHECKS,
  SKILL_SEARCH_PLACEHOLDER,
  TEMPLATE_SKILL_SEARCH_PLACEHOLDER,
  BUILD_TEMPLATE,
  WORK_SETUPS,
} from './jobFormData.js';
import { SetupIcon, PlusGlyph } from './jobIcons.jsx';

/*
 * JobFormFields — the five section cards shared by "Create job" (JT-03…JT-07), "Build a template" (CT-01/CT-02) and "Edit posting" (JM-03).
 * Figma: Form column 925 wide, five cards (white, 16px radius, 24px padding, 20px gap) each headed by a numbered badge, a 22/600 title and a 12px subtitle.
 * Props: values, set(key, value), variant ('job' | 'template' | 'edit'), menu (the open dropdown key or ''), setMenu(key | ''), errors ({ pay, deadline }), query/setQuery (location search), onSkillAdd.
 */
const SectionCard = ({ n, title, subtitle, children }) => (
  <section className="flex flex-col gap-[20px] rounded-[16px] border border-solid border-[#e1eae2] bg-white p-[24px] max-sm:p-[16px]">
    <header className="flex items-center gap-[12px]">
      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] font-sans text-[14px] leading-[20px] font-semibold text-[#2a5730]">
        {n}
      </span>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
          {title}
        </h2>
        <p className="m-0 font-sans text-[12px] leading-[16px] text-[#575755]">{subtitle}</p>
      </div>
    </header>
    {children}
  </section>
);

const Grid = ({ cols = 3, children }) => (
  <div
    className={classNames(
      'grid gap-[16px] max-sm:grid-cols-1',
      cols === 3 && 'sm:grid-cols-3',
      cols === 2 && 'sm:grid-cols-2'
    )}
  >
    {children}
  </div>
);

const toGroups = (items) => [
  { items: items.map((i) => (typeof i === 'string' ? { value: i, label: i } : i)) },
];

const formatCount = (n) => n.toLocaleString('en-US');

const JobFormFields = ({
  values,
  set,
  variant = 'job',
  menu = '',
  setMenu,
  errors = {},
  query = '',
  setQuery,
}) => {
  const isTemplate = variant === 'template';
  const open = (key) => menu === key;
  const toggle = (key) => (next) => setMenu(next ? key : '');
  const points = values.responsibilities.length;
  const typed = query.trim();
  const suggested = LOCATIONS.filter((l) => l.label.toLowerCase().includes(typed.toLowerCase()));
  // Any town works: what the recruiter typed is offered first when it isn't one of the suggestions.
  const locationItems =
    typed && !suggested.some((l) => l.value.toLowerCase() === typed.toLowerCase())
      ? [{ value: typed, label: `Use “${typed}”`, description: 'Typed location' }, ...suggested]
      : suggested;
  const skillPlaceholder = isTemplate
    ? TEMPLATE_SKILL_SEARCH_PLACEHOLDER
    : SKILL_SEARCH_PLACEHOLDER;

  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      <SectionCard n={1} {...FORM_SECTIONS.basics}>
        <Field label="Job title" required htmlFor="job-title">
          <TextBox
            id="job-title"
            value={values.title}
            onChange={(v) => set('title', v)}
            placeholder="e.g. Junior Frontend Developer"
          />
        </Field>
        <Grid>
          <Field label="Department" required htmlFor="job-department">
            <Select
              id="job-department"
              value={values.department}
              groups={toGroups(DEPARTMENTS)}
              open={open('department')}
              onOpenChange={toggle('department')}
              onChange={(v) => set('department', v)}
            />
          </Field>
          <Field label="Employment type" required htmlFor="job-employment">
            <Select
              id="job-employment"
              value={values.employment}
              groups={[{ label: EMPLOYMENT_MENU_LABEL, items: EMPLOYMENT_TYPES }]}
              open={open('employment')}
              onOpenChange={toggle('employment')}
              onChange={(v) => set('employment', v)}
              menuWidth="w-[320px]"
            />
          </Field>
          <Field label="Experience level" required htmlFor="job-experience">
            <Select
              id="job-experience"
              value={values.experience}
              groups={toGroups(EXPERIENCE_LEVELS)}
              open={open('experience')}
              onOpenChange={toggle('experience')}
              onChange={(v) => set('experience', v)}
            />
          </Field>
        </Grid>
      </SectionCard>

      <SectionCard n={2} {...FORM_SECTIONS.pay}>
        <div className="flex flex-col gap-[10px]">
          <span className="font-sans text-[14px] leading-[20px] font-medium text-[#111]">
            Work setup <span className="text-[#2e8b57]">*</span>
          </span>
          <SetupPills
            value={values.setup}
            onChange={(v) => set('setup', v)}
            options={WORK_SETUPS}
            icons={{
              'On-site': <SetupIcon kind="onsite" />,
              Hybrid: <SetupIcon kind="hybrid" />,
              Remote: <SetupIcon kind="remote" />,
            }}
          />
        </div>
        <div className="grid gap-[16px] max-sm:grid-cols-1 sm:grid-cols-[2fr_1fr]">
          <Field label="Location" required htmlFor="job-location">
            <Select
              id="job-location"
              searchable
              value={values.location}
              placeholder={isTemplate ? 'Search a city or area' : 'Search a city or area'}
              groups={toGroups(locationItems)}
              open={open('location')}
              onOpenChange={toggle('location')}
              onChange={(v) => {
                set('location', v);
                setQuery?.('');
              }}
              query={query}
              onQuery={setQuery}
            />
          </Field>
          <Field label="Openings" required htmlFor="job-openings">
            <TextBox
              id="job-openings"
              value={values.openings}
              inputMode="numeric"
              onChange={(v) => set('openings', v)}
            />
          </Field>
        </div>
        <Grid>
          <Field label="Pay type" required htmlFor="job-pay-type">
            <Select
              id="job-pay-type"
              value={values.payType}
              groups={toGroups(PAY_TYPES)}
              open={open('payType')}
              onOpenChange={toggle('payType')}
              onChange={(v) => set('payType', v)}
            />
          </Field>
          <Field label="Minimum (GHS)" required htmlFor="job-min" error={errors.pay}>
            <TextBox
              id="job-min"
              value={values.min}
              inputMode="numeric"
              error={Boolean(errors.pay)}
              onChange={(v) => set('min', v)}
            />
          </Field>
          <Field label="Maximum (GHS)" required htmlFor="job-max">
            <TextBox
              id="job-max"
              value={values.max}
              inputMode="numeric"
              onChange={(v) => set('max', v)}
            />
          </Field>
        </Grid>
        <CheckRow
          checked={values.showPay}
          onChange={(v) => set('showPay', v)}
          label="Show pay range on the posting"
          hint={values.payHint}
        />
      </SectionCard>

      <SectionCard n={3} {...FORM_SECTIONS.description}>
        <Field label="About the role *" htmlFor="job-about">
          <AreaBox
            id="job-about"
            value={values.about}
            onChange={(v) => set('about', v)}
            placeholder="What will this person do, and why does it matter?"
            counter={`${values.about.length} / ${formatCount(1000)}`}
          />
        </Field>
        <Field label="Responsibilities *" htmlFor="job-responsibilities">
          <AreaBox
            id="job-responsibilities"
            value={values.responsibilities.map((line) => `• ${line}`).join('\n')}
            onChange={(v) =>
              set(
                'responsibilities',
                v
                  .split('\n')
                  .map((line) => line.replace(/^•\s?/, ''))
                  .filter((line, index, all) => line.trim() || index < all.length - 1)
              )
            }
            rows={Math.max(3, points)}
            placeholder="Add 3–6 short points, one per line"
            counter={`${points} ${points === 1 ? 'point' : 'points'}`}
          />
        </Field>
      </SectionCard>

      <SectionCard n={4} {...FORM_SECTIONS.skills}>
        {values.skills.length ? (
          <div className="flex flex-wrap gap-[8px]">
            {values.skills.map((skill) => (
              <SkillPill
                key={skill.name}
                {...skill}
                onRemove={() =>
                  set(
                    'skills',
                    values.skills.filter((s) => s.name !== skill.name)
                  )
                }
              />
            ))}
          </div>
        ) : isTemplate ? (
          <p className="m-0 font-sans text-[12px] leading-[16px] text-[#575755]">
            {BUILD_TEMPLATE.skillsEmpty}
          </p>
        ) : null}
        <Field label="Add a skill" htmlFor="job-skill">
          <TextBox id="job-skill" value="" onChange={() => {}} placeholder={skillPlaceholder} />
        </Field>
      </SectionCard>

      <SectionCard n={5} {...FORM_SECTIONS.settings}>
        <Grid cols={2}>
          {isTemplate ? null : (
            <Field
              label="Application deadline"
              required
              htmlFor="job-deadline"
              error={errors.deadline}
            >
              <TextBox
                id="job-deadline"
                value={values.deadline}
                placeholder="DD / MM / YYYY"
                error={Boolean(errors.deadline)}
                onChange={(v) => set('deadline', v)}
              />
            </Field>
          )}
          <Field
            label="Screening criteria"
            required
            htmlFor="job-screening"
            className={isTemplate ? 'sm:col-span-2' : ''}
          >
            <Select
              id="job-screening"
              value={values.screening}
              placeholder="Choose screening criteria"
              groups={SCREENING_GROUPS}
              footer={[
                { id: 'new', label: SCREENING_NEW_LABEL, icon: <PlusGlyph /> },
                { id: 'none', label: SCREENING_NONE_LABEL, muted: true },
              ]}
              onFooter={(id) => set('screening', id === 'none' ? '' : values.screening)}
              open={open('screening')}
              onOpenChange={toggle('screening')}
              onChange={(v) => set('screening', v)}
              menuWidth="w-[420px] max-w-[calc(100vw-48px)] right-0 left-auto"
            />
          </Field>
        </Grid>
        <div className="flex flex-col gap-[16px]">
          {SETTINGS_CHECKS.map((check) => (
            <CheckRow
              key={check.id}
              checked={Boolean(values[check.id])}
              onChange={(v) => set(check.id, v)}
              label={check.label}
              hint={check.hint}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default JobFormFields;
