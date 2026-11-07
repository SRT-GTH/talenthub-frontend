import { findCard, moveCard } from '../pipelineBoardModel.js';
import { OFFER_SENT_CARD } from './pipelineActionData.js';

/*
 * pipelineActionScenarios.js — the board state drawn BEHIND each action frame, as pure `(board) => board` functions.
 * The board section applies `ACTION_SCENARIOS[?scenario]` to its base board (before filters), so a frame URL is `?scenario=<key>&…`.
 *
 *   key                      board state                                                         frames
 *   marcus-not-progressed    Marcus Thorne left Applied and sits first in "Not progressed"       PL-09 (with ?toast=not-progressed-sent&scroll=end)
 *   offer-sent-sarah         the above + Sarah Jenkins in "Offer extended" ("Offer sent …")      PL-11 PL-12 PL-13 PL-14 PL-16
 *
 * Figma inconsistencies kept as drawn: from PL-09 on the stage chips read Applied 3 / Screening 1 / Not progressed 2 while the columns hold 2 / 1 / 3 cards
 * and the column headers read Interview "03" and Offer extended "01" with 2 / 2 cards. `chipCount` (optional, filter-chip number only) carries the drawn chip value; `count` stays the header number.
 */

const withChipCounts = (board, chips) => ({
  ...board,
  stages: board.stages.map((stage) =>
    chips[stage.id] === undefined ? stage : { ...stage, chipCount: chips[stage.id] }
  ),
});

// Marcus Thorne, "Message sent", rejected 3 Oct (as drawn; the date is the card's own footer in Figma).
const marcusNotProgressed = (board) => {
  if (!findCard(board, 'marcus-thorne')) return board;
  const moved = moveCard(board, 'marcus-thorne', 'not-progressed', {
    qualified: false,
    badges: [{ id: 'message-sent', label: 'Message sent', tone: 'neutral', icon: 'check' }],
    footer: 'Rejected 3 Oct',
    criteria: null,
    primaryAction: null,
    tags: [],
  });
  // Marcus is drawn first in the column.
  const notProgressed = moved.stages.find((stage) => stage.id === 'not-progressed');
  const reordered = [
    ...notProgressed.cards.filter((card) => card.id === 'marcus-thorne'),
    ...notProgressed.cards.filter((card) => card.id !== 'marcus-thorne'),
  ];
  const withOrder = {
    ...moved,
    stages: moved.stages.map((stage) =>
      stage.id === 'not-progressed' ? { ...stage, cards: reordered } : stage
    ),
  };
  return withChipCounts(withOrder, { applied: 3, screening: 1, 'not-progressed': 2 });
};

// Sarah's interview card becomes a candidate card in "Offer extended". Header counts stay as drawn (Interview 03, Offer extended 01).
const offerSentSarah = (board) => {
  const base = marcusNotProgressed(board);
  if (!findCard(base, 'sarah-jenkins')) return base;
  return {
    ...base,
    stages: base.stages.map((stage) => {
      if (stage.id === 'interview') {
        return { ...stage, cards: stage.cards.filter((card) => card.id !== 'sarah-jenkins') };
      }
      if (stage.id === 'offer-extended') {
        return { ...stage, cards: [...stage.cards, OFFER_SENT_CARD] };
      }
      return stage;
    }),
  };
};

export const ACTION_SCENARIOS = {
  'marcus-not-progressed': marcusNotProgressed,
  'offer-sent-sarah': offerSentSarah,
};
