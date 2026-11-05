import { useEffect } from 'react';

/*
 * useDocumentTitle — sets the page title while a page is mounted ("<title> · Ghana Talent Hub") and restores the previous one on unmount (WCAG 2.4.2 Page Titled: a screen-reader user hears the title first
 * on every navigation, and a browser tab / history entry says where it is). Same format and restore behaviour as pages/publicData/PublicStatusPage.
 * Usage: useDocumentTitle('Help and guides') — pass falsy (e.g. while data is missing) to leave the title alone.
 */
const SUFFIX = 'Ghana Talent Hub';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = `${title} · ${SUFFIX}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
};
