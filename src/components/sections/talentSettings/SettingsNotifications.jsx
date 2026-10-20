import { settingsError } from '../../../services/settings.api.js';
import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SettingsAChevronDownIcon,
  SettingsAClockIcon,
  SettingsANotificationIcon,
} from '../../shared/assets.jsx';
import {
  NOTIF_ACTIONS,
  NOTIF_MATRIX,
  NOTIF_PAUSED,
  NOTIF_QUIET,
  NOTIF_WEEKLY,
} from './talentSettingsAData.js';
import {
  SettingsACard,
  SettingsACheckbox,
  SettingsALink,
  SettingsARow,
  SettingsAToggle,
} from './SettingsAUi.jsx';

const log = debug('SettingsNotifications');

const CELL = 'flex w-[96px] shrink-0 items-center justify-center max-md:w-auto max-md:flex-1';

// Hourly 12-hour clock options for the quiet-hours pickers ("10:00 pm", "7:00 am").
const TIMES = Array.from({ length: 24 }, (_, h) => {
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${h < 12 ? 'am' : 'pm'}`;
});

// Pill-shaped time picker: a native <select> laid over the Figma pill so it stays keyboard friendly.
const TimePill = ({ value, onChange, label }) => (
  <label className="relative flex cursor-pointer items-center gap-[8px] rounded-[12px] border border-[rgba(28,42,33,0.1)] bg-white px-[14px] py-[10px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] playful:border-[rgba(28,42,33,0.2)]">
    <SettingsAClockIcon className="block size-[16px] shrink-0" />
    <span className="text-[15px] leading-[18px] font-semibold whitespace-nowrap text-[#1c2a21]">
      {value}
    </span>
    <SettingsAChevronDownIcon className="block size-[18px] shrink-0" />
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 size-full cursor-pointer opacity-0"
    >
      {TIMES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  </label>
);

/*
 * SettingsNotifications — ST-03 Notifications and ST-03b "Paused for 24 hours" (`?state=paused`, reached
 * by the "Turn everything off for 24 hours" link; "Resume now" returns). While paused the matrix is
 * dimmed (50 %) with every box off and not editable — the previous choices come back on resume.
 */
const pausedUntilLabel = (iso) =>
  `All notifications paused until ${new Date(iso).toLocaleString('en-GB', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;

const SettingsNotificationsBody = ({ settings }) => {
  // Live (GET/PUT /settings/notifications) unless `?demo=1`; the demo keeps `?state=paused`.
  const live = settings?.live?.notifications ? settings.live : null;
  const ln = live?.notifications;
  const paused = live ? Boolean(ln.pausedUntil) : settings?.state === 'paused';
  const [matrix, setMatrix] = useState(() =>
    ln ? { ...ln.rows } : Object.fromEntries(NOTIF_MATRIX.rows.map((r) => [r.id, [...r.on]]))
  );
  const [quiet, setQuiet] = useState(() =>
    ln ? { ...ln.quiet } : { on: true, from: NOTIF_QUIET.from, to: NOTIF_QUIET.to }
  );
  const [weekly, setWeekly] = useState(ln ? ln.weekly : true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const run = async (body, okText) => {
    setBusy(true);
    setStatus(null);
    try {
      await live.saveNotifications(body);
      setStatus({ tone: 'ok', text: okText });
    } catch (err) {
      setStatus({ tone: 'error', text: settingsError(err) });
    } finally {
      setBusy(false);
    }
  };
  const pause = () => (live ? run({ pause: true }, 'Paused for 24 hours') : settings?.update?.({ state: 'paused' }));
  const resume = () => (live ? run({ pause: false }, 'Notifications are back on') : settings?.update?.({ state: null }));
  const save = () => (live ? run({ rows: matrix, quiet, weekly }, 'Saved') : log('save notifications'));

  log('render', { paused });

  const toggleCell = (rowId, col, v) => {
    log('cell', { rowId, col, v });
    setMatrix((m) => ({ ...m, [rowId]: m[rowId].map((x, i) => (i === col ? v : x)) }));
  };

  return (
    <>
      {paused ? (
        <div
          role="status"
          className="flex flex-wrap items-center gap-x-[14px] gap-y-[12px] rounded-[18px] border border-[rgba(28,42,33,0.1)] bg-[#ffd86b] p-[18px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]"
        >
          <SettingsANotificationIcon className="block size-[22px] shrink-0" />
          <div className="flex min-w-[60%] flex-1 flex-col gap-[2px] text-[#1c2a21]">
            <p className="leading-[19px] text-[16px] font-semibold">
              {ln?.pausedUntil ? pausedUntilLabel(ln.pausedUntil) : NOTIF_PAUSED.title}
            </p>
            <p className="text-[13.5px]">{NOTIF_PAUSED.desc}</p>
          </div>
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            disabled={busy}
            onClick={() => {
              log('resume now');
              resume();
            }}
          >
            {NOTIF_PAUSED.resume}
          </Button>
        </div>
      ) : null}

      <SettingsACard
        title={NOTIF_MATRIX.title}
        desc={NOTIF_MATRIX.desc}
        className={paused ? 'opacity-50' : undefined}
        aria-disabled={paused ? 'true' : undefined}
      >
        <div className="flex items-center py-[10px] text-[12.5px] leading-[15px] font-semibold text-[#595959] max-md:hidden">
          <p className="min-w-0 flex-1">{NOTIF_MATRIX.head.update}</p>
          {NOTIF_MATRIX.head.channels.map((c) => (
            <p key={c} className="w-[96px] shrink-0 text-center">
              {c}
            </p>
          ))}
        </div>
        {NOTIF_MATRIX.rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center border-t border-[rgba(28,42,33,0.08)] py-[12px] max-md:flex-col max-md:items-stretch max-md:gap-[10px]"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="leading-[18px] text-[15px] font-semibold text-[#1c2a21]">{row.title}</p>
              <p className="leading-[16px] text-[13px] text-[#595959] max-sm:text-[12px]">
                {row.desc}
              </p>
            </div>
            <div className="flex items-center max-md:justify-between">
              {NOTIF_MATRIX.head.channels.map((channel, col) => (
                <div key={channel} className={classNames(CELL, 'max-md:flex-col max-md:gap-[4px]')}>
                  <SettingsACheckbox
                    checked={paused ? false : matrix[row.id][col]}
                    disabled={paused}
                    label={`${row.title}, ${channel}`}
                    onChange={(v) => toggleCell(row.id, col, v)}
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

      <SettingsACard title={NOTIF_QUIET.title} desc={NOTIF_QUIET.desc}>
        <SettingsARow title={NOTIF_QUIET.rowTitle} desc={NOTIF_QUIET.rowDesc}>
          <SettingsAToggle
            on={quiet.on}
            label={NOTIF_QUIET.rowTitle}
            onChange={(v) => setQuiet((q) => ({ ...q, on: v }))}
          />
        </SettingsARow>
        <div className="flex flex-wrap items-center gap-[16px] pt-[4px] pb-[6px] max-sm:gap-[8px]">
          <TimePill
            value={quiet.from}
            label={`${NOTIF_QUIET.rowTitle}, from`}
            onChange={(from) => setQuiet((q) => ({ ...q, from }))}
          />
          <p className="text-[14px] leading-[17px] font-medium text-[#595959]">
            {NOTIF_QUIET.joiner}
          </p>
          <TimePill
            value={quiet.to}
            label={`${NOTIF_QUIET.rowTitle}, to`}
            onChange={(to) => setQuiet((q) => ({ ...q, to }))}
          />
        </div>
      </SettingsACard>

      <SettingsACard title={NOTIF_WEEKLY.title}>
        <SettingsARow title={NOTIF_WEEKLY.rowTitle} desc={NOTIF_WEEKLY.rowDesc} first>
          <SettingsAToggle on={weekly} label={NOTIF_WEEKLY.rowTitle} onChange={setWeekly} />
        </SettingsARow>
      </SettingsACard>

      <div className="flex flex-wrap items-center gap-[12px]">
        <SettingsALink
          tone="grey"
          onClick={() => {
            log('turn everything off for 24 hours');
            if (!paused) pause();
          }}
        >
          {NOTIF_ACTIONS.pause}
        </SettingsALink>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        {status ? (
          <p
            role={status.tone === 'error' ? 'alert' : 'status'}
            className={classNames('m-0 text-[14px] font-medium', status.tone === 'error' ? 'text-[#c0392b]' : 'text-[#387440]')}
          >
            {status.text}
          </p>
        ) : null}
        <Button variant="primary" size="sm" disabled={busy || paused} onClick={save}>
          {busy ? 'Saving…' : NOTIF_ACTIONS.save}
        </Button>
      </div>
    </>
  );
};

/* Live page whose notification settings failed to load: say so (never the drawn values in their place). */
const SettingsNotifications = ({ settings }) =>
  settings?.live && !settings.live.notifications ? (
    <p role="alert" className="m-0 rounded-[20px] bg-white p-[24px] text-[15px] font-medium text-[#c0392b]">
      Couldn’t load your notification settings. Refresh the page to try again.
    </p>
  ) : (
    <SettingsNotificationsBody settings={settings} />
  );

export default SettingsNotifications;
