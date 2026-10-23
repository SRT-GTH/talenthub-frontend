import Button from '../../../ui/Button.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { fillCopy } from '../communityDialogUtils.js';
import { MANAGE_COPY } from './createCommunityData.js';
import { IconRow } from './CreateDialogParts.jsx';
import {
  CcChevronRightIcon,
  CcEditIcon,
  CcFolderIcon,
  CcGlobeIcon,
  CcShieldIcon,
  CcUserIcon,
} from './CreateCommunityIcons.jsx';
import { FOCUS_RING } from './createCommunityStyles.js';

/* A settings row that opens something: the whole row is the button (chevron on the right). */
const LinkRow = ({ icon, title, body, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'w-full cursor-pointer rounded-[12px] border-0 bg-transparent p-0 text-left',
      FOCUS_RING
    )}
  >
    <IconRow
      icon={icon}
      title={title}
      body={body}
      trailing={<CcChevronRightIcon className="size-[20px] shrink-0 text-[#387440]" />}
    />
  </button>
);

/*
 * ManageSettingsTab — Figma CC-15: Edit details · Who can join · House rules (each opens the wizard prefilled at that step),
 * Transfer ownership + "Transfer", Archive community + "Archive". Props: community, onEdit(step), onTransfer(), onArchive().
 */
const ManageSettingsTab = ({ community, onEdit, onTransfer, onArchive }) => {
  const copy = MANAGE_COPY.settings;
  const join = MANAGE_COPY.joinLabels[community.joinPolicy];
  const age = community.ageRule === 'adults' ? '18 and over' : '14 and up';
  return (
    <div className="flex flex-col gap-[8px]">
      <LinkRow
        icon={CcEditIcon}
        title={copy.edit.title}
        body={copy.edit.body}
        onClick={() => onEdit('basics')}
      />
      <LinkRow
        icon={CcGlobeIcon}
        title={copy.who.title}
        body={fillCopy(copy.who.body, { join, age })}
        onClick={() => onEdit('who')}
      />
      <LinkRow
        icon={CcShieldIcon}
        title={copy.rules.title}
        body={fillCopy(copy.rules.body, { count: String(community.ownRules.length) })}
        onClick={() => onEdit('rules')}
      />
      <IconRow
        icon={CcUserIcon}
        title={copy.transfer.title}
        body={copy.transfer.body}
        trailing={
          <Button variant="tertiary" size="lg" onClick={onTransfer}>
            {copy.transfer.action}
          </Button>
        }
      />
      <IconRow
        icon={CcFolderIcon}
        tone="amber"
        title={copy.archive.title}
        body={copy.archive.body}
        trailing={
          <Button variant="tertiary" size="lg" onClick={onArchive}>
            {copy.archive.action}
          </Button>
        }
      />
    </div>
  );
};

export default ManageSettingsTab;
