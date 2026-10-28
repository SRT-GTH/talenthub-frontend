import TextInput from '../../ui/form/TextInput.jsx';
import { classNames } from '../../../utils/classNames.js';
import alertIcon from '../../../assets/parent/dialog-alert.svg';

/*
 * ParentTextField — the labelled text field of the parent dialogs (Figma "Input · What’s wrong?" 10034:5976 and "Input · Why are you unlinking?"): the design-system `ui/form/TextInput` (the GTHInput: 51px, #ccc
 * border, 2.5px shelf, its own focus look and flat phone look) with the three overrides the parent frames draw — the green diamond helper icon (`dialog-alert`), the helper line in grey #575755 even in
 * the error state (the message stays an alert for assistive tech), and the typed value in ink #1c2a21 (error: red #c0392b, weight 400, as PW-04c draws it). The error border (#ebc2bd 1.5px) and dark-red
 * shelf come from TextInput's own error state.
 * Height: 51 as drawn (12.5px vertical padding through TextInput's optional `boxClassName`).
 * Props: everything `TextInput` takes (label, required, helperText, error, value, onChange, ref, id, data-autofocus…), plus inputClassName (appended).
 * Focus: the design-system look (cream fill, pale-green border, dark-green shelf), not a custom ring.
 */
const ParentTextField = ({ error, inputClassName, boxClassName, ...rest }) => (
  <TextInput
    {...rest}
    // Figma draws these fields 51 high; the design-system box is 52 (13px padding each side), so 12.5.
    boxClassName={classNames('!py-[12.5px]', boxClassName)}
    error={error}
    helperIcon={<img src={alertIcon} alt="" className="size-full" />}
    helperTextClassName="text-[#575755]"
    inputClassName={classNames(
      error ? '!font-normal !text-[#c0392b]' : '!text-[#1c2a21]',
      inputClassName
    )}
  />
);

export default ParentTextField;
