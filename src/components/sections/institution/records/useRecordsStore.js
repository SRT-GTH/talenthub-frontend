import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, listRecords } from '../../../../services/institutionPortal.api.js';

const log = debug('recordsStore');

/*
 * useRecordsQueue — the verification queue as GET /api/institution/records returns it for the current tab / chip / sort:
 * { items, counts: { pending, approved, rejected, all, chip: { all, results, certificates }, waitingLong, averageDays }, school }.
 * Returns { data, error, reload }; data is null while the first load runs.
 */
export const useRecordsQueue = ({ tab, filter, sort }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setError('');
    try {
      const res = await listRecords({ tab, filter, sort });
      log('loaded', { tab, filter, n: res?.items?.length });
      setData(res);
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [tab, filter, sort]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, reload };
};
