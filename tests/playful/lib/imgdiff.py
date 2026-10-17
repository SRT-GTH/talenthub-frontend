"""Whole-image diff: Figma 2x PNG (Safari bar cropped) vs app screenshot.
usage: imgdiff.py figma.png app.png out_diff.png [maskjson]
Prints JSON: overall pct, text-masked pct, per-region pcts. Threshold: any channel delta > 24.
Compared at 1x (Figma downsampled with LANCZOS) over the 1728x1065 app viewport."""
import sys, json
from PIL import Image, ImageChops, ImageDraw

fig_p, app_p, out_p = sys.argv[1:4]
mask_p = sys.argv[4] if len(sys.argv) > 4 else None
BAR = 52
fig = Image.open(fig_p).convert('RGB')
app = Image.open(app_p).convert('RGB')
s = fig.width / 1728.0
fig = fig.crop((0, int(BAR * s), fig.width, fig.height)).resize(app.size, Image.LANCZOS) if fig.size != app.size else fig
fig = fig.crop((0, 0, app.width, app.height))
diff = ImageChops.difference(fig, app)
# per-channel > 24 -> binary
bands = [b.point(lambda v: 255 if v > 24 else 0) for b in diff.split()]
bin_ = ImageChops.lighter(ImageChops.lighter(bands[0], bands[1]), bands[2])
mask = Image.new('L', app.size, 0)  # 255 where text glyph areas
if mask_p:
    boxes = json.load(open(mask_p))
    d = ImageDraw.Draw(mask)
    for x, y, w, h in boxes:
        d.rectangle([x - 3, y - 3, x + w + 3, y + h + 3], fill=255)
masked = ImageChops.multiply(bin_, ImageChops.invert(mask).point(lambda v: 255 if v else 0)).point(lambda v: 255 if v else 0)
W, H = app.size
def pct(img, box=None, excl=None):
    im = img.crop(box) if box else img
    n = sum(1 for v in im.getdata() if v)
    tot = im.width * im.height
    if excl is not None:
        ex = excl.crop(box) if box else excl
        tot -= sum(1 for v in ex.getdata() if v)
    return round(100.0 * n / max(1, tot), 2)
regions = {
    'header': (0, 0, W, 172),
    'chatPane': (0, 172, 1112, H),
    'panel': (1112, 172, W, H),
    'dialog': (int(W * 0.25), int(H * 0.15), int(W * 0.75), int(H * 0.85)),
}
res = {
    'pct': pct(bin_),
    'maskedPct': pct(masked, None, mask),
    'regions': {k: {'pct': pct(bin_, b), 'maskedPct': pct(masked, b, mask)} for k, b in regions.items()},
}
# heatmap: dimmed app + red where diff (text-only diffs orange)
heat = Image.blend(app, Image.new('RGB', app.size, (255, 255, 255)), 0.6)
heat.paste((255, 0, 0), mask=masked)
heat.paste((255, 170, 0), mask=ImageChops.subtract(bin_, masked))
heat.save(out_p)
print(json.dumps(res))
