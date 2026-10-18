// @ts-check
// Shared by tests/e2e/responsive.spec.js (the CI gate) and
// scripts/responsive-audit.mjs (fast local sweep). See wiki/responsive-plan.md.

export const ROUTES = [
  '/',
  '/get-started',
  '/login',
  ...[
    'welcome',
    'dob',
    'personal-info',
    'contact',
    'address',
    'education',
    'parent-info',
    'review',
  ].map((s) => `/onboarding/talent/${s}`),
  ...[
    'profile',
    'type',
    'organisation',
    'organisation/create',
    'plan',
    'payment',
    'preferences',
    'review',
    'done',
  ].map((s) => `/onboarding/recruiter/${s}`),
  ...[
    'guidelines',
    'your-institution',
    'contact',
    'activate',
    'template-guide',
    'template',
    'upload',
    'validate',
    'confirm',
    'report',
  ].map((s) => `/onboarding/institution/${s}`),
  ...[
    'parent-login',
    'parent-welcome',
    'parent-identity',
    'parent-verification',
    'parent-contact',
    'parent-security',
    'parent-link-ward',
    'parent-review',
    'parent-done',
    'parent-invited',
    'parent-invited-identity',
    'parent-invited-verification',
    'parent-invited-contact',
    'parent-invited-security',
    'parent-invited-link-ward',
    'parent-invited-consent',
  ].map((s) => `/onboarding/${s}`),
  '/profile/engagement',
  '/profile/engagement/identity',
  '/profile/engagement/milestone',
  '/profile/engagement/milestone/top-20',
  '/profile/engagement/milestone/top-talent',
  '/profile/engagement/avatar',
  '/profile/engagement/avatar/skin',
  '/profile/engagement/avatar/hair',
  '/profile/engagement/avatar/extras',
  '/profile/engagement/avatar/outfit',
  '/profile/filling/interests',
  '/profile/filling/interests/categories',
  '/profile/filling/skills',
  '/profile/filling/skills/categories',
  '/profile/filling/work',
  '/profile/filling/work/history',
  '/profile/filling/portfolio',
  '/profile/filling/portfolio/projects',
  '/profile/filling/certs',
  '/profile/filling/certs/list',
  '/profile/filling/goals',
  '/profile/filling/goals/list',
  '/profile/filling/pitch',
  '/profile/filling/pitch/record',
  '/profile/filling/career-buddy',
  '/skills-lab/team-leadership',
  '/community',
  '/community/frontend-devs-ghana',
  '/home',
  '/learning',
  '/learning?view=course',
  '/learning?view=lesson',
  '/learning?quick=wrong',
  '/learning?view=complete',
  '/learning?view=certificates',
  '/learning?view=recommended',
  '/learning?tab=saved',
  '/learning?view=explore',
  '/learning?view=explore&ex=search',
  '/learning?view=explore&ex=none',
  '/learning?empty=1',
  // Talent notifications (Figma 7471:53182): pop-up states, help overlay, full screen + states
  '/home?notif=open',
  '/home?notif=empty',
  '/home?notif=loading',
  '/home?help=1',
  // Talent job postings (Figma 7503…): lists, empty, loading, collapsed rail
  '/job-postings',
  '/job-postings?view=list',
  '/job-postings?tab=browse',
  '/job-postings?tab=browse&view=cards',
  '/job-postings?tab=saved',
  '/job-postings?tab=saved&view=list',
  '/job-postings?tab=applied',
  '/job-postings?state=empty',
  '/job-postings?state=loading',
  '/job-postings?rail=collapsed',
  '/job-postings?job=data-analyst',
  '/job-postings?job=junior-product-analyst',
  '/job-postings?job=data-analyst&apply=preview',
  '/job-postings?job=data-analyst&apply=projects',
  '/job-postings?job=data-analyst&apply=sent',
  '/job-postings?job=data-analyst&state=applied',
  '/job-postings?job=data-analyst&state=closed',
  '/job-postings?job=data-analyst&apply=preview&state=offline',
  '/job-postings?modal=alerts',
  '/job-postings?modal=notifications',
  '/job-postings?modal=how-match&job=data-analyst',
  '/job-postings?modal=not-for-me',
  '/job-postings?modal=report&job=junior-product-analyst',
  '/job-postings?modal=withdraw&job=data-analyst',
  '/job-postings?tab=applied&withdrawn=1',
  // Talent streak (Figma 7532:2): full page, milestone modal, pop-up states
  '/streak',
  '/streak?milestone=15',
  '/learning?streak=open',
  '/learning?streak=done',
  '/learning?streak=risk',
  '/learning?streak=freeze',
  '/learning?streak=lost',
  '/learning?streak=new',
  '/notifications',
  '/notifications?filter=unread&read=all',
  '/notifications?rail=expanded',
  '/profile',
  '/recruiter/home',
  '/recruiter/talent-search',
  '/recruiter/job-templates',
  '/recruiter/job-postings',
  '/recruiter/job-screening',
  '/recruiter/application-pipeline',
  '/recruiter/messages',
];

