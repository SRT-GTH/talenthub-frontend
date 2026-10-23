/*
 * CirclePageWrap — the `Main · Network` column every My circle screen uses: 22px gap, 28px top / 40px bottom, the 40px (left) and
 * 56px (right) page gutters of Community (clamped to 12px on phones). Props: children.
 */
const CirclePageWrap = ({ children }) => (
  <div className="mx-auto flex w-full max-w-[1602px] flex-col gap-[22px] pb-[40px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.62vw,28px)]">
    {children}
  </div>
);

export default CirclePageWrap;
