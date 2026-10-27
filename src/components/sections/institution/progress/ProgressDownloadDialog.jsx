import { useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { openApiFile } from '../../../../services/agency.api.js';
import { apiMessage, exportOutcomes } from '../../../../services/institutionPortal.api.js';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import {
  ProgressArrowrightIcon,
  ProgressChecksmallIcon,
  ProgressCloseIcon,
  ProgressInfoIcon,
} from './ProgressIcons.jsx';
import { DOWNLOAD_COPY as D, OUTCOMES_PAGE } from './data/progressData.js';

const log = debug('ProgressDownloadDialog');

/*
 * ProgressDownloadDialog — 11.3.2e "Download the class outcomes report" (Figma 8745:1157): chip, title, intro, option rows (readiness by form and
 * programme; student names, off by default and only for admins / records officers), the Period control and Cancel + "Download CSV →".
 * Live: POST /institution/progress/outcomes/export -> a CSV the browser saves; the export is logged in the audit log. The Figma PDF / "Prepared for"
 * cover line is left out: the printable board report is the Report page.
 * Props: period (initial), canNames, onClose().
 */

const ProgressDownloadDialog = ({ period: initial = 'year', canNames = false, onClose }) => {
  const [picked, setPicked] = useState(() =>
    Object.fromEntries(D.options.map((o) => [o.id, o.on]))
  );
  const [period, setPeriod] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const descId = useId();
  const options = D.options.filter((o) => o.id !== 'names' || canNames);

  const submit = async () => {
    setBusy(true);
    setMessage('');
    log('submit', { picked, period });
    try {
      const file = await exportOutcomes({
        period,
        readiness: picked.readiness,
        names: canNames && picked.names,
      });
      openApiFile(file);
      setMessage(`${file.fileName} is downloading. The export is logged.`);
      setTimeout(onClose, 1200);
    } catch (err) {
      setMessage(`That didn’t work: ${apiMessage(err)}`);
      setBusy(false);
    }
  };

  return (
    <AgencyDialogShell
      title={D.title}
      onClose={onClose}
      scrim="bg-[#0b1a0f]/55"
      describedBy={descId}
      className="mx-auto max-w-[820px]"
    >
      <div className="relative flex flex-col gap-[20px] rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white px-[clamp(20px,2.3vw,40px)] pt-[36px] pb-[32px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_24px_64px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={onClose}
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
          <div className="flex items-center gap-[12px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[14px] py-[12px]">
            <span
              aria-hidden="true"
              className="flex size-[20px] shrink-0 items-center justify-center rounded-[5px] border border-solid border-[#387440] bg-[#387440] text-white"
            >
              <ProgressChecksmallIcon className="size-[16px]" />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                Class snapshot
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#575755]">
                Applications, placements, skills evidenced and organisations (always included)
              </span>
            </span>
          </div>
          {options.map((o) => (
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
            {OUTCOMES_PAGE.periods.map((p) => {
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

        {message ? (
          <p
            role="status"
            className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#1c2a21]"
          >
            <ProgressInfoIcon className="mt-px size-[16px] shrink-0" />
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          <Button
            type="button"
            variant="tertiary-subtle"
            size="lg"
            onClick={onClose}
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
            {busy ? 'Preparing…' : D.submit}
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default ProgressDownloadDialog;
