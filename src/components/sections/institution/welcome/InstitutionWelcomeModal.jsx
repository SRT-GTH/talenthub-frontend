import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import celebrate from '../../../../assets/institution/onboarding/institution-welcome-celebrate.png';
import {
  ArrowRightIcon,
  CloseIcon,
  EyeIcon,
  GlobeIcon,
  PlayIcon,
  TrendUpIcon,
  TrophyIcon,
} from '../onboarding/institutionOnboardingIcons.jsx';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { WELCOME } from './data/institutionWelcomeData.js';

const log = debug('InstitutionWelcomeModal');

const ICONS = {
  eye: EyeIcon,
  trendUp: TrendUpIcon,
  trophy: TrophyIcon,
  play: PlayIcon,
  globe: GlobeIcon,
};

/*
 * InstitutionWelcomeModal — "Akwaaba" welcome (Figma 11.4.1e 8607:3674 "Welcome modal"): 640 wide, white, 1px ink@.10, r28, p 0/0/28, gap 18, over the #0b1a0f 60 % scrim.
 * 170 high green art with the 104 round celebrate tile, heading (Bricolage 30/36 600, second half green) + 15/22 #595959 text, three milestone cards
 * (#f8f8f4, 1px #e7e7e7, r16), "Take the 30-second tour" (green shelf button) + "Look around first", then three text links (13/16 600 #387440).
 * The 36 round close button sits top right. Props: firstName, institutionName, onClose, onTour.
 * ⚠️ ASSUMPTION: the three extras (video, language, contrast) have no destination drawn; they log their intent.
 */

const InstitutionWelcomeModal = ({ firstName, institutionName, onClose, onTour }) => {
  useEffect(() => {
    log('mount');
  }, []);
  const [head, tail] = WELCOME.title;
  return (
    <AgencyDialog
      label="Welcome to Ghana Talent Hub"
      onClose={onClose}
      panelClassName="w-[min(640px,calc(100vw-32px))] lg:self-start lg:mt-[max(16px,18.3dvh)]!"
    >
      <div className="flex flex-col gap-[18px] overflow-hidden rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white pb-[28px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
        <div className="relative flex h-[170px] items-center justify-center bg-[linear-gradient(135deg,#1f4a2b_14.6%,#3f7f4c_85.4%)]">
          <span className="grid size-[104px] place-items-center rounded-full border border-solid border-[#1c2a21]/10 bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
            <img src={celebrate} alt="" className="size-[104px] rounded-full" />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-[16px] right-[16px] grid size-[36px] place-items-center rounded-full border border-solid border-[#e7e7e7] bg-white text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <CloseIcon className="size-[14px]" />
          </button>
        </div>
        <div className="flex flex-col gap-[14px] px-[clamp(16px,5.6vw,36px)]">
          <h2 className="m-0 text-center font-heading text-[30px] leading-[36px] font-semibold tracking-[-0.3px] text-[#1c2a21] max-sm:text-[24px] max-sm:leading-[30px]">
            {head.replace('{first}', firstName)}
            <span className="text-[#387440]">{tail}</span>
          </h2>
          <p className="m-0 text-center font-sans text-[15px] leading-[22px] text-[#595959]">
            {WELCOME.body.replace('{institution}', institutionName)}
          </p>
          <ul className="m-0 mt-[4px] grid list-none grid-cols-1 gap-[10px] p-0 sm:grid-cols-3">
            {WELCOME.milestones.map((m) => {
              const Icon = ICONS[m.icon];
              return (
                <li
                  key={m.id}
                  className="flex flex-col gap-[6px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[14px]"
                >
                  <span className="grid size-[32px] place-items-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white text-[#387440]">
                    <Icon className="size-[16px]" />
                  </span>
                  <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                    {m.title}
                  </span>
                  <span className="font-sans text-[12px] leading-[17px] text-[#595959]">
                    {m.text}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[10px] pt-[4px] sm:flex-row">
              <button
                type="button"
                data-autofocus
                onClick={onTour}
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] py-[14px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {WELCOME.primary}
                <ArrowRightIcon className="size-[20px]" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[52px] items-center justify-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] py-[14px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {WELCOME.secondary}
              </button>
            </div>
            <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-[16px] gap-y-[8px] p-0">
              {WELCOME.extras.map((x) => {
                const Icon = ICONS[x.icon];
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => log('extra', { id: x.id })}
                      className="inline-flex min-h-[24px] items-center gap-[6px] rounded-[4px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                    >
                      <Icon className="size-[16px]" />
                      {x.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default InstitutionWelcomeModal;
