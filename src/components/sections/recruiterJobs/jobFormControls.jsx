import { useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import useDismissableLayer from '../../../hooks/useDismissableLayer.js';
import { CheckGlyph, CheckTick, ChevronSelect, CloseGlyph } from './jobIcons.jsx';

/*
 * Controls of the recruiter job form (Figma JT-03 "Create job" 10117:51352 and CT-01 "Build a template" 10117:55122): the 44px field box, the select with its menu, the work-setup pills, the check row, the skill pills.
 * They are form-local because the design draws them as one family (44px, 10px radius, 2px bottom shelf) that differs from `ui/form/*` (51px).
 * ⚠️ ASSUMPTION: border/shelf colours are read from the reference screenshots; framecmp is the check.
 */

const BOX =
  'flex h-[44px] w-full items-center rounded-[10px] border border-solid bg-white px-[14px] font-sans text-[14px] leading-[20px] text-[#111] shadow-[0_2px_0_rgba(17,17,17,0.08)] transition-colors';
const BOX_NORMAL = 'border-[#dbded9]';
const BOX_ERROR = 'border-[#c0392b] text-[#c0392b]';
const BOX_OPEN = 'border-[#387440] shadow-[0_2px_0_#387440]';

export const Required = () => (
  <span aria-hidden="true" className="ml-[2px] font-semibold text-[#2e8b57]">
    *
  </span>
);

export const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="font-sans text-[14px] leading-[20px] font-medium text-[#111]">
    {children}
    {required ? <Required /> : null}
  </label>
);

export const Hint = ({ children, tone, className }) => (
  <p
    className={classNames(
      'm-0 font-sans text-[12px] leading-[16px]',
      tone === 'error' ? 'text-[#575755]' : 'text-[#575755]',
      className
    )}
  >
    {children}
  </p>
);

export const Field = ({ label, required, htmlFor, hint, error, className, children }) => (
  <div className={classNames('flex min-w-0 flex-col gap-[8px]', className)}>
    {label ? (
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
    ) : null}
    {children}
    {error ? (
      <p role="alert" className="m-0 font-sans text-[12px] leading-[16px] text-[#575755]">
        {error}
      </p>
    ) : hint ? (
      <Hint>{hint}</Hint>
    ) : null}
  </div>
);

export const TextBox = ({ id, value, onChange, placeholder, error, inputMode, ariaLabel }) => (
  <input
    id={id}
    aria-label={ariaLabel}
    aria-invalid={error ? true : undefined}
    value={value}
    inputMode={inputMode}
    placeholder={placeholder}
    onChange={(event) => onChange?.(event.target.value)}
    className={classNames(
      BOX,
      'outline-none placeholder:text-[#999] focus:border-[#387440] focus:bg-[#fffdf3]',
      error ? BOX_ERROR : BOX_NORMAL,
      'font-medium'
    )}
  />
);

const Chevron = ({ open }) => (
  <ChevronSelect
    size={20}
    className={classNames('shrink-0 transition-transform', open && 'rotate-180')}
  />
);

const Check = () => <CheckGlyph size={14} className="text-[#2a5730]" />;

/*
 * Select — the field dropdown. `groups` is [{ label?, items: [{ value, label, description? }] }]; `footer` adds rows under a divider ({ id, label, icon, muted }).
 * `open` / `onOpenChange` make it URL-drivable (the "dropdown open" frames). `searchable` turns the trigger into a text input that filters the items (JT-05).
 */
