import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import Modal from '../../ui/Modal.jsx';
import TogglePill from '../../ui/TogglePill.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import Select from '../../ui/form/Select.jsx';
import { CheckIcon, CloseIcon } from './talentSearchMenuIcons.jsx';
import { MORE_FILTERS } from './talentSearchFilterData.js';
import { listParam } from './useTalentSearchState.js';
import { isRecruiterSession } from '../../../services/recruiterShell.api.js';

const log = debug('TalentSearchMoreFilters');

/*
 * TalentSearchMoreFilters — the "More filters" drawer (TS-06, Figma 10102:40554, 640 wide, r24, p24, gap 18).
 * Head ("More filters" Bricolage 24/600 + a 32px outline close button), Availability and Work setup multi-select pills, three required selects (Education,
 * Minimum GTH assessment score, Expected pay), three checkboxes (verified skills, 18+, hide talent already in my pipelines) and the footer
 * ("Clear all" link + the green "Show 9 talents" button). Values live in the URL (see useTalentSearchState); every change writes through `onChange`.
 *
 *   <TalentSearchMoreFilters filters onChange onClose />          the card, for the popover at xl+ (the section positions it)
 *   <TalentSearchMoreFiltersSheet open filters onChange onClose />  the same body inside the shared Modal (bottom sheet below sm) for narrower screens
 * "Clear all" resets the drawer's own values to their defaults; "Show N talents" closes the drawer (⚠️ ASSUMPTION: the count is the fixed 9 Figma draws).
 */
const togglePick = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

const TickGlyph = () => (
  <span className="inline-flex size-[18px] items-center justify-center rounded-[5px] bg-[#387440] text-white">
    <CheckIcon className="size-[12px]" />
  </span>
);
const EmptyBoxGlyph = () => (
  <span className="inline-flex size-[18px] rounded-[5px] border-[1.5px] border-solid border-[#dbded9] bg-white" />
);

/*
 * Signed in, only what talent profiles hold is offered: availability (open to work / available now) and education.
 * Work setup, pay, assessment scores and verified skills aren't on profiles yet; under-18s follow the posting rule.
 */
const LIVE_AVAILABILITY = new Set(['open-to-work', 'available-now']);

