import { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  WalletArrowUpRightIcon,
  WalletBookIcon,
  WalletCardIcon,
  WalletChartLineIcon,
  WalletStarIcon,
} from '../../shared/assets.jsx';
import spotPending from '../../../assets/talent-wallet/spot-pending.svg';
import { PARENT_REQUEST, UNDER18 } from './walletCyclesData.js';
import { ModalButtons, ModalHead, WalletModal } from './WalletDialogParts.jsx';
import { GreenLink } from './WalletPanels.jsx';
import { CAPS_LABEL, HEADING, HERO_CARD, PLAIN_CARD, WalletButton } from './walletUi.jsx';

const log = debug('WalletUnder18');

const CAN_ICONS = {
  star: WalletStarIcon,
  chart: WalletChartLineIcon,
  book: WalletBookIcon,
  out: WalletArrowUpRightIcon,
  card: WalletCardIcon,
};

/*
 * W-17 "Under 18 · Starter wallet" (Playful 8822:5399 / Focused 8823:5394; Main Content Canvas 8822:5407), URL `?state=under18`.
 * W-18 draws the same page (Main Content Canvas 8862:464520) behind "Sent to Mrs Agyekum" — `&modal=parent`.
 * Props: wallet (useTalentWalletState()).
 */
const WalletUnder18 = () => {
  const navigate = useNavigate();
  const u = UNDER18;
  log('render');
  return (
    <div className="grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_clamp(260px,19.7vw,340px)]">
      <div className="flex min-w-0 flex-col gap-[18px]">
        <section
          aria-label="Starter wallet balance"
          className={classNames(
            'flex min-h-[239px] flex-col gap-[18px] rounded-[26px] bg-white px-[clamp(16px,1.4vw,24px)] py-[22px]',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0 text-[#387440]')}>{u.balanceLabel}</p>
          <p
            className={classNames(
              HEADING,
              'm-0 text-[clamp(34px,2.55vw,44px)] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
            )}
          >
            {u.balance}
          </p>
          <p className="m-0 max-w-[700px] font-sans text-[14px] leading-[1.2] text-[#575755]">
            {u.limit}
          </p>
          <div className="flex flex-wrap gap-[12px]">
            <WalletButton
              tone="primary"
              onClick={() => log('ask for a top up (no screen is drawn)')}
            >
              {u.actions.topUp}
            </WalletButton>
            <WalletButton onClick={() => log('redeem cycles (no destination in the prototype)')}>
              {u.actions.redeem}
            </WalletButton>
          </div>
        </section>

        <h2 className={classNames(HEADING, 'm-0 text-[22px] leading-[1.25] text-[#1c2a21]')}>
          {u.can.title}
        </h2>
        <ul className="m-0 grid list-none gap-[14px] p-0 sm:grid-cols-2 lg:grid-cols-5">
          {u.can.items.map((c) => {
            const Icon = CAN_ICONS[c.icon];
            return (
              <li
                key={c.id}
                className={classNames(
                  'flex flex-col gap-[8px] rounded-[16px] p-[14px]',
                  c.locked ? 'bg-[#f1f1ee] text-[#999]' : 'bg-[#f4f7f2] text-[#387455]'
                )}
              >
                <Icon className="size-[20px]" />
                <span
                  className={classNames(
                    'font-sans text-[14px] font-semibold leading-[1.2]',
                    c.locked ? 'text-[#575755]' : 'text-[#1c2a21]'
                  )}
                >
                  {c.title}
                </span>
                <span className="font-sans text-[12px] leading-[1.2] text-[#575755]">{c.text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex min-w-0 flex-col gap-[16px]">
        <section
          aria-label={u.parent.label}
          className={classNames(
            PLAIN_CARD,
            'flex flex-col items-start gap-[16px] p-[18px] playful:gap-[14px]'
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0 text-[#575755]')}>{u.parent.label}</p>
          <p className={classNames(HEADING, 'm-0 text-[18px] leading-[1.25] text-[#1c2a21]')}>
            {u.parent.name}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">{u.parent.text}</p>
          <GreenLink
            className="!whitespace-normal !text-[13px]"
            onClick={() => {
              log('manage in settings -> /settings/guardian');
              navigate('/settings/guardian');
            }}
          >
            {u.parent.link}
          </GreenLink>
        </section>
        <section
          aria-label={u.at18.label}
          className={classNames(
            'flex flex-col gap-[16px] rounded-[24px] bg-[#387440] p-[20px] text-white playful:gap-[14px]',
            HERO_CARD
          )}
        >
          <p className={classNames(CAPS_LABEL, 'm-0')}>{u.at18.label}</p>
          <p className="m-0 font-sans text-[13px] leading-[1.2]">{u.at18.text}</p>
        </section>
      </div>
    </div>
  );
};

/* W-18 "Sent to Mrs Agyekum" (Playful 8822:6185 / Focused 8823:6170; modal 8822:6869), URL `?state=under18&modal=parent`. */
export const ParentRequestDialog = ({ wallet }) => {
  const uid = useId();
  const close = () => {
    log('close parent request');
    wallet.update({ modal: null });
  };
  return (
    <WalletModal width="max-w-[520px]" gaps={[16, 16]} labelledBy={`${uid}-t`} onClose={close}>
      <ModalHead
        id={`${uid}-t`}
        title={PARENT_REQUEST.title}
        subtitle={PARENT_REQUEST.subtitle}
        art={spotPending}
        onClose={close}
      />
      <dl className="m-0 flex flex-col gap-[16px] rounded-[16px] bg-[#f4f7f2] p-[16px] font-sans text-[14px] leading-[1.2]">
        {PARENT_REQUEST.rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-[12px]">
            <dt className="text-[#575755]">{r.label}</dt>
            <dd
              className={classNames(
                'm-0 text-right font-semibold',
                r.tone === 'amber' ? 'text-[#c8951a]' : 'text-[#32683a] playful:text-[#2d5d33]'
              )}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="m-0 font-sans text-[14px] leading-[1.2] text-[#575755]">
        {PARENT_REQUEST.text}
      </p>
      <ModalButtons>
        <WalletButton onClick={close}>{PARENT_REQUEST.cancel}</WalletButton>
        <WalletButton tone="primary" onClick={close}>
          {PARENT_REQUEST.ok}
        </WalletButton>
      </ModalButtons>
    </WalletModal>
  );
};

export default WalletUnder18;
