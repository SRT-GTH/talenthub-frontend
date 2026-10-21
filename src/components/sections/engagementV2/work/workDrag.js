import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('workDrag');

/* Native drag-and-drop reorder for the role cards; returns (id) => props for the card. */
export const useDragReorder = (items, onReorder) => {
  const [dragId, setDragId] = useState(null);
  return (id) => ({
    draggable: true,
    onDragStart: (e) => {
      log('drag start', id);
      setDragId(id);
      e.dataTransfer.effectAllowed = 'move';
    },
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => {
      e.preventDefault();
      if (dragId && dragId !== id) {
        const from = items.findIndex((r) => r.id === dragId);
        const to = items.findIndex((r) => r.id === id);
        log('drop', { from, to });
        onReorder(from, to);
      }
      setDragId(null);
    },
    onDragEnd: () => setDragId(null),
  });
};
