import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('learning.api');

/*
 * My Learning API (backend services/training.service.js + bookmarks.service.js, gateway /api/guidance).
 *
 *   GET    /guidance/training/courses?search&category&pageSize   { courses[...skillGapIndicator], total }
 *   GET    /guidance/training/history?status                     { enrolments[...progressPercent], total }
 *   POST   /guidance/training/enrol            { courseId }      enrolment (409 DUPLICATE_ENROLMENT if exists)
 *   POST   /guidance/training/progress/:id     { moduleId }      { progress, isComplete }
 *   POST   /guidance/training/complete/:id                       { enrolment, certificateUrl }
 *   GET    /guidance/training/certificates/:id                   { certificateUrl, expiresAt }
 *   GET    /guidance/bookmarks?contentType=course                { items[{ id, contentId, contentTitle, createdAt }] }
 *   POST   /guidance/bookmarks  { contentType:'course', contentId, contentTitle }
 *   DELETE /guidance/bookmarks/:bookmarkId
 *
 * Functions return the unwrapped payload and throw on failure (the data provider decides what the
 * screen shows). Lesson content and quick-check questions have no backend yet (courses only carry
 * `totalModules`), so the player stays on the Figma copy.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchCatalogue = async ({ search, category, pageSize = 50 } = {}) => {
  const params = { pageSize };
  if (search) params.search = search;
  if (category) params.category = category;
  const data = unwrap(await api.get('/guidance/training/courses', { params }));
  log('catalogue', { n: data?.courses?.length, total: data?.total });
  return { courses: data?.courses || [], total: data?.total ?? 0 };
};

export const fetchEnrolments = async ({ status = 'all', pageSize = 50 } = {}) => {
  const data = unwrap(await api.get('/guidance/training/history', { params: { status, pageSize } }));
  log('enrolments', { n: data?.enrolments?.length });
  return data?.enrolments || [];
};

/** Enrol; an existing enrolment (409) is not an error for the caller — it resolves `{ existing: true }`. */
export const enrolInCourse = async (courseId) => {
  try {
    const data = unwrap(await api.post('/guidance/training/enrol', { courseId }));
    log('enrolled', courseId);
    return { enrolment: data, existing: false };
  } catch (err) {
    if (err?.response?.status === 409) {
      log('already enrolled', courseId);
      return { enrolment: null, existing: true };
    }
    throw err;
  }
};

export const completeModule = async (enrolmentId, moduleId) => {
  const data = unwrap(
    await api.post(`/guidance/training/progress/${encodeURIComponent(enrolmentId)}`, { moduleId })
  );
  log('module done', { enrolmentId, moduleId, pct: data?.progress?.progressPercent });
  return data;
};

export const fetchCertificate = async (enrolmentId) =>
  unwrap(await api.get(`/guidance/training/certificates/${encodeURIComponent(enrolmentId)}`));

export const fetchSavedCourses = async () => {
  const data = unwrap(
    await api.get('/guidance/bookmarks', { params: { contentType: 'course', pageSize: 50 } })
  );
  return data?.items || [];
};

export const saveCourse = async ({ id, title }) =>
  unwrap(
    await api.post('/guidance/bookmarks', {
      contentType: 'course',
      contentId: String(id),
      contentTitle: title || 'Course',
    })
  );

export const unsaveCourse = async (bookmarkId) =>
  unwrap(await api.delete(`/guidance/bookmarks/${encodeURIComponent(bookmarkId)}`));
