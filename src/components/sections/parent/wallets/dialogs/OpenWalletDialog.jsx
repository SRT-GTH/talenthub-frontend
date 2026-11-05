import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ParentButton from '../../ParentButton.jsx';
import spotCoins from '../../../../../assets/parent/help-spot-salary.svg';
import check from '../../../../../assets/parent/wallets-check.svg';
import { OPEN_WALLET_COPY as C } from '../data/walletsData.js';

/*
 * OpenWalletDialog — PWa-08 "Elliot wants a Starter wallet" (Figma 10053:2986): 540 wide, p28, gap16, r24; 80px coins art + green-tone close, 24/600 title, 14/20 body, a mint #ebf1ec list (r24, p18, gap16: 18px check
 * + 13.5/500 line) of the three terms, "Not now" + "Open Elliot’s wallet".
 * Props: ward ({ firstName }), cycles, onClose, onOpen.
 */
const OpenWalletDialog = ({ ward, cycles, onClose, onOpen }) => {
  const title = C.title(ward);
  return (
    <DialogCard label={title} onClose={onClose} width={540} gap={16} className="items-start">
      <div className="flex w-full items-start justify-between">
        <img src={spotCoins} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
        <DialogCloseButton onClose={onClose} />
      </div>
      <h2 className="m-0 w-full text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
        {title}
      </h2>
      <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{C.body(cycles)}</p>
      <ul className="m-0 flex w-full list-none flex-col gap-[16px] rounded-[24px] bg-[#ebf1ec] p-[18px]">
        {C.points.map((p) => (
          <li key={p} className="flex items-start gap-[10px]">
            <img src={check} alt="" aria-hidden="true" className="mt-[1px] size-[18px] shrink-0" />
            <span className="text-[13.5px] leading-[16px] font-medium text-[#1c2a21]">{p}</span>
          </li>
        ))}
      </ul>
      <div className="flex w-full flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onClose}>
          {C.later}
        </ParentButton>
        <ParentButton onClick={onOpen}>{C.open(ward)}</ParentButton>
      </div>
    </DialogCard>
  );
};

export default OpenWalletDialog;
