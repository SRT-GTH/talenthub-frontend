import CareerBuddyAvatar from '../../shared/CareerBuddyAvatar.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('CareerBuddyHero');

/*
 * CareerBuddyHero — the first-visit hero shown above the chat thread on the
 * Career Buddy welcome screen, before any conversation has happened.
 *
 * Extracted from CareerBuddySection's local `FirstTimeHero` (2026-08-10) so
 * the recruiter flow can reuse it. Figma renders the two identically —
 * talent 5132:43308 vs recruiter 5132:69191 share the same headline,
 * subtitle, card geometry and type ramp; only `buddyCardSubtitle` differs
 * ("your personal career mentor" vs "your personal recruitment assistant").
 * That single string is the reason this takes a `hero` object rather than
 * reading a module constant.
 *
 * Props
 *   hero  { eyebrow, headlineRest, subtitle, buddyCardLabel, buddyCardSubtitle }
 *         All five strings are verbatim Figma `characters`. `eyebrow` renders
 *         in Instrument Serif brand-green and `headlineRest` continues the
 *         same <h1> in the sans face — the mixed-style headline Figma encodes
 *         via characterStyleOverrides on node 5132:69237.
 */
const CareerBuddyHero = ({ hero }) => {
  log('render', { eyebrow: hero?.eyebrow, buddyCardSubtitle: hero?.buddyCardSubtitle });

  return (
    <div className="flex flex-col items-center text-center px-10 pt-14 pb-6 gap-[14px] shrink-0">
      <h1 className="text-[32px] tracking-[0.1px] text-[#404040] max-w-[782px]">
        <span className="font-display not-italic leading-[1.3] text-brand-green">
          {hero.eyebrow}
        </span>
        <span className="font-sans font-medium leading-[1.3]">{hero.headlineRest}</span>
      </h1>
      <p className="font-sans text-[18px] text-[#595959]">{hero.subtitle}</p>
      <div className="mt-[14px] flex w-full max-w-[450px] items-center gap-[14px] rounded-[12px] border border-[#e8e8e7] bg-[#f8f8f4] px-[16px] py-[14px]">
        <CareerBuddyAvatar size={80} />
        <p className="text-[18px] leading-normal text-[#404040] text-left">
          <span className="font-display not-italic">{hero.buddyCardLabel}</span>
          {'  '}
          <span className="font-sans">{hero.buddyCardSubtitle}</span>
        </p>
      </div>
    </div>
  );
};

export default CareerBuddyHero;
