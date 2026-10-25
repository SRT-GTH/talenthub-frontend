import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import { NOTIFY_CHANNELS, QUOTA_COST, REFRESH_STEPS } from '../data/queriesData.js';
import AgencyDialogShell from './AgencyDialogShell.jsx';
import {
  QueriesIconBell,
  QueriesIconClock,
  QueriesIconMail,
  QueriesIconPhone,
  QueriesIconSpark,
} from './queriesIcons.jsx';

/*
 * SaveQueryDialog — "Save this query · and refresh" (Figma 11.5.1c, 8597:392937 "Match alerts popover": 496 wide, #fffefc, 1px rgba(28,42,33,.1), r24, p22, gap 16,
 * on a #0b1a0f scrim at 35 %):
 *   head: title 24/30 600 + the "and refresh" sticker (#ebf1ec) + "Name it and we’ll rerun it on a schedule. ..."
 *   a #ebf1ec r18 card: "Refresh" + the big value ("Monthly", 28/35 600), a slider (track 8, knob 24 #ffd86b), the end labels and the white quota pill
 *   "TELL ME WHEN IT CHANGES" + three switches (In GTH · Email on, Push on my phone off) · the cap note · Cancel + "Save query"
 * Props: quotaUsedPct (number), name (suggested query name), onSave({ schedule, channels }), onClose.
 * ⚠️ ASSUMPTION: the frame draws no name field, so the query is saved under the name built from its filters (`name`).
 * ⚠️ Figma inconsistency kept: the knob is drawn at 35 % of the track while the value reads "Monthly" (the end labels say Weekly ... Monthly);
 * the slider keeps that: values under 35 mean Weekly, 35 and over mean Monthly.
 * Focus trap, Esc and focus return come from AgencyDialogShell; each switch is a role="switch" button.
 */

const Switch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={classNames(
      'flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border border-solid border-[#1c2a21]/[0.12] p-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      checked ? 'justify-end bg-[#387440]' : 'justify-start bg-[#e1eae2]'
    )}
  >
    <span className="size-[20px] rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-white" />
  </button>
);

const CHANNEL_ICON = {
  bell: QueriesIconBell,
  mail: QueriesIconMail,
  phone: QueriesIconPhone,
};

const SaveQueryDialog = ({ quotaUsedPct, onSave, onClose }) => {
  const [slider, setSlider] = useState(35);
  const [channels, setChannels] = useState({ gth: true, email: true, push: false });
  const step = slider >= 35 ? REFRESH_STEPS[1] : REFRESH_STEPS[0];

  return (
    <AgencyDialogShell
      title="Save this query"
      onClose={onClose}
      scrim="bg-[#0b1a0f]/[0.35]"
      className="mx-auto max-w-[496px]"
    >
      <div className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-[#fffefc] p-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.08),0_24px_64px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-[4px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h2 className="m-0 font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
              Save this query
            </h2>
            <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[11.5px] leading-[14px] font-bold text-[#1f4a2b] max-lg:text-[12px]">
              and refresh
            </span>
          </div>
          <p className="m-0 text-[13.5px] leading-[16px] text-[#595959]">
            Name it and we’ll rerun it on a schedule. Analysts on your team can open it too.
          </p>
        </div>
        <div className="flex flex-col gap-[16px] rounded-[18px] bg-[#ebf1ec] px-[16px] pt-[16px] pb-[14px]">
          <div className="flex items-center justify-between gap-[8px]">
            <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">Refresh</span>
            <span
              aria-live="polite"
              className="text-[28px] leading-[35px] font-semibold tracking-[-0.14px] text-[#1c2a21]"
            >
              {step.label}
            </span>
          </div>
          <div className="relative h-[24px]">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={slider}
              aria-label="Refresh schedule"
              aria-valuetext={step.hint}
              onChange={(e) => setSlider(Number(e.target.value))}
              data-autofocus=""
              className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-[8px] h-[8px] rounded-full border border-solid border-[#c1d4c4] bg-white"
            />
            <span
              aria-hidden="true"
              className="absolute top-[8px] left-0 h-[8px] rounded-full bg-[#387440]"
              style={{ width: `${slider}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-0 size-[24px] -translate-x-1/2 rounded-full border-[1.5px] border-solid border-[#1c2a21] bg-[#ffd86b] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440]"
              style={{ left: `${slider}%` }}
            />
          </div>
          <div className="flex justify-between gap-[8px] text-[12px] leading-[14px] font-medium text-[#595959]">
            <span>{REFRESH_STEPS[0].hint}</span>
            <span>{REFRESH_STEPS[1].hint}</span>
          </div>
          <div className="flex w-fit items-center gap-[6px] rounded-full bg-white px-[10px] py-[6px] text-[12.5px] leading-[15px] font-semibold text-[#2d5d33]">
            <QueriesIconSpark className="size-[13px] shrink-0" />
            <span>
              Each refresh uses {QUOTA_COST.save} query from your quota ({quotaUsedPct}% used).
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="m-0 text-[11.5px] leading-[14px] font-bold text-[#737373] max-lg:text-[12px]">
            TELL ME WHEN IT CHANGES
          </p>
          {NOTIFY_CHANNELS.map((c) => {
            const Icon = CHANNEL_ICON[c.icon];
            return (
              <div key={c.id} className="flex items-center gap-[12px] py-[10px]">
                <Icon className="size-[17px] shrink-0 text-[#2d5d33]" />
                <span className="min-w-0 flex-1 text-[14.5px] leading-[17px] font-medium text-[#1c2a21]">
                  {c.label}
                </span>
                <Switch
                  checked={channels[c.id]}
                  label={c.label}
                  onChange={(v) => setChannels((s) => ({ ...s, [c.id]: v }))}
                />
              </div>
            );
          })}
        </div>
        <p className="m-0 flex items-center gap-[8px] rounded-[14px] bg-[#f8f8f4] px-[12px] py-[10px] text-[12.5px] leading-[18px] text-[#595959]">
          <QueriesIconClock className="size-[15px] shrink-0" />
          We only notify you when a number moves by more than 5%.
        </p>
        <div className="flex gap-[10px]">
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={onClose}
            className={classNames(TERTIARY_BUTTON, 'flex-1')}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSave({ schedule: step, channels })}
            className={classNames(PRIMARY_BUTTON, 'flex-1')}
          >
            Save query
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default SaveQueryDialog;
