import { useState } from 'react';
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
import InstitutionTimePill from './InstitutionTimePill.jsx';
import { NOTIF_CHANNELS, NOTIF_QUIET, NOTIF_ROWS, TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionNotificationsTab');

const CELL = 'flex w-[96px] shrink-0 items-center justify-center max-md:w-auto max-md:flex-1';

/*
 * InstitutionNotificationsTab — Figma 11.6.1c (8597:396863): channel matrix (In GTH · Email · SMS · WhatsApp), quiet hours, weekly summary switch,
 * "Turn everything off for 24 hours" and Save changes. All state is local; Save shows a toast, the link switches every box off (Undo restores).
 * ⚠️ ASSUMPTION: the "off for 24 hours" link only clears the choices in this mock (no timer). Props: onToast(toast, onUndo?).
 */
const InstitutionNotificationsTab = ({ onToast }) => {
  const [matrix, setMatrix] = useState(() =>
    Object.fromEntries(NOTIF_ROWS.map((r) => [r.id, [...r.on]]))
  );
  const [quiet, setQuiet] = useState({ on: true, ...NOTIF_QUIET });
  const [weekly, setWeekly] = useState(true);

  const toggle = (id, col, v) => {
    log('cell', { id, col, v });
    setMatrix((m) => ({ ...m, [id]: m[id].map((x, i) => (i === col ? v : x)) }));
  };

  const muteAll = () => {
    const before = { matrix, quiet, weekly };
    log('everything off');
    setMatrix(Object.fromEntries(NOTIF_ROWS.map((r) => [r.id, r.on.map(() => false)])));
    setWeekly(false);
    onToast({ ...TOASTS.muted, undo: true }, () => {
      setMatrix(before.matrix);
      setQuiet(before.quiet);
      setWeekly(before.weekly);
    });
  };

  return (
    <>
      <SettingsACard
        title="What we tell you about"
        desc="Pick where each update reaches your team."
      >
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
        desc="We hold everything except revocations until morning."
      >
        <SettingsARow first title="Quiet hours on" desc="Every day">
          <SettingsAToggle
            on={quiet.on}
            label="Quiet hours on"
            onChange={(v) => setQuiet((q) => ({ ...q, on: v }))}
          />
        </SettingsARow>
        <div className="flex flex-wrap items-center gap-[16px] pt-[4px] pb-[6px]">
          <InstitutionTimePill
            value={quiet.from}
            label="Quiet hours from"
            onChange={(from) => setQuiet((q) => ({ ...q, from }))}
          />
          <p className="m-0 text-[14px] leading-[17px] font-medium text-[#595959]">to</p>
          <InstitutionTimePill
            value={quiet.to}
            label="Quiet hours to"
            onChange={(to) => setQuiet((q) => ({ ...q, to }))}
          />
        </div>
      </SettingsACard>

      <SettingsACard title="Weekly summary">
        <SettingsARow
          first
          title="Your school’s week"
          desc="Records waiting, new links and programme sign-ups, every Monday."
        >
          <SettingsAToggle on={weekly} label="Your school’s week" onChange={setWeekly} />
        </SettingsARow>
      </SettingsACard>

      <div className="flex flex-wrap items-center gap-[12px]">
        <SettingsALink tone="grey" onClick={muteAll}>
          Turn everything off for 24 hours
        </SettingsALink>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <Button variant="primary" size="sm" onClick={() => onToast(TOASTS.saved)}>
          Save changes
        </Button>
      </div>
    </>
  );
};

export default InstitutionNotificationsTab;
