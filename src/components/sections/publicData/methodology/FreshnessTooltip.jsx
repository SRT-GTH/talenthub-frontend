import AnchoredPopover from './AnchoredPopover.jsx';
import TipCard from './TipCard.jsx';

/*
 * FreshnessTooltip — Figma 8.7.2a "Freshness tooltip" (8499:170): hover or focus the "Live" freshness pill to see the exact refresh times;
 * on touch a tap opens it and a tap outside closes it. REUSABLE: wrap any trigger (the FreshnessPill of the top bar, the stale / offline pills):
 *
 *   <FreshnessTooltip><FreshnessPill label="Updated 2 min ago · Live" /></FreshnessTooltip>
 *
 * Copy (verbatim, sample times): "Live data" / "Headline numbers last refreshed at 14:02 GMT (2 min ago). Charts refresh every hour; next at
 * 15:00." / "How fresh the data is →" (links to /data/methodology#fresh). Override title / body for the stale and offline states (not drawn).
 * Props: children (the trigger visual), title, body, linkLabel, linkTo, placement ('end' default | 'center'), open / defaultOpen / onOpenChange (controlled / initial,
 * the `?tip=freshness` frame), className. Behaviour: see AnchoredPopover (hover, focus, tap, Esc returns focus, outside press closes).
 * a11y: the trigger becomes a button named by its own text ("Updated 2 min ago · Live"); the card is a non-modal dialog named by `title`.
 */

const FreshnessTooltip = ({
  children,
  title = 'Live data',
  body = 'Headline numbers last refreshed at 14:02 GMT (2 min ago). Charts refresh every hour; next at 15:00.',
  linkLabel = 'How fresh the data is →',
  linkTo = '/data/methodology#fresh',
  placement = 'end',
  open,
  defaultOpen,
  onOpenChange,
  className,
}) => (
  <AnchoredPopover
    trigger={children}
    label={title}
    placement={placement}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    className={className}
  >
    <TipCard title={title} body={body} linkLabel={linkLabel} linkTo={linkTo} />
  </AnchoredPopover>
);

export default FreshnessTooltip;
