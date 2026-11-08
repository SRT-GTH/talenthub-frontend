import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import TextInput from '../../../ui/form/TextInput.jsx';
import Select from '../../../ui/form/Select.jsx';
import Textarea from '../../../ui/form/Textarea.jsx';
import Chip from '../../../ui/Chip.jsx';
import { ArrowheadDownIcon } from '../../../shared/assets.jsx';
import { RecruiterSettingsCard, RecruiterSettingsRow } from '../../../ui/RecruiterSettingsCard.jsx';
import { BadgeCheck, ClockGlyph } from '../../recruiterJobs/jobIcons.jsx';
import companyLogo from '../../../../assets/recruiter/settings/organisation-company-logo-silver-rock.png';
import ImageUploadRow from '../account/ImageUploadRow.jsx';
import SettingsFormFooter from '../account/SettingsFormFooter.jsx';
import {
  ORG_COMPANY,
  ORG_FIELD_LABELS,
  ORG_INDUSTRIES,
  ORG_LIST,
  ORG_SIZES,
  ORG_VALUES,
  ORG_VERIFICATION,
} from '../account/accountData.js';

import {
  companyErrorText,
  fetchCompany,
  saveCompany,
} from '../../../../services/recruiterCompany.api.js';
import {
  isRecruiterSession,
  refreshRecruiterShell,
} from '../../../../services/recruiterShell.api.js';
import { useRecruiterShell } from '../../../../hooks/useRecruiterShell.js';
import { orgMarks } from '../../recruiterDashboard/recruiterDashboardIcons.js';

const log = debug('OrganisationTab');

/* Live: the backend's company sizes (organisation settings.size enum) and its stored fields -> this form. */
const LIVE_SIZES = [
  { value: '1-10', label: '1\u201310 people' },
  { value: '11-50', label: '11\u201350 people' },
  { value: '51-200', label: '51\u2013200 people' },
  { value: '201-500', label: '201\u2013500 people' },
  { value: '500+', label: '500+ people' },
];
const fromCompany = (c = {}) => ({
  name: c.name || '',
  industry: c.industry || '',
  size: c.size || '',
  website: c.website || '',
  office: c.address || '',
  about: c.bio || '',
});
const withCurrent = (options, value) =>
  value && !options.some((o) => o.value === value)
    ? [{ value, label: value }, ...options]
    : options;

const chevron = <ArrowheadDownIcon className="size-[20px] text-[#387440]" />;
// Figma draws the dropdown value 14/400 (the design-system Select defaults to 500).
const SELECT_VALUE = '!font-normal';
const FIELDS = ['name', 'industry', 'size', 'website', 'office', 'about'];

/*
 * OrganisationTab - `/recruiter/settings?tab=organisation`, SR-02 (10161:77780): Company details (logo, name, industry, size, website, head office, about + counter),
 * Verification (KYB / KYC chips), Your organisations (Current / Pending chips), Cancel / Save changes.
 * Form pieces are the design-system TextInput / Select / Textarea; chips are `ui/Chip`. Mock: Save keeps the values locally (nothing is sent).
 * Wiki: recruiter-settings-account.md.
 */
