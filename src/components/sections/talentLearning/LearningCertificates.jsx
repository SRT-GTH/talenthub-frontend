import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import { CheckIcon, CourseShieldOutlineIcon, ProfileTrophyIcon } from '../../shared/assets.jsx';
import LearningHub from './LearningHub.jsx';
import { CertCard, CourseSticker } from './CourseUi.jsx';
import { CERTIFICATES } from './talentLearningCourseData.js';
import { useLearningData } from './useLearningData.js';

const LONG_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const certDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : `${d.getDate()} ${LONG_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const log = debug('LearningCertificates');

/*
 * LearningCertificates — ML-05 "Certificates" (`?view=certificates`).
 * Focused 8110:12546 / Playful 7525:937. The My Learning header + tabs (Certificates active) belong to
 * LearningHub (Hub agent); this is the body below the tabs.
 */
const LearningCertificates = ({ learning }) => {
  const data = useLearningData();
  const items = data.live
    ? data.certificates.map((c, i) => ({
        id: c.enrolmentId,
        enrolmentId: c.enrolmentId,
        course: c.title,
        date: certDate(c.completedAt),
        link: '', // ⚠️ the API has no public verify link yet (signed URL only, 24h)
        isNew: i === 0,
      }))
    : CERTIFICATES.items;
  useEffect(() => {
    log('mount', { certificates: items.length, live: data.live });
  }, [items.length, data.live]);

  return (
    <LearningHub learning={learning}>
      <div data-testid="learning-certificates" className="flex min-w-0 flex-col gap-[18px]">
        <div className="flex items-center gap-[12px] rounded-[18px] border border-[#c1d4c4] bg-[#ebf1ec] py-[14px] pr-[18px] pl-[16px]">
          <CourseShieldOutlineIcon className="size-[18px] shrink-0 text-[#2d5d33]" />
          <p className="min-w-0 flex-1 text-[14px] leading-[16.7px] font-medium text-[#2d5d33]">
            {CERTIFICATES.banner}
          </p>
          <CourseSticker rotate="playful:rotate-[4deg]" className="gap-[4px]">
            {data.live ? `${items.length} earned` : CERTIFICATES.earned}
            <ProfileTrophyIcon className="size-[13px]" />
          </CourseSticker>
        </div>

        <ul className="grid gap-[22px] sm:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <li key={c.id} className="flex min-w-0 flex-col gap-[12px]">
              <CertCard
                course={c.course}
                date={c.date}
                link={c.link}
                name={data.live ? data.talentName : undefined}
              >
                {c.isNew ? (
                  <CourseSticker
                    rotate="playful:-rotate-[6deg]"
                    className="absolute top-[-12px] right-[26px]"
                  >
                    {CERTIFICATES.newTag}
                  </CourseSticker>
                ) : null}
              </CertCard>
              <div className="flex flex-wrap items-center gap-[8px]">
                <Button variant="primary" size="sm" onClick={() => log('share', c.id)}>
                  {CERTIFICATES.share}
                </Button>
                {/* Live: the API's "signed" certificateUrl points back at the authenticated JSON endpoint
                    (401 in a new tab) and no PDF is rendered yet, so Download waits for the backend. */}
                <Button
                  variant="tertiary"
                  size="sm"
                  disabled={Boolean(c.enrolmentId)}
                  title={c.enrolmentId ? 'Certificate PDFs are coming soon' : undefined}
                  onClick={() => log('download', c.id)}
                >
                  {CERTIFICATES.download}
                </Button>
                <span
                  className={classNames(
                    'inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[10px] pl-[8px] text-[11.5px] max-lg:text-[12px] leading-[13.7px] font-semibold whitespace-nowrap text-[#2d5d33]',
                    'playful:border playful:border-[rgba(28,42,33,0.35)]'
                  )}
                >
                  <CheckIcon className="size-[12px]" />
                  {CERTIFICATES.onProfile}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {data.live && items.length === 0 ? (
          <p className="m-0 font-sans text-[14px] text-[#737373]">
            Finish a course to earn your first certificate.
          </p>
        ) : null}
      </div>
    </LearningHub>
  );
};

export default LearningCertificates;
