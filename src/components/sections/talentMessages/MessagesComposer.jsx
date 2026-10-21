import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { MsgSendIcon } from './aIcons.jsx';
import { MESSAGES_COPY } from './messagesData.js';
import { useMessagesDraft } from './messagesDraft.js';
import { useEnterAddsNewLine } from './MessagesA11yPrefs.js';
import { FOCUS_RING } from './messagesStyles.js';

const log = debug('MessagesComposer');

/*
 * Message composer (Figma "Message composer" 8132:400846): 63px pill, 1.5px #c1d4c4 border, "Write a message…",
 * "Help me reply" pill, round green send button. Text lives in useMessagesDraft() (shared with Help me reply, H-04: a
 * placed draft makes the box grow taller). Props: messages (state hook: reply), onSend(text), disabled.
 * Enter sends (Shift+Enter = new line) unless the Messages accessibility option "Enter adds a new line" is on
 * (then Enter = new line and Ctrl/⌘+Enter sends).
 */
const MessagesComposer = ({ messages, onSend, disabled }) => {
  const { draft, setDraft, clearDraft } = useMessagesDraft();
  const enterNewLine = useEnterAddsNewLine();
  const ref = useRef(null);
  const [multi, setMulti] = useState(false);

  useEffect(() => {
    log('mount');
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, 132);
    el.style.height = `${next}px`;
    setMulti(next > 24);
  }, [draft]);

  const submit = () => {
    const text = draft.trim();
    if (!text || disabled) return;
    log('submit', { chars: text.length });
    onSend(text);
    clearDraft();
    if (messages.reply) messages.update({ reply: null });
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    const mod = e.ctrlKey || e.metaKey;
    const send = enterNewLine ? mod : !e.shiftKey;
    if (send) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={classNames(
        'flex shrink-0 items-center justify-between gap-[17px] border-[1.5px] border-solid border-[#c1d4c4] bg-white py-[12px] pl-[20px] pr-[12px] max-lg:gap-[8px] max-lg:pl-[14px] max-lg:pr-[8px]',
        multi ? 'rounded-[24px]' : 'rounded-[100px]'
      )}
    >
      <textarea
        ref={ref}
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={MESSAGES_COPY.composerPlaceholder}
        aria-label="Write a message"
        disabled={disabled}
        className="min-h-[24px] min-w-0 flex-1 resize-none self-center border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] text-[#1c2a21] outline-none placeholder:text-[#999]"
      />
      <div className="flex shrink-0 items-center gap-[10px]">
        <Button
          variant="tertiary-subtle"
          size="xs"
          className={classNames(
            '!h-[32px] !gap-[6px] !rounded-[14px] !px-[12px] !py-0 !text-[12px] !leading-[24px]',
            'max-lg:!min-h-[32px]'
          )}
          onClick={() => {
            log('help me reply');
            messages.update({ reply: 'ideas' });
          }}
        >
          {MESSAGES_COPY.helpMeReply}
        </Button>
        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled}
          className={classNames(
            'flex h-[39px] w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.4px] border-solid border-[rgba(28,42,33,0.32)] bg-[#387440] p-0 shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]',
            FOCUS_RING
          )}
        >
          <MsgSendIcon className="h-[12px] w-[13px]" />
        </button>
      </div>
    </form>
  );
};

export default MessagesComposer;
