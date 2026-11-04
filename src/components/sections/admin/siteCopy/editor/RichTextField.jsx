import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { CopyLabelIcon } from '../siteCopyIcons.jsx';
import { chipMarkup, fromEditable, toEditable } from './chipDom.js';
import { EditorLinkIcon } from './EditorIcons.jsx';
import LinkPopover from './LinkPopover.jsx';
import NameMenu from './NameMenu.jsx';
import { cleanHtml } from './richText.js';

const log = debug('RichTextField');

/*
 * RichTextField — the small rich-text editor of the section editor (Supporting line, FAQ answers; frames 7.8.2a, 2c-2f, 2i, 2n). A
 * contenteditable box with the drawn toolbar [ B · I · • · 1. · link | tag Insert name ] (278 x 35, #f8f8f4, r10; the active tool #1c2a21 with
 * white text), bold / italic / bullet and numbered lists, a link popover (LinkPopover) and a product-name menu (NameMenu) whose chips are drawn inside
 * the text (chipDom.js; a refused name is red). Paste keeps bold, italic, lists and links and drops the rest (frame 7.8.2i, `onPasted` shows the
 * notice). {{Name}} typed or pasted becomes a chip. The value is the restricted HTML of richText.js; `onChange(html)` fires on every edit.
 * Props: labelId, value, onChange, readOnly, invalid, popover ('link' | 'chip' | null), onPopover(kind | null), onPasted, linkInit
 * ({ text, url, error }, a frame's link popover), activeTools (initial pressed tools of a frame: 'bold' | 'italic' | 'ul' | 'ol').
 */
