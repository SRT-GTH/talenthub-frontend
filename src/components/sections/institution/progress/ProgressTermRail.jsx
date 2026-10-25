import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import {
  ProfileEyeIcon,
  ProfileFileDarkGlyph,
  ProfileLockGlyph,
  ProfilePhoneGlyph,
  ProfileTargetGlyph,
  ProfileVoiceGlyph,
  ProfileWalletGlyph,
} from '../../../shared/assets.jsx';
import { HeadLink, ProfileCard } from '../../talentProfile/ProfileTabsUi.jsx';
import { BADGE_ICONS, SHELF } from '../../talentProfile/profileTabsStyles.js';
import { INSTITUTION_BASE } from '../institutionNav.js';
import { BADGES_COPY } from './data/progressData.js';

/*
 * ProgressTermRail — the right rail of the student detail (Figma 8595:935, 425 wide, gap 20): the dark "Term 1 progress" card (#1c2a21, r20: sticker with eye,
 * 22/28 title, 14/21 #bfbfbf text, green "Message <first>" button), the "This term" card (six rows with a glyph, 14/17 500 #595959 and a lock) with
 * "How progress is counted →", and the Badges card (First steps · Profile started · Quiz Ace). Figma's `icon/video` is an empty instance: only its 15px slot
 * is kept (45 % opacity). ⚠️ ASSUMPTION: "How progress is counted →" and "All 9 →" have no target drawn; they are inert.
 * Props: detail, flagged.
 */

const ROW_ICONS = {
  target: ProfileTargetGlyph,
  file: ProfileFileDarkGlyph,
  voice: ProfileVoiceGlyph,
  phone: ProfilePhoneGlyph,
  wallet: ProfileWalletGlyph,
  video: null,
};

const ProgressTermRail = ({ detail }) => {
  const r = detail.rail;
  return (
    <>
      <section
        aria-label={r.sticker}
        className="flex min-w-0 flex-col items-start gap-[12px] rounded-[20px] bg-[#1c2a21] p-[24px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]"
      >
        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] py-[5px] font-sans text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
          {r.sticker}
          <ProfileEyeIcon className="size-[14px]" />
        </span>
        <h2 className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-white">
          {r.title}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[21px] text-[#bfbfbf]">{r.text}</p>
        <Link
          to={`${INSTITUTION_BASE}/messages/new`}
          className="inline-flex items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] py-[12px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Message {detail.first}
        </Link>
      </section>

      <ProfileCard title={r.termTitle} bodyClassName="flex flex-col gap-[16px]">
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {r.rows.map((row) => {
            const Icon = ROW_ICONS[row.icon];
            return (
              <li key={row.text} className="flex items-center gap-[10px]">
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[15px] shrink-0 items-center justify-center',
                    row.icon === 'video' && 'opacity-45'
                  )}
                >
                  {Icon ? <Icon className="block size-full" /> : null}
                </span>
                <span className="min-w-0 flex-1 font-sans text-[14px] leading-[normal] font-medium text-[#595959]">
                  {row.text}
                </span>
                <ProfileLockGlyph className="size-[14px] shrink-0" />
              </li>
            );
          })}
        </ul>
        <HeadLink onClick={() => {}} className="self-start">
          {r.termLink}
        </HeadLink>
      </ProfileCard>

      <ProfileCard title={BADGES_COPY.title} link={BADGES_COPY.link} onLink={() => {}}>
        <ul className="m-0 flex list-none flex-wrap justify-between gap-x-[6px] gap-y-[12px] p-0">
          {BADGES_COPY.items.map((b) => {
            const Icon = BADGE_ICONS[b.icon];
            return (
              <li key={b.key} className="flex w-[88px] flex-col items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[56px] items-center justify-center rounded-full',
                    SHELF
                  )}
                  style={{ background: b.bg }}
                >
                  <Icon className="size-[25px]" />
                </span>
                <span className="font-sans text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#595959] max-lg:text-[12px]">
                  {b.label}
                </span>
              </li>
            );
          })}
        </ul>
      </ProfileCard>
    </>
  );
};

export default ProgressTermRail;
