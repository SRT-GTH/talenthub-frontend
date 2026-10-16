import { DiamondAlertIcon } from './profileIcons.jsx';

/* Shared diamond helper-row props for the recruiter profile fields (Figma 7374:1391 helper rows). */
export const helperProps = (hasError) => ({
  helperIcon: <DiamondAlertIcon className="size-4 shrink-0" />,
  helperIconClassName: hasError ? undefined : 'text-brand-green',
  helperTextClassName: hasError ? undefined : 'text-neutral-darker',
});
