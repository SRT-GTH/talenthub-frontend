import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { MessagesIconSend } from './messagesIcons.jsx';
import MessageTimeline from './MessageTimeline.jsx';

/*
 * ThreadPane — the right card of Messages (Figma 11.3.3c "Software Engineer Card" 948 x 845, white, 1.2px rgba(0,82,43,.1), r24, p 18/22/14/22):
 *   the header pill (r100: 53px avatar, title 16/500, the delivery sentence 14 #737373) · optional banner · the timeline · the follow-up field
 *   (pill, r100, 1.2px border, 14 #999999 placeholder) with the green send disc (37 x 36).
 * Live: the thread is GET /api/institution/messages/:id; the follow-up goes to everyone the message reached (POST .../follow-up) and is only
 * open once the message is sent. Figma's ⋯ button has no menu, so it is left out; a draft shows "Finish draft" instead of a timeline.
 * Props: thread, banner (node), onFollowUp(text) → Promise, onEditDraft(), busy.
 */

const ThreadPane = ({ thread, banner, onFollowUp, onEditDraft, busy = false }) => {
  const [text, setText] = useState('');
  const sent = thread.status === 'sent';
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !sent || busy) return;
    const ok = await onFollowUp(text.trim());
    if (ok) setText('');
  };
  return (
    <section
      aria-label={thread.title}
      className="flex min-w-0 flex-col gap-[24px] rounded-[24px] border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[22px] pt-[18px] pb-[14px] font-sans xl:h-[845px]"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-[24px] overflow-y-auto">
        <header className="flex items-center gap-[16px] rounded-full border-[1.2px] border-solid border-[#00522b]/10 px-[12px] py-[8px]">
          <span className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#387440] text-[18px] leading-[21px] font-semibold text-white">
            {thread.initials}
          </span>
          <div className="flex min-w-0 flex-col gap-[6px]">
            <h2 className="m-0 text-[16px] leading-[19px] font-medium text-[#1c2a21]">
              {thread.title}
            </h2>
            <p className="m-0 text-[14px] leading-[17px] text-[#737373]">{thread.header}</p>
          </div>
        </header>
        {banner}
        {thread.timeline?.length ? (
          <MessageTimeline items={thread.timeline} scheduled={thread.status === 'scheduled'} />
        ) : (
          <div className="flex flex-col items-center gap-[12px] py-[24px] text-center">
            <p className="m-0 text-[14px] leading-[20px] text-[#737373]">
              {thread.body ? `“${thread.body}”` : 'This draft is empty.'} It hasn’t been sent yet.
            </p>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              className="!rounded-[14px]"
              onClick={onEditDraft}
            >
              Finish draft
            </Button>
          </div>
        )}
      </div>
      <form
        onSubmit={submit}
        className="flex shrink-0 items-center gap-[16px] rounded-full border-[1.2px] border-solid border-[#00522b]/10 py-[12px] pr-[12px] pl-[20px]"
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">Write a follow-up</span>
          <input
            type="text"
            value={text}
            disabled={!sent}
            maxLength={2000}
            onChange={(e) => setText(e.target.value)}
            placeholder={sent ? thread.placeholder : 'Follow-ups open once the message is sent'}
            className="w-full border-0 bg-transparent p-0 font-sans text-[14px] leading-[18px] text-[#1c2a21] outline-none placeholder:text-[#999999] disabled:cursor-not-allowed"
          />
        </label>
        <button
          type="submit"
          aria-label="Send follow-up"
          disabled={!sent || busy || !text.trim()}
          className="grid size-[37px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MessagesIconSend className="h-[36px] w-[37px]" />
        </button>
      </form>
    </section>
  );
};

export default ThreadPane;
