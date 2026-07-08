import studentPhoto from '../../../assets/hero/talent-welcome-panel-img.png';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import gthIcon from '../../../assets/hero/talent-panel-gth-icon.svg';
import avatar1 from '../../../assets/hero/talent-panel-institution-avatar-1.jpg';
import avatar2 from '../../../assets/hero/talent-panel-institution-avatar-2.jpg';
import avatar3 from '../../../assets/hero/talent-panel-institution-avatar-3.jpg';

/*
 * TalentWelcomePanelContent — foreground composition for the onboarding welcome
 * right panel.
 *
 * Figma reference: node 2858:23709 (Welcome right panel), 739 × 973 px.
 *
 * IMPORTANT — one-container rule:
 *   The main photo card AND all 5 overlay cards live inside a single
 *   `position:absolute; inset:0` container. This keeps every element in
 *   the same positioning context so they always stay in formation with the
 *   central photo regardless of panel width. Never move overlay cards
 *   outside this container.
 *
 * All positions are % of the 739×973 panel reference. Widths use vw-based
 * clamp (panel = clamp(360px,42vw,739px)); formula: px/739×42vw.
 *
 * Props:
 *   showToast — whether to render the 3-second welcome toast (Figma 2858:23758)
 *
 * ✅ VERIFIED — Figma node 2858:23709, built 2026-07-05
 */

// Panel = clamp(360px, 42vw, 739px); for width clamp: px/739*42vw
// Photo: 573px → 573/739*42 = 32.55vw
// Jobs card: 134px → 134/739*42 = 7.61vw
// Experience card: 185px → 185/739*42 = 10.51vw
// Institution card: 222px → 222/739*42 = 12.61vw
const CARD_SHADOW = '0px 2px 2px -1px rgba(27,36,44,0.04), 0px 16px 24px -6px rgba(27,36,44,0.16)';

