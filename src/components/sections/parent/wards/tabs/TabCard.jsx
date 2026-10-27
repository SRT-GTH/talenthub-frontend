/*
 * TabCard — white card of the ward tabs (Figma "card" 10049:1163 / 10049:1210): r24, pad 24, border #e7e7e7, shadow 0 5px 17px rgba(28,42,33,.03).
 * Props: title, variant ('title' 17/600 ink | 'label' 11/700 uppercase tracking .88), gap (px, default 8), id (heading id), className, children.
 */
const TabCard = ({ title, variant = 'title', gap = 8, id, className = '', children }) => (
  <section
    aria-labelledby={title ? id : undefined}
    style={{ gap }}
    className={`flex min-w-0 flex-col rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_17px_rgba(28,42,33,0.03)] ${className}`}
  >
    {title &&
      (variant === 'label' ? (
        <h2
          id={id}
          className="m-0 font-sans text-[11px] leading-normal font-bold tracking-[0.88px] text-[#575755] uppercase"
        >
          {title}
        </h2>
      ) : (
        <h2
          id={id}
          className="m-0 font-sans text-[17px] leading-normal font-semibold text-[#1c2a21]"
        >
          {title}
        </h2>
      ))}
    {children}
  </section>
);

export default TabCard;
