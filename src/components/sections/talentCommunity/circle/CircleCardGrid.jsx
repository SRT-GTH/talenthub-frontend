/*
 * CircleCardGrid — Figma `Circle grid`: Focused = 2 columns of up-to-520px horizontal cards (18px gap); Playful = three ~330px
 * portrait cards per row of the 1058px column (16px between cards, 28px between rows), top-aligned (the cards have different
 * heights and a slight tilt). Narrower screens fit as many 300px+ columns as there is room for; one column on phones in both.
 * Props: children.
 */
const CircleCardGrid = ({ children }) => (
  <div className="grid grid-cols-1 items-start gap-[18px] min-[640px]:grid-cols-[repeat(auto-fill,minmax(min(100%,430px),520px))] playful:gap-x-[16px] playful:gap-y-[28px] playful:min-[640px]:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
    {children}
  </div>
);

export default CircleCardGrid;
