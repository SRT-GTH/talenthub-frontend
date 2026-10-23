import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { DialogShell } from '../CommunityDialogParts.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { INVITE_COPY } from './createCommunityData.js';
import { Callout, DialogHead, FooterBar, Pill, PersonRow, Section } from './CreateDialogParts.jsx';
import { CcStarIcon } from './CreateCommunityIcons.jsx';
import { FOCUS_RING, INPUT_BASE, INPUT_OK, LABEL_TEXT } from './createCommunityStyles.js';

const log = debug('InviteDialog');

/*
 * InviteDialog — "Invite people to #Name" (Figma CC-09). Props: community, onClose().
 * Copy link copies the link (the button says "Copied" for 2s); each "Invite" marks the person "Invited" (frontend-only: no invites API yet).
 * ⚠️ ASSUMPTION: the "People you may know" list is the three drawn people, Ransford already invited.
 */
const InviteDialog = ({ community, onClose }) => {
  const titleId = useId();
  const linkId = useId();
  const copy = INVITE_COPY;
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState(() =>
    Object.fromEntries(copy.suggestions.map((p) => [p.id, p.invited]))
  );

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = () => {
    log('copy link', community.inviteLink);
    navigator.clipboard?.writeText(community.inviteLink).catch(() => {});
    setCopied(true);
  };

  return (
    <DialogShell width={680} gap={20} onClose={onClose} labelId={titleId}>
      <DialogHead id={titleId} onClose={onClose}>
        {fillCopy(copy.title, { name: community.name })}
      </DialogHead>
      <div className="flex flex-wrap items-end gap-[12px]">
        <div className="flex min-w-[200px] flex-1 flex-col gap-[8px]">
          <label htmlFor={linkId} className={LABEL_TEXT}>
            {copy.link}
          </label>
          <input
            id={linkId}
            readOnly
            value={community.inviteLink}
            className={classNames(INPUT_BASE, INPUT_OK, 'font-medium', FOCUS_RING)}
          />
        </div>
        <Button variant="tertiary" size="lg" onClick={copyLink} aria-live="polite">
          {copied ? copy.copied : copy.copy}
        </Button>
      </div>
      <Section title={copy.people} className="gap-[8px]">
        <div className="flex flex-col">
          {copy.suggestions.map((person) => (
            <PersonRow
              key={person.id}
              avatar={person.avatar}
              name={person.name}
              detail={person.detail}
              trailing={
                invited[person.id] ? (
                  <Pill tone="green">{copy.invited}</Pill>
                ) : (
                  <Button
                    variant="tertiary"
                    size="lg"
                    aria-label={`${copy.invite} ${person.name}`}
                    onClick={() => {
                      log('invite', person.id);
                      setInvited((current) => ({ ...current, [person.id]: true }));
                    }}
                  >
                    {copy.invite}
                  </Button>
                )
              }
            />
          ))}
        </div>
      </Section>
      <Callout title={copy.calloutTitle}>{copy.calloutBody}</Callout>
      <FooterBar note={copy.note} noteIcon={CcStarIcon}>
        <Button variant="primary" size="sm" onClick={onClose}>
          {copy.done}
        </Button>
      </FooterBar>
    </DialogShell>
  );
};

export default InviteDialog;
