import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../utils/debug.js';
import CircleSwitch from './CircleSwitch.jsx';
import { useCirclePending } from './useCirclePending.js';

const log = debug('CommunitiesSwitchSlot');

/*
 * CommunitiesSwitchSlot — puts the "Communities | My circle" switch (+ the "Create a community" button) at the top of the
 * Communities view, as the flow section draws (step 2). The Communities page is not ours (demo page + the live page both render
 * the shared `BrowseHeader`), so this wrapper finds the page's header row (the row holding the <h1>) and inserts a host element
 * right before it; the switch is portaled into that host. A MutationObserver re-checks while the live page is still loading.
 * Props: children (the untouched Communities page), rail ('collapsed' keeps the rail in the switch links).
 * REQUEST (lead): replace this with a plain `<CircleSwitch active="communities" showCreate />` line in BrowseHeader's parent once the
 * shared Community files can be edited; nothing else depends on the slot.
 */
const CommunitiesSwitchSlot = ({ children, rail }) => {
  const rootRef = useRef(null);
  const [host, setHost] = useState(null);
  const pending = useCirclePending();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let created = null;
    const attach = () => {
      if (created?.isConnected) return;
      const title = root.querySelector('h1');
      const row = title?.parentElement?.parentElement?.parentElement;
      if (!row?.parentElement) return;
      created = document.createElement('div');
      created.setAttribute('data-circle-switch-host', '');
      row.parentElement.insertBefore(created, row);
      log('switch host attached');
      setHost(created);
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      created?.remove();
      setHost(null);
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
      {host &&
        createPortal(
          <CircleSwitch active="communities" count={pending} rail={rail} showCreate />,
          host
        )}
    </div>
  );
};

export default CommunitiesSwitchSlot;
