import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import ReviewCorrections from '../../components/sections/parent/flags/ReviewCorrections.jsx';
import { useWardFlags } from '../../components/sections/parent/flags/flagsStore.js';

const log = debug('ParentReviewPage');

/*
 * ParentReviewPage — /parent/review "To review" (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 03 Flags and corrections" 10057:604, PR-08 10057:893 "To review · Corrections tab").
 *   ?tab=corrections (default)  PR-08: the corrected flags waiting for the parent; "Check" opens /parent/wards/abena?tab=flags&modal=recheck&flag=<id> (PW-06)
 *   ?tab=all                    ⚠️ ASSUMPTION: the same list (the other waiting items are not drawn)
 * The Certificates, Evaluations and Payments tabs have no designed page here. Mock data from flagsStore (shared with the ward Flags tab).
 */
const ParentReviewPage = () => {
  const [params] = useSearchParams();
  const { flags } = useWardFlags();
  const tab = params.get('tab') === 'all' ? 'all' : 'corrections';
  const corrections = flags.filter((f) => f.status === 'corrected');

  useEffect(() => {
    log('mount', { tab, corrections: corrections.length });
  }, [tab, corrections.length]);

  return (
    <ParentFrame active="review" sidebar="linked">
      <ReviewCorrections
        ward={WARDS.abena}
        corrections={corrections}
        tab={tab}
        tabHref={(id) => `/parent/review?tab=${id}`}
      />
    </ParentFrame>
  );
};

export default ParentReviewPage;
