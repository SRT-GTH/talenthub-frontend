import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { CommunitySticker } from '../talentCommunity/CommunityParts.jsx';
import { HEADING } from '../talentCommunity/communityStyles.js';
import face1 from '../../../assets/talent-messages/header-art/face-1.png';
import face2 from '../../../assets/talent-messages/header-art/face-2.png';
import face3 from '../../../assets/talent-messages/header-art/face-3.png';
import face4 from '../../../assets/talent-messages/header-art/face-4.png';
import skeletonFaces from '../../../assets/talent-messages/header-art/skeleton-faces.svg';
import liveDot from '../../../assets/talent-messages/header-art/live-dot.svg';
import liveDotWarming from '../../../assets/talent-messages/header-art/live-dot-warming.svg';
import liveDotChecking from '../../../assets/talent-messages/header-art/live-dot-checking.svg';
import iconSparkle from '../../../assets/talent-messages/header-art/icon-sparkle.svg';
import iconFlame from '../../../assets/talent-messages/header-art/icon-flame.svg';
import doodleGold from '../../../assets/talent-messages/header-art/doodle-sparkle-gold.svg';
import doodleGreen from '../../../assets/talent-messages/header-art/doodle-sparkle-green.svg';
import doodleSquiggle from '../../../assets/talent-messages/header-art/doodle-squiggle.svg';
import doodleRing from '../../../assets/talent-messages/header-art/doodle-ring.svg';
import { MESSAGES_COPY } from './messagesData.js';

const log = debug('MessagesHeaderArt');

/*
 * Page header = title row ("Messages" + sticker) + subtitle + the Playful-only decorative art
 * (Figma component set "GTH · Messages header art" 7443:4210: Default / Empty / Loading). The art is decorative
 * (aria-hidden), Playful only (Focused draws it at opacity 0) and hidden below 1200px where it would not fit.
 */
const FACES = [face1, face2, face3, face4];
const DOTS = { default: liveDot, empty: liveDotWarming, loading: liveDotChecking };
const WRAP = 'absolute flex items-center justify-center';
const PILL_SHADOW = 'shadow-[0_6px_14px_rgba(31,69,38,0.16)]';

const HeaderArt = ({ artState, copy: override }) => {
  const copy = { ...MESSAGES_COPY.headerArt[artState], ...override };
  const empty = artState === 'empty';
  const loading = artState === 'loading';
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-[-2px] hidden h-[84px] w-[600px] playful:min-[1200px]:block"
    >
      {empty ? null : (
        <div className="absolute left-0 top-[30px] h-[40px] w-[124px]">
          {loading ? (
            <img
              src={skeletonFaces}
              alt=""
              className="absolute left-[-3px] top-[-3px] block h-[46px] w-[130px] max-w-none"
            />
          ) : (
            FACES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="absolute top-[-3px] block size-[46px] max-w-none"
                style={{ left: i * 28 - 3 }}
              />
            ))
          )}
        </div>
      )}
      <div
        className={classNames(
          'absolute top-[36px] flex items-center gap-[6px] overflow-clip rounded-[100px] border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px]',
          PILL_SHADOW,
          empty ? 'left-[110px]' : 'left-[136px]'
        )}
      >
        <img src={DOTS[artState]} alt="" className="size-[8px]" />
        <span className="whitespace-nowrap font-sans text-[12px] font-medium leading-normal tracking-[0.2px] text-[#1c2a21]">
          {copy.label}
        </span>
      </div>
      <div
        className={classNames(WRAP, 'left-[337.21px] top-[2px]')}
        style={empty ? { width: 215.975, height: 50.53 } : { width: 188.081, height: 48.089 }}
      >
        <div className="rotate-[5deg]">
          <div
            className={classNames(
              'flex items-center gap-[6px] overflow-clip rounded-[100px] bg-[#387440] px-[14px] py-[8px]',
              PILL_SHADOW,
              loading && 'opacity-35'
            )}
          >
            <img src={iconSparkle} alt="" className="size-[14px]" />
            <span className="whitespace-nowrap font-sans text-[13px] font-semibold leading-normal tracking-[0.2px] text-white">
              {copy.sticker}
            </span>
          </div>
        </div>
      </div>
      <div
        className={classNames(WRAP, 'left-[430px] top-[35.61px]')}
        style={empty ? { width: 158.78, height: 41.876 } : { width: 150.799, height: 41.318 }}
      >
        <div className="-rotate-[4deg]">
          <div
            className={classNames(
              'flex items-center gap-[6px] overflow-clip rounded-[100px] border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px]',
              PILL_SHADOW,
              loading && 'opacity-35'
            )}
          >
            <img src={iconFlame} alt="" className="size-[14px]" />
            <span className="whitespace-nowrap font-sans text-[12px] font-semibold leading-normal tracking-[0.2px] text-[#935a22]">
              {copy.week}
            </span>
          </div>
        </div>
      </div>
      <img src={doodleGold} alt="" className="absolute left-[574px] top-0 size-[22px]" />
      <img src={doodleGreen} alt="" className="absolute left-[316px] top-[46px] size-[12px]" />
      <div className={classNames(WRAP, 'left-[298.05px] top-[10px] h-[20.266px] w-[47.501px]')}>
        <img src={doodleSquiggle} alt="" className="h-[14px] w-[46px] rotate-[8deg] max-w-none" />
      </div>
      <img src={doodleRing} alt="" className="absolute left-[250px] top-[6px] size-[14px]" />
    </div>
  );
};

/*
 * Props: stickerLabel (string | null — "2 new" / "2 requests"; null hides the sticker, T-MSG-13/14),
 * artState ('default' | 'empty' | 'loading'), copy (optional { label, sticker, week } over the drawn copy — live counts).
 */
const MessagesTitleRow = ({ stickerLabel, artState = 'default', copy = null }) => {
  log('render', { stickerLabel, artState });
  return (
    <div className="relative flex min-h-[69px] flex-col gap-[3px]">
      <div className="flex items-center gap-[12px]">
        <h1
          className={classNames(
            HEADING,
            'text-[clamp(26px,1.97vw,34px)] leading-[1.206] tracking-[-0.02em]'
          )}
        >
          {MESSAGES_COPY.title}
        </h1>
        {stickerLabel ? <CommunitySticker>{stickerLabel}</CommunitySticker> : null}
      </div>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999] max-lg:text-[14px] max-lg:leading-[20px]">
        {MESSAGES_COPY.subtitle}
      </p>
      <HeaderArt artState={artState} copy={copy} />
    </div>
  );
};

export default MessagesTitleRow;
