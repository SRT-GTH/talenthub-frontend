import { debug } from '../../../utils/debug.js';
import photo1 from '../../../assets/hero/talent-panel-photo-1.png';
import photo2 from '../../../assets/hero/talent-panel-photo-2.png';
import photo3 from '../../../assets/hero/talent-panel-photo-3.png';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import gthIcon from '../../../assets/hero/talent-panel-gth-icon.svg';
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';
import arrowDown from '../../../assets/hero/talent-panel-arrow-down.svg';
import arrowScribble from '../../../assets/hero/talent-panel-arrow-scribble.svg';
import PhotoCard from './PhotoCard.jsx';
import WatchTutorial from '../../ui/WatchTutorial.jsx';

const log = debug('TalentPersonalInfoPanelContent');

/*
 * TalentPersonalInfoPanelContent — foreground composition for the
 * personal-info ("Build Your Profile") step's right panel (step 2).
 *
 * Figma reference: node 2329-3963, panel 739 × 916 px.
 *
 * ONE-CONTAINER rule: every element sits in a single absolute inset-0
 * container so cards stay in formation as the panel scales.
 *
 * Overlay grouping rule: badges visually "on" a card are children of
 * that card's PhotoCard group div, positioned as % of cardWidth.
 *
 * vw formula: px / 739 × 42vw
 *   CARD1_W  (312 px): 312/739 × 42 ≈ 17.7 vw
 *   CARD23_W (331 px): 331/739 × 42 ≈ 18.8 vw  (unchanged from DOB panel)
 *
 * Card layout (panel ref 739 × 916, centre coords):
 *   Top-left    2329:3973  centre (30.25%, 23.44%)  rotate  -8°  border #EBC2BD
 *   Centre      2329:3967  centre (69.36%, 48.04%)  rotate   5°  border #EEDEB8
 *   Bottom-left 2329:3976  x=30.34% bottom=5.88%   rotate +4.74° border #C1D4C4
 *
 * Differences from TalentDobPanelContent:
 *   – Centre card 312 px (not 288 px), shifted left (19.36% vs 22.15%)
 *   – Top-left rotation -8° (not +7°)
 *   – Bottom-left rotation +4.74° (not -13°), different bottom clearance
 *   – Sparkle-26 at panel top-centre (not corner decoration)
 *   – Two hand-drawn arrow decorations (2353:13937, 2353:13941)
 *
 * ✅ VERIFIED — Figma nodes 2329-3893 / 2329-3963, built 2026-07-08
 */

const CARD1_W = 'clamp(125px, 17.7vw, 312px)'; // centre card 312.132 px
const CARD23_W = 'clamp(145px, 18.8vw, 331px)'; // outer cards 331.549 px

