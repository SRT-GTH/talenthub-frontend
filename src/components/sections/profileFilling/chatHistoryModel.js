/*
 * Chat-history model for the Career Buddy drawer (Figma "CHAT HISTORY & NEW CHAT", 9086:71498 / 9086:77035, 21 Oct 2026).
 *
 * A drawer chat = { id, title, preview, topic, icon, group, meta, dateLabel, pinned, active, snippet?, body? }
 *   group      'pinned' | 'today' | 'yesterday' | 'previous7' | 'older'
 *   meta       the label on the row (time today, "Yesterday", weekday, "12 Sep")
 *   dateLabel  the label on a search result ("Today · 2:14 PM", "Yesterday", ...)
 *   topic      the filter chip it belongs to: 'interviews' | 'cv' | 'jobs' | 'learning' | null (only shown under "All")
 *   icon       topic tile glyph: edit | mic | compass | link | cash | sparkle | book | briefcase | mortarboard
 * `FIGMA_CHATS` is the nine chats the frames draw (mock data for the scripted demo); `chatsFromThreads` builds the same shape from the
 * talent's real conversations.
 */

export const GROUPS = [
  { id: 'pinned', label: 'Pinned' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'previous7', label: 'Previous 7 days' },
  { id: 'older', label: 'Older' },
];

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'cv', label: 'CV' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'learning', label: 'Learning' },
];

export const FIGMA_CHATS = [
  {
    id: 'cv-hubtel',
    title: 'My CV for Hubtel',
    preview: 'Buddy: Move your Figma projects above education…',
    topic: 'cv',
    icon: 'edit',
    group: 'pinned',
    meta: 'Yesterday',
    dateLabel: 'Yesterday',
    pinned: true,
    snippet: '…tailor your CV to the Hubtel junior UX role…',
  },
  {
    id: 'prep-hubtel',
    title: 'Prepare for my Hubtel interview',
    preview: 'You: Can we practise the portfolio question again?',
    topic: 'interviews',
    icon: 'mic',
    group: 'today',
    meta: '2:14 PM',
    dateLabel: 'Today · 2:14 PM',
    active: true,
    snippet: '…the 5 questions Hubtel asks most in a design interview…',
  },
  {
    id: 'roles-ux-data',
    title: 'Which roles fit UX and data?',
    preview: 'Buddy: Product analyst and UX researcher fit you best…',
    topic: 'jobs',
    icon: 'compass',
    group: 'today',
    meta: '11:02 AM',
    dateLabel: 'Today · 11:02 AM',
    snippet: '…Hubtel and mPharma both hire for this mix…',
  },
  {
    id: 'linkedin',
    title: 'Rewrite my LinkedIn summary',
    preview: 'Buddy: Here’s a 3-line version that leads with…',
    topic: 'cv',
    icon: 'link',
    group: 'yesterday',
    meta: '4:40 PM',
    dateLabel: 'Yesterday · 4:40 PM',
  },
  {
    id: 'designer-salaries',
    title: 'Junior designer salaries in Accra',
    preview: 'Buddy: Most offers sit between GHS 3,500 and 6,000…',
    topic: 'jobs',
    icon: 'cash',
    group: 'yesterday',
    meta: '10:15 AM',
    dateLabel: 'Yesterday · 10:15 AM',
  },
  {
    id: 'personality',
    title: 'Explain my personality results',
    preview: 'Buddy: As an Explorer, you enjoy trying new…',
    topic: null,
    icon: 'sparkle',
    group: 'previous7',
    meta: 'Fri',
    dateLabel: 'Fri',
  },
  {
    id: 'learn-figma',
    title: 'Free ways to learn Figma',
    preview: 'Buddy: Start with Figma basics in Skills Lab…',
    topic: 'learning',
    icon: 'book',
    group: 'previous7',
    meta: 'Thu',
    dateLabel: 'Thu',
  },
  {
    id: 'cover-mpharma',
    title: 'Cover letter for mPharma',
    preview: 'You: Make it shorter and less formal',
    topic: 'cv',
    icon: 'briefcase',
    group: 'previous7',
    meta: 'Tue',
    dateLabel: 'Tue',
  },
  {
    id: 'knust-ashesi',
    title: 'KNUST or Ashesi for design?',
    preview: 'Buddy: Both have strong programmes. Here’s how…',
    topic: 'learning',
    icon: 'mortarboard',
    group: 'older',
    meta: '12 Sep',
    dateLabel: '12 Sep',
  },
];

/** Case-insensitive split of `text` into [{ text, hit }] around every occurrence of `query` (for the match highlight). */
export const highlightParts = (text, query) => {
  const q = String(query || '').trim();
  if (!q) return [{ text, hit: false }];
  const parts = [];
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  let at = 0;
  for (;;) {
    const i = lower.indexOf(needle, at);
    if (i === -1) break;
    if (i > at) parts.push({ text: text.slice(at, i), hit: false });
    parts.push({ text: text.slice(i, i + needle.length), hit: true });
    at = i + needle.length;
  }
  if (at < text.length) parts.push({ text: text.slice(at), hit: false });
  return parts;
};

