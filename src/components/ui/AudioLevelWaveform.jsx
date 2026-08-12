/**
 * Live audio bars for voice-to-text (Figma 5146:76547 waveform).
 * Flat midline when level≈0; rises toward the Figma bar silhouette when speaking.
 * 8 bars — widths/gaps hand-crafted from the 16×15 glyph proportions.
 */
const BAR_MAX = [0.28, 0.72, 0.48, 0.22, 0.48, 0.95, 0.72, 0.28];

const AudioLevelWaveform = ({ level = 0, className = '' }) => {
  const safe = Math.max(0, Math.min(1, level));

  return (
    <svg viewBox="0 0 16 15" width="48" height="18" aria-hidden="true" className={className}>
      {BAR_MAX.map((peak, i) => {
        const x = 0.53125 + i * 2.125;
        // Silent → thin center line (~1.2px); speaking → interpolate to peak height.
        const h = 1.2 + (peak * 14.875 - 1.2) * safe;
        const y = (15 - h) / 2;
        return <rect key={i} x={x} y={y} width="1.0625" height={h} rx="0.5" fill="#595959" />;
      })}
    </svg>
  );
};

export default AudioLevelWaveform;
