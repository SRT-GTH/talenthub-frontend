/* Chess pieces exported from Figma (Talent - Skills Lab, Games v2 · 10, board 9623:59059): the six drawn pieces (king, rook, pawn in black and white). Each svg is sized by its viewBox (stroke included); the board scales it from the 52px Figma square.
   ⚠️ ASSUMPTION: queen, bishop and knight are NOT drawn in Figma. The live games use the server's positions (full chess sets), so
   simple pieces in the same style (fill, #1C2A21 stroke 1.62, #CCCCCC detail on black) are drawn below until design supplies them. */

const INK = '#1C2A21';
const pieceFill = (black) => (black ? '#1A1A1A' : 'white');
const detail = (black) => (black ? '#CCCCCC' : INK);

const Queen = ({ black, className }) => (
  <svg viewBox="0 0 32 37" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M5 29L2 10.5L9.5 19L9 6.5L14 17L16 4.5L18 17L23 6.5L22.5 19L30 10.5L27 29Z"
      fill={pieceFill(black)}
      stroke={INK}
      strokeWidth="1.62"
      strokeLinejoin="round"
    />
    {[
      [2, 9],
      [9, 5],
      [16, 3],
      [23, 5],
      [30, 9],
    ].map(([cx, cy]) => (
      <circle
        key={cx}
        cx={cx}
        cy={cy}
        r="1.9"
        fill={pieceFill(black)}
        stroke={INK}
        strokeWidth="1.3"
      />
    ))}
    <path
      d="M4 29H28V33.5C28 34.9 26.9 36 25.5 36H6.5C5.1 36 4 34.9 4 33.5Z"
      fill={pieceFill(black)}
      stroke={INK}
      strokeWidth="1.62"
      strokeLinejoin="round"
    />
    <path d="M6.5 25H25.5" stroke={detail(black)} strokeWidth="1.62" strokeLinecap="round" />
  </svg>
);

const Bishop = ({ black, className }) => (
  <svg viewBox="0 0 28 37" fill="none" aria-hidden="true" focusable="false" className={className}>
    <circle cx="14" cy="3" r="2.2" fill={pieceFill(black)} stroke={INK} strokeWidth="1.3" />
    <path
      d="M14 5.5C8.5 10.5 6.2 15.5 7.8 20.2C8.8 23 11 24.4 14 24.4C17 24.4 19.2 23 20.2 20.2C21.8 15.5 19.5 10.5 14 5.5Z"
      fill={pieceFill(black)}
      stroke={INK}
      strokeWidth="1.62"
      strokeLinejoin="round"
    />
    <path d="M15.8 10.5L12 16.5" stroke={detail(black)} strokeWidth="1.62" strokeLinecap="round" />
    <path
      d="M8.5 24.4H19.5V27.8H8.5Z"
      fill={pieceFill(black)}
      stroke={INK}
      strokeWidth="1.62"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 32C9 28.6 19 28.6 24.5 32V35.8H3.5Z"
      fill={pieceFill(black)}
      stroke={INK}
      strokeWidth="1.62"
      strokeLinejoin="round"
    />
  </svg>
);

