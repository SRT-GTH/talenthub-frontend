import LiveSaveStatus from './LiveSaveStatus.jsx';
import { useSaveAction } from './useSaveAction.js';
import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { Chip } from '../talentHome/coreUi.jsx';
import {
  GroupCard,
  SegmentedControl,
  SettingRow,
  SettingsToggle,
  StatusPill,
} from './SettingsBUi.jsx';
import {
  LANGUAGES,
  LANGUAGE_COPY,
  LANGUAGE_DEFAULTS,
  VIDEO_OPTIONS,
} from './talentSettingsBData.js';

const log = debug('SettingsLanguage');

// 22px radio (Figma `radio · on/off`): Focused 1px ring, Playful 2px green ring / 1.5px grey ring.
const Radio = ({ on }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'relative size-[22px] shrink-0 rounded-full bg-white',
      on
        ? 'border border-[#387440] playful:border-2'
        : 'border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.35)]'
    )}
  >
    {on && (
      <span className="absolute top-1/2 left-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#387440]" />
    )}
  </span>
);

/*
 * SettingsLanguage — ST-05 "Language and data" (Playful 7843:13508 / Focused 8110:45536).
 * Local state reproduces the drawn state: English (Ghana) selected, Data saver on, Wi-Fi-only off,
 * Videos "Ask first". Frontend-only; Save changes logs the payload.
 */
const SettingsLanguage = ({ settings }) => {
  // Live: saved on the account (PUT /settings/preferences `language`). The app copy itself is English-only for now.
  const live = settings?.live?.overview ? settings.live : null;
  const start = { ...LANGUAGE_DEFAULTS, ...(live?.overview.preferences?.language || {}) };
  const [language, setLanguage] = useState(start.language);
  const [dataSaver, setDataSaver] = useState(start.dataSaver);
  const [wifiOnly, setWifiOnly] = useState(start.wifiOnly);
  const [videos, setVideos] = useState(start.videos);
  const { busy, status, run } = useSaveAction();
  const copy = LANGUAGE_COPY;

  const onSave = () => {
    log('dispatch save', { language, dataSaver, wifiOnly, videos });
    if (live)
      run(() => live.savePreferences('language', { language, dataSaver, wifiOnly, videos }));
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="language">
      <GroupCard
        title={copy.appLanguage.title}
        description={copy.appLanguage.description}
        gap="gap-[4px]"
      >
        <div
          role="radiogroup"
          aria-label={copy.appLanguage.title}
          className="flex w-full flex-wrap gap-[12px]"
        >
          {LANGUAGES.map((lang) => {
            const on = lang.id === language;
            return (
              <label
                key={lang.id}
                className={classNames(
                  'flex w-full cursor-pointer items-center gap-[12px] rounded-[16px] p-[14px] min-[560px]:w-[305px]',
                  'has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#111]',
                  on
                    ? 'border border-[#387440] bg-[#ebf1ec] playful:border-[1.5px]'
                    : 'border border-[rgba(28,42,33,0.12)] bg-white'
                )}
              >
                <input
                  type="radio"
                  name="app-language"
                  value={lang.id}
                  checked={on}
                  onChange={() => {
                    log('branch', { language: lang.id });
                    setLanguage(lang.id);
                  }}
                  className="sr-only outline-none!"
                />
                <Radio on={on} />
                <span className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[2px] leading-[normal] whitespace-nowrap">
                  <span className="text-[15px] font-semibold text-[#1c2a21]">{lang.name}</span>
                  <span className="text-[13px] text-[#595959]">{lang.native}</span>
                </span>
                {lang.beta && <StatusPill tone="beta">{copy.appLanguage.beta}</StatusPill>}
              </label>
            );
          })}
        </div>
      </GroupCard>

      <GroupCard title={copy.lightOnData.title} description={copy.lightOnData.description}>
        <SettingRow
          title={copy.lightOnData.dataSaver.title}
          titleId="lang-data-saver"
          chip={<StatusPill tone="on">{copy.lightOnData.dataSaver.chip}</StatusPill>}
          description={copy.lightOnData.dataSaver.description}
          control={
            <SettingsToggle
              labelledBy="lang-data-saver"
              checked={dataSaver}
              onChange={setDataSaver}
            />
          }
        />
        <SettingRow
          title={copy.lightOnData.wifiOnly.title}
          titleId="lang-wifi-only"
          description={copy.lightOnData.wifiOnly.description}
          control={
            <SettingsToggle labelledBy="lang-wifi-only" checked={wifiOnly} onChange={setWifiOnly} />
          }
        />
        <SettingRow
          top={false}
          nowrapControl={false}
          title={copy.lightOnData.videos.title}
          description={copy.lightOnData.videos.description}
          control={
            <SegmentedControl
              label={copy.lightOnData.videos.title}
              options={VIDEO_OPTIONS}
              value={videos}
              onChange={setVideos}
            />
          }
        />
      </GroupCard>

      <GroupCard title={copy.formats.title}>
        <SettingRow
          title={copy.formats.currency.title}
          description={copy.formats.currency.description}
          control={<Chip>{copy.formats.currency.value}</Chip>}
        />
        <SettingRow
          top={false}
          title={copy.formats.dateFormat.title}
          description={copy.formats.dateFormat.description}
          control={<Chip>{copy.formats.dateFormat.value}</Chip>}
        />
      </GroupCard>

      <div className="flex w-full items-center justify-end gap-[12px]">
        <LiveSaveStatus status={status} className="mr-auto" />
        <Button variant="primary" size="sm" disabled={busy} onClick={onSave}>
          {copy.save}
        </Button>
      </div>
    </div>
  );
};

export default SettingsLanguage;
