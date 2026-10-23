import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { DialogShell } from '../CommunityDialogParts.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { MENTOR_COPY } from './createCommunityData.js';
import { DialogHead, FooterBar, Pill, PersonRow, Section } from './CreateDialogParts.jsx';
import { CcShieldIcon } from './CreateCommunityIcons.jsx';
import { FOCUS_RING, INPUT_BASE, INPUT_OK, LABEL_TEXT } from './createCommunityStyles.js';

const log = debug('MentorDialog');

/*
 * MentorDialog — "Invite a verified mentor" (Figma CC-13). Props: community, onInvite(person), onClose().
 * Lists the verified mentors suggested for the community's topic; the search box filters by name, school or skill;
 * a mentor already invited (community.invitedMentor, or just now) shows the "Invite sent" pill.
 * ⚠️ ASSUMPTION: the three drawn people are the whole mock list (no mentor-search API yet).
 */
const MentorDialog = ({ community, onInvite, onClose }) => {
  const titleId = useId();
  const searchId = useId();
  const copy = MENTOR_COPY;
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(() =>
    community.invitedMentor ? [community.invitedMentor.name] : []
  );

  useEffect(() => {
    log('mount', community.invitedMentor?.name ?? 'none invited');
  }, [community.invitedMentor]);

  const needle = query.trim().toLowerCase();
  const people = copy.people.filter(
    (p) => !needle || `${p.name} ${p.detail}`.toLowerCase().includes(needle)
  );

  return (
    <DialogShell width={680} gap={18} onClose={onClose} labelId={titleId}>
      <DialogHead id={titleId} onClose={onClose}>
        {copy.title}
      </DialogHead>
      <div className="flex flex-col gap-[8px] rounded-[16px] bg-[#ebf1ec] p-[16px]">
        <h3 className="m-0 font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {copy.whoTitle}
        </h3>
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {copy.who.map((line) => (
            <li
              key={line}
              className="font-sans text-[13px] font-normal leading-[19px] text-[#1c2a21] max-lg:text-[14px]"
            >
              ·&nbsp; {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label htmlFor={searchId} className={LABEL_TEXT}>
          {copy.search}
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          placeholder={copy.placeholder}
          onChange={(e) => setQuery(e.target.value)}
          className={classNames(INPUT_BASE, INPUT_OK, FOCUS_RING)}
        />
      </div>
      <Section title={fillCopy(copy.suggested, { topic: community.topic ?? 'your topic' })}>
        <div className="flex flex-col">
          {people.map((person) => (
            <PersonRow
              key={person.id}
              avatar={person.avatar}
              name={person.name}
              detail={person.detail}
              trailing={
                sent.includes(person.name) ? (
                  <Pill tone="green">{copy.sent}</Pill>
                ) : (
                  <Button
                    variant="tertiary"
                    size="lg"
                    aria-label={`${copy.invite} ${person.name}`}
                    onClick={() => {
                      log('invite', person.id);
                      setSent((current) => [...current, person.name]);
                      onInvite(person);
                    }}
                  >
                    {copy.invite}
                  </Button>
                )
              }
            />
          ))}
          {people.length === 0 ? (
            <p className="m-0 py-[8px] font-sans text-[13px] leading-[19px] text-[#737373]">
              {copy.noMatch}
            </p>
          ) : null}
        </div>
      </Section>
      <FooterBar note={copy.note} noteIcon={CcShieldIcon}>
        <Button variant="primary" size="sm" onClick={onClose}>
          {copy.done}
        </Button>
      </FooterBar>
    </DialogShell>
  );
};

export default MentorDialog;