const Knight = ({ black, className }) => (
  <svg viewBox="0 0 30 37" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M8 35.5H27C27 25 26 15 20.5 8.5C18.5 6.3 16.5 5 14.5 2L13.2 5.8C10 7 7.2 10 5.2 14L2.8 19C2.4 21 4.6 22.6 6.8 21.4L10.2 19.4C11.2 20.4 12.6 20.4 13.6 19.2C11.4 23.4 8 27.6 8 35.5Z"
      fill={pieceFill(black)}
      stroke={INK}
      strokeWidth="1.62"
      strokeLinejoin="round"
    />
    <circle cx="12.6" cy="10.6" r="1.3" fill={detail(black)} />
    <path
      d="M17 9.5C20.5 14 22 20 22 27"
      stroke={detail(black)}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

export const PieceWhiteQueen = ({ className = '' }) => <Queen className={className} />;
export const PieceBlackQueen = ({ className = '' }) => <Queen black className={className} />;
export const PieceWhiteBishop = ({ className = '' }) => <Bishop className={className} />;
export const PieceBlackBishop = ({ className = '' }) => <Bishop black className={className} />;
export const PieceWhiteKnight = ({ className = '' }) => <Knight className={className} />;
export const PieceBlackKnight = ({ className = '' }) => <Knight black className={className} />;

export const PieceBlackKing = ({ className = '' }) => (
  <svg viewBox="0 0 32 38" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M12.7108 6.90385V0.813383"
      strokeWidth="1.62268"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
    <path
      d="M12.7117 21.3758C12.7117 21.3758 17.5797 13.2624 15.957 10.017C15.957 10.017 14.8752 7.31255 12.7117 7.31255C10.5481 7.31255 9.4663 10.017 9.4663 10.017C7.84362 13.2624 12.7117 21.3758 12.7117 21.3758Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1A1A1A"
      strokeWidth="1.62268"
      stroke="#1C2A21"
    />
    <path
      d="M0.811471 34.3523C6.7613 38.1385 17.5792 38.1385 23.529 34.3523V26.7798C23.529 26.7798 33.2651 21.9117 30.0197 15.421C25.6926 8.38939 15.4156 11.6348 12.7111 19.7482V12.7165C12.7111 12.7165 6.7613 8.93029 5.13862 11.6348C1.89326 15.9619 5.13862 19.7482 5.13862 19.7482V33.8114"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1A1A1A"
      strokeWidth="1.62268"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M10.0061 2.97714H15.4151"
      strokeWidth="1.62268"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
    <path
      d="M0.811471 26.7723C6.7613 23.527 17.5792 23.527 23.529 26.7723M0.811471 30.5586C6.7613 27.3132 17.5792 27.3132 23.529 30.5586M0.811471 34.3449C6.7613 31.0995 17.5792 31.0995 23.529 34.3449"
      strokeWidth="1.62268"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#CCCCCC"
    />
  </svg>
);

export const PieceBlackRook = ({ className = '' }) => (
  <svg viewBox="0 0 31 34" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M0.809556 33.1936H29.9533V29.9554H0.809556V33.1936ZM4.04775 29.9554V25.6378H26.7151V29.9554H4.04775ZM2.96835 6.20858V0.811587H7.28595V2.97039H12.6829V0.811587H18.0799V2.97039H23.4769V0.811587H27.7945V6.20858"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1A1A1A"
    />
    <path
      d="M2.96835 6.20858V0.811587H7.28595V2.97039H12.6829V0.811587H18.0799V2.97039H23.4769V0.811587H27.7945V6.20858M0.809556 33.1936H29.9533V29.9554H0.809556V33.1936ZM4.04775 29.9554V25.6378H26.7151V29.9554H4.04775Z"
      strokeWidth="1.6191"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M27.7948 6.20904L24.5566 9.44724H6.20686L2.96866 6.20904"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1A1A1A"
      strokeWidth="1.6191"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M24.5559 9.44751V22.94H6.20608V9.44751"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1A1A1A"
      strokeWidth="1.6191"
      stroke="#1C2A21"
    />
    <path
      d="M24.5562 22.9451L26.1753 25.6436H4.58734L6.20644 22.9451"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#1A1A1A"
      strokeWidth="1.6191"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M2.96866 6.20904H27.7948"
      strokeWidth="1.6191"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const PieceBlackPawn = ({ className = '' }) => (
  <svg viewBox="0 0 27 35" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M13.3973 0.822308C10.9803 0.822308 9.02268 2.77996 9.02268 5.19694C9.02268 6.1703 9.33985 7.0671 9.87574 7.79985C7.7431 9.02474 6.28854 11.3105 6.28854 13.9462C6.28854 16.1663 7.31658 18.1459 8.92425 19.4473C5.64328 20.6066 0.82025 25.5171 0.82025 34.1789H25.9744C25.9744 25.5171 21.1513 20.6066 17.8704 19.4473C19.4781 18.1459 20.5061 16.1663 20.5061 13.9462C20.5061 11.3105 19.0515 9.02474 16.9189 7.79985C17.4548 7.0671 17.7719 6.1703 17.7719 5.19694C17.7719 2.77996 15.8143 0.822308 13.3973 0.822308Z"
      fill="#0F1712"
      strokeWidth="1.64049"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const PieceWhiteKing = ({ className = '' }) => (
  <svg viewBox="0 0 32 38" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M12.7134 6.90528V0.813552"
      strokeWidth="1.62302"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
    <path
      d="M12.7134 21.3723C12.7134 21.3723 17.5825 13.2572 15.9595 10.0112C15.9595 10.0112 14.8775 7.30617 12.7134 7.30617C10.5494 7.30617 9.4674 10.0112 9.4674 10.0112C7.84438 13.2572 12.7134 21.3723 12.7134 21.3723Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
      strokeWidth="1.62302"
      stroke="#1C2A21"
    />
    <path
      d="M0.811639 34.3515C6.76271 38.1386 17.5828 38.1386 23.5339 34.3515V26.7774C23.5339 26.7774 33.272 21.9084 30.026 15.4163C25.6979 8.38324 15.4188 11.6293 12.7138 19.7444V12.7113C12.7138 12.7113 6.76271 8.92425 5.13969 11.6293C1.89365 15.9573 5.13969 19.7444 5.13969 19.7444V33.8105"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
      strokeWidth="1.62302"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M10.009 2.96986H15.4191"
      strokeWidth="1.62302"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
    <path
      d="M0.811639 26.7779C6.76271 23.5319 17.5828 23.5319 23.5339 26.7779M0.811639 30.5649C6.76271 27.3189 17.5828 27.3189 23.5339 30.5649M0.811639 34.352C6.76271 31.106 17.5828 31.106 23.5339 34.352"
      strokeWidth="1.62302"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const PieceWhiteRook = ({ className = '' }) => (
  <svg viewBox="0 0 31 34" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M0.809556 33.1936H29.9533V29.9554H0.809556V33.1936ZM4.04775 29.9554V25.6378H26.7151V29.9554H4.04775ZM2.96835 6.20858V0.811587H7.28595V2.97039H12.6829V0.811587H18.0799V2.97039H23.4769V0.811587H27.7945V6.20858"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
    />
    <path
      d="M2.96835 6.20858V0.811587H7.28595V2.97039H12.6829V0.811587H18.0799V2.97039H23.4769V0.811587H27.7945V6.20858M0.809556 33.1936H29.9533V29.9554H0.809556V33.1936ZM4.04775 29.9554V25.6378H26.7151V29.9554H4.04775Z"
      strokeWidth="1.6191"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M27.7948 6.20904L24.5566 9.44724H6.20686L2.96866 6.20904"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
      strokeWidth="1.6191"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M24.5559 9.44751V22.94H6.20608V9.44751"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
      strokeWidth="1.6191"
      stroke="#1C2A21"
    />
    <path
      d="M24.5562 22.9451L26.1753 25.6436H4.58734L6.20644 22.9451"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="white"
      strokeWidth="1.6191"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#1C2A21"
    />
    <path
      d="M2.96866 6.20904H27.7948"
      strokeWidth="1.6191"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
  </svg>
);

export const PieceWhitePawn = ({ className = '' }) => (
  <svg viewBox="0 0 27 35" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M13.3973 0.822308C10.9803 0.822308 9.02268 2.77996 9.02268 5.19694C9.02268 6.1703 9.33985 7.0671 9.87574 7.79985C7.7431 9.02474 6.28854 11.3105 6.28854 13.9462C6.28854 16.1663 7.31658 18.1459 8.92425 19.4473C5.64328 20.6066 0.82025 25.5171 0.82025 34.1789H25.9744C25.9744 25.5171 21.1513 20.6066 17.8704 19.4473C19.4781 18.1459 20.5061 16.1663 20.5061 13.9462C20.5061 11.3105 19.0515 9.02474 16.9189 7.79985C17.4548 7.0671 17.7719 6.1703 17.7719 5.19694C17.7719 2.77996 15.8143 0.822308 13.3973 0.822308Z"
      fill="white"
      strokeWidth="1.64049"
      strokeLinecap="round"
      stroke="#1C2A21"
    />
  </svg>
);
