import { classNames } from '../../../../utils/classNames.js';

/*
 * DemandCard — the white card of the Demand & outcomes screens. Same shell as Theme 8's PublicCard (#fff, 1px #e7e7e7, r24, shadow 0 5 17 rgba(0,0,0,.04)) but with the header the
 * AGENCY frames draw at EVERY width, phone and tablet included (Figma 11.4.5o/p: "T8 · Card header" 57 high = px24 pt20 pb16, title 18/21 600, aside 12/14 500 #595959, body px24).
 * Theme 8's CardHeader shrinks to 16px / 16 below md, which the agency phone frames do not do.
 * Props: id, title, hint (string | node), headerExtra (node after the hint), loading (aria-busy), className, bodyClassName.
 */

const DemandCard = ({
  id,
  title,
  hint,
  headerExtra,
  loading = false,
  className,
  bodyClassName,
  children,
}) => {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-busy={loading || undefined}
      className={classNames(
        'min-w-0 rounded-[24px] border border-solid border-[#e7e7e7] bg-white font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-[12px] px-[24px] pt-[20px] pb-[16px]">
        <h2
          id={headingId}
          className={classNames(
            'm-0 text-[18px] leading-[21px] font-semibold text-[#1c2a21]',
            !headerExtra &&
              'shrink-0 whitespace-nowrap max-[359px]:shrink max-[359px]:whitespace-normal'
          )}
        >
          {title}
        </h2>
        {hint || headerExtra ? (
          <div className="flex min-w-0 items-center gap-[12px]">
            {hint ? (
              <span className="text-right text-[12px] leading-[14px] font-medium text-[#595959]">
                {hint}
              </span>
            ) : null}
            {headerExtra}
          </div>
        ) : null}
      </div>
      <div className={bodyClassName ?? 'px-[24px] pb-[24px]'}>{children}</div>
    </section>
  );
};

export default DemandCard;
