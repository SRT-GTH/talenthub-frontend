import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import spotCelebrate from '../../../assets/talent-wallet/spot-celebrate.svg';
import { ACTIVATED } from './walletKycData.js';
import { ModalButtons, ModalHead, WalletModal } from './WalletDialogParts.jsx';
import { HEADING, HERO_CARD, WalletButton } from './walletUi.jsx';

const log = debug('WalletActivated');

/*
 * W-05c "Wallet activated (modal)" (Playful 8819:464479 / Focused 8819:469860), URL `?state=activated`.
 * The page behind is the empty wallet home — Figma draws only the "GHS 0.00 · Available balance" card there. Prototype: "Go to my wallet"
 * navigates back (the wallet home); "Later" has no interaction and just closes the dialog.
 */
export const WalletEmptyHome = () => (
  <section
    aria-label="Available balance"
    className={classNames(
      'flex flex-col gap-[14px] whitespace-nowrap rounded-[26px] bg-white px-[clamp(16px,1.4vw,24px)] py-[22px] lg:max-w-[965px]',
      HERO_CARD
    )}
  >
    <p
      className={classNames(
        HEADING,
        'm-0 text-[clamp(34px,2.55vw,44px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
      )}
    >
      GHS 0.00
    </p>
    <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">Available balance</p>
  </section>
);

const ActivatedDialog = ({ wallet }) => {
  const uid = useId();
  const close = () => {
    log('close');
    wallet.update({ state: null, modal: null });
  };
  return (
    <WalletModal
      width="max-w-[560px]"
      gaps={[24, 24]}
      labelledBy={`${uid}-t`}
      onClose={() => wallet.update({ modal: 'closed' })}
    >
      <ModalHead
        id={`${uid}-t`}
        title={ACTIVATED.title}
        subtitle={ACTIVATED.subtitle}
        onClose={() => wallet.update({ modal: 'closed' })}
      />
      <div className="flex flex-col items-center gap-[6px] rounded-[20px] bg-[#eef6f0] p-[20px]">
        <img src={spotCelebrate} alt="" className="size-[104px]" />
        <p className={classNames(HEADING, 'm-0 text-[22px] leading-[1.25] text-[#1c2a21]')}>
          {ACTIVATED.moved}
        </p>
        <p className="m-0 text-center font-sans text-[13px] leading-[1.2] text-[#575755]">
          {ACTIVATED.from}
        </p>
      </div>
      {ACTIVATED.tips.map((t) => (
        <p
          key={t}
          className="m-0 w-fit rounded-full bg-[#f1f1ee] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2] text-[#575755]"
        >
          {t}
        </p>
      ))}
      <ModalButtons>
        <WalletButton tone="primary" onClick={close}>
          {ACTIVATED.go}
        </WalletButton>
        <WalletButton onClick={() => wallet.update({ modal: 'closed' })}>
          {ACTIVATED.later}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default ActivatedDialog;