/** Chats that match the search text (title, preview or message text) and the active filter chip. */
export const filterChats = (chats, { query = '', filter = 'all' } = {}) => {
  const q = query.trim().toLowerCase();
  return chats.filter((c) => {
    if (filter !== 'all' && c.topic !== filter) return false;
    if (!q) return true;
    return [c.title, c.preview, c.snippet, c.body].some((t) => t && t.toLowerCase().includes(q));
  });
};

/** The line a search result shows under the title: the stored excerpt, or a window around the match in the message text. */
export const resultSnippet = (chat, query) => {
  const q = String(query || '')
    .trim()
    .toLowerCase();
  if (chat.snippet && chat.snippet.toLowerCase().includes(q)) return chat.snippet;
  const source = chat.body || chat.preview || '';
  const i = source.toLowerCase().indexOf(q);
  if (i === -1) return chat.preview || '';
  const from = Math.max(0, i - 28);
  const to = Math.min(source.length, i + q.length + 36);
  return `${from > 0 ? '…' : ''}${source.slice(from, to).trim()}${to < source.length ? '…' : ''}`;
};

/* ---- from the talent's real conversations ---------------------------------------------------- */

const TOPIC_RULES = [
  { topic: 'interviews', icon: 'mic', re: /interview|mock|practi[sc]e/i },
  { topic: 'cv', icon: 'edit', re: /\bcv\b|resume|résumé|linkedin|cover letter|portfolio/i },
  {
    topic: 'jobs',
    icon: 'compass',
    re: /\bjobs?\b|\broles?\b|salar|career|hiring|vacanc|opportunit/i,
  },
  {
    topic: 'learning',
    icon: 'book',
    re: /learn|course|study|school|universit|skills? lab|certif/i,
  },
];
export const classifyTopic = (text) => {
  const rule = TOPIC_RULES.find((r) => r.re.test(text || ''));
  return rule ? { topic: rule.topic, icon: rule.icon } : { topic: null, icon: 'sparkle' };
};

const dayNumber = (d) => Math.floor(new Date(d).setHours(0, 0, 0, 0) / 86400000);
const timeLabel = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

/** Group + the row's right-hand label + the search-result date label for a conversation last touched at `updatedAt`. */
export const whenFor = (updatedAt, now = new Date()) => {
  const diff = dayNumber(now) - dayNumber(updatedAt);
  if (diff <= 0) {
    return {
      group: 'today',
      meta: timeLabel(updatedAt),
      dateLabel: `Today · ${timeLabel(updatedAt)}`,
    };
  }
  if (diff === 1) return { group: 'yesterday', meta: timeLabel(updatedAt), dateLabel: 'Yesterday' };
  if (diff < 7) {
    const day = new Date(updatedAt).toLocaleDateString('en-GB', { weekday: 'short' });
    return { group: 'previous7', meta: day, dateLabel: day };
  }
  const d = new Date(updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return { group: 'older', meta: d, dateLabel: d };
};

const clip = (text, n = 52) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text);

/**
 * Drawer chats from local threads (`messages` present) and/or server sessions.
 * `meta` = { pinned: {id: true}, titles: {id: 'renamed'}, deleted: {id: true} } kept per talent in this browser.
 */
export const chatsFromHistory = ({
  threads = [],
  sessions = null,
  activeId = null,
  meta = {},
  now = new Date(),
}) => {
  const rows = [];
  if (sessions) {
    for (const s of sessions) {
      rows.push({ id: s.id, title: s.title, updatedAt: s.updatedAt, preview: '', body: s.title });
    }
  } else {
    for (const t of threads) {
      const said = (t.messages || []).filter((m) => m.text && !m.auto);
      if (!said.some((m) => m.sender === 'user')) continue;
      const last = said[said.length - 1];
      rows.push({
        id: t.id,
        title: t.title,
        updatedAt: t.updatedAt,
        preview: `${last.sender === 'user' ? 'You' : 'Buddy'}: ${clip(last.text)}`,
        body: said.map((m) => m.text).join(' '),
      });
    }
  }
  return rows
    .filter((r) => !meta.deleted?.[r.id])
    .map((r) => {
      const title = meta.titles?.[r.id] || r.title;
      const pinned = Boolean(meta.pinned?.[r.id]);
      const when = whenFor(r.updatedAt, now);
      return {
        id: r.id,
        updatedAt: r.updatedAt,
        title,
        preview: r.preview,
        body: r.body,
        ...classifyTopic(`${title} ${r.body}`),
        ...when,
        group: pinned ? 'pinned' : when.group,
        pinned,
        active: r.id === activeId,
      };
    })
    .sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
};
