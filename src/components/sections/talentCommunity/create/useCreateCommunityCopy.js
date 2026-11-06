import { useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import { useCommunityVariant } from '../communityVariant.js';
import {
  ARCHIVE_COPY,
  CREATE_COPY,
  INVITE_COPY,
  MANAGE_COPY,
  MENTOR_COPY,
  OWNER_COPY,
  OWNER_STATUS_COPY,
  TRANSFER_COPY,
} from './createCommunityData.js';
import {
  RECRUITER_ARCHIVE_COPY,
  RECRUITER_CREATE_COPY,
  RECRUITER_INVITE_COPY,
  RECRUITER_MANAGE_COPY,
  RECRUITER_MENTOR_COPY,
  RECRUITER_OWNER_COPY,
  RECRUITER_OWNER_STATUS_COPY,
  RECRUITER_TRANSFER_COPY,
} from './recruiterCreateCommunityData.js';

const log = debug('useCreateCommunityCopy');

const TALENT = {
  CREATE_COPY,
  OWNER_STATUS_COPY,
  OWNER_COPY,
  INVITE_COPY,
  MENTOR_COPY,
  MANAGE_COPY,
  TRANSFER_COPY,
  ARCHIVE_COPY,
};
const RECRUITER = {
  CREATE_COPY: RECRUITER_CREATE_COPY,
  OWNER_STATUS_COPY: RECRUITER_OWNER_STATUS_COPY,
  OWNER_COPY: RECRUITER_OWNER_COPY,
  INVITE_COPY: RECRUITER_INVITE_COPY,
  MENTOR_COPY: RECRUITER_MENTOR_COPY,
  MANAGE_COPY: RECRUITER_MANAGE_COPY,
  TRANSFER_COPY: RECRUITER_TRANSFER_COPY,
  ARCHIVE_COPY: RECRUITER_ARCHIVE_COPY,
};

/*
 * useCreateCommunityCopy — the copy blocks of the create wizard / owner page for the audience in the URL: `/community…` = the
 * talent blocks (createCommunityData.js, unchanged), `/recruiter/community…` = the recruiter "Host a company club" blocks.
 * Returns { CREATE_COPY, OWNER_STATUS_COPY, OWNER_COPY, INVITE_COPY, MENTOR_COPY, MANAGE_COPY, TRANSFER_COPY, ARCHIVE_COPY,
 * isRecruiter, base } — `base` is the route prefix every link of these screens must use.
 */
export const useCreateCommunityCopy = () => {
  const { isRecruiter, base } = useCommunityVariant();
  return useMemo(() => {
    log('variant', isRecruiter ? 'recruiter' : 'talent');
    return { ...(isRecruiter ? RECRUITER : TALENT), isRecruiter, base };
  }, [isRecruiter, base]);
};
