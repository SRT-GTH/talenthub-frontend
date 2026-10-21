import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { WalletCheckLargeIcon, WalletUploadIcon } from '../../shared/assets.jsx';
import selfiePreview from '../../../assets/talent-wallet/selfie-camera-preview.jpg';
import selfieRing from '../../../assets/talent-wallet/selfie-face-guide-ring.png';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { KYC, KYC_STEP_LABELS } from './walletKycData.js';
import { KYC_STEPS } from './walletHeaders.js';
import { HeroCard } from './WalletPanels.jsx';
import { WalletField } from './WalletDialogParts.jsx';
import { HEADING, WalletButton } from './walletUi.jsx';

const log = debug('WalletKyc');

const TileIcon = ({ done }) =>
  done ? (
    <WalletCheckLargeIcon className="size-[20px]" />
  ) : (
    <WalletUploadIcon className="size-[20px] text-[#387455]" />
  );

/* Upload row (Figma `upload · …`): done = soft green + solid green border + check tile; empty = dashed + upload tile. */
export const UploadRow = ({ done, icon, title, sub, action, onAction, className }) => (
  <div
    className={classNames(
      'flex items-center gap-[14px] rounded-[16px] border border-solid p-[16px]',
      done ? 'border-[#387455] bg-[#eef6f0]' : 'border-dashed border-[#d9dcd3] bg-[#fafaf7]',
      className
    )}
  >
    <span
      className={classNames(
        'flex size-[44px] shrink-0 items-center justify-center rounded-[12px]',
        done ? 'bg-[#387455] text-white' : 'bg-[#eef4ef]'
      )}
    >
      {icon}
    </span>
    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <span className="font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
        {title}
      </span>
      <span className="font-sans text-[13px] leading-[1.2] text-[#575755]">{sub}</span>
    </span>
    <button
      type="button"
      onClick={onAction}
      aria-label={`${action} ${title}`}
      className={classNames(
        'min-h-[24px] shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[1.2] text-[#387440]',
        FOCUS_RING
      )}
    >
      {action}
    </button>
  </div>
);

const Stepper = ({ current }) => (
  <ol
    className="m-0 flex list-none flex-wrap items-center gap-[10px] p-0"
    aria-label="Set-up steps"
  >
    {KYC_STEP_LABELS.map((label, i) => {
      const done = i < current;
      const on = i === current;
      return (
        <li
          key={label}
          className="flex items-center gap-[10px]"
          aria-current={on ? 'step' : undefined}
        >
          <span className="flex items-center gap-[8px]">
            <span
              aria-hidden="true"
              className={classNames(
                'flex size-[26px] items-center justify-center rounded-full font-sans text-[12px] font-semibold leading-[1.2]',
                done || on ? 'bg-[#387455] text-white' : 'bg-[#eceee9] text-[#575755]'
              )}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={classNames(
                'whitespace-nowrap font-sans text-[13px] leading-[1.2]',
                on
                  ? 'font-semibold text-[#1c2a21]'
                  : done
                    ? 'font-medium text-[#1c2a21]'
                    : 'font-medium text-[#575755]'
              )}
            >
              {label}
            </span>
          </span>
          {i < KYC_STEP_LABELS.length - 1 ? (
            <span
              aria-hidden="true"
              className="h-[2px] w-[40px] overflow-hidden rounded-full bg-[#eceee9] max-sm:hidden"
            >
              <span
                className="block h-[2px] rounded-full bg-[#387455]"
                style={{ width: done ? 40 : 2 }}
              />
            </span>
          ) : null}
        </li>
      );
    })}
  </ol>
);

const StepTitle = ({ title, text }) => (
  <>
    <h2 className={classNames(HEADING, 'm-0 text-[28px] leading-[1.25] text-[#1c2a21]')}>
      {title}
    </h2>
    <p className="m-0 max-w-[820px] font-sans text-[15px] leading-[1.2] text-[#575755]">{text}</p>
  </>
);

/*
 * KYC steps (Figma W-02 8819:460851 / W-03 8819:461601 / W-04 8819:462350, Focused 8819:466282 / 467022 / 467761),
 * URL `?view=kyc&step=card|address|selfie`. Mock only: the number, the uploads and the selfie are never sent.
 * Props: wallet (useTalentWalletState()).
 */
