import { classNames } from '../../../../utils/classNames.js';
import CardHeader from './CardHeader.jsx';

/*
 * PublicCard — the white dashboard card every Theme 8 section sits in (Figma frames "Regional distribution" 8487:346039,
 * "Career interests" 8487:346125, "Who they are" …): #fff, 1px #e7e7e7, radius 24, shadow 0 5px 17px rgba(0,0,0,.04).
 * Props
 *   title / hint / hintCompact   forwarded to CardHeader (omit `title` to draw a header-less card)
 *   as        'section' | 'div' | 'article'   default 'section' (a labelled landmark region when a title is given)
 *   children  node          the card body; the caller owns its padding (bodies are px24 pb24 on desktop, p16 on mobile)
 *   bodyClassName string    wrapper around children (default px-[16px] pb-[16px] md:px-[24px] md:pb-[24px])
 *   loading   boolean       sets aria-busy so the skeleton blocks inside are announced as loading
 *   headerExtra node        forwarded as CardHeader children
 *   className
 */

const PublicCard = ({
  title,
  hint,
  hintCompact,
  as = 'section',
  children,
  bodyClassName = 'px-[16px] pb-[16px] md:px-[24px] md:pb-[24px]',
  loading = false,
  headerExtra,
  id,
  className,
}) => {
  const Tag = as;
  const headingId = title && id ? `${id}-title` : undefined;
  return (
    <Tag
      id={id}
      aria-labelledby={headingId}
      aria-busy={loading || undefined}
      className={classNames(
        'min-w-0 rounded-[24px] border border-solid border-[#e7e7e7] bg-white font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      {title && (
        <CardHeader id={headingId} title={title} hint={hint} hintCompact={hintCompact}>
          {headerExtra}
        </CardHeader>
      )}
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
};

export default PublicCard;
