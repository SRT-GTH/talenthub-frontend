import { useEffect, useRef } from 'react';
import { debug } from '../../../utils/debug.js';
import { formatRecorderTime } from './pitchModeStyles.js';
import {
  PitchBatteryIcon,
  PitchCameraIcon,
  PitchPlayIcon,
  PitchSettingsIcon,
  CheckIcon,
} from '../../shared/assets.jsx';

const log = debug('PitchRecorder');

/*
 * PitchRecorder — the dark "Camera Viewfinder" recording window.
 *
 * ⚠️ THIS IS NOT A `Modal.jsx` INSTANCE. Verified directly from Figma: the
 * viewfinder is an INLINE block inside the stage-2 page's main column (a
 * sibling of the "Your Pitch" label and the tab row), not an overlay. It has
 * no scrim, no close button, no focus trap, and the page's own nav / top bar
 * / right aside / footer all stay visible and interactive around it. The only
 * true overlays in this flow are PitchPublishedModal and DeletePitchModal,
 * which DO use the shared Modal.
 *
 * Sources (all ✅ VERIFIED via real `mcp__figma__get_design_context` dives,
 * file key Bin8roWL8sloyc36IgFMuT, 2026-09-09):
 *   6083:46917 — "Camera Viewfinder", camera-access state (frame 6083:46594)
 *   6107:57918 — "Camera Viewfinder", recorded/preview state (frame 5890:1732)
 *   6083:47113 — the same viewfinder in the uploaded-file state (5890:1040)
 *   6093:21784 / 6107:57919 / 6083:47114 — "camera-ui-overlays" (identical in
 *     all three): grid lines, crosshair, four focus brackets, 4K + 24fps
 *     badges, battery readout, centred REC indicator, "00:00" timer
 *   6093:21845 — "camera-access-card"   (blurred glass card)
 *   6093:21853 — "bottom-controls"      (Allow camera / shutter / settings)
 *   6107:57981 — "preview-card"         (72px play button + "Click to preview")
 *
 * Container spec: bg #121211, rounded-16, h-416, full width, overflow-clip.
 *
 * ── Interaction model (documented judgment call) ───────────────────────────
 * Figma ships exactly TWO viewfinder states: "camera access needed" and
 * "recorded / click to preview". It does NOT draw a permission-granted idle
 * state or an actively-recording state, yet the flow obviously has to pass
 * through both (the intro page's own card #2 says "Record as many takes as
 * you need"). So this component runs a four-state machine:
 *
 *   needs-access → (Allow camera) → ready → (shutter) → recording
 *                                              ↑              │ (shutter / 60s)
 *                                              └── re-record ──┴→ recorded
 *
 *   needs-access  ✅ Figma 6083:46917 — drawn exactly as designed.
 *   recorded      ✅ Figma 6107:57918 — drawn exactly as designed.
 *   ready         ⚠️ NOT IN FIGMA. Rendered as the same viewfinder with the
 *                    camera-access card removed and the "Allow camera" pill
 *                    dropped from the control row — i.e. purely a subtraction
 *                    from the verified camera-access frame, nothing invented.
 *   recording     ⚠️ NOT IN FIGMA. Also a minimal delta from the verified
 *                    frame: the (already-present) centred REC indicator's dot
 *                    turns #ef4444 and pulses, its border picks up the same
 *                    red, the (already-present) "00:00" timer counts up in
 *                    mm:ss, and the (already-present) 72px shutter's inner
 *                    circle morphs into a red rounded square — the universal
 *                    stop affordance. No new chrome, no invented copy, no
 *                    waveform (Figma draws none anywhere in this flow).
 *
 * ── No real media capture ─────────────────────────────────────────────────
 * There is no media backend anywhere in this app, so nothing here calls
 * `navigator.mediaDevices.getUserMedia`, instantiates `MediaRecorder`, or
 * persists a byte. "Allow camera" flips a UI flag; the shutter starts/stops a
 * `setInterval` clock. Same spirit as `AddEditCertModal.jsx`'s upload
 * shortcut, which opens a real file picker but only `debug()`s the pick.
 * The 60-second auto-stop is real (the design's own hard limit, stated in the
 * aside's "Keep it under 60s" and the file requirements' "Maximum 60
 * seconds").
 */

