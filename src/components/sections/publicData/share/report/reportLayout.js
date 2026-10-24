/*
 * reportLayout — position helper of the A4 report kit (Figma 8.8.1 v2 report kit). Every page is a fixed 1123×794 canvas (A4 landscape at
 * 96 dpi) whose parts are placed by their Figma coordinates, so `at(left, top, width, height)` returns the absolute-position style of a part.
 */

export const REPORT_W = 1123;
export const REPORT_H = 794;

export const at = (left, top, width, height) => {
  const style = { position: 'absolute', left, top };
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;
  return style;
};
