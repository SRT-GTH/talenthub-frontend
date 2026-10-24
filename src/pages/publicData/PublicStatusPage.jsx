import { useEffect } from 'react';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import StatusMessage from '../../components/sections/publicData/status/StatusMessage.jsx';
import { STATUS_PAGES } from '../../components/sections/publicData/status/data/statusData.js';
import { debug } from '../../utils/debug.js';

const log = debug('PublicStatusPage');

/*
 * PublicStatusPage — Figma 8.9.3b 404 (8508:353043), 8.9.3c 500 (8508:353122), 8.9.3d maintenance (8508:353197) on the real chrome.
 * kind = '404' | '500' | 'maintenance' (PublicDataApp.jsx: catch-all, /data/error, /data/maintenance). One <h1> (inside StatusMessage);
 * the top-bar title "National snapshot" is drawn in all three frames and is a <p>. Maintenance shows the "Paused for maintenance" pill label.
 * Maintenance actions open the existing digest / download dialogs (?modal=digest | download).
 */

const PublicStatusPage = ({ kind = '404' }) => {
  const data = usePublicDataState();
  const copy = STATUS_PAGES[kind] ?? STATUS_PAGES[404];

  useEffect(() => {
    log('mount', { kind });
    const previous = document.title;
    document.title = `${copy.title} · Ghana Talent Hub`;
    return () => {
      document.title = previous;
    };
  }, [kind, copy.title]);

  return (
    <PublicDataFrame
      data={data}
      title="National snapshot"
      freshness={
        copy.freshnessLabel
          ? { label: copy.freshnessLabel, tone: kind === 'maintenance' ? 'maintenance' : undefined }
          : undefined
      }
    >
      <StatusMessage
        kind={kind}
        onNotify={() => data.update({ modal: 'digest' })}
        onDownload={() => data.update({ modal: 'download' })}
      />
      <PublicDataModals data={data} scope={{ title: 'National snapshot' }} />
    </PublicDataFrame>
  );
};

export default PublicStatusPage;