// Figma 6093:21796 and siblings — a 56px corner bracket built from eight
// 2×12 rounded bars at rgba(255,255,255,0.8). All four corners are the same
// component rotated 0°, so one JSX block covers every corner.
const FocusBracket = ({ position }) => (
  <div className={`absolute size-[56px] ${position}`} aria-hidden="true">
    <span className="absolute left-0 top-0 h-[2px] w-[12px] rounded-[1px] bg-white/80" />
    <span className="absolute left-0 top-0 h-[12px] w-[2px] rounded-[1px] bg-white/80" />
    <span className="absolute left-[44px] top-0 h-[2px] w-[12px] rounded-[1px] bg-white/80" />
    <span className="absolute left-[54px] top-0 h-[12px] w-[2px] rounded-[1px] bg-white/80" />
    <span className="absolute left-0 top-[44px] h-[2px] w-[12px] rounded-[1px] bg-white/80" />
    <span className="absolute left-0 top-[54px] h-[12px] w-[2px] rounded-[1px] bg-white/80" />
    <span className="absolute left-[44px] top-[54px] h-[2px] w-[12px] rounded-[1px] bg-white/80" />
    <span className="absolute left-[54px] top-[44px] h-[12px] w-[2px] rounded-[1px] bg-white/80" />
  </div>
);

