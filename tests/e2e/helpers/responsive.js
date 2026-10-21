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
  // Talent Community v2 (Figma 5456:19207): browse, community page, post page, dialogs
  '/community',
  '/community?view=all',
  '/community?state=loading',
  '/community?q=blockchain',
  '/community?cat=software-engineering&menu=joined',
  '/community?modal=milestone',
  '/community/frontend-devs-ghana',
  '/community/frontend-devs-ghana?joined=1&welcome=1',
  '/community/frontend-devs-ghana?joined=1',
  '/community/frontend-devs-ghana?joined=1&tab=about',
  '/community/frontend-devs-ghana?joined=1&tab=members',
  '/community/agritech-innovators-ghana?joined=1&state=empty',
  '/community/frontend-devs-ghana?joined=1&pending=1',
  '/community/frontend-devs-ghana?joined=1&modal=create',
  '/community/frontend-devs-ghana?joined=1&modal=report',
  '/community/frontend-devs-ghana?joined=1&modal=leave',
  '/community/frontend-devs-ghana?joined=1&modal=milestone',
  '/community/frontend-devs-ghana/post/yaa-first-pr',
  '/community/frontend-devs-ghana/post/yaa-first-pr?modal=report',
  // Engagement revamp (Figma canvas 3125:10352): refreshed manual profile filling, Playful + Focused
  '/profile/filling/interests',
  '/profile/filling/interests?step=areas',
  '/profile/filling/interests?step=specifics',
  '/profile/filling/interests?step=areas&modal=add-area&pick=development',
  '/profile/filling/interests?step=areas&state=complete',
  '/profile/filling/skills',
  '/profile/filling/skills?state=list',
  '/profile/filling/skills?modal=add',
  '/profile/filling/skills?view=lab',
  '/profile/filling/personality',
  '/profile/filling/personality?step=quiz&q=7',
  '/profile/filling/personality?step=quiz&q=7&answer=1',
  '/profile/filling/personality?step=working',
  '/profile/filling/personality?step=result',
  '/profile/filling/personality?step=path',
  '/profile/filling/personality?step=overview',
  '/profile/filling/pitch?mode=record&step=camera',
  '/profile/filling/pitch?mode=record&step=recording',
  '/profile/filling/pitch?mode=upload',
  '/profile/filling/pitch?mode=upload&step=ready',
  '/profile/filling/pitch?mode=write',
  '/profile/filling/pitch?step=review',
  '/profile/filling/pitch?step=published',
  '/profile/filling/pitch?modal=delete',
  '/profile/engagement/avatar?modal=switch-modes',
  '/profile/filling/certs',
  '/profile/filling/certs?state=list',
  '/profile/filling/certs?modal=add',
  '/profile/filling/certs?modal=edit',
  '/profile/filling/certs?modal=delete',
  '/profile/filling/certs?state=complete',
  // Talent Messages (Figma 7387:104275): inbox, request, cards, dialogs, Help me reply, accessibility, languages
  '/messages',
  '/messages?menu=options',
  '/messages?tab=requests&c=request',
  '/messages?tab=requests&c=request&state=accepted',
  '/messages?modal=not-interested',
  '/messages?modal=pre-apply',
  '/messages?c=applied',
  '/messages?c=interview',
  '/messages?c=interview&state=confirmed',
  '/messages?state=offline',
  '/messages?tab=requests&c=confidential',
  '/messages?c=closed',
  '/messages?state=empty',
  '/messages?state=loading',
  '/messages?c=owura&reply=ideas',
  '/messages?c=owura&reply=writing&hold=1',
  '/messages?c=owura&reply=draft',
  '/messages?c=owura&reply=placed',
  '/messages?a11y=1',
  '/messages?calm=1&read=1&explain=1&large=1',
  '/messages?calm=1&read=playing&explain=1',
  '/messages?explain=open',
  '/messages?lang=menu',
  '/messages?lang=twi',
  '/messages?lang=hausa',
  '/messages?lang=toast',
  '/messages?help=1',
  '/messages?rail=collapsed',
  '/messages?a11y=1&rail=collapsed',
  // Talent Wallet (Figma 8817:693) — phase 1: home, top up, withdraw, transactions, receipt drawer (+ collapsed sidebar)
  '/wallet',
  '/wallet?view=topup',
  '/wallet?view=topup&step=approve',
  '/wallet?view=topup&step=success',
  '/wallet?view=withdraw',
  '/wallet?view=withdraw&step=pin',
  '/wallet?tab=transactions',
  '/wallet?tab=transactions&tx=stipend-sep',
  '/wallet?rail=collapsed',
  '/wallet?tab=transactions&rail=collapsed',
  // Talent Wallet phases 2-5: set-up and KYC, Cycles and savings, under-18, financing, credit score and payouts
  '/wallet?state=new',
  '/wallet?view=kyc',
  '/wallet?view=kyc&step=address',
  '/wallet?view=kyc&step=selfie',
  '/wallet?state=checking',
  '/wallet?state=retake',
  '/wallet?state=activated',
  '/wallet?tab=cycles',
  '/wallet?tab=cycles&toast=cycles',
  '/wallet?tab=cycles&modal=redeem',
  '/wallet?tab=cycles&modal=redeem-short',
  '/wallet?view=savings',
  '/wallet?state=under18',
  '/wallet?state=under18&modal=parent',
  '/wallet?tab=financing',
  '/wallet?tab=financing&stage=apply',
  '/wallet?tab=financing&stage=received',
  '/wallet?tab=financing&stage=offer',
  '/wallet?tab=financing&stage=declined',
  '/wallet?tab=financing&stage=loan',
  '/wallet?tab=credit',
  '/wallet?tab=credit&modal=score',
  '/wallet?view=escrow',
  '/wallet?view=salary',
  '/wallet?toast=salary',
  '/wallet?state=new&rail=collapsed',
  '/wallet?tab=financing&stage=loan&rail=collapsed',
  '/home',
  '/settings/account',
  '/settings/privacy',
  '/settings/notifications',
  '/settings/accessibility',
  '/settings/language',
  '/settings/security',
  '/settings/data',
  '/settings/guardian',
  '/settings/appearance',
  '/home?state=complete&menu=open',
  '/home?state=complete&menu=language',
  '/settings/help',
  '/home?state=complete&dialog=feedback',
  '/home?state=complete&dialog=invite',
  '/settings/account?state=email-error',
  '/settings/privacy?state=hidden',
  '/settings/privacy?state=blocked',
  '/settings/notifications?state=paused',
  '/settings/accessibility?state=unsaved',
  '/settings/accessibility?state=saved',
  '/settings/security?state=password',
  '/settings/security?state=two-step',
  '/settings/security?state=device-logged-out',
  '/settings/data?state=download',
  '/settings/data?state=paused',
  '/settings/data?state=delete',
  '/settings/guardian?state=invite',
  '/home?state=complete&logout=confirm',
  '/logged-out',
  '/home?state=complete&help=page',
  '/home?state=complete&help=searching',
  '/home?state=complete&help=none',
  '/home?state=complete&help=shortcuts',
  '/home?state=complete&help=article',
  '/home?state=complete&help=report',
  '/home?state=complete&help=contact',
  '/home?state=complete&help=sent',
  '/home?state=complete&collapsed=1',
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
  // Talent Skills Lab (Figma 7500:92564): hub, details, Python flow (more labs/games are appended below)
  '/skills-lab',
  '/skills-lab?tab=progress',
  '/skills-lab?tab=verified',
  '/skills-lab?tab=history',
  '/skills-lab?tab=games',
  '/skills-lab?cat=design',
  '/skills-lab?q=Video%20editing',
  '/skills-lab?state=empty',
  '/skills-lab?state=loading',
  '/skills-lab?modal=how',
  '/skills-lab?modal=add',
  '/skills-lab?modal=suggest',
  '/skills-lab?modal=weekly',
  '/skills-lab?toast=suggestion',
  '/skills-lab?tab=history&toast=hidden',
  '/skills-lab?toast=reminder',
  '/skills-lab?tab=history&toast=pdf',
  '/skills-lab/lab/python',
  '/skills-lab/lab/python?modal=restart',
  '/skills-lab/lab/public-speaking',
  '/skills-lab/lab/data-analysis',
  '/skills-lab/lab/python/play',
  '/skills-lab/lab/python/play?modal=leave',
  '/skills-lab/lab/python/play?f=L05',
  '/skills-lab/lab/python/play?f=L06',
  '/skills-lab/lab/python/play?f=L07',
  '/skills-lab/lab/python/play?f=L08',
  '/skills-lab/lab/python/play?f=L09',
  '/skills-lab/lab/python/play?f=L10',
  '/skills-lab/lab/python/play?f=L10b',
  '/skills-lab/lab/python/play?f=L11',
  '/skills-lab/lab/python/play?f=L11b',
  '/skills-lab/lab/engineering-planning/play?f=L14a',
  '/skills-lab/lab/engineering-planning/play?f=L14e',
  '/skills-lab/lab/engineering-planning/play?f=L14b',
  '/skills-lab/lab/engineering-planning/play?f=L14c',
  '/skills-lab/lab/engineering-planning/play?f=L14d',
  '/skills-lab/lab/engineering-planning/play?f=L14g',
  '/skills-lab/lab/engineering-planning/play?f=L14h',
  '/skills-lab/lab/product-management/play?f=L15a',
  '/skills-lab/lab/product-management/play?f=L15e',
  '/skills-lab/lab/product-management/play?f=L15f',
  '/skills-lab/lab/product-management/play?f=L15b',
  '/skills-lab/lab/product-management/play?f=L15c',
  '/skills-lab/lab/product-management/play?f=L15d',
  '/skills-lab/lab/product-management/play?f=L15g',
  '/skills-lab/lab/product-management/play?f=L15h',
  '/skills-lab/lab/data-analysis/play?f=L12a',
  '/skills-lab/lab/data-analysis/play?f=L12b',
  '/skills-lab/lab/data-analysis/play?f=L12c',
  '/skills-lab/lab/data-analysis/play?f=L12d',
  '/skills-lab/lab/data-analysis/play?f=L12e',
  '/skills-lab/lab/data-analysis/play?f=L12f',
  '/skills-lab/lab/data-analysis/play?f=L12g',
  '/skills-lab/lab/data-analysis/play?f=L12h',
  '/skills-lab/lab/ui-ux-design/play?f=L13a',
  '/skills-lab/lab/ui-ux-design/play?f=L13b',
  '/skills-lab/lab/ui-ux-design/play?f=L13c',
  '/skills-lab/lab/ui-ux-design/play?f=L13d',
  '/skills-lab/lab/ui-ux-design/play?f=L13e',
  '/skills-lab/lab/ui-ux-design/play?f=L13g',
  '/skills-lab/lab/ui-ux-design/play?f=L13h',
  '/skills-lab/lab/public-speaking/play?f=L16a',
  '/skills-lab/lab/public-speaking/play?f=L16e',
  '/skills-lab/lab/public-speaking/play?f=L16b',
  '/skills-lab/lab/public-speaking/play?f=L16c',
  '/skills-lab/lab/public-speaking/play?f=L16d',
  '/skills-lab/lab/public-speaking/play?f=L16g',
  '/skills-lab/lab/public-speaking/play?f=L16h',
  '/skills-lab/lab/team-leadership/play?f=L17a',
  '/skills-lab/lab/team-leadership/play?f=L17b',
  '/skills-lab/lab/team-leadership/play?f=L17c',
  '/skills-lab/lab/team-leadership/play?f=L17d',
  '/skills-lab/lab/team-leadership/play?f=L17g',
  '/skills-lab/lab/team-leadership/play?f=L17h',
  '/skills-lab/lab/strategic-thinking/play?f=L18a',
  '/skills-lab/lab/strategic-thinking/play?f=L18b',
  '/skills-lab/lab/strategic-thinking/play?f=L18c',
  '/skills-lab/lab/strategic-thinking/play?f=L18d',
  '/skills-lab/lab/strategic-thinking/play?f=L18g',
  '/skills-lab/lab/strategic-thinking/play?f=L18h',
  '/skills-lab/games/makola-haggle?f=GP03',
  '/skills-lab/games/makola-haggle?f=GP03b',
  '/skills-lab/games/makola-haggle?f=GP04',
  '/skills-lab/games/escape-room?f=GP05',
  '/skills-lab/games/desert-island?f=GP06',
  '/skills-lab/games/trotro-rush?f=GP07',
  '/skills-lab/games/group-chat-drama?f=GP08',
  '/skills-lab/games/speed-sort?f=GP09',
  '/skills-lab/games/tower-builder?f=GP10',
  '/skills-lab/games/the-pitch?f=GP11',
  '/skills-lab/games/ludo-risk?f=GP12',
  '/skills-lab/games/bug-hunt?f=GS02',
  '/skills-lab/games/bug-hunt?f=GS03',
  '/skills-lab/games/bug-hunt?f=GS12',
  '/skills-lab/games/sql-heist?f=GS04',
  '/skills-lab/games/chart-detective?f=GS05',
  '/skills-lab/games/pixel-perfect?f=GS06',
  '/skills-lab/games/sprint-stack?f=GS07',
  '/skills-lab/games/feature-frenzy?f=GS08',
  '/skills-lab/games/crisis-room?f=GS09',
  '/skills-lab/games/formula-rush?f=GS10',
  '/skills-lab/games/chess-blitz?f=GS11',
  // Talent My Assessment (Figma 7962:530): full assessment flow (overview/details/library appended below)
  '/my-assessment/full/typescript',
  '/my-assessment/full/typescript?f=MA-04',
  '/my-assessment/full/typescript?f=MA-05',
  '/my-assessment/full/typescript?f=MA-06',
  '/my-assessment/full/typescript?f=MA-10',
  '/my-assessment/full/typescript?f=MA-11',
  '/my-assessment/full/typescript?f=MA-12',
  '/my-assessment/full/typescript?f=MA-13',
  '/my-assessment/full/typescript?step=play',
  '/my-assessment',
  '/my-assessment?state=first',
  '/my-assessment?state=loading',
  '/my-assessment?state=error',
  '/my-assessment?view=recruiter',
  '/my-assessment?modal=retake',
  '/my-assessment/personality',
  '/my-assessment/skills/python',
  '/my-assessment/skills/firebase',
  '/my-assessment/library',
  '/my-assessment/personality?modal=retake',
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
