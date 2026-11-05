import { PUBLIC_COPY_SECTIONS } from './landingHomeCopy.js';
import { TALENT_COPY_SECTIONS } from './portals/talentCopy.js';
import { TALENT_PAGES_COPY_SECTIONS } from './portals/talentPagesCopy.js';
import { PARENT_COPY_SECTIONS } from './portals/parentCopy.js';
import { INSTITUTION_COPY_SECTIONS } from './portals/institutionCopy.js';
import { GOVERNMENT_COPY_SECTIONS } from './portals/governmentCopy.js';
import { AUTO_COPY_SECTIONS } from './portals/autoPortalsAdmin.js';

/*
 * copyRegistry — every section of the site that staff can edit in Site copy, by section id. Used by the admin only (editor, browse
 * list, manifest, preview); the pages themselves import just their own declarations.
 */
export const COPY_SECTIONS = Object.fromEntries(
  [
    ...Object.values(PUBLIC_COPY_SECTIONS),
    ...TALENT_COPY_SECTIONS,
    ...TALENT_PAGES_COPY_SECTIONS,
    ...PARENT_COPY_SECTIONS,
    ...INSTITUTION_COPY_SECTIONS,
    ...GOVERNMENT_COPY_SECTIONS,
    ...AUTO_COPY_SECTIONS,
  ].map((s) => [s.id, s])
);

/** The pages of one portal, for the Site copy list: [{ id, label, sections: [section] }], shared sections apart. */
export const copyPagesOf = (portal) => {
  const pages = new Map();
  const shared = [];
  Object.values(COPY_SECTIONS)
    .filter((s) => s.portal === portal)
    .forEach((s) => {
      const row = {
        id: s.id,
        label: s.label,
        summary: s.fields[0]?.original ?? '',
        text: s.fields.map((f) => f.original).join(' '),
        status: 'default',
        shared: s.shared,
      };
      if (s.shared) {
        shared.push({
          id: `${s.page}-${s.id}`,
          label: s.label,
          status: 'default',
          sections: [row],
        });
        return;
      }
      if (!pages.has(s.page))
        pages.set(s.page, { id: s.page, label: s.pageLabel, status: 'default', sections: [] });
      pages.get(s.page).sections.push(row);
    });
  return { pages: [...pages.values()], shared };
};
