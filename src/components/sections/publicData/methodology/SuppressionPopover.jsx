import SuppressedValue from '../ui/SuppressedValue.jsx';
import AnchoredPopover from './AnchoredPopover.jsx';
import TipCard from './TipCard.jsx';

/*
 * SuppressionPopover — Figma 8.7.2b "Suppression explanation popover" (8499:188): any "<5" value is a button; hover, focus or tap explains why
 * the number is hidden and links to the privacy rules. REUSABLE: drop it where a suppressed value is printed:
 *
 *   <SuppressionPopover />            // the grey "<5" chip (SuppressedValue) as the trigger
 *   <SuppressionPopover>…</SuppressionPopover>   // or any custom trigger visual
 *
 * Copy (verbatim): "Fewer than 5 talents" / "We hide exact numbers below 5 so nobody can be identified. The real number is between 1 and 4." /
 * "Privacy protections →" (links to /data/methodology#privacy). The real number is never passed in here: this component cannot print it.
 * Props: children (custom trigger), placement ('center' default | 'end'), open / defaultOpen / onOpenChange (controlled / initial, the `?tip=suppression` frame),
 * className. Behaviour: see AnchoredPopover.
 */

const SuppressionPopover = ({
  children,
  placement = 'center',
  open,
  defaultOpen,
  onOpenChange,
  className,
}) => (
  <AnchoredPopover
    trigger={children ?? <SuppressedValue />}
    triggerLabel="Fewer than 5, hidden. Why is this number hidden?"
    label="Fewer than 5 talents"
    placement={placement}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    className={className}
    triggerClassName="rounded-[6px]"
  >
    <TipCard
      title="Fewer than 5 talents"
      body="We hide exact numbers below 5 so nobody can be identified. The real number is between 1 and 4."
      linkLabel="Privacy protections →"
      linkTo="/data/methodology#privacy"
    />
  </AnchoredPopover>
);

export default SuppressionPopover;
