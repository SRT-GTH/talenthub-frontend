import { debug } from '../../../utils/debug.js';
import photo1 from '../../../assets/hero/talent-panel-photo-1.png';
import photo2 from '../../../assets/hero/talent-panel-photo-2.png';
import photo3 from '../../../assets/hero/talent-panel-photo-3.png';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import gthIcon from '../../../assets/hero/talent-panel-gth-icon.svg';
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';
import arrowDown from '../../../assets/hero/talent-panel-arrow-down2.svg';
import arrowScribble from '../../../assets/hero/talent-panel-arrow-scribble.svg';
import PhotoCard from './PhotoCard.jsx';
import WatchTutorial from '../../ui/WatchTutorial.jsx';

const log = debug('TalentContactPanelContent');

/*
 * TalentContactPanelContent — foreground composition for the Contact Information
 * step's right panel (talent onboarding step 3).
 *
 * Figma reference: node 2385-38867, panel 739 × 916 px.
 *
 * ONE-CONTAINER rule: every element lives inside a single absolute inset-0
 * container so cards stay in formation as the panel scales.
 *
 * vw formula: px / 739 × 42vw
 *   CARD1_W (276.587 px): 277/739 × 42 ≈ 15.7 vw  (top-right, gold)
 *   CARD2_W (283.562 px): 284/739 × 42 ≈ 16.1 vw  (top-left, pink)
 *   CARD3_W (331.55  px): 332/739 × 42 ≈ 18.8 vw  (bottom-left, green)
 *
 * Card layout (panel 739 × 916, centre coords):
 *   Top-right   2385:38874  centre (71.53%, 47.07%)  rotate  +5°    border #EEDEB8
 *   Top-left    2385:38877  centre (28.58%, 26.0%)   rotate  -8.51° border #EBC2BD
 *   Bottom-left 2385:38880  x=30.34%, bottom=7.31%   rotate -18°    border #C1D4C4
 *
 * Key differences from other talent panels:
 *   – Card arrangement and rotations unique to the contact step
 *   – Sparkle-26 in cornerDecoration of top-left card (photo2, pink, -8.51°)
 *   – "OTP sent after this step" amber chip at panel level (not a card child)
 *   – "Ghana Data Protection Act compliant" chip at panel level
 *   – "Phone" preview card (cream, rotated +2°) near bottom-right
 *   – Same two hand-drawn arrow decorations as TalentPersonalInfoPanelContent
 *
 * ✅ VERIFIED — Figma nodes 2385-38797 / 2385-38867, built 2026-07-08
 */

const CARD1_W = 'clamp(140px, 15.7vw, 277px)'; // top-right  276.587 px
const CARD2_W = 'clamp(142px, 16.1vw, 284px)'; // top-left   283.562 px
const CARD3_W = 'clamp(166px, 18.8vw, 332px)'; // bottom-left 331.55 px

