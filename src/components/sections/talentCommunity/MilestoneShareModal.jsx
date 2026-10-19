import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import Button from '../../ui/Button.jsx';
import {
  CommunityChevronDownGlyph,
  CommunityGlobeGlyph,
  CommunityLockGlyph,
  CommunityMessageGlyph,
  CommunityTrophyGlyph,
  CommunityUsersGlyph,
} from './CommunityDialogIcons.jsx';
import {
  CloseButton,
  DialogShell,
  DialogTitle,
  FieldLabel,
  KofiFace,
  PostSticker,
  TextArea,
} from './CommunityDialogParts.jsx';
import { FOCUS_RING, fillCopy } from './communityDialogUtils.js';
import { MILESTONE_SHARE } from './communityData.js';

const log = debug('MilestoneShareModal');

const AUDIENCE_ICONS = {
  users: CommunityUsersGlyph,
  message: CommunityMessageGlyph,
  globe: CommunityGlobeGlyph,
};

/*
 * MilestoneShareModal — C-09 "Milestone unlocked!" (Figma Playful 7631:7835, modal 7631:8981 / Focused 8110:465607, modal
 * 8110:466222). Shown from the onboarding Career Buddy right after a stage is confirmed (the lead rewires the Career
 * Buddy import from sections/community/ShareMilestoneModal.jsx to this file) and by `/community?modal=milestone`.
 *
 * Props:
 *   isOpen       default true; false renders nothing
 *   onClose      X, Esc, scrim
 *   onShare      ({ audience, message }) -> Share button
 *   onDecline    "No thanks, keep it private" (falls back to onClose)
 *   stageLabel   what was finished, default "Personality Assessment" (⚠️ ASSUMPTION: other stages reuse the same sentence)
 *   authorName   preview name, default "Kofi Agyekum"
 */
const MilestoneShareModal = ({
  isOpen = true,
  onClose,
  onShare,
  onDecline,
  stageLabel = MILESTONE_SHARE.stage,
  authorName = MILESTONE_SHARE.previewName,
}) => {
  const titleId = useId();
  const fieldId = useId();
  const { uiStyle } = useUiStyle();
  const copy = MILESTONE_SHARE;
  const [message, setMessage] = useState(fillCopy(copy.message, { stage: stageLabel }));
  const [audience, setAudience] = useState('connections');

  if (!isOpen) return null;
  const audienceLabel = copy.audiences.find((a) => a.id === audience)?.label;
  const firstName = authorName.split(' ')[0];

  return (
    <DialogShell width={560} gap={16} onClose={onClose} labelId={titleId}>
      <div className="flex items-center justify-between gap-[12px]">
        <span
          aria-hidden="true"
          className="flex size-[64px] shrink-0 items-center justify-center rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#ffd86b] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:size-[69px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
        >
          <CommunityTrophyGlyph className="size-[34px] playful:size-[37px]" />
        </span>
        <CloseButton onClose={onClose} />
      </div>

      <div className="flex flex-wrap items-center gap-[10px]">
        <DialogTitle id={titleId} size={31} lineHeight={37}>
          {copy.title}
        </DialogTitle>
        <PostSticker tone="gold">
          {fillCopy(copy.sticker, { xp: uiStyle === 'playful' ? 'XP' : 'pts' })}
        </PostSticker>
      </div>

      <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">
        {fillCopy(copy.body, { stage: stageLabel })}
      </p>

      <div className="flex flex-col gap-[8px]">
        <FieldLabel htmlFor={fieldId}>{copy.fieldLabel}</FieldLabel>
        <TextArea id={fieldId} value={message} onChange={setMessage} label={copy.fieldLabel} />
      </div>

      <div className="flex flex-col gap-[8px]">
        <span className="font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
          {copy.shareWith}
        </span>
        <div role="radiogroup" aria-label={copy.shareWith} className="flex flex-wrap gap-[8px]">
          {copy.audiences.map((a) => {
            const Glyph = AUDIENCE_ICONS[a.icon];
            const on = audience === a.id;
            return (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setAudience(a.id)}
                className={classNames(
                  'inline-flex h-[36px] cursor-pointer items-center gap-[6px] rounded-full border border-solid py-[9px] pl-[12px] pr-[14px] font-sans text-[13px] font-semibold leading-[16px]',
                  FOCUS_RING,
                  on
                    ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
                    : 'border-[#e6e6e6] bg-white text-[#595959]'
                )}
              >
                <Glyph className="size-[14px]" />
                {a.label}
                {a.caret ? <CommunityChevronDownGlyph className="size-[12px]" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[10px] rounded-[16px] bg-[#f8f8f4] p-[16px]">
        <span className="font-sans text-[12px] font-semibold leading-[14px] text-[#737373]">
          {copy.preview}
        </span>
        <div className="flex flex-col gap-[10px] rounded-[14px] border border-solid border-[#e6e6e6] bg-white p-[14px]">
          <div className="flex items-center gap-[8px]">
            <KofiFace size={36} />
            <div className="flex min-w-0 flex-col gap-px">
              <div className="flex flex-wrap items-center gap-[6px]">
                <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                  {authorName}
                </span>
                <PostSticker tone="gold" small>
                  {copy.previewTag}
                </PostSticker>
              </div>
              <span className="font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
                {fillCopy(copy.previewMeta, { audience: audienceLabel })}
              </span>
            </div>
          </div>
          <p className="m-0 font-sans text-[13px] leading-[18px] text-[#1c2a21]">{message}</p>
          <div className="flex items-center gap-[10px] rounded-[12px] bg-[#387440] px-[12px] py-[10px]">
            <CommunityTrophyGlyph className="size-[20px] shrink-0" />
            <span className="font-sans text-[13px] font-semibold leading-[16px] text-white">
              {fillCopy(copy.banner, { stage: stageLabel }).replace('Kofi', firstName)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <button
          type="button"
          onClick={() => {
            log('declined');
            (onDecline ?? onClose)?.();
          }}
          className={classNames(
            'inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#595959]',
            FOCUS_RING
          )}
        >
          <CommunityLockGlyph className="size-[14px] shrink-0" />
          {copy.keepPrivate}
        </button>
        <Button
          variant="primary"
          size="sm"
          disabled={!message.trim()}
          onClick={() => {
            log('share', audience);
            onShare?.({ audience, message });
          }}
        >
          {copy.share}
        </Button>
      </div>
    </DialogShell>
  );
};

export default MilestoneShareModal;
