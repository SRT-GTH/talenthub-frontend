import { useCallback, useEffect, useMemo, useState } from 'react';
import { LearningDataContext } from './useLearningData.js';
import { debug } from '../../../utils/debug.js';
import {
  completeModule,
  enrolInCourse,
  fetchCatalogue,
  fetchEnrolments,
  fetchSavedCourses,
  saveCourse,
  unsaveCourse,
} from '../../../services/learning.api.js';
import { fetchCoursePage, openCourseOutside } from '../../../services/learningPath.api.js';
import { savedWhen, shortDate, toCourseCard, toProgressItem } from './learningMappers.js';
import { STORAGE_KEYS } from '../../../constants/storageKeys.js';
import {
  ALSO_IN_PROGRESS,
  CERTS,
  CONTINUE,
  COURSES,
  EMPTY,
  RECOMMENDED,
  SAVED,
  SKILL_GAPS,
  savedStore,
  tabCounts,
  useRemovedSaved,
} from './talentLearningHubData.js';

const log = debug('LearningData');

/*
 * LearningDataProvider — one source for every My Learning screen.
 *
 *   live  (default)  GET /guidance/training/courses + /history + /bookmarks, mapped into the same
 *                    shapes as the Figma mock (learningMappers.js); enrol / save / module progress
 *                    write through and refetch.
 *   demo             `?demo=1`, `?empty=1` or `?loading=1` — the Figma frames, exactly as built
 *                    (talentLearningHubData.js). Keeps every frame in wiki/talent-my-learning.md
 *                    reachable for design QA.
 *
 * Screens read `useLearningData()`; they never import the mock constants for content directly.
 */

// The signed-in talent's name (certificate cards). Same stored profile talentHomeState uses.
const storedName = () => {
  try {
    const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
    return [u?.firstName, u?.lastName].filter(Boolean).join(' ') || null;
  } catch {
    return null;
  }
};

const settle = async (label, fn, fallback) => {
  try {
    return await fn();
  } catch (err) {
    log.error(`${label} failed:`, err?.response?.status || err?.message);
    return fallback;
  }
};

const mockData = ({ learning, removed }) => {
  const active =
    learning.view === 'recommended'
      ? 'recommended'
      : learning.view === 'certificates'
        ? 'certificates'
        : learning.tab === 'saved'
          ? 'saved'
          : 'progress';
  const showEmpty = learning.empty && !learning.loading;
  return {
    live: false,
    loading: learning.loading,
    error: false,
    courses: COURSES,
    continueItem: CONTINUE,
    also: ALSO_IN_PROGRESS.items,
    gaps: SKILL_GAPS.items,
    gapsTotal: 8,
    recommended: RECOMMENDED.items,
    emptyPicks: EMPTY.picks,
    saved: SAVED.items.filter((s) => !removed.includes(s.course)),
    savedEmpty: learning.empty,
    certs: CERTS,
    certificates: null,
    hasProgress: !showEmpty,
    counts: tabCounts({
      empty: showEmpty,
      activeTab: active,
      savedEmpty: learning.empty,
      removedCount: removed.length,
    }),
    selectedCourse: null,
    isSaved: () => false,
    enrolmentFor: () => null,
    openCourse: () => learning.update({ view: 'course', tab: null }),
    startCourse: () => learning.update({ view: 'lesson', quick: null }),
    resume: () => learning.update({ view: 'lesson', quick: null }),
    save: () => learning.update({ toast: 'saved' }),
    unsave: (key) => savedStore.remove(key),
    completeModule: async () => null,
    refresh: () => {},
    coursePage: null,
    coursePageStatus: null,
    coursePageCode: null,
    refreshCoursePage: () => {},
    openOutside: () => {},
  };
};

