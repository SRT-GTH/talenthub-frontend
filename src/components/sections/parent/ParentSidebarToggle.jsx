import toggleIcon from '../../../assets/parent/ep-d-arrow-left.svg';
import { classNames } from '../../../utils/classNames.js';

/*
 * ParentSidebarToggle — the one collapse / expand button of the parent chrome (the double-arrow glyph the Parents file draws on the sidebar card and on the collapsed rail).
 * Props: expand (false = "Collapse sidebar", arrow points left; true = "Expand sidebar", arrow mirrored), onClick, className (position).
 */
const ParentSidebarToggle = ({ expand = false, onClick, className }) => (
  <button
    type="button"
    aria-label={expand ? 'Expand sidebar' : 'Collapse sidebar'}
    onClick={onClick}
    className={classNames(
      'absolute flex size-[28px] cursor-pointer items-center justify-center overflow-clip rounded-[8px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      className
    )}
  >
    <img
      src={toggleIcon}
      alt=""
      className={classNames('h-[20px] w-[23px]', expand && '-scale-x-100')}
    />
  </button>
);

export default ParentSidebarToggle;
