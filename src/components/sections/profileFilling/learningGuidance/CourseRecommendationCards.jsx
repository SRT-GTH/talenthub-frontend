import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  OpportunityArrowRightIcon,
  OpportunityShieldIcon,
  OpportunityTickIcon,
} from '../opportunityGuidance/opportunityIcons.jsx';

const log = debug('CourseRecommendationCards');

const FACT_PILL =
  'inline-flex items-center rounded-full bg-white/12 px-[10px] py-[5px] font-sans text-[11px] font-medium leading-[13px] tracking-[0.2px] text-white max-lg:text-[12px]';

const TYPE_MARK = { course: 'Learn', video: '\u25B6' };

/*
 * CourseRecommendationCard - one GTH course in a Career Buddy reply (2026-10-31, learning guidance). Same look as the
 * career post card (CareerPostCard) and the opportunity match card: type tile, "Course · Microsoft Learn", the title,
 * pills (free, length, level), a Done / Started badge, the guardian note when the course needs a parent's OK, an open
 * button (the GTH course page) and "Why this course?", which shows the reason in place.
 * `course` is a courseCardView (careerBuddyLive.js).
 */
export const CourseRecommendationCard = ({ course, onOpen }) => {
  const [whyOpen, setWhyOpen] = useState(false);
  // Unique per card even when the same course shows in two replies.
  const whyId = `course-card-why-${useId()}`;
  return (
    <article
      aria-label={course.title}
      className="flex w-[min(320px,72vw)] shrink-0 flex-col gap-[14px] rounded-[16px] bg-[linear-gradient(135deg,#142916,#2a5730)] p-[16px] text-white shadow-[0_5px_17px_rgba(31,69,38,0.09)] playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.55)]"
    >
      <header className="flex items-start gap-[10px]">
        <span
          aria-hidden="true"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white font-sans text-[11px] font-semibold text-[#1f4526]"
        >
          {course.isVideo ? (
            <span className="text-[15px]">{TYPE_MARK.video}</span>
          ) : (
            TYPE_MARK.course
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <span className="flex items-center gap-[4px] font-sans text-[12px] leading-[14px] tracking-[0.2px]">
            <OpportunityShieldIcon className="size-[13px] shrink-0" />
            <span className="min-w-0 truncate">{course.tag}</span>
          </span>
          <h3 className="m-0 line-clamp-3 font-sans text-[15px] font-semibold leading-[19px] tracking-[0.2px] playful:font-heading">
            {course.title}
          </h3>
        </div>
        {course.statusLabel ? (
          <span className="inline-flex shrink-0 items-center gap-[4px] rounded-full bg-[#f3c84b] px-[8px] py-[3px] font-sans text-[11px] font-semibold leading-[13px] text-[#1c2a21]">
            {course.status === 'done' ? (
              <OpportunityTickIcon aria-hidden="true" className="size-[12px] shrink-0" />
            ) : null}
            {course.statusLabel}
          </span>
        ) : null}
      </header>

      {course.facts.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {course.facts.map((fact) => (
            <li key={fact} className={FACT_PILL}>
              {fact}
            </li>
          ))}
        </ul>
      ) : null}

      {course.guardianNote ? (
        <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#f3c84b] max-lg:text-[13px]">
          {course.guardianNote}
        </p>
      ) : null}

      {whyOpen ? (
        <p
          id={whyId}
          className="m-0 rounded-[12px] bg-white/8 px-[12px] py-[10px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-white/90 max-lg:text-[13px]"
        >
          {course.why}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col items-center gap-[6px]">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-[35px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b] playful:border-[#1c2a21]"
        >
          {course.openLabel}
          <OpportunityArrowRightIcon className="size-[20px] shrink-0 text-[#387440]" />
        </button>
        {course.why ? (
          <button
            type="button"
            aria-expanded={whyOpen}
            aria-controls={whyId}
            onClick={() => setWhyOpen((v) => !v)}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#f3c84b] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c84b]"
          >
            {whyOpen ? 'Hide why' : 'Why this course?'}
          </button>
        ) : null}
      </div>
    </article>
  );
};

const CourseRow = ({ courses, label, onOpen, navigate }) => (
  <div
    role="group"
    aria-label={label}
    className="-mx-[4px] flex max-w-full gap-[12px] overflow-x-auto px-[4px] pb-[8px] [scrollbar-width:thin]"
  >
    {courses.map((course) => (
      <CourseRecommendationCard
        key={course.id}
        course={course}
        onOpen={() => {
          log('open', course.id);
          if (onOpen) onOpen(course);
          else navigate(course.detailPath);
        }}
      />
    ))}
  </div>
);

/*
 * CourseRecommendationCards - "Courses to get you ready for {career}" and a scrolling row of course cards, under a
 * Career Buddy reply. Props: courses (courseCardView[]), career (heading), onOpen(course) (defaults to the GTH course
 * page, /learning?view=course&course=<id>), compact (the narrow Ask Buddy panel on /home: the row takes its width).
 * 2026-11-01: courses that only build a broader skill (match 'related') get their own secondary "Also useful" row
 * under the close matches, so a general course is not presented as the way into the career.
 */
const CourseRecommendationCards = ({ courses, career, onOpen, compact = false }) => {
  const navigate = useNavigate();
  if (!courses?.length) return null;
  const close = courses.filter((c) => c.match !== 'related');
  const related = courses.filter((c) => c.match === 'related');
  const widest = Math.max(close.length, related.length);
  return (
    <div
      className="mt-[16px] flex min-w-0 max-w-full flex-col gap-[10px]"
      style={compact ? { width: '100%' } : { width: `min(${widest * 332 - 12}px, 660px, 78vw)` }}
    >
      {close.length ? (
        <>
          <p className="m-0 font-sans text-[14px] font-semibold leading-[20px]">
            {career ? `Courses to get you ready for ${career}` : 'Courses for you'}
          </p>
          <CourseRow
            courses={close}
            label={career ? `Courses for ${career}` : 'Courses'}
            onOpen={onOpen}
            navigate={navigate}
          />
        </>
      ) : null}
      {related.length ? (
        <>
          <p className="m-0 font-sans text-[13px] font-medium leading-[18px] opacity-70">
            {close.length ? 'Also useful: broader skills' : career ? `Broader skills for ${career}` : 'Broader skills'}
          </p>
          <CourseRow courses={related} label="Also useful courses" onOpen={onOpen} navigate={navigate} />
        </>
      ) : null}
    </div>
  );
};

export default CourseRecommendationCards;
