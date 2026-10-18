import { classNames } from '../../../utils/classNames.js';
import {
  ProfileGhanaFlagIcon,
  ShareCardCheckIcon,
  ShareChipCheckIcon,
  ShareInfoCircleIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../shared/assets.jsx';
import { ShareQr } from './ShareProfileParts.jsx';
import { CARD_BASE, useFitScale } from './ShareProfileUi.js';
import { CARD_PERSON, CARD_STYLE_TOKENS, SHARE_CARD } from './talentProfileShareData.js';

/*
 * The share card art (Figma `share card · Story 9:16 · Forest`, `· Post 1:1 · Midnight`,
 * `· LinkedIn banner · Sunshine`). Fixed-size art positioned with the frame's own offsets, then scaled to
 * the preview stage. Only the Forest/Story, Midnight/Post and Sunshine/Banner combinations are drawn in
 * Figma — the text colours for the other style × size pairs are ⚠️ ASSUMPTIONS derived from those three.
 */

const TEXT = {
  forest: { name: '#ffffff', sub: '#ebf1ec' },
  midnight: { name: '#ffffff', sub: '#e6e6e6' },
  sunshine: { name: '#1c2a21', sub: '#463409' },
  kente: { name: '#ffffff', sub: '#ebf1ec' },
};

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]';

const Sticker = ({ className, small = false }) => (
  <span
    className={classNames(
      'absolute flex items-center rounded-full bg-brand-green-light font-bold whitespace-nowrap text-[#1f4d26]',
      small ? 'px-[7px] py-[3px] text-[8px]' : 'px-[10px] py-[5px] text-[12px]',
      className
    )}
  >
    {CARD_PERSON.openToWork}
  </span>
);

/* Same avatar art sized by its own box (the sidebar illustration ignores size attrs, so wrap it). */
const AvatarArt = ({ w, h }) => (
  <span className="flex shrink-0" style={{ width: w, height: h }}>
    <TalentSidebarProfileAvatarIllustration className="size-full" />
  </span>
);

const AvatarBadge = ({ outer, inner, artW, artH, className }) => (
  <span
    className={classNames(
      'absolute flex items-center justify-center overflow-hidden rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-white',
      SOFT_SHADOW,
      className
    )}
    style={{ width: outer, height: outer }}
  >
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-green"
      style={{ width: inner, height: inner }}
    >
      <AvatarArt w={artW} h={artH} />
    </span>
  </span>
);

const StoryCard = ({ style, show, text }) => (
  <div
    className={classNames(
      'relative h-[533px] w-[300px] overflow-hidden rounded-[22px] border border-solid border-[rgba(28,42,33,0.1)]',
      SOFT_SHADOW
    )}
    style={{ backgroundColor: CARD_STYLE_TOKENS[style].bg }}
  >
    {show.open ? <Sticker className="top-[23px] left-[20.9px]" /> : null}
    <AvatarBadge
      outer={110}
      inner={98}
      artW={109.065}
      artH={110.645}
      className="top-[65px] left-[21px]"
    />
    <p
      className="absolute top-[185px] left-[21px] m-0 text-[37px] leading-[1.2] font-semibold whitespace-nowrap"
      style={{ color: text.name }}
    >
      {CARD_PERSON.firstName}
      <br />
      {CARD_PERSON.lastName}
    </p>
    {show.headline ? (
      <p
        className="absolute top-[277px] left-[21px] m-0 flex items-center gap-[6px] text-[14px] font-semibold whitespace-nowrap"
        style={{ color: text.sub }}
      >
        {CARD_PERSON.headline}
        <span className="flex size-[16px] shrink-0">
          <ProfileGhanaFlagIcon className="size-full" />
        </span>
      </p>
    ) : null}
    {show.skills ? (
      <div className="absolute top-[305px] left-[21px] flex flex-col gap-[5px]">
        {CARD_PERSON.skills.map((skill) => (
          <span
            key={skill}
            className="flex h-[32px] w-fit items-center gap-[6px] rounded-full border border-solid border-brand-green-light-hover bg-white px-[14px] text-[13px] font-semibold whitespace-nowrap text-[#595959]"
          >
            <ShareChipCheckIcon className="size-[14px] shrink-0" />
            {skill}
          </span>
        ))}
      </div>
    ) : null}
    {show.qr ? (
      <div className="absolute top-[438px] left-[21px] flex w-[256px] items-center gap-[10px] rounded-[14px] bg-white p-[10px]">
        <ShareQr
          size={52}
          border={0.929}
          logo={10.4}
          logoBorder={1.238}
          logoRadius={3.714}
          flag={14}
        />
        <span className="flex flex-col gap-[2px] whitespace-nowrap">
          <span className="text-[11px] font-medium text-[#595959]">{CARD_PERSON.findMe}</span>
          <span className="text-[14px] font-bold text-[#1c2a21]">{CARD_PERSON.brand}</span>
          <span className="text-[11px] font-medium text-brand-green">{CARD_PERSON.url}</span>
        </span>
      </div>
    ) : null}
  </div>
);

