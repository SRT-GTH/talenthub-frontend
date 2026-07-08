import { debug } from '../../../utils/debug.js';
import photo1 from '../../../assets/hero/talent-panel-photo-1.png';
import photo2 from '../../../assets/hero/talent-panel-photo-2.png';
import photo3 from '../../../assets/hero/talent-panel-photo-3.png';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import gthIcon from '../../../assets/hero/talent-panel-gth-icon.svg';
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';
import PhotoCard from './PhotoCard.jsx';
import WatchTutorial from '../../ui/WatchTutorial.jsx';

const log = debug('TalentDobPanelContent');

/*
 * TalentDobPanelContent — foreground composition for the Date-of-Birth step's
 * right panel (talent onboarding step 1).
 *
 * Figma reference: node 2236-901, panel 739 × 916 px.
 *
 * ONE-CONTAINER rule: every element lives inside a single absolute inset-0
 * container so all cards stay in formation as the panel scales.
 *
 * Overlay grouping rule: every badge/chip that is visually "on" a card is
 * rendered as a child of that card's PhotoCard group div. Positions are
 * expressed as % of the card's width so they scale with the card automatically.
 *
 * vw formula for widths: px / 739 × 42vw
 *   CARD1_W  (288 px): 288/739 × 42 ≈ 16.4 vw
 *   CARD23_W (331 px): 331/739 × 42 ≈ 18.8 vw
 *
 * Photo card layout (Figma centres, panel reference 739 × 916):
 *   Top-left    2236-906  centre (30.26%, 23.44%)  rotate 7°   border #EBC2BD
 *   Centre      2248-1317 centre (72.15%, 48.09%)  rotate 5°   border #EEDEB8
 *   Bottom-left 2248-1320 x=27.27% bottom=6.82%    rotate -13° border #C1D4C4
 *
 * ✅ VERIFIED — Figma node 2236-901, built 2026-07-08
 */

const CARD1_W = 'clamp(120px, 16.4vw, 288px)'; // centre card 288.264 px
const CARD23_W = 'clamp(145px, 18.8vw, 331px)'; // outer cards 331.549 px

export default function TalentDobPanelContent() {
  log('mount');

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* ── TOP-LEFT card (Figma 2236-906) ──────────────────────────────────────
          centre (30.26%, 23.44%), rotate 7°, border #EBC2BD, corner ellipse23
          ↳ Data Protected chip (2255-1472) GROUPED inside this PhotoCard.
            Positions are % of CARD23_W so the chip moves with the card.
            Offset from card top-left: left=-10%, top=86.3%, width=80%          */}
      <PhotoCard
        src={photo2}
        borderColor="#EBC2BD"
        rotation="7deg"
        left="calc(50% - 19.74%)"
        top="calc(50% - 26.56%)"
        cardWidth={CARD23_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.9px -2.47px -10.56px"
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

      {/* ── CENTRE card (Figma 2248-1317) ───────────────────────────────────────
          centre (72.15%, 48.09%), rotate 5°, border #EEDEB8, corner ellipse1
          ↳ GDPA badge (2255-1480) GROUPED — offset from card top-left:
              left=7.4%, top=-30.4%, width=96%, height=13.9%
          ↳ Adult/Youth card (2255-1423) GROUPED — offset:
              left=19.5%, top=120.3%, width=82% (height auto = content)        */}
      <PhotoCard
        src={photo1}
        borderColor="#EEDEB8"
        rotation="5deg"
        left="calc(50% + 22.15%)"
        top="calc(50% - 1.91%)"
        cardWidth={CARD1_W}
        ellipseSrc={ellipseCard1}
        inset="-17.98px -9.18px -1.76px -10.56px"
      >
        {/* Ghana Data Protection Act badge */}
        <div
          style={{
            position: 'absolute',
            left: '7.4%',
            top: '-30.4%',
            width: '96%',
            height: '13.9%',
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
            left: '19.5%',
            top: '120.3%',
            width: '82%',
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
          {/* Selected: Adult experience */}
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
          {/* Unselected: Youth experience */}
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

      {/* ── BOTTOM-LEFT card (Figma 2248-1320) ──────────────────────────────────
          x=27.27% bottom=6.82%, rotate -13°, border #C1D4C4, corner ellipse23
          (6.82% = card-actual bottom-edge clearance after accounting for the
          container padding: 29.44px + (397.635-331.55)/2 = 62.48px / 916)
          ↳ sparkle-26 as cornerDecoration — top-right corner, rotates with card */}
      <PhotoCard
        src={photo3}
        borderColor="#C1D4C4"
        rotation="-13deg"
        left="calc(50% - 22.73%)"
        bottom="6.82%"
        cardWidth={CARD23_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.89px -2.47px -10.56px"
        cornerDecoration={
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'translate(45%, -60%)',
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
                transform: 'rotate(32deg)',
              }}
              draggable={false}
            />
          </div>
        }
      />

      {/* ── Watch Tutorial button ────────────────────────────────────────────────
          Reuses the existing WatchTutorial component (same as InstitutionRightPanel).
          Positioned bottom-right; the tutorial modal will be wired later.       */}
      <div className="absolute bottom-8 right-8 z-10">
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
