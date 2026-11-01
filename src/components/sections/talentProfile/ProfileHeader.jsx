import { useEffect, useRef, useState } from 'react';
import {
  PHOTO_TYPES,
  photoFileProblem,
  uploadProfilePhoto,
} from '../../../services/talentProfile.api.js';
import { saveProfileFields } from '../../../services/profileStages.api.js';
import { uploadErrorMessage } from '../../../services/media.api.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileCameraIcon,
  ProfileDoodleSparkleLargeIcon,
  ProfileDoodleSparkleMediumIcon,
  ProfileDoodleSparkleSmallIcon,
  ProfileDoodleSquiggleIcon,
  ProfileGhanaFlagIcon,
  ProfileLockGlyph,
  ProfilePitchPlayIcon,
  ProfileVerifiedCheckIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../shared/assets.jsx';
import ringDoodle from '../../../assets/talent-profile/tabs/profile-cover-doodle-ring.png';
import { PROFILE_HERO } from './talentProfileTabsData.js';
import { PREVIEW_HERO } from './talentProfilePreviewData.js';
import { ProfileChip, StreakMark, Tag } from './ProfileTabsUi.jsx';
import { SHELF } from './profileTabsStyles.js';
import { DISPLAY } from '../talentHome/TabsParts.jsx';