export default function TalentContactPanelContent() {
  log('mount');

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* ── TOP-RIGHT card (Figma 2385:38874) ────────────────────────────────────
          centre (71.53%, 47.07%), rotate +5°, border #EEDEB8, corner ellipse1.
          No overlays — GDPA chip is a separate panel-level element.             */}
      <PhotoCard
        src={photo1}
        borderColor="#EEDEB8"
        rotation="5deg"
        left="calc(50% + 21.53%)"
        top="calc(50% - 2.93%)"
        cardWidth={CARD1_W}
        ellipseSrc={ellipseCard1}
        inset="-17.98px -9.85px -2.43px -10.56px"
      />

      {/* ── TOP-LEFT card (Figma 2385:38877) ─────────────────────────────────────
          centre (28.58%, 26.0%), rotate -8.51°, border #EBC2BD, corner ellipse23.
          Sparkle-26 in cornerDecoration — bleeds from top-right corner of card,
          rotates with the card so it stays in formation as panel scales.        */}
      <PhotoCard
        src={photo2}
        borderColor="#EBC2BD"
        rotation="-8.51deg"
        left="calc(50% - 21.42%)"
        top="calc(50% - 24.0%)"
        cardWidth={CARD2_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.88px -2.46px -10.56px"
        cornerDecoration={
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'translate(38%, -62%)',
              width: '76.735px',
              height: '73.945px',
              pointerEvents: 'none',
            }}
          >
            <img
              src={sparkle26}
              alt=""
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                transform: 'rotate(21.55deg)',
              }}
              draggable={false}
            />
          </div>
        }
      />

      {/* ── BOTTOM-LEFT card (Figma 2385:38880) ──────────────────────────────────
          x=30.34% bottom=7.31%, rotate -18°, border #C1D4C4, corner ellipse23.
          bottom=7.31%: derived from card-centre-y=(916-232.77)px from bottom,
          group bottom-edge = centre-y - CARD3_W/2 ≈ 66.99px = 7.31% of 916.
          Arrow-down lives here as children — positions relative to card group   */}
      <PhotoCard
        src={photo3}
        borderColor="#C1D4C4"
        rotation="-18deg"
        left="calc(50% - 19.66%)"
        bottom="7.31%"
        cardWidth={CARD3_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.89px -2.47px -10.56px"
      >
        {/* Arrow down (Figma 2353:13941) — panel pos (74.7px, 408.33px) converted to
            card-group-relative coords (card group top-left at 58.4px, 517.45px):
              left = (74.7 - 58.4) / 331.55 = 4.91%
              top  = (408.33 - 517.45) / 331.55 = -32.91%
            Outer wrapper matches Figma's flex-center container (119.71×119.344px
            at panel scale), inner img is 95.1×96px centred within it (= 79.45%
            × 80.44% of wrapper). The centering is the Y-axis offset from Figma. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '4.91%',
            top: '-20.91%',
            width: '36.1%',
            height: '36.0%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <img
            src={arrowDown}
            alt=""
            style={{ display: 'block', width: '79.45%', height: '80.44%' }}
            draggable={false}
          />
        </div>
      </PhotoCard>

      {/* ── "OTP sent after this step" amber chip (Figma 2385:38883) ────────────
          Figma inset: top=36.56%, right=60.4%, left=3.38%.  Amber bg #C8951A,
          cream border #FAF4E8, rounded-[13px].  MTN-icon placeholder = 36px
          #EEDEB8 rounded-[9px] square (no actual MTN asset used).              */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '3.38%',
          top: '36.56%',
          right: '60.4%',
          backgroundColor: '#C8951A',
          border: '1px solid #FAF4E8',
          borderRadius: 'clamp(8px, 1.3vw, 13px)',
          boxShadow: '0px 2px 2px rgba(27,36,44,0.04), 0px 16px 12px rgba(27,36,44,0.08)',
          padding: 'clamp(7px, 0.81vw, 12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(5px, 0.61vw, 9px)' }}>
          <div
            style={{
              flexShrink: 0,
              width: 'clamp(20px, 2.43vw, 36px)',
              height: 'clamp(20px, 2.43vw, 36px)',
              borderRadius: 'clamp(5px, 0.61vw, 9px)',
              backgroundColor: '#EEDEB8',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <p
              style={{
                fontSize: 'clamp(6px, 0.81vw, 12px)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              OTP sent after this step
            </p>
            <p
              style={{
                fontSize: 'clamp(5px, 0.68vw, 10px)',
                lineHeight: 1.4,
                color: '#FFFFFF',
                opacity: 0.72,
                whiteSpace: 'nowrap',
              }}
            >
              SMS + Email · expires in 10 min
            </p>
          </div>
        </div>
      </div>

      {/* ── "Ghana Data Protection Act compliant" white chip (Figma 2385:38896) ─
          Figma inset: left=55.54%, top=22.81%, right=7.04%.
          White bg, rgba(0,0,0,0.06) border, rounded-[10px], gthIcon rotate 8°.
          Same styling as the GDPA chip inside card children on other panels,
          but positioned panel-level here to sit above the top-right card.      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '55.54%',
          top: '22.81%',
          right: '7.04%',
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 'clamp(5px, 0.68vw, 10px)',
          boxShadow: '0px 8px 16px rgba(0,0,0,0.1), 0px 2px 0px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 0.54vw, 8px)',
          padding: 'clamp(4px, 0.54vw, 8px) clamp(5px, 0.68vw, 10px)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 'clamp(7px, 0.91vw, 13.553px)',
            height: 'clamp(7px, 0.91vw, 13.553px)',
          }}
        >
          <div
            style={{
              transform: 'rotate(8deg)',
              width: 'clamp(6px, 0.81vw, 12px)',
              height: 'clamp(6px, 0.81vw, 12px)',
              flexShrink: 0,
            }}
          >
            <img
              src={gthIcon}
              alt=""
              style={{ width: '100%', height: '100%', display: 'block' }}
              draggable={false}
            />
          </div>
        </div>
        <p
          style={{
            fontSize: 'clamp(6px, 0.88vw, 13px)',
            fontWeight: 600,
            color: '#387440',
            letterSpacing: '0.1px',
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Ghana Data Protection Act compliant
        </p>
      </div>

      {/* ── "Phone" preview card (Figma 2396:19979) ───────────────────────────────
          left=60.38% (446.23/739), top=70.20% (643/916), rotate +2°.
          Cream bg #FAF4E8, gold border #EEDEB8.
          Shadow: 0 3px 0 #967014 (hard bottom shelf) + soft glow.
          MTN-icon placeholder = 26.388px #EEDEB8 rounded-[5px] rotated 2.78°. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '60.38%',
          top: '70.20%',
          width: 'clamp(130px, 15.56vw, 230px)',
          backgroundColor: '#FAF4E8',
          border: '1px solid #EEDEB8',
          borderRadius: 'clamp(6px, 0.68vw, 10px)',
          boxShadow: '0px 3px 0px #967014, 0px 8px 28px rgba(200,149,26,0.14)',
          padding: 'clamp(5px, 0.54vw, 8px)',
          transform: 'rotate(2deg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(5px, 0.54vw, 8px)' }}>
          <div
            style={{
              flexShrink: 0,
              width: 'clamp(15px, 1.78vw, 26.388px)',
              height: 'clamp(15px, 1.78vw, 26.388px)',
              borderRadius: 'clamp(3px, 0.34vw, 5px)',
              backgroundColor: '#EEDEB8',
              transform: 'rotate(2.78deg)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <p
              style={{
                fontSize: 'clamp(7px, 0.81vw, 12px)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: '#111111',
              }}
            >
              Phone
            </p>
            <p
              style={{
                fontSize: 'clamp(6px, 0.74vw, 11px)',
                lineHeight: 1.36,
                color: '#70706E',
                letterSpacing: '0.1px',
              }}
            >
              +233 24 123 4567
            </p>
          </div>
        </div>
      </div>

      {/* ── Arrow scribble (Figma 2353:13937) ────────────────────────────────────
          left=622px/739=84.17%, top=598px/916=65.28%.
          Same position as TalentPersonalInfoPanelContent.                       */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '84.17%',
          top: '65.28%',
          width: '7.92%',
          aspectRatio: '1',
          pointerEvents: 'none',
        }}
      >
        <img
          src={arrowScribble}
          alt=""
          className=""
          style={{ display: 'block', width: '100%', height: '100%' }}
          draggable={false}
        />
      </div>

      {/* ── Watch Tutorial button (Figma 2385:38903) ──────────────────────────────
          left=470px, top=802px → bottom=916-802-76=38px, right=739-470-211=58px.
          Same pixel clearance as TalentPersonalInfoPanelContent.                */}
      <div style={{ position: 'absolute', bottom: '38px', right: '58px', zIndex: 10 }}>
        <WatchTutorial
          label="Watch Tutorial"
          showLabel
          onClick={() => log('watch tutorial clicked')}
          aria-label="Watch onboarding tutorial"
        />
      </div>
    </div>
  );
}
