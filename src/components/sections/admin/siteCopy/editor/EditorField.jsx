import { debug } from '../../../../../utils/debug.js';
import FieldLabelRow from './FieldLabelRow.jsx';
import ResetConfirm from './ResetConfirm.jsx';
import RichTextField from './RichTextField.jsx';
import TextField from './TextField.jsx';
import { EditorWarningIcon } from './EditorIcons.jsx';
import { chipError, lengthError, sameValue } from './richText.js';

const log = debug('EditorField');

/* Image / video fields are built by the media builder (7.8.10); they are mounted when their files exist and render nothing before that. */
const OPTIONAL = import.meta.glob('../fields/{ImageField,VideoField}.jsx', { eager: true });
const optionalField = (kind) =>
  Object.entries(OPTIONAL).find(([path]) =>
    path.endsWith(kind === 'video' ? '/VideoField.jsx' : '/ImageField.jsx')
  )?.[1]?.default ?? null;

const Message = ({ id, children }) => (
  <p
    id={id}
    aria-live="polite"
    className="m-0 flex items-start gap-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#c0392b] max-lg:text-[12px]"
  >
    <EditorWarningIcon className="mt-[1px] size-[14px] shrink-0 text-[#b42318]" />
    {children}
  </p>
);

/*
 * EditorField — one field of the section editor: label row (label, "Changed", counter, "Reset to default" + its confirm popover), the control
 * (TextField / RichTextField / the media builder's image and video fields) and the messages under it: the refusal in red (over the limit:
 * "Keep this under N characters. This change isn’t saved until it fits." · unknown chip: "“Vault” isn’t in Product names …") and
 * "Original: <default>" once a one-line field differs from its default (frames 7.8.2b, 2g, 2h, 2k).
 * Props: field, editor (useSectionEditor), readOnly, sectionId, modal ({ name, field, linkInit }), onModal(name | null, field), autoFocus, activeTools, onPasted.
 */
const EditorField = ({
  field,
  editor,
  readOnly,
  sectionId,
  modal,
  onModal,
  autoFocus,
  activeTools,
  onPasted,
}) => {
  const value = editor.value(field);
  const c = editor.check(field, value);
  const refusedChip = c.unknown.length > 0;
  const changed = !sameValue(value, field.original, field.kind);
  const showChanged = changed && !c.over;
  const labelId = `field-${field.key}-label`;
  const mine = modal?.field === field.key;
  const resetOpen = modal?.name === 'reset' && mine;
  const popover = mine && (modal.name === 'link' || modal.name === 'chip') ? modal.name : null;
  const messageId = `field-${field.key}-note`;

  const Media = field.kind === 'image' || field.kind === 'video' ? optionalField(field.kind) : null;
  if (field.kind === 'image' || field.kind === 'video') {
    return Media ? (
      <Media
        field={field}
        value={value}
        onChange={(v) => editor.setValue(field, v)}
        readOnly={readOnly}
        sectionId={sectionId}
      />
    ) : null;
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <FieldLabelRow
        id={labelId}
        label={field.label}
        changed={showChanged}
        length={c.length}
        max={field.max}
        red={c.over || refusedChip}
        readOnly={readOnly}
        resetOpen={resetOpen}
        onReset={() => {
          log('reset asked', field.key);
          onModal(resetOpen ? null : 'reset', field.key);
        }}
      >
        {resetOpen ? (
          <ResetConfirm
            original={
              field.kind === 'rich' ? field.original.replace(/<[^>]+>/g, '') : field.original
            }
            onKeep={() => onModal(null)}
            onReset={() => {
              editor.resetField(field);
              onModal(null);
            }}
          />
        ) : null}
      </FieldLabelRow>
      {field.kind === 'rich' ? (
        <RichTextField
          labelId={labelId}
          value={value}
          onChange={(html) => editor.setValue(field, html)}
          readOnly={readOnly}
          invalid={c.over || refusedChip}
          popover={popover}
          onPopover={(name) => onModal(name, field.key)}
          onPasted={onPasted}
          linkInit={mine ? modal.linkInit : undefined}
          activeTools={activeTools}
        />
      ) : (
        <TextField
          id={`field-${field.key}`}
          labelId={labelId}
          value={value}
          onChange={(v) => editor.setValue(field, v)}
          headline={field.kind === 'headline'}
          invalid={c.over}
          readOnly={readOnly}
          autoFocus={autoFocus}
          describedBy={c.over ? messageId : undefined}
        />
      )}
      {c.over ? <Message id={messageId}>{lengthError(field.max)}</Message> : null}
      {refusedChip ? <Message id={messageId}>{chipError(c.unknown[0])}</Message> : null}
      {field.kind !== 'rich' && changed ? (
        <p className="m-0 flex flex-wrap gap-[6px] font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12px]">
          <span className="font-semibold">Original:</span>
          <span>{field.original}</span>
        </p>
      ) : null}
    </div>
  );
};

export default EditorField;
