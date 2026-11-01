import { debug } from '../../../../../utils/debug.js';
import { SS_COPY, SS_RULE_LABEL } from './switchSortData.js';
import { SwitchSortEyeIcon, SwitchSortGridIcon, SwitchSortLockIcon } from './SwitchSortIcons.jsx';

const log = debug('SwitchSortRuleSign');

/*
 * SwitchSortRuleSign — the pill above the table (Figma "rule sign" 9619:56509 / "rule sign · hidden" 9619:59059, SS-03 changed sign 9619:58203).
 *   mode 'rule'    dark pill, eye icon       "Sort by COLOUR"
 *   mode 'changed' amber pill, grid icon     "Rule changed · Sort by SHAPE"       (the first card after a switch)
 *   mode 'hidden'  dashed outline, lock      "No rule sign at Expert · work it out from the ticks"
 */
const BASE =
  'inline-flex max-w-full items-center gap-[10px] rounded-full py-[10px] pr-[18px] pl-[14px] font-sans font-bold';

const SwitchSortRuleSign = ({ mode, rule }) => {
  log('render', { mode, rule });
  const word = SS_RULE_LABEL[rule];
  if (mode === 'hidden') {
    return (
      <p
        className={`m-0 ${BASE} border-[1.5px] border-dashed border-[rgba(28,42,33,0.3)] bg-white text-[15px] leading-[18px] font-semibold text-[#6b6b6b] max-lg:text-[14px]`}
      >
        <SwitchSortLockIcon className="size-[18px] shrink-0" />
        <span>{SS_COPY.signHidden}</span>
      </p>
    );
  }
  if (mode === 'changed') {
    return (
      <p
        role="status"
        className={`m-0 ${BASE} border-2 border-solid border-[#8a6100] bg-[#fef8ec] text-[16px] leading-[19px] text-[#8a6100] max-lg:text-[14px]`}
      >
        <SwitchSortGridIcon className="size-[18px] shrink-0" />
        <span>{`Rule changed · Sort by ${word}`}</span>
      </p>
    );
  }
  return (
    <p
      role="status"
      className={`m-0 ${BASE} bg-[#1c2a21] text-[16px] leading-[19px] text-white max-lg:text-[14px]`}
    >
      <SwitchSortEyeIcon className="size-[18px] shrink-0" />
      <span>{`Sort by ${word}`}</span>
    </p>
  );
};

export default SwitchSortRuleSign;
