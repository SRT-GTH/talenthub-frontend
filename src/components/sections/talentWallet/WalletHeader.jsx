import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  WalletHourglassIcon,
  WalletKycShieldIcon,
  WalletListBulletIcon,
  WalletStarIcon,
  WalletWarningIcon,
} from '../../shared/assets.jsx';
import headSparkle from '../../../assets/notifications/icons/head-sparkle.svg';
import headFlame from '../../../assets/notifications/icons/head-flame.svg';
import headDoodleGold from '../../../assets/notifications/icons/head-doodle-gold.svg';
import headDoodleGreen from '../../../assets/notifications/icons/head-doodle-green.svg';
import headDoodleSquiggle from '../../../assets/notifications/icons/head-doodle-squiggle.svg';
import headDoodleRing from '../../../assets/notifications/icons/head-doodle-ring.svg';
import face1 from '../../../assets/notifications/avatars/face-1.png';
import face2 from '../../../assets/notifications/avatars/face-2.png';
import face3 from '../../../assets/notifications/avatars/face-3.png';
import face4 from '../../../assets/notifications/avatars/face-4.png';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { HEADING, KycSticker } from './walletUi.jsx';

const log = debug('WalletHeader');
const FACES = [face1, face2, face3, face4];
const PILL_SHADOW = 'shadow-[0_6px_14px_rgba(31,69,38,0.16)]';
const WRAP = 'absolute flex items-center justify-center';

/*
 * Playful-only decorative art (Figma component "GTH · Messages header art" 8856:621, reused with Wallet copy): recruiter faces,
 * "MTN MoMo linked" pill, green "Get paid in minutes" sticker (5°), amber "+200 Cycles this week" sticker (-4°), doodles.
 * Decorative (aria-hidden); Focused draws none; hidden below 1200px where it would not fit. Absolute positions (px from the art box):
 * faces (0,30) 124x40 · pill (136,36) · sticker (337.21,2) · amber (430,35.61) · gold (574,0) · green (316,46) · squiggle (298,10) · ring (250,6).
 */
const STICKER_ICONS = {
  shield: WalletKycShieldIcon,
  star: WalletStarIcon,
  list: WalletListBulletIcon,
  hourglass: WalletHourglassIcon,
  warning: WalletWarningIcon,
  starter: WalletKycShieldIcon, // sticker instance `icon/20-shield`, as on the KYC verified sticker
};

const HeaderArt = ({ art }) => (
  <div
    aria-hidden="true"
    data-doodle=""
    className="pointer-events-none absolute right-0 top-[-2px] hidden h-[84px] w-[600px] playful:min-[1200px]:block"
  >
    <div className="absolute left-0 top-[30px] h-[40px] w-[124px]">
      {FACES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute top-[-3px] block size-[46px] max-w-none"
          style={{ left: i * 28 - 3 }}
        />
      ))}
    </div>
    <div
      className={classNames(
        'absolute left-[136px] top-[36px] flex items-center gap-[6px] overflow-clip rounded-[100px] border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px]',
        PILL_SHADOW
      )}
    >
      <span className="size-[8px] rounded-full bg-[#349643]" />
      <span className="whitespace-nowrap font-sans text-[12px] leading-[1.2] tracking-[0.2px] text-[#1c2a21]">
        {art.linked}
      </span>
    </div>
    <div className={classNames(WRAP, 'left-[337.21px] top-[2px] h-[48.089px] w-[188.081px]')}>
      <div className="rotate-[5deg]">
        <div
          className={classNames(
            'flex items-center gap-[6px] overflow-clip rounded-[100px] bg-[#387440] px-[14px] py-[8px]',
            PILL_SHADOW
          )}
        >
          <img src={headSparkle} alt="" className="size-[14px]" />
          <span className="whitespace-nowrap font-sans text-[13px] font-medium leading-[1.2] tracking-[0.2px] text-white">
            {art.sticker}
          </span>
        </div>
      </div>
    </div>
    <div className={classNames(WRAP, 'left-[430px] top-[35.61px] h-[41.318px] w-[150.799px]')}>
      <div className="-rotate-[4deg]">
        <div
          className={classNames(
            'flex items-center gap-[6px] overflow-clip rounded-[100px] border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px]',
            PILL_SHADOW
          )}
        >
          <img src={headFlame} alt="" className="size-[14px]" />
          <span className="whitespace-nowrap font-sans text-[12px] font-semibold leading-[1.2] tracking-[0.2px] text-[#c8951a]">
            {art.week}
          </span>
        </div>
      </div>
    </div>
    <img src={headDoodleGold} alt="" className="absolute left-[574px] top-0 size-[22px]" />
    <img src={headDoodleGreen} alt="" className="absolute left-[316px] top-[46px] size-[12px]" />
    <div className={classNames(WRAP, 'left-[298.05px] top-[10px] h-[20.266px] w-[47.501px]')}>
      <img src={headDoodleSquiggle} alt="" className="h-[14px] w-[46px] max-w-none rotate-[8deg]" />
    </div>
    <img src={headDoodleRing} alt="" className="absolute left-[250px] top-[6px] size-[14px]" />
  </div>
);

