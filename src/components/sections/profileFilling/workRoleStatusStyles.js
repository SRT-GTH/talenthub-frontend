// Status-tag colour lookup shared by WorkStage2Section.jsx's RoleCard and
// DeleteWorkModal.jsx's role-preview card — split into its own file (rather
// than exported from WorkStage2Section.jsx directly) because a component
// file may only export components under this project's react-refresh lint
// rule; plain data/constants need a separate module.
export const STATUS_TAG_STYLES = {
  Current: { bg: '#ebf1ec', border: '#c1d4c4', text: '#2a5730', dot: true },
  Internship: { bg: '#f8f8f4', border: '#e8e8e4', text: '#70706e', dot: false },
  'National Service': { bg: '#fffefc', border: '#eedeb8', text: '#967014', dot: false },
};
