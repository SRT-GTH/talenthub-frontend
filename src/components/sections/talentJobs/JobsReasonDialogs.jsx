import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  JobsEyeOffGlyph,
  JobsFlagGlyph,
  JobsLockGlyph,
  JobsShieldGlyph,
  JobsUndoGlyph,
} from './JobsDialogIcons.jsx';
import {
  ActionButton,
  DialogActions,
  DialogClose,
  DialogFrame,
  ReasonChip,
} from './JobsDialogParts.jsx';
import { FOCUS_RING, HEADING, fill, findJob, useMount } from './jobsDialogUtils.js';
import { JOB_DIALOGS, JOBS_LIVE } from './talentJobsData.js';

const log = debug('JobsReasonDialogs');

const MODAL_CARD =
  'max-w-[540px] gap-[16px] rounded-[28px] px-[clamp(16px,1.62vw,28px)] py-[clamp(18px,1.5vw,26px)]';

// Yellow tile with an ink glyph (J-17 flag 48px / J-20 undo 57px).
const IconTile = ({ className, children }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'flex shrink-0 items-center justify-center bg-[#ffd86b] text-[#1c2a21] playful:-rotate-[6deg]',
      'border border-solid border-[rgba(28,42,33,0.1)]',
      'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
      className
    )}
  >
    {children}
  </span>
);

/*
 * NotForMeDialog — J-16 "Not for you?" (Playful 7511:2457 / Focused 8110:417137), over the Matched list.
 * Multi-select reasons (the frame shows two ticked), Hide closes. Job = `jobs.job` or the Hubtel BI Intern
 * the frame uses. Mock only: nothing is persisted, the list is not filtered.
 */
export const NotForMeDialog = ({ jobs }) => {
  const copy = JOB_DIALOGS.notForMe;
  const uid = useId();
  const job = findJob(jobs.dismiss ?? jobs.job, copy.defaultJob);
  const [picked, setPicked] = useState(() => new Set(copy.selected));
  const close = () => jobs.update({ modal: null, dismiss: null });
  useMount('NotForMeDialog', { job: job.id });

  const toggle = (id) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      log('reason', id, next.has(id));
      return next;
    });

  return (
    <DialogFrame kind="modal" onClose={close} labelId={`${uid}-title`} cardClassName={MODAL_CARD}>
      <div className="flex items-center gap-[10px]">
        <h2
          id={`${uid}-title`}
          className={classNames(
            HEADING,
            'm-0 min-w-0 flex-1 text-[27px] font-semibold leading-[32px] text-[#1c2a21]'
          )}
        >
          {copy.title}
        </h2>
        <DialogClose onClose={close} label={copy.closeLabel} />
      </div>
      <div className="flex w-fit max-w-full items-center gap-[10px] rounded-[14px] bg-[#f8f8f4] py-[10px] pl-[10px] pr-[12px]">
        {job.company.logo && (
          <img src={job.company.logo} alt="" className="size-[32px] shrink-0 rounded-[10px]" />
        )}
        <span className="min-w-0 font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {`${job.title} · ${job.company.name} · ${job.match}% match`}
        </span>
      </div>
      <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">{copy.prompt}</p>
      <div
        className="flex flex-wrap gap-x-[8px] gap-y-[12px] playful:gap-y-[9px] playful:py-[2.5px]"
        role="group"
        aria-label={copy.prompt}
      >
        {copy.reasons.map((r) => (
          <ReasonChip key={r.id} selected={picked.has(r.id)} onToggle={() => toggle(r.id)}>
            {r.label}
          </ReasonChip>
        ))}
      </div>
      <div className="flex items-center gap-[10px] rounded-[16px] bg-[#ebf1ec] px-[14px] py-[12px]">
        <JobsEyeOffGlyph className="size-[17px] shrink-0 text-[#2d5d33]" />
        <p className="m-0 font-sans text-[13px] font-medium leading-[16px] text-[#2d5d33] max-lg:text-[12px]">
          {fill(copy.info, { company: job.company.name })}
        </p>
      </div>
      <DialogActions pad="playful:py-[6px]">
        <ActionButton onClick={close}>{copy.cancel}</ActionButton>
        <ActionButton
          variant="primary"
          onClick={() => {
            log('hide match', { job: job.id, reasons: Array.from(picked) });
            jobs.update({
              modal: null,
              dismiss: null,
              hidden: [...jobs.hidden, job.id].join(','),
            });
          }}
        >
          {copy.confirm}
        </ActionButton>
      </DialogActions>
    </DialogFrame>
  );
};

