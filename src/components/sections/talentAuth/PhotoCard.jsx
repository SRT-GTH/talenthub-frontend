/*
 * PhotoCard — bordered, rotated photo card with corner ellipse glow.
 * Shared by TalentLoginPanelContent, TalentDobPanelContent (and any future
 * talent panel that needs scattered photo cards).
 *
 * Positioning model — the outer group div is sized to `cardWidth × cardWidth`
 * (square) and sits at `left`/`top` (or `bottom`), centre-anchored via
 * `transform: translate(-50%, -50%)` (or `translateX(-50%)` for bottom).
 *
 * `children` are `position: absolute` relative to the group's TOP-LEFT corner,
 * so overlay badges can be expressed as `left/top` % of `cardWidth`. Use this
 * to attach badges that must move with the card as the panel scales.
 *
 * `cornerDecoration` is rendered INSIDE the rotation wrapper, so it rotates
 * with the card — use for sparkles anchored to the card's corner.
 *
 * NOTE: outer group has NO overflow clip — the corner ellipse (at negative
 * insets inside the photo container) bleeds through the card's own
 * overflow:hidden border-radius. Never add overflow:hidden to the outer group.
 */
const CARD_SHADOW = '0px 2px 2px -1px rgba(27,36,44,0.04), 0px 16px 24px -6px rgba(27,36,44,0.16)';

export default function PhotoCard({
  src,
  borderColor,
  rotation,
  left,
  top,
  bottom,
  ellipseSrc,
  cardWidth,
  inset,
  cornerDecoration,
  children,
}) {
  const groupStyle = {
    position: 'absolute',
    width: cardWidth,
    aspectRatio: '1',
    left,
    ...(top !== undefined
      ? { top, transform: 'translate(-50%, -50%)' }
      : { bottom, transform: 'translateX(-50%)' }),
  };

  return (
    <div style={groupStyle}>
      {/* rotation wrapper — cornerDecoration rotates with the card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: `rotate(${rotation})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 'clamp(20px, 2vw, 40px)',
            border: `clamp(5px, 0.7vw, 10px) solid ${borderColor}`,
            overflow: 'hidden',
            boxShadow: CARD_SHADOW,
          }}
        >
          {/* Photo container — negative insets bleed photo to card edges */}
          <div style={{ position: 'absolute', inset, overflow: 'hidden' }}>
            <img
              src={src}
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
            {/* Corner glow ellipse — always in the same container as the photo.
                Positioned at the photo's top-left; clipped to the card's
                rounded border by the parent's overflow:hidden.
                DO NOT move this outside the photo container div. */}
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
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  transform: 'rotate(-4deg)',
                  width: '223px',
                  aspectRatio: '1',
                  flexShrink: 0,
                }}
              >
                <img
                  src={ellipseSrc}
                  alt=""
                  style={{ width: '100%', height: '100%', display: 'block' }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* cornerDecoration: anchored to the card's own corner (rotates with card) */}
        {cornerDecoration}
      </div>

      {/* Overlay children: position:absolute relative to this card group's
          top-left corner. Express left/top as % of cardWidth so they scale
          proportionally whenever the card scales. */}
      {children}
    </div>
  );
}
