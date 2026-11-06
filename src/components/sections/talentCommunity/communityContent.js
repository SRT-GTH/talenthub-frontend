import { useMemo } from 'react';
import { useCommunityVariant } from './communityVariant.js';
import {
  COMMUNITIES_RESPONSE,
  COMMUNITY_BROWSE_COPY,
  COMMUNITY_DETAILS,
  COMMUNITY_DETAIL_ALIASES,
  COMMUNITY_PAGE_COPY,
  CREATE_POST,
  LEAVE_COMMUNITY,
  MILESTONE_SHARE,
  PENDING_POST,
  POST_DETAIL,
  REPORT_POST,
  buildFallbackDetail,
} from './communityData.js';
import {
  RECRUITER_CLUBS_BROWSE_COPY,
  RECRUITER_CLUBS_CATALOGUE,
  RECRUITER_CLUBS_CREATE_POST,
  RECRUITER_CLUBS_DETAILS,
  RECRUITER_CLUBS_LEAVE,
  RECRUITER_CLUBS_MILESTONE,
  RECRUITER_CLUBS_PAGE_COPY,
  RECRUITER_CLUBS_PENDING_POST,
  RECRUITER_CLUBS_POST_DETAIL,
  RECRUITER_CLUBS_REPORT_POST,
  buildRecruiterFallbackDetail,
} from './recruiterCommunityData.js';

/*
 * communityContent — the copy + mock data the Community screens render, chosen by the URL variant (communityVariant.js):
 * talent = communityData.js (unchanged), recruiter = recruiterCommunityData.js ("clubs"). Same shapes in both, so a component
 * reads `const { pageCopy } = useCommunityContent()` and never branches on the audience itself.
 *   isRecruiter  true on /recruiter/community…
 *   base         '/community' | '/recruiter/community' (build links with communityHref(base, rest))
 *   browseCopy · catalogue · pageCopy · details · createPost · reportPost · leave · milestone · pendingPost · postDetail
 *   getClub(id)  catalogue entry or null        resolveDetail(id)  { canonicalId, detail } for the page / post routes
 * `noun` / `Noun` = "community" / "club" for the few sentences assembled in code.
 */
const TALENT_CONTENT = {
  isRecruiter: false,
  noun: 'community',
  browseCopy: COMMUNITY_BROWSE_COPY,
  catalogue: COMMUNITIES_RESPONSE,
  pageCopy: COMMUNITY_PAGE_COPY,
  details: COMMUNITY_DETAILS,
  buildFallbackDetail,
  createPost: CREATE_POST,
  reportPost: REPORT_POST,
  leave: LEAVE_COMMUNITY,
  milestone: MILESTONE_SHARE,
  pendingPost: PENDING_POST,
  postDetail: POST_DETAIL,
  meName: 'Kofi Agyekum',
};

const RECRUITER_CONTENT = {
  isRecruiter: true,
  noun: 'club',
  browseCopy: RECRUITER_CLUBS_BROWSE_COPY,
  catalogue: RECRUITER_CLUBS_CATALOGUE,
  pageCopy: RECRUITER_CLUBS_PAGE_COPY,
  details: RECRUITER_CLUBS_DETAILS,
  buildFallbackDetail: buildRecruiterFallbackDetail,
  createPost: RECRUITER_CLUBS_CREATE_POST,
  reportPost: RECRUITER_CLUBS_REPORT_POST,
  leave: RECRUITER_CLUBS_LEAVE,
  milestone: RECRUITER_CLUBS_MILESTONE,
  pendingPost: RECRUITER_CLUBS_PENDING_POST,
  postDetail: RECRUITER_CLUBS_POST_DETAIL,
  meName: RECRUITER_CLUBS_POST_DETAIL.meName,
};

export const getCommunityContent = (isRecruiter) => {
  const content = isRecruiter ? RECRUITER_CONTENT : TALENT_CONTENT;
  const getClub = (id) => content.catalogue.communities.find((club) => club.id === id) ?? null;
  const resolveDetail = (id) => {
    const canonicalId = COMMUNITY_DETAIL_ALIASES[id] ?? id;
    const entry = getClub(canonicalId);
    const detail =
      content.details[canonicalId] ?? (entry ? content.buildFallbackDetail(entry) : null);
    return { canonicalId, entry, detail };
  };
  return { ...content, getClub, resolveDetail };
};

const TALENT = getCommunityContent(false);
const RECRUITER = getCommunityContent(true);

export const useCommunityContent = () => {
  const { isRecruiter, base } = useCommunityVariant();
  return useMemo(() => ({ ...(isRecruiter ? RECRUITER : TALENT), base }), [isRecruiter, base]);
};
