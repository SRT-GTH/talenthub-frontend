import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import InstitutionAddStudentDialog from '../../components/sections/institution/roster/InstitutionAddStudentDialog.jsx';
import InstitutionConsentDialog from '../../components/sections/institution/roster/InstitutionConsentDialog.jsx';
import InstitutionRemoveDialog from '../../components/sections/institution/roster/InstitutionRemoveDialog.jsx';
import InstitutionRosterBanner from '../../components/sections/institution/roster/InstitutionRosterBanner.jsx';
import InstitutionRosterEmpty from '../../components/sections/institution/roster/InstitutionRosterEmpty.jsx';
import InstitutionRosterPager from '../../components/sections/institution/roster/InstitutionRosterPager.jsx';
import InstitutionRosterRow from '../../components/sections/institution/roster/InstitutionRosterRow.jsx';
import InstitutionRosterSelectionBar from '../../components/sections/institution/roster/InstitutionRosterSelectionBar.jsx';
import InstitutionRosterTabs from '../../components/sections/institution/roster/InstitutionRosterTabs.jsx';
import InstitutionRosterToast from '../../components/sections/institution/roster/InstitutionRosterToast.jsx';
import InstitutionRosterToolbar from '../../components/sections/institution/roster/InstitutionRosterToolbar.jsx';
import InstitutionStudentRecord from '../../components/sections/institution/roster/InstitutionStudentRecord.jsx';
import InstitutionTransferDialog from '../../components/sections/institution/roster/InstitutionTransferDialog.jsx';
import InstitutionUploadDialog from '../../components/sections/institution/roster/InstitutionUploadDialog.jsx';
import {
  PAGE_SIZE,
  SEED_STUDENTS,
} from '../../components/sections/institution/roster/data/rosterData.js';
import { formatRosterCount } from '../../components/sections/institution/roster/rosterFormat.js';
import {
  rosterActions,
  rosterCounts,
  useRosterStore,
} from '../../components/sections/institution/roster/rosterStore.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionStudentsPage');

/*
 * InstitutionStudentsPage — the student roster (Figma 11.2.2a-l, canvas 8520:10). Package B. Mock in-memory store (rosterStore.js), no API.
 * Routes: /institution/students (list) · /institution/students/new (the add-one dialog over the list) · /institution/students/:studentId (the student record, 11.2.2j).
 * URL KEYS (shared keys from institutionState.js plus the ones this page owns; every Figma frame is a URL):
 *   modal=add-student | upload | remove | transfer | consent     the dialog that is open (11.2.2b, c, e, f, i)
 *   state=empty                                                  a new institution: 0 students (11.2.2l; the chrome draws 0 % and 0 · 0 · 0)
 *   state=checking | review | errors  (with modal=upload)        the CSV flow step (11.2.2g, h, d); no state = the file / mapping step (11.2.2c)
 *   student=<id>                                                 who the remove / transfer dialog is about (default: Yaw Adomako / Kofi Danso, as drawn)
 *   filter=linked | not-linked                                   the filter chips (11.2.2k = not-linked)
 *   form=1 | 2 | 3 | graduates                                   the class tab (default 3, the one Figma fills)
 *   q=<text>  sort=surname-az | surname-za | profile  view=cards  page=<n>
 * ⚠️ ASSUMPTIONS: the search field, sort options, cards view, pagination (only when more than 6 rows match) and the status lines are not drawn; the list shows the Form 3 rows of the
 * frames, the other class tabs have no sample rows; the default sort ("Surname A–Z" is the drawn label) keeps the drawn row order until the admin picks a sort.
 */

const MODALS = ['add-student', 'upload', 'remove', 'transfer', 'consent'];
const MATCH = (s, q) => `${s.name} ${s.programme}`.toLowerCase().includes(q.trim().toLowerCase());
const surname = (s) => s.name.split(' ').at(-1);
const SORTERS = {
  'surname-az': (a, b) => surname(a).localeCompare(surname(b)),
  'surname-za': (a, b) => surname(b).localeCompare(surname(a)),
  profile: (a, b) => b.profile - a.profile,
};
const ZERO = {
  total: 0,
  tabs: { 1: 0, 2: 0, 3: 0, graduates: 0 },
  all: 0,
  linked: 0,
  notLinked: 0,
};

