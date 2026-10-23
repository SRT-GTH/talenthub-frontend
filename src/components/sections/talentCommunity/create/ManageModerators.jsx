import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { MANAGE_COPY } from './createCommunityData.js';
import { IconRow, Section } from './CreateDialogParts.jsx';
import { CcCheckCircleIcon, CcHourglassIcon, CcStarIcon } from './CreateCommunityIcons.jsx';

const ICONS = { owner: CcStarIcon, active: CcCheckCircleIcon, invited: CcHourglassIcon };

/*
 * ManageModerators — the "Moderators" list of the Manage dialog (Figma CC-10): owner (star), verified co-moderator (check),
 * invited person (hourglass + "Remind"). Props: moderators, showTitle (false on the Moderators tab, which has its own chip),
 * onRemind(moderator).
 */
const ManageModerators = ({ moderators, showTitle = true, onRemind }) => {
  const [reminded, setReminded] = useState([]);
  const rows = (
    <div className="flex flex-col gap-[8px]">
      {moderators.map((mod) => {
        const label = mod.title ? `${mod.name} · ${mod.title}` : mod.name;
        return (
          <IconRow
            key={mod.id}
            icon={ICONS[mod.state]}
            title={mod.state === 'owner' ? `${mod.name} · Owner` : label}
            body={mod.state === 'owner' ? 'You' : mod.note}
            trailing={
              mod.state === 'invited' ? (
                <Button
                  variant="tertiary"
                  size="lg"
                  disabled={reminded.includes(mod.id)}
                  aria-label={`${MANAGE_COPY.remind} ${mod.name}`}
                  onClick={() => {
                    setReminded((current) => [...current, mod.id]);
                    onRemind?.(mod);
                  }}
                >
                  {reminded.includes(mod.id) ? MANAGE_COPY.reminded : MANAGE_COPY.remind}
                </Button>
              ) : null
            }
          />
        );
      })}
    </div>
  );
  return showTitle ? <Section title={MANAGE_COPY.moderators}>{rows}</Section> : rows;
};

export default ManageModerators;
