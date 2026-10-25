import Button from '../../../ui/Button.jsx';
import { InstitutionArrowRightIcon } from '../institutionIcons.jsx';
import { MessagesIconClock, MessagesIconWarning } from './messagesIcons.jsx';

/*
 * ThreadBanner — the strip above the timeline of a thread (Figma 11.3.3e scheduled 8745:429562 and 11.3.3f delivery problem 8745:429983: 902 x 76, r12, p 12/14, gap 12):
 *   scheduled  #faf4e8, clock #967014, "Scheduled for Monday 26 Oct, 07:00" 14/600 + the sentence 12 #575755, "Edit" (#e1eae2, 2px #c1d4c4, r14) + "Send now →" (green)
 *   problem    #f9ebea, warning #c0392b, "12 guardians didn’t get the SMS" + sentence, "See the 12" + "Retry now →"
 * ⚠️ ASSUMPTION (retry): after "Retry now" the strip turns into a status line (role="status") while the retry runs, then "Retried: 9 delivered. 3 numbers still look wrong." with "See the 3".
 * Props: tone ('scheduled' | 'problem' | 'retrying' | 'retried'), title, sentence, secondary {label, onClick}, primary {label, onClick}.
 */

const TONES = {
  scheduled: { box: 'bg-[#faf4e8]', icon: 'text-[#967014]', Icon: MessagesIconClock },
  problem: { box: 'bg-[#f9ebea]', icon: 'text-[#c0392b]', Icon: MessagesIconWarning },
  retrying: { box: 'bg-[#faf4e8]', icon: 'text-[#967014]', Icon: MessagesIconClock },
  retried: { box: 'bg-[#f9ebea]', icon: 'text-[#c0392b]', Icon: MessagesIconWarning },
};

const ThreadBanner = ({ tone, title, sentence, secondary, primary }) => {
  const t = TONES[tone];
  const Icon = t.Icon;
  return (
    <div
      role={tone === 'retrying' || tone === 'retried' ? 'status' : undefined}
      className={`flex flex-wrap items-center gap-x-[12px] gap-y-[10px] rounded-[12px] px-[14px] py-[12px] font-sans ${t.box}`}
    >
      <Icon className={`size-[18px] shrink-0 ${t.icon}`} />
      <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
        <p className="m-0 text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{title}</p>
        <p className="m-0 text-[12px] leading-[14px] text-[#575755] max-lg:text-[13px] max-lg:leading-[16px]">
          {sentence}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-[12px]">
        {secondary ? (
          <Button
            type="button"
            variant="tertiary-subtle"
            size="sm"
            className="!rounded-[14px] !border-2 !border-solid !border-[#c1d4c4] !bg-[#e1eae2] !px-[34px] !py-[14px] !text-[16px] !font-bold !text-[#165d3a]"
            onClick={secondary.onClick}
          >
            {secondary.label}
          </Button>
        ) : null}
        {primary ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
            rightIcon={<InstitutionArrowRightIcon className="size-[20px]" />}
            onClick={primary.onClick}
          >
            {primary.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ThreadBanner;
