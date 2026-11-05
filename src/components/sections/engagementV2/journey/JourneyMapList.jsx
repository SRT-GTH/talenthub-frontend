import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { COPY } from './journeyData.js';
import { CheckIcon, DiamondIcon, EyeIcon, MarkerPinIcon, TrophyMonoIcon } from './JourneyIcons.jsx';
import { NodeLabel } from './JourneyNode.jsx';
import { stageIconFor } from './stageIcons.js';
import { nodePill, nodeSub } from './journeyText.js';

const log = debug('JourneyMapList');
const MS = { 1: EyeIcon, 2: TrophyMonoIcon, 3: DiamondIcon };
const MS_ROUTE = [
  '/profile/engagement/milestone',
  '/profile/engagement/milestone/top-20',
  '/profile/engagement/milestone/top-talent',
];
/* Which milestone closes each region (Discoverable ends TAMALE, Top 20% ends KUMASI, Top Talent ends ACCRA). */
const REGION_MILESTONE = { tamale: 'm1', kumasi: 'm2', accra: 'm3' };

const Row = ({ node, model }) => {
  const ms = node.kind === 'milestone';
  const Glyph = ms ? MS[node.n] : stageIconFor(node.id);
  const name = ms ? node.milestone.label : node.stage.label;
  const pill = nodePill(node, model);
  const to = ms ? (node.status === 'unlocked' ? MS_ROUTE[node.n - 1] : null) : node.stage.route;
  const circle = ms
    ? node.status === 'unlocked'
      ? 'rounded-[18px] border-[3px] border-[#c8951a] bg-[#faf4e8] text-[#785910]'
      : 'rounded-[18px] border-2 border-[#c8951a] bg-white text-[#785910]'
    : node.status === 'done'
      ? 'rounded-full border-[3px] border-white bg-[#387440] text-white'
      : node.status === 'current'
        ? 'rounded-full border-[3px] border-[#387440] bg-white text-[#387440]'
        : 'rounded-full border-2 border-[#d9dcd3] bg-white text-[#575755]';
  const Tag = to ? Link : 'div';
  return (
    <Tag
      {...(to ? { to, onClick: () => log('open', node.id) } : {})}
      className="relative flex min-h-[56px] items-center gap-[12px] no-underline"
    >
      <span
        className={classNames(
          'relative flex size-[52px] shrink-0 items-center justify-center shadow-[0_4px_10px_rgba(20,51,26,0.06)]',
          circle
        )}
      >
        <Glyph className={classNames('size-[24px]', node.id === 'pitch' && 'opacity-[0.45]')} />
        {node.status === 'done' || node.status === 'unlocked' ? (
          <span className="absolute -right-[4px] -top-[4px] flex size-[20px] items-center justify-center rounded-full border border-[#387440] bg-white text-[#387440]">
            <CheckIcon className="size-[12px]" />
          </span>
        ) : null}
      </span>
      <NodeLabel
        name={name}
        sub={nodeSub(node, model)}
        nameClass={ms ? 'text-[#785910]' : 'text-[#1c2a21]'}
        subClass={
          node.status === 'done'
            ? 'text-[#387440]'
            : node.status === 'unlocked' || node.status === 'current'
              ? 'text-[#785910]'
              : 'text-[#595959]'
        }
      />
      {pill ? (
        <span className="ml-auto rounded-full bg-[#387440] px-[12px] py-[6px] font-sans text-[12px] font-semibold text-white">
          {pill}
        </span>
      ) : null}
    </Tag>
  );
};

/* Phone layout of the road map (< lg): the same nodes as a vertical road, grouped by region. */
const JourneyMapList = ({ model }) => (
  <div className="flex flex-col gap-[16px] rounded-[20px] border border-[#e7e7e7] bg-white/70 p-[16px]">
    {model.regions.map((r) => {
      const rows = model.nodes.filter((n) =>
        n.kind === 'stage' ? r.stages.includes(n.id) : n.id === REGION_MILESTONE[r.id]
      );
      return (
        <section key={r.id} aria-label={r.name} className="flex flex-col gap-[8px]">
          <div className="flex flex-wrap items-center gap-[8px] rounded-full border border-[#e7e7e7] bg-white/[.92] py-[6px] pl-[10px] pr-[12px] font-sans">
            <MarkerPinIcon className="size-[16px] text-[#387440]" />
            <span className="text-[12px] font-bold tracking-[1.2px] text-[#387440]">{r.name}</span>
            <span className="whitespace-pre text-[13px] font-medium text-[#1c2a21]">
              {'·  '}
              {r.tag}
            </span>
            <span className="ml-auto rounded-full border border-[rgba(28,42,33,0.35)] bg-[#f1f1ee] px-[8px] py-[2px] text-[12px] font-semibold text-[#595959]">
              {r.count}/{r.size ?? 3}
            </span>
          </div>
          <div className="flex flex-col gap-[8px] border-l-[3px] border-dotted border-[#a9b8a6] pl-[12px]">
            {rows.map((n) => (
              <Row key={n.id} node={n} model={model} />
            ))}
          </div>
        </section>
      );
    })}
    <span className="font-sans text-[12px] font-semibold tracking-[2px] text-[#595959]">
      {COPY.gulf}
    </span>
  </div>
);

export default JourneyMapList;
