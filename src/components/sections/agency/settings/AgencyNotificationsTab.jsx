import { useEffect, useState } from 'react';
import { agencySettings, agencyUpdateNotifications } from '../../../../services/agency.api.js';
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
import { useAgencyResource } from '../useAgencyResource.js';
import AgencyTimePill from './AgencyTimePill.jsx';
import { NOTIF_CHANNELS, NOTIF_QUIET, NOTIF_ROWS, TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyNotificationsTab');

const CELL = 'flex w-[96px] shrink-0 items-center justify-center max-md:w-auto max-md:flex-1';
const fmtTime = (d) =>
  new Date(d).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' });

/*
 * AgencyNotificationsTab — Figma 11.6.1f (8611:1966): channel matrix (In GTH · Email · SMS · WhatsApp), quiet hours, weekly summary switch,
 * "Turn everything off for 24 hours" and Save changes. Live: the caller's own preferences from GET /agency/settings; Save →
 * PATCH /agency/settings/notifications (rows, quiet hours, weekly summary); "off for 24 hours" sets a 24-hour mute on the server
 * (Undo lifts it). Props: onToast(toast, onUndo?).
 */
const AgencyNotificationsTab = ({ onToast }) => {
  const res = useAgencyResource(agencySettings, []);
  const n = res.data?.notifications;
  const [matrix, setMatrix] = useState(null);
  const [quiet, setQuiet] = useState({ on: true, ...NOTIF_QUIET });
  const [weekly, setWeekly] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!n) return;
    setMatrix(
      Object.fromEntries(
        NOTIF_ROWS.map((r) => [r.id, [...(n.rows.find((x) => x.id === r.id)?.on ?? r.on)]])
      )
    );
    setQuiet({ on: n.quiet.on !== false, from: n.quiet.from, to: n.quiet.to });
    setWeekly(n.weekly !== false);
  }, [n]);

  const toggle = (id, col, v) => {
    log('cell', { id, col, v });
    setMatrix((m) => ({ ...m, [id]: m[id].map((x, i) => (i === col ? v : x)) }));
  };

  const save = async () => {
    setBusy(true);
    try {
      await agencyUpdateNotifications({ rows: matrix, quiet, weekly });
      res.reload();
      onToast(TOASTS.saved);
    } catch (err) {
      onToast({ title: 'Not saved', body: err?.response?.data?.message || err?.message });
    } finally {
      setBusy(false);
    }
  };

  const muteAll = async () => {
    log('everything off');
    try {
      await agencyUpdateNotifications({ muteHours: 24 });
      res.reload();
      onToast({ ...TOASTS.muted, undo: true }, () => {
        agencyUpdateNotifications({ muteHours: 0 })
          .then(() => res.reload())
          .catch((err) => log.error('unmute failed', err?.message));
      });
    } catch (err) {
      onToast({ title: 'Not done', body: err?.response?.data?.message || err?.message });
    }
  };

  if (!matrix) {
    return (
      <p role="status" className="m-0 p-[16px] font-sans text-[15px] text-[#737373]">
        {res.error
          ? 'We couldn’t load your notification settings.'
          : 'Loading your notification settings…'}
      </p>
    );
  }

  const muted = n?.mutedUntil && new Date(n.mutedUntil) > new Date();

  return (
    <>
      {muted ? (
        <p
          role="status"
          className="m-0 rounded-[14px] bg-[#faf4e8] px-[16px] py-[12px] text-[14px] leading-[20px] text-[#463409]"
        >
          Everything is off until {fmtTime(n.mutedUntil)}.{' '}
          <button
            type="button"
            onClick={() =>
              agencyUpdateNotifications({ muteHours: 0 })
                .then(() => res.reload())
                .catch((err) => log.error('unmute failed', err?.message))
            }
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
          >
            Turn back on
          </button>
        </p>
      ) : null}
      <SettingsACard title="What we tell you about" desc="Pick where each update reaches you.">
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
                    checked={matrix[row.id][col]}
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
        desc="We hold everything except access ending until morning."
      >
        <SettingsARow first title="Quiet hours on" desc="Every day">
          <SettingsAToggle
            on={quiet.on}
            label="Quiet hours on"
            onChange={(v) => setQuiet((q) => ({ ...q, on: v }))}
          />
        </SettingsARow>
        <div className="flex flex-wrap items-center gap-[16px] pt-[4px] pb-[6px]">
          <AgencyTimePill
            value={quiet.from}
            label="Quiet hours from"
            onChange={(from) => setQuiet((q) => ({ ...q, from }))}
          />
          <p className="m-0 text-[14px] leading-[17px] font-medium text-[#595959]">to</p>
          <AgencyTimePill
            value={quiet.to}
            label="Quiet hours to"
            onChange={(to) => setQuiet((q) => ({ ...q, to }))}
          />
        </div>
      </SettingsACard>

      <SettingsACard title="Weekly summary">
        <SettingsARow
          first
          title="Your agency’s week"
          desc="Query changes, request decisions and applicants, every Monday."
        >
          <SettingsAToggle on={weekly} label="Your agency’s week" onChange={setWeekly} />
        </SettingsARow>
      </SettingsACard>

      <div className="flex flex-wrap items-center gap-[12px]">
        <SettingsALink tone="grey" onClick={muteAll}>
          Turn everything off for 24 hours
        </SettingsALink>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <Button variant="primary" size="sm" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </>
  );
};

export default AgencyNotificationsTab;