export const Select = ({
  id,
  value,
  placeholder = 'Select',
  groups,
  footer,
  open,
  onOpenChange,
  onChange,
  onFooter,
  error,
  searchable,
  query = '',
  onQuery,
  menuWidth,
  className,
  ariaLabel,
  display,
}) => {
  const ref = useRef(null);
  useDismissableLayer(ref, open, () => onOpenChange?.(false));
  const selected = display ?? value;
  return (
    <div ref={ref} className={classNames('relative min-w-0', className)}>
      {searchable ? (
        <div
          className={classNames(BOX, 'gap-[8px]', open ? BOX_OPEN : error ? BOX_ERROR : BOX_NORMAL)}
          onClick={() => onOpenChange?.(true)}
        >
          <input
            id={id}
            aria-label={ariaLabel}
            value={open ? query : selected || ''}
            placeholder={placeholder}
            onFocus={() => onOpenChange?.(true)}
            onChange={(event) => onQuery?.(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-[#111] outline-none placeholder:text-[#999]"
          />
          <Chevron open={open} />
        </div>
      ) : (
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open ? true : false}
          aria-label={ariaLabel}
          onClick={() => onOpenChange?.(!open)}
          className={classNames(
            BOX,
            'cursor-pointer justify-between gap-[8px] text-left',
            open ? BOX_OPEN : error ? BOX_ERROR : BOX_NORMAL
          )}
        >
          <span
            className={classNames(
              'min-w-0 flex-1 truncate',
              selected ? 'font-medium' : 'text-[#999]'
            )}
          >
            {selected || placeholder}
          </span>
          <Chevron open={open} />
        </button>
      )}
      {open ? (
        <div
          role="listbox"
          className={classNames(
            'absolute top-[calc(100%+6px)] left-0 z-30 flex max-h-[420px] flex-col overflow-y-auto rounded-[12px] border border-solid border-[#e1eae2] bg-white p-[6px] shadow-[0_12px_32px_rgba(15,15,10,0.14)]',
            menuWidth ?? 'min-w-full'
          )}
        >
          {groups.map((group, groupIndex) => (
            <div key={group.label ?? groupIndex} className="flex flex-col">
              {group.label ? (
                <span className="px-[10px] pt-[8px] pb-[4px] font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#575755]">
                  {group.label}
                </span>
              ) : null}
              {group.items.map((item) => {
                const isSelected = item.value === value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange?.(item.value);
                      onOpenChange?.(false);
                    }}
                    className={classNames(
                      'flex w-full cursor-pointer items-center justify-between gap-[8px] rounded-[8px] border-0 px-[10px] py-[8px] text-left hover:bg-[#f3f8f4]',
                      isSelected ? 'bg-[#f3f8f4]' : 'bg-transparent'
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span
                        className={classNames(
                          'font-sans text-[14px] leading-[20px] text-[#111]',
                          isSelected ? 'font-medium' : 'font-normal'
                        )}
                      >
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? <Check /> : null}
                  </button>
                );
              })}
            </div>
          ))}
          {footer?.length ? (
            <div className="mt-[4px] flex flex-col border-0 border-t border-solid border-[#e1eae2] pt-[4px]">
              {footer.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => {
                    onFooter?.(row.id);
                    onOpenChange?.(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] border-0 bg-transparent px-[10px] py-[8px] text-left font-sans text-[14px] leading-[20px] hover:bg-[#f3f8f4]"
                >
                  {row.icon}
                  <span className={row.muted ? 'text-[#babab7]' : 'text-[#111]'}>{row.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export const SetupPills = ({ value, onChange, options, icons }) => (
  <div role="radiogroup" aria-label="Work setup" className="flex flex-wrap items-center gap-[8px]">
    {options.map((option) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange?.(option)}
          className={classNames(
            'inline-flex h-[36px] cursor-pointer items-center gap-[8px] rounded-full border border-solid px-[14px] font-sans text-[14px] leading-[20px] font-medium transition-colors',
            active
              ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730] shadow-[0_2px_0_#387440]'
              : 'border-[#dbded9] bg-white text-[#111] hover:bg-[#f3f8f4]'
          )}
        >
          {icons?.[option]}
          {option}
        </button>
      );
    })}
  </div>
);

export const CheckRow = ({ checked, onChange, label, hint, bold }) => (
  <label className="flex cursor-pointer items-start gap-[10px]">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange?.(event.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={classNames(
        'mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-solid text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
        checked ? 'border-[#387440] bg-[#387440]' : 'border-[#cccccc] bg-white'
      )}
    >
      {checked ? <CheckTick size={12} /> : null}
    </span>
    <span className="flex min-w-0 flex-col gap-[2px]">
      <span
        className={classNames(
          'font-sans text-[14px] leading-[20px] text-[#111]',
          bold && 'font-medium'
        )}
      >
        {label}
      </span>
      {hint ? (
        <span className="font-sans text-[12px] leading-[16px] text-[#575755]">{hint}</span>
      ) : null}
    </span>
  </label>
);

export const SkillPill = ({ name, required, onRemove }) => (
  <span
    className={classNames(
      'inline-flex h-[28px] items-center gap-[6px] rounded-full border border-solid px-[12px] font-sans text-[12px] leading-[16px] font-medium',
      required
        ? 'border-[#bcd6c1] bg-[#ebf1ec] text-[#2a5730]'
        : 'border-[#dbded9] bg-white text-[#575755]'
    )}
  >
    {name}
    {required ? ' (required)' : ''}
    <button
      type="button"
      aria-label={`Remove ${name}`}
      onClick={onRemove}
      className="inline-flex cursor-pointer items-center border-0 bg-transparent p-0 text-current"
    >
      <CloseGlyph size={12} />
    </button>
  </span>
);

export const AreaBox = ({ id, value, onChange, placeholder, counter, rows = 3 }) => (
  <div className="flex flex-col">
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange?.(event.target.value)}
      rows={rows}
      className="w-full resize-none rounded-[10px] border border-solid border-[#dbded9] border-b-2 border-b-[#387440] bg-white px-[14px] pt-[12px] pb-[28px] font-sans text-[14px] leading-[24px] text-[#111] outline-none placeholder:text-[#bbb] focus:bg-[#fffdf3]"
    />
    <span className="-mt-[28px] mr-[14px] mb-[8px] self-end font-sans text-[12px] leading-[16px] text-[#575755]">
      {counter}
    </span>
  </div>
);
