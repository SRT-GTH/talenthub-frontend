import { useRef } from 'react';
import Button from '../../ui/Button.jsx';
import Chip from '../../ui/Chip.jsx';
import { SaveListMenu, ProfileOverflowMenu } from './CandidateActionMenus.jsx';
import useDismissOnOutside from './useDismissOnOutside.js';
import {
  CalendarIcon,
  CheckIcon,
  InboxIcon,
  MapPinIcon,
  MoreDotsIcon,
  VerifiedBadgeIcon,
} from './talentCandidateProfileIcons.jsx';
import { INVITE_SENT, PROFILE_COPY, SAVE_MENU } from './talentCandidateProfileData.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('CandidateProfileHeader');

/*
 * CandidateProfileHeader — the profile header card (Figma "Profile header" 10102:41559, TS-19 10102:45140): the optional "Applied to …" banner, the photo, name + "Verified skills", headline, meta line,
 * the four chips and the action row.
 *   sourced candidate (TS-11 / 13 / 15): [Invite to apply] [Message] [Save] [⋯]  +  "18 of 50 invites left this month". Invited: the primary reads "Invited · <job>" at 60 % opacity; saved: "Save" reads "Saved".
 *   applicant (TS-19):                   [View in Pipeline] [Message] [Move to stage] [⋯]  +  "Applied with GTH profile · no invite needed".
 * The action row is 100px high as drawn (the buttons are centred in it); below `sm` it collapses to its content.
 * Props: candidate, photoSrc, invited (bool), invitedRole, invitesLeft, savedListId, menu ('save' | 'more' | ''), onInvite, onMessage, onToggleMenu(menuId), onCloseMenu, onSelectList, onNewList,
 *        onOverflowSelect(itemId), onViewPipeline, onMoveToStage, onOpenApplication.
 */
const BUTTON_ROW = 'flex shrink-0 items-center gap-[10px] max-sm:flex-wrap';
const OVERFLOW_BUTTON =
  'flex size-[48px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white p-0 text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-lg:size-[44px]';

const CHIP_TONES = { success: 'success', mint: 'mint', neutral: 'neutral' };
const CHIP_ICONS = { check: CheckIcon, calendar: CalendarIcon, 'map-pin': MapPinIcon };

const CandidateProfileHeader = ({
  candidate,
  photoSrc,
  invited,
  invitedRole,
  invitesLeft,
  savedListId,
  menu,
  onInvite,
  onMessage,
  onToggleMenu,
  onCloseMenu,
  onSelectList,
  onNewList,
  onOverflowSelect,
  onViewPipeline,
  onMoveToStage,
  onOpenApplication,
}) => {
  const saveAnchor = useRef(null);
  const moreAnchor = useRef(null);
  const isApplicant = candidate.kind === 'applicant';
  useDismissOnOutside(saveAnchor, menu === 'save', onCloseMenu);
  useDismissOnOutside(moreAnchor, menu === 'more', onCloseMenu);
  log('render', { candidate: candidate.id, kind: candidate.kind, invited, savedListId, menu });

  return (
    <section
      aria-label="Profile header"
      className="flex min-w-0 flex-col gap-[16px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px]"
    >
      {candidate.applied ? (
        <div className="flex flex-wrap items-start gap-x-[12px] gap-y-[8px] rounded-[10px] bg-[#ebf1ec]/50 p-[16px]">
          <InboxIcon className="size-[20px] shrink-0 text-[#2a5730]" />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
              {candidate.applied.title}
            </p>
            <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {candidate.applied.body}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenApplication}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {candidate.applied.action}
          </button>
        </div>
      ) : null}

      <div className="flex items-start gap-[20px] max-sm:gap-[12px]">
        <img
          src={photoSrc}
          alt={candidate.name}
          className="size-[96px] shrink-0 rounded-full object-cover max-sm:size-[64px]"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
            <h1 className="m-0 font-heading text-[clamp(26px,1.5rem+0.6vw,34px)] leading-[1.2] font-semibold tracking-[-0.02em] text-[#111]">
              {candidate.name}
            </h1>
            {candidate.verifiedSkills ? (
              <Chip tone="mint">
                <VerifiedBadgeIcon className="size-[12px] shrink-0" />
                {PROFILE_COPY.verifiedSkills}
              </Chip>
            ) : null}
          </div>
          <p className="m-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
            {candidate.headline}
          </p>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {candidate.meta}
          </p>
          <div className="flex flex-wrap items-center gap-[8px]">
            {candidate.chips.map((chip) => {
              const Icon = CHIP_ICONS[chip.icon];
              return (
                <Chip key={chip.id} tone={CHIP_TONES[chip.tone]}>
                  {Icon ? <Icon className="size-[12px] shrink-0" /> : null}
                  {chip.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex min-h-[100px] flex-wrap items-center gap-x-[10px] gap-y-[12px] max-sm:min-h-0">
        <div className={BUTTON_ROW}>
          {isApplicant ? (
            <>
              <Button variant="primary" size="sm" onClick={onViewPipeline}>
                View in Pipeline
              </Button>
              <Button variant="tertiary" onClick={onMessage}>
                Message
              </Button>
              <Button variant="tertiary" onClick={onMoveToStage}>
                Move to stage
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={onInvite}
                aria-disabled={invited || undefined}
                className={classNames(invited && 'pointer-events-none opacity-60')}
              >
                {invited ? INVITE_SENT.buttonLabel(invitedRole) : 'Invite to apply'}
              </Button>
              <Button variant="tertiary" onClick={onMessage}>
                Message
              </Button>
              <div ref={saveAnchor} className="relative">
                <Button
                  variant="tertiary"
                  aria-haspopup="menu"
                  aria-expanded={menu === 'save'}
                  onClick={() => onToggleMenu('save')}
                >
                  {savedListId ? SAVE_MENU.saved : SAVE_MENU.save}
                </Button>
                {menu === 'save' ? (
                  <SaveListMenu
                    selectedListId={savedListId}
                    onSelect={onSelectList}
                    onNewList={onNewList}
                  />
                ) : null}
              </div>
            </>
          )}
          <div ref={moreAnchor} className="relative">
            <button
              type="button"
              aria-label="More actions"
              aria-haspopup={isApplicant ? undefined : 'menu'}
              aria-expanded={isApplicant ? undefined : menu === 'more'}
              onClick={() => onToggleMenu('more')}
              className={OVERFLOW_BUTTON}
            >
              <MoreDotsIcon className="size-[18px]" />
            </button>
            {menu === 'more' && !isApplicant ? (
              <ProfileOverflowMenu onSelect={onOverflowSelect} />
            ) : null}
          </div>
        </div>
        <p className="m-0 ml-auto text-right font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755] max-sm:ml-0 max-sm:text-left">
          {isApplicant ? candidate.applied.note : INVITE_SENT.invitesLeft(invitesLeft)}
        </p>
      </div>
    </section>
  );
};

export default CandidateProfileHeader;