const PitchRecorder = ({
  state, // 'needs-access' | 'ready' | 'recording' | 'recorded'
  elapsedSeconds = 0,
  onAllowCamera,
  onToggleRecording,
  onOpenSettings,
  onPreview,
}) => {
  const isRecording = state === 'recording';
  const isRecorded = state === 'recorded';
  const needsAccess = state === 'needs-access';

  log('render', { state, elapsedSeconds });

  // Announce state transitions once each — the branch logging CLAUDE.md's
  // debug-log discipline asks for, without spamming a line per tick.
  const previousState = useRef(state);
  useEffect(() => {
    if (previousState.current !== state) {
      log('branch: viewfinder state changed', { from: previousState.current, to: state });
      previousState.current = state;
    }
  }, [state]);

  return (
    <div
      // Figma 6083:46917 — bg #121211, rounded-16, 416px tall.
      className="relative w-full h-[clamp(280px,28.9vw,416px)] rounded-[16px] bg-[#121211] overflow-hidden"
      role="group"
      aria-label="Pitch video recorder"
    >
      {/* camera-ui-overlays — Figma 6093:21784. Every child below is present
          in Figma's own overlay group in ALL viewfinder states. */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* grid-lines — Figma 6093:21785. Figma places 4 verticals at a fixed
            320px pitch and 4 horizontals at a fixed 220px pitch; expressed as
            repeating gradients so they hold at any container width. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 320px)',
              'repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 220px)',
            ].join(', '),
            backgroundPosition: '319px 0, 0 219px',
          }}
        />

        {/* crosshair — Figma 6093:21794 / 21795 */}
        <span className="absolute left-1/2 top-1/2 h-[80px] w-px -translate-x-1/2 -translate-y-1/2 bg-white/20" />
        <span className="absolute left-1/2 top-1/2 h-px w-[80px] -translate-x-1/2 -translate-y-1/2 bg-white/20" />

        {/* focus brackets — Figma 6093:21796 / 21805 / 21814 / 21823 */}
        <FocusBracket position="left-[24px] top-[24px]" />
        <FocusBracket position="right-[24px] top-[24px]" />
        <FocusBracket position="left-[24px] bottom-[24px]" />
        <FocusBracket position="right-[24px] bottom-[24px]" />

        {/* top-left badges — Figma 6093:21833 / 21835 */}
        <div className="absolute left-[24px] top-[24px] flex items-center gap-[10px]">
          {['4K', '24fps'].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.08] px-[10px] py-[6px] font-sans font-bold text-[12px] text-white"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* top-right battery — Figma 6093:21838 / 21840 */}
        <div className="absolute right-[24px] top-[24px] flex items-center gap-[6px]">
          <PitchBatteryIcon className="size-4 text-white/80" />
          <span className="font-sans font-semibold text-[12px] text-white/80">82%</span>
        </div>

        {/* rec-indicator — Figma 6093:21841: a 44px pill centred in the
            frame holding a 12px dot and the word "REC". Figma only draws the
            resting (white-on-glass) treatment; the red + pulse is the
            recording-state delta described in the file header. */}
        <div
          className={`absolute left-1/2 top-1/2 flex size-[44px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[22px] border bg-white/[0.08] ${
            isRecording ? 'border-[#ef4444]' : 'border-white/20'
          }`}
        >
          <span
            className={`absolute left-1/2 top-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
              isRecording ? 'bg-[#ef4444] animate-pulse' : 'bg-white/50'
            }`}
          />
          <span className="relative font-sans font-bold text-[12px] text-white">REC</span>
        </div>

        {/* timer — Figma 6093:21844, "00:00" at bottom-39px, centred. Not
            drawn on the recorded frame (6107:57918 has no timer node), so it
            is hidden there. */}
        {!isRecorded && (
          <span
            className={`absolute bottom-[39px] left-1/2 -translate-x-1/2 font-sans font-semibold text-[14px] ${
              isRecording ? 'text-white' : 'text-white/80'
            }`}
          >
            {formatRecorderTime(elapsedSeconds)}
          </span>
        )}
      </div>

      {/* camera-access-card — Figma 6093:21845. Only rendered in the
          needs-access state; "ready" is this same frame minus this card. */}
      {needsAccess && (
        <div
          className="absolute left-1/2 top-[calc(50%-27px)] w-[min(760px,calc(100%-48px))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-white/15 bg-white/[0.06] p-[20px] flex flex-col gap-[12px]"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-[12px]">
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/[0.07]">
              <PitchCameraIcon className="size-[22px] text-white" />
            </span>
            <div className="flex flex-col gap-[2px] min-w-0">
              <p className="font-sans font-bold text-[18px] text-white">Camera access needed</p>
              <p className="font-sans text-[13px] text-white/70">
                Allow camera access to start recording.
              </p>
            </div>
          </div>
          <p className="font-sans text-[14px] leading-[20px] text-white/80">
            Click below to allow camera access.
            <br />
            GTH never stores raw video on this device.
          </p>
        </div>
      )}

      {/* preview-card — Figma 6107:57981. The recorded state's centred glass
          card with a 72px white play button and "Click to preview". */}
      {isRecorded && (
        <button
          type="button"
          onClick={() => {
            // No real media exists in this mock — see the file header.
            log('preview clicked (no real media attached — mock playback)');
            onPreview?.();
          }}
          className="absolute left-1/2 top-1/2 w-[min(760px,calc(100%-48px))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-white/15 bg-white/[0.06] p-[20px] flex flex-col items-center gap-[12px] cursor-pointer transition-colors duration-150 hover:bg-white/[0.1]"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <span className="flex size-[72px] items-center justify-center rounded-[36px] bg-white">
            <PitchPlayIcon className="size-[28px]" />
          </span>
          <span className="font-sans font-medium text-[18px] text-white">Click to preview</span>
        </button>
      )}

      {/* bottom-controls — Figma 6093:21853. Hidden once recorded: the
          recorded frame (5890:1732) replaces this row with the page-level
          "Re-Record" action bar below the viewfinder. */}
      {!isRecorded && (
        <div className="absolute bottom-[52px] left-1/2 flex -translate-x-1/2 items-center gap-[16px]">
          {needsAccess && (
            /* btn-allow — Figma 6093:21854 */
            <button
              type="button"
              onClick={() => {
                log('allow camera clicked (mock — no getUserMedia call)');
                onAllowCamera?.();
              }}
              className="flex items-center gap-[8px] rounded-full bg-white px-[18px] py-[12px] font-sans font-bold text-[14px] text-[#121211] cursor-pointer transition-transform duration-150 hover:-translate-y-px"
              style={{ filter: 'drop-shadow(0px 10px 12px rgba(0,0,0,0.2))' }}
            >
              <CheckIcon className="size-[18px]" />
              Allow camera
            </button>
          )}

          {/* shutter — Figma 6093:21857 (72px white circle, 28px inner
              glyph). Disabled until camera access is granted, since the
              access card is covering the frame at that point. */}
          <button
            type="button"
            disabled={needsAccess}
            onClick={() => {
              log('shutter clicked', { state });
              onToggleRecording?.();
            }}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            className="flex size-[72px] items-center justify-center rounded-[36px] bg-white cursor-pointer transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            style={{ filter: 'drop-shadow(0px 12px 14px rgba(0,0,0,0.25))' }}
          >
            <span
              className={
                isRecording
                  ? 'size-[24px] rounded-[6px] bg-[#ef4444]'
                  : 'size-[28px] rounded-full border-2 border-[#121211]'
              }
            />
          </button>

          {/* btn-settings — Figma 6093:21859 */}
          <button
            type="button"
            onClick={() => {
              log('recorder settings clicked (no settings panel in Figma — no-op)');
              onOpenSettings?.();
            }}
            aria-label="Recorder settings"
            className="flex size-[44px] items-center justify-center rounded-[14px] border border-white/15 bg-white/[0.07] cursor-pointer transition-colors duration-150 hover:bg-white/15"
          >
            <PitchSettingsIcon className="size-[20px] text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PitchRecorder;
