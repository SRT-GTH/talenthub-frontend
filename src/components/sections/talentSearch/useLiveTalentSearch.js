import { useEffect, useState } from 'react';
import api from '../../../services/api.js';
import { isRecruiterSession } from '../../../services/recruiterShell.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('useLiveTalentSearch');

/*
 * useLiveTalentSearch({ query, tabId, sortId }) - the signed-in recruiter's talent search
 * (POST /search/talents -> backend search.searchTalents on the Meilisearch talent index, adults only,
 * contact details never included). Signed out -> { status: 'demo' } and the page keeps its Figma people.
 *
 * Mapping to the card (CandidateCard): there is no per-job match score yet, so `matchPercent` is null and
 * the card shows profile completion instead; the "explanation" box shows the talent's own summary.
 */

const SORT = {
  'best-match': { sortBy: 'relevance' },
  'recently-active': { sortBy: 'lastActive', sortOrder: 'desc' },
  'open-to-work-first': { sortBy: 'relevance' },
  'assessment-score': { sortBy: 'profileCompletion', sortOrder: 'desc' },
  'available-soonest': { sortBy: 'relevance' },
};

const AVAILABILITY = {
  available: 'Available now',
  open_to_offers: 'Open to offers',
  not_available: 'Not looking right now',
};

const summaryOf = (t) => {
  if (t.bio) return t.bio;
  const study = [t.fieldOfStudy || t.educationLevel, t.institution].filter(Boolean).join(' at ');
  const parts = [
    study ? `Studies ${study}.` : '',
    t.careers?.length ? `Interested in ${t.careers.slice(0, 3).join(', ')}.` : '',
    t.location?.city || t.location?.region
      ? `Based in ${t.location.city || t.location.region}.`
      : '',
  ].filter(Boolean);
  return parts.join(' ') || 'This talent hasn’t written a summary yet.';
};

export const toCandidate = (hit) => {
  const t = hit?.data || hit || {};
  const skills = t.skills || [];
  return {
    id: String(t.id || hit?._id),
    entityId: t.entityId,
    live: true,
    name: t.fullName || 'Talent',
    initials: (t.fullName || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
    photo: t.profilePhoto || null,
    role:
      t.headline ||
      [t.fieldOfStudy || t.educationLevel, t.institution].filter(Boolean).join(' · ') ||
      'GTH talent',
    matchPercent: null,
    completion: typeof t.profileCompletion === 'number' ? Math.round(t.profileCompletion) : 0,
    tags: [
      ...new Set([...(t.careers || []), t.location?.city || t.location?.region].filter(Boolean)),
    ].slice(0, 3),
    explanationTitle: 'Summary',
    explanation: summaryOf(t),
    explanationTint: '#f3f8f4',
    topSkills: skills.length > 3 ? [...skills.slice(0, 3), `+${skills.length - 3} more`] : skills,
    availability: AVAILABILITY[t.availability] || 'Open to offers',
    available: t.availability === 'available' || t.availability === 'open_to_offers',
  };
};

export const useLiveTalentSearch = ({ query, tabId, sortId }) => {
  const live = isRecruiterSession();
  const [state, setState] = useState({
    status: live ? 'loading' : 'demo',
    candidates: [],
    total: 0,
  });

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    const q = String(query || '').trim();
    setState((s) => ({ ...s, status: 'loading' }));
    const timer = setTimeout(() => {
      api
        .post('/search/talents', {
          ...(q.length >= 2 ? { query: q } : {}),
          ...(tabId === 'available-now' ? { availability: 'available' } : {}),
          ...(SORT[sortId] || SORT['best-match']),
          limit: 30,
        })
        .then((res) => {
          const d = res?.data?.data !== undefined ? res.data.data : res?.data;
          if (!alive) return;
          if (d?.success === false) throw new Error(d.error || 'search failed');
          const candidates = (d?.results || []).map(toCandidate);
          log('results', candidates.length, 'of', d?.totalResults);
          setState({ status: 'live', candidates, total: d?.totalResults ?? candidates.length });
        })
        .catch((err) => {
          log.error('search failed:', err?.response?.status || err?.message);
          if (alive) setState({ status: 'error', candidates: [], total: 0 });
        });
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [live, query, tabId, sortId]);

  return state;
};