const Body = ({ filters, onChange, onClose, showHead = true }) => {
  const live = isRecruiterSession();
  const clearAll = () => {
    log('clear all');
    onChange({
      availability: null,
      setup: null,
      education: null,
      score: null,
      pay: null,
      verified: null,
      adult: null,
      hidePipeline: null,
    });
  };
  const checkboxValues = {
    verified: filters.verified,
    adult: filters.adult,
    'hide-pipeline': filters.hidePipeline,
  };
  const checkboxWrite = (id, on) => {
    if (id === 'verified') return { verified: on ? null : '0' };
    if (id === 'adult') return { adult: on ? null : '0' };
    return { hidePipeline: on ? '1' : null };
  };
  const selectDefs = [
    { key: 'education', param: 'education', def: MORE_FILTERS.education, value: filters.education },
    { key: 'minScore', param: 'score', def: MORE_FILTERS.minScore, value: filters.minScore },
    { key: 'pay', param: 'pay', def: MORE_FILTERS.pay, value: filters.pay },
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      {showHead ? (
        <div className="flex items-center justify-between gap-[12px]">
          <h2 className="m-0 font-heading text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
            {MORE_FILTERS.title}
          </h2>
          <button
            type="button"
            aria-label={MORE_FILTERS.closeLabel}
            onClick={onClose}
            className="inline-flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white p-0 text-[#111] max-lg:size-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CloseIcon className="size-[14px]" />
          </button>
        </div>
      ) : null}

      <fieldset className="m-0 flex min-w-0 flex-col gap-[18px] border-0 p-0">
        <legend className="mb-[18px] p-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
          {MORE_FILTERS.availabilityLabel}
        </legend>
        <div className="flex flex-wrap gap-[8px]">
          {MORE_FILTERS.availability
            .filter((o) => !live || LIVE_AVAILABILITY.has(o.id))
            .map((option) => (
              <TogglePill
                key={option.id}
                selected={filters.availability.includes(option.id)}
                onClick={() =>
                  onChange({
                    // Explicit (signed in, no key = no filter).
                    availability: togglePick(filters.availability, option.id).join(',') || 'none',
                  })
                }
              >
                {option.label}
              </TogglePill>
            ))}
        </div>
      </fieldset>

      {live ? null : (
        <fieldset className="m-0 flex min-w-0 flex-col gap-[18px] border-0 p-0">
          <legend className="mb-[18px] p-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
            {MORE_FILTERS.workSetupLabel}
          </legend>
          <div className="flex flex-wrap gap-[8px]">
            {MORE_FILTERS.workSetup.map((option) => (
              <TogglePill
                key={option.id}
                selected={filters.workSetup.includes(option.id)}
                onClick={() =>
                  onChange({
                    setup: listParam(
                      togglePick(filters.workSetup, option.id),
                      MORE_FILTERS.defaultWorkSetup
                    ),
                  })
                }
              >
                {option.label}
              </TogglePill>
            ))}
          </div>
        </fieldset>
      )}

      {selectDefs
        .filter((d) => !live || d.key === 'education')
        .map(({ key, param, def, value }) => (
          <Select
            key={key}
            label={def.label}
            required
            options={def.options}
            value={value}
            onChange={(next) =>
              onChange({
                [param]:
                  next === (live && key === 'education' ? 'any' : def.defaultId) ? null : next,
              })
            }
            labelClassName="!text-[#111]"
          />
        ))}

      {live ? (
        <p className="m-0 font-sans text-[12px] leading-[20px] text-[#575755]">
          Talent profiles don’t hold work setup, expected pay or assessment scores yet, so those
          filters aren’t offered. People under 18 only appear when you search for one of your
          internships or training programmes.
        </p>
      ) : null}

      <div className="flex flex-col gap-[18px]">
        {(live ? [] : MORE_FILTERS.checkboxes).map((box) => (
          <Checkbox
            key={box.id}
            checked={checkboxValues[box.id]}
            onChange={(event) => onChange(checkboxWrite(box.id, event.target.checked))}
            glyphs={{ checked: <TickGlyph />, unchecked: <EmptyBoxGlyph /> }}
            label={
              <span className="flex flex-col gap-[2px]">
                <span>{box.label}</span>
                {box.description ? (
                  <span className="text-[12px] leading-[20px] text-[#575755]">
                    {box.description}
                  </span>
                ) : null}
              </span>
            }
            labelClassName="text-[14px] leading-[24px] text-[#111]"
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-[12px]">
        <button
          type="button"
          onClick={clearAll}
          className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {MORE_FILTERS.clearAll}
        </button>
        <Button variant="primary" size="sm" onClick={onClose}>
          {live ? 'Show results' : MORE_FILTERS.showResults(MORE_FILTERS.resultCount)}
        </Button>
      </div>
    </div>
  );
};

const TalentSearchMoreFilters = ({ filters, onChange, onClose, className }) => {
  log('render popover');
  return (
    <div
      role="dialog"
      aria-label={MORE_FILTERS.title}
      className={classNames(
        'w-[640px] max-w-[calc(100vw-32px)] rounded-[24px] bg-white p-[24px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)]',
        className
      )}
    >
      <Body filters={filters} onChange={onChange} onClose={onClose} />
    </div>
  );
};

export const TalentSearchMoreFiltersSheet = ({ open, filters, onChange, onClose }) => {
  log('render sheet', { open });
  return (
    <Modal isOpen={open} onClose={onClose} size="md" ariaLabel={MORE_FILTERS.title}>
      <div className="p-[20px] pt-[24px] pr-[56px] max-sm:pr-[20px]">
        <h2 className="m-0 mb-[18px] font-heading text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
          {MORE_FILTERS.title}
        </h2>
        <Body filters={filters} onChange={onChange} onClose={onClose} showHead={false} />
      </div>
    </Modal>
  );
};

export default TalentSearchMoreFilters;
