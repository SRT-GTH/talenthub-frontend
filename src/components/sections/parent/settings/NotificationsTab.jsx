import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SettingsAChevronDownIcon, SettingsAClockIcon } from '../../../shared/assets.jsx';
import { SettingsACheckbox } from '../../talentSettings/SettingsAUi.jsx';
import { GroupCard, SettingRow, SettingsToggle } from '../../talentSettings/SettingsBUi.jsx';
import LiveSaveStatus from '../../talentSettings/LiveSaveStatus.jsx';
import { useSaveAction } from '../../talentSettings/useSaveAction.js';
import Button from '../../../ui/Button.jsx';
import { NOTIFICATIONS } from './data/settingsData.js';

const log = debug('SettingsNotificationsTab');

const CELL = 'flex w-[96px] shrink-0 items-center justify-center max-md:w-auto max-md:flex-1';

// Hourly 12-hour options for the quiet-hours pickers ("10:00 pm", "7:00 am").
const TIMES = Array.from(
  { length: 24 },
  (_, h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? 'am' : 'pm'}`
);

// Figma "time · 10:00 pm": white pill, 12 radius, #1c2a21 at 10 % hairline, clock + 15/600 label + chevron. A native <select> sits over it so it stays keyboard friendly.
const TimePill = ({ value, onChange, label }) => (
  <label className="relative flex cursor-pointer items-center gap-[8px] rounded-[12px] border border-[rgba(28,42,33,0.1)] bg-white px-[14px] py-[10px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
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
 * NotificationsTab — PS-03 "Settings · Notifications (parent)" (Figma 10046:2778): the seven-row update × channel matrix (In GTH / Email / SMS / WhatsApp), Quiet hours (a switch and two time
 * pickers), Weekly summary (a switch), then "Turn everything off for 24 hours" and Save changes. Local state; Save only logs.
 * Demo: "Turn everything off for 24 hours" and Save show a status line only (the paused state is not drawn in the parent canvas; the talent Settings draw one, ST-03b).
 * Live (signed-in parent, settings.live.notifications): GET / PUT /settings/notifications, the endpoint the talent Settings use ({ rows: { id: [inApp, email,
 * sms, whatsapp] }, quiet: { on, from, to }, weekly, pause }). The parent row ids (approvals, milestones, flags, activity, links, turning18, news) are sent as
 * they are; rows the server has no value for start from the drawn defaults. 🔶 LIKELY: whether the backend keeps parent row ids needs a signed-in parent check.
 */
const NotificationsTab = ({ settings }) => {
  const { matrix, quiet, weekly, pauseAll, save } = NOTIFICATIONS;
  const ln = settings?.live?.notifications || null;
  const live = ln ? settings.live : null;
  const [cells, setCells] = useState(() =>
    Object.fromEntries(
      matrix.rows.map((r) => [
        r.id,
        Array.isArray(ln?.rows?.[r.id]) && ln.rows[r.id].length === 4
          ? [...ln.rows[r.id]]
          : [...r.on],
      ])
    )
  );
  const [quietOn, setQuietOn] = useState(ln?.quiet ? Boolean(ln.quiet.on) : true);
  const [from, setFrom] = useState(ln?.quiet?.from || quiet.from);
  const [to, setTo] = useState(ln?.quiet?.to || quiet.to);
  const [weeklyOn, setWeeklyOn] = useState(typeof ln?.weekly === 'boolean' ? ln.weekly : true);
  const { busy, status, setStatus, run } = useSaveAction();
  const paused = Boolean(ln?.pausedUntil);

  const send = (body, okText) => {
    if (!live) {
      log('demo save (nothing sent)', Object.keys(body));
      setStatus({ tone: 'ok', text: okText });
      return;
    }
    log('save notifications', Object.keys(body));
    run(() => live.saveNotifications(body), okText);
  };

  const toggleCell = (rowId, col, v) => {
    log('cell', { rowId, channel: matrix.channels[col], on: v });
    setCells((c) => ({ ...c, [rowId]: c[rowId].map((x, i) => (i === col ? v : x)) }));
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="notifications">
      <GroupCard title={matrix.title} description={matrix.desc}>
        <div className="flex w-full items-center py-[10px] max-md:hidden">
          <span className="min-w-0 flex-1 text-[12.5px] leading-[15px] font-semibold text-[#595959]">
            {matrix.update}
          </span>
          {matrix.channels.map((c) => (
            <span
              key={c}
              className={`${CELL} text-[12.5px] leading-[15px] font-semibold text-[#595959]`}
            >
              {c}
            </span>
          ))}
        </div>
        {matrix.rows.map((r) => (
          <div
            key={r.id}
            className="flex w-full items-center gap-[12px] border-t border-[rgba(28,42,33,0.08)] py-[12px] max-md:flex-wrap"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-[2px] max-md:basis-full">
              <p className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">{r.title}</p>
              <p className="text-[13px] leading-[16px] text-[#595959]">{r.desc}</p>
            </div>
            {matrix.channels.map((c, i) => (
              <span key={c} className={`${CELL} max-md:flex-col max-md:gap-[6px]`}>
                <SettingsACheckbox
                  checked={cells[r.id][i]}
                  onChange={(v) => toggleCell(r.id, i, v)}
                  label={`${r.title}: ${c}`}
                />
                <span className="hidden text-[12px] leading-[15px] text-[#595959] max-md:block">
                  {c}
                </span>
              </span>
            ))}
          </div>
        ))}
      </GroupCard>

      <GroupCard title={quiet.title} description={quiet.desc}>
        <SettingRow
          top
          title={quiet.row}
          titleId="notif-quiet"
          description={quiet.rowDesc}
          control={
            <SettingsToggle labelledBy="notif-quiet" checked={quietOn} onChange={setQuietOn} />
          }
        />
        <div className="flex w-full flex-wrap items-center gap-[16px] pt-[4px] pb-[6px]">
          <TimePill value={from} onChange={setFrom} label="Quiet hours start" />
          <span className="text-[14px] leading-[17px] font-medium text-[#595959]">
            {quiet.toWord}
          </span>
          <TimePill value={to} onChange={setTo} label="Quiet hours end" />
        </div>
      </GroupCard>

      <GroupCard title={weekly.title}>
        <SettingRow
          top={false}
          title={weekly.row}
          titleId="notif-weekly"
          description={weekly.rowDesc}
          control={
            <SettingsToggle labelledBy="notif-weekly" checked={weeklyOn} onChange={setWeeklyOn} />
          }
        />
      </GroupCard>

      <div className="flex items-center justify-between gap-[12px] max-sm:flex-wrap">
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            paused
              ? send({ pause: false }, 'Notifications are back on')
              : send({ pause: true }, 'Paused for 24 hours')
          }
          className="cursor-pointer text-[14px] leading-[17px] font-semibold text-[#595959] underline decoration-solid decoration-from-font focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {paused ? 'Resume now' : pauseAll}
        </button>
        <LiveSaveStatus status={status} className="mr-auto" />
        <Button
          size="sm"
          disabled={busy}
          onClick={() =>
            send({ rows: cells, quiet: { on: quietOn, from, to }, weekly: weeklyOn }, 'Saved')
          }
        >
          {busy ? 'Saving…' : save}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
