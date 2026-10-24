import { useState } from 'react';

/*
 * FigmaShot — DEV GALLERY ONLY. Shows the 0.5x Figma export of a component node at its real size (natural width x 2), so it can be put
 * next to the built component. Files live in src/assets/public-data/ui-gallery/<name>.png (export.py png 0.5, node ids in the gallery captions).
 * Props: name (file name without extension), alt, className.
 */

const files = import.meta.glob('../../../../../assets/public-data/ui-gallery/*.png', {
  eager: true,
  import: 'default',
});

const FigmaShot = ({ name, alt, className }) => {
  const [size, setSize] = useState(null);
  const src = files[`../../../../../assets/public-data/ui-gallery/${name}.png`];
  if (!src) {
    return (
      <p className="m-0 rounded-[8px] border border-dashed border-[#c1d4c4] p-[12px] font-sans text-[13px] text-[#595959]">
        No Figma export named “{name}” in assets/public-data/ui-gallery.
      </p>
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? `Figma reference: ${name}`}
      data-figma={name}
      onLoad={(e) =>
        setSize({ w: e.currentTarget.naturalWidth * 2, h: e.currentTarget.naturalHeight * 2 })
      }
      style={size ? { width: size.w, height: size.h, maxWidth: 'none' } : undefined}
      className={className}
    />
  );
};

export default FigmaShot;
