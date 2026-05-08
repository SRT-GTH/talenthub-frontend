import studentsPhoto from '../../../assets/hero/Students using GTH on phone.jpg';
import sparkleVector from '../../../assets/hero/sparkle vector.svg';
import yourNextAdventureCard from '../../../assets/hero/Your next adventure vector.svg';
import powerYourCareerCard from '../../../assets/hero/power your career vector.svg';
import quizCompleteCard from '../../../assets/hero/quiz complete.svg';
import myExperienceCard from '../../../assets/hero/my experience vector.svg';
import xpEarnedTodayCard from '../../../assets/hero/XP earned today vector.svg';
import liftYourTalentCard from '../../../assets/hero/Lift your talent vector.svg';
import { debug } from '../../../utils/debug.js';

const log = debug('HeroPhotoCard');

/*
 * HeroPhotoCard — right-column composition for the hero (Figma 2527:29175,
 * "Group 7", 770×870). Inside this group:
 *   - Photo card composition (Figma 2517:28762, "Group 2") — two rotated
 *     cards with the JPG layered inside the front card. Kept as React so
 *     the JPG sits behind the gold border at the right scale.
 *   - Floating UI cards (2517:28765/68/73/79/88, 2527:29190) — each is a
 *     composed Figma vector exported as a single SVG. Positioned by the
 *     centre of their card frame; the SVG includes its own drop shadow so
 *     left/top values offset by the shadow's transparent padding.
 *   - Sparkle decoration (2527:29150) — single composed SVG.
 *
 * Positions verified against get_metadata for hero frame 2513:27809 — see
 * wiki/figma-fidelity.md "Nested decoration extraction".
 */

const HeroPhotoCard = () => {
  log('render');
  return (
    <div className="relative w-full max-w-[770px] aspect-[770/870] mx-auto">
      {/* Sparkle — Figma 2527:29150 (181×180 at relative 162,65) */}
      <img
        src={sparkleVector}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '7.44%', left: '21.08%', width: '23.51%', height: '20.69%' }}
      />

      {/* Photo composition — Group 2 (2517:28762).
        Behind: tilted gold-fill card (Figma 2524:29059) — yellow border on
        a #c8951a fill, rotated -14° per design.
        Front: gold-bordered card (Figma 2517:28763) holding the JPG,
        rotated +7° per design. */}
      <div
        aria-hidden="true"
        className="absolute top-[12%] left-[6%] w-[55%] h-[70%] origin-center"
        style={{ transform: 'rotate(-13.97deg)' }}
      >
        <div
          className="w-full h-full rounded-[50px] border-[5px]"
          style={{ borderColor: '#c1d4c4', backgroundColor: '#c8951a' }}
        />
      </div>

      <div
        className="absolute top-[8%] left-[26%] w-[62%] h-[82%] origin-center overflow-hidden rounded-[50px]"
        style={{
          transform: 'rotate(6.99deg)',
          border: '5px solid #c8951a',
          boxShadow: '0 2px 2px -1px rgba(27,36,44,0.04), 0 16px 24px -6px rgba(27,36,44,0.16)',
        }}
      >
        {/* Photo placement matches Figma 2517:28764 — image at 108.68% × 113.06%
          of an outer container that itself extends ~9px past each side of the
          card, then offset (-8.89%, -8.94%) to crop the bottom-right portion
          of the photo (where the students' faces and the phone are). */}
        <div className="absolute" style={{ inset: '-9.27px -6.24px -5.29px -5.44px' }}>
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={studentsPhoto}
              alt="Three students looking at a phone, smiling"
              className="absolute"
              style={{
                width: '108.68%',
                height: '113.06%',
                maxWidth: 'none',
                left: '-8.89%',
                top: '-8.94%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating UI cards — composed SVGs. Each value here is the SVG's
        top-left as a % of the 770×870 group, placing the card's inner
        bounds (excluding shadow padding) where Figma reports the frame. */}

      {/* "1,580 / Your next adventure" — Figma 2517:28765 (129×96 frame, 191×157 SVG) */}
      <img
        src={yourNextAdventureCard}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '25.20%', left: '15.45%', width: '24.81%', height: '18.05%' }}
      />

      {/* "Power your career!" pill — Figma 2517:28768 (190×39 frame, 246×95 SVG) */}
      <img
        src={powerYourCareerCard}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '46.67%', left: '-3.64%', width: '31.95%', height: '10.92%' }}
      />

      {/* "Quiz Complete" pill — Figma 2517:28773 (128×38 frame, 192×102 SVG) */}
      <img
        src={quizCompleteCard}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '72.76%', left: '6.49%', width: '24.94%', height: '11.72%' }}
      />

      {/* "My Experience" form card — Figma 2517:28779 (178.6×148.6 frame, 239×209 SVG) */}
      <img
        src={myExperienceCard}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '13.71%', left: '74.77%', width: '31.04%', height: '24.02%' }}
      />

      {/* "+350 XP earned today" pill — Figma 2527:29190 (175×41 frame, 175×45 SVG, no shadow padding) */}
      <img
        src={xpEarnedTodayCard}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '63.06%', left: '19.22%', width: '22.73%', height: '5.17%' }}
      />

      {/* "Lift your talent / Find your match today" gold card — Figma 2517:28788 (193×109 frame, 229×145 SVG) */}
      <img
        src={liftYourTalentCard}
        alt=""
        aria-hidden="true"
        className="absolute"
        style={{ top: '82.41%', left: '69.74%', width: '29.74%', height: '16.67%' }}
      />
    </div>
  );
};

export default HeroPhotoCard;
