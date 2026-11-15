import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import Select from '../../../ui/form/Select.jsx';
import { ArrowheadDownIcon } from '../../../shared/assets.jsx';
import { useHiringPause } from '../hiring/useHiringPause.js';
import PipelineToast from '../../applicationPipeline/actions/PipelineToast.jsx';
import { SettingLine, SettingsCard, SettingsChip, ToastText } from '../security/SettingsParts.jsx';
import { ClockIcon } from '../security/SettingsIcons.jsx';
import {
  APP_LANGUAGE_OPTIONS,
  ASSISTANT_LANGUAGE_OPTIONS,
  LANGUAGE_COPY,
  LANGUAGE_DEFAULTS,
  RETENTION_OPTIONS,
} from '../security/securityData.js';

import {
  downloadMyData,
  savePreferences,
  settingsError,
} from '../../../../services/settings.api.js';
import { fetchReceivedApplications } from '../../../../services/recruiterPipeline.api.js';
import { snapshotOf } from '../../applicationPipeline/pipelineLive.js';
import { useLiveSettingsOverview } from '../account/useLiveSettingsOverview.js';

const log = debug('RecruiterLanguageTab');

const STAGE_NAMES = {
  submitted: 'Applied',
  under_review: 'Screening',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview scheduled',
  interviewed: 'Interviewed',
  offer_pending: 'Offer pending',
  offer_extended: 'Offer extended',
  accepted: 'Hired',
  rejected: 'Not progressed',
  withdrawn: 'Withdrew',
};
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

