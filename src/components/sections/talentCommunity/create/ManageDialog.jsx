import { useId } from 'react';
import Button from '../../../ui/Button.jsx';
import { DialogShell } from '../CommunityDialogParts.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { MANAGE_COPY } from './createCommunityData.js';
import { DialogHead, FilterChip, FooterBar, IconRow } from './CreateDialogParts.jsx';
import { CcSettingsIcon, CcShieldIcon, CcUsersIcon } from './CreateCommunityIcons.jsx';
import ManageModerators from './ManageModerators.jsx';
import ManageReportsTab from './ManageReportsTab.jsx';
import ManageRequestsTab from './ManageRequestsTab.jsx';
import ManageSettingsTab from './ManageSettingsTab.jsx';

const NOTES = {
  reports: { text: MANAGE_COPY.reportsNote, icon: CcShieldIcon },
  requests: { text: MANAGE_COPY.requestsNote, icon: CcUsersIcon },
  members: { text: MANAGE_COPY.reportsNote, icon: CcShieldIcon },
  moderators: { text: MANAGE_COPY.reportsNote, icon: CcShieldIcon },
  settings: { text: MANAGE_COPY.settingsNote, icon: CcSettingsIcon },
};

/*
 * ManageDialog — "Manage #Name" (Figma CC-10 Reports · CC-14 Requests · CC-15 Settings). Props: community, tab, onTab(id),
 * onClose(), actions { keepReport, removeReport, remind, approve, decline, approveAll, edit(step), transfer, archive }.
 * Tabs: Reports · n, Requests · n (only listed when there are requests, like CC-10), Members · n, Moderators · n, Settings.
 * ⚠️ ASSUMPTION: the Members and Moderators tabs are not drawn alone: Members lists the members, Moderators the moderator rows.
 */
const ManageDialog = ({ community, tab, onTab, onClose, actions }) => {
  const titleId = useId();
  const copy = MANAGE_COPY;
  const moderatorsCount = community.moderators.filter((m) => m.state !== 'invited').length;
  const tabs = [
    { id: 'reports', label: `${copy.tabs.reports} · ${community.reports.length}` },
    ...(community.joinRequests.length
      ? [{ id: 'requests', label: `${copy.tabs.requests} · ${community.joinRequests.length}` }]
      : []),
    { id: 'members', label: `${copy.tabs.members} · ${community.members.length}` },
    { id: 'moderators', label: `${copy.tabs.moderators} · ${moderatorsCount}` },
    { id: 'settings', label: copy.tabs.settings },
  ];
  // A tab that is not listed (e.g. requests with none left) falls back to the first one.
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0].id;
  const note = NOTES[active];

  let body;
  if (active === 'requests') {
    body = (
      <ManageRequestsTab
        requests={community.joinRequests}
        onApprove={actions.approve}
        onDecline={actions.decline}
        onApproveAll={actions.approveAll}
      />
    );
  } else if (active === 'members') {
    body = (
      <div className="flex flex-col gap-[8px]">
        {community.members.map((member) => (
          <IconRow
            key={member.id}
            icon={member.role === 'owner' ? CcShieldIcon : CcUsersIcon}
            title={member.role === 'owner' ? `${member.name} · Owner` : member.name}
            body={member.activity}
          />
        ))}
      </div>
    );
  } else if (active === 'moderators') {
    body = (
      <ManageModerators
        moderators={community.moderators}
        showTitle={false}
        onRemind={actions.remind}
      />
    );
  } else if (active === 'settings') {
    body = (
      <ManageSettingsTab
        community={community}
        onEdit={actions.edit}
        onTransfer={actions.transfer}
        onArchive={actions.archive}
      />
    );
  } else {
    body = (
      <ManageReportsTab
        community={community}
        onKeep={actions.keepReport}
        onRemove={actions.removeReport}
        onRemind={actions.remind}
      />
    );
  }

  return (
    <DialogShell width={680} gap={18} onClose={onClose} labelId={titleId}>
      <DialogHead id={titleId} onClose={onClose}>
        {fillCopy(copy.title, { name: community.name })}
      </DialogHead>
      <div role="tablist" aria-label="Manage" className="flex flex-wrap gap-[8px]">
        {tabs.map((t) => (
          <FilterChip
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            on={t.id === active}
            onClick={() => onTab(t.id)}
          >
            {t.label}
          </FilterChip>
        ))}
      </div>
      <div role="tabpanel" className="flex flex-col gap-[18px]">
        {body}
      </div>
      <FooterBar note={note.text} noteIcon={note.icon}>
        <Button variant="tertiary" size="lg" onClick={onClose}>
          {copy.close}
        </Button>
      </FooterBar>
    </DialogShell>
  );
};

export default ManageDialog;
