import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { Roster20EyeIcon, RosterArrowIcon, RosterTickIcon } from './rosterIcons.jsx';

/*
 * InstitutionRosterRow — one student of the roster list (Figma "result · …" 8602:395346, 1327 x 70, p 14/20/14/18, gap 14):
 * 42 round avatar #387440 (initials 15/18 600 white) · name 16/19 600 + "Linked" / "Not linked" sticker (r999, p 4/10, 11/13 700 #1f4d26 on #ebf1ec)
 * · sub line 13/16 #737373 ("Form 3 · General Science · Ghana Card verified" or "... · invite sent 9 Oct")
 * · right cluster: amber pill with the eye (11/13 600, #faf4e8, 1px #c8951a) · green check chips (11.5/14 600 #2d5d33 on #ebf1ec, 1px #c1d4c4) · "+n" (#f8f8f4)
 *   · profile pill (dark #387440 / white text for a linked student with a recent join, else #ebf1ec) · last active 12.5/15 #737373 · arrow (linked) or the "Remind" shelf button (not linked).
 * A not-linked student is drawn at 50 % (Figma op 0.5 on everything but the Remind button).
 * Props: student, selectable + selected + onToggle (Not linked filter: the avatar toggles the selection), onRemind(student), className.
 * The row title links to the student record.
 */

const InstitutionRosterRow = ({
  student: s,
  selectable,
  selected,
  onToggle,
  onRemind,
  className,
}) => {
  const dark = s.linked && s.pill && s.pillTone !== 'plain';
  const subLine = [`Form ${s.form}`, s.programme, s.linked ? 'Ghana Card verified' : s.note]
    .filter(Boolean)
    .join(' · ');
  return (
    <div
      className={classNames(
        'flex min-h-[70px] items-center gap-[14px] py-[14px] pr-[20px] pl-[18px] max-xl:flex-wrap',
        className
      )}
    >
      <div
        className={classNames(
          'flex min-w-0 flex-1 items-center gap-[14px]',
          !s.linked && 'opacity-50'
        )}
      >
        {selectable ? (
          <button
            type="button"
            role="checkbox"
            aria-checked={selected}
            aria-label={`Select ${s.name}`}
            onClick={() => onToggle(s.id)}
            className={classNames(
              'grid size-[42px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] font-sans text-[15px] leading-[18px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              !selected && 'outline-2 outline-dashed outline-offset-[-2px] outline-[#c1d4c4]'
            )}
          >
            {s.initials}
          </button>
        ) : (
          <span
            aria-hidden="true"
            className={classNames(
              'grid size-[42px] shrink-0 place-items-center rounded-full font-sans text-[15px] leading-[18px] font-semibold text-white',
              s.linked ? 'bg-[#387440]' : 'bg-[#f8f8f4]'
            )}
          >
            {s.initials}
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <Link
              to={`/institution/students/${s.id}`}
              className="truncate font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {s.name}
            </Link>
            <span
              className={classNames(
                'inline-flex shrink-0 items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans leading-[13px] font-bold text-[#1f4d26]',
                s.linked ? 'text-[11px]' : 'text-[11.5px] leading-[13px]'
              )}
            >
              {s.linked ? 'Linked' : 'Not linked'}
            </span>
          </div>
          <span className="truncate font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[13px]">
            {subLine}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-[14px] max-xl:w-full max-xl:pl-[56px]">
        <div
          className={classNames(
            'flex items-center gap-[6px] max-md:hidden',
            !s.linked && 'opacity-50'
          )}
        >
          {s.pill ? (
            <span className="inline-flex items-center gap-[5px] rounded-full border border-solid border-[#c8951a] bg-[#faf4e8] px-[9px] py-[4px] font-sans text-[11px] leading-[13px] font-semibold whitespace-nowrap text-[#1c2a21]">
              <Roster20EyeIcon className="size-[13px]" />
              {s.pill}
            </span>
          ) : null}
          {s.chips.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] py-[3px] pr-[8px] pl-[6px] font-sans text-[11.5px] leading-[14px] font-semibold whitespace-nowrap text-[#2d5d33]"
            >
              <RosterTickIcon className="size-[11px]" />
              {c}
            </span>
          ))}
          {s.more ? (
            <span className="inline-flex items-center rounded-full bg-[#f8f8f4] px-[8px] py-[4px] font-sans text-[11px] leading-[13px] font-medium text-[#595959]">
              +{s.more}
            </span>
          ) : null}
        </div>
        <span
          className={classNames(
            'inline-flex items-center rounded-full border border-solid px-[10px] py-[4px] font-sans text-[12.5px] leading-[15px] font-bold whitespace-nowrap',
            dark
              ? 'border-[#1c2a21]/[0.12] bg-[#387440] text-white'
              : 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]',
            !s.linked && 'opacity-50'
          )}
        >
          Profile {s.profile}%
        </span>
        <span
          className={classNames(
            'min-w-[15px] font-sans text-[12.5px] leading-[15px] text-[#737373]',
            !s.linked && 'opacity-50'
          )}
        >
          {s.last}
        </span>
        {s.linked ? (
          <Link
            to={`/institution/students/${s.id}`}
            aria-label={`Open ${s.name}’s record`}
            className="grid size-[24px] place-items-center rounded-[6px] text-[#2d5d33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <RosterArrowIcon className="size-[16px]" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onRemind(s)}
            aria-label={`Remind ${s.name}`}
            className="inline-flex h-[40px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]"
          >
            Remind
          </button>
        )}
      </div>
    </div>
  );
};

export default InstitutionRosterRow;
