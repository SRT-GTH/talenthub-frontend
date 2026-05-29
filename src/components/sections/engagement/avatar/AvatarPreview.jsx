import { classNames } from '../../../../utils/classNames.js';
import { useAvatarSelection } from '../../../../hooks/useAvatarSelection.js';
import { debug } from '../../../../utils/debug.js';

// Base layer — head + face + neck stub. Always rendered.
import bodyBase from '../../../../assets/engagement/body-base.svg';

// Hairstyle layers. Keys match selection.hairStyle IDs from
// AvatarHairPanel's HAIRSTYLES array (hair-1 … hair-12). Bald (hair-11)
// intentionally has no asset — when selected, no hair layer renders and
// the bare body-base shows through.
import hair1 from '../../../../assets/engagement/first-hairstyle.svg';
import hair2 from '../../../../assets/engagement/second-hairstyle.svg';
import hair3 from '../../../../assets/engagement/third-hairstyle.svg';
import hair4 from '../../../../assets/engagement/fourth-hairstyle.svg';
import hair5 from '../../../../assets/engagement/fifth-hairstyle.svg';
import hair6 from '../../../../assets/engagement/sixth-hairstyle.svg';
import hair7 from '../../../../assets/engagement/seventh-hairstyle.svg';
import hair8 from '../../../../assets/engagement/eigth-hairstyle.svg';
import hair9 from '../../../../assets/engagement/nineth-hairstyle.svg';
import hair10 from '../../../../assets/engagement/tenth-hairstyle.svg';
import hair12 from '../../../../assets/engagement/twelveth-hairstyle.svg';

const log = debug('AvatarPreview');

/*
 * AvatarPreview — live avatar render assembled from layered SVGs.
 * Phase 2 of the avatar customiser plan.
 *
 * Stacks transparent SVG layers (body-base + hair, with outfit + extras
 * to follow) on top of each other to produce the user's avatar. Each
 * layer's source is driven by AvatarSelectionContext, so the preview
 * updates live whenever the user clicks a tile on the right.
 *
 * All layers share the same 1024×1024 canvas, so they automatically
 * align when stacked at the same screen position. Each <img> is
 * absolute-positioned over the same square container.
 *
 * Layer order (back → front):
 *   1. Wrap-around hair (Hijab, Kente Wrap) — the cloth wraps the head
 *      from the outside, so it sits BEHIND body-base. The head + face
 *      from body-base then cover the cloth in the face area, leaving
 *      only the drape and side cloth visible.
 *   2. body-base — head + face + neck stub.
 *   3. (future) outfit — chest blob with collar/neckline.
 *   4. Normal hair — sits ON TOP of body-base (Buzz Cut, Afro, Locs, …).
 *   5. (future) facial hair, details, earrings, glasses.
 *
 * Bald (hair-11) renders nothing on the hair layer — the bare body-base
 * is the bald look.
 */

// Per-hairstyle asset registry. The 11 entries match all hairstyles
// except Bald (hair-11), which is intentionally absent.
const HAIR_LAYERS = {
  'hair-1': hair1, // Box Braids
  'hair-2': hair2, // Cornrows
  'hair-3': hair3, // Afro
  'hair-4': hair4, // Buzz Cut
  'hair-5': hair5, // Fade
  'hair-6': hair6, // Twists
  'hair-7': hair7, // Locs
  'hair-8': hair8, // Hijab (wrap-around)
  'hair-9': hair9, // Kente Wrap (wrap-around)
  'hair-10': hair10, // Long Curly
  // 'hair-11' intentionally absent — Bald
  'hair-12': hair12, // Onyx
};

// Wrap-around hairstyles render BEHIND body-base so the head + face
// appear ON TOP of the cloth/hair shape. Only the parts that extend
// past the head outline (drape, sides, puffy halo) end up visible.
// Used for hairstyles that surround the head rather than sit on top:
//   hair-3  Afro       — puffy halo around the head
//   hair-8  Hijab      — cloth wraps head + sides + drape
//   hair-9  Kente Wrap — cloth wraps head + sides
const WRAP_AROUND_HAIR = new Set(['hair-3', 'hair-8', 'hair-9']);

const AvatarPreview = ({ className }) => {
  const { selection } = useAvatarSelection();
  log('render', { hairStyle: selection.hairStyle });

  const hairId = selection.hairStyle;
  const hairSrc = hairId ? HAIR_LAYERS[hairId] : null;
  const isWrapAround = hairId ? WRAP_AROUND_HAIR.has(hairId) : false;

  return (
    <div
      className={classNames(
        // Square container — every SVG layer fills it. max-w caps the
        // size on wide viewports; mx-auto centres within the parent.
        'relative aspect-square w-full max-w-[min(90vh,640px)] mx-auto',
        className
      )}
    >
      {/* Wrap-around hair (Hijab, Kente Wrap) — BEHIND body-base */}
      {hairSrc && isWrapAround && (
        <img
          src={hairSrc}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute inset-0 h-full w-full select-none"
        />
      )}

      {/* Body base — head, face, neck stub. Always rendered. */}
      <img
        src={bodyBase}
        alt="Avatar preview"
        draggable="false"
        className="absolute inset-0 h-full w-full select-none"
      />

      {/* Standard hair — ON TOP of body-base */}
      {hairSrc && !isWrapAround && (
        <img
          src={hairSrc}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute inset-0 h-full w-full select-none"
        />
      )}

      {/* TODO Phase 2b: outfit layer (chest blob) */}
      {/* TODO Phase 2b: facial hair, details, earrings, glasses */}
    </div>
  );
};

export default AvatarPreview;
