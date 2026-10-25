import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { INSTITUTION_BASE } from '../institutionNav.js';
import { ProgressArrowIcon, ProgressCheckIcon, ProgressEyeIcon } from './ProgressIcons.jsx';

/*
 * ProgressStudentRow — one "result" row of the students list (Figma 8602:397936, 1327x70, p 14/20/14/18, gap 14): 42px green monogram · name (16/19 600)
 * + status sticker (On track / Flagged) · line (13/16 #737373) · right cluster: activity pill (gold outline, eye) · skills pill (green check) ·
 * profile pill (>= 50 % solid green, below it pale) · arrow. The flagged row (8602:398081) draws everything at 50 % opacity with the "Form teacher"
 * pill, "Coaching booked" and a View button. The row is one link to the student's progress page.
 * Props: student, flagged (session flag), compact (cards view: stacked card instead of a row).
 */

const Sticker = ({ children, large = false }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans font-bold text-[#1f4d26]',
      large
        ? 'text-[11.5px] max-lg:text-[12px] leading-[14px]'
        : 'text-[11px] leading-[13px] max-lg:text-[12px]'
    )}
  >
    {children}
  </span>
);

const GreenPill = ({ children }) => (
  <span className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] py-[3px] pr-[8px] pl-[6px] font-sans text-[11.5px] max-lg:text-[12px] leading-[14px] font-semibold whitespace-nowrap text-[#2d5d33]">
    <ProgressCheckIcon className="size-[11px] shrink-0 text-[#387440]" />
    {children}
  </span>
);

const ProgressStudentRow = ({ student, flagged = false, cards = false }) => {
  const to = `${INSTITUTION_BASE}/progress/students/${student.id}`;
  const isFlagged = student.status === 'flagged' || flagged;
  const strong = (student.profile ?? 0) >= 50;
  const dim = student.status === 'flagged';
  return (
    <li className={cards ? 'min-w-0' : undefined}>
      <Link
        to={to}
        aria-label={`${student.name}, open progress`}
        className={classNames(
          'flex min-w-0 items-center gap-[14px] text-inherit no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
          cards
            ? 'flex-col items-start rounded-[16px] border border-solid border-[#e1eae2] bg-white p-[16px]'
            : 'flex-wrap py-[14px] pr-[20px] pl-[18px] hover:bg-[#f8f8f4] md:flex-nowrap'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[42px] shrink-0 items-center justify-center rounded-full font-sans text-[15px] leading-[18px] font-semibold text-white',
            dim ? 'bg-[#f8f8f4] opacity-50' : 'bg-[#387440]'
          )}
        >
          {student.initials}
        </span>
        <span className={classNames('flex min-w-0 flex-1 flex-col gap-[2px]', dim && 'opacity-50')}>
          <span className="flex flex-wrap items-center gap-[8px]">
            <span className="font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {student.name}
            </span>
            {isFlagged ? (
              <Sticker large>Flagged</Sticker>
            ) : student.status === 'on-track' ? (
              <Sticker>On track</Sticker>
            ) : null}
          </span>
          <span className="font-sans text-[13px] leading-[16px] text-[#737373]">
            {student.meta}
          </span>
        </span>
        {dim ? (
          <>
            <span className="opacity-50">
              <GreenPill>{student.teacher}</GreenPill>
            </span>
            <span className="inline-flex items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12.5px] leading-[15px] font-bold text-[#2d5d33] opacity-50">
              {student.booked}
            </span>
            <span className="inline-flex h-[40px] items-center rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[16px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]">
              View
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-[5px] rounded-full border border-solid border-[#c8951a] bg-[#faf4e8] px-[9px] py-[4px] font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-semibold whitespace-nowrap text-[#1c2a21]">
              <ProgressEyeIcon className="size-[13px] shrink-0" />
              {student.activity}
            </span>
            <GreenPill>{student.skills}</GreenPill>
            <span
              className={classNames(
                'inline-flex items-center rounded-full border border-solid px-[10px] py-[4px] font-sans text-[12.5px] leading-[15px] font-bold whitespace-nowrap',
                strong
                  ? 'border-[#1c2a21]/[0.12] bg-[#387440] text-white'
                  : 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]'
              )}
            >
              Profile {student.profile}%
            </span>
            <ProgressArrowIcon className="size-[16px] shrink-0 text-[#2d5d33]" />
          </>
        )}
      </Link>
    </li>
  );
};

export default ProgressStudentRow;
