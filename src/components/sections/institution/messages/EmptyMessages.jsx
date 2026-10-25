import Button from '../../../ui/Button.jsx';
import { MessagesIconFilter } from './messagesIcons.jsx';

/*
 * EmptyMessages — the right pane of the empty Messages page (Figma 11.3.3g, "T8 · Empty state" 8745:430409: 48px #ebf1ec disc with the filter icon, "Send your first message"
 * 17/600, the sentence 14/20 #595959 (360 wide), the white "New message" button). Figma drew it inside the old thread header with the first thread's bubbles still
 * showing behind it (an unfinished layer stack): this is the clean version of that card (Figma inconsistency, listed in the report).
 * Props: onNew().
 */

const EmptyMessages = ({ onNew }) => (
  <section
    aria-label="No messages yet"
    className="flex min-h-[420px] min-w-0 flex-col items-center justify-center gap-[10px] rounded-[24px] border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[24px] py-[64px] text-center font-sans xl:h-[845px]"
  >
    <span className="grid size-[48px] place-items-center rounded-full bg-[#ebf1ec] text-[#387440]">
      <MessagesIconFilter className="size-[24px]" />
    </span>
    <h2 className="m-0 pt-[10px] text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
      Send your first message
    </h2>
    <p className="m-0 max-w-[360px] text-[14px] leading-[20px] text-[#595959]">
      Message a class, a year group or a programme group. Guardians of under-18s get a copy by SMS.
    </p>
    <div className="pt-[10px]">
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        className="!rounded-[14px] !px-[22px] !py-[12px] !text-[16px] !font-bold"
        onClick={onNew}
      >
        New message
      </Button>
    </div>
  </section>
);

export default EmptyMessages;
