import { useLocation } from 'react-router-dom';

/*
 * communityVariant — the same Community / Create / My circle pages serve two audiences (Figma "Recruiter - Community Engagement"
 * 10026:36840 is "converted 1:1 from talent"): a talent at `/community…`, a recruiter at `/recruiter/community…` (the recruiter
 * dashboard shell, recruiter copy and data, mock only). The variant is read from the URL, so a frame reproduces from a fresh load.
 *
 *   const { isRecruiter, base } = useCommunityVariant();
 *   navigate(communityHref(base, '/frontend-devs-ghana?joined=1'));   // -> /recruiter/community/frontend-devs-ghana?joined=1
 */
export const TALENT_COMMUNITY_BASE = '/community';
export const RECRUITER_COMMUNITY_BASE = '/recruiter/community';

/** Pure: is this pathname a recruiter community screen? */
export const isRecruiterCommunityPath = (pathname = '') =>
  pathname === RECRUITER_COMMUNITY_BASE || pathname.startsWith(`${RECRUITER_COMMUNITY_BASE}/`);

/** `base` + a path that starts with '/' or '?' (or is empty): `communityHref('/recruiter/community', '?view=all')`. */
export const communityHref = (base, rest = '') => `${base}${rest}`;

/** `/community…` or `/recruiter/community…` for the page being shown (read when called: links and navigate()). */
export const communityPath = (rest = '') =>
  communityHref(
    typeof window !== 'undefined' && isRecruiterCommunityPath(window.location.pathname)
      ? RECRUITER_COMMUNITY_BASE
      : TALENT_COMMUNITY_BASE,
    rest
  );

export const useCommunityVariant = () => {
  const { pathname } = useLocation();
  const isRecruiter = isRecruiterCommunityPath(pathname);
  return { isRecruiter, base: isRecruiter ? RECRUITER_COMMUNITY_BASE : TALENT_COMMUNITY_BASE };
};
