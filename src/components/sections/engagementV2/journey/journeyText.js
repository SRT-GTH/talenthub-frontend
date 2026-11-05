/* Status lines for the journey map nodes (copy patterns from Figma J-01 / J-04 / J-05). */
export const nodeSub = (node, model) => {
  if (node.kind === 'milestone') {
    return node.status === 'unlocked'
      ? `Milestone ${node.n} · unlocked`
      : `Milestone ${node.n} · at ${node.milestone.at} stages`;
  }
  if (node.status === 'done') return 'Done';
  if (node.status === 'current') {
    return model.progress
      ? `In progress · ~${model.progress.minutesLeft} min left`
      : node.copy?.eta
        ? `Up next · ~${node.copy.eta} min`
        : 'Up next'; // Avatar has no eta (live: "Up next · ~undefined min")
  }
  return node.copy?.eta ? `Stage ${node.stage.n} · ~${node.copy.eta} min` : `Stage ${node.stage.n}`;
};

export const nodePill = (node, model) => {
  if (node.status !== 'current') return null;
  return model.progress ? 'Continue' : 'Start here';
};
