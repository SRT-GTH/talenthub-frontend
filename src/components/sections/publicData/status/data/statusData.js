/*
 * statusData — copy and sample values of the Theme 8 edge states (Figma canvas 8477:209484: 8.9.3b 404 8508:353043, 8.9.3c 500 8508:353122,
 * 8.9.3d maintenance 8508:353197, 8.9.3e offline 8508:353278). All text VERBATIM from the frames (curly apostrophes, middle dots).
 * Sample content only: the reference code, dates and the maintenance window are sample data; a real API would return them.
 */

// ---- status pages (one entry per `kind` of PublicStatusPage) ----
export const STATUS_PAGES = {
  404: {
    title: 'We couldn’t find that page',
    eyebrow: 'Error 404',
    message:
      'The link may be old, or the region or view no longer exists. All public data is still available from the pages below.',
    primaryLabel: 'Go to national snapshot',
    secondaryLabel: 'Browse regions',
    searchPlaceholder: 'Search regions, partners or opportunities',
  },
  500: {
    title: 'Something went wrong on our side',
    eyebrow: 'Error 500',
    message:
      'We’re already looking into it. Try again in a minute. If you are presenting, the last PDF snapshot you downloaded still works offline.',
    primaryLabel: 'Try again',
    secondaryLabel: 'Check service status',
    reference: 'Reference: GTH-500-7F3A · 17 Oct 2026, 14:06 GMT',
  },
  maintenance: {
    title: 'We’re updating the public data',
    eyebrow: 'Scheduled maintenance',
    window: 'Started 14:00 · back by 16:00 GMT',
    message:
      'Ghana Talent Hub’s public pages will be back by 16:00 GMT today. Talent and partner accounts are not affected.',
    primaryLabel: 'Get notified when we’re back',
    secondaryLabel: 'Download last snapshot (PDF)',
    freshnessLabel: 'Paused for maintenance',
  },
};

// ⚠️ ASSUMPTION: Figma draws "Check service status" but no status page exists; it opens this internal route until a real URL is given.
export const SERVICE_STATUS_PATH = '/data/maintenance';

// ---- offline state ----
export const OFFLINE_COPY = {
  // `{time}` is replaced with the cache time, e.g. "09:12"
  banner: 'You’re offline. Showing data saved at {time} today, so some numbers may be out of date.',
  retry: 'Retry connection',
  freshness: 'Offline · showing cached data from {time}',
};

// ⚠️ ASSUMPTION: when ?state=offline forces the frame and nothing is cached yet, the drawn time stands in for the cache time.
export const OFFLINE_DEMO_TIME = '09:12';
