import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { AUDIENCES, AUDIENCE_TYPES } from './data/messagesData.js';
import {
  MessagesIconCheck,
  MessagesIconClose,
  MessagesIconCompany,
  MessagesIconComment,
  MessagesIconUser,
  MessagesIconUsers,
} from './messagesIcons.jsx';

/*
 * ComposeDialog — "New message" (Figma 11.3.3a 8595:389383: 540 wide, white, 1px rgba(28,42,33,.1), r24, p 28, gap 24, on a #1c2a21 scrim at 55 %):
 *   yellow 44px tile with the comment icon + "New message" 24/600 + the close disc · "Who gets it?" 15/600 · three tiles (154 x 80, r14; the chosen one #ebf1ec with a 1px #387440
 *   border) · the text area (r14, 15/22) · the check row "Attach programme: Scholarship Prep Clinic" · "Save draft" (white, 2px) + "Preview" (green).
 * Focus trap, Esc and scrim click close (AgencyDialogShell, Theme 8 useDialogBehaviour); focus returns to the opener.
 * ⚠️ ASSUMPTIONS: under "One class" / "Year group" a select names the group (not drawn; "Programme group" is the drawn state with the clinic attached);
 * when editing a scheduled message a "Send at" date and time field appears (editing: true) and "Preview" reads "Save schedule"; "Preview" needs some text.
 * Props: draft, onChange(patch), onPreview(), onSaveDraft(), onClose(), editing (scheduled edit), sendAt.
 */

const ICONS = { user: MessagesIconUser, users: MessagesIconUsers, company: MessagesIconCompany };

const ComposeDialog = ({ draft, onChange, onPreview, onSaveDraft, onClose, editing = false }) => {
  const uid = useId();
  const choices = AUDIENCES[draft.type];
  const empty = !draft.body.trim();
  return (
    <AgencyDialogShell
      title="New message"
      onClose={onClose}
      scrim="bg-[#1c2a21]/55"
      className="mx-auto max-w-[540px]"
    >
      <div className="flex flex-col gap-[24px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[28px] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)] max-sm:p-[20px]">
        <div className="flex items-center gap-[12px]">
          <span className="grid size-[44px] shrink-0 place-items-center rounded-[13px] bg-[#ffd86b] text-[#1c2a21]">
            <MessagesIconComment className="size-[21px]" />
          </span>
          <h2 className="m-0 min-w-0 flex-1 text-[24px] leading-[29px] font-semibold tracking-[-0.24px] text-[#1c2a21]">
            New message
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <MessagesIconClose className="size-[18px]" />
          </button>
        </div>
        <fieldset className="m-0 flex min-w-0 flex-col gap-[14px] border-0 p-0">
          <legend className="p-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            Who gets it?
          </legend>
          <div className="mt-[14px] grid grid-cols-3 gap-[10px] max-sm:grid-cols-1">
            {AUDIENCE_TYPES.map((a) => {
              const Icon = ICONS[a.icon];
              const on = draft.type === a.id;
              return (
                <label
                  key={a.id}
                  className={classNames(
                    'flex min-h-[80px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[14px] border border-solid py-[14px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]',
                    on ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#1c2a21]/10 bg-white'
                  )}
                >
                  <input
                    type="radio"
                    name={`${uid}-audience`}
                    checked={on}
                    onChange={() => onChange({ type: a.id, choice: AUDIENCES[a.id][0].id })}
                    className="sr-only"
                  />
                  <Icon className="size-[28px] text-[#387440]" />
                  <span
                    className={classNames(
                      'text-[13.5px] leading-[16px] font-semibold',
                      on ? 'text-[#2a5730]' : 'text-[#1c2a21]'
                    )}
                  >
                    {a.label}
                  </span>
                </label>
              );
            })}
          </div>
          {draft.type !== 'programme' ? (
            <label className="flex flex-col gap-[6px] text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              {draft.type === 'class' ? 'Which class?' : 'Which year group?'}
              <select
                value={draft.choice}
                onChange={(e) => onChange({ choice: e.target.value })}
                className="h-[44px] rounded-[10px] border border-solid border-[#cccccc] bg-white px-[12px] font-sans text-[14px] text-[#595959]"
              >
                {choices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </fieldset>
        <label className="flex flex-col gap-[6px] rounded-[14px] border border-solid border-[#1c2a21]/10 bg-white p-[14px] focus-within:border-[#387440]">
          <span className="sr-only">Message</span>
          <textarea
            value={draft.body}
            onChange={(e) => onChange({ body: e.target.value })}
            rows={3}
            className="min-h-[88px] w-full resize-none border-0 bg-transparent p-0 font-sans text-[15px] leading-[22px] text-[#1c2a21] outline-none"
          />
        </label>
        {editing ? (
          <label className="flex flex-col gap-[6px] text-[14px] leading-[17px] font-medium text-[#1c2a21]">
            Send at
            <input
              type="datetime-local"
              value={draft.sendAt}
              onChange={(e) => onChange({ sendAt: e.target.value })}
              className="h-[44px] rounded-[10px] border border-solid border-[#cccccc] bg-white px-[12px] font-sans text-[14px] text-[#595959]"
            />
          </label>
        ) : null}
        {draft.type === 'programme' ? (
          <label className="flex cursor-pointer items-center gap-[10px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
            <input
              type="checkbox"
              checked={draft.attach}
              onChange={(e) => onChange({ attach: e.target.checked })}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={classNames(
                'grid size-[22px] shrink-0 place-items-center rounded-[6px] border border-solid',
                draft.attach
                  ? 'border-[#387440] bg-[#387440] text-white'
                  : 'border-[#1c2a21]/30 bg-white text-transparent'
              )}
            >
              <MessagesIconCheck className="size-[16px]" />
            </span>
            <span className="text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              Attach programme: Scholarship Prep Clinic
            </span>
          </label>
        ) : null}
        <div className="flex flex-wrap gap-[12px] [&>*]:flex-[1_1_160px]">
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            className="!rounded-[14px] !px-[34px] !py-[16px]"
            onClick={onSaveDraft}
          >
            Save draft
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            data-autofocus=""
            disabled={empty}
            className="!rounded-[10px] !px-[18px] !py-[12px]"
            onClick={onPreview}
          >
            {editing ? 'Save schedule' : 'Preview'}
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default ComposeDialog;