const log = debug('ProfileHeader');

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* Playful-only cover doodles (Figma cover/doodle/*). Positions are % of the cover so they scale. */
/* `stripes`: the flag-colour bars on the cover's right edge (Figma `doodle/stripes` — visible in the Playful
   PR-02 and PR-04 frames only, 70x150 = 7 bars of 10px). */
const COVER_STRIPES = ['#ffd86b', '#1c2a21', '#84cc16', '#c0392b', '#ffd86b', '#1c2a21', '#84cc16'];
const CoverDoodles = ({ stripes = false }) => (
  <div
    aria-hidden="true"
    data-doodle=""
    className="pointer-events-none absolute inset-0 hidden playful:block"
  >
    <img
      src={ringDoodle}
      alt=""
      draggable="false"
      className="absolute top-[-40%] left-[73.7%] aspect-square h-[146.7%] max-w-none"
    />
    <ProfileDoodleSquiggleIcon className="absolute top-[26.7%] left-[31.6%] h-auto w-[9.03%]" />
    <ProfileDoodleSparkleLargeIcon className="absolute top-[60%] left-[48.2%] aspect-square h-[14.7%] w-auto" />
    <ProfileDoodleSparkleSmallIcon className="absolute top-[18.7%] left-[19.6%] aspect-square h-[9.3%] w-auto" />
    <ProfileDoodleSparkleMediumIcon className="absolute top-[69.3%] left-[90.3%] aspect-square h-[12%] w-auto" />
    {stripes ? (
      <div className="absolute top-0 right-0 flex h-full">
        {COVER_STRIPES.map((c, i) => (
          <span key={i} className="h-full w-[clamp(5px,0.58vw,10px)]" style={{ background: c }} />
        ))}
      </div>
    ) : null}
  </div>
);

/* "Watch my 60-sec pitch" chip on the cover. */
const PitchChip = ({ onClick }) => (
  <button
    type="button"
    data-ax="pitch"
    onClick={onClick}
    className={classNames(
      'absolute right-[12px] bottom-[10px] flex cursor-pointer items-center gap-[10px] rounded-full bg-white py-[8px] pr-[14px] pl-[8px] text-left @5xl:top-[24px] @5xl:right-[7.07%] @5xl:bottom-auto',
      'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]',
      'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]',
      FOCUS
    )}
  >
    <ProfilePitchPlayIcon className="size-[28px] shrink-0" />
    <span className="flex flex-col leading-[normal] whitespace-nowrap">
      <span className="text-[13px] font-semibold text-[#1c2a21]">{PROFILE_HERO.pitch.title}</span>
      <span className="text-[11px] max-lg:text-[12px] text-[#737373]">
        {PROFILE_HERO.pitch.meta}
      </span>
    </span>
  </button>
);

const Avatar = ({ editable = true, onPick, busy = false }) => (
  <div
    className={classNames(
      'relative -mt-[calc(var(--av)/2)] shrink-0 rounded-full bg-white',
      'size-[var(--av)]',
      SHELF
    )}
  >
    <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
      <span className="relative block size-[89.4%] overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.6%,#7aa870_85.3%)]">
        {PROFILE_HERO.photo ? (
          // Live profile photo (2026-10-18); the illustration stays for the demo / no photo.
          <img
            src={PROFILE_HERO.photo}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <TalentSidebarProfileAvatarIllustration className="absolute -top-[6.45%] -left-[5.65%] block h-auto w-[111.3%] max-w-none" />
        )}
      </span>
    </span>
    {editable ? (
      <button
        type="button"
        data-ax="photo"
        aria-label={busy ? 'Uploading photo' : 'Change photo'}
        aria-busy={busy || undefined}
        disabled={busy}
        onClick={() => (onPick ? onPick() : log('change photo clicked (demo)'))}
        className={classNames(
          'absolute right-0 bottom-[2px] flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] playful:border-[1.5px] playful:border-[#1c2a21]',
          FOCUS
        )}
      >
        <ProfileCameraIcon className="size-[15px]" />
      </button>
    ) : null}
  </div>
);

/* PR-04: replaces the pitch chip once the pitch is hidden from recruiters (Figma `hidden tag` 7584:3741). */
const PitchHiddenTag = () => (
  <span
    className={classNames(
      'absolute right-[12px] bottom-[10px] flex items-center gap-[8px] rounded-full border-[1.5px] border-[#bfbfbf] bg-white py-[8px] px-[14px] leading-[normal] whitespace-nowrap text-[12px] font-semibold text-[#595959] @5xl:top-[24px] @5xl:right-[7.07%] @5xl:bottom-auto'
    )}
  >
    <ProfileLockGlyph className="size-[14px] shrink-0" />
    {PREVIEW_HERO.pitchHidden}
  </span>
);

const Stat = ({ value, label, streak }) => (
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-[10px]">
      {streak ? <StreakMark className="size-[26px] shrink-0" /> : null}
      <span
        className={classNames(
          'text-[clamp(20px,1.33vw,23px)] leading-[1.25] font-semibold text-[#1c2a21]',
          streak ? 'font-heading' : DISPLAY
        )}
      >
        {value}
      </span>
    </div>
    <span className="text-[11px] max-lg:text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#737373]">
      {label}
    </span>
  </div>
);

/*
 * ProfileHeader — the hero shared by P-01..P-06 (Figma Focused 8110:368113 / Playful 7570:370):
 * cover (+ Playful doodles, "Open to work" sticker, pitch chip), avatar, identity, actions, stats.
 * Layout is container-query driven so it works from 320px up; at >= 1024px of content width it
 * matches the 1329px desktop frame.
 */
const ProfileHeader = ({ profile, mode = 'owner', live = false, onSaved }) => {
  const h = PROFILE_HERO;
  // Live: the camera button uploads a photo (talentProfile.api uploadProfilePhoto) and saves profile.profilePhoto.
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState({ busy: false, error: '' });
  const pickPhoto = () => fileRef.current?.click();
  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const problem = photoFileProblem(file);
    if (problem) {
      setPhoto({ busy: false, error: problem });
      return;
    }
    setPhoto({ busy: true, error: '' });
    try {
      const url = await uploadProfilePhoto(file);
      await saveProfileFields({ profilePhoto: url });
      log('photo saved');
      setPhoto({ busy: false, error: '' });
      onSaved?.();
    } catch (err) {
      log.error('photo upload failed:', err?.response?.status || err?.message);
      setPhoto({
        busy: false,
        // The server says why when it refuses a file ("This file doesn't look like an image...").
        error:
          err?.response?.status === 415
            ? uploadErrorMessage(
                err,
                'That file isn’t a real image. Choose a JPG, PNG, WebP or GIF photo.'
              )
            : 'Your photo wasn’t uploaded. Check your connection and try again.',
      });
    }
  };
  // Preview modes (P-07 recruiter / PR-02 public / PR-04 recruiter + pitch hidden): same hero with no
  // edit affordances, different buttons + stats, and a "… see these buttons" sticker.
  const owner = mode === 'owner';
  const pv = owner ? null : PREVIEW_HERO[mode];
  const pitchHidden = mode === 'recruiter' && Boolean(profile?.updated);

  useEffect(() => {
    log('mount', { tab: profile?.tab, view: profile?.view, mode });
  }, [profile?.tab, profile?.view, mode]);

  const openPreview = () => {
    log('preview as recruiter ->', 'view=recruiter');
    profile?.update?.({ view: 'recruiter' });
  };
  const openShare = () => {
    log('share profile ->', 'share=open');
    profile?.update?.({ share: 'open' });
  };
  const openPitch = () => {
    log('pitch chip ->', 'tab=about');
    profile?.update?.({ tab: 'about' });
  };

  return (
    <div className="@container">
      <section
        aria-label="Profile header"
        className={classNames('relative overflow-hidden rounded-[24px] bg-white', SHELF)}
        style={{ '--av': 'clamp(84px, 7.64vw, 132px)' }}
      >
        {/* cover */}
        <div className="relative -mx-px -mt-px h-[clamp(112px,8.68vw,150px)] overflow-hidden bg-[#387440] playful:-mx-[1.5px] playful:-mt-[1.5px]">
          <CoverDoodles stripes={mode === 'public' || pitchHidden} />
          {photo.error || photo.busy ? (
            <p
              role={photo.error ? 'alert' : 'status'}
              className="absolute bottom-[10px] left-1/2 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-white px-[14px] py-[6px] text-center text-[13px] leading-[normal] font-semibold text-[#1c2a21]"
            >
              {photo.error || 'Uploading your photo…'}
            </p>
          ) : null}
          <Tag
            size={13}
            className="absolute top-[clamp(12px,1.39vw,24px)] left-[clamp(12px,1.85vw,32px)] z-10 playful:rotate-[5deg]"
          >
            {h.openToWork}
          </Tag>
          {mode === 'public' ? null : pitchHidden ? (
            <PitchHiddenTag />
          ) : h.pitch ? (
            <PitchChip onClick={openPitch} />
          ) : null}
        </div>

        <div className="flex flex-col px-[clamp(12px,1.85vw,32px)] pb-[clamp(16px,1.56vw,27px)] @5xl:flex-row @5xl:items-start">
          <div className="flex min-w-0 flex-col gap-x-[clamp(12px,1.4vw,24px)] @2xl:flex-row @5xl:flex-1">
            <Avatar editable={owner} onPick={live ? pickPhoto : undefined} busy={photo.busy} />
            {owner && live ? (
              <input
                ref={fileRef}
                type="file"
                accept={PHOTO_TYPES.join(',')}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                onChange={onPhoto}
              />
            ) : null}

            <div className="mt-[10px] flex min-w-0 flex-1 flex-col gap-[6px]">
              <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]">
                <h1
                  className={classNames(
                    DISPLAY,
                    'text-[clamp(26px,2.14vw,37px)] leading-[1.2] font-semibold whitespace-nowrap text-[#1c2a21]'
                  )}
                >
                  {h.name}
                </h1>
                {h.verified ? (
                  <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[9px] pl-[7px] text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#2d5d33] playful:border playful:border-[rgba(28,42,33,0.35)]">
                    <ProfileVerifiedCheckIcon className="size-[13px]" />
                    {h.verified}
                  </span>
                ) : null}
                {owner && h.level ? <Tag className="playful:-rotate-3">{h.level}</Tag> : null}
              </div>
              {h.handle ? (
                <p className="text-[13px] leading-[normal] text-[#737373]">{h.handle}</p>
              ) : null}
              <p className="flex items-center gap-[6px] text-[16px] leading-[normal] font-medium text-[#1c2a21]">
                <span>{h.headline}</span>
                <ProfileGhanaFlagIcon className="size-[18px] shrink-0" />
              </p>
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                {h.chips.map((c) => (
                  <ProfileChip key={c.label} tone={c.tone} icon={c.icon}>
                    {c.label}
                  </ProfileChip>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-[16px] flex flex-wrap items-center justify-between gap-x-[22px] gap-y-[14px] @5xl:mt-[18px] @5xl:ml-[24px] @5xl:flex-col @5xl:items-end @5xl:justify-start @5xl:gap-[28px]">
            <div className="flex flex-wrap items-center gap-[10px] pb-[4px]">
              {owner ? (
                <>
                  <Button variant="tertiary" size="sm" data-ax="preview" onClick={openPreview}>
                    {h.actions.preview}
                  </Button>
                  <Button variant="primary" size="sm" data-ax="share" onClick={openShare}>
                    {h.actions.share}
                  </Button>
                </>
              ) : (
                pv.actions.map((a) => (
                  <Button
                    key={a.key}
                    variant={a.tone}
                    size="sm"
                    onClick={() => log('preview action (no backend):', a.key)}
                  >
                    {a.label}
                  </Button>
                ))
              )}
            </div>
            <div className="flex items-center gap-[22px]">
              {(owner ? h.stats : pv.stats).map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>
        {pv ? (
          <Tag
            tone="white"
            className="absolute top-[calc(clamp(112px,8.68vw,150px)-25px)] right-[clamp(12px,3.1%,41px)] z-10 hidden @5xl:inline-flex playful:-rotate-3"
          >
            {pv.sticker}
          </Tag>
        ) : null}
      </section>
    </div>
  );
};

export default ProfileHeader;
