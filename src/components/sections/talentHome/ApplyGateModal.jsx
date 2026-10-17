import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import {
  ApplyLockIcon,
  DialogCloseIcon,
  ReminderBellIcon,
  RoleWalletIcon,
  SavedHeartIcon,
  WhiteArrowRightIcon,
} from '../../shared/assets.jsx';
import FlowPortal from './FlowPortal.jsx';

const log = debug('ApplyGateModal');

/*
 * ApplyGateModal — NU-03 "apply before Discoverable" gate. Figma: Focused 8097:6027,
 * Playful 7745:182445. Mock role + steps (shaped for an API). Copy differs per style, so both
 * strings are rendered and switched with `playful:` (hidden one is display:none, so assistive
 * tech only reads the visible one): Focused "+50 pts" soft-yellow chip, Playful "+50 XP" outlined chip.
 * ⚠️ ASSUMPTION: "Continue: Interests" -> /profile/filling/interests.
 */

const ROLE = {
  title: 'React Developer · Zeepay',
  meta: 'Accra · On-site · GHS 8–11k · closes in 9 days',
};

const STEPS = [
  { id: 'interests', n: 2, title: 'Interests', time: 'About 2 min', pts: '+50 pts', xp: '+50 XP' },
  {
    id: 'quiz',
    n: 3,
    title: 'Personality quiz',
    time: 'About 8 min',
    pts: '+100 pts',
    xp: '+100 XP',
  },
];

const ApplyGateModal = ({ home }) => {
  const dialogRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();
  log('mount', { steps: STEPS.length });

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
      className="overflow-y-auto bg-[rgba(11,26,15,0.6)] px-[clamp(8px,2vw,16px)] pt-[clamp(28px,9.8vh,88px)] pb-[clamp(8px,2vw,16px)]"
      onScrimMouseDown={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nu-gate-title"
        aria-describedby="nu-gate-desc"
        tabIndex={-1}
        className="leading-[normal] relative mx-auto flex w-full max-w-[600px] flex-col items-start gap-[clamp(14px,1.16vw,20px)] rounded-[clamp(22px,1.62vw,28px)] border border-[rgba(28,42,33,0.1)] bg-white px-[clamp(16px,1.85vw,32px)] py-[clamp(18px,1.62vw,28px)] outline-none [filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))] playful:gap-[clamp(12px,0.93vw,16px)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[28px] right-[38px] hidden playful:block max-sm:right-[56px]"
        >
          <span className="block -rotate-6 rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] text-[12px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]">
            SAVED FOR YOU
          </span>
        </div>

        <span className="inline-flex h-[32px] items-center gap-[6px] rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold whitespace-nowrap text-[#595959] max-sm:max-w-[calc(100%-44px)] max-sm:px-[10px] max-sm:text-[12px]">
          <ApplyLockIcon className="size-[14px] shrink-0" />
          <span className="truncate">Apply unlocks at Discoverable</span>
        </span>

        <h2
          id="nu-gate-title"
          className="m-0 text-[clamp(23px,1.79vw,31px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading"
        >
          {`Almost there. `}
          <span className="text-brand-green">Two stages to go.</span>
        </h2>
        <p
          id="nu-gate-desc"
          className="m-0 w-full text-[clamp(13px,0.87vw,15px)] leading-[1.47] text-[#595959]"
        >
          Recruiters can’t see your profile yet, so an application now would arrive empty. Reach
          Discoverable and you can apply in one tap.
        </p>

        <div className="flex w-full flex-wrap items-center gap-[14px] rounded-[18px] border border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <RoleWalletIcon className="size-[22px]" />
          </span>
          <div className="flex min-w-[160px] flex-1 flex-col gap-[2px]">
            <p className="m-0 text-[15px] font-semibold text-[#1c2a21]">{ROLE.title}</p>
            <p className="m-0 text-[13px] text-[#595959]">{ROLE.meta}</p>
          </div>
          <span className="inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] font-semibold whitespace-nowrap text-brand-green">
            <SavedHeartIcon className="size-[14px]" />
            Saved
          </span>
        </div>

        <div className="flex w-full flex-col gap-[8px]">
          <div className="flex items-start justify-between text-[13px] font-semibold whitespace-nowrap">
            <span id="nu-gate-progress" className="text-[#1c2a21]">
              Progress to Discoverable
            </span>
            <span className="text-brand-green">1 of 3</span>
          </div>
          <div
            role="progressbar"
            aria-labelledby="nu-gate-progress"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={1}
            className="h-[10px] w-full overflow-hidden rounded-[5px] bg-[#eceee8]"
          >
            <div className="h-[10px] w-1/3 rounded-[5px] bg-brand-green playful:bg-[linear-gradient(90deg,#387440_0%,#7aa870_100%)]" />
          </div>
        </div>

        {STEPS.map((s) => (
          <div
            key={s.id}
            className="flex w-full items-center gap-[12px] rounded-[14px] border border-[#e7e7e7] px-[14px] py-[12px]"
          >
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-white text-[13px] font-bold text-[#1c2a21] playful:border-[1.5px] playful:border-[#1c2a21]">
              {s.n}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[14px] font-semibold whitespace-nowrap text-[#1c2a21]">
                {s.title}
              </span>
              <span className="text-[12px] whitespace-nowrap text-[#595959]">{s.time}</span>
            </span>
            <span className="inline-flex items-center rounded-[100px] bg-[#faf4e8] px-[10px] py-[4px] text-[12px] font-semibold whitespace-nowrap text-[#785910] playful:hidden">
              {s.pts}
            </span>
            <span className="hidden h-[32px] items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold whitespace-nowrap text-[#595959] playful:inline-flex">
              {s.xp}
            </span>
          </div>
        ))}

        <div className="flex w-full flex-col items-stretch gap-[10px] pt-[4px] sm:flex-row sm:items-start">
          <Button
            ref={ctaRef}
            variant="primary"
            size="md"
            className="min-w-0 flex-1"
            rightIcon={<WhiteArrowRightIcon className="size-[20px]" />}
            onClick={() => {
              log('branch: continue interests');
              navigate('/profile/filling/interests');
            }}
          >
            Continue: Interests
          </Button>
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="lg:!py-[14px]"
            onClick={() => {
              log('branch: keep browsing');
              close();
            }}
          >
            Keep browsing
          </Button>
        </div>

        <p className="m-0 flex items-start gap-[6px] text-[12px] text-[#595959]">
          <ReminderBellIcon className="mt-[1px] size-[14px] shrink-0" />
          We saved this role and will remind you 2 days before it closes.
        </p>

        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-[clamp(10px,0.87vw,15px)] right-[clamp(10px,0.93vw,16px)] flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-[#e7e7e7] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <DialogCloseIcon className="size-[14px]" />
        </button>
      </div>
    </FlowPortal>
  );
};

export default ApplyGateModal;
