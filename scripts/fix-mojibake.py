"""Repair UTF-8 text that was mis-decoded as Windows-1252 ("â€”" -> "—", "Ã—" -> "×", ...).
   python scripts/fix-mojibake.py [--apply]
Dry run by default: prints each file with the number of repairs and a few before/after samples.
Only sequences that round-trip (encode cp1252 -> decode utf-8) are touched; anything else is left alone."""
import os, re, sys

APPLY = '--apply' in sys.argv

# cp1252 bytes 0x80-0x9F -> unicode, so we can invert the bad decode.
CP1252 = {
    0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…', 0x86: '†', 0x87: '‡', 0x88: 'ˆ', 0x89: '‰',
    0x8A: 'Š', 0x8B: '‹', 0x8C: 'Œ', 0x8E: 'Ž', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•',
    0x96: '–', 0x97: '—', 0x98: '˜', 0x99: '™', 0x9A: 'š', 0x9B: '›', 0x9C: 'œ', 0x9E: 'ž', 0x9F: 'Ÿ',
}
REV = {v: k for k, v in CP1252.items()}
# bytes undefined in cp1252 may appear as raw C1 controls or U+FFFD in the corrupted text
for b in (0x81, 0x8D, 0x8F, 0x90, 0x9D):
    REV[chr(b)] = b


def to_bytes(seq):
    out = bytearray()
    for ch in seq:
        o = ord(ch)
        if o < 0x100:
            out.append(o)
        elif ch in REV:
            out.append(REV[ch])
        else:
            return None
    return bytes(out)


# A mojibake run: a UTF-8 lead byte rendered as Latin-1 (Ã Â â ...) followed by continuation bytes
# rendered as cp1252 characters. Match greedily, then try progressively shorter prefixes.
LEAD = 'ÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîï'
CONT = ''.join(CP1252.values()) + ''.join(chr(c) for c in range(0x80, 0xC0)) + '�'
PATTERN = re.compile('[' + re.escape(LEAD) + '][' + re.escape(CONT) + ']{1,3}')


def fix(text):
    fixes = []

    def repl(m):
        run = m.group(0)
        for n in range(len(run), 1, -1):
            b = to_bytes(run[:n])
            if b is None:
                continue
            try:
                good = b.decode('utf-8')
            except UnicodeDecodeError:
                continue
            fixes.append((run[:n], good))
            return good + run[n:]
        return run

    return PATTERN.sub(repl, text), fixes


total = 0
for dp, _, fns in os.walk('src'):
    for fn in fns:
        if not fn.endswith(('.js', '.jsx', '.css', '.json')):
            continue
        p = os.path.join(dp, fn)
        s = open(p, encoding='utf-8', newline='').read()
        t, fixes = fix(s)
        if not fixes:
            continue
        total += len(fixes)
        samples = sorted({f'{a!r}->{b!r}' for a, b in fixes})[:4]
        print(f'{len(fixes):4d}  {p.replace(os.sep, "/")}  {" ".join(samples)}')
        if APPLY:
            open(p, 'w', encoding='utf-8', newline='').write(t)
print(f'\n{total} repairs{"" if APPLY else " (dry run)"}')
