/*
 * gridKeys — keyboard play for both grids: arrows move the selected square, 1…N enters (or pencils) a digit,
 * Backspace / Delete / 0 erases, N toggles Notes. Returns an onKeyDown for the board group.
 */
export const makeGridKeyHandler = ({ digitMax, move, onDigit, onErase, onToggleNotes }) => {
  const arrows = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
  };
  return (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const arrow = arrows[event.key];
    if (arrow) {
      event.preventDefault();
      move(arrow[0], arrow[1]);
      return;
    }
    if (/^[1-9]$/.test(event.key) && Number(event.key) <= digitMax) {
      event.preventDefault();
      onDigit(Number(event.key));
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
      event.preventDefault();
      onErase();
      return;
    }
    if (event.key === 'n' || event.key === 'N') {
      event.preventDefault();
      onToggleNotes();
    }
  };
};
