/* Tiny Python highlighter for the lab code blocks (colours live in LabQuestionParts CODE_TONE). */
const TOKEN_RE =
  /(\[[^\]]*\])|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(?=\()|(\b(?:def|for|in|return|while|try|except|if|else|import|not|and|or)\b)|([A-Za-z_]\w*)|(\s+|[^\w\s])/g;

/* Reproduces the three Figma lines of challenge 5 exactly and degrades sensibly for other code. */
export const tokenizeCode = (line) => {
  const out = [];
  let depth = 0;
  const push = (text, tone) => {
    const last = out[out.length - 1];
    if (last && last.tone === tone) last.text += text;
    else out.push({ text, tone });
  };
  for (const m of line.matchAll(TOKEN_RE)) {
    const [text, list, str, num, call, kw, ident] = m;
    if (list || str || num) push(text, 'lit');
    else if (call || kw) push(text, 'fn');
    else if (ident) push(text, depth > 0 ? 'op' : 'id');
    else if (/^\s+$/.test(text)) push(text, out.length === 0 ? 'id' : 'op');
    else {
      if (text === '(') depth += 1;
      if (text === ')') depth = Math.max(0, depth - 1);
      push(text, 'op');
    }
  }
  return out;
};
