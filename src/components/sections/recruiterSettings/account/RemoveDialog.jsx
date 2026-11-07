import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import CenteredIconDialog from '../../../ui/CenteredIconDialog.jsx';
import { HintCheckbox } from '../../applicationPipeline/actions/ActionFormParts.jsx';
import { TrashGlyph } from '../../recruiterJobs/jobIcons.jsx';
import { REMOVE_DIALOG } from './accountData.js';

const log = debug('RemoveDialog');

const DIALOG_BUTTON = '!h-[48px] !py-0';

/*
 * RemoveDialog - "Remove Efua Arthur?" confirm (Figma SR-07 10161:79590) on `ui/CenteredIconDialog`: red trash tile, body, "Reassign Efua’s 2 open conversations to me" checkbox (on by default,
 * only when the teammate has open conversations), Cancel / red "Remove teammate".
 * Props: member, onClose, onConfirm({ reassign }).
 */
const RemoveDialog = ({ member, onClose, onConfirm }) => {
  const first = member.name.split(' ')[0];
  const conversations = member.openConversations ?? 0;
  const [reassign, setReassign] = useState(true);
  log('render', { id: member.id, conversations, reassign });

  return (
    <CenteredIconDialog
      icon={<TrashGlyph size={28} />}
      iconTileClassName="bg-[#f9ebea] text-[#c0392b]"
      title={REMOVE_DIALOG.title(member.name)}
      body={REMOVE_DIALOG.body(first)}
      onClose={onClose}
      footer={
        <>
          <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onClose}>
            {REMOVE_DIALOG.cancel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className={DIALOG_BUTTON}
            onClick={() => {
              log('confirm remove', { id: member.id, reassign: conversations > 0 && reassign });
              onConfirm({ reassign: conversations > 0 && reassign });
            }}
          >
            {REMOVE_DIALOG.confirm}
          </Button>
        </>
      }
    >
      {conversations > 0 ? (
        <HintCheckbox
          checked={reassign}
          onChange={setReassign}
          label={REMOVE_DIALOG.reassign(first, conversations)}
        />
      ) : null}
    </CenteredIconDialog>
  );
};

export default RemoveDialog;
