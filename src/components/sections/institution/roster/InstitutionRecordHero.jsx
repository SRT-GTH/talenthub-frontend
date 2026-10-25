import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import kofiPhoto from '../../../../assets/institution/roster/kofi-danso-photo.png';
import InstitutionRecordChip from './InstitutionRecordChip.jsx';
import {
  Roster20MarkerPinIcon,
  Roster20TargetIcon,
  Roster20VoiceIcon,
  RosterCheckIcon,
  RosterFlagIcon,
} from './rosterIcons.jsx';

const log = debug('InstitutionRecordHero');

/*
 * InstitutionRecordHero — the student header card (Figma 11.2.2j "hero" 8744:433500, 1329 x 322, white, 1px ink at 10 %, r24, soft shadow): a 150 high #387440 cover with the
 * "Open to scholarships" pill, a 132 round avatar (1px ink at 10 %, 118 photo) overlapping it, name 37/44 600 + "Verified" pill, "he/him · joined Sep 2024" 13/16 #737373, the
 * 16/19 500 line with the Ghana flag, three chips (Scholarships · University, Tamale · Northern, English · Twi), "Your actions" pill over the "Edit record" (white shelf) and
 * "Message Kofi" (green shelf) buttons, and the three stats (23/29 600 + 11/13 500 #737373).
 * The cover draws no doodles (Figma: the decorative layers are hidden). Students without a photo get a #387440 monogram. "Edit record" has no destination drawn: it logs the intent ⚠️ ASSUMPTION.
 * Props: record, student (for the monogram / verified state), messageTo (route).
 */

const CHIP_ICON = {
  target: Roster20TargetIcon,
  pin: Roster20MarkerPinIcon,
  voice: Roster20VoiceIcon,
};

const InstitutionRecordHero = ({ record, student, messageTo }) => {
  const photo = record.id === 'kofi-danso' ? kofiPhoto : null;
  return (
    <section
      aria-label="Student"
      className="rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]"
    >
      <div className="relative h-[150px] overflow-hidden rounded-t-[24px] bg-[#387440]">
        {record.open ? (
          <span className="absolute top-[24px] left-[32px] inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {record.open}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-x-[24px] gap-y-[16px] px-[32px] pb-[27px] max-lg:px-[20px]">
        <span className="-mt-[66px] grid size-[132px] shrink-0 place-items-center overflow-hidden rounded-full border border-solid border-[#1c2a21]/10 bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
          {photo ? (
            <img
              src={photo}
              alt=""
              width="118"
              height="118"
              className="size-[118px] rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-[118px] place-items-center rounded-full bg-[#387440] font-sans text-[37px] leading-[44px] font-semibold text-white"
            >
              {student.initials}
            </span>
          )}
        </span>
        <div className="flex min-w-[260px] flex-1 flex-col gap-[6px] pt-[10px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h1 className="m-0 font-sans text-[37px] leading-[44px] font-semibold text-[#1c2a21] max-sm:text-[30px] max-sm:leading-[36px]">
              {record.name}
            </h1>
            {student.cardVerified ? (
              <span className="inline-flex h-[22px] items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[9px] pl-[7px] font-sans text-[12px] leading-[14px] font-semibold text-[#2d5d33]">
                <RosterCheckIcon className="size-[13px]" />
                Verified
              </span>
            ) : null}
          </div>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[13px]">
            {record.pronouns} · joined {record.joined}
          </p>
          <p className="m-0 flex items-center gap-[6px] font-sans text-[16px] leading-[19px] font-medium text-[#1c2a21]">
            {record.line}
            <RosterFlagIcon className="size-[18px]" />
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0 pt-[6px]">
            {record.chips.map((c) => {
              const Icon = CHIP_ICON[c.icon];
              return (
                <li key={c.id}>
                  <InstitutionRecordChip
                    tone={c.primary ? 'green' : 'plain'}
                    icon={<Icon className="size-[14px]" />}
                  >
                    {c.label}
                  </InstitutionRecordChip>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative flex min-w-[260px] flex-col items-end gap-[24px] pt-[10px] max-xl:w-full max-xl:items-start">
          <span className="absolute -top-[27px] right-[56px] inline-flex h-[23px] items-center rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[11px] leading-[13px] font-bold text-[#1f4a2b] max-xl:hidden">
            Your actions
          </span>
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={() => log('edit record (no destination drawn)')}
              className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]"
            >
              Edit record
            </button>
            <Link
              to={messageTo}
              className="inline-flex h-[48px] items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730]"
            >
              Message {student.firstName}
            </Link>
          </div>
          {record.stats.length ? (
            <dl className="m-0 flex gap-[22px]">
              {record.stats.map((s) => (
                <div key={s.id} className="flex flex-col items-center">
                  <dd className="m-0 font-sans text-[23px] leading-[29px] font-semibold text-[#1c2a21]">
                    {s.value}
                  </dd>
                  <dt className="font-sans text-[11px] leading-[13px] font-medium text-[#737373] max-lg:text-[12px]">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default InstitutionRecordHero;