/* Export CSV (signed in): your received applications, names and stages only (no contact details). */
const downloadCandidatesCsv = async () => {
  const apps = await fetchReceivedApplications();
  const rows = [
    ['Candidate', 'Posting', 'Stage', 'Applied on'],
    ...apps.map((a) => {
      const s = snapshotOf(a);
      return [
        [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Candidate',
        a.resourceTitle || '',
        STAGE_NAMES[a.currentStage] || a.currentStage,
        (a.appliedAt || a.createdAt || '').slice(0, 10),
      ];
    }),
  ];
  const blob = new Blob([rows.map((r) => r.map(csvCell).join(',')).join('\r\n')], {
    type: 'text/csv',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gth-candidates-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return apps.length;
};

/*
 * LanguageTab - recruiter Settings `?tab=language` (Figma SR-17 "Settings · Language and data" 10161:83001, SR-18 "Data · export requested (toast)" 10161:83309).
 * Four cards: Language (App language dropdown, "Twi, Ga, Ewe, Dagbani, Hausa" with the "Coming soon" chip, Hiring Assistant language dropdown), Candidate data (retention dropdown, Export CSV, Request download) and Pause hiring.
 * The dropdowns are the design-system `ui/form/Select` (51px GTHInput: #c1d4c4 hairline, green 2.5px shelf, filled arrowhead) at the drawn widths 220 / 220 / 200. Export CSV and Request download show the "Your export is being prepared" toast.
 * URL: toast=export-requested (SR-18; the toast stays until closed, like the other recruiter toasts). Mock only: nothing is saved.
 * ⚠️ ASSUMPTIONS (not drawn): both Export CSV and Request download raise the SR-18 toast (the drawn text fits both); the dropdowns hold the drawn value plus neighbours (only the selected value is drawn); "Pause hiring" only logs (calls useHiringPause().pause(); the banner and toast of SR-19 are the hiring builder's).
 * Props: settings (useRecruiterSettingsState()).
 */
const SELECT_TRIGGER =
  '!border !border-[#c1d4c4] !shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)] focus-visible:!border-[#387440]';
const SELECT_VALUE = '!font-normal !text-[#111]';
const chevron = <ArrowheadDownIcon className="size-[20px] text-[#387440]" />;

// The Figma dropdown instance is 103px tall (empty label + helper rows around the 51px box), which makes the whole row 103px; the box sits 3px above the row centre.
const DropdownRow = ({ title, description, label, width, value, options, onChange, id }) => (
  <SettingLine
    className="min-h-[103px] max-sm:min-h-0"
    title={title}
    description={description}
    control={
      <div
        className="relative z-10 -translate-y-[3px] max-sm:translate-y-0"
        style={{ width: `min(${width}px, 100%)` }}
      >
        <Select
          id={id}
          aria-label={label}
          value={value}
          options={options}
          onChange={onChange}
          chevronIcon={chevron}
          triggerClassName={SELECT_TRIGGER}
          valueClassName={SELECT_VALUE}
        />
      </div>
    }
  />
);

const LanguageTab = ({ settings }) => {
  const { update } = settings;
  const toast = settings.get('toast');
  const hiringPause = useHiringPause(settings);
  const [values, setValues] = useState(LANGUAGE_DEFAULTS);
  const { language, data, pause, exportToast } = LANGUAGE_COPY;
  // Signed in: retention is saved to your preferences; Export CSV and Request download produce real files.
  const live = useLiveSettingsOverview();
  const isLive = live.status !== 'demo';
  const [liveNote, setLiveNote] = useState(null);
  const storedRetention = live.overview?.preferences?.language?.retention;
  useEffect(() => {
    if (storedRetention) setValues((prev) => ({ ...prev, retention: storedRetention }));
  }, [storedRetention]);

  useEffect(() => {
    log('mount', { toast });
  }, [toast]);

  const closeToast = useCallback(() => update({ toast: null }, { replace: true }), [update]);
  const requestExport = (what) => {
    log('dispatch export requested', { what });
    if (isLive) {
      setLiveNote(null);
      const job = what === 'candidates-csv' ? downloadCandidatesCsv() : downloadMyData();
      job
        .then((n) =>
          setLiveNote({
            tone: 'ok',
            text:
              what === 'candidates-csv'
                ? `Downloaded ${n} application${n === 1 ? '' : 's'} as CSV.`
                : 'Your data was downloaded as a JSON file.',
          })
        )
        .catch((err) =>
          setLiveNote({
            tone: 'error',
            text: settingsError(err, 'The download didn’t work. Try again.'),
          })
        );
      return;
    }
    update({ toast: 'export-requested' });
  };
  const pick = (key) => (value) => {
    log('select', { key, value });
    setValues((prev) => ({ ...prev, [key]: value }));
    if (isLive && key === 'retention') {
      savePreferences({ language: { retention: value } })
        .then(() => setLiveNote({ tone: 'ok', text: 'Saved.' }))
        .catch((err) => setLiveNote({ tone: 'error', text: settingsError(err) }));
    }
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="language">
      <SettingsCard title={language.title}>
        <DropdownRow
          id="recruiter-app-language"
          title={language.app.title}
          description={language.app.description}
          label={language.app.title}
          width={220}
          value={values.appLanguage}
          options={APP_LANGUAGE_OPTIONS}
          onChange={pick('appLanguage')}
        />
        <SettingLine
          title={language.soon.title}
          description={language.soon.description}
          control={
            <SettingsChip tone="soon" icon={<ClockIcon className="size-[12px]" />}>
              {language.soon.chip}
            </SettingsChip>
          }
        />
        <DropdownRow
          id="recruiter-assistant-language"
          title={language.assistant.title}
          description={language.assistant.description}
          label={language.assistant.title}
          width={220}
          value={values.assistantLanguage}
          options={ASSISTANT_LANGUAGE_OPTIONS}
          onChange={pick('assistantLanguage')}
        />
      </SettingsCard>

      <SettingsCard title={data.title} description={data.description}>
        <DropdownRow
          id="recruiter-retention"
          title={data.keep.title}
          description={data.keep.description}
          label={data.keep.title}
          width={200}
          value={values.retention}
          options={RETENTION_OPTIONS}
          onChange={pick('retention')}
        />
        <SettingLine
          title={data.export.title}
          description={data.export.description}
          control={
            <Button
              variant="tertiary"
              className="!h-[40px] !py-0 max-sm:!px-[20px]"
              onClick={() => requestExport('candidates-csv')}
            >
              {data.export.cta}
            </Button>
          }
        />
        <SettingLine
          title={data.download.title}
          description={data.download.description}
          control={
            <Button
              variant="tertiary"
              className="!h-[40px] !py-0 max-sm:!px-[20px]"
              onClick={() => requestExport('my-data-zip')}
            >
              {data.download.cta}
            </Button>
          }
        />
      </SettingsCard>

      {liveNote ? (
        <p
          role={liveNote.tone === 'error' ? 'alert' : 'status'}
          className={`m-0 font-sans text-[14px] leading-[20px] ${liveNote.tone === 'error' ? 'text-[#c0392b]' : 'text-[#2a5730]'}`}
        >
          {liveNote.text}
        </p>
      ) : null}

      <SettingsCard title={pause.title} description={pause.description}>
        <SettingLine
          title={pause.row.title}
          description={pause.row.description}
          control={
            <Button
              variant="tertiary"
              className="!h-[40px] !py-0 max-sm:!px-[20px]"
              onClick={hiringPause.pause}
            >
              {pause.row.cta}
            </Button>
          }
        />
      </SettingsCard>

      {toast === 'export-requested' ? (
        <PipelineToast
          title={exportToast.title}
          message={<ToastText>{exportToast.message}</ToastText>}
          onClose={closeToast}
        />
      ) : null}
    </div>
  );
};

export default LanguageTab;
