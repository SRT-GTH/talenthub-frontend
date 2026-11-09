import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../recruiterDashboard/renderWorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import Button from '../../ui/Button.jsx';
import BannerToast from '../../ui/BannerToast.jsx';
import { debug } from '../../../utils/debug.js';
import {
  fetchMyPostings,
  fetchSavedCriteria,
  fetchScreeningSetup,
  moveToScreening,
  runScreening,
  saveCriteria,
} from '../../../services/recruiterScreening.api.js';
import ScreeningResults from './ScreeningResults.jsx';
import {
  CriteriaEducationIcon,
  CriteriaExperienceIcon,
  CriteriaSkillsIcon,
  CriteriaToggle,
  LocationMatchIcon,
} from './jobScreeningIcons.jsx';
import { PAGE_HEADING, PAGE_SUBHEADING } from './jobScreeningData.js';

const log = debug('LiveJobScreening');

/*
 * LiveJobScreening - the screening criteria builder and its results for a signed-in recruiter (Figma JS-01 … JS-14,
 * same route /recruiter/job-screening). The demo page (JobScreeningSection) keeps every mock frame addressable by URL.
 *   ?posting=<id>                the posting being screened (default: the newest one with applicants)
 *   ?results=meet|close|dont     the results of the last run (in memory: a reload goes back to the criteria)
 * Criteria: minimum experience, required skills, minimum education, location; each has its own switch. Screening
 * moves nobody: "Move N to Pipeline" moves the selected people to Screening, "Move anyway" one close match.
 */

const EXPERIENCE = [
  { id: '0-2', label: '0–2 years', min: 0, max: 2 },
  { id: '2-5', label: '2–5 years', min: 2, max: 5 },
  { id: '5-10', label: '5–10 years', min: 5, max: 10 },
  { id: '10-plus', label: '10+ years', min: 10 },
];
const EDUCATION = [
  { id: 'diploma', label: 'Diploma or HND' },
  { id: 'bachelors', label: 'Bachelor’s degree' },
  { id: 'masters', label: 'Master’s degree' },
];
const REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Western North',
  'Central',
  'Eastern',
  'Volta',
  'Oti',
  'Northern',
  'Savannah',
  'North East',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
];

const BLANK = {
  on: { experience: false, skills: true, education: false, location: false },
  experience: '2-5',
  skills: [],
  education: 'bachelors',
  region: '',
};

const expIdFor = (e) => {
  if (!e) return null;
  return (
    EXPERIENCE.find((x) => x.min === e.min && x.max === e.max)?.id ||
    EXPERIENCE.reduce((best, x) => (x.min <= e.min ? x : best), EXPERIENCE[0]).id
  );
};

/** Screen state -> the criteria the API takes (switched-off ones left out). */
const toCriteria = (s) => {
  const exp = EXPERIENCE.find((x) => x.id === s.experience);
  return {
    ...(s.on.experience && exp
      ? { experience: { min: exp.min, ...(exp.max ? { max: exp.max } : {}) } }
      : {}),
    ...(s.on.skills && s.skills.length ? { skills: s.skills } : {}),
    ...(s.on.education ? { education: s.education } : {}),
    ...(s.on.location && s.region ? { location: { region: s.region } } : {}),
  };
};

/** Saved criteria -> screen state. */
const fromCriteria = (c = {}, fallbackRegion = '') => ({
  on: {
    experience: Boolean(c.experience),
    skills: Boolean(c.skills?.length),
    education: Boolean(c.education),
    location: Boolean(c.location),
  },
  experience: expIdFor(c.experience) || BLANK.experience,
  skills: c.skills || [],
  education: c.education || BLANK.education,
  region: c.location?.region || fallbackRegion,
});

const describe = (c) => {
  const parts = [];
  if (c.experience)
    parts.push(`${c.experience.min}${c.experience.max ? `–${c.experience.max}` : '+'} yrs`);
  if (c.skills) parts.push(`${c.skills.length} skill${c.skills.length === 1 ? '' : 's'}`);
  if (c.education) parts.push(EDUCATION.find((e) => e.id === c.education)?.label);
  if (c.location) parts.push(c.location.region);
  return parts.join(' · ') || 'No criteria';
};

const FIELD =
  'h-[44px] w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[12px] font-sans text-[14px] text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const Card = ({ icon, title, description, on, onToggle, children }) => (
  <section className="flex flex-col gap-[12px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.04)]">
    <div className="flex items-start gap-[12px]">
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <h2 className="m-0 font-sans text-[16px] leading-[24px] font-semibold text-[#111]">
          {title}
        </h2>
        <p className="m-0 font-sans text-[13px] leading-[20px] text-[#575755]">{description}</p>
      </div>
      <CriteriaToggle checked={on} onToggle={onToggle} label={title} />
    </div>
    {on ? children : null}
  </section>
);

