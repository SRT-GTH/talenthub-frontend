import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, Select, TextInput } from '../../../ui/form';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AdminClose16Icon, AdminClose20Icon } from '../adminIcons.jsx';
import { BUILDING, CHOOSE, EXPORT_REQUEST } from './data/adminReportsData.js';

const log = debug('ReportDialogs');

/*
 * ReportDialogs — the dialogs of the Reports section.
 *  ChooseReportDialog (Figma 7.3.1b "Choose a report" 8635:547, 600 x 535, white, r24, scrim #121712 at 48 %): header 22/26 600 + 14 #595959 sub + 34 round close · three radio options
 *    (66 high, r14; the selected one #ebf1ec with a #387440 border) · "Date range" field · footer on a #e7e7e7 rule: Cancel (white) + "Generate report" (green).
 *  BuildingReportDialog (7.3.1c "Large report queued" 8635:1290, 560 x 369): "Building this report in the background" · a 10 high progress track (60 %) · "Step 2 of 4 ·
 *    Counting flags and decisions" · four steps (done = green dot, active = bold, next = grey) · Cancel.
 *  ExportRequestDialog (7.3.2a 8635:2057, the talent "Add a certification" modal: 820 wide, r28, p 40/36/40/32, 1px ink, scrim #0b1a0f at 55 %): chip · title 32/38 600 (the
 *    second half green) · sub · dashed upload strip with "Attach letter" · "export details" divider · four rows of two fields · the "No individual data" checkbox · Cancel + "Send for approval".
 * ⚠️ ASSUMPTION: "Generate report" for Platform health opens the health report, for the other two it queues the background build; the letter upload is local (no file flow).
 */

const BTN_WHITE =
  'inline-flex h-[48px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[22px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const BTN_GREEN =
  'inline-flex h-[48px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const ChooseReportDialog = ({ onClose, onGenerate }) => {
  const [choice, setChoice] = useState(CHOOSE.options[0].id);
  return (
    <AgencyDialog
      label={CHOOSE.title}
      onClose={onClose}
      scrimClassName="bg-[#121712]/48"
      panelClassName="w-[min(600px,calc(100vw-32px))]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate(choice);
        }}
        className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-start gap-[8px] px-[28px] pt-[24px] pb-[8px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
              {CHOOSE.title}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{CHOOSE.sub}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f2f2ee] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AdminClose16Icon className="size-[16px]" />
          </button>
        </div>
        <fieldset className="m-0 flex flex-col gap-[16px] border-0 px-[28px] pt-[16px] pb-[20px]">
          <legend className="sr-only">Report</legend>
          {CHOOSE.options.map((o) => {
            const on = choice === o.id;
            return (
              <label
                key={o.id}
                className={classNames(
                  'flex cursor-pointer items-center gap-[14px] rounded-[14px] border border-solid px-[16px] py-[14px]',
                  on ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#e7e7e7] bg-white'
                )}
              >
                <input
                  type="radio"
                  name="report"
                  value={o.id}
                  checked={on}
                  onChange={() => setChoice(o.id)}
                  className="size-[20px] shrink-0 cursor-pointer accent-[#387440]"
                />
                <span className="flex flex-col gap-[2px]">
                  <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {o.title}
                  </span>
                  <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                    {o.sub}
                  </span>
                </span>
              </label>
            );
          })}
          <div className="flex flex-col gap-[6px]">
            <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
              {CHOOSE.rangeLabel}
            </span>
            <button
              type="button"
              onClick={() => log('date range (no picker drawn)')}
              className="flex h-[44px] cursor-pointer items-center justify-between gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] text-left font-sans text-[15px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {CHOOSE.range}
              <span className="text-[13px] font-medium text-[#595959]">{CHOOSE.rangeNote}</span>
            </button>
          </div>
        </fieldset>
        <div className="flex items-center justify-end gap-[12px] border-t border-solid border-[#e7e7e7] px-[28px] py-[18px]">
          <button type="button" onClick={onClose} className={BTN_WHITE}>
            {CHOOSE.cancel}
          </button>
          <button type="submit" data-autofocus className={BTN_GREEN}>
            {CHOOSE.primary}
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};

