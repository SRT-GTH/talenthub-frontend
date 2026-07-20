import { debug } from '../../../../utils/debug.js';

const log = debug('ColorPaletteVisual');

export default function ColorPaletteVisual({ visual, options, selectedAnswer }) {
  log('rendering color palette, selected:', selectedAnswer);

  const { fixedColors, accentSlotIndex } = visual;

  const previewColor =
    selectedAnswer !== null && selectedAnswer !== undefined && options?.[selectedAnswer]
      ? options[selectedAnswer].hex
      : null;

  return (
    <div className="mb-[clamp(14px,1.8vw,26px)]">
      {/* Fixed palette row */}
      <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[10px]">
        Palette (4 fixed + 1 to pick)
      </p>
      <div className="flex gap-[8px] mb-[clamp(16px,2vw,28px)]">
        {fixedColors.map((color, i) => (
          <div
            key={i}
            className="flex-1 h-[clamp(80px,8vw,120px)] rounded-[8px] border border-[#e8e8e4] relative overflow-hidden"
            style={{ backgroundColor: color.hex }}
          >
            {color.label && (
              <span
                className="absolute bottom-[8px] left-[8px] text-[8px] font-sans opacity-70"
                style={{ color: isLightColor(color.hex) ? '#575755' : '#fff' }}
              >
                {color.label}
              </span>
            )}
          </div>
        ))}
        {/* Preview slot */}
        {accentSlotIndex !== null && accentSlotIndex !== undefined && (
          <div
            className="flex-1 h-[clamp(80px,8vw,120px)] rounded-[8px] border-2 border-dashed border-[#c8951a] relative overflow-hidden transition-colors"
            style={{ backgroundColor: previewColor || '#faf9f6' }}
          >
            {!previewColor && (
              <span className="absolute inset-0 flex items-center justify-center text-[#c8951a] text-[10px] font-sans">
                ?
              </span>
            )}
            {previewColor && (
              <span
                className="absolute bottom-[8px] left-[8px] text-[8px] font-sans"
                style={{ color: isLightColor(previewColor) ? '#575755' : '#fff' }}
              >
                {options[selectedAnswer]?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Color swatch options */}
      <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[10px]">
        Pick the accent
      </p>
    </div>
  );
}

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}
