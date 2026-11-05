import { useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import { HEAD } from '../talentHome/coreUi.jsx';
import { fetchMyProfile, saveProfileFields } from '../../../services/profileStages.api.js';
import {
  ProfileEditDraftLockIcon,
  ProfileEditHubtelLogoIcon,
  ProfileEditModalCloseIcon,
  ProfileEditOrgBuildingIcon,
  ProfileEditOrgHintIcon,
  ProfileEditSkillRemoveIcon,
  ProfileEditTypeBoltIcon,
  ProfileEditTypeFlagIcon,
  ProfileEditTypeGradIcon,
  ProfileEditTypeUsersIcon,
  ProfileEditTypeWorkIcon,
} from '../../shared/assets.jsx';

const log = debug('AddExperienceModal');

/*
 * AddExperienceModal — P-09 "Add experience (modal)". Figma Focused 8110:372451 (modal 8110:372930) /
 * Playful 7574:775 (modal 7574:1269). Opens over the Experience tab with `?modal=experience`.
 * Real form with local state. The initial values reproduce the frame (a half-typed organisation with the
 * suggestion list open). All strings are verbatim from the frames. Overlay = rgba(28,42,33,.55), measured
 * from the Figma render (the overlay layer's own fill could not be read: Figma MCP rate-limited).
 * Validation: the frame draws only the `*` markers (no error state), so an invalid "Add to profile" focuses
 * the first missing field and sets aria-invalid; no invented message is shown.
 *
 * Live (signed in, `live`): the form starts empty, dates are month pickers (end date required unless "I'm doing this
 * now" is on), and "Add to profile" appends to profile.workExperience (PATCH /profiles/fields) and calls `onSaved`.
 * The profile schema stores company, position, dates, isCurrent and description only, so the type chips, the
 * organisation suggestions (demo list) and "Skills used" are demo-only for now.
 */

const TYPES = [
  { id: 'job', label: 'Job', Icon: ProfileEditTypeWorkIcon },
  { id: 'internship', label: 'Internship', Icon: ProfileEditTypeGradIcon },
  { id: 'nss', label: 'NSS', Icon: ProfileEditTypeFlagIcon },
  { id: 'volunteer', label: 'Volunteer', Icon: ProfileEditTypeUsersIcon },
  { id: 'gig', label: 'Gig / side hustle', Icon: ProfileEditTypeBoltIcon },
];

const ORGS = [
  { id: 'hubtel', name: 'Hubtel', meta: 'Fintech · Accra · on GTH', logo: true },
  { id: 'hubtel-foundation', name: 'Hubtel Foundation', meta: 'Non-profit · Accra', logo: false },
];

const DESC_LIMIT = 300;

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

// Text inputs: 1px #ccc; the active (focus) style is Figma's 2px #c1d4c4 on #fffefc.
const INPUT_BASE =
  'block h-[51px] w-full rounded-[10px] border border-[#ccc] bg-white pr-[16px] pl-[20px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#1c2a21] ' +
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)] ' +
  'focus:border-2 focus:border-[#c1d4c4] focus:bg-[#fffefc] focus:pr-[15px] focus:pl-[19px] ' +
  'aria-[invalid=true]:border-[#c0392b]';

const Label = ({ htmlFor, children, required, trailing }) => (
  <div className="flex h-[21px] w-[min(427px,100%)] items-center justify-between max-[460px]:w-full">
    <label
      htmlFor={htmlFor}
      className="flex gap-px text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
    >
      {children}
      {required && (
        <span
          aria-hidden="true"
          className="w-[6px] font-[Instrument_Sans] text-[14px] leading-[21px] font-semibold text-[#2e8b57]"
        >
          *
        </span>
      )}
    </label>
    <span className="text-[12px] leading-[18px] tracking-[0.2px] whitespace-pre text-[#595959]">
      {trailing}
    </span>
  </div>
);

const SkillChip = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    aria-label={`${label}, remove`}
    className={classNames(
      'inline-flex h-[32px] shrink-0 cursor-pointer items-center gap-[6px] rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]',
      FOCUS_RING
    )}
  >
    <ProfileEditSkillRemoveIcon className="size-[14px] shrink-0" />
    {label}
  </button>
);