const InstitutionStudentsPage = () => {
  const data = useInstitutionState();
  const store = useRosterStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { studentId } = useParams();
  const { params, update, modal, state } = data;
  const isNew = /\/students\/new\/?$/.test(pathname);
  const empty = state === 'empty';
  const formTab = ['1', '2', '3', 'graduates'].includes(params.get('form'))
    ? params.get('form')
    : '3';
  const filter = ['linked', 'not-linked'].includes(data.filter) ? data.filter : 'all';
  const view = params.get('view') === 'cards' ? 'cards' : 'list';
  const sortParam = params.get('sort');
  const sort = sortParam ?? 'surname-az';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const q = data.q;

  const counts = useMemo(() => (empty ? ZERO : rosterCounts(store)), [empty, store]);

  const rows = useMemo(() => {
    if (empty || formTab !== '3') return [];
    let list = store.students.filter(
      (s) => filter === 'all' || (filter === 'linked' ? s.linked : !s.linked)
    );
    if (q.trim()) list = list.filter((s) => MATCH(s, q));
    if (sortParam) list = [...list].sort(SORTERS[sortParam] ?? SORTERS['surname-az']);
    return list;
  }, [empty, formTab, store.students, filter, q, sortParam]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // The Not linked filter starts with everyone selected (Figma "6 selected"); the avatar toggles one.
  const [deselected, setDeselected] = useState([]);
  const selectable = filter === 'not-linked';
  const selected = selectable ? visible.filter((s) => !deselected.includes(s.id)) : [];
  useEffect(() => {
    setDeselected([]);
  }, [filter, formTab]);

  useEffect(() => {
    log('mount', { pathname, modal, state, filter, formTab, rows: rows.length });
  }, [pathname, modal, state, filter, formTab, rows.length]);

  const closeModal = useCallback(() => {
    if (isNew) navigate('/institution/students', { replace: true });
    else update({ modal: null, state: null, student: null }, { replace: true });
  }, [isNew, navigate, update]);

  const open = (name, extra = {}) => update({ modal: name, ...extra });
  const openAdd = () => (studentId ? open('add-student') : navigate('/institution/students/new'));
  const set = (patch) => update({ page: null, ...patch }, { replace: true });

  const activeModal = isNew ? 'add-student' : MODALS.includes(modal) ? modal : null;
  const find = (id, fallback) =>
    store.students.find((s) => s.id === id) ?? SEED_STUDENTS.find((s) => s.id === (id ?? fallback));
  const aboutStudent = find(
    params.get('student'),
    activeModal === 'transfer' ? 'kofi-danso' : 'yaw-adomako'
  );
  const recordStudent = studentId ? find(studentId) : null;

  const remind = (s) => {
    log('remind (mock)', s.id);
    rosterActions.toast(`Reminder sent to ${s.name.split(' ')[0]}.`);
  };
  const sendReminders = () => {
    log('send reminders (mock)', selected.length);
    rosterActions.toast(
      `Reminder sent to ${selected.length} student${selected.length === 1 ? '' : 's'} by SMS and email.`
    );
  };

  let body;
  if (studentId) {
    body = recordStudent ? (
      <InstitutionStudentRecord
        student={recordStudent}
        onAction={(id) => open(id, { student: recordStudent.id })}
      />
    ) : (
      <section className="rounded-[20px] border border-solid border-[#e6e6e6] bg-white p-[24px]">
        <h1 className="m-0 font-sans text-[23px] leading-[29px] font-semibold text-[#1c2a21]">
          This student isn’t on your roster
        </h1>
        <p className="mt-[8px] mb-0 font-sans text-[15px] leading-[23px] text-[#595959]">
          They may have been removed or moved to another school.
        </p>
        <Link
          to="/institution/students"
          className="mt-[12px] inline-block font-sans text-[14px] font-semibold text-[#387440]"
        >
          Back to students
        </Link>
      </section>
    );
  } else {
    body = (
      <div className="flex flex-col gap-[24px]">
        <header className="flex flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px] max-sm:leading-[34px]">
              Students
            </h1>
            <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
              {formatRosterCount(counts.total)} on roster
            </span>
          </div>
          <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
            Everyone enrolled at Savannah Hills SHS. Students link their own GTH profiles.
          </p>
        </header>
        <div className="flex flex-col gap-[18px]">
          <InstitutionRosterTabs
            counts={counts.tabs}
            current={formTab}
            onChange={(id) => set({ form: id === '3' ? null : id, filter: null })}
          />
          <InstitutionRosterToolbar
            counts={counts}
            filter={filter}
            onFilter={(id) => set({ filter: id === 'all' ? null : id })}
            view={view}
            onView={(v) => set({ view: v === 'cards' ? 'cards' : null })}
            sort={sort}
            onSort={(v) => set({ sort: v })}
            q={q}
            onQ={(v) => set({ q: v })}
            onAdd={openAdd}
          />
          {empty ? (
            <InstitutionRosterEmpty onUpload={() => open('upload')} onAdd={openAdd} />
          ) : (
            <>
              {formTab === '3' && counts.notLinked > 0 ? (
                <InstitutionRosterBanner>
                  {filter === 'not-linked'
                    ? `Showing the ${counts.notLinked} students who haven’t linked their GTH profile. Select some or all, then send a reminder by SMS and email.`
                    : `${counts.notLinked} students haven’t linked their GTH profile yet. Send them a reminder.`}
                </InstitutionRosterBanner>
              ) : null}
              {selectable && visible.length ? (
                <InstitutionRosterSelectionBar
                  count={selected.length}
                  onClear={() => setDeselected(visible.map((s) => s.id))}
                  onSend={sendReminders}
                />
              ) : null}
              {visible.length ? (
                <div
                  className={
                    view === 'cards'
                      ? 'grid grid-cols-1 gap-[12px] xl:grid-cols-2'
                      : 'flex flex-col gap-[4px] rounded-[22px] border border-solid border-[#e1eae2] bg-white'
                  }
                >
                  {visible.map((s) => (
                    <InstitutionRosterRow
                      key={s.id}
                      student={s}
                      selectable={selectable}
                      selected={!deselected.includes(s.id)}
                      onToggle={(id) =>
                        setDeselected((d) =>
                          d.includes(id) ? d.filter((x) => x !== id) : [...d, id]
                        )
                      }
                      onRemind={remind}
                      className={
                        view === 'cards'
                          ? 'rounded-[22px] border border-solid border-[#e1eae2] bg-white'
                          : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <p
                  role="status"
                  className="m-0 rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[24px] font-sans text-[14px] leading-[20px] text-[#595959]"
                >
                  {formTab !== '3'
                    ? 'This demo roster only has sample students in Form 3.'
                    : 'No students match.'}
                </p>
              )}
              {pages > 1 ? (
                <InstitutionRosterPager
                  page={current}
                  pages={pages}
                  from={(current - 1) * PAGE_SIZE + 1}
                  to={Math.min(rows.length, current * PAGE_SIZE)}
                  total={rows.length}
                  onPage={(n) => update({ page: n === 1 ? null : n }, { replace: true })}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <InstitutionFrame data={data} title={studentId ? 'Student record' : 'Students'}>
      {body}
      {activeModal === 'add-student' ? (
        <InstitutionAddStudentDialog
          onClose={closeModal}
          onUpload={() => {
            if (isNew) navigate('/institution/students?modal=upload', { replace: true });
            else update({ modal: 'upload', state: null }, { replace: true });
          }}
          onConsent={() => open('consent')}
        />
      ) : null}
      {activeModal === 'upload' ? (
        <InstitutionUploadDialog
          stage={['checking', 'review', 'errors'].includes(state) ? state : 'pick'}
          onStage={(s) => update({ state: s === 'pick' ? null : s }, { replace: true })}
          onClose={closeModal}
        />
      ) : null}
      {activeModal === 'remove' && aboutStudent ? (
        <InstitutionRemoveDialog
          student={aboutStudent}
          onClose={closeModal}
          onRemoved={() => {
            if (studentId) navigate('/institution/students', { replace: true });
          }}
        />
      ) : null}
      {activeModal === 'transfer' && aboutStudent ? (
        <InstitutionTransferDialog student={aboutStudent} onClose={closeModal} />
      ) : null}
      {activeModal === 'consent' ? <InstitutionConsentDialog onClose={closeModal} /> : null}
      <InstitutionRosterToast toast={store.toast} onDone={rosterActions.clearToast} />
    </InstitutionFrame>
  );
};

export default InstitutionStudentsPage;
