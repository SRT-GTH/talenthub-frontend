import photoGold from '../../../../assets/admin/staff-panel-photo-gold.webp';
import photoGreen from '../../../../assets/admin/staff-panel-photo-green.webp';
import photoPink from '../../../../assets/admin/staff-panel-photo-pink.webp';
import bgGrid from '../../../../assets/hero/institution-panel-bg-grid.png';
import { AdminShieldCheckIcon } from '../adminIcons.jsx';

/*
 * AdminSignInPanel — the green right panel of the staff sign-in, rebuilt from the Figma node geometry (7.0.1a "Frame 150" 8640:415409, 739 x 973; the same
 * composition as the agency sign-up panel). No rotation: the photo frames are plain squares. Everything is positioned in panel px / 739 as `cqw`
 * (1 % of the panel width), so the composition scales with the column; the stage is anchored top-left and the aside clips.
 * Layers: bg #387440 · ellipse #f7efdd 50 % (618,-210 · 473 · blur 200) · ellipse #f9ebea 50 % (-170,723 · 473 · blur 300) · grid (383,572 · 358 x 405 · rot 180)
 * · photo gold (403,303 · 288) · pink (79,59 · 332) · green (3,570 · 332) · "Immutable audit trail" chip (462,223) · "Least privilege" card (25,356) ·
 * "Today in your queue" card (439,685, 248 wide: SLA ring, stats, dual-approval strip).
 */

const cq = (px) => `${((px / 739) * 100).toFixed(4)}cqw`;
const SHADOW = `0 ${cq(10)} ${cq(17)} rgba(27,36,44,0.14), 0 ${cq(2)} ${cq(2)} rgba(27,36,44,0.05)`;

const PHOTOS = [
  { src: photoGold, x: 403, y: 303, s: 288, shift: [-1, -8, 288], stroke: '#EEDEB8' },
  { src: photoPink, x: 79, y: 59, s: 332, shift: [0, -8, 332], stroke: '#EBC2BD' },
  { src: photoGreen, x: 3, y: 570, s: 332, shift: [-1, -8, 332], stroke: '#C1D4C4' },
];

const STATS = [
  { value: '6', label: 'Flags' },
  { value: '5', label: 'Verifications' },
  { value: '2', label: 'Approvals' },
];

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

