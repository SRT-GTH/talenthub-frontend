import { classNames } from '../../../../utils/classNames.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AdminClose18Icon } from '../adminIcons.jsx';
import { SENDING } from './data/adminCommsData.js';

/*
 * SendingDialog — "Sending to 212,940 people" (Figma 7.4.2e "Modal · Building your PDF…" 8638:3190, 560 x 389, white, r24, scrim #121712 at 48 %, no border): header (p 28/24/28/8) with the
 * 22/600 title, the 14 #595959 line and a 34 round close · body (p 28/16/28/20): 504 x 10 track with the green fill, "Batch 1 of 18" 13/500, four steps (done = solid green dot,
 * active = a lighter dot with 600 text, next = empty ring + #595959) · footer (1px #e7e7e7 rule, p 28/18) with the white "Pause sending" button.
 * Props: onClose(), onPause(). ⚠️ ASSUMPTION: the sample progress is static; "Pause sending" only closes the dialog (no paused state is drawn).
 */

const Dot = ({ state }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'box-border size-[16px] shrink-0 rounded-full',
      state === 'done' && 'bg-[#387440]',
      state === 'active' && 'border-[3px] border-solid border-[#a9c9ae] bg-[#d3e6d6]',
      state === 'next' && 'border border-solid border-[#bfbfbf] bg-white'
    )}
  />
);

const SendingDialog = ({ onClose, onPause }) => (
  <AgencyDialog
    label={SENDING.title}
    onClose={onClose}
    scrimClassName="bg-[#121712]/[0.48]"
    panelClassName="w-[min(560px,calc(100vw-32px))]"
  >
    <div className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <div className="flex items-start gap-[8px] px-[28px] pt-[24px] pb-[8px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            {SENDING.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{SENDING.sub}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f2f2ee] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminClose18Icon className="size-[18px]" />
        </button>
      </div>
      <div className="flex flex-col gap-[16px] px-[28px] pt-[16px] pb-[20px]">
        <div className="flex flex-col gap-[8px]">
          <span
            role="progressbar"
            aria-label="Sending progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(SENDING.fill * 100)}
            className="block h-[10px] overflow-hidden rounded-[6px] bg-[#efefea]"
          >
            <span
              className="block h-full rounded-[6px] bg-[#387440]"
              style={{ width: `${SENDING.fill * 100}%` }}
            />
          </span>
          <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            {SENDING.batch}
          </span>
        </div>
        <ol className="m-0 flex list-none flex-col gap-[16px] p-0">
          {SENDING.steps.map((s) => (
            <li
              key={s.id}
              className={classNames(
                'flex items-center gap-[10px] font-sans text-[14px] leading-[17px]',
                s.state === 'next' ? 'font-medium text-[#595959]' : 'text-[#1c2a21]',
                s.state === 'active' ? 'font-semibold' : s.state === 'done' ? 'font-medium' : ''
              )}
            >
              <Dot state={s.state} />
              {s.label}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex justify-end border-t border-solid border-[#e7e7e7] px-[28px] py-[18px]">
        <button
          type="button"
          data-autofocus
          onClick={onPause}
          className="inline-flex h-[48px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[22px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {SENDING.pause}
        </button>
      </div>
    </div>
  </AgencyDialog>
);

export default SendingDialog;