export default function TalentWelcomePanelContent({ showToast = false }) {
  return (
    // ONE container — photo + all overlay cards always move together
    <div className="absolute inset-0" aria-hidden="true">
      {/* ── Main photo card — centred with slight left offset, rotate 4° ───── */}
      {/* Figma 2858:23714: centre at left calc(50%-23.32px)=46.84%, top 50% */}
      {/* width 573px, aspectRatio 573/635, border 10px solid #eedeb8, radius 26px */}
      <div
        style={{
          position: 'absolute',
          left: '46.84%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(240px, 32.5vw, 573px)',
        }}
      >
        <div style={{ width: '100%', transform: 'rotate(4deg)', aspectRatio: '573/635' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 'clamp(14px, 1.48vw, 26px)',
              border: 'clamp(5px, 0.57vw, 10px) solid #eedeb8',
              overflow: 'hidden',
              boxShadow: CARD_SHADOW,
            }}
          >
            <img
              src={studentPhoto}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              draggable={false}
            />
            {/* Corner glow ellipse — same pattern as login photo cards */}
            {/* NO overflow-hidden/rounded-full on parent — SVG gradient fades naturally */}
            <div
              style={{
                position: 'absolute',
                left: '-75.84px',
                top: '-85.44px',
                width: '238px',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ transform: 'rotate(-4deg)', width: '223px', aspectRatio: '1' }}>
                <img
                  src={ellipseCard1}
                  alt=""
                  style={{ width: '100%', height: '100%' }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── "1,580 Jobs Available" card — top-left, rotate 4.71° ──────────── */}
      {/* Figma 2858:23717: inset 28.13% 77.67% 61.85% 4.19% → left 4.19% top 28.13% */}
      {/* width = (1-0.0419-0.7767)*739 = 18.14% → 134px at max */}
      <div
        style={{
          position: 'absolute',
          left: '4.19%',
          top: '28.13%',
          width: 'clamp(64px, 7.61vw, 134px)',
          transform: 'rotate(4.71deg)',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'clamp(8px, 1.02vw, 18px)',
            boxShadow: CARD_SHADOW,
            padding: 'clamp(8px, 0.95vw, 16px)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 2.04vw, 36px)',
              lineHeight: 1,
              color: '#111111',
              fontWeight: 400,
            }}
          >
            1,580
          </p>
          <p
            style={{
              fontSize: 'clamp(5px, 0.68vw, 12px)',
              fontWeight: 500,
              color: '#70706E',
              marginTop: '4px',
              letterSpacing: '0.2px',
              lineHeight: 1.4,
            }}
          >
            Jobs Available
          </p>
        </div>
      </div>

      {/* ── "Saved" green pill — left side, below Jobs card ──────────────── */}
      {/* Figma 2858:23720: inset 51.07% 80.67% 44.67% 6.5% → left 6.5% top 51.07% */}
      {/* bg #387440, border 1px solid #2a5730, bottom shadow 0px 4px 0px #2a5730 */}
      <div style={{ position: 'absolute', left: '6.5%', top: '51.07%' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'clamp(4px, 0.54vw, 8px)',
            backgroundColor: '#387440',
            border: '1px solid #2a5730',
            borderRadius: 'clamp(5px, 0.57vw, 10px)',
            padding: 'clamp(4px, 0.54vw, 8px) clamp(6px, 0.81vw, 14px)',
            boxShadow: '0px 4px 0px #2a5730, 0px 8px 28px rgba(56,116,64,0.25)',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 'clamp(8px, 0.8vw, 14px)',
              height: 'clamp(8px, 0.8vw, 14px)',
            }}
          >
            <path d="M3 1.5h8a1 1 0 0 1 1 1V12l-5-3-5 3V2.5a1 1 0 0 1 1-1z" fill="white" />
          </svg>
          <span
            style={{
              fontSize: 'clamp(7px, 0.91vw, 16px)',
              fontWeight: 500,
              color: 'white',
              letterSpacing: '0.2px',
              lineHeight: 1,
            }}
          >
            Saved
          </span>
        </div>
      </div>

      {/* ── "Verified profile" white pill — lower-left ───────────────────── */}
      {/* Figma 2858:23725: centre at left calc(50%-279.07px)=12.24%, top calc(50%+182.58px)=68.76% */}
      {/* GTH icon (gthIcon.svg) + "Verified profile" label */}
      <div
        style={{
          position: 'absolute',
          left: '12.24%',
          top: '68.76%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'clamp(4px, 0.54vw, 8px)',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: 'clamp(5px, 0.57vw, 10px)',
            padding: 'clamp(4px, 0.54vw, 8px) clamp(6px, 0.81vw, 14px)',
            boxShadow: '0px 2px 0px rgba(0,0,0,0.05), 0px 8px 32px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
          }}
        >
          <img
            src={gthIcon}
            alt=""
            style={{
              width: 'clamp(10px, 0.81vw, 14px)',
              height: 'clamp(10px, 0.81vw, 14px)',
              transform: 'rotate(8deg)',
              display: 'block',
              flexShrink: 0,
            }}
            draggable={false}
          />
          <span
            style={{
              fontSize: 'clamp(7px, 0.8vw, 14px)',
              fontWeight: 600,
              color: '#387440',
              letterSpacing: '0.1px',
            }}
          >
            Verified profile
          </span>
        </div>
      </div>

      {/* ── "My Experience" card — top-right, rotate 6.59° ───────────────── */}
      {/* Figma 2858:23731: inset 18.82% 7.12% 65.94% 67.81% → left 67.81% top 18.82% */}
      {/* width (1-0.0712-0.6781)*739 = 25.07% → 185px at max */}
      <div
        style={{
          position: 'absolute',
          left: '67.81%',
          top: '18.82%',
          width: 'clamp(76px, 10.51vw, 185px)',
          transform: 'rotate(6.59deg)',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'clamp(6px, 0.68vw, 12px)',
            boxShadow: CARD_SHADOW,
            padding: 'clamp(8px, 0.95vw, 16px)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(6px, 0.8vw, 14px)',
              fontWeight: 700,
              color: '#111111',
              lineHeight: 1.2,
            }}
          >
            My Experience
          </p>
          {/* Skeleton placeholder rows */}
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span
              style={{
                display: 'block',
                height: 'clamp(4px, 0.57vw, 10px)',
                width: '86%',
                borderRadius: '999px',
                backgroundColor: '#EEE7DA',
              }}
            />
            <span
              style={{
                display: 'block',
                height: 'clamp(4px, 0.57vw, 10px)',
                width: '72%',
                borderRadius: '999px',
                backgroundColor: '#EEE7DA',
              }}
            />
            <span
              style={{
                display: 'block',
                height: 'clamp(4px, 0.57vw, 10px)',
                width: '51%',
                borderRadius: '999px',
                backgroundColor: '#EEE7DA',
              }}
            />
          </div>
          <button
            type="button"
            style={{
              marginTop: '8px',
              width: '100%',
              height: 'clamp(20px, 2.04vw, 36px)',
              borderRadius: 'clamp(4px, 0.45vw, 8px)',
              backgroundColor: '#387440',
              color: 'white',
              fontSize: 'clamp(5px, 0.68vw, 12px)',
              fontWeight: 700,
              boxShadow: '0 3px 0 #224626',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* ── "Accra Girls Senior High" institution card — bottom-right ────── */}
      {/* Figma 2858:23740: right 57.61/739=7.79%, top 61.89% */}
      {/* width 222.391px → clamp(94px, 12.61vw, 222px) */}
      {/* bg solid #387440, rounded-20, overflow-hidden */}
      <div
        style={{
          position: 'absolute',
          right: '7.79%',
          top: '61.89%',
          width: 'clamp(94px, 12.61vw, 222px)',
          overflow: 'hidden',
          borderRadius: 'clamp(10px, 1.13vw, 20px)',
          backgroundColor: '#387440',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0px 2px 2px -1px rgba(27,35,44,0.04), 0px 8px 16px -2px rgba(27,36,44,0.12)',
        }}
      >
        <div style={{ padding: 'clamp(8px, 0.95vw, 16px)', color: 'white' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 'clamp(3px, 0.34vw, 6px)',
              backgroundColor: 'rgba(255,255,255,0.4)',
              padding: 'clamp(2px, 0.27vw, 4px) clamp(4px, 0.54vw, 8px)',
              fontSize: 'clamp(4px, 0.51vw, 9px)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            ✓ Verified Institution
          </span>
          <p
            style={{
              marginTop: 'clamp(4px, 0.54vw, 8px)',
              fontFamily: 'var(--font-display, serif)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(9px, 1.19vw, 21px)',
              lineHeight: 1.1,
              color: 'white',
            }}
          >
            Accra Girls Senior High
          </p>
          <p
            style={{
              marginTop: 'clamp(2px, 0.27vw, 4px)',
              fontSize: 'clamp(4px, 0.57vw, 10px)',
              lineHeight: 1.3,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Greater Accra · GES-Accredited
          </p>
          {/* Student avatar row — real photos from Figma 2858:23752/23753/23754 */}
          <div style={{ marginTop: 'clamp(6px, 0.81vw, 14px)', display: 'flex' }}>
            {[avatar1, avatar2, avatar3].map((src, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  flexShrink: 0,
                  width: 'clamp(14px, 1.9vw, 28px)',
                  height: 'clamp(14px, 1.9vw, 28px)',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  overflow: 'hidden',
                  marginLeft: i === 0 ? 0 : 'clamp(-4px, -0.54vw, -8px)',
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Welcome toast — Figma 2858:23758, floats top-centre ─────────── */}
      {/* Auto-dismissed after 3s (timer managed by OnboardingWelcomePage). */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            left: '50%',
            top: '24px',
            transform: 'translateX(-50%)',
            width: 'clamp(220px, 17.55vw, 309px)',
            borderRadius: '14px',
            border: '1px solid rgba(0,0,0,0.05)',
            backgroundColor: 'white',
            padding: '12px',
            boxShadow: '0px 16px 24px -6px rgba(27,36,44,0.18)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span
              style={{
                marginTop: '2px',
                display: 'flex',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#EBF1EC',
                color: '#387440',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" />
                <path
                  d="M4.5 7l1.7 2 3.3-3.2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.2, color: '#111111' }}>
                Welcome to GTH, Student!
              </p>
              <p
                style={{ marginTop: '4px', fontSize: '12px', lineHeight: '16px', color: '#70706E' }}
              >
                Your profile is live. Start exploring opportunities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