const COMMANDS = {
  bold: 'bold',
  italic: 'italic',
  ul: 'insertUnorderedList',
  ol: 'insertOrderedList',
};

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const Tool = ({ pressed, className, idleText = 'text-[#1c2a21]', children, label, ...rest }) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed === undefined ? undefined : Boolean(pressed)}
    onMouseDown={(e) => e.preventDefault()}
    className={classNames(
      'inline-flex min-h-[27px] shrink-0 cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border-0 px-[10px] py-[5px] font-sans text-[14px] leading-[17px] focus-visible:outline-2 focus-visible:outline-[#387440]',
      pressed ? 'bg-[#1c2a21] text-white' : `bg-transparent ${idleText} hover:bg-white`,
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

const RichTextField = ({
  labelId,
  value,
  onChange,
  readOnly,
  invalid,
  popover,
  onPopover,
  onPasted,
  linkInit,
  activeTools,
}) => {
  const boxRef = useRef(null);
  const toolbarRef = useRef(null);
  const editorRef = useRef(null);
  const linkToolRef = useRef(null);
  const nameToolRef = useRef(null);
  const rangeRef = useRef(null);
  const lastHtml = useRef(null);
  const [active, setActive] = useState(() => new Set(activeTools ?? []));
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [selectedText, setSelectedText] = useState('');

  // Show the value (and any change that comes from outside: reset, restore, "use their version").
  useEffect(() => {
    const el = editorRef.current;
    if (!el || lastHtml.current === value) return;
    el.innerHTML = toEditable(value);
    lastHtml.current = value;
  }, [value]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    if (/\{\{[^{}]+\}\}/.test(el.textContent)) {
      log('{{name}} -> chip');
      const html = fromEditable(el);
      el.innerHTML = toEditable(html);
      const sel = window.getSelection();
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }
    const html = fromEditable(el);
    lastHtml.current = html;
    onChange(html);
  }, [onChange]);

  // Remember the caret / selection inside the editor and which tools are on.
  useEffect(() => {
    const onSel = () => {
      const el = editorRef.current;
      const sel = window.getSelection();
      if (!el || !sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) return;
      rangeRef.current = sel.getRangeAt(0).cloneRange();
      const next = new Set();
      Object.entries(COMMANDS).forEach(([k, cmd]) => {
        try {
          if (document.queryCommandState(cmd)) next.add(k);
        } catch {
          /* unsupported command state */
        }
      });
      setActive(next);
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  const restoreSelection = () => {
    const el = editorRef.current;
    el.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    if (rangeRef.current && el.contains(rangeRef.current.startContainer)) {
      sel.addRange(rangeRef.current);
    } else {
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      sel.addRange(r);
    }
  };

  const exec = (cmd, arg) => {
    restoreSelection();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const runTool = (tool) => {
    log('tool', tool);
    exec(COMMANDS[tool]);
  };

  const insertHtml = (html) => {
    restoreSelection();
    document.execCommand('insertHTML', false, html);
    emit();
  };

  // Where the popovers sit: under the toolbar, left edge at their tool (link: 20 px to the left, as drawn).
  useLayoutEffect(() => {
    if (!popover || !boxRef.current || !toolbarRef.current) return undefined;
    const place = () => {
      const anchor = popover === 'link' ? linkToolRef.current : nameToolRef.current;
      const box = boxRef.current.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const tb = toolbarRef.current.getBoundingClientRect();
      const w = Math.min(popover === 'link' ? 420 : 360, box.width);
      const dx = popover === 'link' ? 20 : 0;
      setPos({
        left: Math.max(0, Math.min(a.left - box.left - 1 - dx, box.width - 2 - w)),
        top: tb.bottom - box.top - 1 + 4,
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [popover]);

  const openPopover = (kind) => {
    if (popover === kind) {
      onPopover(null);
      return;
    }
    const sel = window.getSelection();
    const inside = sel && sel.rangeCount && editorRef.current.contains(sel.anchorNode);
    if (inside) rangeRef.current = sel.getRangeAt(0).cloneRange();
    setSelectedText(kind === 'link' && rangeRef.current ? rangeRef.current.toString() : '');
    log('open popover', kind);
    onPopover(kind);
  };

  const closePopover = () => {
    onPopover(null);
    editorRef.current?.focus();
  };

  const onPaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (html) {
      const cleaned = cleanHtml(html);
      log('paste html', { removed: cleaned.removed });
      document.execCommand('insertHTML', false, toEditable(cleaned.html));
      if (cleaned.removed) onPasted?.();
    } else {
      log('paste text');
      const cleaned = cleanHtml(escapeHtml(text).replace(/\r?\n/g, '<br>'));
      document.execCommand('insertHTML', false, toEditable(cleaned.html));
    }
    emit();
  };

  return (
    <div
      ref={boxRef}
      className={classNames(
        'relative flex flex-col gap-[10px] rounded-[12px] border border-solid bg-white px-[14px] pt-[10px] pb-[14px] transition-colors',
        invalid
          ? 'border-[#c0392b] shadow-[inset_0_0_0_1px_#c0392b]'
          : 'border-[#e7e7e7] has-[[role=textbox]:focus]:border-[#387440] has-[[role=textbox]:focus]:shadow-[inset_0_0_0_1px_#387440]'
      )}
    >
      {readOnly ? null : (
        <div
          ref={toolbarRef}
          data-editor-toolbar=""
          role="toolbar"
          aria-label="Formatting"
          className="flex w-max max-w-full items-center gap-[2px] overflow-x-auto rounded-[10px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Tool
            label="Bold"
            pressed={active.has('bold')}
            onClick={() => runTool('bold')}
            className="font-bold"
          >
            B
          </Tool>
          <Tool
            label="Italic"
            pressed={active.has('italic')}
            onClick={() => runTool('italic')}
            className="font-medium"
          >
            I
          </Tool>
          <Tool
            label="Bullet list"
            pressed={active.has('ul')}
            onClick={() => runTool('ul')}
            className="font-semibold"
          >
            •
          </Tool>
          <Tool
            label="Numbered list"
            pressed={active.has('ol')}
            onClick={() => runTool('ol')}
            className="font-semibold"
          >
            1.
          </Tool>
          <span ref={linkToolRef} className="inline-flex">
            <Tool
              label="Add a link"
              pressed={popover === 'link'}
              aria-haspopup="dialog"
              aria-expanded={popover === 'link'}
              onClick={() => openPopover('link')}
            >
              <EditorLinkIcon className="size-[16px]" />
            </Tool>
          </span>
          <span aria-hidden="true" className="mx-[1px] h-[20px] w-px shrink-0 bg-[#e7e7e7]" />
          <span ref={nameToolRef} className="inline-flex">
            <Tool
              label="Insert a product name"
              pressed={popover === 'chip'}
              aria-haspopup="dialog"
              aria-expanded={popover === 'chip'}
              onClick={() => openPopover('chip')}
              idleText="text-[#2a5730]"
              className="text-[13px] font-semibold"
            >
              <CopyLabelIcon className="size-[16px] shrink-0" />
              Insert name
            </Tool>
          </span>
        </div>
      )}
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-labelledby={labelId}
        aria-invalid={invalid ? 'true' : undefined}
        aria-readonly={readOnly ? 'true' : undefined}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        spellCheck
        tabIndex={0}
        onInput={emit}
        onPaste={onPaste}
        className="min-h-[22px] font-sans text-[15px] leading-[22px] text-[#1c2a21] outline-none max-lg:text-[14px] [&_a]:font-medium [&_a]:text-[#2a5730] [&_a]:underline [&_ol]:my-[4px] [&_ol]:list-decimal [&_ol]:pl-[22px] [&_ul]:my-[4px] [&_ul]:list-disc [&_ul]:pl-[22px]"
      />
      {popover === 'link' ? (
        <LinkPopover
          pos={pos}
          initialText={selectedText || linkInit?.text || ''}
          initialUrl={linkInit?.url ?? ''}
          initialError={linkInit?.error}
          onCancel={closePopover}
          onAdd={({ text, url }) => {
            onPopover(null);
            insertHtml(`<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`);
          }}
        />
      ) : null}
      {popover === 'chip' ? (
        <NameMenu
          pos={pos}
          onClose={closePopover}
          onPick={(name) => {
            onPopover(null);
            insertHtml(`${chipMarkup(name)}&nbsp;`);
          }}
        />
      ) : null}
    </div>
  );
};

export default RichTextField;
