/*
 * AccentText — renders a heading string with one trailing/inner phrase in an accent colour (Figma character overrides in the section
 * titles: green #387440 on light sections, gold #ffd86b on dark ones). `accent` must be a substring of `children`.
 */
const AccentText = ({ children, accent, tone = 'green' }) => {
  const text = String(children);
  const i = accent ? text.indexOf(accent) : -1;
  if (i < 0) return text;
  const colour = tone === 'gold' ? 'text-[#ffd86b]' : 'text-[#387440]';
  return (
    <>
      {text.slice(0, i)}
      <span className={colour}>{accent}</span>
      {text.slice(i + accent.length)}
    </>
  );
};

export default AccentText;
