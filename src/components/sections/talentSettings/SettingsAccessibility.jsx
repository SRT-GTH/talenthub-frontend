import { settingsError } from '../../../services/settings.api.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SettingsAInfoCircleIcon } from '../../shared/assets.jsx';
import {
  A11Y_ACTIONS,
  A11Y_CHANGED,
  A11Y_DEFAULTS,
  A11Y_MOVEMENT,
  A11Y_QUIZ,
  A11Y_READING,
  A11Y_TOAST,
} from './talentSettingsAData.js';
import {
  SettingsAPreview,
  SettingsASegmented,
  SettingsATextSizeSlider,
} from './SettingsAA11yParts.jsx';
import {
  SettingsACard,
  SettingsALink,
  SettingsARow,
  SettingsASaveBar,
  SettingsAToast,
  SettingsAToggle,
} from './SettingsAUi.jsx';

const log = debug('SettingsAccessibility');

const KEYS = Object.keys(A11Y_DEFAULTS);

// "Changed" sticker next to a row title that differs from the saved value (ST-09).
const ChangedChip = () => (
  <span className="rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[8px] py-[2px] text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px] playful:border-[#1c2a21]">
    {A11Y_CHANGED}
  </span>
);

/*
 * SettingsAccessibility — ST-04 Accessibility, ST-09 Unsaved changes (`?state=unsaved`, reached by changing
 * any setting) and ST-09b Saved (toast) (`?state=saved`, after Save). Local state only.
 * ST-09 as drawn: High contrast switched on (row gets a "Changed" chip) + the dark unsaved bar.
 */
