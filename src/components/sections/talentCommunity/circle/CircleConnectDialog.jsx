import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleSparkleIcon } from './circleIcons.jsx';
import CircleButton from './CircleButton.jsx';
import CircleDialogShell from './CircleDialogShell.jsx';
import CircleNoteField from './CircleNoteField.jsx';
import { usePlayfulScope } from '../../../ui/PlayfulScope.js';
import { FOCUS_RING } from './circleStyles.js';

const log = debug('CircleConnectDialog');

/*
 * CircleConnectDialog — NW-02 "Add a note": "Why link up with {first}?" + the person's headline · "{n} mutual",
 * a 300-character note, "Help me write it", "Send without a note" / "Send link-up". Flow step 4.
 * Props: person (circleData person), initialText (the drawn note when ?draft=1), onSend(note), onClose.
 * ⚠️ ASSUMPTIONS (not drawn): the field starts empty with a placeholder; "Help me write it" fills a canned suggestion (no AI call).
 */
const CircleConnectDialog = ({ person, initialText = '', onSend, onClose }) => {
  const playful = usePlayfulScope();
  const [note, setNote] = useState(initialText);
  const subtitle = person.mutual ? `${person.headline} · ${person.mutual} mutual` : person.headline;
  return (
    <CircleDialogShell
      personId={person.id}
      personPhoto={person.photo}
      personName={person.name}
      title={COPY.notes.title(person.firstName)}
      subtitle={subtitle}
      titleId="circle-connect-title"
      width={520}
      gap={playful ? 16 : 24} // Figma 2026-10-23 redraw: Playful 16, Focused 24
      titleSize="text-[20px] leading-[24px] max-sm:text-[18px] max-sm:leading-[22px]"
      sticker={
        COPY.notes.sticker
          ? { text: COPY.notes.sticker, className: '-top-[24px] right-[24px]' }
          : null
      }
      onClose={onClose}
    >
      <div className={playful ? 'flex flex-col gap-[16px]' : 'flex flex-col gap-[24px]'}>
        <CircleNoteField
          id="circle-connect-note"
          value={note}
          onChange={setNote}
          max={COPY.notes.max}
          rows={2}
          label={COPY.notes.title(person.firstName)}
          placeholder={`Say hi to ${person.firstName} and why you want to link up`}
        />
        <button
          type="button"
          onClick={() => {
            log('help me write it');
            setNote(COPY.notes.suggestion(person));
          }}
          className={`inline-flex w-fit cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[14px] ${FOCUS_RING}`}
        >
          <CircleSparkleIcon className="size-[16px]" />
          {COPY.notes.help}
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <CircleButton tone="soft" onClick={() => onSend('')}>
          {COPY.notes.without}
        </CircleButton>
        <CircleButton onClick={() => onSend(note.trim())}>{COPY.notes.send}</CircleButton>
      </div>
    </CircleDialogShell>
  );
};

export default CircleConnectDialog;
