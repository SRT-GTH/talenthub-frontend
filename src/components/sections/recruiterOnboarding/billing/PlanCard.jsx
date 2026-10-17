import Button from '../../../ui/Button.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatUsdShort, getPeriod } from './billingData.js';
import { CheckCircleIcon } from './billingIcons.jsx';

const log = debug('PlanCard');

/*
 * PlanCard - one plan option of the recruiter Plan step (a radio).
 * Figma R05: "Plan · Free" 7374:6764 selected / "Plan · Professional" 7012 /
 * "Plan · Enterprise" 7258. Card 288x435, r16, pad 18/24, gap 10.
 *   unselected: #fff, border #e0e3de 1px
 *   selected:   gradient #fef1e7 -> #e8f2ed @20% (top-right corner), border #387440
 * both: shadow 0 1 2 rgba(15,15,10,.05) + 0 6 16 rgba(15,15,10,.07).
 * Top row: eyebrow (12/600 #387440) + pill ("Selected" #387440 / "Most
 * popular" #c8951a). Price: Bricolage 32/600 #111 + unit 14 #575755. Tagline,
 * 1px divider, feature list (16px check-circle + 14/24 #111), spacer, CTA
 * ("Choose X" tertiary / "Selected" primary).
 *
 * A11y: the real control is a visually hidden native radio (arrow keys move
 * the selection inside the radiogroup); its name is the eyebrow label and it is
 * described by price + tagline. The CTA button is a mouse/touch affordance
 * only (aria-hidden, tabIndex -1) so keyboard/AT users do not get two stops.
 * The whole card is clickable.
 */
const CARD_SHADOW = 'shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_rgba(15,15,10,0.07)]';
const SELECTED_BG = 'linear-gradient(to bottom left, #fef1e7 0%, #e8f2ed 20.192%)';

const PlanCard = ({ plan, billing, selected, onSelect, name = 'plan-tier' }) => {
  const period = getPeriod(billing);
  const price = plan.prices[period.key];
  const free = plan.tier === 'free';
  const radioId = `${name}-${plan.tier}`;
  const labelId = `${radioId}-label`;
  const descId = `${radioId}-desc`;
  const pill = selected ? 'Selected' : plan.badge;

  log('render', { tier: plan.tier, billing: period.key, selected });

  const choose = () => {
    log('choose', plan.tier);
    onSelect(plan.tier);
  };

  return (
    <div
      onClick={choose}
      style={selected ? { backgroundImage: SELECTED_BG } : undefined}
      className={classNames(
        'relative flex cursor-pointer flex-col gap-[10px] rounded-2xl border px-6 py-[18px] transition-[border-color,background-color] duration-150 max-md:px-5',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-green',
        CARD_SHADOW,
        selected
          ? 'border-[#387440]'
          : 'border-[#e0e3de] bg-white hover:border-brand-green-light-active'
      )}
    >
      <input
        id={radioId}
        type="radio"
        name={name}
        value={plan.tier}
        checked={selected}
        onChange={choose}
        aria-describedby={descId}
        className="absolute inset-0 z-[1] m-0 size-full cursor-pointer appearance-none opacity-0"
      />

      <div
        className={classNames('flex items-center justify-between', pill ? 'min-h-7' : 'min-h-5')}
      >
        <label
          id={labelId}
          htmlFor={radioId}
          className="inline-flex min-h-6 min-w-6 cursor-pointer items-center text-[12px] font-semibold leading-5 tracking-[0.2px] text-[#387440]"
        >
          {plan.eyebrow}
        </label>
        {pill && (
          <span
            className={classNames(
              'inline-flex items-center rounded-full px-[10px] py-1 text-[12px] font-medium leading-5 tracking-[0.2px]',
              selected ? 'bg-[#387440] text-white' : 'bg-[#c8951a] text-[#faf4e8]'
            )}
          >
            {pill}
          </span>
        )}
      </div>

      <div id={descId} className="flex flex-col gap-[10px]">
        <p className="flex items-end gap-1.5">
          <span className="font-heading text-[32px] font-semibold leading-[38px] text-[#111111]">
            {formatUsdShort(price)}
          </span>
          <span className="pb-px text-[14px] leading-6 tracking-[0.2px] text-[#575755]">
            {free ? 'forever' : period.unit}
          </span>
        </p>
        <p className="text-[14px] leading-6 tracking-[0.2px] text-[#575755]">{plan.tagline}</p>
      </div>

      <hr className="h-px w-full border-0 bg-[#fefefe]" />

      <ul className="flex flex-col gap-1.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 inline-flex size-4 shrink-0 text-[#387440]">
              <CheckCircleIcon className="size-4" />
            </span>
            <span className="text-[14px] leading-6 tracking-[0.2px] text-[#111111]">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="min-h-2 flex-1" />

      <Button
        variant={selected ? 'primary' : 'tertiary'}
        size="sm"
        tabIndex={-1}
        aria-hidden="true"
        onClick={(e) => {
          e.stopPropagation();
          choose();
        }}
        className="w-full justify-center max-lg:min-h-11"
      >
        {selected ? '✓  Selected' : plan.chooseLabel}
      </Button>
    </div>
  );
};

export default PlanCard;
