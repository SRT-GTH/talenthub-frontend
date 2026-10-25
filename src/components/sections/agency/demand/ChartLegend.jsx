/*
 * ChartLegend — the key under a Trends chart (Figma "legend" 8704:682: gap 16, items gap 6, 12/14 400 #575755). Item kinds: 'box' (10x10 r3 swatch), 'dash' (two 6x2 dashes)
 * and 'line' (16x2 r1 bar, the skill trend key). Props: items [{ label, color, kind }].
 */

const Swatch = ({ item }) => {
  if (item.kind === 'dash') {
    return (
      <span aria-hidden="true" className="flex gap-[2px]">
        <span className="h-[2px] w-[6px]" style={{ background: item.color }} />
        <span className="h-[2px] w-[6px]" style={{ background: item.color }} />
      </span>
    );
  }
  if (item.kind === 'line') {
    return (
      <span
        aria-hidden="true"
        className="h-[2px] w-[16px] rounded-[1px]"
        style={{ background: item.color }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="size-[10px] rounded-[3px]"
      style={{ background: item.color }}
    />
  );
};

const ChartLegend = ({ items }) => (
  <ul className="m-0 flex list-none flex-wrap gap-x-[16px] gap-y-[4px] p-0 font-sans">
    {items.map((it) => (
      <li
        key={it.label}
        className="flex items-center gap-[6px] text-[12px] leading-[14px] text-[#575755]"
      >
        <Swatch item={it} />
        {it.label}
      </li>
    ))}
  </ul>
);

export default ChartLegend;