const OrganisationTab = ({ settings }) => {
  const [saved, setSaved] = useState(ORG_VALUES);
  const [values, setValues] = useState(ORG_VALUES);
  const [logo, setLogo] = useState(companyLogo);
  const [justSaved, setJustSaved] = useState(false);
  // Signed-in recruiter: GET / PUT /recruiter/company (organisation admins can save; the name comes from KYB and is read-only).
  const live = isRecruiterSession();
  const shell = useRecruiterShell();
  const [company, setCompany] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    log('mount', { tab: settings?.tab });
  }, [settings?.tab]);

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    fetchCompany()
      .then((out) => {
        if (!alive) return;
        setCompany(out);
        const v = fromCompany(out?.company);
        setSaved(v);
        setValues(v);
        setLogo(out?.company?.logoUrl || orgMarks.personal);
      })
      .catch((err) => alive && setSaveError(companyErrorText(err)));
    return () => {
      alive = false;
    };
  }, [live]);

  const baseLogo = live ? company?.company?.logoUrl || orgMarks.personal : companyLogo;
  const dirty = FIELDS.some((k) => values[k] !== saved[k]) || (!live && logo !== baseLogo);
  const requiredOk = Boolean(values.name.trim() && values.industry && values.size);
  const canSave =
    dirty &&
    requiredOk &&
    values.about.length <= ORG_COMPANY.aboutMax &&
    !busy &&
    (!live || company?.canEdit !== false);
  const set = (key) => (value) => {
    setJustSaved(false);
    setValues((v) => ({ ...v, [key]: value }));
  };
  const text = (key) => (event) => set(key)(event.target.value);

  return (
    <>
      <RecruiterSettingsCard title={ORG_COMPANY.title} description={ORG_COMPANY.description}>
        <div className="flex flex-col gap-[16px]">
          <ImageUploadRow
            src={logo}
            alt={`${values.name || 'Company'} logo`}
            title={ORG_COMPANY.logoTitle}
            description={ORG_COMPANY.logoDescription}
            buttonLabel={ORG_COMPANY.logoButton}
            imageClassName="border border-solid border-[#f2f2f2] shadow-[0_4px_4px_rgba(213,213,213,0.17)]"
            onChange={setLogo}
          />
          <div className="grid grid-cols-2 items-start gap-[16px] max-md:grid-cols-1">
            <TextInput
              label={ORG_FIELD_LABELS.name}
              required
              value={values.name}
              onChange={text('name')}
              autoComplete="organization"
              disabled={live}
            />
            <div className="md:pb-[23px]">
              <Select
                verified
                required
                label={ORG_FIELD_LABELS.industry}
                chevronIcon={chevron}
                valueClassName={SELECT_VALUE}
                value={values.industry}
                onChange={set('industry')}
                options={live ? withCurrent(ORG_INDUSTRIES, values.industry) : ORG_INDUSTRIES}
              />
            </div>
            <Select
              verified
              required
              label={ORG_FIELD_LABELS.size}
              chevronIcon={chevron}
              valueClassName={SELECT_VALUE}
              value={values.size}
              onChange={set('size')}
              options={live ? withCurrent(LIVE_SIZES, values.size) : ORG_SIZES}
            />
            <TextInput
              label={ORG_FIELD_LABELS.website}
              type="url"
              value={values.website}
              onChange={text('website')}
              autoComplete="url"
            />
          </div>
          <TextInput
            label={ORG_FIELD_LABELS.office}
            value={values.office}
            onChange={text('office')}
            autoComplete="street-address"
          />
          <Textarea
            label={ORG_COMPANY.aboutLabel}
            value={values.about}
            onChange={text('about')}
            maxLength={ORG_COMPANY.aboutMax}
            counterInside
            rows={2}
            boxClassName="!border !rounded-[10px]"
          />
        </div>
      </RecruiterSettingsCard>

      <RecruiterSettingsCard
        title={ORG_VERIFICATION.title}
        description={ORG_VERIFICATION.description}
      >
        {live ? (
          <RecruiterSettingsRow
            title={'KYB \u00b7 Business registration'}
            description={company?.kyb?.label || 'Not submitted yet'}
          >
            {company?.kyb?.verified ? (
              <Chip tone="success">
                <BadgeCheck size={12} />
                {ORG_VERIFICATION.chip}
              </Chip>
            ) : (
              <Chip tone="amber">
                <ClockGlyph size={12} />
                {company?.kyb?.label || 'Pending'}
              </Chip>
            )}
          </RecruiterSettingsRow>
        ) : (
          ORG_VERIFICATION.items.map((item) => (
            <RecruiterSettingsRow key={item.id} title={item.title} description={item.detail}>
              <Chip tone="success">
                <BadgeCheck size={12} />
                {ORG_VERIFICATION.chip}
              </Chip>
            </RecruiterSettingsRow>
          ))
        )}
      </RecruiterSettingsCard>

      <RecruiterSettingsCard title={ORG_LIST.title} description={ORG_LIST.description}>
        {(live
          ? shell?.orgName
            ? [
                {
                  id: shell.orgId || 'current',
                  name: shell.orgName,
                  detail: `${shell.affiliation === 'admin' ? 'Admin' : 'Recruiter'} \u00b7 current`,
                  chip: 'Current',
                  tone: 'mint',
                },
              ]
            : []
          : ORG_LIST.items
        ).map((org) => (
          <RecruiterSettingsRow key={org.id} title={org.name} description={org.detail}>
            <Chip tone={org.tone}>
              {org.tone === 'amber' ? <ClockGlyph size={12} /> : null}
              {org.chip}
            </Chip>
          </RecruiterSettingsRow>
        ))}
      </RecruiterSettingsCard>

      {saveError ? (
        <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
          {saveError}
        </p>
      ) : null}
      {live && company?.canEdit === false ? (
        <p className="m-0 font-sans text-[14px] text-[#575755]">
          Only your organisation\u2019s admin can change the company profile.
        </p>
      ) : null}
      <SettingsFormFooter
        canSave={canSave}
        saved={justSaved}
        onCancel={() => {
          log('cancel: back to the saved values');
          setValues(saved);
          setLogo(baseLogo);
          setJustSaved(false);
          setSaveError(null);
        }}
        onSave={() => {
          if (!canSave) return;
          log('save', Object.keys(values));
          if (live) {
            setBusy(true);
            setSaveError(null);
            saveCompany({
              bio: values.about,
              website: values.website,
              industry: values.industry,
              size: values.size || undefined,
              address: values.office,
            })
              .then(() => fetchCompany())
              .then((out) => {
                setCompany(out);
                const v = fromCompany(out?.company);
                setSaved(v);
                setValues(v);
                setJustSaved(true);
                refreshRecruiterShell();
              })
              .catch((err) => setSaveError(companyErrorText(err)))
              .finally(() => setBusy(false));
            return;
          }
          setSaved(values);
          setJustSaved(true);
        }}
      />
    </>
  );
};

export default OrganisationTab;
