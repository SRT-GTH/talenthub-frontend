import ReviewPage from '../../components/sections/parent/review/ReviewPage.jsx';

/*
 * ParentReviewPage — /parent/review "To review". Now the full page of Figma canvas "Parent · 06 To review and approvals" 10057:66783 (see wiki/parent-review.md): five tabs (All, Certificates, Evaluations,
 * Corrections, Payments), the certificate / evaluation / assessment reviews and the "all caught up" state, all in `components/sections/parent/review/ReviewPage.jsx` (it draws its own chrome).
 * It replaced the stop-gap built for the Flags canvas (PR-08 10057:893), which showed only Corrections and assumed All listed the same corrections. `?tab=corrections` is that frame and still renders
 * the corrected flags from flagsStore with the same "Check" link to /parent/wards/abena?tab=flags&modal=recheck&flag=<id> (PW-06). `flags/ReviewCorrections.jsx` is no longer used by this route.
 */
const ParentReviewPage = () => <ReviewPage />;

export default ParentReviewPage;
