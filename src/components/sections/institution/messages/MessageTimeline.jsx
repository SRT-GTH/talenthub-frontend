import { classNames } from '../../../../utils/classNames.js';
import { MessagesIconOpportunity } from './messagesIcons.jsx';

/*
 * MessageTimeline — the "Today" pill and the bubbles of a thread (Figma 11.3.3c "Component 24", 902 wide, gap 15 / 14):
 *   out    the school's text, right aligned, #e5e5e5 at 50 %, r12, p 14/16/8/16, 14/20 #595959 + meta "09:00" #babab7 and the status (#1d7c4d, 500);
 *          ⚠️ Figma draws the bubble narrow (126 wide, a text column of 94): reproduced at xl, fluid below.
 *   card   the programme / file card (299 wide, 1px rgba(0,82,43,.1), r10, p 24/18/18/18): label 12/500 #387440, title 16/500, sub 14 #999999, "Sent to ..." 14 #1d7c4d,
 *          footer 12 #959592 and the decorative "opportunity" mark that overhangs the top right corner (Figma `ep:opportunity`, 59 %).
 *   help   the "Questions? Reply here ..." bubble (same as out, hugging its text).
 *   reply  inbound, left aligned, #32683a, r12, white text 14/20 + time #babab7.
 * Props: items (timeline), scheduled (the thread is not sent yet: status "Not sent yet", footer "Opens for replies when sent").
 */

const Meta = ({ time, status, tone }) => (
  <span className="flex items-center gap-[4px] text-[12px] leading-[14px]">
    <span className={tone === 'dark' ? 'text-[#babab7]' : 'text-[#babab7]'}>{time}</span>
    {status ? <span className="font-medium text-[#1d7c4d]">{status}</span> : null}
  </span>
);

const Bubble = ({ item, scheduled, narrow }) => (
  <li className="flex justify-end">
    <div
      className={classNames(
        'flex max-w-[80%] flex-col gap-[2.5px] rounded-[12px] bg-[#e5e5e5]/50 px-[16px] pt-[14px] pb-[8px]',
        narrow && 'xl:w-[126px] xl:max-w-none'
      )}
    >
      <p className="m-0 text-[14px] leading-[20px] text-[#595959]">{item.text}</p>
      <Meta
        time={item.time}
        status={scheduled && item.scheduledStatus ? item.scheduledStatus : item.status}
      />
    </div>
  </li>
);

const Card = ({ item, scheduled }) => (
  <li className="flex justify-end">
    <div className="relative flex w-[299px] max-w-full flex-col gap-[10px] rounded-[10px] border border-solid border-[#00522b]/10 bg-gradient-to-b from-white to-[#ebf1ec] px-[18px] pt-[24px] pb-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      <MessagesIconOpportunity className="pointer-events-none absolute -top-[15px] -right-[28px] size-[73px] text-white max-xl:hidden" />
      <div className="flex flex-col gap-[2px]">
        <span className="text-[12px] leading-[14px] font-medium text-[#387440]">{item.label}</span>
        <div className="flex flex-col gap-[6px]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[16px] leading-[19px] font-medium text-[#1c2a21]">
              {item.title}
            </span>
            <span className="text-[14px] leading-[20px] tracking-[0.2px] text-[#999999]">
              {item.sub}
            </span>
          </div>
          <span className="text-[14px] leading-[20px] tracking-[0.2px] text-[#1d7c4d]">
            {item.sent}
          </span>
        </div>
      </div>
      <span className="text-[12px] leading-[14px] tracking-[0.2px] text-[#959592]">
        {scheduled && item.scheduledFoot ? item.scheduledFoot : item.foot}
      </span>
    </div>
  </li>
);

const Reply = ({ item }) => (
  <li className="flex justify-start">
    <div className="flex max-w-[80%] flex-col gap-[6px] rounded-[12px] bg-[#32683a] px-[16px] pt-[14px] pb-[8px]">
      <p className="m-0 text-[14px] leading-[20px] text-white">{item.text}</p>
      <span className="self-end text-[12px] leading-[14px] text-[#babab7]">{item.time}</span>
    </div>
  </li>
);

const MessageTimeline = ({ items, scheduled = false }) => (
  <div className="flex flex-col items-stretch gap-[15px]">
    <span className="mx-auto rounded-full bg-[#e5e5e5]/50 px-[14px] py-[6px] text-[13px] leading-[16px] text-[#595959]">
      Today
    </span>
    <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
      {items.map((item) => {
        if (item.scheduledOnly && !scheduled && !item.foot) return null;
        if (item.kind === 'card') return <Card key={item.id} item={item} scheduled={scheduled} />;
        if (item.kind === 'reply') return <Reply key={item.id} item={item} />;
        return (
          <Bubble key={item.id} item={item} scheduled={scheduled} narrow={item.kind === 'out'} />
        );
      })}
    </ul>
  </div>
);

export default MessageTimeline;
