import photoGold from '../../../../assets/agency/onboarding/agency-panel-photo-gold.png';
import photoGreen from '../../../../assets/agency/onboarding/agency-panel-photo-green.png';
import photoPink from '../../../../assets/agency/onboarding/agency-panel-photo-pink.png';
import bgGrid from '../../../../assets/hero/institution-panel-bg-grid.png';
import { AgMail, AgShield } from './agencyOnboardingIcons.jsx';

/*
 * AgencyOnboardingPanel — the green right panel of the agency sign-up, rebuilt from the Figma node geometry (11.4.1a "Frame 141" 8596:82 and its twins, 739 x 916).
 * Not the shared OnboardingPanel: Figma draws NO rotation here (photo frames are plain squares). Everything is positioned in panel px / 739 as `cqw` (1 % of the panel width),
 * so the composition scales with the column; the stage is anchored top-left and the aside clips.
 * Layers: bg #387440 · ellipse #f7efdd 50 % (618,-210 · 473 · blur 200) · ellipse #f9ebea 50 % (-170,666 · 473 · blur 300) · grid (383,572 · 358 x 405 · rot 180)
 * · three photo cards (wrapper r40, 10px inside stroke; the image frame is shifted up 8px, so the stroke hides its empty bottom edge) · chips.
 * Layout 'a' (steps 03 + already registered): photos gold (371,271 · 312) pink (36,74 · 331.5) green (73,504 · 331.5).
 * Layout 'b' (step 04): gold (403.5,281 · 276.6) pink (50,119 · 283.6) green (15,474 · 417.8).
 * The "Watch Tutorial" play button is hidden in Figma (frame 145 visible:false, label opacity 0): not drawn.
 * Props: variant 'details' | 'registered' | 'verify'.
 */

const cq = (px) => `${((px / 739) * 100).toFixed(4)}cqw`;
const SHADOW = `0 ${cq(10)} ${cq(17)} rgba(27,36,44,0.14), 0 ${cq(2)} ${cq(2)} rgba(27,36,44,0.05)`;

const LAYOUT = {
  a: {
    photos: [
      { src: photoGold, x: 371.2, y: 271, s: 312.1, shift: [-0.6, -8, 312], stroke: '#EEDEB8' },
      { src: photoPink, x: 36.3, y: 73.7, s: 331.5, shift: [-0.5, -8, 332], stroke: '#EBC2BD' },
      { src: photoGreen, x: 72.7, y: 504.3, s: 331.5, shift: [-0.5, -8, 332], stroke: '#C1D4C4' },
    ],
    chip: { x: 431.4, y: 208.9, w: 234.6 },
    foot: { x: 446.3, y: 643, w: 235.1 },
  },
  b: {
    photos: [
      { src: photoGold, x: 403.5, y: 281.4, s: 276.6, shift: [-0.6, -8, 277], stroke: '#EEDEB8' },
      { src: photoPink, x: 50.1, y: 119, s: 283.6, shift: [-0.6, -8, 284], stroke: '#EBC2BD' },
      { src: photoGreen, x: 15.3, y: 474.3, s: 417.8, shift: [-3, -7.5, 418.3], stroke: '#C1D4C4' },
    ],
    chip: { x: 410.4, y: 208.9, w: 276.6 },
    foot: { x: 448.9, y: 643, w: 230 },
  },
};

const COPY = {
  details: {
    layout: 'a',
    chip: 'No names, no minors’ details',
    card: { title: 'MoU checked', sub: 'Every agency signs an MoU first', tone: 'mint' },
  },
  registered: {
    layout: 'a',
    chip: 'Names masked until they accept',
    card: { title: 'MoU checked', sub: 'Every agency signs an MoU first', tone: 'mint' },
  },
  verify: {
    layout: 'b',
    chip: 'Ghana Data Protection Act compliant',
    card: {
      title: 'Code sent to your work email',
      sub: 'Email · expires in 10 min',
      tone: 'amber',
    },
  },
};

const Photo = ({ p }) => (
  <div
    aria-hidden="true"
    className="absolute overflow-hidden"
    style={{
      left: cq(p.x),
      top: cq(p.y),
      width: cq(p.s),
      height: cq(p.s),
      borderRadius: cq(40),
      boxShadow: SHADOW,
    }}
  >
    <img
      src={p.src}
      alt=""
      draggable={false}
      className="absolute block max-w-none"
      style={{
        left: cq(p.shift[0]),
        top: cq(p.shift[1]),
        width: cq(p.shift[2]),
        height: cq(p.shift[2]),
      }}
    />
    <span
      className="pointer-events-none absolute inset-0"
      style={{ border: `${cq(10)} solid ${p.stroke}`, borderRadius: cq(40) }}
    />
  </div>
);

