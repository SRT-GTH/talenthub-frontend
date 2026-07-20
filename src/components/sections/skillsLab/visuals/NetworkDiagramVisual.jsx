import { debug } from '../../../../utils/debug.js';

const log = debug('NetworkDiagramVisual');

const NODE_COLORS = {
  A: '#387440',
  B: '#3062d4',
  C: '#c8951a',
  D: '#c8951a',
  E: '#575755',
};

export default function NetworkDiagramVisual({ visual }) {
  log('rendering network diagram, nodes:', visual.nodes?.length);

  const { nodes, edges } = visual;

  const svgWidth = 760;
  const svgHeight = 320;

  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = n;
  });

  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[12px] p-[clamp(16px,2vw,24px)] mb-[clamp(14px,1.8vw,26px)]">
      <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[12px]">
        Project Network Diagram
      </p>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: '280px' }}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;

          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={NODE_COLORS[edge.from] || '#959592'}
                strokeWidth="2"
                opacity="0.5"
              />
              {/* Arrow head */}
              <circle
                cx={to.x - (to.x - from.x) * 0.15}
                cy={to.y - (to.y - from.y) * 0.15}
                r="3"
                fill={NODE_COLORS[edge.from] || '#959592'}
                opacity="0.7"
              />
              {edge.label && (
                <text
                  x={midX}
                  y={midY - 8}
                  textAnchor="middle"
                  fill={NODE_COLORS[edge.from] || '#959592'}
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const color = NODE_COLORS[node.id] || '#575755';
          return (
            <g key={node.id}>
              <rect
                x={node.x - 55}
                y={node.y - 22}
                width="110"
                height="44"
                rx="8"
                fill={color}
                opacity="0.12"
                stroke={color}
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill={color}
                fontSize="14"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
