import LiveSaveStatus from './LiveSaveStatus.jsx';
import { useSaveAction } from './useSaveAction.js';
import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { DEFAULT_UI_STYLE } from '../../../services/uiStylePreference.js';
import Button from '../../ui/Button.jsx';
import { SettingsInfoCircleIcon, SettingsVolumeIcon } from '../../shared/assets.jsx';
import previewPlayful from '../../../assets/talent-settings/b/appearance-preview-playful.png';
import previewFocused from '../../../assets/talent-settings/b/appearance-preview-focused.png';
import {
  GroupCard,
  SegmentedControl,
  SettingRow,
  SettingsToggle,
  TextAction,
} from './SettingsBUi.jsx';
import { APPEARANCE_COPY, APPEARANCE_DEFAULTS } from './talentSettingsBData.js';

const log = debug('SettingsAppearance');

// 18px radio on a style card: green thick ring when chosen, thin grey ring otherwise (Figma `radio`).
const CardRadio = ({ on }) =>
  on ? (
    <span
      aria-hidden="true"
      className="size-[18px] shrink-0 rounded-full border-[5px] border-[#387440] bg-white"
    />
  ) : (
    <span
      aria-hidden="true"
      className="size-[18px] shrink-0 rounded-full border-[1.5px] border-[rgba(28,42,33,0.35)] bg-white"
    />
  );

