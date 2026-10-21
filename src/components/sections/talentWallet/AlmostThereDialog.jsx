import { useId } from 'react';
import { debug } from '../../../utils/debug.js';
import spotReadiness from '../../../assets/talent-wallet/spot-readiness.svg';
import { ALMOST } from './walletCyclesData.js';
import { ModalButtons, ModalHead, WalletModal } from './WalletDialogParts.jsx';
import { Progress } from './WalletPanels.jsx';
import { StatusChip, WalletButton } from './walletUi.jsx';

const log = debug('AlmostThereDialog');

/*
 * W-15b "Redeem · Not enough Cycles yet" (Playful 8822:3258 / Focused 8823:3273; modal 8822:4133), URL `?tab=cycles&modal=redeem-short`.
 * Props: wallet (useTalentWalletState()).
 */
const AlmostThereDialog = ({ wallet }) => {
  const uid = useId();
  const close = () => {
    log('close');
    wallet.update({ modal: null });
  };
  return (
    <WalletModal width="max-w-[520px]" gaps={[16, 16]} labelledBy={`${uid}-t`} onClose={close}>
      <ModalHead
        id={`${uid}-t`}
        title={ALMOST.title}
        subtitle={ALMOST.subtitle}
        art={spotReadiness}
        onClose={close}
      />
      <Progress value={ALMOST.progress} fill="#f5c344" height={10} />
      <p className="m-0 font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
        {ALMOST.fastest}
      </p>
      {ALMOST.ways.map((w) => (
        <div
          key={w.id}
          className="flex items-center justify-between gap-[12px] rounded-[12px] bg-[#f4f7f2] p-[12px]"
        >
          <span className="font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
            {w.text}
          </span>
          <StatusChip tone="warn">{w.chip}</StatusChip>
        </div>
      ))}
      <ModalButtons>
        <WalletButton onClick={close}>{ALMOST.close}</WalletButton>
        <WalletButton
          tone="primary"
          onClick={() => {
            // Figma prototype: "Resume SQL module 5" navigates back (closes the dialog)
            log('resume SQL module 5 (no destination in the prototype)');
            close();
          }}
        >
          {ALMOST.resume}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default AlmostThereDialog;
