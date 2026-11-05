import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';

/*
 * LinkDialogShell — the white modal card of the link-a-ward dialogs. Now a thin wrapper over the shared `ui/DialogCard` (same props: label, onClose, width, padding, gap, focusCard,
 * className, children), kept so the link builders keep one import. <LinkDialogClose> is `DialogCloseButton` (tone 'green' | 'grey').
 */
const LinkDialogShell = (props) => <DialogCard {...props} />;

export const LinkDialogClose = (props) => <DialogCloseButton {...props} />;

export default LinkDialogShell;