/* 'YYYY-MM' -> 'Jun 2026' (for the error copy). */
const monthLabel = (ym) => {
  const [y, m] = String(ym || '')
    .split('-')
    .map(Number);
  return y && m
    ? new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '';
};

const AddExperienceModal = ({ profile, live = false, onSaved }) => {
  const uid = useId();
  const dialogRef = useRef(null);
  const orgRef = useRef(null);
  const roleRef = useRef(null);
  const startRef = useRef(null);
  const descRef = useRef(null);
  const skillInputRef = useRef(null);

  // Initial values reproduce the Figma frame.
  // Initial values reproduce the Figma frame (demo); live starts empty.
  const [type, setType] = useState('internship');
  const [role, setRole] = useState(live ? '' : 'Data Analyst Intern');
  const [org, setOrg] = useState(live ? '' : 'Hubt');
  const [orgOpen, setOrgOpen] = useState(!live);
  const [orgIdx, setOrgIdx] = useState(0);
  const [start, setStart] = useState(live ? '' : 'Jun 2026');
  const [end, setEnd] = useState('');
  const [current, setCurrent] = useState(!live);
  const [desc, setDesc] = useState('');
  const [skills, setSkills] = useState(live ? [] : ['SQL', 'Excel']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillDraft, setSkillDraft] = useState('');
  const [invalid, setInvalid] = useState({});

  const close = () => {
    log('close', { reason: 'dismiss' });
    profile.update({ modal: null });
  };

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => orgRef.current,
    lockScroll: true,
  });

  const query = org.trim();
  const matches = useMemo(
    () => (query ? ORGS.filter((o) => o.name.toLowerCase().includes(query.toLowerCase())) : []),
    [query]
  );
  // Option rows: matching organisations, then the "add as new" row (only for a non-empty, non-exact name).
  const exact = ORGS.some((o) => o.name.toLowerCase() === query.toLowerCase());
  const rows = [
    ...matches.map((o) => ({ kind: 'org', org: o })),
    ...(query && !exact ? [{ kind: 'new' }] : []),
  ];
  // Live: no organisation directory yet, so no suggestion list (the name is saved as typed).
  const listOpen = !live && orgOpen && rows.length > 0;

  const pickRow = (row) => {
    const name = row.kind === 'new' ? query : row.org.name;
    log('org picked', { kind: row.kind, name });
    setOrg(name);
    setOrgOpen(false);
    setInvalid((v) => ({ ...v, org: false }));
    orgRef.current?.focus();
  };

  const onOrgKey = (e) => {
    if (e.key === 'ArrowDown' && rows.length) {
      e.preventDefault();
      setOrgOpen(true);
      setOrgIdx((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp' && rows.length) {
      e.preventDefault();
      setOrgIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && listOpen) {
      e.preventDefault();
      pickRow(rows[Math.min(orgIdx, rows.length - 1)]);
    } else if (e.key === 'Escape' && listOpen) {
      // Close the suggestion list first; a second Esc closes the dialog.
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation?.();
      setOrgOpen(false);
    }
  };

  const onTypeKey = (e, idx) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = TYPES[(idx + step + TYPES.length) % TYPES.length];
    setType(next.id);
    document.getElementById(`${uid}-type-${next.id}`)?.focus();
  };

  const addSkill = () => {
    const name = skillDraft.trim();
    if (name && !skills.some((s) => s.toLowerCase() === name.toLowerCase())) {
      log('skill added', name);
      setSkills((l) => [...l, name]);
    }
    setSkillDraft('');
    setAddingSkill(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const missing = {
      role: !role.trim(),
      org: !org.trim(),
      start: !start.trim(),
      end: live && !current && (!end || end < start),
      desc: !desc.trim(),
    };
    setInvalid(missing);
    log('submit', { missing: Object.keys(missing).filter((k) => missing[k]) });
    const first = [
      ['role', roleRef],
      ['org', orgRef],
      ['start', startRef],
      ['end', endRef],
      ['desc', descRef],
    ].find(([k]) => missing[k]);
    if (first) {
      if (live && missing.end && end && end < start)
        setError(`The end date can’t be before the start date (${monthLabel(start)}).`);
      first[1].current?.focus();
      return;
    }
    if (live) {
      setSaving(true);
      setError('');
      try {
        // Append to the saved list: load it first, so a failed load can never overwrite it with one entry.
        const saved = await fetchMyProfile();
        const list = Array.isArray(saved?.workExperience) ? saved.workExperience : [];
        const item = {
          position: role.trim(),
          company: org.trim(),
          startDate: `${start}-01`,
          endDate: current ? null : `${end}-01`,
          isCurrent: current,
          description: desc.trim(),
        };
        await saveProfileFields({ workExperience: [...list, item] });
        log('entry saved', { position: item.position, count: list.length + 1 });
        onSaved?.();
        profile.update({ modal: null });
      } catch (err) {
        log.error('experience save failed:', err?.response?.status || err?.message);
        setSaving(false);
        setError('That wasn’t saved. Check your connection and try again.');
      }
      return;
    }
    log('entry added (local only)', {
      type,
      role,
      org,
      start,
      end: current ? 'Present' : end,
      skills: skills.length,
    });
    profile.update({ modal: null });
  };

  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden bg-[rgba(28,42,33,0.55)] sm:items-start sm:px-[clamp(12px,2vw,32px)] sm:pt-[clamp(16px,5vh,68px)] sm:pb-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        aria-describedby={`${uid}-sub`}
        tabIndex={-1}
        noValidate
        onSubmit={submit}
        className={classNames(
          'flex max-h-full w-full max-w-[680px] flex-col gap-[18px] overflow-y-auto rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white p-[clamp(16px,1.6vw,28px)] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]',
          'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]',
          'max-sm:max-h-[100dvh] max-sm:rounded-b-none max-sm:pb-[calc(16px+env(safe-area-inset-bottom))]'
        )}
      >
        <div className="flex items-center gap-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2
              id={`${uid}-title`}
              className={classNames(HEAD, 'text-[29px] leading-[1.2] text-[#1c2a21]')}
            >
              Add experience
            </h2>
            <p id={`${uid}-sub`} className="text-[14px] leading-[normal] text-[#737373]">
              Jobs, internships, NSS, gigs, volunteering. It all counts.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className={classNames(
              'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e6e6e6] bg-transparent',
              FOCUS_RING
            )}
          >
            <ProfileEditModalCloseIcon className="size-[16px]" />
          </button>
        </div>

        {!live && (
          <div
            role="radiogroup"
            aria-label="Experience type"
            className="flex flex-wrap items-start gap-[8px]"
          >
            {TYPES.map((t, i) => {
              const on = type === t.id;
              return (
                <button
                  key={t.id}
                  id={`${uid}-type-${t.id}`}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setType(t.id)}
                  onKeyDown={(e) => onTypeKey(e, i)}
                  className={classNames(
                    'flex cursor-pointer items-center gap-[5px] rounded-full border px-[14px] py-[8px] text-[13px] leading-[normal] font-semibold whitespace-nowrap',
                    on
                      ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
                      : 'border-[#e6e6e6] bg-white text-[#595959]',
                    FOCUS_RING
                  )}
                >
                  <t.Icon className="size-[15px] shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-[8px]">
          <Label htmlFor={`${uid}-role`} required trailing=" ">
            Role title
          </Label>
          <input
            ref={roleRef}
            id={`${uid}-role`}
            type="text"
            value={role}
            aria-required="true"
            aria-invalid={invalid.role || undefined}
            onChange={(e) => {
              setRole(e.target.value);
              setInvalid((v) => ({ ...v, role: false }));
            }}
            className={INPUT_BASE}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <div className="flex flex-col gap-[8px]">
            <Label htmlFor={`${uid}-org`} required trailing=" ">
              Organisation
            </Label>
            <div className="relative">
              <input
                ref={orgRef}
                id={`${uid}-org`}
                type="text"
                role="combobox"
                aria-expanded={listOpen}
                aria-controls={`${uid}-orgs`}
                aria-autocomplete="list"
                aria-required="true"
                aria-invalid={invalid.org || undefined}
                aria-activedescendant={
                  listOpen ? `${uid}-org-opt-${Math.min(orgIdx, rows.length - 1)}` : undefined
                }
                autoComplete="off"
                value={org}
                onChange={(e) => {
                  setOrg(e.target.value);
                  setOrgOpen(true);
                  setOrgIdx(0);
                  setInvalid((v) => ({ ...v, org: false }));
                }}
                onFocus={() => setOrgOpen(true)}
                onKeyDown={onOrgKey}
                className={classNames(
                  INPUT_BASE,
                  'focus:[filter:drop-shadow(0_1px_1px_rgba(28,42,33,0.04))_drop-shadow(0_2px_5.5px_rgba(28,42,33,0.03))] playful:focus:[filter:drop-shadow(0_1px_1px_rgba(28,42,33,0.04))_drop-shadow(0_4px_8px_rgba(28,42,33,0.06))]'
                )}
              />
            </div>
            <p className="flex items-center gap-[8px] px-[8px] text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]">
              <ProfileEditOrgHintIcon className="size-[16px] shrink-0" />
              Pick from the list so recruiters see the real logo
            </p>
          </div>

          {listOpen && (
            <ul
              id={`${uid}-orgs`}
              role="listbox"
              aria-label="Organisations"
              className="flex flex-col rounded-[12px] border border-[#e6e6e6] bg-white p-[6px] shadow-[0_4px_11px_rgba(0,0,0,0.04)] playful:shadow-[0_6px_16px_rgba(0,0,0,0.08)] max-sm:overflow-hidden"
            >
              {rows.map((row, i) => (
                <li
                  key={row.kind === 'new' ? 'new' : row.org.id}
                  id={`${uid}-org-opt-${i}`}
                  role="option"
                  aria-selected={i === Math.min(orgIdx, rows.length - 1)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pickRow(row);
                  }}
                  onMouseEnter={() => setOrgIdx(i)}
                  className={classNames(
                    'flex cursor-pointer items-center gap-[10px] rounded-[8px] px-[10px] py-[8px] playful:first:mb-0',
                    i === Math.min(orgIdx, rows.length - 1) && 'bg-[#f8f8f4]',
                    'not-first:mt-[16px] playful:not-first:mt-0'
                  )}
                >
                  {row.kind === 'new' ? (
                    <>
                      <span className="flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#ebf1ec] text-[13px] leading-[normal] font-bold text-[#2d5d33] playful:border playful:border-[rgba(28,42,33,0.35)]">
                        +
                      </span>
                      <span className="min-w-0 truncate text-[14px] leading-[normal] font-semibold text-[#2d5d33]">
                        Add “{query}” as a new organisation
                      </span>
                    </>
                  ) : (
                    <>
                      {row.org.logo ? (
                        <ProfileEditHubtelLogoIcon className="size-[28px] shrink-0" />
                      ) : (
                        <span className="flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#ebf1ec]">
                          <ProfileEditOrgBuildingIcon className="size-[14px]" />
                        </span>
                      )}
                      <span className="flex min-w-0 flex-col leading-[normal]">
                        <span className="truncate text-[14px] font-semibold text-[#1c2a21]">
                          {row.org.name}
                        </span>
                        <span className="truncate text-[12px] text-[#737373]">{row.org.meta}</span>
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-[12px] overflow-hidden max-[420px]:flex-col">
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <Label htmlFor={`${uid}-start`} required trailing=" ">
              Start date
            </Label>
            <input
              ref={startRef}
              id={`${uid}-start`}
              type={live ? 'month' : 'text'}
              max={live ? new Date().toISOString().slice(0, 7) : undefined}
              value={start}
              aria-required="true"
              aria-invalid={invalid.start || undefined}
              onChange={(e) => {
                setStart(e.target.value);
                setInvalid((v) => ({ ...v, start: false }));
              }}
              className={INPUT_BASE}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <Label
              htmlFor={`${uid}-end`}
              required={live && !current}
              trailing={live ? (current ? 'Present' : ' ') : 'Optional'}
            >
              End date
            </Label>
            {live && !current ? (
              <input
                ref={endRef}
                id={`${uid}-end`}
                type="month"
                min={start || undefined}
                max={new Date().toISOString().slice(0, 7)}
                value={end}
                aria-required="true"
                aria-invalid={invalid.end || undefined}
                onChange={(e) => {
                  setEnd(e.target.value);
                  setInvalid((v) => ({ ...v, end: false }));
                  setError('');
                }}
                className={INPUT_BASE}
              />
            ) : (
              <input
                id={`${uid}-end`}
                type="text"
                value={current ? 'Present' : end}
                readOnly={current}
                onChange={(e) => setEnd(e.target.value)}
                className={INPUT_BASE}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            role="switch"
            aria-checked={current}
            aria-labelledby={`${uid}-now`}
            onClick={() => {
              log('branch', { current: !current });
              setCurrent((c) => !c);
            }}
            className={classNames(
              'relative h-[24px] w-[40px] shrink-0 cursor-pointer rounded-[12px] transition-colors',
              current ? 'bg-[#387440]' : 'bg-[#bfbfbf]',
              FOCUS_RING
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                'absolute top-[3px] size-[18px] rounded-full bg-white transition-[left]',
                current ? 'left-[19px]' : 'left-[3px]'
              )}
            />
          </button>
          <span
            id={`${uid}-now`}
            className="text-[14px] leading-[normal] font-medium text-[#1c2a21]"
          >
            I’m doing this now
          </span>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[8px]">
            <Label htmlFor={`${uid}-desc`} required trailing="*">
              What did you do?
            </Label>
            <textarea
              ref={descRef}
              id={`${uid}-desc`}
              value={desc}
              maxLength={DESC_LIMIT}
              placeholder="e.g. Built a churn report in SQL that helped the team win back 120 customers"
              aria-required="true"
              aria-invalid={invalid.desc || undefined}
              onChange={(e) => {
                setDesc(e.target.value);
                setInvalid((v) => ({ ...v, desc: false }));
              }}
              className="block h-[112px] w-full resize-none rounded-[10px] border border-[#ccc] bg-white py-[13px] pr-[16px] pl-[20px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none placeholder:text-[#1c2a21] focus:border-2 focus:border-[#c1d4c4] focus:py-[12px] focus:pr-[15px] focus:pl-[19px] aria-[invalid=true]:border-[#c0392b]"
            />
          </div>
          <div className="flex items-center gap-[8px]">
            {/* No writing-help backend yet: demo only. */}
            {!live && (
              <button
                type="button"
                onClick={() => log('chip', 'Help me write it (no backend)')}
                className={classNames(
                  'inline-flex h-[32px] shrink-0 cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#595959]',
                  FOCUS_RING
                )}
              >
                Help me write it
              </button>
            )}
            <span className="h-px min-w-px flex-1" aria-hidden="true" />
            <span
              aria-live="polite"
              className="text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#737373]"
            >
              {desc.length} / {DESC_LIMIT}
            </span>
          </div>
        </div>

        {!live && (
          <div className="flex flex-col gap-[6px]">
            <p className="text-[14px] leading-[normal] font-medium text-[#1c2a21]">Skills used</p>
            <div className="flex flex-wrap items-start gap-[8px]">
              {skills.map((s) => (
                <SkillChip
                  key={s}
                  label={s}
                  onRemove={() => {
                    log('skill removed', s);
                    setSkills((l) => l.filter((x) => x !== s));
                  }}
                />
              ))}
              {addingSkill ? (
                <input
                  ref={skillInputRef}
                  autoFocus
                  aria-label="Add skill"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onBlur={addSkill}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    } else if (e.key === 'Escape') {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation?.();
                      setSkillDraft('');
                      setAddingSkill(false);
                    }
                  }}
                  className="h-[28px] w-[110px] rounded-full border border-dashed border-[#bfbfbf] bg-transparent px-[12px] text-[12px] leading-[normal] font-semibold text-[#2d5d33] outline-none focus:border-[#387440]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingSkill(true)}
                  className={classNames(
                    'cursor-pointer rounded-full border border-dashed border-[#bfbfbf] px-[12px] py-[6px] text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#2d5d33]',
                    FOCUS_RING
                  )}
                >
                  + Add skill
                </button>
              )}
            </div>
          </div>
        )}

        {error ? (
          <p role="alert" className="text-[13px] leading-[normal] font-medium text-[#c0392b]">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-[10px] pt-[6px]">
          <p className="flex min-w-0 flex-1 items-center gap-[5px] text-[12px] leading-[normal] text-[#737373]">
            <ProfileEditDraftLockIcon className="size-[14px] shrink-0" />
            {live ? 'Nothing is saved until you hit Add' : 'Saved as draft until you hit Add'}
          </p>
          <Button variant="tertiary" size="sm" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            {saving ? 'Saving…' : 'Add to profile'}
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default AddExperienceModal;