const AgencyOnboardingPanel = ({ variant = 'details' }) => {
  const copy = COPY[variant] ?? COPY.details;
  const L = LAYOUT[copy.layout];
  const verify = variant === 'verify';
  const amber = copy.card.tone === 'amber';
  return (
    <aside
      aria-label="About agency access"
      className="relative hidden shrink-0 self-stretch overflow-hidden bg-[#387440] lg:block"
      style={{ width: 'clamp(360px, 42.77vw, 739px)', containerType: 'inline-size' }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute rounded-full"
          style={{
            left: cq(618),
            top: cq(-210),
            width: cq(473),
            height: cq(473),
            backgroundColor: 'color-mix(in srgb, #F7EFDD 50%, transparent)',
            filter: `blur(${cq(100)})`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: cq(-170),
            top: cq(666),
            width: cq(473),
            height: cq(473),
            backgroundColor: 'color-mix(in srgb, #F9EBEA 50%, transparent)',
            filter: `blur(${cq(150)})`,
          }}
        />
        <img
          src={bgGrid}
          alt=""
          draggable={false}
          className="absolute block max-w-none object-cover"
          style={{
            left: cq(383),
            top: cq(572),
            width: cq(358),
            height: cq(405),
            transform: 'rotate(180deg)',
          }}
        />
      </div>
      {L.photos.map((p) => (
        <Photo key={p.src} p={p} />
      ))}

      <div
        aria-hidden="true"
        className="absolute flex items-center font-sans"
        style={{
          left: cq(L.chip.x),
          top: cq(L.chip.y),
          width: cq(L.chip.w),
          height: cq(40),
          gap: cq(8),
          padding: `0 ${cq(10)}`,
          backgroundColor: '#fff',
          border: '1px solid rgba(28,42,33,0.06)',
          borderRadius: cq(10),
          boxShadow: `0 ${cq(2)} ${cq(2)} rgba(0,0,0,0.05), 0 ${cq(2)} ${cq(8)} rgba(0,0,0,0.1)`,
        }}
      >
        <AgShield
          className="shrink-0 text-[#387440]"
          style={{ width: cq(13.6), height: cq(13.6) }}
        />
        <span
          className="font-semibold whitespace-nowrap text-[#387440]"
          style={{ fontSize: `max(10px, ${cq(14)})`, letterSpacing: '0.1px' }}
        >
          {copy.chip}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute flex items-center font-sans"
        style={{
          left: cq(25),
          top: cq(334.9),
          width: cq(267.6),
          height: cq(64),
          gap: cq(15),
          padding: `0 ${cq(14.7)}`,
          backgroundColor: amber ? '#C8951A' : '#EBF1EC',
          border: '1px solid #FFFEFC',
          borderRadius: cq(13),
          boxShadow: SHADOW,
        }}
      >
        <span
          className="grid shrink-0 place-items-center"
          style={{
            width: cq(36),
            height: cq(36),
            borderRadius: cq(9),
            backgroundColor: amber ? '#EEDEB8' : '#387440',
            color: amber ? '#967014' : '#fff',
          }}
        >
          <AgShield style={{ width: cq(16), height: cq(16) }} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span
            className="font-bold whitespace-nowrap"
            style={{
              fontSize: `max(9px, ${cq(12)})`,
              lineHeight: 1.3,
              color: amber ? '#FEFEFE' : '#595959',
            }}
          >
            {copy.card.title}
          </span>
          <span
            className="whitespace-nowrap"
            style={{
              fontSize: `max(8px, ${cq(10)})`,
              lineHeight: 1.3,
              color: amber ? '#FEFEFE' : '#595959',
            }}
          >
            {copy.card.sub}
          </span>
        </span>
      </div>

      {verify ? (
        <div
          aria-hidden="true"
          className="absolute flex items-center font-sans"
          style={{
            left: cq(L.foot.x),
            top: cq(L.foot.y),
            width: cq(L.foot.w),
            height: cq(48),
            gap: cq(12),
            padding: `0 ${cq(11)}`,
            backgroundColor: 'rgba(255,255,255,0.92)',
            border: '1px solid #E6E6E6',
            borderRadius: cq(16),
            boxShadow: `0 ${cq(2)} ${cq(8)} rgba(0,0,0,0.08)`,
          }}
        >
          <AgMail className="shrink-0 text-[#387440]" style={{ width: cq(20), height: cq(20) }} />
          <span className="flex min-w-0 flex-col">
            <span
              className="font-bold whitespace-nowrap text-[#1c2a21]"
              style={{ fontSize: `max(9px, ${cq(12)})` }}
            >
              Work email
            </span>
            <span
              className="whitespace-nowrap text-[#70706e]"
              style={{ fontSize: `max(8px, ${cq(11)})` }}
            >
              efua.owusu@nya.gov.gh
            </span>
          </span>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute flex flex-col font-sans"
          style={{
            left: cq(L.foot.x),
            top: cq(L.foot.y),
            width: cq(L.foot.w),
            height: cq(102),
            gap: cq(10),
            padding: `${cq(16)} ${cq(21)}`,
            backgroundColor: 'rgba(255,255,255,0.92)',
            border: '1px solid #E6E6E6',
            borderRadius: cq(16),
            boxShadow: `0 ${cq(2)} ${cq(8)} rgba(0,0,0,0.08)`,
          }}
        >
          <span
            className="flex items-center bg-[#e1eae2]"
            style={{ gap: cq(9), padding: cq(8), borderRadius: cq(6), height: cq(32) }}
          >
            <span
              className="shrink-0 rounded-full bg-[#387440]"
              style={{ width: cq(6), height: cq(6) }}
            />
            <span
              className="font-semibold whitespace-nowrap text-[#387440]"
              style={{ fontSize: `max(9px, ${cq(12)})` }}
            >
              Government agency
            </span>
          </span>
          <span
            className="flex items-center bg-[#e7e7e7]"
            style={{
              gap: cq(9),
              padding: `${cq(6)} ${cq(8)}`,
              borderRadius: cq(6),
              height: cq(28),
            }}
          >
            <span
              className="shrink-0 rounded-full bg-[#575755]"
              style={{ width: cq(6), height: cq(6) }}
            />
            <span
              className="whitespace-nowrap text-[#959592]"
              style={{ fontSize: `max(9px, ${cq(12)})` }}
            >
              Aggregate data · access logged
            </span>
          </span>
        </div>
      )}
    </aside>
  );
};

export default AgencyOnboardingPanel;