export const BuildingReportDialog = ({ onClose }) => (
  <AgencyDialog
    label={BUILDING.title}
    onClose={onClose}
    scrimClassName="bg-[#121712]/48"
    panelClassName="w-[min(560px,calc(100vw-32px))]"
  >
    <div className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <div className="flex items-start gap-[8px] px-[28px] pt-[24px] pb-[8px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            {BUILDING.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{BUILDING.sub}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f2f2ee] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminClose16Icon className="size-[16px]" />
        </button>
      </div>
      <div className="flex flex-col gap-[16px] px-[28px] pt-[16px] pb-[20px]">
        <div className="flex flex-col gap-[8px]">
          <div
            role="progressbar"
            aria-label="Report progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(BUILDING.progress * 100)}
            className="h-[10px] overflow-hidden rounded-[6px] bg-[#efefea]"
          >
            <span
              className="block h-full rounded-[6px] bg-[#387440]"
              style={{ width: `${BUILDING.progress * 100}%` }}
            />
          </div>
          <p className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            {BUILDING.progressText}
          </p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {BUILDING.steps.map((s) => (
            <li
              key={s.label}
              className={classNames(
                'flex items-center gap-[10px] font-sans text-[14px] leading-[17px]',
                s.state === 'next' ? 'font-medium text-[#595959]' : 'text-[#1c2a21]',
                s.state === 'active' ? 'font-semibold' : 'font-medium'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'size-[16px] shrink-0 rounded-full border border-solid',
                  s.state === 'done'
                    ? 'border-[#387440] bg-[#387440]'
                    : s.state === 'active'
                      ? 'border-[#387440] bg-[#c1d4c4]'
                      : 'border-[#c1d4c4] bg-white'
                )}
              />
              {s.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-end border-t border-solid border-[#e7e7e7] px-[28px] py-[18px]">
        <button type="button" data-autofocus onClick={onClose} className={BTN_WHITE}>
          {BUILDING.cancel}
        </button>
      </div>
    </div>
  </AgencyDialog>
);

export const ExportRequestDialog = ({ onClose, onSubmit }) => {
  const f = EXPORT_REQUEST.fields;
  const [org, setOrg] = useState(f.organisation.value);
  const [dataset, setDataset] = useState(f.dataset.value);
  const [level, setLevel] = useState(f.level.options[0]);
  const [reference, setReference] = useState(f.reference.value);
  const [from, setFrom] = useState(f.from.value);
  const [to, setTo] = useState(f.to.value);
  const [approver, setApprover] = useState(f.approver.value);
  const [purpose, setPurpose] = useState(f.purpose.value);
  const [noData, setNoData] = useState(false);
  const [letter, setLetter] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    log('send for approval', { level, noData, letter });
    onSubmit({ level });
  };

  return (
    <AgencyDialog
      label="External data export request"
      onClose={onClose}
      scrimClassName="bg-[#0b1a0f]/55"
      panelClassName="w-[min(820px,calc(100vw-32px))]"
    >
      <form
        onSubmit={submit}
        className="relative flex flex-col gap-[20px] rounded-[28px] border border-solid border-[#1c2a21] bg-white px-[clamp(18px,2.1vw,36px)] pt-[clamp(24px,2.3vw,40px)] pb-[clamp(18px,1.85vw,32px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-[24px] right-[24px] grid size-[40px] cursor-pointer place-items-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminClose20Icon className="size-[20px]" />
        </button>
        <header className="flex flex-col items-start gap-[8px] pr-[48px]">
          <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
            {EXPORT_REQUEST.chip}
          </span>
          <h2 className="m-0 font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
            For a formal{' '}
            <span className="text-[#387440]">request from an authorised organisation.</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {EXPORT_REQUEST.sub}
          </p>
        </header>
        <div className="flex flex-wrap items-center gap-[16px] rounded-[16px] border border-dashed border-[#387440] bg-[#ebf1ec] p-[18px]">
          <span className="grid size-[56px] shrink-0 place-items-center rounded-[16px] border border-solid border-[#1c2a21] bg-white text-[#387440]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-[24px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V5m0 0l-4 4m4-4l4 4M5 16v2.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V16" />
            </svg>
          </span>
          <div className="flex min-w-[200px] flex-1 flex-col gap-[3px]">
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {letter ? 'Request letter attached' : EXPORT_REQUEST.upload.title}
            </p>
            <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
              {EXPORT_REQUEST.upload.sub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLetter(true)}
            className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {EXPORT_REQUEST.upload.action}
          </button>
        </div>
        <div className="flex items-center gap-[12px]" aria-hidden="true">
          <span className="h-px flex-1 bg-[#e7e7e7]" />
          <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
            {EXPORT_REQUEST.divider}
          </span>
          <span className="h-px flex-1 bg-[#e7e7e7]" />
        </div>
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
          <TextInput
            label={f.organisation.label}
            required
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />
          <TextInput
            label={f.dataset.label}
            required
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
          />
          <Select
            label={f.level.label}
            required
            options={f.level.options}
            value={level}
            onChange={setLevel}
          />
          <TextInput
            label={f.reference.label}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <TextInput
            label={f.from.label}
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <TextInput
            label={f.to.label}
            optional
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <TextInput
            label={f.approver.label}
            optional
            value={approver}
            onChange={(e) => setApprover(e.target.value)}
          />
          <TextInput
            label={f.purpose.label}
            optional
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>
        <Checkbox
          label={EXPORT_REQUEST.check}
          checked={noData}
          onChange={(e) => setNoData(e.target.checked)}
          labelClassName="text-[14px] font-medium text-[#1c2a21]"
        />
        <div className="flex items-center justify-end gap-[12px] pt-[4px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {EXPORT_REQUEST.cancel}
          </button>
          <button
            type="submit"
            data-autofocus
            className="inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {EXPORT_REQUEST.primary}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};
