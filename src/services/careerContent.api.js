import api from './api.js';

/*
 * Career exposure content (backend careerContent.service, US-4.1.1-02).
 *   GET /guidance/content/:id   { id, title, type, author, community, url, careerCategory, estimatedMinutes,
 *                                content, videoUrl, link, related: [card] }
 * 404 when the post isn't content for this talent (not a member of its community, held, flagged, by a minor).
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const careerContentApi = {
  item: async (id) => unwrap(await api.get(`/guidance/content/${encodeURIComponent(id)}`)),
};
