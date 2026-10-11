import { useLayoutEffect, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import { useIsDesktop } from '../../hooks/useMediaQuery.js';

/*
 * TagRow — pills / skills / chips on ONE line with a "+N" circle for the rest
 * (phones and tablets). Tapping the circle expands to the full wrapped list;
 * "−" collapses again. From `lg` up the tags simply wrap (desktop unchanged).
 *
 *   <TagRow items={skills} renderItem={(skill) => <Tag key={skill}>{skill}</Tag>} />
 *
 * `renderItem(item, index)` must return ONE element and give it a stable key;
 * tags should not shrink (`shrink-0 whitespace-nowrap`) — TagRow adds that
 * via a wrapper so callers don't have to.
 */
const MORE_SIZE = 32;

const TagRow = ({ items, renderItem, gap = 8, className, moreClassName }) => {
  const isDesktop = useIsDesktop();
  const rowRef = useRef(null);
  const measureRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(items.length);

  useLayoutEffect(() => {
    if (isDesktop || expanded) return undefined;
    const compute = () => {
      const row = rowRef.current;
      const measurer = measureRef.current;
      if (!row || !measurer) return;
      const available = row.clientWidth;
      const widths = Array.from(measurer.children).map((child) => child.offsetWidth);
      const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, widths.length - 1);
      if (total <= available) {
        setVisibleCount(widths.length);
        return;
      }
      let used = 0;
      let count = 0;
      for (const w of widths) {
        const next = used + w + (count > 0 ? gap : 0);
        if (next + gap + MORE_SIZE > available) break;
        used = next;
        count += 1;
      }
      setVisibleCount(Math.max(1, count));
    };
    compute();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(compute);
    observer.observe(rowRef.current);
    if (document.fonts?.ready) document.fonts.ready.then(compute);
    return () => observer.disconnect();
  }, [isDesktop, expanded, items, gap]);

  if (isDesktop) {
    return (
      <div className={classNames('flex flex-wrap', className)} style={{ gap }}>
        {items.map(renderItem)}
      </div>
    );
  }

  const hidden = items.length - visibleCount;
  const showAll = expanded || hidden <= 0;

  return (
    <div className="relative">
      {/* invisible measurer: every tag laid out in one nowrap row */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex h-0 flex-nowrap overflow-hidden whitespace-nowrap"
        style={{ gap }}
      >
        {items.map((item, index) => (
          <span key={index} className="shrink-0">
            {renderItem(item, index)}
          </span>
        ))}
      </div>
      <div
        ref={rowRef}
        className={classNames(
          'flex items-center',
          expanded ? 'flex-wrap' : 'flex-nowrap overflow-hidden',
          className
        )}
        style={{ gap }}
      >
        {(showAll ? items : items.slice(0, visibleCount)).map((item, index) => (
          <span key={index} className="shrink-0 whitespace-nowrap">
            {renderItem(item, index)}
          </span>
        ))}
        {(hidden > 0 || expanded) && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? 'Show fewer' : `Show ${hidden} more`}
            onClick={() => setExpanded((value) => !value)}
            className={classNames(
              'inline-flex shrink-0 items-center justify-center rounded-full border border-[#e8e8e4] bg-[#f8f8f4] font-sans text-[12px] font-medium text-[#575755]',
              moreClassName
            )}
            style={{ width: MORE_SIZE, height: MORE_SIZE }}
          >
            {expanded ? '−' : `+${hidden}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default TagRow;
