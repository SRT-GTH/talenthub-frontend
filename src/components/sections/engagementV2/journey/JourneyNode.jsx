import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  ArrowRightIcon,
  CheckIcon,
  DiamondIcon,
  EyeIcon,
  TrophyMonoIcon,
} from './JourneyIcons.jsx';
import { stageIconFor } from './stageIcons.js';

const log = debug('JourneyNode');

const MILESTONE_ICONS = { 1: EyeIcon, 2: TrophyMonoIcon, 3: DiamondIcon };

const SHADOW = 'shadow-[0_4px_10px_rgba(20,51,26,0.06)]';

/* The text plate under a node: name (15/600) + one status line (12/500). */
export const NodeLabel = ({
  name,
  sub,
  nameClass = 'text-[#1c2a21]',
  subClass = 'text-[#595959]',
}) => (
  <span className="flex flex-col items-center gap-[2px] whitespace-nowrap rounded-[12px] bg-white/[.88] px-[12px] pb-[6px] pt-[5px] font-sans">
    <span className={classNames('text-[15px] font-semibold leading-[18px]', nameClass)}>
      {name}
    </span>
    <span className={classNames('text-[12px] font-medium leading-[14px]', subClass)}>{sub}</span>
  </span>
);

/* Round "done" tick on a node's shoulder. */
const Badge = ({ gold, className }) => (
  <span
    className={classNames(
      'absolute flex size-[26px] items-center justify-center rounded-full',
      gold
        ? 'border-2 border-white bg-[#c8951a] text-white'
        : 'border border-[#387440] bg-white text-[#387440] playful:border-2',
      className
    )}
  >
    <CheckIcon className="size-[14px]" />
  </span>
);

/*
 * One stage / milestone node at its place on the map. Rendered as a 0x0 anchor on the circle centre (cx, cy of the 1112x1140
 * map frame) so every state (done / current / todo / milestone locked / unlocked) shares the same coordinates.
 *   node     an entry of buildJourneyModel().nodes
 *   sub      the status line under the name
 *   emphasis true while the tooltip is open (icon turns green, Figma J-02)
 */
const JourneyNode = ({ node, sub, emphasis = false, pill, onEnter, onLeave }) => {
  const isMilestone = node.kind === 'milestone';
  const status = node.status;
  const name = isMilestone ? node.milestone.label : node.stage.label;
  const Glyph = isMilestone ? MILESTONE_ICONS[node.n] : stageIconFor(node.id);
  const to = isMilestone
    ? status === 'unlocked'
      ? [
          '/profile/engagement/milestone',
          '/profile/engagement/milestone/top-20',
          '/profile/engagement/milestone/top-talent',
        ][node.n - 1]
      : null
    : node.stage.route;

  const current = status === 'current';
  const circle = isMilestone ? 104 : current ? 96 : 84;

  const circleClass = isMilestone
    ? status === 'unlocked'
      ? 'rounded-[32px] border-[4px] border-[#c8951a] bg-[#faf4e8]'
      : 'rounded-[32px] border-[3px] border-[#c8951a] bg-white/90'
    : status === 'done'
      ? 'rounded-full border-[4px] border-white bg-[#387440]'
      : current
        ? 'rounded-full border border-[#387440] bg-white playful:border-[5px]'
        : 'rounded-full border-[3px] border-[#d9dcd3] bg-white';

  const glyphClass = isMilestone
    ? 'size-[40px] text-[#785910]'
    : status === 'done'
      ? 'size-[30px] text-white'
      : current
        ? 'size-[34px] text-[#387440]'
        : classNames(
            'size-[30px] transition-colors group-hover:text-[#387440] group-focus-visible:text-[#387440]',
            emphasis ? 'text-[#387440]' : 'text-[#575755]',
            node.id === 'pitch' && 'opacity-[0.45]'
          );

  const Wrapper = to ? Link : 'div';
  const wrapperProps = to
    ? {
        to,
        'aria-label': `${name}: ${sub}`,
        onClick: () => log('open node', node.id, to),
      }
    : {
        role: 'img',
        'aria-label': `${name}: ${sub}`,
        onClick: () => log('locked milestone clicked', node.id),
      };

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{ left: node.cx, top: node.cy }}
      className="group absolute block size-0 rounded-full no-underline outline-none"
      data-node={node.id}
      data-status={status}
    >
      {current ? (
        <span
          aria-hidden="true"
          className="absolute left-[-62px] top-[-62px] size-[124px] rounded-full bg-[#387440]"
        />
      ) : null}
      <span
        className={classNames(
          'absolute flex items-center justify-center group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-[3px] group-focus-visible:outline-[#c8951a]',
          circleClass,
          SHADOW
        )}
        style={{ width: circle, height: circle, left: -circle / 2, top: -circle / 2 }}
      >
        <Glyph className={glyphClass} />
      </span>
      {status === 'done' ? <Badge className="left-[16px] top-[-46px]" /> : null}
      {isMilestone && status === 'unlocked' ? (
        <Badge gold className="left-[23px] top-[-56px]" />
      ) : null}
      {current && pill ? (
        <span className="absolute left-0 top-[-102px] flex -translate-x-1/2 items-center gap-[6px] whitespace-nowrap rounded-full border border-[rgba(28,42,33,0.1)] bg-[#387440] py-[6px] pl-[14px] pr-[12px] font-sans text-[13px] font-semibold leading-[16px] text-white playful:border-[rgba(28,42,33,0.35)]">
          {pill}
          <ArrowRightIcon className="size-[14px] opacity-70" />
        </span>
      ) : null}
      <span className="absolute left-0 -translate-x-1/2" style={{ top: circle / 2 + 8 }}>
        <NodeLabel
          name={name}
          sub={sub}
          nameClass={isMilestone ? 'text-[#785910]' : 'text-[#1c2a21]'}
          subClass={
            status === 'done'
              ? 'text-[#387440]'
              : status === 'unlocked' || current
                ? 'text-[#785910]'
                : 'text-[#595959]'
          }
        />
      </span>
    </Wrapper>
  );
};

export default JourneyNode;
