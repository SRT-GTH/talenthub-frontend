import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import IconTileDialog from '../../ui/IconTileDialog.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import Select from '../../ui/form/Select.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import { ArrowheadDownIcon } from '../../shared/assets.jsx';
import {
  BuildingIcon,
  CheckIcon,
  InfoCircleIcon,
  PipelineIcon,
  SendIcon,
} from './talentCandidateProfileIcons.jsx';
import {
  INVITE_DIALOG,
  JOBS,
  PIPELINE_DIALOG,
  PIPELINE_STAGES,
} from './talentCandidateProfileData.js';
import { debug } from '../../../utils/debug.js';

const log = debug('CandidateDialogs');

/*
 * CandidateDialogs — the two dialogs opened from the profile's action row (both on `ui/IconTileDialog`).
 *   InviteDialog   "Invite Kofi to apply" (Figma TS-12 10102:42398, 600px): Job dropdown, Message textarea (500 characters, counter inside the box), the "What Kofi will see" preview, "Uses 1 of 18 invites left", Cancel / Send invite.
 *   PipelineDialog "Add Kofi to a pipeline" (Figma TS-17 10102:44650, 540px): Job and Stage dropdowns, the "Tell Kofi they've been shortlisted" checkbox, the blue "Kofi will be asked to confirm" banner, Cancel / Add to pipeline.
 * ⚠️ ASSUMPTION: the Job dropdowns list only the job drawn (one option each); the Stage list is the pipeline board's stage names (only "Shortlisted" is drawn).
 * Props — InviteDialog: candidate, job, invitesLeft, onCancel, onConfirm({ jobId, message }). PipelineDialog: candidate, job, onCancel, onConfirm({ jobId, stage, notify }).
 */
export const InviteDialog = ({ candidate, job, invitesLeft, onCancel, onConfirm }) => {
  const first = candidate.firstName;
  const [jobId, setJobId] = useState(job.id);
  const [message, setMessage] = useState(INVITE_DIALOG.defaultMessage(first, job.title));
  const canSend = message.trim().length > 0 && message.length <= INVITE_DIALOG.maxLength;
  log('render', { candidate: candidate.id, jobId, messageLength: message.length, canSend });

  return (
    <IconTileDialog
      icon={<SendIcon className="size-[22px]" />}
      title={INVITE_DIALOG.title(first)}
      body={INVITE_DIALOG.body(first)}
      onClose={onCancel}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[12px]">
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {INVITE_DIALOG.usesLine(invitesLeft)}
          </p>
          <div className="flex items-center gap-[10px] max-sm:w-full max-sm:justify-end">
            <Button variant="tertiary" onClick={onCancel}>
              {INVITE_DIALOG.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!canSend}
              onClick={() => {
                log('branch: send invite', { jobId, messageLength: message.length });
                onConfirm({ jobId, message });
              }}
            >
              {INVITE_DIALOG.confirm}
            </Button>
          </div>
        </div>
      }
    >
      <div className="pb-[23px]">
        <Select
          verified
          chevronIcon={<ArrowheadDownIcon className="size-[20px] text-[#387440]" />}
          required
          label={INVITE_DIALOG.jobLabel}
          value={jobId}
          onChange={setJobId}
          options={JOBS.filter((item) => item.id === job.id).map((item) => ({
            value: item.id,
            label: item.inviteLabel,
          }))}
        />
      </div>
      <Textarea
        required
        label={INVITE_DIALOG.messageLabel}
        maxLength={INVITE_DIALOG.maxLength}
        counterInside
        rows={2}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        boxClassName="!rounded-[10px] !border !border-[#dbded9] !bg-white !shadow-[0_3px_0_0_rgba(34,70,38,0.8)]"
        textareaClassName="!resize-none !px-[16px] !pt-[12px] !pb-[8px] !leading-[24px]"
      />
      <section
        aria-label={INVITE_DIALOG.previewHeading(first)}
        className="flex flex-col gap-[8px] rounded-[16px] border border-solid border-[#e5e8e3] bg-[#fffefc] p-[16px]"
      >
        <h3 className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
          {INVITE_DIALOG.previewHeading(first)}
        </h3>
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
            <BuildingIcon className="size-[20px]" />
          </span>
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
              {INVITE_DIALOG.previewTitle}
            </p>
            <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {INVITE_DIALOG.previewBody(job.title, candidate.match.percent)}
            </p>
          </div>
        </div>
      </section>
    </IconTileDialog>
  );
};

const CHECK_GLYPHS = {
  checked: (
    <span className="flex size-[18px] items-center justify-center rounded-[5px] bg-[#387440] text-white">
      <CheckIcon className="size-[12px]" />
    </span>
  ),
  // ⚠️ ASSUMPTION: Figma draws only the checked box; the unchecked one is a white box with the standard #cccccc line.
  unchecked: (
    <span className="block size-[18px] rounded-[5px] border border-solid border-[#cccccc] bg-white" />
  ),
};

export const PipelineDialog = ({ candidate, job, onCancel, onConfirm }) => {
  const first = candidate.firstName;
  const [jobId, setJobId] = useState(job.id);
  const [stage, setStage] = useState(PIPELINE_DIALOG.defaultStage);
  const [notify, setNotify] = useState(true);
  log('render', { candidate: candidate.id, jobId, stage, notify });

  return (
    <IconTileDialog
      icon={<PipelineIcon className="size-[22px]" />}
      title={PIPELINE_DIALOG.title(first)}
      body={PIPELINE_DIALOG.body(first)}
      onClose={onCancel}
      widthClassName="!max-w-[540px]"
      footer={
        <div className="flex items-center justify-end gap-[10px]">
          <Button variant="tertiary" onClick={onCancel}>
            {PIPELINE_DIALOG.cancel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              log('branch: add to pipeline', { jobId, stage, notify });
              onConfirm({ jobId, stage, notify });
            }}
          >
            {PIPELINE_DIALOG.confirm}
          </Button>
        </div>
      }
    >
      <div className="pb-[23px]">
        <Select
          verified
          chevronIcon={<ArrowheadDownIcon className="size-[20px] text-[#387440]" />}
          required
          label={PIPELINE_DIALOG.jobLabel}
          value={jobId}
          onChange={setJobId}
          options={JOBS.filter((item) => item.id === job.id).map((item) => ({
            value: item.id,
            label: item.title,
          }))}
        />
      </div>
      <div className="pb-[23px]">
        <Select
          verified
          chevronIcon={<ArrowheadDownIcon className="size-[20px] text-[#387440]" />}
          required
          label={PIPELINE_DIALOG.stageLabel}
          value={stage}
          onChange={setStage}
          options={PIPELINE_STAGES}
        />
      </div>
      <Checkbox
        glyphs={CHECK_GLYPHS}
        checked={notify}
        onChange={(event) => setNotify(event.target.checked)}
        label={
          <span className="flex flex-col gap-[2px] pl-[4px]">
            <span className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
              {PIPELINE_DIALOG.notifyLabel(first)}
            </span>
            <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {PIPELINE_DIALOG.notifyHint(first)}
            </span>
          </span>
        }
      />
      <div className="flex items-start gap-[12px] rounded-[10px] bg-[#eaeffb] p-[16px] text-[#244a9f]">
        <InfoCircleIcon className="size-[20px] shrink-0" />
        <div className="flex min-w-0 flex-col gap-[2px]">
          <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold tracking-[0.1px] text-[#111]">
            {PIPELINE_DIALOG.infoTitle(first)}
          </p>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {PIPELINE_DIALOG.infoBody}
          </p>
        </div>
      </div>
    </IconTileDialog>
  );
};
