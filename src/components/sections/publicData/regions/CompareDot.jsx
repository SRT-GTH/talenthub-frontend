/* CompareDot — the 10px region-colour dot used by every compare card (Figma ellipse 10x10, e.g. 8495:2030). */

const CompareDot = ({ colour }) => (
  <span
    aria-hidden="true"
    className="size-[10px] shrink-0 rounded-full"
    style={{ background: colour }}
  />
);

export default CompareDot;
