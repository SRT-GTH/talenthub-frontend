import { classNames } from '../../../utils/classNames.js';
import { STAGES } from './recruiterInboxData.js';
import { ICONS } from './recruiterInboxIcons.js';

/*
 * Small pieces of the recruiter inbox (Figma "Recruiter - Messages" 10124:23474). Every glyph is Figma's own export, saved purpose-named in assets/recruiter-messages/.
 *   InboxGlyph   — <img> of one of those exports by key.
 *   Avatar       — 53px round photo or a #ebf1ec initials disc (14/600 #2a5730).
 *   StageChip    — the pill under a conversation row: icon + "Stage · Job" (26px, 12/500), colours per stage.
 *   EmptyTile    — the 64px #ebf1ec tile with a 32px glyph used by the empty states.
 */

export const InboxGlyph = ({ name, className }) => (
  <img src={ICONS[name]} alt="" aria-hidden="true" className={className} />
);

export const Avatar = ({ conversation, size = 53, className }) =>
  conversation.photo ? (
    <img
      src={conversation.photo}
      alt={conversation.name}
      style={{ width: size, height: size }}
      className={classNames('shrink-0 rounded-full object-cover', className)}
    />
  ) : (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={classNames(
        'flex shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#2a5730]',
        className
      )}
    >
      {conversation.initials}
    </span>
  );

const STAGE_ICON = { shortlisted: 'chip-check', interview: 'chip-calendar' };

export const StageChip = ({ stage, job }) => {
  const style = STAGES[stage];
  return (
    <span
      className={classNames(
        'inline-flex h-[26px] max-w-full items-center gap-[4px] self-start rounded-full px-[8px] font-sans text-[12px] leading-[20px] font-medium whitespace-nowrap',
        style.face
      )}
    >
      <InboxGlyph name={STAGE_ICON[stage] ?? style.icon} className="size-[12px] shrink-0" />
      <span className="truncate">
        {style.label} · {job}
      </span>
    </span>
  );
};

export const EmptyTile = ({ name }) => (
  <span className="flex size-[64px] items-center justify-center rounded-[16px] bg-[#ebf1ec]">
    <InboxGlyph name={name} className="size-[32px]" />
  </span>
);
