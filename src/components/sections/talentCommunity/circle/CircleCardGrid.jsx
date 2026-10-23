/*
 * CircleCardGrid — Figma `Circle grid`: Focused = 2 columns of up-to-520px horizontal cards (18px gap); Playful = ~256px portrait
 * cards, 16px gap, top-aligned (the cards have different heights and a slight tilt). One column on phones in both.
 * Props: children.
 */
const CircleCardGrid = ({ children }) => (
  <div className="grid grid-cols-1 items-start gap-[18px] min-[640px]:grid-cols-[repeat(auto-fill,minmax(min(100%,430px),520px))] playful:gap-[16px] playful:min-[640px]:grid-cols-[repeat(auto-fill,256px)] playful:max-[639px]:justify-center">
    {children}
  </div>
);

export default CircleCardGrid;
