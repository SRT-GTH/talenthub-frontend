import { classNames } from '../../../../utils/classNames.js';
import {
  ProfileGhanaFlagIcon,
  ProfileVerifiedCheckIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../../shared/assets.jsx';
import { SHELF } from '../../talentProfile/profileTabsStyles.js';
import { ProfileChip, Tag } from '../../talentProfile/ProfileTabsUi.jsx';
import AgencyButton from '../../agency/AgencyButton.jsx';
import { ACCOUNT } from './data/adminAccountDetailData.js';

/*
 * AdminAccountHero — the profile hero of the account detail (Figma 7.1.2a "hero" 8623:~, 1329 x 322, r24, 1px border; the talent profile header in its
 * recruiter-preview form): green cover 150 with the status chip (#ebf1ec, 13/700 #1f4a2b), 132 round avatar (-66 overlap), name 37/600 + "Verified" pill,
 * 13 #737373 handle, 16/500 headline + flag, three chips, "Message user" (white) + one green primary ("Admin actions" or "Reactivate"), stats on the right
 * (5 verified skills · 24 endorsements · Oct 2026 last active) and the "Staff view" sticker on the cover edge.
 * Props: cover (chip text), primary { label, onClick }, onMessage.
 */

const Stat = ({ value, label }) => (
  <div className="flex flex-col items-end">
    <span className="font-sans text-[clamp(20px,1.33vw,23px)] leading-[1.25] font-semibold text-[#1c2a21]">
      {value}
    </span>
    <span className="font-sans text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#737373] max-lg:text-[12px]">
      {label}
    </span>
  </div>
);

const AdminAccountHero = ({ cover, primary, onMessage }) => (
  <div className="@container">
    <section
      aria-label="Account header"
      className={classNames('relative overflow-hidden rounded-[24px] bg-white', SHELF)}
      style={{ '--av': 'clamp(84px, 7.64vw, 132px)' }}
    >
      <div className="relative -mx-px -mt-px h-[clamp(112px,8.68vw,150px)] overflow-hidden bg-[#387440]">
        <Tag
          size={13}
          className="absolute top-[clamp(12px,1.39vw,24px)] left-[clamp(12px,1.85vw,32px)] z-10"
        >
          {cover}
        </Tag>
      </div>
      <div className="flex flex-col px-[clamp(12px,1.85vw,32px)] pb-[clamp(16px,1.56vw,27px)] @5xl:flex-row @5xl:items-start">
        <div className="flex min-w-0 flex-col gap-x-[clamp(12px,1.4vw,24px)] @2xl:flex-row @5xl:flex-1">
          <div
            className={classNames(
              'relative -mt-[calc(var(--av)/2)] size-[var(--av)] shrink-0 rounded-full bg-white',
              SHELF
            )}
          >
            <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
              <span className="relative block size-[89.4%] overflow-hidden rounded-full bg-[#387440]">
                <TalentSidebarProfileAvatarIllustration className="absolute -top-[6.45%] -left-[5.65%] block h-auto w-[111.3%] max-w-none" />
              </span>
            </span>
          </div>
          <div className="mt-[10px] flex min-w-0 flex-1 flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]">
              <h1 className="m-0 font-sans text-[clamp(26px,2.14vw,37px)] leading-[1.2] font-semibold whitespace-nowrap text-[#1c2a21]">
                {ACCOUNT.name}
              </h1>
              <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[9px] pl-[7px] text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#2d5d33]">
                <ProfileVerifiedCheckIcon className="size-[13px]" />
                {ACCOUNT.verified}
              </span>
            </div>
            <p className="m-0 text-[13px] leading-[normal] text-[#737373]">{ACCOUNT.handle}</p>
            <p className="m-0 flex items-center gap-[6px] text-[16px] leading-[normal] font-medium text-[#1c2a21]">
              <span>{ACCOUNT.headline}</span>
              <ProfileGhanaFlagIcon className="size-[18px] shrink-0" />
            </p>
            <div className="flex flex-wrap gap-[8px] pt-[6px]">
              {ACCOUNT.chips.map((c) => (
                <ProfileChip key={c.label} tone={c.tone} icon={c.icon}>
                  {c.label}
                </ProfileChip>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-[16px] flex flex-wrap items-center justify-between gap-x-[22px] gap-y-[14px] @5xl:mt-[18px] @5xl:ml-[24px] @5xl:flex-col @5xl:items-end @5xl:justify-start @5xl:gap-[28px]">
          <div className="flex flex-wrap items-center gap-[10px] pb-[4px]">
            <AgencyButton size="md" onClick={onMessage}>
              Message user
            </AgencyButton>
            <button
              type="button"
              onClick={primary.onClick}
              className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {primary.label}
            </button>
          </div>
          <div className="flex items-center gap-[22px]">
            {ACCOUNT.stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
      <Tag
        tone="white"
        className="absolute top-[calc(clamp(112px,8.68vw,150px)-25px)] right-[clamp(12px,3.1%,41px)] z-10 hidden @5xl:inline-flex"
      >
        {ACCOUNT.sticker}
      </Tag>
    </section>
  </div>
);

export default AdminAccountHero;
