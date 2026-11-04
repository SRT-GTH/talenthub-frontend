/*
 * copyAccess — who may do what in the Site copy / Product names / Media library area (Platform Admin 7.8, Figma frame 7.8.7a
 * "Settings → Roles", Playful-free, Focused only). The matrix is read from the frame's "SITE CONTENT · NEW" rows:
 *
 *                       Support  Moderator  Senior  Super  Content Editor
 *   Read site copy        yes      yes       yes     yes     yes
 *   Edit site copy         -        -        yes     yes     yes
 *   Publish site copy      -        -        yes     yes     yes
 *   Rename product names   -        -         -      yes     "Draft only"  (saves a draft; a Super Admin publishes it, 7.8.6e-h)
 *   Data Protection Officer: none (7.8.7d "Site copy isn't part of your role")
 *
 * ⚠️ ASSUMPTION: Media library follows "edit": the roles that can edit (Senior, Super, Content Editor) see it in the nav (7.8.6f /
 * 7.8.7c draw Support with "Site copy" only). ⚠️ ASSUMPTION: no backend role "Content Editor" exists yet, so this whole area runs on
 * mock data and a mock role (`?role=editor`, see useAdminSession) — see wiki/admin.md.
 */
const NONE = {
  read: false,
  edit: false,
  publish: false,
  rename: false,
  renameDraft: false,
  media: false,
};

export const COPY_PERMISSIONS = {
  support: { ...NONE, read: true },
  moderator: { ...NONE, read: true },
  senior: { ...NONE, read: true, edit: true, publish: true, media: true },
  super: { read: true, edit: true, publish: true, rename: true, renameDraft: true, media: true },
  editor: { read: true, edit: true, publish: true, rename: false, renameDraft: true, media: true },
  dpo: NONE,
};

/** The Site copy permissions of a role id (unknown / signed-out roles get none). */
export const copyAccess = (role) => COPY_PERMISSIONS[role] ?? NONE;

/** Nav ids the role sees in the Site copy block (after Reports; the Content Editor's own nav is Home + these). */
export const copyNavIds = (role) => {
  const a = copyAccess(role);
  const ids = [];
  if (a.read) ids.push('site-copy');
  if (a.edit || a.renameDraft || a.rename) ids.push('product-names');
  if (a.media) ids.push('media');
  return ids;
};
