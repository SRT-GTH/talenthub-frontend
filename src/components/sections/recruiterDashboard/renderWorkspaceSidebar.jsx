import WorkspaceSidebar from './WorkspaceSidebar.jsx';

/*
 * renderWorkspaceSidebar — `DashboardShell renderSidebar`: the recruiter workspace rail at lg+, the standard collapsed rail once the user collapses it.
 * Shared by every recruiter page drawn with it (dashboard, job templates / postings / screening).
 */
export const renderWorkspaceSidebar = ({ collapsed, onToggle }) =>
  collapsed ? null : <WorkspaceSidebar onToggle={onToggle} />;
