import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import uploadThumb from '../../../assets/talent-community/posts/create-upload-thumb.png';
import {
  CommunityBellGlyph,
  CommunityBulbGlyph,
  CommunityCheckGlyph,
  CommunityChevronDownGlyph,
  CommunityCloseGlyph,
  CommunityHelpGlyph,
  CommunityInfoCircleGlyph,
  CommunityLinkGlyph,
  CommunityLockGlyph,
  CommunityLogOutGlyph,
  CommunityShieldGlyph,
  CommunityStarGlyph,
  CommunityUploadGlyph,
} from './CommunityDialogIcons.jsx';
import {
  CloseButton,
  DialogShell,
  DialogTitle,
  FieldLabel,
  TextArea,
} from './CommunityDialogParts.jsx';
import MilestoneShareModal from './MilestoneShareModal.jsx';
import PurposePicker from './PurposePicker.jsx';
import { FOCUS_RING, HEADING, fillCopy } from './communityDialogUtils.js';
import { CREATE_POST, LEAVE_COMMUNITY, REPORT_POST } from './communityData.js';

const log = debug('CommunityDialogs');

const TYPE_ICONS = {
  info: CommunityInfoCircleGlyph,
  star: CommunityStarGlyph,
  help: CommunityHelpGlyph,
  link: CommunityLinkGlyph,
};

/* Footer: note on the left, buttons on the right (Figma `footer`, gap 10). Wraps on phones. */
const Footer = ({ note, children }) => (
  <div className="flex flex-wrap items-center gap-[10px]">
    <div className="flex min-w-[160px] flex-1 items-center gap-[6px] font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
      {note}
    </div>
    <div className="flex items-start gap-[10px]">{children}</div>
  </div>
);

/* C-08 · Create post — Playful 7628:6479 (modal 7628:6863) / Focused 8110:462216 (modal 8110:462600). */
/*
 * `live` (talent Community on the API): the form opens empty, photo upload and "Help me write it" are hidden (no backend
 * for either yet), `busy` disables Post while the request runs and `error` shows the failure above the footer.
 * Live posts need a purpose (US-5.2.2-01): the kind pills give way to the required "What's this post for?" dropdown,
 * limited to `purposes` (what the community accepts). `onSuggest(text)` resolves { purpose, confidence } | null a second
 * after the talent stops typing; a confident suggestion is offered with a one-tap Yes, never chosen for them.
 */
