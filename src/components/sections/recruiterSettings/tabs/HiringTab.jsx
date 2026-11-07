import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Select from '../../../ui/form/Select.jsx';
import { ArrowheadDownIcon } from '../../../shared/assets.jsx';
import PipelineToast from '../../applicationPipeline/actions/PipelineToast.jsx';
import { GroupCard, SettingRow, SettingsToggle } from '../../talentSettings/SettingsBUi.jsx';
import AutoMessageDialog from '../hiring/AutoMessageDialog.jsx';
import SettingsFooter from '../hiring/SettingsFooter.jsx';
import {
  AUTO_MESSAGES,
  HIRING_COPY as COPY,
  HIRING_DEFAULTS,
  LOCATION_OPTIONS,
  REPLY_WITHIN_OPTIONS,
  SCREENING_OPTIONS,
} from '../hiring/hiringData.js';

const log = debug('HiringTab');

const chevron = <ArrowheadDownIcon className="size-[20px] text-[#387440]" />;
const SELECT_TRIGGER = '!border-[#c1d4c4] !border';

// ⚠️ ASSUMPTION: SR-08 draws "You have unsaved changes" with "When a role closes" switched off, and SR-15 (after Save) shows it still off. So the saved baseline has it ON and a fresh
// load of the tab holds that one unsaved change; `?toast=saved` (SR-15) loads everything already saved.
const withClosedOff = (base) => ({
  ...base,
  messages: { ...base.messages, closed: { ...base.messages.closed, on: false } },
});

const SettingsEditLink = ({ onClick, label }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="min-h-[24px] min-w-[24px] cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {COPY.messages.edit}
  </button>
);

/*
 * HiringTab - recruiter Settings `?tab=hiring` (Figma SR-08 10161:79955; editor SR-09 10161:80292; saved toast SR-15 10161:82009).
 * Cards: Defaults for new jobs (location + screening dropdowns, three switches), Automatic messages (four rows with Edit + switch; Edit opens AutoMessageDialog), Response goal (dropdown).
 * Draft vs saved: any change makes the footer say "You have unsaved changes"; Cancel restores the saved values; Save changes stores them and shows `?toast=saved` ("Success - Hiring preferences saved").
 * URL: modal=auto-message (+ message=<id>), toast=saved. Mock only, nothing is sent.
 */
const HiringTab = ({ settings }) => {
  const savedToast = settings.get('toast') === 'saved';
  const [saved, setSaved] = useState(() =>
    savedToast ? withClosedOff(HIRING_DEFAULTS) : HIRING_DEFAULTS
  );
  const [draft, setDraft] = useState(() => withClosedOff(HIRING_DEFAULTS));
  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const messageId = AUTO_MESSAGES.some((m) => m.id === settings.get('message'))
    ? settings.get('message')
    : 'applied';

  useEffect(() => {
    log('mount', { modal: settings.modal, toast: settings.get('toast'), dirty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    log('dirty', dirty);
  }, [dirty]);

  const patch = (next) => {
    log('change', Object.keys(next));
    setDraft((d) => ({ ...d, ...next }));
    if (savedToast) settings.update({ toast: null }, { replace: true });
  };
  const setMessage = (id, next) =>
    setDraft((d) => ({ ...d, messages: { ...d.messages, [id]: { ...d.messages[id], ...next } } }));

  const onSave = () => {
    log('save changes', { dirty });
    setSaved(draft);
    settings.update({ toast: 'saved' });
  };
  const onCancel = () => {
    log('cancel: back to the saved values');
    setDraft(saved);
    if (savedToast) settings.update({ toast: null }, { replace: true });
  };
  const closeDialog = () => settings.update({ modal: null, message: null });

  return (
    <>
      <GroupCard
        recruiter
        title={COPY.defaults.title}
        description={COPY.defaults.description}
        aria-label={COPY.defaults.title}
      >
        <div className="grid w-full grid-cols-2 gap-x-[16px] gap-y-[16px] max-md:grid-cols-1">
          <Select
            verified
            required
            chevronIcon={chevron}
            triggerClassName={SELECT_TRIGGER}
            className="md:min-h-[103px]"
            label={COPY.defaults.location}
            value={draft.location}
            options={LOCATION_OPTIONS}
            onChange={(location) => patch({ location })}
          />
          <Select
            verified
            required
            chevronIcon={chevron}
            triggerClassName={SELECT_TRIGGER}
            className="md:min-h-[103px]"
            label={COPY.defaults.screening}
            value={draft.screening}
            options={SCREENING_OPTIONS}
            onChange={(screening) => patch({ screening })}
          />
        </div>
        {[
          ['showPay', COPY.defaults.pay],
          ['applyWithProfile', COPY.defaults.profile],
          ['hireNss', COPY.defaults.nss],
        ].map(([key, row]) => (
          <SettingRow
            key={key}
            recruiter
            title={row.title}
            description={row.description}
            control={
              <SettingsToggle
                recruiter
                checked={draft[key]}
                label={row.title}
                onChange={(on) => patch({ [key]: on })}
              />
            }
          />
        ))}
      </GroupCard>

      <GroupCard
        recruiter
        title={COPY.messages.title}
        description={COPY.messages.description}
        aria-label={COPY.messages.title}
      >
        {AUTO_MESSAGES.map((m) => {
          const msg = draft.messages[m.id];
          return (
            <SettingRow
              key={m.id}
              recruiter
              title={m.title}
              description={
                <span className="block max-w-full truncate">
                  {msg.edited ? `“${msg.text}”` : m.summary}
                </span>
              }
              control={
                <div className="flex shrink-0 items-center gap-[12px]">
                  <SettingsEditLink
                    label={`Edit “${m.title}”`}
                    onClick={() => {
                      log('edit message', m.id);
                      settings.update({ modal: 'auto-message', message: m.id });
                    }}
                  />
                  <SettingsToggle
                    recruiter
                    checked={msg.on}
                    label={m.title}
                    onChange={(on) => {
                      log('message switch', { id: m.id, on });
                      setMessage(m.id, { on });
                    }}
                  />
                </div>
              }
            />
          );
        })}
      </GroupCard>

      <GroupCard
        recruiter
        title={COPY.goal.title}
        description={COPY.goal.description}
        aria-label={COPY.goal.title}
      >
        <SettingRow
          recruiter
          title={COPY.goal.row}
          description={COPY.goal.average}
          nowrapControl={false}
          className="md:min-h-[103px]"
          control={
            <div className="w-[200px] shrink-0 pt-[6px] max-sm:w-full">
              <Select
                verified
                chevronIcon={chevron}
                triggerClassName={SELECT_TRIGGER}
                value={draft.replyWithin}
                options={REPLY_WITHIN_OPTIONS}
                aria-label={COPY.goal.row}
                onChange={(replyWithin) => patch({ replyWithin })}
              />
            </div>
          }
        />
      </GroupCard>

      <SettingsFooter dirty={dirty} onCancel={onCancel} onSave={onSave} />

      {settings.modal === 'auto-message' ? (
        <AutoMessageDialog
          key={messageId}
          id={messageId}
          text={draft.messages[messageId].text}
          onCancel={closeDialog}
          onSave={(id, text) => {
            setMessage(id, { text, edited: true });
            closeDialog();
          }}
        />
      ) : null}
      {savedToast ? (
        <PipelineToast
          title={COPY.toast.title}
          message={COPY.toast.message}
          onClose={() => settings.update({ toast: null }, { replace: true })}
        />
      ) : null}
    </>
  );
};

export default HiringTab;