/*
 * ReportDialog — J-17 "Report this posting" (Playful 7511:2948 / Focused 8110:417571), over the job detail
 * (the frame sits on the confidential Junior Product Analyst). Single-select radios (first ticked), optional
 * details, Send closes. Mock only.
 */
export const ReportDialog = ({ jobs }) => {
  const copy = JOB_DIALOGS.report;
  const uid = useId();
  const job = findJob(jobs.job, copy.defaultJob);
  const [reason, setReason] = useState(copy.selected);
  const [details, setDetails] = useState('');
  const close = () => jobs.update({ modal: null });
  useMount('ReportDialog', { job: job.id });

  return (
    <DialogFrame
      kind="modal"
      onClose={close}
      labelId={`${uid}-title`}
      cardClassName={classNames(MODAL_CARD, 'max-w-[560px]')}
    >
      <div className="flex items-center gap-[10px]">
        <IconTile className="size-[48px] rounded-[14px]">
          <JobsFlagGlyph className="size-[22px]" />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <h2
            id={`${uid}-title`}
            className={classNames(
              HEADING,
              'm-0 text-[25px] font-semibold leading-[30px] text-[#1c2a21]'
            )}
          >
            {copy.title}
          </h2>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[12px]">
            {`${job.title} · ${job.company.name}`}
          </p>
        </div>
      </div>
      <div
        role="radiogroup"
        aria-labelledby={`${uid}-title`}
        className="flex flex-col gap-[12px] playful:gap-[8px]"
      >
        {copy.reasons.map((r) => {
          const on = reason === r.id;
          return (
            <label
              key={r.id}
              className={classNames(
                'flex cursor-pointer items-center gap-[10px] rounded-[14px] border border-solid px-[14px] py-[12px] font-sans text-[14px] leading-[17px] text-[#1c2a21] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-green',
                on
                  ? 'border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] font-semibold shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
                  : 'border-[#e1eae2] bg-white font-medium'
              )}
            >
              <input
                type="radio"
                name={`${uid}-reason`}
                value={r.id}
                checked={on}
                onChange={() => {
                  log('reason', r.id);
                  setReason(r.id);
                }}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  'size-[18px] shrink-0 rounded-full border-solid bg-white',
                  on ? 'border-[5px] border-[#387440]' : 'border-[1.5px] border-[#c1d4c4]'
                )}
              />
              <span className="min-w-0 flex-1">{r.label}</span>
            </label>
          );
        })}
      </div>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder={copy.placeholder}
        aria-label={copy.placeholder}
        className={classNames(
          'block h-[68px] w-full resize-none rounded-[14px] border border-solid border-[#c1d4c4] bg-white px-[14px] py-[12px] font-sans text-[13px] leading-[16px] text-[#1c2a21] placeholder:text-[#737373]',
          FOCUS_RING
        )}
      />
      <div className="flex items-center gap-[10px] rounded-[16px] bg-[#ebf1ec] px-[14px] py-[12px]">
        <JobsShieldGlyph className="size-[18px] shrink-0 text-[#2d5d33]" />
        <p className="m-0 font-sans text-[13px] font-medium leading-[18px] text-[#2d5d33] max-lg:text-[12px]">
          {copy.safety}
        </p>
      </div>
      <DialogActions pad="playful:py-[8px]">
        <ActionButton onClick={close}>{copy.cancel}</ActionButton>
        <ActionButton
          variant="primary"
          onClick={() => {
            log('send report', { job: job.id, reason, chars: details.length });
            close();
          }}
        >
          {copy.confirm}
        </ActionButton>
      </DialogActions>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#737373]">{copy.footnote}</p>
    </DialogFrame>
  );
};

