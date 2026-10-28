import Button from '../../ui/Button.jsx';

/*
 * ParentButton — the 3D button of the parent screens (Figma "Frame" button instances: "Find my ward", "I have a link code"). Now a thin wrapper over the shared `ui/Button`
 * (primary = green face + gradient label, secondary = `tertiary`: white face, ink border, 4px shelf), kept so the parent builders keep one import and API.
 * Props: variant ('primary' | 'secondary'), to (renders a <Link>), className, ...button props.
 */
const VARIANT = { primary: 'primary', secondary: 'tertiary' };

// Figma draws these buttons 56 high (16 + 24 + 16) with the 1 / 2px border INSIDE the box; `ui/Button` adds the border on top (59 high, 4px wider), so the padding gives that back here.
const FIGMA_BOX = '!px-[32px] !pt-[15px] !pb-[14px]';
// Figma's secondary label is the ink #1c2a21; `ui/Button` tertiary uses plain black.
const SECONDARY_INK = '!text-[#1c2a21]';

const ParentButton = ({ variant = 'primary', className, ...rest }) => (
  <Button
    variant={VARIANT[variant] ?? 'primary'}
    size="lg"
    className={[FIGMA_BOX, variant === 'secondary' ? SECONDARY_INK : '', className]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  />
);

export default ParentButton;
