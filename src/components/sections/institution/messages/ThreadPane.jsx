import { useState } from 'react';
import { MessagesIconSend } from './messagesIcons.jsx';
import { ProgrammesIconMeatball } from '../programmes/programmesIcons.jsx';
import MessageTimeline from './MessageTimeline.jsx';

/*
 * ThreadPane — the right card of Messages (Figma 11.3.3c "Software Engineer Card" 948 x 845, white, 1.2px rgba(0,82,43,.1), r24, p 18/22/14/22):
 *   the header pill (902 x 75, r100: 53px avatar, title 16/500, the delivery sentence 14 #737373 in a 181px column at xl, the ⋯ button) · optional banner ·
 *   the timeline · the follow-up field (pill, r100, 1.2px border, 14 #999999 placeholder) with the green send disc (37 x 36).
 * The ⋯ button has no menu in Figma: it only logs (⚠️ not drawn). The follow-up field sends a bubble into the mock thread.
 * Props: thread, header (override of the sentence), banner (node), scheduled, items (timeline incl. follow-ups), placeholder, onFollowUp(text).
 */

const ThreadPane = ({ thread, header, banner, scheduled, items, placeholder, onFollowUp }) => {
  const [text, setText] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onFollowUp(text.trim());
    setText('');
  };
  return (
    <section
      aria-label={thread.title}
      className="flex min-w-0 flex-col gap-[24px] rounded-[24px] border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[22px] pt-[18px] pb-[14px] font-sans xl:h-[845px]"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-[24px] overflow-y-auto">
        <header className="flex items-center justify-between gap-[16px] rounded-full border-[1.2px] border-solid border-[#00522b]/10 px-[12px] py-[8px]">
          <div className="flex min-w-0 items-center gap-[14px]">
            <span className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#387440] text-[18px] leading-[21px] font-semibold text-white">
              {thread.initials}
            </span>
            <div className="flex min-w-0 flex-col gap-[6px] xl:w-[181px]">
              <h2 className="m-0 text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                {thread.title}
              </h2>
              <p className="m-0 text-[14px] leading-[17px] text-[#737373]">{header}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label={`More actions for ${thread.title}`}
            className="grid h-[24px] min-w-[41px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-white px-[11px] text-[#999999] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <ProgrammesIconMeatball className="h-[4px] w-[19px]" />
          </button>
        </header>
        {banner}
        {items.length ? (
          <MessageTimeline items={items} scheduled={scheduled} />
        ) : (
          <p className="m-0 text-center text-[14px] leading-[20px] text-[#737373]">
            This draft has not been sent yet. Choose New message to finish it.
          </p>
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
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="w-full border-0 bg-transparent p-0 font-sans text-[14px] leading-[18px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
          />
        </label>
        <button
          type="submit"
          aria-label="Send follow-up"
          className="grid size-[37px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <MessagesIconSend className="h-[36px] w-[37px]" />
        </button>
      </form>
    </section>
  );
};

export default ThreadPane;