const SettingsAccessibility = ({ settings }) => {
  const urlState = settings?.state;
  // Live: saved on the account (PUT /settings/preferences `accessibility`); the demo keeps the drawn states.
  const live = settings?.live?.overview ? settings.live : null;
  const isLive = Boolean(live);
  const accountPrefs = live ? { ...A11Y_DEFAULTS, ...(live.overview.preferences?.accessibility || {}) } : null;
  const [saved, setSaved] = useState(() =>
    accountPrefs || {
      ...A11Y_DEFAULTS,
      ...(urlState === 'saved' ? { contrast: true } : null),
    }
  );
  const [prefs, setPrefs] = useState(() =>
    accountPrefs || {
      ...A11Y_DEFAULTS,
      ...(urlState === 'saved' || urlState === 'unsaved' ? { contrast: true } : null),
    }
  );
  const previous = useRef(accountPrefs || A11Y_DEFAULTS);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    log('mount', { state: urlState });
  }, [urlState]);

  // Deep link into a state (URL changed outside this component): reproduce what the frame draws.
  const lastUrl = useRef(urlState);
  useEffect(() => {
    if (lastUrl.current === urlState) return;
    lastUrl.current = urlState;
    if (isLive) return; // live values come from the account, not the frame
    if (urlState === 'saved') {
      setPrefs((p) => {
        const next = { ...p, contrast: true };
        setSaved(next);
        return next;
      });
    } else if (urlState === 'unsaved') {
      setPrefs((p) => (p.contrast ? p : { ...p, contrast: true }));
    }
  }, [urlState, isLive]);

  const changed = KEYS.filter((k) => prefs[k] !== saved[k]);
  const dirty = changed.length > 0;

  // Keep `?state=unsaved` in step with whether anything differs (never clobber `saved`).
  useEffect(() => {
    if (dirty && urlState !== 'unsaved') settings?.update?.({ state: 'unsaved' });
    if (!dirty && urlState === 'unsaved') settings?.update?.({ state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, urlState]);

  const set = (patch) => {
    log('change', patch);
    setPrefs((p) => ({ ...p, ...patch }));
  };

  const save = async () => {
    log('save', prefs);
    if (live) {
      setBusy(true);
      setError(null);
      try {
        await live.savePreferences('accessibility', prefs);
      } catch (err) {
        setError(settingsError(err));
        return;
      } finally {
        setBusy(false);
      }
    }
    previous.current = saved;
    setSaved(prefs);
    settings?.update?.({ state: 'saved' });
  };
  const discard = () => {
    log('discard');
    setPrefs(saved);
  };
  const reset = () => {
    log('reset to default');
    setPrefs(A11Y_DEFAULTS);
  };
  const undo = () => {
    log('undo save');
    if (live) live.savePreferences('accessibility', previous.current).catch((err) => setError(settingsError(err)));
    setPrefs(previous.current);
    setSaved(previous.current);
    settings?.update?.({ state: null });
  };
  const expireToast = useCallback(() => {
    log('toast expired');
    settings?.update?.({ state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.update]);

  const toggleRow = (row) => (
    <SettingsARow
      key={row.id}
      title={row.title}
      desc={row.desc}
      first={false}
      badge={changed.includes(row.id) ? <ChangedChip /> : null}
    >
      <SettingsAToggle
        on={prefs[row.id]}
        label={row.title}
        onChange={(v) => set({ [row.id]: v })}
      />
    </SettingsARow>
  );

  return (
    <>
      {error ? (
        <p role="alert" className="m-0 text-[14px] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}
      <div className="flex items-start gap-[20px] max-xl:flex-col">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">
          <SettingsACard title={A11Y_READING.title} desc={A11Y_READING.desc}>
            <div className="flex flex-col gap-[12px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
              <div className="flex items-center gap-[8px]">
                <p className="min-w-0 flex-1 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {A11Y_READING.textSize.title}
                </p>
                <span className="flex h-[32px] items-center rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#387440]">
                  {prefs.textSize}%
                </span>
              </div>
              <SettingsATextSizeSlider
                value={prefs.textSize}
                label={A11Y_READING.textSize.title}
                onChange={(v) => set({ textSize: v })}
              />
            </div>
            {A11Y_READING.rows.map(toggleRow)}
          </SettingsACard>

          <SettingsACard title={A11Y_MOVEMENT.title}>
            {A11Y_MOVEMENT.rows.map(toggleRow)}
          </SettingsACard>

          <SettingsACard title={A11Y_QUIZ.title}>
            <SettingsARow
              title={A11Y_QUIZ.extraTime.title}
              desc={A11Y_QUIZ.extraTime.desc}
              className="max-sm:flex-col max-sm:items-stretch"
              badge={changed.includes('extraTime') ? <ChangedChip /> : null}
            >
              <SettingsASegmented
                options={A11Y_QUIZ.extraTime.options}
                value={prefs.extraTime}
                label={A11Y_QUIZ.extraTime.title}
                onChange={(v) => set({ extraTime: v })}
              />
            </SettingsARow>
            {toggleRow({ ...A11Y_QUIZ.keyboard })}
          </SettingsACard>
        </div>
        <div className="max-xl:order-first max-xl:w-full">
          <SettingsAPreview prefs={prefs} />
        </div>
      </div>

      {dirty ? (
        <SettingsASaveBar
          icon={<SettingsAInfoCircleIcon className="block size-[20px] shrink-0" />}
          message={`You have ${changed.length} unsaved change${changed.length === 1 ? '' : 's'}`}
          discardLabel="Discard"
          onDiscard={discard}
          saveLabel={
            <Button variant="primary" size="sm" disabled={busy} onClick={save}>
              {A11Y_ACTIONS.save}
            </Button>
          }
        />
      ) : (
        <div className={classNames('flex flex-wrap items-center gap-[12px]')}>
          <SettingsALink tone="grey" onClick={reset}>
            {A11Y_ACTIONS.reset}
          </SettingsALink>
          <span aria-hidden="true" className="h-px min-w-px flex-1" />
          <Button variant="primary" size="sm" disabled={busy} onClick={save}>
            {A11Y_ACTIONS.save}
          </Button>
        </div>
      )}

      {urlState === 'saved' ? (
        <SettingsAToast
          title={A11Y_TOAST.title}
          body={A11Y_TOAST.body}
          undoLabel={A11Y_TOAST.undo}
          onUndo={undo}
          onExpire={expireToast}
        />
      ) : null}
    </>
  );
};

export default SettingsAccessibility;
