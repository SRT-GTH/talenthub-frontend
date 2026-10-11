"""Convert heavy PNG/JPG photos in src/assets to WebP and rewrite imports.
   python scripts/optimize-images.py [--apply]
Dry run by default. Only converts files > 250KB that are imported from src/**/*.{jsx,js,css}.
RGBA art (sprites, stages) is converted with lossless=False + alpha_quality=100.
Originals are deleted only with --apply (git keeps history)."""
import os, re, sys
from PIL import Image

APPLY = '--apply' in sys.argv
ROOT = 'src'
THRESH = 250 * 1024
src_files = []
for dp, _, fns in os.walk(ROOT):
    for fn in fns:
        if fn.endswith(('.jsx', '.js', '.css')):
            src_files.append(os.path.join(dp, fn))
texts = {p: open(p, encoding='utf-8').read() for p in src_files}

heavy = []
for dp, _, fns in os.walk('src/assets'):
    for fn in fns:
        if fn.lower().endswith(('.png', '.jpg', '.jpeg')):
            p = os.path.join(dp, fn)
            if os.path.getsize(p) > THRESH:
                heavy.append(p)

before = after = 0
rewrites = 0
for p in sorted(heavy):
    base = os.path.basename(p)
    users = [f for f, t in texts.items() if base in t]
    if not users:
        print('SKIP (unused)', p); continue
    im = Image.open(p)
    out = os.path.splitext(p)[0] + '.webp'
    opts = dict(quality=82, method=6)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); opts['alpha_quality'] = 100
    else:
        im = im.convert('RGB')
    size_before = os.path.getsize(p)
    if APPLY:
        im.save(out, 'WEBP', **opts)
        size_after = os.path.getsize(out)
    else:
        import io; buf = io.BytesIO(); im.save(buf, 'WEBP', **opts); size_after = buf.tell()
    before += size_before; after += size_after
    print('%5dKB -> %4dKB  %s  (%d importers)' % (size_before // 1024, size_after // 1024, os.path.relpath(p, 'src/assets'), len(users)))
    if APPLY:
        new_base = os.path.splitext(base)[0] + '.webp'
        for f in users:
            t = texts[f]
            n = t.replace(base, new_base)
            if n != t:
                texts[f] = n; rewrites += 1
                open(f, 'w', encoding='utf-8', newline='').write(n)
        os.remove(p)
print('total %.1f MB -> %.1f MB (%d files)%s' % (before / 1048576, after / 1048576, len(heavy), '' if APPLY else '  [dry run]'))
