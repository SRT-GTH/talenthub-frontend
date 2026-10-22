import { FILTER_GROUPS, PAY } from './OpportunitiesData.js';
import { CheckGlyph } from './OpportunitiesIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('FilterGroups');

const Label = ({ children }) => (
  <p className="m-0 font-sans text-[12px] font-bold leading-[14.32px] tracking-[1.2px] text-[#387440]">
    {children}
  </p>
);

/*
 * The filter groups shared by the desktop sidebar (Figma 7797:28545) and the mobile/tablet sheet (7815:306510):
 * LEVEL / WORK STYLE / REGION checkbox groups (24px rhythm, 20px tiles r6) and the PAY range bar (inert — drawn, not interactive).
 */
const FilterGroups = ({ state, update }) => {
  const toggle = (key, id) => {
    const current = state[key];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    log('toggle', { key, id, next });
    update({ [key]: next });
  };

  return (
    <div className="flex flex-col gap-6">
      {FILTER_GROUPS.map((group) => (
        <div key={group.key} role="group" aria-label={group.label} className="flex flex-col gap-6">
          <Label>{group.label}</Label>
          {group.options.map((opt) => {
            const checked = state[group.key].includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(group.key, opt.id)}
                className="flex w-fit cursor-pointer items-center gap-[10px] border-0 bg-transparent p-0 text-left"
              >
                <span
                  className={classNames(
                    'flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px]',
                    checked
                      ? 'border-[#387440] bg-[#387440] text-white'
                      : 'border-[#8a8a8a] bg-white'
                  )}
                >
                  {checked ? (
                    <span className="size-3">
                      <CheckGlyph />
                    </span>
                  ) : null}
                </span>
                <span className="font-sans text-[15px] font-medium leading-[17.9px] text-[#1c2a21]">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex flex-col gap-6">
        <Label>{PAY.label}</Label>
        <div className="h-2 w-full overflow-hidden rounded-[4px] bg-[#eceee8]">
          <div
            className="h-full rounded-[4px] bg-[linear-gradient(90deg,#387440,#84cc16)]"
            style={{ width: `${PAY.fillRatio * 100}%` }}
          />
        </div>
        <p className="m-0 font-sans text-[13px] font-semibold leading-[15.5px] text-[#595959]">
          {PAY.range}
        </p>
      </div>
    </div>
  );
};

export default FilterGroups;