const AdminSignInPanel = () => (
  <aside
    aria-label="About staff access"
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
          top: cq(723),
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
    {PHOTOS.map((p) => (
      <Photo key={p.src} p={p} />
    ))}

    <div
      aria-hidden="true"
      className="absolute flex items-center font-sans"
      style={{
        left: cq(462),
        top: cq(223),
        width: cq(174),
        height: cq(40),
        gap: cq(8),
        padding: `0 ${cq(10)}`,
        backgroundColor: '#fff',
        border: '1px solid #1c2a21',
        borderRadius: cq(10),
        boxShadow: SHADOW,
      }}
    >
      <AdminShieldCheckIcon
        className="shrink-0 text-[#387440]"
        style={{ width: cq(14), height: cq(14) }}
      />
      <span
        className="font-semibold whitespace-nowrap text-[#387440]"
        style={{ fontSize: `max(10px, ${cq(14)})` }}
      >
        Immutable audit trail
      </span>
    </div>

    <div
      aria-hidden="true"
      className="absolute flex items-center font-sans"
      style={{
        left: cq(25),
        top: cq(356),
        width: cq(268),
        height: cq(68),
        gap: cq(15),
        padding: `0 ${cq(15)}`,
        backgroundColor: '#EBF1EC',
        border: '1px solid #FFFEFC',
        borderRadius: cq(13),
        boxShadow: SHADOW,
      }}
    >
      <span
        className="grid shrink-0 place-items-center"
        style={{ width: cq(36), height: cq(36), borderRadius: cq(9), backgroundColor: '#387440' }}
      ></span>
      <span className="flex min-w-0 flex-col" style={{ gap: cq(2) }}>
        <span
          className="font-bold whitespace-nowrap text-[#595959]"
          style={{ fontSize: `max(9px, ${cq(12)})`, lineHeight: 1.25 }}
        >
          Least privilege
        </span>
        <span
          className="whitespace-nowrap text-[#595959]"
          style={{ fontSize: `max(8px, ${cq(10)})`, lineHeight: 1.25 }}
        >
          You only see what your role allows
        </span>
      </span>
    </div>

    <div
      aria-hidden="true"
      className="absolute flex flex-col overflow-hidden bg-white font-sans"
      style={{
        left: cq(439),
        top: cq(685),
        width: cq(248),
        height: cq(223),
        border: '1px solid #1c2a21',
        borderRadius: cq(24),
        boxShadow: SHADOW,
      }}
    >
      <span
        className="block shrink-0"
        style={{
          height: cq(4),
          background: 'linear-gradient(90deg,#387440,#c1d4c4)',
        }}
      />
      <div className="flex flex-col" style={{ padding: `${cq(18)} ${cq(15)} 0`, gap: cq(13) }}>
        <div className="flex items-center" style={{ gap: cq(12) }}>
          <span
            className="relative grid shrink-0 place-items-center rounded-full bg-[#f8f8f4]"
            style={{ width: cq(54), height: cq(54), border: `${cq(2)} solid #c1d4c4` }}
          >
            <span
              className="font-semibold text-[#387440]"
              style={{ fontSize: `max(8px, ${cq(19)})`, lineHeight: 1.1, marginTop: cq(-4) }}
            >
              92
            </span>
            <span
              className="absolute font-bold text-[#babab7]"
              style={{ fontSize: `max(5px, ${cq(7)})`, bottom: cq(8) }}
            >
              SLA
            </span>
          </span>
          <span className="flex min-w-0 flex-col" style={{ gap: cq(2) }}>
            <span
              className="font-medium text-[#babab7]"
              style={{ fontSize: `max(7px, ${cq(10)})` }}
            >
              Today in your queue
            </span>
            <span
              className="font-bold whitespace-nowrap text-[#1c2a21]"
              style={{ fontSize: `max(9px, ${cq(14)})` }}
            >
              Trust &amp; Safety
            </span>
            <span
              className="inline-flex w-fit items-center bg-[#f8f8f4] font-bold text-[#575755]"
              style={{
                fontSize: `max(6px, ${cq(9)})`,
                padding: `${cq(3)} ${cq(9)}`,
                border: '1px solid #c6c6c3',
                borderRadius: cq(4),
              }}
            >
              14 ITEMS
            </span>
          </span>
        </div>
        <div className="flex flex-col" style={{ gap: cq(4) }}>
          <span
            className="flex items-center justify-between font-bold"
            style={{ fontSize: `max(6px, ${cq(9)})` }}
          >
            <span className="text-[#babab7]">SLA met</span>
            <span className="text-[#387440]">92%</span>
          </span>
          <span className="block bg-[#f8f8f4]" style={{ height: cq(5), borderRadius: cq(3) }}>
            <span
              className="block h-full"
              style={{
                width: '74%',
                borderRadius: cq(3),
                background: 'linear-gradient(90deg,#387440,#5caf6a)',
              }}
            />
          </span>
        </div>
        <div className="grid grid-cols-3" style={{ gap: cq(6) }}>
          {STATS.map((s) => (
            <span
              key={s.label}
              className="flex flex-col items-center bg-[#f8f8f4]"
              style={{ padding: `${cq(5)} 0`, borderRadius: cq(6) }}
            >
              <span
                className="font-semibold text-[#1c2a21]"
                style={{ fontSize: `max(8px, ${cq(14)})`, lineHeight: 1.2 }}
              >
                {s.value}
              </span>
              <span
                className="font-bold text-[#babab7] uppercase"
                style={{ fontSize: `max(5px, ${cq(6.5)})` }}
              >
                {s.label}
              </span>
            </span>
          ))}
        </div>
        <span
          className="flex items-center bg-[#ebf1ec]"
          style={{
            gap: cq(8),
            padding: `${cq(10)} ${cq(12)}`,
            border: '1px solid #c1d4c4',
            borderRadius: cq(10),
          }}
        >
          <span
            className="shrink-0 rounded-full bg-[#387440]"
            style={{ width: cq(6), height: cq(6) }}
          />
          <span
            className="font-bold whitespace-nowrap text-[#387440]"
            style={{ fontSize: `max(6px, ${cq(10)})` }}
          >
            2 dual approvals waiting for you
          </span>
        </span>
      </div>
    </div>
  </aside>
);

export default AdminSignInPanel;