export const CreatePostDialog = ({
  onClose,
  onPost,
  communityName,
  live = false,
  busy = false,
  error = null,
  purposes = null,
  onSuggest = null,
}) => {
  const titleId = useId();
  const fieldId = useId();
  const fileRef = useRef(null);
  const copy = CREATE_POST;
  const [type, setType] = useState(copy.seed.type);
  const [text, setText] = useState(live ? '' : copy.seed.text);
  const [tags, setTags] = useState(live ? [] : copy.seed.tags);
  const [link, setLink] = useState(live ? '' : copy.seed.link);
  const [draft, setDraft] = useState(null); // { kind: 'tag' | 'link', value }
  const [files, setFiles] = useState(live ? 0 : 1);
  const [purpose, setPurpose] = useState('');
  const [suggestion, setSuggestion] = useState(null);

  // Ask for a suggestion a second after typing stops (live only; short texts say too little).
  // The suggestion is only offered ("does that fit?" + Yes); the talent always makes the choice.
  useEffect(() => {
    if (!live || !onSuggest) return undefined;
    if (text.trim().length < 15) {
      setSuggestion(null);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await onSuggest(text.trim()).catch(() => null);
      if (!cancelled) setSuggestion(result);
    }, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [live, onSuggest, text]);

  const choosePurpose = (value) => setPurpose(value);

  const commitDraft = () => {
    const value = draft?.value.trim();
    if (value) {
      if (draft.kind === 'tag') setTags((t) => [...t, value.startsWith('#') ? value : `#${value}`]);
      else setLink(value);
    }
    setDraft(null);
  };

  const needsPurpose = live && !purpose;
  const submit = () => {
    if (!text.trim() || busy || needsPurpose) return;
    log('post', { type, purpose, tags: tags.length, link: Boolean(link), files });
    onPost?.({
      type,
      purpose: live ? purpose : undefined,
      suggestedPurpose: live ? suggestion?.purpose : undefined,
      suggestionConfidence: live ? suggestion?.confidence : undefined,
      text: text.trim(),
      tags,
      link,
    });
  };

  return (
    <DialogShell width={680} onClose={onClose} labelId={titleId}>
      <div className="flex items-start gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <DialogTitle id={titleId}>{copy.title}</DialogTitle>
          <div className="flex items-center gap-[6px] font-sans text-[13px] leading-[16px]">
            <span className="text-[#737373]">{copy.postingTo}</span>
            <span className="inline-flex min-w-0 items-center gap-[6px] font-semibold text-[#387440]">
              <span className="truncate">{communityName}</span>
              <CommunityChevronDownGlyph className="size-[14px] shrink-0" />
            </span>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      {live ? null : (
        <div role="radiogroup" aria-label="Post type" className="flex flex-wrap gap-[8px]">
          {copy.types.map((t) => {
            const Glyph = TYPE_ICONS[t.icon];
            const on = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setType(t.id)}
                className={classNames(
                  'inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-solid py-[8px] pl-[12px] pr-[14px] font-sans text-[13px] font-semibold leading-[16px]',
                  FOCUS_RING,
                  on
                    ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
                    : 'border-[#e6e6e6] bg-white text-[#595959]'
                )}
              >
                <Glyph className="size-[14px]" />
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-[8px]">
        <FieldLabel htmlFor={fieldId}>{copy.fieldLabel}</FieldLabel>
        <TextArea id={fieldId} value={text} onChange={setText} label={copy.fieldLabel} />
      </div>

      {live ? (
        <PurposePicker
          value={purpose}
          onChange={choosePurpose}
          allowed={purposes}
          suggestion={suggestion}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-[8px]">
        {live ? null : (
          <button
            type="button"
            onClick={() => log('help me write it')}
            className={classNames(
              'inline-flex h-[28px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#c8951a] bg-[#faf4e8] py-[6px] pl-[10px] pr-[12px] font-sans text-[12px] font-semibold leading-[14px] text-[#463409]',
              FOCUS_RING
            )}
          >
            <CommunityBulbGlyph className="size-[14px] text-[#1c2a21]" />
            {copy.assist}
          </button>
        )}
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => setTags((t) => t.filter((x) => x !== tag))}
            className={classNames(
              'inline-flex h-[26px] cursor-pointer items-center rounded-full border-0 bg-[#ebf1ec] px-[10px] font-sans text-[12px] font-medium leading-[14px] text-[#2d5d33] playful:h-[28px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
              FOCUS_RING
            )}
          >
            {tag}
          </button>
        ))}
        {draft?.kind === 'tag' ? (
          <input
            autoFocus
            aria-label="New tag"
            value={draft.value}
            onChange={(e) => setDraft({ kind: 'tag', value: e.target.value })}
            onBlur={commitDraft}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commitDraft())}
            className="h-[28px] w-[110px] rounded-full border border-solid border-[#ccc] px-[10px] font-sans text-[12px] outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setDraft({ kind: 'tag', value: '' })}
            className={classNames(
              'cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-semibold leading-[14px] text-[#387440]',
              FOCUS_RING
            )}
          >
            {copy.addTag}
          </button>
        )}
      </div>

      {live ? null : (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={classNames(
              'flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] border-[1.5px] border-dashed border-[#bfbfbf] bg-[#f8f8f4] p-[16px] text-left',
              FOCUS_RING
            )}
          >
            <span
              aria-hidden="true"
              className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] border border-solid border-[rgba(28,42,33,0.32)] bg-white text-[#1c2a21] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
            >
              <CommunityUploadGlyph className="size-[20px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {copy.upload.title}
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
                {copy.upload.sub}
              </span>
            </span>
            {files > 0 ? (
              <img
                src={uploadThumb}
                alt=""
                className="size-[56px] shrink-0 rounded-[10px] border-[1.5px] border-solid border-[#1c2a21] object-cover"
              />
            ) : null}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,video/mp4"
            multiple
            hidden
            onChange={(e) => setFiles(e.target.files?.length || files)}
          />
        </>
      )}

      <div className="flex flex-wrap items-center gap-[8px]">
        {link ? (
          <span className="inline-flex h-[32px] max-w-full items-center gap-[6px] rounded-[10px] border border-solid border-[#e6e6e6] bg-white py-[8px] pl-[10px] pr-[12px] font-sans text-[12px] font-medium leading-[14px] text-[#1c2a21]">
            <CommunityLinkGlyph className="size-[14px] shrink-0 text-[#387440]" />
            <span className="min-w-0 truncate">{link}</span>
            <button
              type="button"
              aria-label="Remove link"
              onClick={() => setLink('')}
              className={classNames(
                'flex size-[12px] shrink-0 cursor-pointer items-center justify-center overflow-visible border-0 bg-transparent p-0 text-[#737373]',
                FOCUS_RING
              )}
            >
              <CommunityCloseGlyph className="size-[16px] max-w-none shrink-0" />
            </button>
          </span>
        ) : null}
        {draft?.kind === 'link' ? (
          <input
            autoFocus
            aria-label="Link"
            value={draft.value}
            onChange={(e) => setDraft({ kind: 'link', value: e.target.value })}
            onBlur={commitDraft}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commitDraft())}
            className="h-[32px] w-[220px] max-w-full rounded-[10px] border border-solid border-[#ccc] px-[10px] font-sans text-[12px] outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setDraft({ kind: 'link', value: '' })}
            className={classNames(
              'cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440]',
              FOCUS_RING
            )}
          >
            {copy.addLink}
          </button>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          className="m-0 font-sans text-[13px] font-medium leading-[16px] text-[#c0392b]"
        >
          {error}
        </p>
      ) : null}
      <Footer
        note={
          <>
            <CommunityShieldGlyph className="size-[14px] shrink-0" />
            {live ? 'Off-topic posts are reviewed by a moderator' : copy.note}
          </>
        }
      >
        <Button variant="tertiary" size="sm" onClick={onClose}>
          {copy.cancel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={submit}
          disabled={!text.trim() || busy || needsPurpose}
        >
          {copy.post}
        </Button>
      </Footer>
    </DialogShell>
  );
};

