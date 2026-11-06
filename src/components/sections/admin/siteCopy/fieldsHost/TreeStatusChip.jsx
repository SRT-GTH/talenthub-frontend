import FieldChip from '../fields/FieldChip.jsx';
import { CheckCircleIcon, EditIcon, UsersIcon } from '../fields/FieldsIcons.jsx';

/*
 * TreeStatusChip — the status chip of a page or section in the editor's "Pages" tree / head (Figma "GTH · Chip · Edited | Default | Draft changes (1) | Used on every page"):
 * edited = green check, default = grey, draft = amber pencil "Draft changes (1)", shared = blue people "Used on every page".
 * Props: status ('edited' | 'default' | 'draft' | 'shared'), count (the number in "Draft changes (1)", default 1), className.
 */
const TreeStatusChip = ({ status, count = 1, className }) => {
  if (status === 'edited') {
    return (
      <FieldChip
        tone="good"
        className={className}
        icon={<CheckCircleIcon className="size-[14px]" />}
      >
        Edited
      </FieldChip>
    );
  }
  if (status === 'draft') {
    return (
      <FieldChip tone="warn" className={className} icon={<EditIcon className="size-[14px]" />}>
        Draft changes ({count})
      </FieldChip>
    );
  }
  if (status === 'shared') {
    return (
      <FieldChip tone="info" className={className} icon={<UsersIcon className="size-[14px]" />}>
        Used on every page
      </FieldChip>
    );
  }
  return (
    <FieldChip tone="neutral" className={className}>
      Default
    </FieldChip>
  );
};

export default TreeStatusChip;
