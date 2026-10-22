/*
 * KenteStripe — decorative strip (Figma "Pattern · kente stripes (decorative)", e.g. 7797:14865 / 7797:14971).
 * Geometry read from the Figma rects: [x, width, colour, opacity], repeating every 740px. Rendered as a tiled SVG so it spans any width.
 */
const STRIPES = [
  [0, 18, '#c8951a', 0.9],
  [32, 6, '#387440', 1.0],
  [46, 10, '#c0392b', 0.9],
  [78, 4, '#ffd86b', 0.9],
  [92, 24, '#14301a', 0.9],
  [130, 6, '#c8951a', 0.9],
  [144, 18, '#387440', 1.0],
  [184, 6, '#c0392b', 0.9],
  [200, 10, '#ffd86b', 0.9],
  [224, 4, '#14301a', 0.9],
  [236, 24, '#c8951a', 0.9],
  [282, 6, '#387440', 1.0],
  [298, 18, '#c0392b', 0.9],
  [330, 6, '#ffd86b', 0.9],
  [344, 10, '#14301a', 0.9],
  [376, 4, '#c8951a', 0.9],
  [390, 24, '#387440', 1.0],
  [428, 6, '#c0392b', 0.9],
  [442, 18, '#ffd86b', 0.9],
  [482, 6, '#14301a', 0.9],
  [498, 10, '#c8951a', 0.9],
  [522, 4, '#387440', 1.0],
  [534, 24, '#c0392b', 0.9],
  [580, 6, '#ffd86b', 0.9],
  [596, 18, '#14301a', 0.9],
  [628, 6, '#c8951a', 0.9],
  [642, 10, '#387440', 1.0],
  [674, 4, '#c0392b', 0.9],
  [688, 24, '#ffd86b', 0.9],
  [726, 6, '#14301a', 0.9],
];

const PERIOD = 740;

const buildTile = () => {
  const rects = STRIPES.map(
    ([x, w, fill, opacity]) =>
      `<rect x='${x}' width='${w}' height='100' fill='${fill}' fill-opacity='${opacity}'/>`
  ).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${PERIOD}' height='100' preserveAspectRatio='none'>${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const TILE = buildTile();

const KenteStripe = ({ height = 14, className = '' }) => (
  <div
    aria-hidden="true"
    className={className}
    style={{
      height,
      backgroundImage: TILE,
      backgroundSize: `${PERIOD}px 100%`,
      backgroundRepeat: 'repeat-x',
    }}
  />
);

export default KenteStripe;
