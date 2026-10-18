import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import { CheckIcon, CourseShieldOutlineIcon, ProfileTrophyIcon } from '../../shared/assets.jsx';
import LearningHub from './LearningHub.jsx';
import { CertCard, CourseSticker } from './CourseUi.jsx';
import { CERTIFICATES } from './talentLearningCourseData.js';

const log = debug('LearningCertificates');

/*
 * LearningCertificates — ML-05 "Certificates" (`?view=certificates`).
 * Focused 8110:12546 / Playful 7525:937. The My Learning header + tabs (Certificates active) belong to
 * LearningHub (Hub agent); this is the body below the tabs.
 */
const LearningCertificates = ({ learning }) => {
  useEffect(() => {
    log('mount', { certificates: CERTIFICATES.items.length });
  }, []);

  return (
    <LearningHub learning={learning}>
      <div data-testid="learning-certificates" className="flex min-w-0 flex-col gap-[18px]">
        <div className="flex items-center gap-[12px] rounded-[18px] border border-[#c1d4c4] bg-[#ebf1ec] py-[14px] pr-[18px] pl-[16px]">
          <CourseShieldOutlineIcon className="size-[18px] shrink-0 text-[#2d5d33]" />
          <p className="min-w-0 flex-1 text-[14px] leading-[16.7px] font-medium text-[#2d5d33]">
            {CERTIFICATES.banner}
          </p>
          <CourseSticker rotate="playful:rotate-[4deg]" className="gap-[4px]">
            {CERTIFICATES.earned}
            <ProfileTrophyIcon className="size-[13px]" />
          </CourseSticker>
        </div>

        <ul className="grid gap-[22px] sm:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.items.map((c) => (
            <li key={c.id} className="flex min-w-0 flex-col gap-[12px]">
              <CertCard course={c.course} date={c.date} link={c.link}>
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
                <Button variant="tertiary" size="sm" onClick={() => log('download', c.id)}>
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
      </div>
    </LearningHub>
  );
};

export default LearningCertificates;
