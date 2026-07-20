import { Chessboard } from 'react-chessboard';
import { debug } from '../../../utils/debug.js';

const log = debug('ChessBoardMini');

const LEGEND_COLORS = {
  '#1E4D2B': 'bg-[#1E4D2B]',
  '#ff6b6b': 'bg-[#ff6b6b]',
};

const COORD_GRADIENT_STYLE = {
  backgroundImage: 'linear-gradient(235.788deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontFamily: "'DM Mono', monospace",
};

export default function ChessBoardMini({ fen, highlightedSquares = {}, legends = [] }) {
  log('rendering mini board, fen:', fen?.slice(0, 20));

  const customSquareStyles = {};
  for (const [square, color] of Object.entries(highlightedSquares)) {
    customSquareStyles[square] = {
      backgroundColor: color,
      opacity: 0.7,
    };
  }

  return (
    <div className="flex flex-col items-center gap-[10px]">
      <div
        className="rounded-[3px]"
        style={{
          backgroundImage: 'linear-gradient(134.091deg, rgb(20, 41, 22) 0%, rgb(42, 87, 48) 100%)',
          boxShadow:
            'inset 0px 2px 8px 0px rgba(0,0,0,0.6), inset 0px -1px 3px 0px rgba(0,0,0,0.4)',
        }}
      >
        {/* Row: rank numbers + board */}
        <div className="flex">
          {/* Rank numbers — in the left padding */}
          <div
            className="flex flex-col justify-around shrink-0"
            style={{ width: '14px', paddingTop: '3px', paddingBottom: '3px' }}
          >
            {[8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
              <span
                key={n}
                className="bg-clip-text text-[transparent] text-[9px] font-medium leading-none text-center"
                style={COORD_GRADIENT_STYLE}
              >
                {n}
              </span>
            ))}
          </div>

          {/* Board with inner border */}
          <div
            className="flex-1"
            style={{
              border: '1px solid rgba(0,0,0,0.6)',
              boxShadow:
                'inset 0px 0px 40px 1px rgba(0,0,0,0.15), inset 0px 0px 0px 2px rgba(255,255,255,0.04)',
              marginTop: '3px',
              marginRight: '3px',
            }}
          >
            <Chessboard
              options={{
                position: fen,
                arePiecesDraggable: false,
                darkSquareStyle: {
                  backgroundImage:
                    'linear-gradient(135deg, rgb(20, 41, 22) 0%, rgb(42, 87, 48) 100%)',
                },
                lightSquareStyle: {
                  backgroundImage:
                    'linear-gradient(160deg, rgb(242, 217, 160) 0%, rgb(232, 201, 122) 40%, rgb(212, 181, 90) 100%)',
                },
                squareStyles: customSquareStyles,
                boardStyle: { borderRadius: '0px' },
                showNotation: false,
              }}
            />
          </div>
        </div>

        {/* File letters — in the bottom padding */}
        <div
          className="flex h-[14px] items-center"
          style={{ paddingLeft: '14px', paddingRight: '3px' }}
        >
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((l) => (
            <span
              key={l}
              className="bg-clip-text text-[transparent] text-[9px] font-medium leading-none text-center flex-1"
              style={COORD_GRADIENT_STYLE}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
      {legends.length > 0 && (
        <div className="flex items-center gap-[16px] flex-wrap justify-center">
          {legends.map((legend, i) => (
            <div key={i} className="flex items-center gap-[4px]">
              <div
                className={`size-[10px] rounded-full ${LEGEND_COLORS[legend.color] || ''}`}
                style={!LEGEND_COLORS[legend.color] ? { backgroundColor: legend.color } : undefined}
              />
              <span className="text-[#575755] text-[10px] font-sans leading-normal">
                {legend.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
