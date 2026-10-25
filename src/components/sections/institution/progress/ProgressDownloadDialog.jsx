import { useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import {
  ProgressArrowrightIcon,
  ProgressChecksmallIcon,
  ProgressCloseIcon,
  ProgressInfoIcon,
} from './ProgressIcons.jsx';
import { DOWNLOAD_COPY as D, requestOutcomesReport } from './data/progressData.js';

const log = debug('ProgressDownloadDialog');

/*
 * ProgressDownloadDialog — 11.3.2e "Download the class outcomes report" (Figma 8745:1157, 820x666, r28, p 36/40/32/40, on the #0b1a0f scrim at 55 %):
 * chip "Outcomes report", title 32/38 600, intro 15/22, four option rows (checkbox + label 14/17 600 + hint 12/14; names are off by default), the "Period"
 * segmented control (This term · This year · Class of 2026 · Custom) and the "Prepared for" note, then Cancel + "Download PDF →"; 40px round close top right.
 * Submit runs the MOCK PDF job (POST /institution/progress/outcomes-reports, announced in an aria-live line) and then onDone() opens the 8-page A4
 * board report with the print dialog. ⚠️ ASSUMPTION: a real PDF needs the backend; no progress / failure state is drawn.
 * Props: onClose(), onDone().
 */

const ProgressDownloadDialog = ({ onClose, onDone }) => {
  const [picked, setPicked] = useState(() =>
    Object.fromEntries(D.options.map((o) => [o.id, o.on]))
  );
  const [period, setPeriod] = useState('class');
  const [busy, setBusy] = useState(false);
  const runRef = useRef(0);
  const descId = useId();

  const submit = () => {
    const run = ++runRef.current;
    setBusy(true);
    log('submit', { picked, period });
    requestOutcomesReport({ picked, period }).then(() => {
      if (runRef.current === run) onDone();
    });
  };
  const cancel = () => {
    runRef.current += 1;
    onClose();
  };

  return (
    <AgencyDialogShell
      title={D.title}
      onClose={cancel}
      scrim="bg-[#0b1a0f]/55"
      describedBy={descId}
      className="mx-auto max-w-[820px]"
    >
      <div className="relative flex flex-col gap-[20px] rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white px-[clamp(20px,2.3vw,40px)] pt-[36px] pb-[32px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_24px_64px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={cancel}
          aria-label="Close"
          className="absolute top-[24px] right-[24px] flex size-[40px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <ProgressCloseIcon className="size-[16px]" />
        </button>
        <div className="flex flex-col items-start gap-[8px] pr-[48px]">
          <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
            {D.chip}
          </span>
          <h2 className="m-0 font-sans text-[26px] leading-[32px] font-semibold text-[#1c2a21] md:text-[32px] md:leading-[38px]">
            {D.title}
          </h2>
          <p id={descId} className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {D.body}
          </p>
        </div>

        <fieldset className="m-0 flex min-w-0 flex-col gap-[16px] border-0 p-0">
          <legend className="sr-only">What to include</legend>
          {D.options.map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid border-[#e7e7e7] px-[14px] py-[12px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#387440]"
            >
              <input
                type="checkbox"
                checked={picked[o.id]}
                onChange={(event) => setPicked((p) => ({ ...p, [o.id]: event.target.checked }))}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  'flex size-[20px] shrink-0 items-center justify-center rounded-[5px] border border-solid text-white',
                  picked[o.id] ? 'border-[#387440] bg-[#387440]' : 'border-[#babab7] bg-white'
                )}
              >
                {picked[o.id] ? <ProgressChecksmallIcon className="size-[16px]" /> : null}
              </span>
              <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {o.label}
                </span>
                <span className="font-sans text-[12px] leading-[14px] text-[#575755]">
                  {o.detail}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex flex-wrap items-center gap-[10px]">
          <span className="font-sans text-[13px] leading-[16px] text-[#575755]">
            {D.periodLabel}
          </span>
          <div
            role="radiogroup"
            aria-label={D.periodLabel}
            className="flex flex-wrap gap-[2px] rounded-[10px] bg-[#efefea] p-[3px]"
          >
            {D.periods.map((p) => {
              const on = p.id === period;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPeriod(p.id)}
                  className={classNames(
                    'cursor-pointer rounded-[8px] border-0 px-[12px] py-[6px] font-sans text-[13px] leading-[16px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
                    on
                      ? 'bg-white font-semibold text-[#1c2a21] shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                      : 'bg-transparent font-medium text-[#575755]'
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
          <ProgressInfoIcon className="mt-px size-[16px] shrink-0" />
          {D.note}
        </p>

        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          <Button
            type="button"
            variant="tertiary-subtle"
            size="lg"
            onClick={cancel}
            data-autofocus=""
          >
            {D.cancel}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={busy}
            rightIcon={<ProgressArrowrightIcon className="size-[20px]" />}
            onClick={submit}
          >
            {D.submit}
          </Button>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {busy ? 'Preparing the PDF' : ''}
        </p>
      </div>
    </AgencyDialogShell>
  );
};

export default ProgressDownloadDialog;