const PostCard = ({ style, show, text }) => (
  <div
    className={classNames(
      'relative h-[340px] w-[340px] overflow-hidden rounded-[22px] border border-solid border-[rgba(28,42,33,0.1)]',
      SOFT_SHADOW
    )}
    style={{ backgroundColor: CARD_STYLE_TOKENS[style].bg }}
  >
    {show.open ? <Sticker className="top-[19px] left-[198.9px]" /> : null}
    <AvatarBadge
      outer={90.2}
      inner={80.36}
      artW={89.433}
      artH={90.729}
      className="top-[19px] left-[19px]"
    />
    <p
      className="absolute top-[123px] left-[19px] m-0 text-[32px] leading-[1.2] font-semibold whitespace-nowrap"
      style={{ color: text.name }}
    >
      {CARD_PERSON.firstName}
      <br />
      {CARD_PERSON.lastName}
    </p>
    {show.headline ? (
      <p
        className="absolute top-[199px] left-[19px] m-0 flex items-center gap-[6px] text-[14px] font-semibold whitespace-nowrap"
        style={{ color: text.sub }}
      >
        {CARD_PERSON.headline}
        <span className="flex size-[16px] shrink-0">
          <ProfileGhanaFlagIcon className="size-full" />
        </span>
      </p>
    ) : null}
    {show.skills ? (
      <div className="absolute top-[225px] left-[19px] flex w-[304px] flex-wrap items-start gap-x-[4px] gap-y-[6px]">
        {CARD_PERSON.skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-[5px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[6px] py-[4px] text-[10px] font-semibold whitespace-nowrap text-[#1c2a21]"
          >
            <ShareCardCheckIcon className="size-[12px] shrink-0" />
            {skill}
          </span>
        ))}
      </div>
    ) : null}
    {show.qr ? (
      <div className="absolute top-[256px] left-[19px] flex w-[300px] items-center gap-[10px] rounded-[14px] bg-white p-[10px]">
        <ShareQr
          size={41.6}
          border={0.743}
          logo={8.32}
          logoBorder={0.99}
          logoRadius={2.971}
          flag={11.2}
        />
        <span className="flex flex-col gap-[2px] whitespace-nowrap">
          <span className="text-[11px] font-medium text-[#595959]">{CARD_PERSON.findMe}</span>
          <span className="text-[14px] font-bold text-[#1c2a21]">{CARD_PERSON.brand}</span>
          <span className="text-[11px] font-medium text-brand-green">{CARD_PERSON.url}</span>
        </span>
      </div>
    ) : null}
  </div>
);

const BannerCard = ({ style, show, text }) => (
  <div
    className={classNames(
      'relative h-[88px] w-[352px] overflow-hidden rounded-[10px] border border-solid border-[rgba(28,42,33,0.1)]',
      SOFT_SHADOW
    )}
    style={{ backgroundColor: CARD_STYLE_TOKENS[style].bg }}
  >
    <span className="absolute top-[-1px] left-[-1px] h-[88px] w-[84px] border border-dashed border-[#1c2a21] bg-[#f5c94a]" />
    <p className="absolute top-[35px] left-[41px] m-0 w-[70px] -translate-x-1/2 text-center text-[7px] leading-[normal] font-medium text-[#463409]">
      {CARD_PERSON.photoHere}
    </p>
    <p
      className="absolute top-[11px] left-[95px] m-0 text-[21px] leading-[1.25] font-semibold whitespace-nowrap"
      style={{ color: text.name }}
    >
      {CARD_PERSON.fullName}
    </p>
    {show.headline ? (
      <p
        className="absolute top-[41px] left-[95px] m-0 text-[9px] font-semibold whitespace-nowrap"
        style={{ color: text.sub }}
      >
        {CARD_PERSON.bannerHeadline}
      </p>
    ) : null}
    {show.open ? <Sticker small className="top-[59px] left-[95px]" /> : null}
    {show.qr ? (
      <>
        <span className="absolute top-[15px] left-[281px]">
          <ShareQr
            size={56}
            border={1}
            logo={11.2}
            logoBorder={1.333}
            logoRadius={4}
            flag={15.077}
          />
        </span>
        <p className="absolute top-[69px] left-[191px] m-0 text-[7px] font-semibold whitespace-nowrap text-[#1c2a21]">
          {CARD_PERSON.url}
        </p>
      </>
    ) : null}
  </div>
);

const ART = { story: StoryCard, post: PostCard, banner: BannerCard };

/*
 * ShareCardStage — the grey "preview stage" (Figma `preview stage`, 400 wide on desktop): the card art scaled
 * to fit, the size caption under it, and (banner) the safe-zone note.
 */
export const ShareCardStage = ({ style, size, show, faded = false, overlay = null }) => {
  const base = CARD_BASE[size];
  const Art = ART[size];
  const [ref, scale] = useFitScale(base.w);
  const note = SHARE_CARD.sizes.find((item) => item.id === size)?.note;
  return (
    <div className="relative flex w-full flex-col items-center gap-[12px] rounded-[20px] bg-[#f8f8f4] p-[clamp(12px,1.39vw,24px)] lg:w-[400px] lg:shrink-0 lg:self-start">
      <div ref={ref} className="flex w-full flex-col items-center">
        <div className="relative" style={{ width: base.w * scale, height: base.h * scale }}>
          <div
            style={{
              width: base.w,
              height: base.h,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              opacity: faded ? 0.35 : 1,
            }}
          >
            <Art style={style} show={show} text={TEXT[style]} />
          </div>
          {overlay}
        </div>
      </div>
      {size === 'banner' ? (
        <div className="flex w-full max-w-[352px] items-center gap-[10px] rounded-[12px] border border-solid border-[#e6e6e6] bg-white px-[13px] py-[11px]">
          <ShareInfoCircleIcon className="size-[16px] shrink-0" />
          <p className="m-0 min-w-0 flex-1 text-[12px] leading-[1.4] text-[#595959]">
            {SHARE_CARD.note.safeZone}
          </p>
        </div>
      ) : null}
      <p className="m-0 text-[12px] font-medium whitespace-nowrap text-[#595959]">{note}</p>
    </div>
  );
};

export default ShareCardStage;
