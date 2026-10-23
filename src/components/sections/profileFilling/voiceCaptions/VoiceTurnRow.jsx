import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import CareerBuddyAvatar from '../../../shared/CareerBuddyAvatar.jsx';
import VoiceFixPopover from './VoiceFixPopover.jsx';
import { CaptionMicIcon, CaptionPlayIcon } from './VoiceCaptionIcons.jsx';
import { VOICE_COPY, formatVoiceDuration, segmentVoiceText } from './voiceCaptionData.js';

/*
 * A saved voice turn in the chat - Figma 9149:84358 "Voice turns" (VC-03) and 9149:84810 (VC-04).
 * Rows are 12px apart (the thread gap), avatars 44px:
 *   Buddy  : cream #f8f8f4 bubble, 1px #e7e7e7, radius 16, padding 12/16, max 594 wide; "Tali · Buddy" 11/600 #737373,
 *            text 15/22 #1c2a21, meta "▶ Voice · 0:08 · Play again" 12/500 #737373 (icon #387440)
 *   You    : #32683a bubble, radius 16, white text 15/22; meta "🎙 Voice · 0:06 · Edit" 12/500 #ddebdf; plain #c9e2cc avatar
 *   note   : Buddy bubble with only the text (the greeting "Hi Ama! Tap the mic ...")
 * Doubtful words of your turn are tappable (yellow #ffd86b) and open the "Did you mean…" popover.
 *
 * message.voice = { who: 'you' | 'buddy' | 'note', seconds }. `actions` (from useVoiceTurns):
 *   editingId, onStartEdit(id), onCancelEdit(), onSaveEdit(message, text), onPlay(message),
 *   fix: { id, heard, suggestion } | null, onOpenFix(message, part), onCloseFix(), onKeep(message, heard), onPick(message, heard, word),
 *   kept: { [id]: string[] }
 * ⚠️ ASSUMPTION: Edit turns the text into a small editor with Resend / Cancel (not drawn in Figma); resending sends the
 * edited text as a new turn.
 */
const META = 'font-sans text-[12px] font-medium leading-[14.3px]';

const YouText = ({ message, actions }) => {
  const kept = actions?.kept?.[message.id] ?? [];
  const parts = segmentVoiceText(message.text, kept);
  const canFix = Boolean(actions?.onOpenFix);
  return (
    <p className="m-0 font-sans text-[15px] leading-[21.8px] text-white">
      {parts.map((part, i) =>
        part.heard && canFix ? (
          <button
            key={i}
            type="button"
            onClick={() => actions.onOpenFix(message, part)}
            aria-haspopup="dialog"
            aria-label={`${part.heard}. Did you mean ${part.suggestion}?`}
            className="cursor-pointer border-0 border-b border-solid border-[#ffd86b] bg-transparent p-0 font-sans text-[15px] leading-[21.8px] text-[#ffd86b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-lg:text-[15px]"
          >
            {part.text}
          </button>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
};

const Editor = ({ message, actions }) => {
  const [draft, setDraft] = useState(message.text);
  return (
    <div className="flex flex-col gap-[8px]">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={2}
        aria-label="Edit your message"
        className="w-full resize-none rounded-[10px] border border-solid border-white/40 bg-white/10 p-[8px] font-sans text-[15px] leading-[21.8px] text-white outline-none focus-visible:border-white"
      />
      <div className="flex items-center justify-end gap-[12px]">
        <button
          type="button"
          onClick={actions.onCancelEdit}
          className={classNames(
            META,
            'cursor-pointer border-0 bg-transparent p-0 text-[#ddebdf] max-lg:min-h-11'
          )}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => actions.onSaveEdit(message, draft)}
          className={classNames(
            META,
            'cursor-pointer rounded-full border-0 bg-white px-[10px] py-[3px] text-[#32683a] max-lg:min-h-11'
          )}
        >
          Resend
        </button>
      </div>
    </div>
  );
};

const VoiceTurnRow = ({ message, actions }) => {
  const { who = 'buddy', seconds = 0 } = message.voice;
  const time = formatVoiceDuration(seconds);

  if (who === 'you') {
    const editing = actions?.editingId === message.id;
    const fix = actions?.fix?.id === message.id ? actions.fix : null;
    return (
      <div className="relative flex w-full items-start justify-end gap-[12px]">
        <div className="flex min-w-0 max-w-[min(542px,calc(100%-56px))] flex-col gap-[6px] rounded-[16px] bg-[#32683a] px-[16px] py-[12px]">
          {editing ? (
            <Editor message={message} actions={actions} />
          ) : (
            <YouText message={message} actions={actions} />
          )}
          {!editing && (
            <div className={classNames(META, 'flex items-center gap-[6px] text-[#ddebdf]')}>
              <CaptionMicIcon className="size-[14px] shrink-0" />
              <span>
                {`Voice · ${time} · `}
                {actions?.onStartEdit ? (
                  <button
                    type="button"
                    onClick={() => actions.onStartEdit(message.id)}
                    className={classNames(
                      META,
                      'cursor-pointer border-0 bg-transparent p-0 text-[#ddebdf] max-lg:min-h-11'
                    )}
                  >
                    Edit
                  </button>
                ) : (
                  'Edit'
                )}
              </span>
            </div>
          )}
        </div>
        <span className="size-[44px] shrink-0 rounded-full bg-[#c9e2cc]" aria-hidden="true" />
        {fix ? (
          <VoiceFixPopover
            key={fix.heard}
            heard={fix.heard}
            suggestion={fix.suggestion}
            onPick={(word) => actions.onPick(message, fix.heard, word)}
            onKeep={() => actions.onKeep(message, fix.heard)}
            onClose={actions.onCloseFix}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[650px] items-start gap-[12px]">
      <CareerBuddyAvatar size={44} />
      <div className="flex min-w-0 max-w-[594px] flex-col gap-[6px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[16px] py-[12px]">
        {who === 'buddy' ? (
          <span className="font-sans text-[11px] font-semibold leading-[13.1px] text-[#737373] max-lg:text-[12px]">
            {VOICE_COPY.buddyName}
          </span>
        ) : null}
        <p className="m-0 font-sans text-[15px] leading-[21.8px] text-[#1c2a21]">{message.text}</p>
        {who === 'buddy' ? (
          <div className={classNames(META, 'flex items-center gap-[8px] text-[#737373]')}>
            <CaptionPlayIcon className="size-[14px] shrink-0 text-[#387440]" />
            <span>
              {`Voice · ${time} · `}
              {actions?.onPlay ? (
                <button
                  type="button"
                  onClick={() => actions.onPlay(message)}
                  className={classNames(
                    META,
                    'cursor-pointer border-0 bg-transparent p-0 text-[#737373] max-lg:min-h-11'
                  )}
                >
                  Play again
                </button>
              ) : (
                'Play again'
              )}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VoiceTurnRow;
