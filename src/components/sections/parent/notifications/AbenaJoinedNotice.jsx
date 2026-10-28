import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import { JOINED_NOTICE } from './data/notificationsData.js';

const log = debug('AbenaJoinedNotice');

const Bullets = ({ items }) => (
  <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
    {items.map((text) => (
      <li
        key={text}
        className="flex gap-[0] text-[13px] leading-[18px] whitespace-pre text-[#575755]"
      >
        <span aria-hidden="true">{'·  '}</span>
        <span className="whitespace-normal">{text}</span>
      </li>
    ))}
  </ul>
);

/*
 * AbenaJoinedNotice — PN-05b "Abena created a GTH account (in-app notice)" (Figma 10079:1025, modal 10079:1680): a 640 wide modal over the parent home (p28, gap16, r24).
 * Top row: Spot ward 80 + a close button; title 24/600; 14/400 #575755 body; two cards side by side (She can on #ebf1ec, She can't on #f8f8f4; 18 padding, r24, 15/600 title, 13/400 bullet lines);
 * a 13/400 note; "Opt Abena out" (secondary) and "That's fine" (primary), right-aligned. Rendered by the home page for `?notice=abena-joined`.
 * Props: onClose.
 * ⚠️ ASSUMPTION: the modal is centred in the viewport (Figma pins it 210px under the top of the page); "Opt Abena out" opens the existing opt-out dialog on Abena's ward page (/parent/wards/abena?modal=opt-out); "That's fine" and the close button just close the notice.
 */
const AbenaJoinedNotice = ({ onClose }) => (
  <DialogCard label={JOINED_NOTICE.title} onClose={onClose} width={640} padding={28} gap={16}>
    <div className="flex items-start justify-between">
      <img src={JOINED_NOTICE.spot} alt="" className="size-[80px]" />
      <DialogCloseButton onClose={onClose} />
    </div>
    <h2 className="m-0 text-[24px] leading-[29px] font-semibold text-[#1c2a21]">
      {JOINED_NOTICE.title}
    </h2>
    <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{JOINED_NOTICE.body}</p>
    <div className="grid grid-cols-2 gap-[12px] max-sm:grid-cols-1">
      <section className="flex flex-col gap-[8px] rounded-[24px] bg-[#ebf1ec] p-[18px]">
        <h3 className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {JOINED_NOTICE.can.title}
        </h3>
        <Bullets items={JOINED_NOTICE.can.items} />
      </section>
      <section className="flex flex-col gap-[8px] rounded-[24px] bg-[#f8f8f4] p-[18px]">
        <h3 className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {JOINED_NOTICE.cannot.title}
        </h3>
        <Bullets items={JOINED_NOTICE.cannot.items} />
      </section>
    </div>
    <p className="m-0 text-[13px] leading-[19px] text-[#575755]">{JOINED_NOTICE.note}</p>
    <div className="flex flex-wrap items-center justify-end gap-[12px]">
      <ParentButton variant="secondary" to={JOINED_NOTICE.optOutTo} onClick={() => log('opt out')}>
        {JOINED_NOTICE.optOut}
      </ParentButton>
      <ParentButton
        onClick={() => {
          log('close: that’s fine');
          onClose();
        }}
      >
        {JOINED_NOTICE.fine}
      </ParentButton>
    </div>
  </DialogCard>
);

export default AbenaJoinedNotice;
