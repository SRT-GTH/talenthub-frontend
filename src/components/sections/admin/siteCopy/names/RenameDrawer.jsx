import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import NameBanner from './NameBanner.jsx';
import NameExamples from './NameExamples.jsx';
import NameField from './NameField.jsx';
import { CloseIcon } from './NameIcons.jsx';
import NameReasonField from './NameReasonField.jsx';
import NameUsageTiles from './NameUsageTiles.jsx';
import { hasErrors, reasonError, showLineBreaks, validateNames } from './productNameRules.js';
import { NAME_COPY, NAME_LIMITS } from './productNamesData.js';

const log = debug('RenameDrawer');

/*
 * RenameDrawer — the right-hand drawer of the rename flow (Figma "drawer · Rename", 620 wide, full height, 28 padding, 18 gap, scrim #1c2a21 at 55 %):
 *   mode 'draft'    Content Editor, 7.8.6b-d: "Rename the assistant", "Cancel" / "Save draft", the amber note "You can draft this rename. A super admin publishes it."
 *   mode 'review'   Super Admin with a draft, 7.8.6g / 7.8.6j: "Review: rename the assistant", read-only fields, "Why are you publishing this?", "Send back" / "Publish rename"
 *   mode 'publish'  ⚠️ ASSUMPTION: Super Admin renaming a live name directly: editable fields, the reason field, "Cancel" / "Publish rename" (no frame; assembled from the drawn parts)
 * Under the fields: WHERE IT’S USED tiles and EXAMPLES that follow the typed names. While a field is invalid (7.8.6c / 7.8.6d) or the reason is
 * missing (7.8.6j) those blocks are not drawn, as in the frames. Validation is live (unsafe characters, 14 / 40 limits); "required" and the
 * reason are checked when the button is pressed. Phones: a full-width sheet.
 * Props: item (the name row), mode, initial { name, short, plural }, initialReason, initialSubmitted (frame URL `check=1`: show the "required" errors at once), by, onClose, onSaveDraft(values), onPublish(values, reason), onSendBack().
 */

const BTN =
  'inline-flex min-h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid px-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] sm:px-[34px]';

const RenameDrawer = ({
  item,
  mode,
  initial,
  initialReason = '',
  initialSubmitted = false,
  onClose,
  onSaveDraft,
  onPublish,
  onSendBack,
}) => {
  const [values, setValues] = useState(initial);
  const [reason, setReason] = useState(initialReason);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [unchanged, setUnchanged] = useState(false);
  const nameRef = useRef(null);
  const shortRef = useRef(null);
  const pluralRef = useRef(null);
  const reasonRef = useRef(null);
  const readOnly = mode === 'review';
  const withReason = mode !== 'draft';

  useEffect(() => {
    log('mount', { id: item.id, mode, initial, reason: initialReason.length });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const errors = validateNames(values, { required: submitted });
  const reasonProblem = withReason && submitted ? reasonError(reason) : '';
  const invalid = hasErrors(errors) || Boolean(reasonProblem);

  const set = (field) => (text) => {
    setUnchanged(false);
    setValues((v) => ({ ...v, [field]: text }));
  };

  const onPaste = (field) => (e) => {
    const text = e.clipboardData?.getData('text') ?? '';
    if (!/[\r\n]/.test(text)) return;
    e.preventDefault();
    const el = e.target;
    const next = `${el.value.slice(0, el.selectionStart)}${showLineBreaks(text)}${el.value.slice(el.selectionEnd)}`;
    log('paste with a line break', field);
    set(field)(next);
  };

  const submit = () => {
    setSubmitted(true);
    const errs = validateNames(values, { required: true });
    const rErr = withReason ? reasonError(reason) : '';
    const same =
      values.name.trim() === item.name &&
      values.short.trim() === item.short &&
      values.plural.trim() === item.plural;
    log('submit', { mode, errs, rErr, same });
    if (hasErrors(errs)) {
      (errs.name ? nameRef : errs.short ? shortRef : pluralRef).current?.focus();
      return;
    }
    if (mode !== 'review' && same) {
      setUnchanged(true);
      nameRef.current?.focus();
      return;
    }
    if (rErr) {
      reasonRef.current?.focus();
      return;
    }
    const clean = {
      name: values.name.trim(),
      short: values.short.trim(),
      plural: values.plural.trim(),
    };
    if (mode === 'draft') onSaveDraft(clean);
    else onPublish(clean, reason.trim());
  };

  const title = `${mode === 'review' ? 'Review: rename' : 'Rename'} the ${item.kind.toLowerCase()}`;
  const now = `Now called “${item.name}”${item.short ? ` (short: “${item.short}”)` : ''}. Internal system names don’t change, only what people read.`;
  const primary = mode === 'draft' ? 'Save draft' : 'Publish rename';

  return (
    <AgencyDialog
      label={title}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55 !items-stretch !justify-end !overflow-hidden !p-0"
      panelClassName="!my-0 flex h-dvh w-screen max-w-[620px] flex-col"
    >
      <div className="flex h-full min-h-0 flex-col gap-[18px] bg-white p-[16px] shadow-[-8px_0_32px_rgba(28,42,33,0.18)] sm:p-[28px]">
        <div className="flex items-center gap-[10px]">
          <h2 className="m-0 min-w-0 flex-1 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <CloseIcon className="size-[16px]" />
          </button>
        </div>
        <div className="-mx-[4px] flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-[4px] py-[2px]">
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#575755]">{now}</p>
          <div className="flex flex-col gap-[14px]">
            <NameField
              label="Full name"
              value={values.name}
              onChange={set('name')}
              onPaste={onPaste('name')}
              max={NAME_LIMITS.name}
              error={errors.name || (unchanged ? NAME_COPY.errors.unchanged : '')}
              readOnly={readOnly}
              inputRef={nameRef}
              name="name"
              data-autofocus={readOnly ? undefined : ''}
            />
            <NameField
              label="Short name (optional)"
              value={values.short}
              onChange={set('short')}
              onPaste={onPaste('short')}
              max={NAME_LIMITS.short}
              error={errors.short}
              readOnly={readOnly}
              inputRef={shortRef}
              name="short"
            />
            <NameField
              label="Plural (optional)"
              value={values.plural}
              onChange={set('plural')}
              onPaste={onPaste('plural')}
              max={NAME_LIMITS.plural}
              error={errors.plural}
              placeholder="Leave empty to use the full name"
              readOnly={readOnly}
              inputRef={pluralRef}
              name="plural"
            />
          </div>
          {invalid ? null : (
            <>
              <NameUsageTiles usage={item.usage} />
              <NameExamples examples={item.examples} values={values} current={item} />
              {mode === 'draft' ? (
                <NameBanner tone="amber" icon="info">
                  {NAME_COPY.draftOnly}
                </NameBanner>
              ) : null}
            </>
          )}
          {withReason ? (
            <NameReasonField
              value={reason}
              onChange={setReason}
              error={reasonProblem}
              inputRef={reasonRef}
              autoFocus={readOnly || mode === 'publish'}
            />
          ) : null}
        </div>
        <div className="flex gap-[12px] max-sm:flex-col-reverse">
          {mode === 'review' ? (
            <button
              type="button"
              onClick={onSendBack}
              className={classNames(
                BTN,
                'border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]'
              )}
            >
              Send back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className={classNames(
                BTN,
                'border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]'
              )}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            className={classNames(
              BTN,
              'border-[#2a5730] bg-[#387440] text-white shadow-[0_4px_0_#2a5730]'
            )}
          >
            {primary}
          </button>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default RenameDrawer;
