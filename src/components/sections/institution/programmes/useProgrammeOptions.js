import { useCallback, useEffect, useState } from 'react';
import { apiMessage, programmeOptions } from '../../../../services/institutionPortal.api.js';

/*
 * useProgrammeOptions — GET /api/institution/programmes/options: the year groups (with roster counts) and programmes of study on the
 * school's roster, the "YOUR STUDENTS" figures, and the templates (built-in ones with how often the school used them, plus the school's own).
 * Returns { options, error, reload }; options is null while loading.
 */

const useProgrammeOptions = () => {
  const [options, setOptions] = useState(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setError('');
    try {
      setOptions(await programmeOptions());
    } catch (err) {
      setError(apiMessage(err));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { options, error, reload };
};

export default useProgrammeOptions;
