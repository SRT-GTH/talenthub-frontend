import { useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import TogglePill from '../../../ui/TogglePill.jsx';
import { GroupCard, SettingRow, SettingsToggle } from '../../talentSettings/SettingsBUi.jsx';
import SettingsBanner from '../hiring/SettingsBanner.jsx';
import SettingsFooter from '../hiring/SettingsFooter.jsx';
import { InfoIcon } from '../hiring/hiringIcons.jsx';
import {
  A11Y_COPY as COPY,
  A11Y_DEFAULTS,
  A11Y_TOGGLES,
  FOOTER_COPY,
} from '../hiring/hiringData.js';

import { savePreferences, settingsError } from '../../../../services/settings.api.js';
import {
  a11yFromPrefs,
  a11yToPrefs,
  useLiveSettingsOverview,
} from '../account/useLiveSettingsOverview.js';

const log = debug('AccessibilityTab');

/*
 * AccessibilityTab - recruiter Settings `?tab=accessibility` (Figma SR-12 10161:81376; unsaved SR-22 10161:84623).
 * The talent Accessibility page (talentSettings/SettingsAccessibility) cut down to what the recruiter frames draw: the blue "Recruiter accounts always use Focused mode" banner (so no
 * Playful option), Reading and display (text size pills + High contrast / Reduce motion / Dyslexia-friendly font) and Reading support (Read messages aloud / Keyboard shortcuts).
 * Changes are a draft: any difference from the saved values shows "You have unsaved changes" and enables Save changes; Cancel restores. `?state=unsaved` (SR-22) loads with High contrast on
 * and the URL follows the dirty flag. Mock only: the options are not applied to the page.
 */
const AccessibilityTab = ({ settings }) => {
  const [saved, setSaved] = useState(A11Y_DEFAULTS);
  const [draft, setDraft] = useState(() => ({
    ...A11Y_DEFAULTS,
    ...(settings.state === 'unsaved' ? { contrast: true } : null),
  }));
  const [status, setStatus] = useState(null);
  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const urlState = settings.state;
  // Signed in: the recruiter's stored accessibility preferences (PUT /settings/preferences).
  const live = useLiveSettingsOverview();
  const isLive = live.status !== 'demo';
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (live.status === 'live' && !seeded) {
      setSeeded(true);
      const stored = a11yFromPrefs(live.overview?.preferences?.accessibility, A11Y_DEFAULTS);
      setSaved(stored);
      setDraft(stored);
    }
  }, [live.status, live.overview, seeded]);
  const update = useRef(settings.update);
  update.current = settings.update;

  useEffect(() => {
    log('mount', { state: urlState, dirty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep ?state=unsaved in step with the dirty flag (replace, so Back does not step through every switch).
  useEffect(() => {
    log('dirty', { dirty, urlState });
    if (dirty && urlState !== 'unsaved') update.current({ state: 'unsaved' }, { replace: true });
    if (!dirty && urlState === 'unsaved') update.current({ state: null }, { replace: true });
  }, [dirty, urlState]);

  const set = (patch) => {
    log('change', patch);
    setStatus(null);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const toggles = (rows) =>
    rows.map((row) => (
      <SettingRow
        key={row.id}
        recruiter
        title={row.title}
        description={row.description}
        control={
          <SettingsToggle
            recruiter
            checked={draft[row.id]}
            label={row.title}
            onChange={(on) => set({ [row.id]: on })}
          />
        }
      />
    ));

  return (
    <>
      <SettingsBanner
        tone="blue"
        icon={InfoIcon}
        title={COPY.banner.title}
        body={COPY.banner.body}
        compactTitle={!dirty}
      />

      <GroupCard recruiter title={COPY.reading.title} aria-label={COPY.reading.title}>
        <SettingRow
          recruiter
          nowrapControl={false}
          title={COPY.textSize.title}
          description={COPY.textSize.description}
          control={
            <div
              role="radiogroup"
              aria-label={COPY.textSize.title}
              className="flex flex-wrap items-center gap-[8px]"
            >
              {COPY.textSize.options.map((option) => (
                <TogglePill
                  key={option}
                  role="radio"
                  aria-pressed={undefined}
                  aria-checked={draft.textSize === option}
                  selected={draft.textSize === option}
                  className="!min-h-[41px]"
                  onClick={() => set({ textSize: option })}
                >
                  {option}
                </TogglePill>
              ))}
            </div>
          }
        />
        {toggles(A11Y_TOGGLES.reading)}
      </GroupCard>

      <GroupCard recruiter title={COPY.support.title} aria-label={COPY.support.title}>
        {toggles(A11Y_TOGGLES.support)}
      </GroupCard>

      <SettingsFooter
        dirty={dirty}
        saveDisabled={!dirty}
        status={status}
        onCancel={() => {
          log('cancel');
          setDraft(saved);
          setStatus(null);
        }}
        onSave={() => {
          log('save', draft);
          if (isLive) {
            savePreferences({ accessibility: a11yToPrefs(draft) })
              .then(() => {
                setSaved(draft);
                setStatus({ tone: 'ok', text: FOOTER_COPY.saved });
              })
              .catch((err) => setStatus({ tone: 'error', text: settingsError(err) }));
            return;
          }
          setSaved(draft);
          setStatus({ tone: 'ok', text: FOOTER_COPY.saved });
        }}
      />
    </>
  );
};

export default AccessibilityTab;
