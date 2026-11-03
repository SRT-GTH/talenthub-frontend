import { useCallback, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('useCallOrder');

/*
 * useCallOrder — the "Who do you call first?" order editing shared by the mock and the live Crisis Room: tap to add / remove,
 * move up / down. `calls` = how many people get a number, `people` = [{ id, name }], `say(text)` = the screen-reader line.
 */
export const useCallOrder = ({ initial = [], calls, people, locked, say }) => {
  const [order, setOrder] = useState(initial);

  const toggle = useCallback(
    (id) => {
      if (locked) return;
      setOrder((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= calls) {
          log('order full', { calls });
          say(`You can call ${calls} people. Take one out first.`);
          return prev;
        }
        return [...prev, id];
      });
    },
    [locked, calls, say]
  );

  const move = useCallback(
    (id, dir) => {
      if (locked) return;
      setOrder((prev) => {
        const at = prev.indexOf(id);
        const to = at + dir;
        if (at < 0 || to < 0 || to >= prev.length) return prev;
        const next = [...prev];
        [next[at], next[to]] = [next[to], next[at]];
        log('reorder', next);
        const name = people.find((p) => p.id === id)?.name ?? id;
        say(`${name} is now number ${to + 1}.`);
        return next;
      });
    },
    [locked, people, say]
  );

  /** ordered people first, then the rest: [{ person, position, last }] */
  const rows = [
    ...order.map((id) => people.find((p) => p.id === id)).filter(Boolean),
    ...people.filter((p) => !order.includes(p.id)),
  ].map((person) => {
    const position = order.indexOf(person.id);
    return { person, position, last: position === order.length - 1 };
  });

  return { order, setOrder, toggle, move, rows };
};
