import ActionToast from '../../../../ui/ActionToast.jsx';

/*
 * ParentToast — the parent screens' confirmation toast (Figma PW-14b 10056:915, PW-15b 10078:26057). Now a thin wrapper over the shared `ui/ActionToast`: same props
 * (message, detail, actionLabel, onAction, onClose, duration), centred over the content column (sidebar 303px) from lg up, 97px under the top of the viewport.
 */
const ParentToast = (props) => <ActionToast {...props} className="lg:left-[calc(50%+151px)]" />;

export default ParentToast;
