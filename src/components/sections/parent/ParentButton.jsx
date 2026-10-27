import Button from '../../ui/Button.jsx';

/*
 * ParentButton — the 3D button of the parent screens (Figma "Frame" button instances: "Find my ward", "I have a link code"). Now a thin wrapper over the shared `ui/Button`
 * (primary = green face + gradient label, secondary = `tertiary`: white face, ink border, 4px shelf), kept so the parent builders keep one import and API.
 * Props: variant ('primary' | 'secondary'), to (renders a <Link>), className, ...button props.
 */
const VARIANT = { primary: 'primary', secondary: 'tertiary' };

const ParentButton = ({ variant = 'primary', ...rest }) => (
  <Button variant={VARIANT[variant] ?? 'primary'} size="lg" {...rest} />
);

export default ParentButton;
