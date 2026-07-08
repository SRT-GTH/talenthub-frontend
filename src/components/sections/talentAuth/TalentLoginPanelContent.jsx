import photo1 from '../../../assets/hero/talent-panel-photo-1.png';
import photo2 from '../../../assets/hero/talent-panel-photo-2.png';
import photo3 from '../../../assets/hero/talent-panel-photo-3.png';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import gthIcon from '../../../assets/hero/talent-panel-gth-icon.svg';
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';
import PhotoCard from './PhotoCard.jsx';

/*
 * TalentLoginPanelContent — foreground composition for the login right panel.
 *
 * Figma reference: node 4704:50608 (Login Screen right panel), 739 × 973 px.
 * Renders inside OnboardingRightPanel (position:relative aside) as a single
 * absolute inset-0 container so all photos + overlay cards share one
 * positioning context and stay in formation at any panel width.
 *
 * Contains:
 *   – PhotoCard (local) — reusable card + photo + corner ellipse
 *   – 3 × PhotoCard (photo1/2/3 at their Figma positions)
 *   – Data Protected chip  (top-left)
 *   – GDPR compliance badge
 *   – Welcome Back stats card (bottom-right, rotate 6°)
 *
 * ✅ VERIFIED — extracted from OnboardingRightPanel.jsx refactor 2026-07-05
 */

// vw-based clamp helpers — panel is clamp(360px, 42vw, 739px).
// Formula: card_px / 739 × 42vw  →  card-as-fraction-of-panel × 42vw
// Card 1 inner (288 px): 288/739 × 42 ≈ 16.4 vw
// Card 2 & 3 inner (331 px): 331/739 × 42 ≈ 18.8 vw
const CARD1_W = 'clamp(120px, 16.4vw, 288px)';
const CARD23_W = 'clamp(145px, 18.8vw, 331px)';