const WalletKyc = ({ wallet }) => {
  const step = KYC_STEPS.includes(wallet.step) ? wallet.step : 'card';
  const index = KYC_STEPS.indexOf(step);
  const [cardNo, setCardNo] = useState(KYC.card.value);
  const [front, setFront] = useState(KYC.card.front.done);
  const [back, setBack] = useState(KYC.card.back.done);
  const [kind, setKind] = useState(KYC.address.kinds[0]);
  const [gps, setGps] = useState(KYC.address.value);
  const [proof, setProof] = useState(true);
  log('render', { step });

  const go = (to) => wallet.update({ view: 'kyc', step: to, state: null });
  const goBack = () =>
    index === 0
      ? wallet.update({ view: null, step: null, state: 'new' })
      : go(KYC_STEPS[index - 1]);
  const goNext = () =>
    index === KYC_STEPS.length - 1
      ? wallet.update({ view: null, step: null, state: 'checking' })
      : go(KYC_STEPS[index + 1]);

  return (
    <HeroCard aria-label="Set up your wallet">
      <Stepper current={index} />
      {step === 'card' ? (
        <>
          <StepTitle title={KYC.card.title} text={KYC.card.text} />
          <WalletField
            label={KYC.card.field}
            value={cardNo}
            onChange={setCardNo}
            hint={KYC.card.hint}
          />
          <div className="grid gap-[14px] md:grid-cols-2">
            <UploadRow
              done={front}
              icon={<TileIcon done={front} />}
              title={KYC.card.front.title}
              sub={KYC.card.sub}
              action={front ? KYC.card.replace : KYC.card.upload}
              onAction={() => setFront(true)}
            />
            <UploadRow
              done={back}
              icon={<TileIcon done={back} />}
              title={KYC.card.back.title}
              sub={KYC.card.sub}
              action={back ? KYC.card.replace : KYC.card.upload}
              onAction={() => setBack(true)}
            />
          </div>
        </>
      ) : null}
      {step === 'address' ? (
        <>
          <StepTitle title={KYC.address.title} text={KYC.address.text} />
          <div
            role="radiogroup"
            aria-label="Proof of address"
            className="flex flex-wrap gap-[10px]"
          >
            {KYC.address.kinds.map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={k === kind}
                onClick={() => setKind(k)}
                className={classNames(
                  'inline-flex min-h-[24px] cursor-pointer items-center rounded-full border-0 px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2]',
                  FOCUS_RING,
                  k === kind ? 'bg-[#1c2a21] text-white' : 'bg-[#f1f1ee] text-[#575755]'
                )}
              >
                {k}
              </button>
            ))}
          </div>
          <WalletField
            label={KYC.address.field}
            value={gps}
            onChange={setGps}
            hint={KYC.address.hint}
          />
          <UploadRow
            done={proof}
            icon={<TileIcon done={proof} />}
            title={KYC.address.file.title}
            sub={KYC.address.file.sub}
            action={KYC.address.replace}
            onAction={() => setProof(true)}
          />
        </>
      ) : null}
      {step === 'selfie' ? (
        <>
          <StepTitle title={KYC.selfie.title} text={KYC.selfie.text} />
          <div className="flex flex-col gap-[20px] lg:flex-row lg:items-center">
            {/* The camera frame is drawn as a still photo (mock only, no camera is opened). */}
            <div className="relative h-[300px] min-w-0 overflow-hidden rounded-[24px] bg-[#1c2a21] lg:w-[clamp(420px,57.7vw,997px)] lg:flex-none">
              <img
                src={selfiePreview}
                alt="Camera preview showing a smiling man in a green t-shirt"
                className="absolute inset-0 size-full object-cover"
              />
              <img
                src={selfieRing}
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-[5px] h-[250px] w-auto max-w-none -translate-x-1/2"
              />
              <p className="absolute inset-x-0 top-[270px] m-0 text-center font-sans text-[13px] font-medium leading-[1.2] text-white">
                {KYC.selfie.caption}
              </p>
            </div>
            <ul className="m-0 flex shrink-0 list-none flex-col gap-[16px] p-0">
              {KYC.selfie.tips.map((t) => (
                <li
                  key={t}
                  className="w-fit rounded-full bg-[#e8f2ed] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2] text-[#387440]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
          {step === 'selfie' ? KYC.selfie.footer : KYC.footer}
        </p>
        <div className="flex gap-[12px]">
          <WalletButton onClick={goBack}>{KYC.back}</WalletButton>
          <WalletButton tone="primary" onClick={goNext}>
            {step === 'selfie' ? KYC.selfie.submit : KYC.next}
          </WalletButton>
        </div>
      </div>
    </HeroCard>
  );
};

export default WalletKyc;
