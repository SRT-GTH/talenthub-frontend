import { forwardRef, useId } from 'react';
import { MODES } from './data/programmesData.js';

/*
 * ProgrammeDetailsCard — "DETAILS" of "Who can apply": what students read on the programme (title, what it is, where, how, closing date,
 * description). Not drawn in Figma (the frames start from a template whose text is already written); the fields use the GTHInput look of the
 * Programme select (1px #cccccc, r10, 14/500 #595959). A description line starting with "- " shows as a bullet on the student page.
 * Props: value (details), onChange(patch), errors { title }, descriptionRef (focus target of the contact-details dialog).
 */

const FIELD =
  'w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[16px] py-[13px] font-sans text-[14px] leading-[20px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(0,0,0,0.04)] placeholder:font-normal placeholder:text-[#999999] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="flex items-center gap-[1px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
  >
    {children}
    {required ? (
      <span aria-hidden="true" className="text-[14px] font-semibold text-[#1d7c4d]">
        *
      </span>
    ) : null}
  </label>
);

const ProgrammeDetailsCard = forwardRef(({ value, onChange, errors = {} }, descriptionRef) => {
  const id = useId();
  const f = (k) => `${id}-${k}`;
  return (
    <div className="grid grid-cols-1 gap-x-[24px] gap-y-[16px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] py-[20px] md:grid-cols-2 xl:max-w-[1329px]">
      <div className="flex flex-col gap-[8px] md:col-span-2">
        <Label htmlFor={f('title')} required>
          Title
        </Label>
        <input
          id={f('title')}
          type="text"
          value={value.title}
          maxLength={140}
          required
          aria-invalid={errors.title ? 'true' : undefined}
          aria-describedby={errors.title ? f('title-err') : undefined}
          placeholder="e.g. Scholarship Prep Clinic"
          onChange={(e) => onChange({ title: e.target.value })}
          className={FIELD}
        />
        {errors.title ? (
          <p id={f('title-err')} className="m-0 text-[13px] leading-[18px] text-[#902b20]">
            {errors.title}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-[8px]">
        <Label htmlFor={f('kind')}>What it is</Label>
        <input
          id={f('kind')}
          type="text"
          value={value.kind}
          maxLength={80}
          placeholder="e.g. 6 Saturdays"
          onChange={(e) => onChange({ kind: e.target.value })}
          className={FIELD}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <Label htmlFor={f('place')}>Where</Label>
        <input
          id={f('place')}
          type="text"
          value={value.place}
          maxLength={80}
          placeholder="e.g. School library"
          onChange={(e) => onChange({ place: e.target.value })}
          className={FIELD}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <Label htmlFor={f('mode')}>How students take part</Label>
        <select
          id={f('mode')}
          value={value.mode}
          onChange={(e) => onChange({ mode: e.target.value })}
          className={`${FIELD} cursor-pointer`}
        >
          {MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-[8px]">
        <Label htmlFor={f('deadline')}>Sign-ups close</Label>
        <input
          id={f('deadline')}
          type="date"
          value={value.deadline}
          onChange={(e) => onChange({ deadline: e.target.value })}
          className={FIELD}
        />
      </div>
      <div className="flex flex-col gap-[8px] md:col-span-2">
        <Label htmlFor={f('description')}>Description</Label>
        <textarea
          id={f('description')}
          ref={descriptionRef}
          value={value.description}
          maxLength={4000}
          rows={6}
          aria-describedby={f('description-hint')}
          onChange={(e) => onChange({ description: e.target.value })}
          className={`${FIELD} resize-y`}
        />
        <p id={f('description-hint')} className="m-0 text-[13px] leading-[18px] text-[#959592]">
          Start a line with “- ” to make it a bullet point. No phone numbers, emails or links:
          students reach the school through GTH.
        </p>
      </div>
    </div>
  );
});

ProgrammeDetailsCard.displayName = 'ProgrammeDetailsCard';

export default ProgrammeDetailsCard;
