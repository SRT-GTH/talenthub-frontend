/*
 * Red waveform above the avatars while the talent speaks - Figma 9149:83490 (VC-01), 105x21, 18 bars of 3x(5..21), gap 3,
 * radius 2, #d93025. `level` (0-1, mic level) scales the bars in a live call; without it the Figma silhouette is drawn.
 */
const HEIGHTS = [5, 10, 16, 11, 21, 14, 8, 18, 13, 6, 19, 10, 14, 5, 11, 16, 8, 13];

const ListeningWaveform = ({ level = null }) => {
  const scale = level == null ? 1 : 0.3 + 0.7 * Math.max(0, Math.min(1, level));
  return (
    <span aria-hidden="true" className="flex h-[21px] w-[105px] items-center gap-[3px]">
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-[2px] bg-[#d93025] transition-[height] duration-100"
          style={{ height: Math.max(3, Math.round(h * scale)) }}
        />
      ))}
    </span>
  );
};

export default ListeningWaveform;