/*
 * WithdrawDialog — J-20 "Withdraw your application?" (Playful 7518:5764 / Focused 8110:418931), over the
 * applied job's detail. Optional single reason ("I took another offer" ticked in the frame; single-select is
 * an ASSUMPTION, the frame draws one tick). "Yes, withdraw" -> Applied tab with `?withdrawn=1` (J-21 toast).
 */
export const WithdrawDialog = ({ jobs }) => {
  const copy = JOB_DIALOGS.withdraw;
  const uid = useId();
  const job = findJob(jobs.job, copy.defaultJob);
  const [reason, setReason] = useState(copy.selected);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);
  const close = () => jobs.update({ modal: null });
  useMount('WithdrawDialog', { job: job.id });
  const done = () =>
    jobs.update({ modal: null, job: null, tab: 'applied', withdrawn: true, wd: true });
  // Live: POST /applications/:id/withdraw, then the feed reloads (the row moves to Closed).
  const confirm = async () => {
    log('withdraw', { job: job.id, reason });
    if (!JOBS_LIVE) {
      done();
      return;
    }
    setBusy(true);
    setFailure(null);
    try {
      const label = copy.reasons?.find((r) => r.id === reason)?.label;
      await jobs.data.withdraw(job.id, label || reason || undefined);
      done();
    } catch (err) {
      log.error('withdraw failed:', err?.response?.status || err?.message);
      setFailure(
        err?.response?.data?.message || 'We couldn’t withdraw your application. Please try again.'
      );
      setBusy(false);
    }
  };

  return (
    <DialogFrame kind="modal" onClose={close} labelId={`${uid}-title`} cardClassName={MODAL_CARD}>
      <IconTile className="size-[57px] rounded-[16px] border-[1.4px] border-[rgba(28,42,33,0.32)] max-lg:size-[48px]">
        <JobsUndoGlyph className="size-[26px]" />
      </IconTile>
      <h2
        id={`${uid}-title`}
        className={classNames(
          HEADING,
          'm-0 text-[29px] font-semibold leading-[35px] text-[#1c2a21] max-lg:text-[24px] max-lg:leading-[30px]'
        )}
      >
        {copy.title}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[21px] text-[#595959]">
        {fill(copy.body, { title: job.title, company: job.company.name })}
      </p>
      <span
        id={`${uid}-why`}
        className="font-sans text-[11.5px] font-bold leading-[14px] text-[#737373] max-lg:text-[12px]"
      >
        {copy.reasonsLabel}
      </span>
      <div
        role="group"
        aria-labelledby={`${uid}-why`}
        className="-mt-[2px] flex flex-wrap gap-[8px]"
      >
        {copy.reasons.map((r) => (
          <ReasonChip
            key={r.id}
            gap="gap-[6px]"
            selected={reason === r.id}
            onToggle={() => {
              log('reason', r.id);
              setReason(reason === r.id ? null : r.id);
            }}
          >
            {r.label}
          </ReasonChip>
        ))}
      </div>
      <div className="flex items-center gap-[8px] rounded-[14px] bg-[#f8f8f4] px-[12px] py-[10px]">
        <JobsLockGlyph className="size-[14px] shrink-0 text-[#595959]" />
        <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#595959]">{copy.note}</p>
      </div>
      {failure ? (
        <p role="alert" className="m-0 font-sans text-[13px] leading-[18px] text-[#c0392b]">
          {failure}
        </p>
      ) : null}
      <DialogActions pad="playful:pb-[7px]">
        <ActionButton size="lg" className="!text-[#c0392b]" onClick={confirm} disabled={busy}>
          {busy ? 'Withdrawing…' : copy.confirm}
        </ActionButton>
        <ActionButton variant="primary" size="lg" onClick={close}>
          {copy.keep}
        </ActionButton>
      </DialogActions>
    </DialogFrame>
  );
};
