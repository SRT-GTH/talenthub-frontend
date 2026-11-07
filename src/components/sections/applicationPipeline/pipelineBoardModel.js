/*
 * pipelineBoardModel.js — pure helpers over the pipeline `board` object (shape documented in pipelineBoardData.js).
 * Every function returns a NEW board and never mutates its input, so action scenarios can chain them:
 *   (board) => moveCard(board, 'ella-mensah', 'offer-extended', { footer: 'Offer extended today' })
 */

export const STAGE_IDS = [
  'applied',
  'screening',
  'shortlisted',
  'interview',
  'offer-extended',
  'hired',
  'not-progressed',
];

/** { card, stage, index } for a card id, or null. */
export const findCard = (board, cardId) => {
  for (const stage of board.stages) {
    const index = stage.cards.findIndex((card) => card.id === cardId);
    if (index !== -1) return { card: stage.cards[index], stage, index };
  }
  return null;
};

/** The id of the stage holding a card, or null. */
export const stageOf = (board, cardId) => findCard(board, cardId)?.stage.id ?? null;

/** Shallow-merge `patch` into a card. Unknown id: board unchanged. */
export const updateCard = (board, cardId, patch) => {
  if (!findCard(board, cardId)) return board;
  return {
    ...board,
    stages: board.stages.map((stage) => ({
      ...stage,
      cards: stage.cards.map((card) => (card.id === cardId ? { ...card, ...patch } : card)),
    })),
  };
};

/** Move a card to the end of another stage (optionally patching it) and adjust both counts. */
export const moveCard = (board, cardId, toStageId, patch = {}) => {
  const found = findCard(board, cardId);
  const target = board.stages.find((stage) => stage.id === toStageId);
  if (!found || !target) return board;
  if (found.stage.id === toStageId) return updateCard(board, cardId, patch);
  const moved = { ...found.card, ...patch };
  return {
    ...board,
    stages: board.stages.map((stage) => {
      if (stage.id === found.stage.id) {
        return {
          ...stage,
          count: Math.max(0, stage.count - 1),
          cards: stage.cards.filter((card) => card.id !== cardId),
        };
      }
      if (stage.id === toStageId) {
        return { ...stage, count: stage.count + 1, cards: [...stage.cards, moved] };
      }
      return stage;
    }),
  };
};

/** Display form of a stage count in a column header: "03", or "--" when empty. */
export const formatStageCount = (count) => (count > 0 ? String(count).padStart(2, '0') : '--');
