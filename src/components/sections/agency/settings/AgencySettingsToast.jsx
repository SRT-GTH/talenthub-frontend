import SavedToast from '../../../ui/SavedToast.jsx';

/*
 * AgencySettingsToast — the settings status toast of the agency screens: the shared `ui/SavedToast` (white card, green check, optional Undo).
 * Props: toast { title, body?, undo? } | null, onUndo, onDismiss, ms (default 8000). The copy comes from agencySettingsData TOASTS.
 */
const AgencySettingsToast = (props) => <SavedToast {...props} />;

export default AgencySettingsToast;