const LiveJobScreening = () => {
  useScopedRoundedFont('data-recruiter-ui');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const postingId = params.get('posting');
  const resultsTab = params.get('results');
  const [postings, setPostings] = useState(null);
  const [setup, setSetup] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDefault, setSaveDefault] = useState(false);
  const [query, setQuery] = useState('');

  const patch = (changes, opts) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, opts);
  };

  // Postings and saved criteria, once.
  useEffect(() => {
    let alive = true;
    Promise.all([fetchMyPostings().catch(() => []), fetchSavedCriteria().catch(() => [])]).then(
      ([list, s]) => {
        if (!alive) return;
        const usable = list.filter((p) => !['draft', 'archived'].includes(p.status));
        setPostings(usable);
        setSaved(s);
        log('loaded', { postings: usable.length, saved: s.length });
        if (!postingId && usable.length) {
          const first =
            usable.find((p) => (p.applicationCount || p.applicationsCount || 0) > 0) || usable[0];
          patch({ posting: String(first._id || first.id) }, { replace: true });
        }
      }
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The chosen posting: applicants to screen + suggestions; start from the default saved criteria or the suggestions.
  useEffect(() => {
    if (!postingId) return undefined;
    let alive = true;
    setSetup(null);
    setResult(null);
    fetchScreeningSetup(postingId)
      .then((out) => {
        if (!alive) return;
        setSetup(out);
        const forJob = saved.find((s) => s.jobId === postingId) || saved.find((s) => s.isDefault);
        if (forJob) setForm(fromCriteria(forJob.criteria, out.suggestions?.region || ''));
        else
          setForm({
            ...BLANK,
            on: { ...BLANK.on, experience: Boolean(out.suggestions?.experience) },
            experience: expIdFor(out.suggestions?.experience) || BLANK.experience,
            region: out.suggestions?.region || '',
          });
      })
      .catch((err) => {
        log.error('setup failed:', err?.response?.status);
        if (alive) setError('We couldn’t load this posting.');
      });
    return () => {
      alive = false;
    };
    // saved changes only matter when the posting changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postingId]);

  const criteria = useMemo(() => toCriteria(form), [form]);
  const set = (changes) => setForm((f) => ({ ...f, ...changes }));
  const toggle = (id) => setForm((f) => ({ ...f, on: { ...f.on, [id]: !f.on[id] } }));
  const addSkill = (name) => {
    const s = String(name || '').trim();
    if (
      !s ||
      form.skills.some((x) => x.toLowerCase() === s.toLowerCase()) ||
      form.skills.length >= 12
    )
      return;
    set({ skills: [...form.skills, s], on: { ...form.on, skills: true } });
    setSkillInput('');
  };

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      const out = await runScreening(postingId, criteria);
      log('screened', out.counts);
      setResult(out);
      setQuery('');
      patch({ results: 'meet' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Screening didn’t run. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const onSave = async () => {
    try {
      const list = await saveCriteria({
        name: saveName.trim(),
        criteria,
        jobId: postingId,
        isDefault: saveDefault,
      });
      setSaved(list);
      setSaveOpen(false);
      setToast({ title: 'Criteria saved', message: `Saved as “${saveName.trim()}”` });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save the criteria.');
    }
  };

  const move = async (ids, { stay } = {}) => {
    setBusy(true);
    const moved = await moveToScreening(ids);
    setBusy(false);
    log('moved', { asked: ids.length, moved });
    if (stay) {
      setResult((r) => ({
        ...r,
        close: r.close.filter((x) => !ids.includes(x.id)),
        counts: { ...r.counts, close: r.counts.close - moved },
      }));
      setToast({
        title: moved ? 'Moved to Screening' : 'Not moved',
        message: moved ? 'They’re in the pipeline now.' : 'Try again.',
      });
      return;
    }
    navigate(`/recruiter/application-pipeline?posting=${postingId}&handoff=${moved}`);
  };

  const posting = postings?.find((p) => String(p._id || p.id) === postingId);

  if (resultsTab && result) {
    const tab = ['meet', 'close', 'dont'].includes(resultsTab) ? resultsTab : 'meet';
    return (
      <DashboardShell renderSidebar={renderWorkspaceSidebar}>
        <ScreeningResults
          job={{ title: result.job?.title || posting?.title || 'This posting' }}
          counts={{ screened: result.screened, ...result.counts }}
          tab={tab}
          mode="list"
          query={query}
          onTab={(t) => patch({ results: t })}
          onQuery={setQuery}
          onBack={() => patch({ results: null })}
          onAdjust={() => patch({ results: null })}
          onMove={() => {}}
          onApplySuggestion={() => {}}
          onReviewClose={() => patch({ results: 'close' })}
          onInvite={() => navigate('/recruiter/talent-search')}
          live={{
            rows: { meet: result.meet, close: result.close, dont: result.dont },
            subtitle: `${result.job?.title || ''} · ${describe(result.criteria || {})} · run just now`,
            busy,
            onMoveSelected: (ids) => move(ids),
            onMoveAnyway: (row) => move([row.id], { stay: true }),
            onViewProfile: () => navigate(`/recruiter/application-pipeline?posting=${postingId}`),
          }}
        />
        {toast ? (
          <BannerToast
            tone="success"
            title={toast.title}
            message={toast.message}
            duration={6000}
            onClose={() => setToast(null)}
          />
        ) : null}
      </DashboardShell>
    );
  }

  const suggestions = (setup?.suggestions?.skills || []).filter(
    (s) => !form.skills.some((x) => x.toLowerCase() === s.name.toLowerCase())
  );

  return (
    <DashboardShell renderSidebar={renderWorkspaceSidebar}>
      <div className="flex w-full flex-col gap-[24px] py-[32px] pr-[clamp(16px,3.24vw,56px)] pl-[clamp(16px,2.3vw,40px)] max-md:gap-[12px] max-md:py-[12px]">
        <div className="flex flex-col gap-[16px] max-md:gap-[8px]">
          <RecruiterPageHeading
            lead={PAGE_HEADING.lead}
            accent={PAGE_HEADING.accent}
            subtitle={PAGE_SUBHEADING}
            titleStyle="sans-accent"
          />
          <RecruiterJobTabs />
        </div>

        {postings && postings.length === 0 ? (
          <p className="m-0 font-sans text-[14px] text-[#575755]">
            You have no postings to screen yet. Post a job first, then come back when people apply.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-[16px]">
              <label className="flex w-full max-w-[431px] flex-col gap-[8px]">
                <span className="font-sans text-[14px] leading-6 font-medium tracking-[0.2px] text-black">
                  Applying to <span className="text-[#2e8b57]">*</span>
                </span>
                <select
                  className={FIELD}
                  value={postingId || ''}
                  onChange={(e) => patch({ posting: e.target.value, results: null })}
                >
                  {(postings || []).map((p) => (
                    <option key={p._id || p.id} value={String(p._id || p.id)}>
                      {p.title}
                      {p.location?.city || p.location?.region
                        ? ` — ${p.location.city || p.location.region}`
                        : ''}
                    </option>
                  ))}
                </select>
              </label>
              {saved.length ? (
                <label className="flex w-full max-w-[300px] flex-col gap-[8px]">
                  <span className="font-sans text-[14px] leading-6 font-medium tracking-[0.2px] text-black">
                    Load saved criteria
                  </span>
                  <select
                    className={FIELD}
                    value=""
                    onChange={(e) => {
                      const s = saved.find((x) => x.name === e.target.value);
                      if (s) setForm(fromCriteria(s.criteria, setup?.suggestions?.region || ''));
                    }}
                  >
                    <option value="">Choose…</option>
                    {saved.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                        {s.isDefault ? ' (default)' : ''} · {describe(s.criteria)}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex flex-col gap-[16px]">
                <Card
                  icon={<CriteriaExperienceIcon className="h-[16px] w-[20px]" />}
                  title="Minimum experience"
                  description="Total years in work listed on the profile."
                  on={form.on.experience}
                  onToggle={() => toggle('experience')}
                >
                  <select
                    className={`${FIELD} max-w-[240px]`}
                    aria-label="Years of experience"
                    value={form.experience}
                    onChange={(e) => set({ experience: e.target.value })}
                  >
                    {EXPERIENCE.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                </Card>

                <Card
                  icon={<CriteriaSkillsIcon className="size-[20px]" />}
                  title="Required skills"
                  description="Applicants must list every one of these skills."
                  on={form.on.skills}
                  onToggle={() => toggle('skills')}
                >
                  <div className="flex flex-wrap gap-[8px]">
                    {form.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[12px] py-[4px] font-sans text-[13px] font-medium text-[#2a5730]"
                      >
                        {s}
                        <button
                          type="button"
                          aria-label={`Remove ${s}`}
                          onClick={() => set({ skills: form.skills.filter((x) => x !== s) })}
                          className="cursor-pointer border-0 bg-transparent p-0 text-[16px] leading-none text-[#2a5730]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {form.skills.length === 0 ? (
                      <span className="font-sans text-[13px] text-[#575755]">
                        No skills yet. Add one below.
                      </span>
                    ) : null}
                  </div>
                  <form
                    className="flex flex-wrap gap-[8px]"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addSkill(skillInput);
                    }}
                  >
                    <input
                      className={`${FIELD} max-w-[280px]`}
                      aria-label="Add a skill"
                      placeholder="Add a skill, e.g. Excel"
                      value={skillInput}
                      maxLength={60}
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                    <Button variant="tertiary" type="submit" disabled={!skillInput.trim()}>
                      Add skill
                    </Button>
                  </form>
                  {suggestions.length ? (
                    <div className="flex flex-col gap-[6px]">
                      <span className="font-sans text-[12px] font-medium tracking-[0.4px] text-[#575755]">
                        LISTED BY YOUR APPLICANTS
                      </span>
                      <div className="flex flex-wrap gap-[8px]">
                        {suggestions.map((s) => (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() => addSkill(s.name)}
                            className="cursor-pointer rounded-full border border-solid border-[#dbded9] bg-white px-[12px] py-[4px] font-sans text-[13px] text-[#111] hover:bg-[#f6f6f6]"
                          >
                            + {s.name} · {s.applicants}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>

                <Card
                  icon={<CriteriaEducationIcon className="h-[18px] w-[22px]" />}
                  title="Minimum education"
                  description="A course still in progress counts one level lower."
                  on={form.on.education}
                  onToggle={() => toggle('education')}
                >
                  <select
                    className={`${FIELD} max-w-[240px]`}
                    aria-label="Minimum education"
                    value={form.education}
                    onChange={(e) => set({ education: e.target.value })}
                  >
                    {EDUCATION.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                </Card>

                <Card
                  icon={<LocationMatchIcon className="size-[20px]" />}
                  title="Location"
                  description="Applicants based in this region."
                  on={form.on.location}
                  onToggle={() => toggle('location')}
                >
                  <select
                    className={`${FIELD} max-w-[240px]`}
                    aria-label="Region"
                    value={form.region}
                    onChange={(e) => set({ region: e.target.value })}
                  >
                    <option value="">Choose a region</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Card>
              </div>

              <aside className="flex h-fit flex-col gap-[12px] rounded-[16px] border border-solid border-[#00522b]/10 bg-[#f3f8f4] p-[20px]">
                <span className="font-sans text-[13px] font-medium tracking-[0.4px] text-[#387440]">
                  READY TO SCREEN
                </span>
                <p className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#111]">
                  {setup ? setup.applicants : '…'}
                </p>
                <p className="m-0 font-sans text-[14px] leading-[22px] text-[#575755]">
                  {setup && setup.applicants === 0
                    ? 'No one is waiting at Applied or Screening for this posting yet.'
                    : 'Applicants at Applied or Screening. Nobody is moved until you choose.'}
                </p>
                <p className="m-0 font-sans text-[13px] leading-[20px] text-[#575755]">
                  {describe(criteria)}
                </p>
                {error ? (
                  <p role="alert" className="m-0 font-sans text-[13px] text-[#c0392b]">
                    {error}
                  </p>
                ) : null}
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!setup || !setup.applicants || busy}
                  onClick={run}
                >
                  {busy ? 'Screening…' : `Screen ${setup?.applicants || 0} applicants`}
                </Button>
                {saveOpen ? (
                  <div className="flex flex-col gap-[8px]">
                    <input
                      className={FIELD}
                      aria-label="Name these criteria"
                      placeholder="Name, e.g. Graduate screening"
                      value={saveName}
                      maxLength={60}
                      onChange={(e) => setSaveName(e.target.value)}
                    />
                    <label className="flex items-center gap-[8px] font-sans text-[13px] text-[#111]">
                      <input
                        type="checkbox"
                        checked={saveDefault}
                        onChange={(e) => setSaveDefault(e.target.checked)}
                      />
                      Use for my new postings
                    </label>
                    <div className="flex gap-[8px]">
                      <Button variant="tertiary" onClick={() => setSaveOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!saveName.trim()}
                        onClick={onSave}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="tertiary" onClick={() => setSaveOpen(true)}>
                    Save as template
                  </Button>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
      {toast ? (
        <BannerToast
          tone="success"
          title={toast.title}
          message={toast.message}
          duration={6000}
          onClose={() => setToast(null)}
        />
      ) : null}
    </DashboardShell>
  );
};

export default LiveJobScreening;
