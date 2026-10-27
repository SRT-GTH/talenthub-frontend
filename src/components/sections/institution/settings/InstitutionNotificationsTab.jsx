import { useCallback, useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import {
  SettingsACard,
  SettingsACheckbox,
  SettingsALink,
  SettingsARow,
  SettingsAToggle,
} from '../../talentSettings/SettingsAUi.jsx';
import {
  apiMessage,
  institutionNotifications,
  institutionUpdateNotifications,
} from '../../../../services/institutionPortal.api.js';
import InstitutionTimePill from './InstitutionTimePill.jsx';
import { NOTIF_CHANNELS, NOTIF_ROWS, TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionNotificationsTab');

const CELL = 'flex w-[96px] shrink-0 items-center justify-center max-md:w-auto max-md:flex-1';

/*
 * InstitutionNotificationsTab — Figma 11.6.1c (8597:396863): channel matrix (In GTH · Email · SMS · WhatsApp), quiet hours, weekly summary switch,
 * "Turn everything off for 24 hours" and Save changes. Live: the caller's own preferences (GET / PATCH /institution/settings/notifications).
 * "Turn everything off for 24 hours" saves a 24-hour mute at once (Undo lifts it). Props: onToast(toast, onUndo?).
 */
const InstitutionNotificationsTab = ({ onToast }) => {
  const [prefs, setPrefs] = useState(null);
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const r = await institutionNotifications();
      setPrefs(r);
      setSaved(r);
    } catch (err) {
      setError(apiMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <SettingsACard title="What we tell you about">
        <p role="alert" className="m-0 text-[14px] text-[#902b20]">
          Could not load your notification settings: {error}{' '}
          <button type="button" className="cursor-pointer font-semibold underline" onClick={load}>
            Try again
          </button>
        </p>
      </SettingsACard>
    );
  }
  if (!prefs) {
    return (
      <SettingsACard title="What we tell you about">
        <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
      </SettingsACard>
    );
  }

  const toggle = (id, col, v) => {
    log('cell', { id, col, v });
    setPrefs((p) => ({
      ...p,
      rows: { ...p.rows, [id]: p.rows[id].map((x, i) => (i === col ? v : x)) },
    }));
  };
  const setQuiet = (patch) => setPrefs((p) => ({ ...p, quiet: { ...p.quiet, ...patch } }));

  const save = async () => {
    setBusy(true);
    try {
      const r = await institutionUpdateNotifications({
        rows: prefs.rows,
        quiet: prefs.quiet,
        weekly: prefs.weekly,
      });
      setPrefs(r);
      setSaved(r);
      onToast(TOASTS.saved);
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const muteAll = async () => {
    log('everything off for 24h');
    try {
      const r = await institutionUpdateNotifications({ muteHours: 24 });
      setPrefs((p) => ({ ...p, mutedUntil: r.mutedUntil }));
      setSaved((s) => ({ ...s, mutedUntil: r.mutedUntil }));
      onToast({ ...TOASTS.muted, undo: true }, async () => {
        const back = await institutionUpdateNotifications({ muteHours: 0 }).catch(() => null);
        if (back) {
          setPrefs((p) => ({ ...p, mutedUntil: back.mutedUntil }));
          setSaved((s) => ({ ...s, mutedUntil: back.mutedUntil }));
        }
      });
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    }
  };

  const muted = prefs.mutedUntil && new Date(prefs.mutedUntil) > new Date();
  const dirty =
    JSON.stringify([prefs.rows, prefs.quiet, prefs.weekly]) !==
    JSON.stringify([saved.rows, saved.quiet, saved.weekly]);

  return (
    <>
      <SettingsACard title="What we tell you about" desc="Pick where each update reaches you.">
        {muted ? (
          <p className="m-0 rounded-[10px] bg-[#faf4e8] px-[12px] py-[8px] text-[13.5px] text-[#463409]">
            Everything is off until{' '}
            {new Intl.DateTimeFormat('en-GB', {
              weekday: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(prefs.mutedUntil))}
            .
          </p>
        ) : null}
        <div className="flex items-center py-[10px] text-[12.5px] leading-[15px] font-semibold text-[#595959] max-md:hidden">
          <p className="m-0 min-w-0 flex-1">Update</p>
          {NOTIF_CHANNELS.map((c) => (
            <p key={c} className="m-0 w-[96px] shrink-0 text-center">
              {c}
            </p>
          ))}
        </div>
        {NOTIF_ROWS.map((row) => (
          <div
            key={row.id}
            className="flex items-center border-t border-[rgba(28,42,33,0.08)] py-[12px] max-md:flex-col max-md:items-stretch max-md:gap-[10px]"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {row.title}
              </p>
              <p className="m-0 text-[13px] leading-[16px] text-[#595959] max-sm:text-[12px]">
                {row.desc}
              </p>
            </div>
            <div className="flex items-center max-md:justify-between">
              {NOTIF_CHANNELS.map((channel, col) => (
                <div key={channel} className={classNames(CELL, 'max-md:flex-col max-md:gap-[4px]')}>
                  <SettingsACheckbox
                    checked={Boolean(prefs.rows[row.id]?.[col])}
                    label={`${row.title}, ${channel}`}
                    onChange={(v) => toggle(row.id, col, v)}
                  />
                  <span
                    aria-hidden="true"
                    className="text-[12px] leading-[15px] font-semibold text-[#595959] md:hidden"
                  >
                    {channel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </SettingsACard>

      <SettingsACard
        title="Quiet hours"
        desc="We hold everything except revocations until morning."
      >
        <SettingsARow first title="Quiet hours on" desc="Every day">
          <SettingsAToggle
            on={prefs.quiet.on}
            label="Quiet hours on"
            onChange={(v) => setQuiet({ on: v })}
          />
        </SettingsARow>
        <div className="flex flex-wrap items-center gap-[16px] pt-[4px] pb-[6px]">
          <InstitutionTimePill
            value={prefs.quiet.from}
            label="Quiet hours from"
            onChange={(from) => setQuiet({ from })}
          />
          <p className="m-0 text-[14px] leading-[17px] font-medium text-[#595959]">to</p>
          <InstitutionTimePill
            value={prefs.quiet.to}
            label="Quiet hours to"
            onChange={(to) => setQuiet({ to })}
          />
        </div>
      </SettingsACard>

      <SettingsACard title="Weekly summary">
        <SettingsARow
          first
          title="Your school’s week"
          desc="Records waiting, new links and programme sign-ups, every Monday."
        >
          <SettingsAToggle
            on={prefs.weekly}
            label="Your school’s week"
            onChange={(v) => setPrefs((p) => ({ ...p, weekly: v }))}
          />
        </SettingsARow>
      </SettingsACard>

      <div className="flex flex-wrap items-center gap-[12px]">
        <SettingsALink tone="grey" onClick={muteAll}>
          Turn everything off for 24 hours
        </SettingsALink>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        {dirty ? (
          <Button variant="tertiary" size="lg" onClick={() => setPrefs(saved)} disabled={busy}>
            Cancel
          </Button>
        ) : null}
        <Button variant="primary" size="sm" onClick={save} disabled={busy || !dirty}>
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </>
  );
};

export default InstitutionNotificationsTab;
