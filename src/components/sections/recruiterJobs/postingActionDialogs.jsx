import { useState } from 'react';
import { CenterDialog, SaveAsTemplateDialog } from './jobFlowDialogs.jsx';
import { JobButton } from './jobButtons.jsx';
import { CheckRow } from './jobFormControls.jsx';
import { PauseGlyph } from './jobIcons.jsx';
import { classNames } from '../../../utils/classNames.js';

/*
 * Posting action dialogs on the Job Postings page (Figma "Recruiter - Job Postings" 10103:59491):
 *   PauseDialog           JM-08  ?modal=pause&posting=<id>          "Pause applications?" + notify check
 *   DeleteDraftDialog     JM-12  ?modal=delete-draft&posting=<id>   "Delete this draft?"
 *   CloseWithMessageDialog JM-10 ?modal=close-posting&posting=<id>  "Close this posting?" + what to tell the applicants (a posting that has applicants)
 *   DuplicateDialog       JM-06  ?modal=save-template&posting=<id>  "Save as a template" (rename + what to include)
 */
export const PauseDialog = ({ title, applicants, awaiting, onKeep, onPause }) => {
  const [notify, setNotify] = useState(false);
  return (
    <CenterDialog
      icon={<PauseGlyph size={22} />}
      iconClassName="bg-[#faf4e8] text-[#c8951a]"
      title="Pause applications?"
      body={`${title} stays visible, but talent can’t apply while it’s paused. Your ${applicants} applicants and pipeline stay exactly as they are.`}
      onClose={onKeep}
      widthClassName="!max-w-[500px]"
      footer={
        <>
          <JobButton tone="ghost" onClick={onKeep}>
            Keep accepting
          </JobButton>
          <JobButton onClick={() => onPause(notify)}>Pause applications</JobButton>
        </>
      }
    >
      <CheckRow
        checked={notify}
        onChange={setNotify}
        label="Tell applicants in Applied and Screening that hiring is paused"
        hint={`Sends a short message to ${awaiting} people`}
      />
    </CenterDialog>
  );
};

export const DeleteDraftDialog = ({ title, onCancel, onDelete, isDraft = true }) => (
  <CenterDialog
    title={isDraft ? 'Delete this draft?' : 'Delete this posting?'}
    body={
      isDraft
        ? `“${title}” will be deleted for good. Nobody has seen it yet, so no one will be notified.`
        : `“${title}” will be deleted for good. Nobody has applied, so no one will be notified.`
    }
    onClose={onCancel}
    widthClassName="!max-w-[500px]"
    footer={
      <>
        <JobButton tone="ghost" onClick={onCancel}>
          Cancel
        </JobButton>
        <JobButton tone="danger" onClick={onDelete}>
          {isDraft ? 'Delete draft' : 'Delete posting'}
        </JobButton>
      </>
    }
  />
);

const CLOSE_CHOICES = [
  {
    id: 'message',
    label: 'Send them a kind “role closed” message',
    hint: 'Recommended. Keeps your response rate high.',
  },
  { id: 'keep', label: 'Keep them in the pipeline to review later' },
  { id: 'nothing', label: 'Do nothing for now' },
];

export const CloseWithMessageDialog = ({ waiting, onCancel, onClose }) => {
  const [choice, setChoice] = useState('message');
  return (
    <CenterDialog
      title="Close this posting?"
      body="It stops accepting new applicants and comes off Opportunities and Talent Search. You can reopen it within 30 days."
      onClose={onCancel}
      widthClassName="!max-w-[560px]"
      footer={
        <>
          <JobButton tone="ghost" onClick={onCancel}>
            No, keep it open
          </JobButton>
          <JobButton tone="danger" onClick={() => onClose(choice)}>
            Yes, close posting
          </JobButton>
        </>
      }
    >
      <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
        {waiting} applicants haven’t heard back yet
      </span>
      <div role="radiogroup" className="flex flex-col gap-[12px]">
        {CLOSE_CHOICES.map((row) => {
          const on = choice === row.id;
          return (
            <button
              key={row.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setChoice(row.id)}
              className="flex cursor-pointer items-start gap-[10px] border-0 bg-transparent p-0 text-left"
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-full border border-solid',
                  on ? 'border-[#387440]' : 'border-[#cccccc]'
                )}
              >
                {on ? <span className="size-[8px] rounded-full bg-[#387440]" /> : null}
              </span>
              <span className="flex flex-col">
                <span className="font-sans text-[14px] leading-[20px] text-[#111]">
                  {row.label}
                </span>
                {row.hint ? (
                  <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                    {row.hint}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </CenterDialog>
  );
};

export const DuplicateDialog = ({ title, onClose, onSave }) => {
  const [name, setName] = useState(`${title} (copy)`);
  return (
    <SaveAsTemplateDialog
      copy={{
        title: 'Save as a template',
        body: `Reuse ${title} for future roles. Applicants and pipeline data aren’t copied.`,
        category: 'Design',
        includeLabel: 'What to include',
        includes: [
          { label: 'Description and responsibilities' },
          { label: 'Pay range' },
          { label: 'Skills (6)' },
          {
            label: 'Screening criteria',
            hint: 'Senior design screening · 5+ yrs · portfolio required',
          },
          { label: 'Location' },
        ],
      }}
      name={name}
      setName={setName}
      onClose={onClose}
      onSave={() => onSave(name)}
    />
  );
};
