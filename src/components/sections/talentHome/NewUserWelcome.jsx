import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import {
  DialogCloseIcon,
  DoodleStarLargeIcon,
  DoodleStarMediumIcon,
  DoodleStarSmallIcon,
  LanguageGlobeIcon,
  MilestoneEyeIcon,
  MilestoneTrendUpIcon,
  MilestoneTrophyIcon,
  PartyPopperPlayfulSpotIllustration,
  PartyPopperSpotIllustration,
  TourPlayIcon,
  WhiteArrowRightIcon,
} from '../../shared/assets.jsx';
import FlowPortal from './FlowPortal.jsx';

const log = debug('NewUserWelcome');

/*
 * NewUserWelcome — NU-01 first-login welcome. Figma: Focused 8097:3691 (modal 8097:4148),
 * Playful 7745:2187 (modal 7745:2736). Playful differences are `playful:` variants only:
 * ink border + 5px shelf, flat green art band, sticker + sparkles, Bricolage heading.
 * Mounted over the home page by `?new=welcome`; closes with `home.update({ new: null })`.
 * ⚠️ ASSUMPTION: "Create my avatar" -> /profile/engagement/identity (no route is named in Figma).
 */

const MILESTONES = [
  {
    id: 'discoverable',
    Icon: MilestoneEyeIcon,
    title: 'Discoverable',
    body: 'At 3 of 9. Recruiters can find you.',
  },
  {
    id: 'top20',
    Icon: MilestoneTrendUpIcon,
    title: 'Top 20%',
    body: 'At 6 of 9. Fit scores on every role.',
  },
  {
    id: 'toptalent',
    Icon: MilestoneTrophyIcon,
    title: 'Top Talent',
    body: 'At 9 of 9. Recruiters can message you.',
  },
];

const LINK_CLASS =
  'inline-flex cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-[4px] bg-transparent p-0 text-[13px] font-semibold text-brand-green underline decoration-solid underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const NewUserWelcome = ({ home }) => {
  const dialogRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();
  const firstName = home?.snapshot?.profile?.firstName ?? 'Kofi';
  log('mount', { firstName });

  const close = () => {
    log('close');
    home?.update?.({ new: null });
  };

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => ctaRef.current,
    lockScroll: true,
  });

  return (
    <FlowPortal
      className="overflow-y-auto bg-[rgba(11,26,15,0.6)] px-[clamp(8px,2vw,16px)] py-[clamp(8px,6.6vh,68px)]"
      onScrimMouseDown={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nu-welcome-title"
        aria-describedby="nu-welcome-desc"
        tabIndex={-1}
        className="leading-[normal] relative mx-auto flex w-full max-w-[640px] flex-col items-center gap-[clamp(14px,1.04vw,18px)] rounded-[clamp(22px,1.62vw,28px)] border border-[rgba(28,42,33,0.1)] bg-white pb-[clamp(18px,1.62vw,28px)] outline-none [filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))]"
      >
        <div className="relative h-[clamp(130px,9.84vw,170px)] w-full shrink-0 overflow-hidden rounded-t-[clamp(20px,1.5vw,26px)] bg-[linear-gradient(165.12deg,#142916_0%,#2a5730_100%)] playful:bg-[linear-gradient(90deg,#2e6436_0%,#387440_100%)]">
          <div className="absolute top-[clamp(22px,1.97vw,34px)] left-1/2 flex size-[clamp(80px,6vw,104px)] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-[rgba(28,42,33,0.1)] bg-white shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]">
            <PartyPopperSpotIllustration className="size-full playful:hidden" />
            <PartyPopperPlayfulSpotIllustration className="hidden size-full playful:block" />
          </div>
          <div className="hidden playful:block" aria-hidden="true">
            <div className="absolute top-[26px] left-[calc(50%+37px)] max-sm:left-[calc(50%+34px)] max-sm:top-[50px]">
              <span className="block rotate-6 rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] text-[12px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]">
                WELCOME
              </span>
            </div>
            <DoodleStarLargeIcon className="absolute top-[40px] left-[calc(50%-140px)] size-[22px]" />
            <DoodleStarSmallIcon className="absolute top-[110px] left-[calc(50%-110px)] size-[10px]" />
            <DoodleStarMediumIcon className="absolute top-[120px] left-[calc(50%+120px)] size-[14px]" />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[14px] px-[clamp(14px,2.08vw,36px)]">
          <h2
            id="nu-welcome-title"
            className="text-center text-[clamp(24px,1.97vw,34px)] leading-[1.2] font-semibold text-balance text-[#1c2a21] playful:font-heading"
          >
            {`Akwaaba, ${firstName}. Let’s `}
            <span className="text-brand-green">get you seen.</span>
          </h2>
          <p
            id="nu-welcome-desc"
            className="max-w-[520px] text-center text-[clamp(13px,0.87vw,15px)] leading-[1.47] text-[#595959]"
          >
            Build your profile in 9 short stages, about 20 minutes in total. Every stage saves on
            its own, so you can stop any time.
          </p>

          <ul className="m-0 grid w-full list-none grid-cols-1 gap-[10px] p-0 sm:grid-cols-3">
            {MILESTONES.map((m) => (
              <li
                key={m.id}
                className="flex flex-row items-center gap-[10px] rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4] p-[10px] sm:flex-col sm:items-start sm:gap-[6px] sm:p-[14px]"
              >
                <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] border border-[#e7e7e7] bg-white">
                  <m.Icon className="size-[16px]" />
                </span>
                <span className="flex min-w-0 flex-col gap-[2px] sm:gap-[6px]">
                  <span className="text-[14px] font-semibold text-[#1c2a21]">{m.title}</span>
                  <span className="text-[12px] leading-[17px] text-[#595959]">{m.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="flex w-full flex-col items-stretch gap-[10px] pt-[4px] sm:flex-row sm:items-start">
            <Button
              ref={ctaRef}
              variant="primary"
              size="md"
              className="min-w-0 flex-1"
              rightIcon={<WhiteArrowRightIcon className="size-[20px]" />}
              onClick={() => {
                log('branch: create avatar');
                navigate('/profile/engagement/identity');
              }}
            >
              Create my avatar · 1 min
            </Button>
            <Button
              variant="tertiary-subtle"
              size="lg"
              className="lg:!py-[14px]"
              onClick={() => {
                log('branch: look around first');
                close();
              }}
            >
              Look around first
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-[16px] gap-y-[8px]">
            <button
              type="button"
              className={LINK_CLASS}
              onClick={() => {
                log('branch: tour');
                home?.update?.({ new: 'tour' });
              }}
            >
              <TourPlayIcon className="size-[16px]" />
              Take a 30-second tour
            </button>
            <button
              type="button"
              className={LINK_CLASS}
              onClick={() => log('language change: no destination in Figma')}
            >
              <LanguageGlobeIcon className="size-[16px]" />
              English (Ghana) · change
            </button>
            <button
              type="button"
              className={LINK_CLASS}
              onClick={() => {
                log('branch: a11y mode');
                home?.update?.({ new: null, a11y: true });
              }}
            >
              <MilestoneEyeIcon className="h-[15.2px] w-[16px]" />
              Larger text or high contrast
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-[clamp(10px,0.93vw,16px)] right-[clamp(10px,0.93vw,16px)] flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-[#e7e7e7] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <DialogCloseIcon className="size-[14px]" />
        </button>
      </div>
    </FlowPortal>
  );
};

export default NewUserWelcome;
