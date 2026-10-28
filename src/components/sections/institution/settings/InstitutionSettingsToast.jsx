import SavedToast from '../../../ui/SavedToast.jsx';

/*
 * InstitutionSettingsToast — the settings status toast of the institution screens: the shared `ui/SavedToast` (white card, green check, optional Undo).
 * Props: toast { title, body?, undo? } | null, onUndo, onDismiss, ms (default 8000). The copy comes from institutionSettingsData TOASTS.
 */
const InstitutionSettingsToast = (props) => <SavedToast {...props} />;

export default InstitutionSettingsToast;
