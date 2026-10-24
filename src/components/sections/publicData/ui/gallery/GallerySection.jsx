import FigmaShot from './FigmaShot.jsx';

/*
 * GallerySection — DEV GALLERY ONLY. One row of the UI gallery: title + the Figma node ids it reproduces, then the BUILT component (left, in a
 * wrapper of the exact Figma width so a screenshot can be diffed) and the 0.5x Figma export (right, shown at 2x natural size).
 * Props
 *   id       string   anchor + data-gallery id
 *   title    string
 *   nodes    string   Figma node ids (caption)
 *   variants [{ key, label, width, figma, bg, children }]   one entry per state; `figma` = export name (omit = no reference image)
 *            width = px width of the built wrapper (the Figma node width); bg = css background of the wrapper (default white, the colour the
 *            diff script flattens the transparent Figma export onto); bleed = {t,r,b,l} px of drop-shadow margin: a Figma export of a node with a
 *            shadow is larger than the node, so the built wrapper pads the same amount to line the two images up
 *   notes    string   caption under the title (assumptions, states that are not drawn)
 */

const GallerySection = ({ id, title, nodes, notes, variants }) => (
  <section id={id} data-gallery={id} className="scroll-mt-[96px] font-sans">
    <h2 className="m-0 text-[22px] leading-[26px] font-semibold text-[#1c2a21]">{title}</h2>
    <p className="m-0 mt-[4px] text-[13px] leading-[18px] text-[#595959]">Figma: {nodes}</p>
    {notes && <p className="m-0 mt-[2px] text-[13px] leading-[18px] text-[#595959]">{notes}</p>}
    <div className="mt-[16px] flex flex-col gap-[24px]">
      {variants.map((v) => (
        <div key={v.key} data-gallery-variant={`${id}/${v.key}`}>
          <p className="m-0 mb-[8px] text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
            {v.label}
          </p>
          <div className="flex flex-wrap items-start gap-[32px]">
            <div className="max-w-full">
              <p className="m-0 mb-[6px] text-[12px] text-[#595959]">Built</p>
              <div
                data-gallery-built={`${id}/${v.key}`}
                className="max-w-full overflow-visible"
                style={{
                  width: v.width + (v.bleed ? v.bleed.l + v.bleed.r : 0),
                  padding: v.bleed
                    ? `${v.bleed.t}px ${v.bleed.r}px ${v.bleed.b}px ${v.bleed.l}px`
                    : 0,
                  background: v.bg ?? '#ffffff',
                }}
              >
                {v.children}
              </div>
            </div>
            {v.figma && (
              <div className="max-w-full">
                <p className="m-0 mb-[6px] text-[12px] text-[#595959]">
                  Figma (0.5x export, shown 2x)
                </p>
                <div className="max-w-full overflow-auto">
                  <FigmaShot name={v.figma} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default GallerySection;