const StyleCard = ({ option, image, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={classNames(
      'flex min-w-0 flex-[1_0_0] cursor-pointer flex-col items-start gap-[10px] overflow-clip rounded-[16px] px-[12px] pt-[12px] pb-[16px] text-left',
      selected
        ? 'border-2 border-[#387440] bg-[#ebf1ec]'
        : 'border border-[rgba(28,42,33,0.15)] bg-white'
    )}
  >
    <span className="relative block h-[150px] w-full shrink-0 rounded-[10px] border border-[rgba(28,42,33,0.1)]">
      <img
        src={image}
        alt=""
        className="pointer-events-none absolute inset-0 size-full rounded-[10px] object-cover"
      />
    </span>
    <span className="flex w-full items-center gap-[8px]">
      <CardRadio on={selected} />
      <span className="font-sans text-[16px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21] playful:font-heading">
        {option.label}
      </span>
    </span>
    <span className="w-full text-[13px] leading-[normal] text-[#595959]">{option.description}</span>
  </button>
);

/*
 * SettingsAppearance — ST-09 "Appearance" (Playful 8181:1049 / Focused 8182:12012).
 * Choosing a style really switches the theme (useUiStyle().setUiStyle — same logic as the top-bar
 * StyleSwitch). The other controls are local state; Save changes / Reset to default log their payload.
 */
const SettingsAppearance = ({ settings }) => {
  const { uiStyle, setUiStyle } = useUiStyle();
  const copy = APPEARANCE_COPY;
  // Live: saved on the account (PUT /settings/preferences `appearance`, incl. the chosen style).
  const live = settings?.live?.overview ? settings.live : null;
  const start = { ...APPEARANCE_DEFAULTS, ...(live?.overview.preferences?.appearance || {}) };
  const [stickers, setStickers] = useState(start.stickers);
  const [xp, setXp] = useState(start.xp);
  const [popups, setPopups] = useState(start.popups);
  const [workHours, setWorkHours] = useState(start.workHours);
  const [sync, setSync] = useState(start.sync);
  const { busy, status, run } = useSaveAction();

  // "Same style on all my devices": the style saved on the account wins over this browser's choice.
  const accountStyle = live?.overview.preferences?.appearance?.style;
  useEffect(() => {
    if (accountStyle && start.sync && accountStyle !== uiStyle) {
      log('apply account style', accountStyle);
      setUiStyle(accountStyle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountStyle]);

  const choose = (id) => {
    log('dispatch setUiStyle', { id });
    setUiStyle(id);
  };

  const reset = () => {
    log('dispatch reset to default', { style: DEFAULT_UI_STYLE });
    setUiStyle(DEFAULT_UI_STYLE);
    setStickers(APPEARANCE_DEFAULTS.stickers);
    setXp(APPEARANCE_DEFAULTS.xp);
    setPopups(APPEARANCE_DEFAULTS.popups);
    setWorkHours(APPEARANCE_DEFAULTS.workHours);
    setSync(APPEARANCE_DEFAULTS.sync);
  };

  const save = () => {
    log('dispatch save', { uiStyle, stickers, xp, popups, workHours, sync });
    if (live)
      run(() =>
        live.savePreferences('appearance', {
          style: uiStyle,
          stickers,
          xp,
          popups,
          workHours,
          sync,
        })
      );
  };

  return (
    <div className="@container w-full" data-settings-section="appearance">
      <div className="flex w-full flex-col gap-[20px]">
        <div className="flex w-full flex-col items-start gap-[20px] @[800px]:flex-row">
          <div className="flex min-w-0 w-full flex-col gap-[20px] @[800px]:flex-[1_0_0]">
            <GroupCard title={copy.style.title} description={copy.style.description}>
              <div
                role="radiogroup"
                aria-label={copy.style.title}
                className="flex w-full items-start gap-[16px] overflow-clip"
              >
                <StyleCard
                  option={copy.style.playful}
                  image={previewPlayful}
                  selected={uiStyle === 'playful'}
                  onSelect={() => choose('playful')}
                />
                <StyleCard
                  option={copy.style.focused}
                  image={previewFocused}
                  selected={uiStyle === 'focused'}
                  onSelect={() => choose('focused')}
                />
              </div>
            </GroupCard>

            <GroupCard title={copy.celebrations.title} gap="gap-[8px] playful:gap-[16px]">
              <div className="hidden w-full playful:block">
                <SettingRow
                  title={copy.celebrations.stickers.title}
                  titleId="appearance-stickers"
                  description={copy.celebrations.stickers.description}
                  control={
                    <SettingsToggle
                      labelledBy="appearance-stickers"
                      checked={stickers}
                      onChange={setStickers}
                    />
                  }
                />
              </div>
              <SettingRow
                title={copy.celebrations.xp.title}
                titleId="appearance-xp"
                description={copy.celebrations.xp.description}
                control={
                  <SettingsToggle labelledBy="appearance-xp" checked={xp} onChange={setXp} />
                }
              />
              <SettingRow
                top={false}
                title={copy.celebrations.popups.title}
                titleId="appearance-popups"
                description={copy.celebrations.popups.description}
                control={
                  <SettingsToggle
                    labelledBy="appearance-popups"
                    checked={popups}
                    onChange={setPopups}
                  />
                }
              />
            </GroupCard>

            <GroupCard title={copy.switching.title} gap="gap-[8px] playful:gap-[16px]">
              <SettingRow
                nowrapControl={false}
                title={copy.switching.workHours.title}
                description={copy.switching.workHours.description}
                control={
                  <SegmentedControl
                    label={copy.switching.workHours.title}
                    options={copy.switching.workHours.options}
                    value={workHours}
                    onChange={setWorkHours}
                  />
                }
              />
              <SettingRow
                top={false}
                title={copy.switching.sync.title}
                titleId="appearance-sync"
                description={copy.switching.sync.description}
                control={
                  <SettingsToggle labelledBy="appearance-sync" checked={sync} onChange={setSync} />
                }
              />
            </GroupCard>
          </div>

          <aside
            aria-label={copy.preview.label}
            className="flex w-full shrink-0 flex-col items-start gap-[16px] @[800px]:w-[320px]"
          >
            <div
              className={classNames(
                'flex w-full flex-col items-start gap-[12px] rounded-[24px] bg-white p-[22px] max-lg:p-[16px]',
                'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]',
                'playful:gap-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]'
              )}
            >
              <div className="flex w-full items-center gap-[8px]">
                <p className="text-[11.5px] leading-[normal] font-bold whitespace-nowrap text-[#387440] max-lg:text-[12px]">
                  {copy.preview.label}
                </p>
                <span className="h-px min-w-px flex-[1_0_0]" />
                <span className="rounded-full border border-[rgba(28,42,33,0.1)] bg-[#ffd86b] px-[8px] py-[3px] text-[11px] leading-[normal] font-bold whitespace-nowrap text-[#1c2a21] playful:border-[#1c2a21] max-lg:text-[12px]">
                  {copy.preview.chip}
                </span>
              </div>
              <div className="flex w-full flex-col items-start gap-[16px] rounded-[16px] bg-[#f8f8f4] p-[16px] playful:gap-[8px]">
                <p className="text-[20px] leading-[normal] font-semibold text-[#1c2a21]">
                  {copy.preview.jobTitle}
                </p>
                <p className="text-[15px] leading-[normal] text-[#595959]">
                  {copy.preview.company}
                </p>
                <p className="w-full text-[16px] leading-[1.5] text-[#1c2a21]">
                  {copy.preview.match}
                </p>
                <p className="text-[16px] leading-[normal] font-semibold text-[#387440] underline decoration-solid decoration-from-font [text-underline-position:from-font]">
                  {copy.preview.link}
                </p>
                <span className="inline-flex items-center gap-[6px] rounded-full border border-[rgba(28,42,33,0.1)] bg-white px-[12px] py-[7px] playful:border-[rgba(28,42,33,0.15)]">
                  <SettingsVolumeIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
                  <span className="text-[14px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
                    {copy.preview.listen}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex w-full items-start gap-[10px] rounded-[16px] bg-[#ebf1ec] p-[16px]">
              <SettingsInfoCircleIcon className="size-[18px] shrink-0 text-[#387440]" />
              <p className="min-w-0 flex-[1_0_0] text-[13.5px] leading-[1.45] text-[#2a5730]">
                {copy.preview.tip}
              </p>
            </div>
          </aside>
        </div>

        <div className="flex w-full items-center gap-[12px]">
          <TextAction tone="grey" onClick={reset}>
            {copy.reset}
          </TextAction>
          <span className="h-px min-w-px flex-[1_0_0]" />
          <LiveSaveStatus status={status} />
          <Button variant="primary" size="sm" disabled={busy} onClick={save}>
            {copy.save}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsAppearance;
