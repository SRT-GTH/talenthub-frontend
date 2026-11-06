import { classNames } from '../../../utils/classNames.js';

/*
 * ProfileCard — the white content card of the candidate profile (Figma "About" 10102:41591, "Skills" 10102:41594 …): 16px radius, 1px #e5e8e3 border, 24px padding, the two soft card shadows.
 * An optional title row: Bricolage 22/26 600 heading on the left, `aside` (a note or a link) on the right.
 * Props: title, aside, gapClassName (the Figma gap between the rows: 10 / 12 / 14), as ('section' | 'div' | 'aside'), className, children.
 */
const ProfileCard = ({
  title,
  aside,
  gapClassName = 'gap-[12px]',
  as = 'section',
  className,
  children,
  ...rest
}) => {
  const Tag = as;
  return (
    <Tag
      className={classNames(
        'flex min-w-0 flex-col rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px]',
        gapClassName,
        className
      )}
      {...rest}
    >
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[4px]">
          <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
            {title}
          </h2>
          {aside}
        </div>
      ) : null}
      {children}
    </Tag>
  );
};

export default ProfileCard;
