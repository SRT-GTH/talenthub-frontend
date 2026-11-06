/*
 * copyUrl — build a link between Platform Admin 7.8 screens that keeps the mock role of the current screen:
 *   copyUrl(ctx, '/admin/site-copy/section/public.home.hero', { modal: 'publish' })  →  '/admin/site-copy/section/public.home.hero?role=editor&modal=publish'
 * `ctx` is the screen's ctx (siteCopyScreens.js); the `role` query key is carried over when present, other keys are dropped unless
 * listed in `extra` (null / undefined / '' values are skipped).
 */
export const copyUrl = (ctx, path, extra = {}) => {
  const q = new URLSearchParams();
  const role = ctx?.params?.get('role');
  if (role) q.set('role', role);
  Object.entries(extra).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `${path}?${s}` : path;
};

/** The canonical paths of the area (siteCopyScreens.js header). */
export const COPY_PATHS = {
  home: '/admin',
  siteCopy: '/admin/site-copy',
  section: (sectionId) => `/admin/site-copy/section/${sectionId}`,
  preview: (sectionId) => `/admin/site-copy/section/${sectionId}/preview`,
  history: (sectionId) => `/admin/site-copy/section/${sectionId}/history`,
  productNames: '/admin/product-names',
  media: '/admin/media',
};
