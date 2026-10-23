import { useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { CREATE_COPY } from './createCommunityData.js';
import {
  FOCUS_RING,
  HELP_TEXT,
  INPUT_BASE,
  INPUT_ERROR,
  INPUT_FILLED,
  INPUT_OK,
  LABEL_TEXT,
  OPTION_BASE,
  OPTION_OFF,
  OPTION_ON,
  TILE_BASE,
  TILE_TONES,
} from './createCommunityStyles.js';
import {
  CcCheckIcon,
  CcCheckCircleIcon,
  CcGlobeIcon,
  CcLockIcon,
  CcUploadIcon,
  CcUserIcon,
  CcUsersIcon,
  CcWarningIcon,
} from './CreateCommunityIcons.jsx';

const log = debug('CreateWizardParts');

/*
 * Wizard building blocks (Figma CC-02 … CC-05).
 *   Stepper       4 steps: done = green dot + check, current = ink dot, upcoming = outlined dot.   props: current (step id)
 *   TextField     GTHInput + label (green asterisk) + help line.   props: id, label, value, onChange, error, help, helpIcon, placeholder
 *   AreaField     the 112px textarea (160 max) + "N of 160 characters".   props: id, label, value, onChange, count
 *   ChoiceCard    radio option card (icon tile, title, body, radio dot).   props: icon, title, body, selected, onSelect
 *   UploadRow     dashed "Add a cover photo" row with the 56px thumbnail.  props: cover, onPick
 */
export const Stepper = ({ current }) => {
  const steps = CREATE_COPY.steps;
  const at = steps.findIndex((s) => s.id === current);
  return (
    <ol
      className="m-0 flex list-none flex-wrap items-center gap-x-[8px] gap-y-[6px] p-0"
      aria-label="Steps"
    >
      {steps.map((step, index) => {
        const done = index < at;
        const now = index === at;
        return (
          <li
            key={step.id}
            aria-current={now ? 'step' : undefined}
            className="flex items-center gap-[8px]"
          >
            <span className="flex items-center gap-[8px]">
              <span
                className={classNames(
                  'flex size-[24px] shrink-0 items-center justify-center rounded-full border border-solid font-sans text-[12px] leading-[14px]',
                  done && 'border-[#387440] bg-[#387440]',
                  now && 'border-[#1c2a21] bg-[#1c2a21] font-bold text-white',
                  !done && !now && 'border-[#e6e6e6] bg-white font-semibold text-[#737373]'
                )}
              >
                {done ? <CcCheckIcon className="size-[16px]" /> : index + 1}
              </span>
              <span
                className={classNames(
                  'font-sans text-[13px] leading-[16px] max-lg:text-[12px]',
                  now ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#737373]',
                  !now && 'max-sm:sr-only'
                )}
              >
                {step.label}
              </span>
            </span>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={classNames(
                  'h-[2px] w-[28px] rounded-[1px] max-sm:w-[14px]',
                  done ? 'bg-[#387440]' : 'bg-[#e6e6e6]'
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className={LABEL_TEXT}>
    {children}
    <span aria-hidden="true" className="font-ui text-[14px] font-semibold text-[#2e8b57]">
      *
    </span>
  </label>
);

const HelpLine = ({ id, error, icon, children }) => {
  const Glyph = icon;
  return children ? (
    <p id={id} className={classNames('m-0 flex items-center gap-[8px] px-[8px]', HELP_TEXT)}>
      <Glyph
        className={classNames('size-[16px] shrink-0', error ? 'text-[#c0392b]' : 'text-[#387440]')}
      />
      <span>{children}</span>
    </p>
  ) : null;
};

export const TextField = ({
  id,
  label,
  value,
  onChange,
  error = false,
  help,
  helpIcon = CcCheckCircleIcon,
  placeholder,
  maxLength = 60,
  inputRef,
}) => {
  const helpId = `${id}-help`;
  return (
    <div className="flex flex-col gap-[8px]">
      <Label htmlFor={id}>{label}</Label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error || undefined}
        aria-describedby={help ? helpId : undefined}
        className={classNames(
          INPUT_BASE,
          error ? INPUT_ERROR : value ? INPUT_FILLED : INPUT_OK,
          FOCUS_RING
        )}
      />
      <HelpLine id={helpId} error={error} icon={helpIcon}>
        {help}
      </HelpLine>
    </div>
  );
};

export const AreaField = ({ id, label, value, onChange, count }) => (
  <div className="flex flex-col gap-[8px]">
    <Label htmlFor={id}>{label}</Label>
    <textarea
      id={id}
      value={value}
      maxLength={160}
      onChange={(e) => onChange(e.target.value)}
      aria-describedby={`${id}-count`}
      className={classNames(
        INPUT_BASE,
        'h-[112px] resize-none border-[#ccc] font-medium',
        FOCUS_RING
      )}
    />
    <HelpLine id={`${id}-count`} icon={CcWarningIcon}>
      {count}
    </HelpLine>
  </div>
);

const CHOICE_ICONS = { globe: CcGlobeIcon, users: CcUsersIcon, lock: CcLockIcon, user: CcUserIcon };

export const ChoiceCard = ({ icon, title, body, selected, onSelect }) => {
  const Glyph = CHOICE_ICONS[icon];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={classNames(OPTION_BASE, selected ? OPTION_ON : OPTION_OFF, FOCUS_RING)}
    >
      <span className={classNames(TILE_BASE, selected ? TILE_TONES.white : TILE_TONES.green)}>
        <Glyph className="size-[20px] text-[#387440]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
          {title}
        </span>
        <span className="font-sans text-[13px] font-normal leading-[18px] text-[#737373] max-lg:text-[12px]">
          {body}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={classNames(
          'flex size-[20px] shrink-0 items-center justify-center rounded-full border-solid',
          selected ? 'border-2 border-[#387440]' : 'border-[1.5px] border-[#e6e6e6]'
        )}
      >
        {selected ? <span className="size-[10px] rounded-full bg-[#387440]" /> : null}
      </span>
    </button>
  );
};

const MAX_COVER_BYTES = 5 * 1024 * 1024;

export const UploadRow = ({ cover, onPick, onError }) => {
  const fileRef = useRef(null);
  const copy = CREATE_COPY.basics;
  const pick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > MAX_COVER_BYTES) {
      log('cover rejected', file.type, file.size);
      onError?.();
      return;
    }
    log('cover picked', file.name);
    onPick({ src: URL.createObjectURL(file), name: file.name });
  };
  return (
    <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border-[1.5px] border-dashed border-[#bfbfbf] bg-[#f8f8f4] p-[16px]">
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        tabIndex={-1}
        aria-label={copy.cover}
        onChange={pick}
      />
      <button
        type="button"
        aria-label={copy.cover}
        onClick={() => fileRef.current?.click()}
        className={classNames(
          'flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] border-[1.4px] border-solid border-[rgba(28,42,33,0.32)] bg-white p-0 shadow-[5px_5px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
          FOCUS_RING
        )}
      >
        <CcUploadIcon className="size-[20px] text-[#387440]" />
      </button>
      <div className="flex min-w-[160px] flex-1 flex-col gap-[2px]">
        <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {copy.cover}
        </span>
        <span className="font-sans text-[12px] font-normal leading-[14px] text-[#737373]">
          {copy.coverHint}
        </span>
      </div>
      {cover ? (
        <img
          src={cover.src}
          alt={cover.name ?? ''}
          className="size-[56px] shrink-0 rounded-[10px] border-[1.5px] border-solid border-[#1c2a21] object-cover"
        />
      ) : null}
    </div>
  );
};