export const DEFAULT_WIDTHS = [320, 375, 768, 1024, 1440];

/**
 * Runs inside the page. Returns a list of human-readable violations.
 * @param {{ width: number }} arg
 */
export const probe = ({ width }) => {
  const W = window.innerWidth;
  const de = document.documentElement;
  const SKIP_TAGS = new Set([
    'SCRIPT',
    'STYLE',
    'PATH',
    'LINE',
    'CIRCLE',
    'G',
    'DEFS',
    'RECT',
    'POLYGON',
    'POLYLINE',
    'USE',
    'STOP',
  ]);
  const violations = [];
  const warnings = [];

  const label = (el) =>
    `<${el.tagName.toLowerCase()} class="${(el.getAttribute('class') || '').slice(0, 70)}"> "${(el.textContent || '').trim().slice(0, 24)}"`;

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
    // sr-only pattern
    if (r.width <= 1 || r.height <= 1) return false;
    return true;
  };

  const insideClippingBox = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) {
        const pr = p.getBoundingClientRect();
        if (pr.right <= W + 1 && pr.left >= -1) return true;
      }
    }
    return false;
  };

  // 1. page-level horizontal scroll
  const docOverflow = Math.max(de.scrollWidth, document.body.scrollWidth) - W;
  if (docOverflow > 1) violations.push(`page scrolls horizontally by ${docOverflow}px`);

  // 2. elements poking out of the viewport
  const all = Array.from(document.body.querySelectorAll('*'));
  const poking = [];
  for (const el of all) {
    if (SKIP_TAGS.has(el.tagName.toUpperCase())) continue;
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > W + 1 && !insideClippingBox(el)) {
      const cs = getComputedStyle(el);
      // Decorative, intentionally bleeding layers.
      if (cs.pointerEvents === 'none' && !(el.textContent || '').trim()) continue;
      poking.push({ over: Math.round(r.right - W), el });
    }
  }
  poking.sort((a, b) => b.over - a.over);
  for (const p of poking.slice(0, 3))
    violations.push(`overflows right edge by ${p.over}px: ${label(p.el)}`);

  // 3. tiny text — below lg only: >= lg stays pixel-exact to Figma (plan §3.1)
  const belowLg = width < 1024;
  const tiny = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    const text = n.nodeValue.trim();
    if (!text) continue;
    const el = n.parentElement;
    if (!el || !visible(el) || el.closest('[aria-hidden="true"], svg')) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) tiny.set(`${fs}px "${text.slice(0, 20)}"`, el);
  }
  if (belowLg && tiny.size)
    violations.push(
      `text under 12px (${tiny.size}): ${Array.from(tiny.keys()).slice(0, 4).join(' | ')}`
    );

  // 4. tap targets
  const small = [];
  const smaller44 = [];
  const controls = document.querySelectorAll(
    'button, a[href], [role="button"], [role="tab"], [role="menuitem"], input[type="checkbox"], input[type="radio"]'
  );
  for (const el of controls) {
    let target = el;
    if (el instanceof HTMLInputElement) {
      const lbl =
        el.closest('label') || (el.id ? document.querySelector(`label[for="${el.id}"]`) : null);
      if (lbl) target = lbl;
    }
    if (!visible(target)) continue;
    const r = target.getBoundingClientRect();
    if (r.right < 0 || r.left > W || r.bottom < 0) continue;
    // WCAG 2.5.8 exception: inline links within a sentence.
    if (
      el.tagName === 'A' &&
      el.closest('p, li, span, label') &&
      getComputedStyle(el).display === 'inline'
    )
      continue;
    const m = Math.min(r.width, r.height);
    if (m < 24) small.push(`${Math.round(r.width)}x${Math.round(r.height)} ${label(el)}`);
    else if (m < 44) smaller44.push(1);
  }
  if (belowLg && small.length)
    violations.push(`${small.length} targets under 24px: ${small.slice(0, 3).join(' | ')}`);
  if (smaller44.length && width < 768) warnings.push(`${smaller44.length} targets under 44px`);

  // 5. short button labels must not wrap onto a second line (below lg).
  //    Option cards with descriptions are longer than 32 chars and exempt.
  if (belowLg) {
    const wrapped = [];
    for (const el of document.querySelectorAll('button, [role="button"]')) {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || text.length > 32 || !visible(el)) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const tops = new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top / 4)));
      // multiple text lines => more than one distinct row of text boxes
      const textRows = new Set();
      const walker2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker2.nextNode()) {
        const n = walker2.currentNode;
        if (!n.nodeValue.trim()) continue;
        const r2 = document.createRange();
        r2.selectNodeContents(n);
        for (const rect of r2.getClientRects()) textRows.add(Math.round(rect.top / 4));
      }
      if (textRows.size > 1 && tops.size > 0) wrapped.push(`"${text}"`);
    }
    if (wrapped.length)
      violations.push(`${wrapped.length} button labels wrap: ${wrapped.slice(0, 3).join(' | ')}`);
  }

  return { violations, warnings };
};
