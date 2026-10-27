import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { CloseButton, DialogShell, DialogTitle } from './CommunityDialogParts.jsx';
import { FOCUS_RING } from './communityDialogUtils.js';
import { CARD } from './communityPageStyles.js';
import { POST_PURPOSES, PURPOSE_BY_VALUE } from './postPurpose.js';

const log = debug('PurposeDialogs');

/*
 * ReclassifyPurposeDialog — a community moderator changes a post's purpose (US-5.2.2-01 "Reclassify Purpose",
 * US-5.2.2-04). The author is told by the backend. Props: post (toPost shape), busy, error, onSave(value), onClose.
 */
export const ReclassifyPurposeDialog = ({ post, busy = false, error = null, onSave, onClose }) => {
  const titleId = useId();
  const groupId = useId();
  const [value, setValue] = useState(post?.purpose || '');
  const current = post?.purpose ? PURPOSE_BY_VALUE[post.purpose] : null;
  return (
    <DialogShell width={520} onClose={onClose} labelId={titleId}>
      <div className="flex items-start gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <DialogTitle id={titleId} size={23} lineHeight={28}>
            Change this post’s purpose
          </DialogTitle>
          <p className="m-0 font-sans text-[13px] leading-[18px] text-[#737373]">
            {current ? `Now: ${current.singular}. ` : ''}
            {post?.author?.name || 'The author'} will be told about the change.
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div role="radiogroup" aria-labelledby={groupId} className="flex flex-col gap-[8px]">
        <span id={groupId} className="sr-only">
          Purpose
        </span>
        {POST_PURPOSES.map((p) => {
          const on = value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setValue(p.value)}
              className={classNames(
                'flex cursor-pointer flex-col items-start gap-[2px] rounded-[12px] border border-solid px-[14px] py-[10px] text-left',
                on ? 'border-[#387440] bg-[#f3f8f4]' : 'border-[#e6e6e6] bg-white',
                FOCUS_RING
              )}
            >
              <span className="font-sans text-[14px] font-semibold leading-[18px] text-[#1c2a21]">
                {p.label}
              </span>
              <span className="font-sans text-[12px] leading-[16px] text-[#737373]">{p.hint}</span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p
          role="alert"
          className="m-0 font-sans text-[13px] font-medium leading-[16px] text-[#c0392b]"
        >
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-[10px]">
        <Button variant="tertiary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!value || value === post?.purpose || busy}
          onClick={() => {
            log('reclassify', post?.id, value);
            onSave?.(value);
          }}
        >
          Change purpose
        </Button>
      </div>
    </DialogShell>
  );
};

/*
 * PurposeSettingsCard — community moderators choose which purposes the community accepts (US-5.2.2-04). Nothing
 * ticked = every purpose. Props: allowed (values), restricted, busy, onSave(values) -> Promise<{ ok, error? }>.
 */
export const PurposeSettingsCard = ({ allowed, restricted, onSave }) => {
  const [picked, setPicked] = useState(restricted ? allowed : []);
  const [state, setState] = useState({ busy: false, note: null });
  const toggle = (v) =>
    setPicked((list) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]));
  const save = async () => {
    setState({ busy: true, note: null });
    const res = await onSave?.(picked);
    setState({
      busy: false,
      note: res?.ok
        ? picked.length
          ? 'Saved. Only these purposes can be posted here now.'
          : 'Saved. Every purpose can be posted here.'
        : res?.error || 'Couldn’t save. Try again.',
    });
  };
  return (
    <section
      aria-labelledby="purpose-settings-title"
      className={classNames(CARD, 'flex flex-col gap-[12px] p-[20px]')}
    >
      <div className="flex flex-col gap-[4px]">
        <h3
          id="purpose-settings-title"
          className="m-0 font-sans text-[16px] font-semibold leading-[20px] text-[#1c2a21]"
        >
          Post purposes (moderators)
        </h3>
        <p className="m-0 font-sans text-[13px] leading-[18px] text-[#737373]">
          Tick the purposes this community accepts. Leave all unticked to accept every purpose.
        </p>
      </div>
      <div className="flex flex-col gap-[8px]">
        {POST_PURPOSES.map((p) => (
          <label
            key={p.value}
            className="flex cursor-pointer items-center gap-[10px] font-sans text-[14px] text-[#1c2a21]"
          >
            <input
              type="checkbox"
              checked={picked.includes(p.value)}
              onChange={() => toggle(p.value)}
              className="size-[16px] accent-[#387440]"
            />
            <span className="font-semibold">{p.label}</span>
            <span className="text-[12px] text-[#737373]">{p.hint}</span>
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-[10px]">
        <Button variant="primary" size="sm" disabled={state.busy} onClick={save}>
          Save purposes
        </Button>
        {state.note ? (
          <span role="status" className="font-sans text-[13px] text-[#595959]">
            {state.note}
          </span>
        ) : null}
      </div>
    </section>
  );
};