export const LearningDataProvider = ({ learning, children }) => {
  const demo = learning.demo || learning.empty || learning.loading;
  const removed = useRemovedSaved();
  const [state, setState] = useState({
    status: 'loading',
    catalogue: [],
    enrolments: [],
    bookmarks: [],
  });
  const [busy, setBusy] = useState(null); // courseId being enrolled / saved
  // Course pages (learning path iteration 4): progress, short check, player - by course id.
  const [pages, setPages] = useState({});

  const loadPage = useCallback(async (courseId) => {
    if (!courseId) return;
    setPages((p) => ({
      ...p,
      [courseId]: { ...(p[courseId] || {}), status: p[courseId]?.data ? 'ready' : 'loading' },
    }));
    try {
      const data = await fetchCoursePage(courseId);
      setPages((p) => ({ ...p, [courseId]: { status: 'ready', data } }));
    } catch (err) {
      const status = err?.response?.status;
      log.error('course page failed:', status || err?.message);
      setPages((p) => ({
        ...p,
        [courseId]: { status: 'error', code: status || null, data: null },
      }));
    }
  }, []);

  useEffect(() => {
    if (demo || learning.view !== 'course' || !learning.course) return;
    loadPage(learning.course);
  }, [demo, learning.view, learning.course, loadPage]);

  const load = useCallback(async () => {
    const [cat, enrolments, bookmarks] = await Promise.all([
      settle('catalogue', () => fetchCatalogue(), null),
      settle('enrolments', () => fetchEnrolments(), null),
      settle('bookmarks', () => fetchSavedCourses(), []),
    ]);
    if (!cat && !enrolments) {
      setState((s) => ({ ...s, status: 'error' }));
      return;
    }
    setState({
      status: 'ready',
      catalogue: cat?.courses || [],
      catalogueTotal: cat?.total ?? 0,
      enrolments: enrolments || [],
      bookmarks: bookmarks || [],
    });
  }, []);

  useEffect(() => {
    if (demo) return;
    load();
  }, [demo, load]);

  const live = useMemo(() => {
    if (demo) return null;
    const cards = {};
    state.catalogue.forEach((c) => {
      const card = toCourseCard(c);
      cards[card.id] = card;
    });
    // Enrolled courses missing from the catalogue page still need a card.
    state.enrolments.forEach((e) => {
      const cid = String(e.courseId || '');
      if (cid && !cards[cid]) {
        cards[cid] = toCourseCard({ _id: cid, title: e.courseName || 'Course' });
      }
    });

    const items = state.enrolments.map((e) => toProgressItem(e, cards[String(e.courseId)]));
    const inProgress = items.filter((i) => i.status !== 'completed' && i.status !== 'abandoned');
    const completed = items.filter((i) => i.status === 'completed');
    const enrolledIds = new Set(items.map((i) => i.courseId));
    const ranked = state.catalogue.map((c) => String(c._id || c.id)); // backend: highest gap first
    const notStarted = ranked.filter((id) => !enrolledIds.has(id));

    const bookmarkByCourse = {};
    state.bookmarks.forEach((b) => {
      bookmarkByCourse[String(b.contentId)] = b;
    });
    const saved = state.bookmarks
      .filter((b) => cards[String(b.contentId)])
      .map((b) => ({
        course: String(b.contentId),
        bookmarkId: String(b.id || b._id),
        when: savedWhen(b.createdAt),
      }));

    const latest = completed[0];
    const certs = {
      // ⚠️ ASSUMPTION: Figma "4 certificates" / "Latest: … · 12 May" with real values.
      title: `${completed.length} certificate${completed.length === 1 ? '' : 's'}`,
      viewAll: CERTS.viewAll,
      latest: latest
        ? `Latest: ${latest.title} · ${shortDate(latest.completedAt)}`
        : 'Finish a course to earn one',
      skills: [...new Set(completed.flatMap((i) => cards[i.courseId]?.skills || []))].slice(0, 3),
    };

    const [first, ...rest] = inProgress;
    return {
      cards,
      inProgress,
      completed,
      notStarted,
      saved,
      bookmarkByCourse,
      certs,
      continueItem: first
        ? {
            ...CONTINUE,
            left: `${first.pct}% done`, // ⚠️ ASSUMPTION: no time-left data ("18 min left" in Figma)
            title: first.title,
            meta: [first.meta, first.provider].filter(Boolean).join(' · '),
            pct: first.pct,
            cover: first.cover,
            resume: first.nextModule ? `Resume module ${first.nextModule}` : CONTINUE.resume,
            courseId: first.courseId,
            enrolmentId: first.enrolmentId,
          }
        : null,
      also: rest.map((i) => ({ ...i, meta: i.meta })),
    };
  }, [demo, state]);

  const openCourse = useCallback(
    (courseId) => {
      log('open course', courseId);
      learning.update({ view: 'course', tab: null, course: courseId, quick: null, toast: null });
    },
    [learning]
  );

  const enrolmentFor = useCallback(
    (courseId) =>
      live?.inProgress.concat(live.completed).find((i) => i.courseId === String(courseId)) || null,
    [live]
  );

  const startCourse = useCallback(
    async (courseId) => {
      if (!courseId) return;
      setBusy(courseId);
      try {
        await enrolInCourse(courseId);
        await load();
        learning.update({ view: 'lesson', course: courseId, quick: null, tab: null, toast: null });
      } catch (err) {
        log.error('enrol failed:', err?.response?.status || err?.message);
      } finally {
        setBusy(null);
      }
    },
    [learning, load]
  );

  const resume = useCallback(
    (courseId) => learning.update({ view: 'lesson', course: courseId, quick: null, tab: null }),
    [learning]
  );

  const save = useCallback(
    async (courseId) => {
      const card = live?.cards[String(courseId)];
      if (!card || live.bookmarkByCourse[card.id]) return;
      setBusy(courseId);
      try {
        await saveCourse(card);
        await load();
        learning.update({ toast: 'saved' });
      } catch (err) {
        log.error('save failed:', err?.response?.status || err?.message);
      } finally {
        setBusy(null);
      }
    },
    [learning, live, load]
  );

  const unsave = useCallback(
    async (courseId) => {
      const b = live?.bookmarkByCourse[String(courseId)];
      if (!b) return;
      // optimistic: drop it now, refetch after
      setState((s) => ({ ...s, bookmarks: s.bookmarks.filter((x) => x !== b) }));
      try {
        await unsaveCourse(String(b.id || b._id));
      } catch (err) {
        log.error('unsave failed:', err?.response?.status || err?.message);
      }
      load();
    },
    [live, load]
  );

  /** Quick check passed -> record the current module for the selected course's enrolment. */
  const completeCurrentModule = useCallback(
    async (courseId) => {
      const e = enrolmentFor(courseId);
      if (!e || !e.nextModule) return null;
      try {
        const res = await completeModule(e.enrolmentId, `module-${e.nextModule}`);
        await load();
        return res;
      } catch (err) {
        log.error('module progress failed:', err?.response?.status || err?.message);
        return null;
      }
    },
    [enrolmentFor, load]
  );

  /** Open an off-platform course: the window opens now (no popup block), the click-out is logged after. */
  const openOutside = useCallback(
    async (courseId) => {
      const page = pages[courseId]?.data;
      const url = page?.openUrl || live?.cards[String(courseId)]?.externalUrl;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      try {
        await openCourseOutside(courseId);
      } catch (err) {
        log.error('click-out failed:', err?.response?.status || err?.message);
      }
      loadPage(courseId);
    },
    [pages, live, loadPage]
  );

  const value = useMemo(() => {
    if (demo) return mockData({ learning, removed });
    const page = learning.course ? pages[learning.course] : null;
    // A course opened from a learning path may not be on the first catalogue page: use its course page.
    const pageCard =
      page?.data?.course &&
      toCourseCard({
        ...page.data.course,
        _id: page.data.course.id,
        description: page.data.course.summary,
        providerType: page.data.course.source ? 'external' : page.data.course.providerType,
      });
    const loading =
      state.status === 'loading' ||
      (Boolean(learning.course) && !live.cards[learning.course] && page?.status === 'loading');
    const savedCount = live.saved.length;
    return {
      live: true,
      loading,
      talentName: storedName(),
      error: state.status === 'error',
      busy,
      courses: live.cards,
      continueItem: live.continueItem,
      also: live.also,
      gaps: live.notStarted.slice(0, 3),
      gapsTotal: live.notStarted.length,
      recommended: live.notStarted.concat(
        state.catalogue
          .map((c) => String(c._id || c.id))
          .filter((id) => !live.notStarted.includes(id))
      ),
      emptyPicks: live.notStarted.slice(0, 2),
      saved: live.saved,
      savedEmpty: savedCount === 0,
      certs: live.certs,
      certificates: live.completed,
      hasProgress: live.inProgress.length > 0,
      counts: {
        progress: live.inProgress.length,
        recommended: state.catalogueTotal ?? state.catalogue.length,
        saved: savedCount,
        completed: live.completed.length,
        certificates: live.completed.length,
      },
      selectedCourse: learning.course ? live.cards[learning.course] || pageCard || null : null,
      coursePage: page?.data || null,
      coursePageStatus: page?.status || null,
      coursePageCode: page?.code || null,
      refreshCoursePage: () => loadPage(learning.course),
      openOutside,
      isSaved: (id) => Boolean(live.bookmarkByCourse[String(id)]),
      enrolmentFor,
      openCourse,
      startCourse,
      resume,
      save,
      unsave,
      completeModule: completeCurrentModule,
      refresh: load,
    };
  }, [
    demo,
    learning,
    removed,
    state,
    live,
    busy,
    enrolmentFor,
    openCourse,
    startCourse,
    resume,
    save,
    unsave,
    completeCurrentModule,
    load,
    pages,
    loadPage,
    openOutside,
  ]);

  return <LearningDataContext.Provider value={value}>{children}</LearningDataContext.Provider>;
};
