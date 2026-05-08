/*
 * Figma position helpers — read raw geometry out of the Figma MCP
 * `get_metadata` XML (or REST `absoluteBoundingBox` / `relativeTransform`)
 * and turn it into the numbers you'd write into Tailwind / inline styles.
 *
 * Why this exists: the Figma MCP `get_design_context` transforms layout into
 * "developer-friendly" auto-layout relationships — great for content rows,
 * useless for free-floating decorative vectors (orbs, scribbles, sparkles)
 * where the absolute x/y/rotation IS the design intent. `get_metadata` is
 * the lowest-level tool the MCP exposes; pair it with these helpers to
 * recover precise positions for nested decoration.
 *
 * See wiki/figma-fidelity.md → "Nested decoration extraction".
 */

/**
 * Compute a child's position relative to its parent frame.
 *
 * @param {{x:number,y:number,width:number,height:number}} child  child absolute box
 * @param {{x:number,y:number}} parent                            parent absolute box (only x/y used)
 * @returns {{left:number,top:number,width:number,height:number}}
 */
export const relativeTo = (child, parent) => ({
  left: child.x - parent.x,
  top: child.y - parent.y,
  width: child.width,
  height: child.height,
});

/**
 * Extract rotation (degrees, CSS convention — clockwise positive) from a
 * Figma `relativeTransform` matrix `[[a,b,tx],[c,d,ty]]`.
 *
 * Figma stores rotation as the first 2x2 of an affine matrix:
 *   [ cos(-θ)  -sin(-θ) ]   [ a  b ]
 *   [ sin(-θ)   cos(-θ) ] = [ c  d ]
 *
 * Figma's θ is counter-clockwise; CSS rotate() is clockwise — so we flip the sign.
 *
 * @param {number[][]} matrix  Figma relativeTransform 2x3 matrix
 * @returns {number}           degrees suitable for `transform: rotate(Xdeg)`
 */
export const rotationFromMatrix = (matrix) => {
  const a = matrix[0][0];
  const b = matrix[0][1];
  const radians = Math.atan2(-b, a);
  return -(radians * 180) / Math.PI;
};

/**
 * Pretty-format a position record as a Tailwind inline-style object.
 * Useful when porting numbers from a `get_metadata` walk straight into JSX.
 *
 * @param {{left:number,top:number,width:number,height:number,rotation?:number}} pos
 */
export const toStyle = ({ left, top, width, height, rotation }) => ({
  position: 'absolute',
  left: `${left}px`,
  top: `${top}px`,
  width: `${width}px`,
  height: `${height}px`,
  ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}),
});

/**
 * Convert a child position into percentages of a parent box — preferred when
 * the parent will scale (e.g. the hero photo card uses % insets so the
 * composition stays intact across viewport widths).
 *
 * @param {{x:number,y:number,width:number,height:number}} child
 * @param {{x:number,y:number,width:number,height:number}} parent
 * @returns {{leftPct:number,topPct:number,widthPct:number,heightPct:number}}
 */
export const relativePercent = (child, parent) => ({
  leftPct: ((child.x - parent.x) / parent.width) * 100,
  topPct: ((child.y - parent.y) / parent.height) * 100,
  widthPct: (child.width / parent.width) * 100,
  heightPct: (child.height / parent.height) * 100,
});