/* C-10 · Report post — Playful 7628:6979 (modal 7628:7363) / Focused 8110:462663 (modal 8110:463047). */
/* `live`: opens with nothing picked; `author` is the reported post's author (first name); `busy` while submitting. */
export const ReportPostDialog = ({
  onClose,
  onSubmit,
  communityName,
  live = false,
  author,
  busy = false,
}) => {
  const titleId = useId();
  const fieldId = useId();
  const copy = REPORT_POST;
  const [reason, setReason] = useState(live ? null : copy.seed.reason);
  const [note, setNote] = useState(live ? '' : copy.seed.note);

  return (
    <DialogShell width={560} onClose={onClose} labelId={titleId}>
      <div className="flex items-start gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <DialogTitle id={titleId}>{copy.title}</DialogTitle>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373]">
            {fillCopy(copy.subtitle, { community: communityName })}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <div role="radiogroup" aria-label={copy.title} className="flex flex-col gap-[12px]">
        {copy.reasons.map((r) => {
          const on = reason === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={r.sub ? `${r.label}. ${r.sub}` : r.label}
              onClick={() => setReason(r.id)}
              className={classNames(
                'flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-solid px-[14px] py-[12px] text-left',
                FOCUS_RING,
                on
                  ? 'border-[#387440] bg-[#ebf1ec] playful:border-[1.5px]'
                  : 'border-[#e6e6e6] bg-white'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'size-[20px] shrink-0 rounded-full bg-white',
                  on
                    ? 'border border-solid border-[#387440] playful:border-[6px]'
                    : 'border-[1.5px] border-solid border-[#bfbfbf]'
                )}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                  {r.label}
                </span>
                <span
                  aria-hidden="true"
                  data-count={r.sub}
                  className="font-sans text-[12px] leading-[14px] text-[#737373] after:content-[attr(data-count)]"
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-[8px]">
        <FieldLabel htmlFor={fieldId}>{copy.fieldLabel}</FieldLabel>
        <TextArea id={fieldId} value={note} onChange={setNote} label={copy.fieldLabel} />
      </div>

      <Footer
        note={
          <>
            <CommunityLockGlyph className="size-[14px] shrink-0" />
            {fillCopy(copy.note, { author: author || copy.author })}
          </>
        }
      >
        <Button variant="tertiary" size="sm" onClick={onClose}>
          {copy.cancel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!reason || busy}
          onClick={() => {
            log('report', reason);
            onSubmit?.({ reason, note });
          }}
        >
          {copy.submit}
        </Button>
      </Footer>
    </DialogShell>
  );
};

/* C-17 · Leave confirm — Playful 7628:7443 (modal 7628:7827) / Focused 8110:463098 (modal 8110:463482). */
/* `onMute` (optional): "Mute" mutes instead of leaving and closes the dialog. `busy` disables "Leave community". */
export const LeaveCommunityDialog = ({ onClose, onLeave, onMute, communityName, busy = false }) => {
  const titleId = useId();
  const copy = LEAVE_COMMUNITY;
  return (
    <DialogShell width={520} onClose={onClose} labelId={titleId}>
      <span
        aria-hidden="true"
        className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] border-[1.5px] border-solid border-[#c0392b] bg-[#f9ebea] text-[#c0392b]"
      >
        <CommunityLogOutGlyph className="size-[24px]" />
      </span>
      <h2
        id={titleId}
        className={classNames(
          HEADING,
          'm-0 text-[clamp(20px,6vw,25px)] font-semibold leading-[30px] tracking-normal text-[#1c2a21]'
        )}
      >
        {fillCopy(copy.title, { community: communityName })}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
        {copy.rows.map((row) => (
          <li
            key={row}
            className="flex items-start gap-[8px] font-sans text-[14px] leading-[17px] text-[#595959]"
          >
            <CommunityCheckGlyph className="mt-[1.5px] size-[14px] shrink-0 text-[#387440]" />
            {row}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-[10px] rounded-[12px] bg-[#f8f8f4] px-[14px] py-[12px]">
        <CommunityBellGlyph className="size-[16px] shrink-0 text-[#387440]" />
        <span className="min-w-0 flex-1 font-sans text-[13px] font-medium leading-[16px] text-[#2d5d33]">
          {copy.alt}
        </span>
        <button
          type="button"
          onClick={() => {
            log('mute instead');
            onMute?.();
          }}
          className={classNames(
            'shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440]',
            FOCUS_RING
          )}
        >
          {copy.mute}
        </button>
      </div>
      <div className="flex flex-wrap items-start justify-end gap-[10px]">
        <Button variant="tertiary" size="sm" onClick={onClose}>
          {copy.stay}
        </Button>
        <Button
          variant="tertiary"
          size="sm"
          className="!text-[#c0392b]"
          disabled={busy}
          onClick={() => {
            log('leave confirmed');
            onLeave?.();
          }}
        >
          {copy.leave}
        </Button>
      </div>
    </DialogShell>
  );
};

/*
 * CommunityDialogs — mounted on every Community page. Props: `community` (useCommunityState()), `communityName`
 * (default "#Frontend Devs Ghana", the name the frames draw), `onLeft` (optional, after "Leave community" is confirmed). Renders the dialog `community.modal` asks for:
 * create | report | leave | milestone. Closing = `community.update({ modal: null })`.
 */
const CommunityDialogs = ({ community, communityName = '#Frontend Devs Ghana', onLeft }) => {
  const close = () => community.update({ modal: null });
  switch (community.modal) {
    case 'create':
      return (
        <CreatePostDialog
          communityName={communityName}
          onClose={close}
          onPost={() => community.update({ modal: null, pending: true })}
        />
      );
    case 'report':
      return <ReportPostDialog communityName={communityName} onClose={close} onSubmit={close} />;
    case 'leave':
      return (
        <LeaveCommunityDialog
          communityName={communityName}
          onClose={close}
          onLeave={() => {
            community.update({ modal: null, joined: null, welcome: null });
            onLeft?.();
          }}
        />
      );
    case 'milestone':
      return <MilestoneShareModal onClose={close} onShare={close} onDecline={close} />;
    default:
      return null;
  }
};

export default CommunityDialogs;
