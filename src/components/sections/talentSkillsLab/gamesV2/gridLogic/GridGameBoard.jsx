import GameV2Shell from '../GameV2Shell.jsx';
import GridBoard from './GridBoard.jsx';
import GridFeedback from './GridFeedback.jsx';
import GridHead from './GridHead.jsx';
import GridPad from './GridPad.jsx';
import GridPlayArea from './GridPlayArea.jsx';

/*
 * GridGameBoard — the page of Grid Logic and Sum Grid, drawn from one prepared state `m` (the mock hooks in games/GridLogic.jsx /
 * games/SumGrid.jsx and the live hooks useGridLogicLive / useSumGridLive return the same shape):
 *   name, subtitle | subtitleLead, progress, footer, timeUp, onSeeResult
 *   head      { eyebrow, title, intro, clockLabel, showSaved, measures }
 *   size, cells, lines, focusIndex, onSelect, onKeyDown, focusedWeight?, ariaLabel, describe(i, cell)
 *   feedback  { tone, text } | null
 *   pad       { layout, notesOn, onDigit, onErase, onToggleNotes, hint }
 */
const GridGameBoard = ({ m }) => {
  const shellText = m.subtitle ? { subtitle: m.subtitle } : { subtitleLead: m.subtitleLead };
  return (
    <GameV2Shell
      name={m.name}
      {...shellText}
      progress={m.progress}
      footer={m.footer}
      timeUp={m.timeUp}
      onSeeResult={m.onSeeResult}
    >
      <GridHead
        eyebrow={m.head.eyebrow}
        title={m.head.title}
        intro={m.head.intro}
        clockLabel={m.head.clockLabel}
        showSaved={m.head.showSaved ?? true}
        measures={m.head.measures}
      />
      <GridPlayArea
        boardPx={m.pad.layout.boardPx}
        onKeyDown={m.onKeyDown}
        board={
          <GridBoard
            size={m.size}
            cells={m.cells}
            lines={m.lines}
            focusIndex={m.focusIndex}
            onSelect={m.onSelect}
            focusedWeight={m.focusedWeight ?? 'font-bold'}
            ariaLabel={m.ariaLabel}
            describe={m.describe}
          />
        }
        feedback={<GridFeedback feedback={m.feedback} />}
        pad={
          <GridPad
            size={m.size}
            layout={m.pad.layout}
            notesOn={m.pad.notesOn}
            onDigit={m.pad.onDigit}
            onErase={m.pad.onErase}
            onToggleNotes={m.pad.onToggleNotes}
            hint={m.pad.hint}
          />
        }
      />
    </GameV2Shell>
  );
};

export default GridGameBoard;
