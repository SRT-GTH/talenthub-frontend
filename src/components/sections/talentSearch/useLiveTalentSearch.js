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
 * Mapping to the card (CandidateCard): with a posting chosen ("Searching for") the backend scores each talent for
 * it (postingMatch { score, reasons }, utils/talentMatch.js): `matchPercent` is that score and the explanation box
 * says why. Without a posting the card shows profile completion and the talent's own summary.
 * Top matches: with a posting, the ten best fits (sortBy "match"); without one it is the same as All matches.
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
    matchPercent: hit?.postingMatch ? Math.round(hit.postingMatch.score) : null,
    completion: typeof t.profileCompletion === 'number' ? Math.round(t.profileCompletion) : 0,
    tags: [
      ...new Set([...(t.careers || []), t.location?.city || t.location?.region].filter(Boolean)),
    ].slice(0, 3),
    explanationTitle: hit?.postingMatch ? 'Why this match' : 'Summary',
    explanation: hit?.postingMatch
      ? hit.postingMatch.reasons?.length
        ? hit.postingMatch.reasons.join(' · ')
        : 'Little overlap with this posting’s skills, field or location yet.'
      : summaryOf(t),
    explanationTint: '#f3f8f4',
    topSkills: skills.length > 3 ? [...skills.slice(0, 3), `+${skills.length - 3} more`] : skills,
    availability: AVAILABILITY[t.availability] || 'Open to offers',
    available: t.availability === 'available' || t.availability === 'open_to_offers',
  };
};

/* Filter chips -> POST /search/talents params. A picked town filters by city (talents who hide their city don't match it). */
const YEARS = {
  '0-2': { maxYears: 2 },
  '2-5': { minYears: 2, maxYears: 5 },
  '5-plus': { minYears: 5 },
  '10-plus': { minYears: 10 },
};
const CITY = { accra: 'Accra', tema: 'Tema', kumasi: 'Kumasi', takoradi: 'Takoradi' };
// Education labels as the index stores them (backend utils/talentSearchDoc.js EDUCATION_LEVEL).
const EDUCATION = {
  diploma: ['Diploma', 'TVET', 'University', 'Undergraduate', 'Graduate', 'Postgraduate'],
  bachelors: ['University', 'Undergraduate', 'Graduate', 'Postgraduate'],
  masters: ['Postgraduate'],
};
const AVAIL = { 'available-now': 'available', 'open-to-work': 'open_to_offers' };
const isObjectId = (v) => /^[a-f0-9]{24}$/i.test(String(v || ''));

export const searchParamsFor = ({
  query,
  tabId,
  sortId,
  skills = [],
  expId,
  locationId,
  availability = [],
  jobId,
  education,
}) => {
  const q = String(query || '').trim();
  const avail = availability.map((a) => AVAIL[a]).filter(Boolean);
  const forJob = isObjectId(jobId);
  // Best match and Top matches rank by fit for the chosen posting.
  const byMatch = forJob && (tabId === 'top-matches' || !sortId || sortId === 'best-match');
  return {
    ...(q.length >= 2 ? { query: q } : {}),
    ...(skills.length ? { skills } : {}),
    ...(YEARS[expId] || {}),
    ...(CITY[locationId] ? { location: { city: CITY[locationId] } } : {}),
    ...(EDUCATION[education] ? { educationLevels: EDUCATION[education] } : {}),
    ...(tabId === 'available-now'
      ? { availability: 'available' }
      : avail.length === 1
        ? { availability: avail[0] }
        : {}),
    ...(forJob ? { opportunityId: jobId } : {}),
    ...(byMatch ? { sortBy: 'match' } : SORT[sortId] || SORT['best-match']),
    limit: forJob && tabId === 'top-matches' ? 10 : 30,
  };
};

export const useLiveTalentSearch = (filters) => {
  const body = searchParamsFor(filters);
  const key = JSON.stringify(body);
  const live = isRecruiterSession();
  const [state, setState] = useState({
    status: live ? 'loading' : 'demo',
    candidates: [],
    total: 0,
  });

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    setState((s) => ({ ...s, status: 'loading' }));
    const timer = setTimeout(() => {
      api
        .post('/search/talents', JSON.parse(key))
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
  }, [live, key]);

  return state;
};
