import { classNames } from '../../utils/classNames.js';

/*
 * ChatBubble — rounded speech bubble.
 * Source: Figma frame 3384:82014 (inside the Career-Buddy promo card).
 *
 * A simple white pill-bubble used to render an inline message from a
 * character (the AI Career Buddy). Defaults to the design tokens from
 * Figma: white fill, rounded-2xl, soft shadow, font-normal-75.
 *
 * The Figma frame includes a small tail / tip; we approximate it with a
 * single rounded triangle pointing right. Pass `tail="none"` to suppress.
 */

const TAIL_POSITION = {
  'bottom-right': 'right-[-6px] bottom-2',
  'bottom-left': 'left-[-6px] bottom-2',
  none: '',
};

const ChatBubble = ({ children, tail = 'bottom-right', className, bubbleClassName, ...rest }) => (
  <div className={classNames('relative inline-block', className)} {...rest}>
    <div
      className={classNames(
        'relative rounded-2xl bg-white px-3 py-2 shadow-bottom-200',
        'font-sans text-[12px] leading-[18px] tracking-[0.2px] text-content-primary',
        bubbleClassName
      )}
    >
      {children}
    </div>
    {tail !== 'none' && (
      <span
        aria-hidden="true"
        className={classNames(
          'absolute size-3 bg-white rotate-45 rounded-[2px]',
          TAIL_POSITION[tail]
        )}
      />
    )}
  </div>
);

export default ChatBubble;
