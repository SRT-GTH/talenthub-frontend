import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import {
  WalletArrowDownLeftIcon,
  WalletChartLineIcon,
  WalletStarIcon,
  WalletUploadIcon,
} from '../../shared/assets.jsx';
import spotWallet from '../../../assets/talent-wallet/spot-wallet.svg';
import spotPending from '../../../assets/talent-wallet/spot-pending.svg';
import spotUpload from '../../../assets/talent-wallet/spot-upload.svg';
import { CHECKING, NEW_WALLET, RETAKE } from './walletKycData.js';
import { HeroCard, HeroHead, InfoTile, TimelineRow } from './WalletPanels.jsx';
import { UploadRow } from './WalletKyc.jsx';
import { WalletButton } from './walletUi.jsx';

const log = debug('WalletOnboarding');

const BENEFIT_ICONS = {
  in: WalletArrowDownLeftIcon,
  star: WalletStarIcon,
  chart: WalletChartLineIcon,
};

/*
 * W-01 "Wallet · Not set up yet" (Playful 8819:460112 / Focused 8819:465553), URL `?state=new`.
 * Benefit tiles, then "Set up my wallet" which starts the three KYC steps (`?view=kyc`).
 */
export const WalletNotSetUp = ({ wallet }) => {
  log('render new');
  return (
    <HeroCard aria-label="Set up your wallet">
      <HeroHead
        art={spotWallet}
        chip={{ tone: 'ok', text: NEW_WALLET.chip }}
        title={NEW_WALLET.title}
        titleClass="text-[clamp(26px,1.97vw,34px)] tracking-[-0.02em]"
        textClass="text-[16px]"
        text={NEW_WALLET.text}
      />
      <div className="grid gap-[14px] md:grid-cols-3">
        {NEW_WALLET.benefits.map((b) => {
          const Icon = BENEFIT_ICONS[b.icon];
          return (
            <InfoTile key={b.id} className="flex flex-col gap-[12px]">
              <Icon className="size-[22px] text-[#387455]" />
              <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
                {b.title}
              </p>
              <p className="m-0 max-w-[250px] font-sans text-[13px] leading-[1.2] text-[#575755]">
                {b.text}
              </p>
            </InfoTile>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-[12px]">
        <WalletButton
          tone="primary"
          onClick={() => {
            log('start KYC');
            wallet.update({ state: null, view: 'kyc', step: 'card' });
          }}
        >
          {NEW_WALLET.cta}
        </WalletButton>
        <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{NEW_WALLET.note}</p>
      </div>
    </HeroCard>
  );
};

/* W-05 "KYC submitted · Checking" (Playful 8819:463073 / Focused 8819:468474), URL `?state=checking`. */
export const WalletChecking = () => {
  const navigate = useNavigate();
  log('render checking');
  return (
    <HeroCard gap={18} aria-label="We are checking your details">
      <HeroHead
        art={spotPending}
        headGap={18}
        chip={{ tone: 'warn', text: CHECKING.chip }}
        title={CHECKING.title}
        text={CHECKING.text}
      />
      <div className="flex flex-col gap-[20px]">
        {CHECKING.timeline.map((t) => (
          <TimelineRow key={t.id} dot={t.dot} label={t.label} note={t.note} />
        ))}
      </div>
      <div>
        <WalletButton onClick={() => navigate('/home')}>{CHECKING.back}</WalletButton>
      </div>
    </HeroCard>
  );
};

/* W-05b "KYC · Needs a new photo" (Playful 8819:463777 / Focused 8819:469168), URL `?state=retake`. */
export const WalletRetake = ({ wallet }) => {
  log('render retake');
  // Figma prototype: "Upload a new photo" → W-02 (KYC step 1, Ghana Card)
  const retry = () => {
    log('upload a new photo -> W-02');
    wallet.update({ state: null, view: 'kyc', step: 'card' });
  };
  return (
    <HeroCard aria-label="One quick fix">
      <HeroHead
        art={spotUpload}
        chip={{ tone: 'bad', text: RETAKE.chip }}
        title={RETAKE.title}
        text={RETAKE.text}
      />
      <UploadRow
        done={false}
        icon={<WalletUploadIcon className="size-[20px] text-[#387455]" />}
        title={RETAKE.upload.title}
        sub={RETAKE.upload.sub}
        action={RETAKE.upload.action}
        onAction={() => log('upload (no destination in the prototype)')}
      />
      <div className="flex flex-wrap gap-[12px]">
        <WalletButton tone="primary" onClick={retry}>
          {RETAKE.primary}
        </WalletButton>
        <WalletButton
          onClick={() => {
            log('talk to support -> help contact');
            wallet.update({ help: 'contact' });
          }}
        >
          {RETAKE.secondary}
        </WalletButton>
      </div>
    </HeroCard>
  );
};
