import Button from '../../../ui/Button.jsx';
import { LAB_FOOTER } from './skillsData.js';
import { SkillsInfoCircleIcon } from './skillsIcons.jsx';
import { GUTTER } from './skillsStyles.js';
import { classNames } from '../../../../utils/classNames.js';

/*
 * SK-04 footer (Figma Footer 8285:23753): "Back to my skills" on the left, an info note on the right. It differs from the shared
 * stage footer (no Skip / Auto-saved / Continue), so it is drawn here. Props: onBack.
 */
const SkillsLabFooter = ({ onBack }) => (
  <div
    className={classNames(
      'sticky bottom-0 z-20 flex min-h-[88px] w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 border-0 border-t border-solid border-[#e7e7e7] bg-white py-3',
      GUTTER
    )}
  >
    <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onBack}>
      {LAB_FOOTER.back}
    </Button>
    <p className="m-0 inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
      <SkillsInfoCircleIcon className="size-[14px] shrink-0" />
      {LAB_FOOTER.note}
    </p>
  </div>
);

export default SkillsLabFooter;
