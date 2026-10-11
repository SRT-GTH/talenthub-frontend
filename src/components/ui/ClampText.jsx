import { createElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import { useIsDesktop } from '../../hooks/useMediaQuery.js';

/*
 * ClampText — long copy that collapses to N lines with a "Read more" toggle
 * on phones/tablets, and renders in full from `lg` up (desktop is unchanged).
 * The toggle only appears when the text is genuinely truncated, so short
 * strings never grow a dangling button.
 *
 *   <ClampText lines={3}>{match.explanation}</ClampText>
 *
 * Props: lines (default 3) · as (default 'p') · className (text styles) ·
 * moreLabel / lessLabel · buttonClassName.
 */
const ClampText = ({
  children,
  lines = 3,
  as: Tag = 'p',
  className,
  moreLabel = 'Read more',
  lessLabel = 'Show less',
  buttonClassName,
}) => {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const clamped = !isDesktop && !expanded;

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el || isDesktop) return;
    if (!expanded) setTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [expanded, isDesktop]);

  useLayoutEffect(() => {
    measure();
  }, [measure, children, lines]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <>
      {createElement(
        Tag,
        {
          ref,
          className,
          style: clamped
            ? {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lines,
                overflow: 'hidden',
              }
            : undefined,
        },
        children
      )}
      {!isDesktop && (truncated || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className={classNames(
            'mt-1 inline-flex min-h-6 items-center font-sans text-[13px] font-medium text-brand-green underline-offset-2 hover:underline',
            buttonClassName
          )}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </>
  );
};

export default ClampText;
