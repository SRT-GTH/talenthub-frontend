import { useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import { communityHref, useCommunityVariant } from '../communityVariant.js';
import {
  buildGenericProfile,
  CIRCLE_COPY,
  CIRCLE_PEOPLE,
  CIRCLE_SUMMARY,
  CONNECTIONS_RESPONSE,
  DISCOVER_RESPONSE,
  EMPTY_RESPONSE,
  FEED_RESPONSE,
  INVITATIONS_RESPONSE,
  MINOR_RESPONSE,
  PROFILE_RESPONSE,
} from './circleData.js';
import { HIRING_ASSISTANT_AVATAR, NETWORK_PERSON_PHOTOS } from './recruiterCirclePhotos.js';
import { BUDDY_AVATAR, PERSON_PHOTOS } from './circlePhotos.js';
import {
  buildNetworkGenericProfile,
  NETWORK_CONNECTIONS,
  NETWORK_COPY,
  NETWORK_DISCOVER,
  NETWORK_EMPTY,
  NETWORK_FEED,
  NETWORK_INVITATIONS,
  NETWORK_MINOR,
  NETWORK_PEOPLE,
  NETWORK_PROFILE,
  NETWORK_SUMMARY,
} from './recruiterCircleData.js';

const log = debug('useCircleVariantData');

/*
 * useCircleVariantData — the My circle (talent) / My network (recruiter) screens are the SAME components; this hook hands them the
 * data, copy, photos and links of the audience read from the URL (`/recruiter/community…` = recruiter, see communityVariant.js).
 * Talent values are the untouched circleData.js exports, so talent screens render exactly as before.
 * Small hooks below return one slice each so a leaf component asks only for what it draws.
 */
const TALENT = {
  isRecruiter: false,
  base: '/community',
  copy: CIRCLE_COPY,
  people: CIRCLE_PEOPLE,
  summary: CIRCLE_SUMMARY,
  discover: DISCOVER_RESPONSE,
  invitations: INVITATIONS_RESPONSE,
  connections: CONNECTIONS_RESPONSE,
  profiles: PROFILE_RESPONSE,
  buildProfile: buildGenericProfile,
  feed: FEED_RESPONSE,
  minor: MINOR_RESPONSE,
  empty: EMPTY_RESPONSE,
  photos: PERSON_PHOTOS,
  assistantAvatar: BUDDY_AVATAR,
};

const RECRUITER = {
  isRecruiter: true,
  base: '/recruiter/community',
  copy: NETWORK_COPY,
  people: NETWORK_PEOPLE,
  summary: NETWORK_SUMMARY,
  discover: NETWORK_DISCOVER,
  invitations: NETWORK_INVITATIONS,
  connections: NETWORK_CONNECTIONS,
  profiles: NETWORK_PROFILE,
  buildProfile: buildNetworkGenericProfile,
  feed: NETWORK_FEED,
  minor: NETWORK_MINOR,
  empty: NETWORK_EMPTY,
  photos: NETWORK_PERSON_PHOTOS,
  assistantAvatar: HIRING_ASSISTANT_AVATAR,
};

export const useCircleVariantData = () => {
  const { isRecruiter } = useCommunityVariant();
  return useMemo(() => {
    log('variant', isRecruiter ? 'recruiter' : 'talent');
    return isRecruiter ? RECRUITER : TALENT;
  }, [isRecruiter]);
};

export const useCircleCopy = () => useCircleVariantData().copy;
export const useCirclePhotos = () => useCircleVariantData().photos;

/* Links that stay inside the audience's Community: `{ communityHref, circleHref, createHref, personHref(id) }`. */
export const useCircleLinks = () => {
  const { base, isRecruiter } = useCircleVariantData();
  return useMemo(
    () => ({
      base,
      isRecruiter,
      messagesHref: isRecruiter ? '/recruiter/messages' : '/messages',
      communityHref: base,
      circleHref: communityHref(base, '?view=circle'),
      createHref: communityHref(base, '/create'),
      personHref: (id) => communityHref(base, `/people/${id}`),
    }),
    [base, isRecruiter]
  );
};

/*
 * The two-column page body (content + 280-420px right rail). Talent splits at lg (its shell collapses to the icon rail there); the
 * recruiter shell keeps the 264px profile-card sidebar until xl, so its right rail drops below the content until 1280px.
 */
export const useCircleSplitGrid = () => {
  const { isRecruiter } = useCircleVariantData();
  return isRecruiter
    ? 'grid grid-cols-1 items-start gap-[28px] xl:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]'
    : 'grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]';
};