/*
 * WalletHeader — title row (Wallet + KYC verified sticker), subtitle and the five-tab strip. Main column x343 w1329, gap 24.
 * Tabs 15px (Semibold #387440 + 3px green underline when selected, Medium #737373 otherwise); counts are 11.5px pills
 * (amber on the selected tab, soft green otherwise).
 * Props: wallet (useTalentWalletState()).
 */
const WalletHeader = ({ header }) => {
  log('render', { title: header.title, sticker: header.sticker.label });
  const StickerIcon = STICKER_ICONS[header.sticker.icon] ?? WalletKycShieldIcon;
  return (
    <>
      <div
        className={classNames(
          'relative flex flex-col gap-[3px]',
          header.shortTitleRow ? 'min-h-[54px] playful:min-h-[69px]' : 'min-h-[69px]'
        )}
      >
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
          <h1
            className={classNames(
              HEADING,
              'm-0 text-[clamp(26px,1.97vw,34px)] tracking-[-0.02em] text-[#1c2a21]',
              header.shortTitleRow ? 'leading-[26px] playful:leading-[1.2]' : 'leading-[1.2]'
            )}
          >
            {header.title}
          </h1>
          <KycSticker icon={<StickerIcon className="size-[14px]" />}>
            {header.sticker.label}
          </KycSticker>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999] max-lg:text-[14px] max-lg:leading-[20px]">
          {header.subtitle}
        </p>
        <HeaderArt art={header.art} />
      </div>
    </>
  );
};

/* The five-tab strip (Figma `tabs` 8817:1303). Sits 18px above the page body, inside the 24px-gap main column. */
export const WalletTabs = ({ wallet, tabs, active }) => {
  return (
    <>
      <nav
        aria-label="Wallet sections"
        className="flex gap-[4px] overflow-x-auto border-0 border-b border-solid border-[#e1eae2] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-current={on ? 'page' : undefined}
              aria-label={t.count ? `${t.label}, ${t.count}` : t.label}
              onClick={() => {
                log('tab ->', t.id);
                const clear = {
                  tx: null,
                  view: null,
                  step: null,
                  stage: null,
                  modal: null,
                  toast: null,
                  filter: null,
                };
                // The under-18 wallet draws its Overview only (no Cycles / Savings frames): those tabs have no destination.
                if (wallet.state === 'under18') {
                  if (t.id === 'overview') wallet.update({ ...clear, tab: null });
                } else {
                  wallet.update({ ...clear, state: null, tab: t.id === 'overview' ? null : t.id });
                }
              }}
              className={classNames(
                'flex shrink-0 cursor-pointer items-center gap-[8px] whitespace-nowrap border-0 border-b-[3px] border-solid bg-transparent px-[14px] pb-[12px] pt-[10px] font-sans text-[15px] leading-[1.2]',
                FOCUS_RING,
                on
                  ? 'border-[#387440] font-semibold text-[#387440]'
                  : 'border-transparent font-medium text-[#737373]'
              )}
            >
              {t.label}
              {t.count ? (
                <span
                  aria-hidden="true"
                  data-count={t.count}
                  className={classNames(
                    'rounded-full px-[7px] py-px text-[11.5px] font-bold leading-[1.2] after:content-[attr(data-count)] max-lg:text-[12px]',
                    on ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default WalletHeader;
