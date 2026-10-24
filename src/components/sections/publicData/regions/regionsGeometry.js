/*
 * regionsGeometry.js — pure geometry helpers of the district map (Theme 8, Figma 8493:1785 "zoom map").
 * ⚠️ ASSUMPTION: only Greater Accra has a drawn district layout (data/regionsData.js GA_ZOOM). For the other 15 regions the zoom map shows the
 * region's own outline from the national map export, and the district markers are spread deterministically around its centre
 * (a stand-in until the GSS district boundaries and capital coordinates arrive).
 */

/** Bounding box of a path made of absolute M / L / H / V / Z commands (the national map export only uses those). */
export const pathBounds = (d) => {
  let x = 0;
  let y = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const touch = () => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };
  const tokens = d.match(/[MLHVZ]|-?\d*\.?\d+/g) ?? [];
  let cmd = 'M';
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (/[MLHVZ]/.test(t)) {
      cmd = t;
    } else if (cmd === 'H') {
      x = parseFloat(t);
      touch();
    } else if (cmd === 'V') {
      y = parseFloat(t);
      touch();
    } else {
      x = parseFloat(t);
      y = parseFloat(tokens[i + 1]);
      i += 1;
      touch();
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
};

/** Diameter in px of a district bubble: area follows talents (14 .. 44, the Greater Accra marker range of Figma 8493:1787). */
export const bubbleSize = (talents, max) =>
  Math.round(14 + 30 * Math.sqrt(Math.max(talents, 0) / Math.max(max, 1)));

/** Golden-angle spiral: i-th marker offset (px) around the centre. */
export const spiralOffset = (i, step = 38) => {
  if (i === 0) return { dx: 0, dy: 0 };
  const angle = i * 2.399963;
  const radius = step * Math.sqrt(i);
  return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius * 0.8 };
};
