import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { DialogShell } from '../CommunityDialogParts.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { ARCHIVE_COPY } from './createCommunityData.js';
import { CheckRow, DialogHead, FooterBar, IconRow } from './CreateDialogParts.jsx';
import {
  CcCalendarIcon,
  CcClockIcon,
  CcEyeOffIcon,
  CcLockIcon,
  CcMailIcon,
  CcUserIcon,
} from './CreateCommunityIcons.jsx';

const log = debug('ArchiveDialog');
const ICONS = {
  eyeOff: CcEyeOffIcon,
  lock: CcLockIcon,
  calendar: CcCalendarIcon,
  mail: CcMailIcon,
  clock: CcClockIcon,
};

/*
 * ArchiveDialog — "Archive #Name?" (Figma CC-17). Props: community, onArchive(), onClose().
 * Five consequences, an unticked "I understand …" box that enables "Archive community", and the "Thinking of leaving?" note.
 */
const ArchiveDialog = ({ community, onArchive, onClose }) => {
  const titleId = useId();
  const checkId = useId();
  const copy = ARCHIVE_COPY;
  const [confirmed, setConfirmed] = useState(false);
  return (
    <DialogShell width={680} gap={18} onClose={onClose} labelId={titleId}>
      <DialogHead id={titleId} onClose={onClose}>
        {fillCopy(copy.title, { name: community.name })}
      </DialogHead>
      <div className="flex flex-col gap-[8px]">
        {copy.points.map((point) => (
          <IconRow
            key={point.title}
            icon={ICONS[point.icon]}
            title={point.title}
            body={point.body ? fillCopy(point.body, { name: community.name }) : null}
          />
        ))}
      </div>
      <CheckRow id={checkId} checked={confirmed} onChange={setConfirmed}>
        {copy.confirm}
      </CheckRow>
      <FooterBar note={copy.note} noteIcon={CcUserIcon}>
        <Button variant="tertiary" size="lg" onClick={onClose}>
          {copy.cancel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!confirmed}
          onClick={() => {
            log('archive', community.id);
            onArchive();
          }}
        >
          {copy.archive}
        </Button>
      </FooterBar>
    </DialogShell>
  );
};

export default ArchiveDialog;