export default function TalentPersonalInfoPanelContent() {
  log('mount');

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* ── TOP-LEFT card (Figma 2329:3973) ─────────────────────────────────
          centre (30.25%, 23.44%), rotate -8°, border #EBC2BD, ellipse23
          ↳ Data Protected chip (2329:3979) GROUPED inside this card.
            Panel-abs position identical to DOB panel ⟹ same relative %:
            left=-10%, top=86.3%, width=80%                                */}
      <PhotoCard
        src={photo2}
        borderColor="#EBC2BD"
        rotation="-8deg"
        left="calc(50% - 19.75%)"
        top="calc(50% - 26.56%)"
        cardWidth={CARD23_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.9px -2.47px -10.56px"
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
                transform: 'rotate(29.55deg)',
              }}
              draggable={false}
            />
          </div>
        }
      >
        <div
          style={{
            position: 'absolute',
            left: '-10%',
            top: '86.3%',
            width: '80%',
            height: '19.3%',
            backgroundColor: '#EBF1EC',
            border: '1px solid #FFFEFC',
            borderRadius: 'clamp(7px, 0.74vw, 13px)',
            boxShadow: '0px 2px 1px rgba(27,36,44,0.04), 0px 16px 12px rgba(27,36,44,0.16)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 0.51vw, 9px)',
            padding: '0 clamp(6px, 0.74vw, 13px)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 'clamp(18px, 2.04vw, 36px)',
              height: 'clamp(18px, 2.04vw, 36px)',
              borderRadius: 'clamp(5px, 0.51vw, 9px)',
              backgroundColor: '#387440',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
            <p
              style={{
                fontSize: 'clamp(6px, 0.68vw, 12px)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: '#111111',
                whiteSpace: 'nowrap',
              }}
            >
              Data Protected
            </p>
            <p
              style={{
                fontSize: 'clamp(5px, 0.57vw, 10px)',
                lineHeight: 1.3,
                color: '#595959',
                opacity: 0.72,
                whiteSpace: 'nowrap',
              }}
            >
              Encrypted · Never shared without consent
            </p>
          </div>
        </div>
      </PhotoCard>

      {/* ── CENTRE card (Figma 2329:3967) ─────────────────────────────────────
          centre (69.36%, 48.04%), rotate 5°, border #EEDEB8, ellipse1
          Card is 312 px (larger than DOB panel's 288 px).
          ↳ GDPA badge (2329:3992) GROUPED — left=17.3%, top=-24.1%, w=88.7%
          ↳ Adult/Youth card (2329:3999) GROUPED — left=28.4%, top=115.1%, w=75.4% */}
      <PhotoCard
        src={photo1}
        borderColor="#EEDEB8"
        rotation="5deg"
        left="calc(50% + 19.36%)"
        top="calc(50% - 1.96%)"
        cardWidth={CARD1_W}
        ellipseSrc={ellipseCard1}
        inset="-17.98px -9.31px -1.89px -10.56px"
      >
        {/* Ghana Data Protection Act badge */}
        <div
          style={{
            position: 'absolute',
            left: '17.3%',
            top: '-24.1%',
            width: '88.7%',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 'clamp(5px, 0.57vw, 10px)',
            boxShadow: '0px 8px 16px rgba(0,0,0,0.1), 0px 2px 0px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 0.45vw, 8px)',
            padding: 'clamp(4px, 0.45vw, 8px) clamp(5px, 0.57vw, 10px)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 'clamp(7px, 0.77vw, 13.553px)',
              height: 'clamp(7px, 0.77vw, 13.553px)',
            }}
          >
            <div
              style={{
                transform: 'rotate(8deg)',
                width: 'clamp(6px, 0.68vw, 12px)',
                height: 'clamp(6px, 0.68vw, 12px)',
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
              fontSize: 'clamp(6px, 0.74vw, 13px)',
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

        {/* Adult / Youth experience selection card */}
        <div
          style={{
            position: 'absolute',
            left: '28.4%',
            top: '115.1%',
            width: '75.4%',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid #E6E6E6',
            borderRadius: 'clamp(8px, 0.91vw, 16px)',
            boxShadow: '0px 12px 44px 0px rgba(0,0,0,0.1), 0px 2px 0px 0px rgba(0,0,0,0.05)',
            padding: 'clamp(8px, 0.91vw, 16px) clamp(10px, 1.19vw, 21px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(5px, 0.57vw, 10px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'clamp(4px, 0.51vw, 9px)',
              alignItems: 'center',
              padding: 'clamp(4px, 0.45vw, 8px)',
              backgroundColor: '#E1EAE2',
              borderRadius: 'clamp(3px, 0.34vw, 6px)',
            }}
          >
            <div
              style={{
                width: 'clamp(3px, 0.34vw, 6px)',
                height: 'clamp(3px, 0.34vw, 6px)',
                borderRadius: '50%',
                backgroundColor: '#387440',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(6px, 0.68vw, 12px)',
                fontWeight: 600,
                color: '#387440',
                lineHeight: '15.6px',
                whiteSpace: 'nowrap',
              }}
            >
              Adult experience
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'clamp(4px, 0.51vw, 9px)',
              alignItems: 'center',
              padding: 'clamp(3px, 0.34vw, 6px) clamp(4px, 0.45vw, 8px)',
            }}
          >
            <div
              style={{
                width: 'clamp(3px, 0.34vw, 6px)',
                height: 'clamp(3px, 0.34vw, 6px)',
                borderRadius: '50%',
                backgroundColor: '#575755',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(6px, 0.68vw, 12px)',
                fontWeight: 400,
                color: '#959592',
                lineHeight: '15.6px',
                whiteSpace: 'nowrap',
              }}
            >
              Youth experience
            </span>
          </div>
        </div>
      </PhotoCard>

      {/* ── BOTTOM-LEFT card (Figma 2329:3976) ──────────────────────────────
          x=50%-19.66%, bottom=5.88%, rotate +4.74°, border #C1D4C4, ellipse23
          No overlays or cornerDecoration.                                   */}
      <PhotoCard
        src={photo3}
        borderColor="#C1D4C4"
        rotation="4.74deg"
        left="calc(50% - 19.66%)"
        bottom="5.88%"
        cardWidth={CARD23_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.89px -2.47px -10.56px"
      />

      {/* ── Arrow down / scribble (Figma 2353:13941) ─────────────────────────
          Hand-drawn downward arrow, left mid-panel area (11.77%, 45.85%).
          Points toward the bottom-left card.                               */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '11.77%',
          top: '42.85%',
          width: '12.87%',
          aspectRatio: '95.1 / 96',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <img
          src={arrowDown}
          className="rotate-90"
          alt=""
          style={{ display: 'block', width: '100%', height: '100%' }}
          draggable={false}
        />
      </div>

      {/* ── Arrow scribble (Figma 2353:13937) ────────────────────────────────
          Hand-drawn right/turn arrow, bottom-right area (84.17%, 65.28%).  */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '84.17%',
          top: '65.28%',
          width: '7.92%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <img
          src={arrowScribble}
          alt=""
          style={{ display: 'block', width: '100%', height: '100%' }}
          draggable={false}
        />
      </div>

      {/* ── Watch Tutorial button ────────────────────────────────────────────
          Figma 2329: WatchTutorial at left=470px, top=802px (h=76px, w=211px).
          bottom = 916-802-76 = 38px · right = 739-470-211 = 58px           */}
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
