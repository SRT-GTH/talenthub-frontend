import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('useCandidateProfileState');

/*
 * useCandidateProfileState — the candidate profile's state lives in the URL query string (reload, deep link and Back all work).
 * Keys (see the header of TalentCandidateProfileSection.jsx for the Figma frame each one reproduces):
 *   job=<jobId>           which job the match card shows
 *   modal=invite|pipeline the open dialog
 *   menu=save|more        the open popover
 *   invited=<jobId>       an invite to that job was sent
 *   saved=<listId>        the candidate sits in that list
 *   pipeline=<stageId>    the candidate was added to the pipeline at that stage
 *   toast=invite-sent|saved|pipeline-added   the status toast showing
 * `set(changes, { push })`: a null / '' value removes the key; `push` adds a history entry (opening a dialog), otherwise the entry is replaced.
 */
const useCandidateProfileState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = useCallback((key) => searchParams.get(key) ?? '', [searchParams]);

  const set = useCallback(
    (changes, { push = false } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) next.delete(key);
        else next.set(key, value);
      });
      log('set', changes, push ? '(push)' : '(replace)');
      setSearchParams(next, { replace: !push });
    },
    [searchParams, setSearchParams]
  );

  return { get, set };
};

export default useCandidateProfileState;
