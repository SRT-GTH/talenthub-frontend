import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { TERTIARY_BUTTON } from './shareButtonClasses.js';
import ShareDialogShell from './ShareDialogShell.jsx';
import { DOWNLOAD_STEPS } from './data/shareData.js';

/*
 * DownloadProgressDialog — Figma 8.8.1e "Building your PDF…" (8504:482): progress track (10px, #efefea / #387440), "Step n of 4 · …",
 * four steps (done = green dot, current = light-green dot with green ring + semibold, pending = white dot with grey ring) and Cancel.
 * The build is MOCKED (a timer in DownloadDialog): a real PDF needs a backend.
 * Props: progress (0–1), onCancel().
 */

const DownloadProgressDialog = ({ progress, onCancel }) => {
  const current = Math.min(DOWNLOAD_STEPS.length - 1, Math.floor(progress * DOWNLOAD_STEPS.length));
  const percent = Math.round(progress * 100);
  return (
    <ShareDialogShell
      title="Building your PDF…"
      description="This usually takes under 10 seconds. You can keep browsing; we’ll download it when it’s ready."
      onClose={onCancel}
      width={560}
      footer={
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={onCancel}
          className={TERTIARY_BUTTON}
        >
          Cancel
        </Button>
      }
    >
      <div className="flex flex-col gap-[8px]">
        <div
          role="progressbar"
          aria-label="PDF progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-[10px] w-full overflow-hidden rounded-[6px] bg-[#efefea]"
        >
          <div
            className="h-full rounded-[6px] bg-[#387440] transition-[width] duration-200 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p
          role="status"
          className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
        >
          Step {current + 1} of {DOWNLOAD_STEPS.length} · {DOWNLOAD_STEPS[current]}
        </p>
      </div>
      <ol className="m-0 flex list-none flex-col gap-[16px] p-0">
        {DOWNLOAD_STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step} className="flex items-center gap-[10px]">
              <span
                aria-hidden="true"
                className={classNames(
                  'size-[16px] shrink-0 rounded-full border-[1.5px] border-solid',
                  done && 'border-[#387440] bg-[#387440]',
                  active && 'border-[#387440] bg-[#c1d4c4]',
                  !done && !active && 'border-[#b5b5b1] bg-white'
                )}
              />
              <span
                className={classNames(
                  'font-sans text-[14px] leading-[17px]',
                  active ? 'font-semibold text-[#1c2a21]' : 'font-medium',
                  done && 'text-[#1c2a21]',
                  !done && !active && 'text-[#595959]'
                )}
              >
                {step}
                <span className="sr-only">{done ? ' (done)' : active ? ' (in progress)' : ''}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </ShareDialogShell>
  );
};

export default DownloadProgressDialog;
