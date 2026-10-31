import { useSearchParams } from 'react-router-dom';
import SettingsAccessibility from '../../talentSettings/SettingsAccessibility.jsx';
import SettingsLanguage from '../../talentSettings/SettingsLanguage.jsx';

/*
 * Accessibility and Language and data for parents. The parent canvas has no frames for these two, so they reuse the
 * talent Settings screens (same account preferences: PUT /settings/preferences `accessibility` / `language`).
 * Props: live ({ overview, savePreferences(group, values) } while signed in; null shows the talent demo values).
 * The talent screens track saved / unsaved in their `state`. On parent pages any `?state=` in the URL means a Figma
 * frame (demo mode, see useParentLiveMode), so that state lives under `?pref=` here instead.
 */
const KEY = { state: 'pref' };

const useTalentSettings = (live) => {
  const [params, setParams] = useSearchParams();
  return {
    live,
    state: params.get(KEY.state) || null,
    update: (patch) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch || {}).forEach(([k, v]) => {
            const key = KEY[k] || k;
            if (v === null || v === undefined || v === '') next.delete(key);
            else next.set(key, v);
          });
          return next;
        },
        { replace: true }
      ),
  };
};

export const AccessibilityTab = ({ live = null }) => {
  const settings = useTalentSettings(live);
  return <SettingsAccessibility settings={settings} />;
};

export const LanguageTab = ({ live = null }) => {
  const settings = useTalentSettings(live);
  return <SettingsLanguage settings={settings} />;
};
