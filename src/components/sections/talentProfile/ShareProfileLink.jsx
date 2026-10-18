import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ShareCheckGreenIcon, ShareRedoIcon } from '../../shared/assets.jsx';
import { ShareDialog, ShareFieldHelper, ShareFieldLabel, ShareHead } from './ShareProfileParts.jsx';
import { FOCUS_RING, SHARE_INPUT_CLASS } from './ShareProfileUi.js';
import { saveSlug } from './ShareProfileFile.js';
import { PROFILE_HOST, SHARE_LINK, checkSlug } from './talentProfileShareData.js';

const log = debug('ShareProfileLink');

/*
 * SH-04 Customise link (taken) / SH-04b Customise link · available.
 * `?share=link` starts on the taken example ("kofi"), `?share=link-available` on "kofi-data". Typing runs the
 * mock availability check (checkSlug) and keeps the URL in step with the two frames.
 */
const ShareProfileLink = ({ profile }) => {
  const preset =
    profile.share === 'link-available' ? SHARE_LINK.availableExample : SHARE_LINK.takenExample;
  const [slug, setSlug] = useState(preset);
  const synced = useRef(profile.share);
  const status = checkSlug(slug);

  // A different frame was opened from outside (URL changed) — restart from that frame's example.
  useEffect(() => {
    if (profile.share !== synced.current) {
      synced.current = profile.share;
      setSlug(preset);
    }
  }, [profile.share, preset]);

  useEffect(() => {
    log('mount', { share: profile.share, slug, status });
  }, [profile.share, slug, status]);

  const back = useCallback(() => profile.update({ share: 'open' }), [profile]);
  const close = useCallback(() => profile.update({ share: null }), [profile]);

  const apply = (value) => {
    const next = value.replace(/\s+/g, '');
    const nextStatus = checkSlug(next);
    log('slug', { next, nextStatus });
    setSlug(next);
    const frame = nextStatus === 'available' ? 'link-available' : 'link';
    synced.current = frame;
    if (frame !== profile.share) profile.update({ share: frame });
  };

  const save = () => {
    if (status !== 'available') return;
    log('save slug', { slug });
    saveSlug(slug);
    profile.update({ share: 'open' });
  };

  const taken = status === 'taken';
  const available = status === 'available';

  return (
    <ShareDialog onClose={close} titleId="share-link-title" maxWidth={600}>
      <ShareHead
        titleId="share-link-title"
        title={SHARE_LINK.title}
        subtitle={SHARE_LINK.subtitle}
        onClose={close}
      />

      <div className="flex w-full items-center rounded-[12px] bg-[#f8f8f4] px-[16px] py-[12px] text-[16px] leading-[normal] whitespace-nowrap">
        <span className="font-medium text-[#595959]">{PROFILE_HOST}</span>
        <span
          className={classNames(
            'min-w-0 truncate font-semibold',
            taken ? 'text-[#c0392b]' : available ? 'text-brand-green' : 'text-[#1c2a21]'
          )}
        >
          {slug}
        </span>
      </div>

      <div className="flex w-full flex-col gap-[8px]">
        <ShareFieldLabel htmlFor="share-slug-input" required hint={SHARE_LINK.inputHint} fixedHint>
          {SHARE_LINK.inputLabel}
        </ShareFieldLabel>
        <input
          id="share-slug-input"
          value={slug}
          onChange={(e) => apply(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={taken || undefined}
          aria-describedby="share-slug-status"
          data-autofocus=""
          className={classNames(
            SHARE_INPUT_CLASS,
            taken
              ? 'border-[1.5px] border-[#ebc2bd] leading-5 font-normal text-[#c0392b]'
              : available
                ? 'border-[1.5px] border-brand-green-light-active'
                : 'border border-[#ccc]'
          )}
        />
        <div id="share-slug-status" aria-live="polite">
          {taken ? (
            <ShareFieldHelper pad={0}>{SHARE_LINK.taken}</ShareFieldHelper>
          ) : available ? (
            <ShareFieldHelper pad={8}>{SHARE_LINK.available}</ShareFieldHelper>
          ) : null}
        </div>
      </div>

      {taken ? (
        <div className="flex flex-wrap gap-[8px]">
          {SHARE_LINK.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                log('click suggestion', { suggestion });
                apply(suggestion);
              }}
              className={classNames(
                'flex cursor-pointer items-center gap-[6px] rounded-full border border-solid border-brand-green-light-active bg-brand-green-light px-[12px] py-[7px] text-[13px] leading-[normal] font-semibold whitespace-nowrap text-brand-green-active',
                FOCUS_RING
              )}
            >
              <ShareCheckGreenIcon className="size-[13px] shrink-0" />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex w-full items-center gap-[10px] rounded-[12px] bg-[#faf4e8] px-[14px] py-[12px]">
        <ShareRedoIcon className="size-[15px] shrink-0" />
        <p className="m-0 min-w-0 flex-1 text-[13px] leading-[1.4] text-[#463409]">
          {SHARE_LINK.note}
        </p>
      </div>

      <div className="flex w-full items-center justify-end gap-[10px]">
        <Button variant="tertiary" size="sm" onClick={back}>
          {SHARE_LINK.cancel}
        </Button>
        <Button variant="primary" size="sm" disabled={!available} onClick={save}>
          {SHARE_LINK.save}
        </Button>
      </div>
    </ShareDialog>
  );
};

export default ShareProfileLink;