export default function TalentLoginPanelContent() {
  return (
    // One container — all photos + overlay cards share this positioning context
    <div className="absolute inset-0" aria-hidden="true">
      {/* ── Photo Card 1 — woman at desk, top-right, rotate 5° ─────────────── */}
      {/* Figma: centre at left calc(50%+163.72px)→+22.15%, top calc(50%-27.35px)→-2.81% */}
      <PhotoCard
        src={photo1}
        borderColor="#eedeb8"
        rotation="5deg"
        left="calc(50% + 22.15%)"
        top="calc(50% - 2.81%)"
        cardWidth={CARD1_W}
        ellipseSrc={ellipseCard1}
        inset="-17.98px -9.18px -1.76px -10.56px"
      />

      {/* ── Photo Card 2 — group studying, top-left, rotate 7° ─────────────── */}
      {/* Figma: centre at left calc(50%-145.93px)→-19.75%, top calc(50%-242.76px)→-24.95% */}
      <PhotoCard
        src={photo2}
        borderColor="#ebc2bd"
        rotation="7deg"
        left="calc(50% - 19.75%)"
        top="calc(50% - 24.95%)"
        cardWidth={CARD23_W}
        ellipseSrc={ellipseCard23}
        inset="-17.98px -9.9px -2.47px -10.56px"
      />

      {/* ── Photo Card 3 — man in yellow hoodie, bottom-left, -rotate 13° ──── */}
      {/* Figma: centre-X at left calc(50%-167.92px)→-22.72%, bottom 80.37/973=8.26% */}
      {/* sparkle-26 is anchored to this card's top-right corner */}
      <PhotoCard
        src={photo3}
        borderColor="#c1d4c4"
        rotation="-13deg"
        left="calc(50% - 22.72%)"
        bottom="8.26%"
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

      {/* ── Data Protected chip ─────────────────────────────────────────────── */}
      {/* Figma: left 3.38%, top 36.56%, right edge at 60.4% */}
      <div
        className="absolute bg-[#ebf1ec] border border-[#fffefc] rounded-[13px] drop-shadow-[0px_2px_1px_rgba(27,36,44,0.04),0px_16px_12px_rgba(27,36,44,0.16)] flex items-center gap-[9px] px-3 py-2"
        style={{ left: '3.38%', top: '36.56%', right: '60.4%' }}
      >
        <div className="bg-[#387440] rounded-[9px] shrink-0 size-9" />
        <div className="flex flex-col gap-[2px] items-start text-[#595959] min-w-0">
          <p className="font-bold leading-[normal]" style={{ fontSize: 'clamp(9px, 1.1vw, 12px)' }}>
            Data Protected
          </p>
          <p
            className="font-normal leading-snug opacity-[0.72]"
            style={{ fontSize: 'clamp(7px, 0.9vw, 10px)' }}
          >
            Encrypted · Never shared without consent
          </p>
        </div>
      </div>

      {/* ── GDPR compliance badge ───────────────────────────────────────────── */}
      {/* Figma: left 55.54%, top 22.93%, right 7.04% */}
      <div
        className="absolute bg-white border border-[rgba(0,0,0,0.06)] rounded-[10px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.1),0px_2px_0px_rgba(0,0,0,0.05)] flex items-center gap-[8px] px-[10px] py-[8px]"
        style={{ left: '55.54%', top: '22.93%', right: '7.04%' }}
      >
        <div className="flex items-center justify-center shrink-0 size-[13.553px]">
          <img
            src={gthIcon}
            alt=""
            style={{ display: 'block', width: '12px', height: '12px', transform: 'rotate(8deg)' }}
            draggable={false}
          />
        </div>
        <p
          className="text-[#387440] font-semibold tracking-[0.1px] leading-snug"
          style={{ fontSize: 'clamp(10px, 1.2vw, 14px)' }}
        >
          Ghana Data Protection Act compliant
        </p>
      </div>

      {/* ── Welcome Back card — bottom-right, rotate 6° ─────────────────────── */}
      {/* Figma: left 415/739=56.2%, top 685/973=70.4%, card 248×223px.
          Internal positions as % of 248×223 reference frame. */}
      <div
        className="absolute"
        style={{ left: '56.2%', top: '70.4%', width: '36.5%', aspectRatio: '248/223' }}
      >
        <div style={{ width: '100%', height: '100%', transform: 'rotate(6deg)' }}>
          <div
            className="relative bg-white overflow-hidden"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'clamp(10px, 1.37vw, 24px)',
              boxShadow:
                '0px 2px 2px -1px rgba(27,35,44,0.04), 0px 8px 16px -2px rgba(27,36,44,0.12)',
            }}
          >
            {/* Top gradient bar — h = 4/223 = 1.79% */}
            <div
              className="absolute left-0 right-0 top-0 bg-gradient-to-r from-[#387440] to-[#c1d4c4]"
              style={{ height: '1.79%' }}
            />

            {/* Score + name row — h=24.22% top=9.87% left=right=6.45% */}
            <div
              className="absolute"
              style={{ left: '6.45%', right: '6.45%', top: '9.87%', height: '24.22%' }}
            >
              {/* Score circle */}
              <div
                className="absolute left-0 top-0 bg-[#f8f8f4] border-2 border-[#c1d4c4] rounded-full"
                style={{ height: '100%', aspectRatio: '1' }}
              >
                <p
                  className="absolute italic font-display text-[#387440] tracking-[-1px]"
                  style={{
                    fontSize: 'clamp(8px, 1.14vw, 20px)',
                    lineHeight: 1,
                    top: 'calc(50% - 8.33%)',
                    left: 'calc(50% - 11.67%)',
                  }}
                >
                  74
                </p>
                <p
                  className="absolute font-bold text-[#babab7] tracking-[0.5px] uppercase"
                  style={{
                    fontSize: 'clamp(4px, 0.4vw, 7px)',
                    lineHeight: 1,
                    top: 'calc(50% + 18.52%)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Score
                </p>
              </div>

              {/* Welcome back + name */}
              <div
                className="absolute flex flex-col"
                style={{ left: '30.56%', top: '1.85%', right: 0, gap: '6%' }}
              >
                <p
                  className="font-medium text-[#babab7]"
                  style={{ fontSize: 'clamp(5px, 0.57vw, 10px)', lineHeight: 1 }}
                >
                  Welcome back,
                </p>
                <p
                  className="font-bold text-[#111] truncate"
                  style={{ fontSize: 'clamp(6px, 0.8vw, 14px)', lineHeight: 1 }}
                >
                  Abena Mensah
                </p>
              </div>

              {/* Silver Tier badge */}
              <div
                className="absolute bg-[#f8f8f4] border border-[#c6c6c3] flex items-center"
                style={{
                  left: '30.56%',
                  right: '34.96%',
                  top: 'calc(50% + 32.41%)',
                  height: '31.48%',
                  borderRadius: 'clamp(2px, 0.23vw, 4px)',
                  transform: 'translateY(-50%)',
                  paddingLeft: '8%',
                }}
              >
                <p
                  className="font-bold text-[#575755] tracking-[0.4px] uppercase"
                  style={{
                    fontSize: 'clamp(4px, 0.45vw, 9px)',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Silver Tier
                </p>
              </div>
            </div>

            {/* Talent Score bar — top=90/223=40.36% h=20/223=8.97% */}
            <div
              className="absolute"
              style={{ left: '6.45%', right: '6.45%', top: '40.36%', height: '8.97%' }}
            >
              <p
                className="absolute font-bold text-[#babab7] uppercase tracking-[0.6px]"
                style={{
                  fontSize: 'clamp(4px, 0.51vw, 9px)',
                  lineHeight: 1,
                  top: '27.5%',
                  left: 0,
                  transform: 'translateY(-50%)',
                }}
              >
                Talent Score
              </p>
              <p
                className="absolute font-bold text-[#387440]"
                style={{
                  fontSize: 'clamp(4px, 0.51vw, 9px)',
                  lineHeight: 1,
                  top: '27.5%',
                  left: '92.27%',
                  transform: 'translateY(-50%)',
                }}
              >
                74%
              </p>
              <div
                className="absolute left-0 right-0 bg-[#f8f8f4] overflow-hidden"
                style={{ top: '75%', height: '25%', borderRadius: 'clamp(1px, 0.17vw, 3px)' }}
              >
                <div
                  className="absolute bg-gradient-to-r from-[#387440] to-[#5caf6a] inset-[0_26%_0_0]"
                  style={{ borderRadius: 'clamp(1px, 0.17vw, 3px)' }}
                />
              </div>
            </div>

            {/* Skills / Badges / Match stats — top=122/223=54.71% h=39/223=17.49% */}
            <div
              className="absolute"
              style={{ left: '6.45%', right: '6.45%', top: '54.71%', height: '17.49%' }}
            >
              {[
                { label: 'Skills', value: '12', left: 0, right: '68.52%' },
                { label: 'Badges', value: '3', left: '34.26%', right: '34.26%' },
                { label: 'Match', value: '94%', left: '68.52%', right: 0 },
              ].map(({ label, value, left, right }) => (
                <div
                  key={label}
                  className="absolute inset-y-0 bg-[#f8f8f4] flex flex-col items-center justify-center"
                  style={{ left, right, gap: '8%', borderRadius: 'clamp(3px, 0.34vw, 6px)' }}
                >
                  <p
                    className="italic font-display text-[#111] tracking-[-0.5px]"
                    style={{ fontSize: 'clamp(6px, 0.85vw, 15px)', lineHeight: 1 }}
                  >
                    {value}
                  </p>
                  <p
                    className="font-bold text-[#babab7] tracking-[0.5px] uppercase"
                    style={{ fontSize: 'clamp(3px, 0.46vw, 8px)', lineHeight: 1 }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Opportunities bar — top=173/223=77.58% h=34/223=15.25% */}
            <div
              className="absolute bg-[#ebf1ec] border border-[#c1d4c4] flex items-center"
              style={{
                left: '6.45%',
                right: '6.45%',
                top: '77.58%',
                height: '15.25%',
                borderRadius: 'clamp(4px, 0.57vw, 10px)',
                paddingLeft: '5.09%',
                gap: '3%',
              }}
            >
              <div
                className="bg-[#387440] shrink-0 rounded-[3px]"
                style={{
                  width: 'clamp(3px, 0.34vw, 6px)',
                  height: 'clamp(3px, 0.34vw, 6px)',
                }}
              />
              <p style={{ fontSize: 'clamp(5px, 0.58vw, 10px)', lineHeight: 1 }}>
                <span className="font-bold text-[#387440]">47</span>
                <span className="font-semibold text-[#2a5730]"> new opportunities matched</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
