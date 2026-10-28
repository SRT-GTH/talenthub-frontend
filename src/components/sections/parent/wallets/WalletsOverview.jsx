import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import ParentButton from '../ParentButton.jsx';
import WardChip from '../wards/WardChip.jsx';
import TabRow from '../wards/tabs/TabRow.jsx';
import abenaPhoto from '../../../../assets/parent/abena.webp';
import elliotPhoto from '../../../../assets/parent/elliot.webp';
import walletIcon from '../../../../assets/parent/wallets-icon-wallet.svg';
import arrowIn from '../../../../assets/parent/wallets-arrow-in.svg';
import arrowOut from '../../../../assets/parent/wallets-arrow-out.svg';
import {
  ELLIOT_ASKS,
  HISTORY,
  LIMITS_COPY,
  PAGE,
  ghs,
  requestRow,
  walletLine,
} from './data/walletsData.js';

const log = debug('WalletsOverview');

/*
 * WalletsOverview — the body of /parent/wallets "Ward wallets" (Figma PWa-01 10034:151435 and its state variants PWa-03 / 04b / 07 / 08b): h1 34/600 over the 16 #999 line; left (945) the "Abena’s Starter wallet"
 * card (white r24 p22 gap16, #e7e7e7 line: 44px photo + 20/600 title over the 13 #575755 summary, the request row, two history rows) and the Elliot card (44px photo, 18/600 title, 13 line);
 * right (360) the "Limits" card (p22 gap14: 18/600 title, a #f8f8f4 r14 panel of three 14px rows with #387440 600 values, "Change limits").
 * The request row (#faf4e8 r16 p16 gap14, 22px wallet icon, 15/600 over 13) is "Abena wants to pay GHS 90.00" with Decline + Approve while pending, then "You approved…" on mint (chip Approved),
 * "You declined…" (chip Declined) or "Request expired…" (chip Expired) on #f8f8f4. Once Elliot’s wallet is open his card is "Elliot’s Starter wallet" with his balance (PWa-08b).
 * Props: wards { abena, elliot } (wardsData), wallets (walletsStore state), onApprove, onDecline, onLimits, onOpenElliot.
 * ⚠️ ASSUMPTION: Elliot’s card is a button that opens PWa-08 (the frames draw no control there); top-up is started from the Wallet tab of the ward page, as PW-12 draws it.
 * Layout: the Limits card sits right from 1024px and below the wallet cards under it; the request row wraps its buttons under the text on a phone.
 */
const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] shadow-[0_5px_17px_rgba(28,42,33,0.03)]';

const Photo = ({ src }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    className="size-[44px] shrink-0 rounded-full object-cover"
  />
);

const WalletsOverview = ({ wards, wallets, onApprove, onDecline, onLimits, onOpenElliot }) => {
  const abena = wallets.abena;
  const elliot = wallets.elliot;
  const r = abena.request;
  const row = requestRow(wards.abena, r);
  log('render', { request: r.status, elliot: elliot.opened });

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          {PAGE.title}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
          {PAGE.subtitle}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-[24px] lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-col gap-[20px] lg:flex-[945_1_0]">
          <section
            aria-labelledby="wallet-abena"
            className={`flex flex-col ${r.status === 'approved' || r.status === 'declined' ? 'gap-[14px]' : 'gap-[16px]'} ${CARD}`}
          >
            <div className="flex items-center gap-[12px]">
              <Photo src={abenaPhoto} />
              <div className="flex min-w-0 flex-col gap-[2px]">
                <h2
                  id="wallet-abena"
                  className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#1c2a21]"
                >
                  {wards.abena.firstName}’s Starter wallet
                </h2>
                <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">
                  {walletLine(abena)}
                </p>
              </div>
            </div>

            <div
              className={`flex flex-wrap items-center gap-x-[14px] gap-y-[12px] rounded-[16px] p-[16px] ${row.bg}`}
            >
              <img src={walletIcon} alt="" aria-hidden="true" className="size-[22px] shrink-0" />
              <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
                <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {row.title}
                </p>
                <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">{row.sub}</p>
              </div>
              {r.status === 'pending' ? (
                <div className="flex items-center gap-[14px]">
                  <ParentButton variant="secondary" onClick={onDecline}>
                    Decline
                  </ParentButton>
                  <Button size="sm" onClick={onApprove}>
                    Approve
                  </Button>
                </div>
              ) : (
                <WardChip tone={row.tone}>{row.chip}</WardChip>
              )}
            </div>

            <ul className="m-0 flex list-none flex-col p-0">
              {HISTORY.map((h, i) => (
                <TabRow
                  key={h.id}
                  size="roomy"
                  icon={h.icon === 'in' ? arrowIn : arrowOut}
                  title={h.title}
                  sub={h.sub}
                  last={i === HISTORY.length - 1}
                >
                  <WardChip tone={h.tone}>{h.chip}</WardChip>
                </TabRow>
              ))}
            </ul>
          </section>

          {elliot.opened ? (
            <section aria-label={`${wards.elliot.firstName}’s Starter wallet`} className={CARD}>
              <div className="flex items-center gap-[12px]">
                <Photo src={elliotPhoto} />
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <h2 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
                    {wards.elliot.firstName}’s Starter wallet
                  </h2>
                  <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">
                    Balance {ghs(elliot.balance)} · {elliot.cycles} Cycles · opened today · same
                    limits as {wards.abena.firstName}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <button
              type="button"
              onClick={onOpenElliot}
              className={`flex w-full cursor-pointer items-center gap-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${CARD}`}
            >
              <Photo src={elliotPhoto} />
              <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
                  {ELLIOT_ASKS.title}
                </span>
                <span className="font-sans text-[13px] leading-[16px] text-[#575755]">
                  {ELLIOT_ASKS.sub}
                </span>
              </span>
            </button>
          )}
        </div>

        <aside
          aria-labelledby="wallet-limits"
          className={`flex min-w-0 flex-col items-start gap-[14px] lg:w-[360px] lg:shrink-0 ${CARD}`}
        >
          <h2
            id="wallet-limits"
            className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
          >
            {LIMITS_COPY.title}
          </h2>
          <dl className="m-0 flex w-full flex-col gap-[10px] rounded-[14px] bg-[#f8f8f4] p-[14px]">
            {[
              [LIMITS_COPY.askAbove, ghs(abena.limits.askAbove)],
              [LIMITS_COPY.monthly, ghs(abena.limits.monthly)],
              [LIMITS_COPY.withdrawals, LIMITS_COPY.withdrawalsValue],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-[12px]">
                <dt className="font-sans text-[14px] leading-[20px] text-[#575755]">{k}</dt>
                <dd className="m-0 font-sans text-[14px] leading-[20px] font-semibold text-[#387440]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <ParentButton variant="secondary" onClick={onLimits}>
            {LIMITS_COPY.change}
          </ParentButton>
        </aside>
      </div>
    </div>
  );
};

export default WalletsOverview;
