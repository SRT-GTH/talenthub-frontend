import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import CareerBuddyVoiceAvatar from '../../../shared/CareerBuddyVoiceAvatar.jsx';
import AvatarPreview from '../../engagement/avatar/AvatarPreview.jsx';
import {
  ChatMicIcon,
  ChatSettingsSlidersIcon,
  ChatVoiceCloseIcon,
} from '../../../shared/assets.jsx';
import ListeningWaveform from './ListeningWaveform.jsx';

/*
 * The call cluster under the captions: avatars, label, mic + close, settings - Figma 9149:83180 (Frame 14689, 188 wide).
 *   - listening (talent speaking): red halo (132, #d93025 @12%) + 3px ring (114) around the talent avatar, red waveform
 *     30px above, red mic button (75, #d93025, white mic), label "Listening…" (22/500)
 *   - buddySpeaking: the same halo/ring in green (#387440) around Buddy's avatar
 *   - otherwise: label "TALI" (32/500), mic #e6e6e6 with a #575755 glyph
 * Gaps: avatars -> label 22, label -> buttons 64 (fluid below xl), buttons -> settings 24.
 */
const Halo = ({ tone }) => (
  <>
    <span
      aria-hidden="true"
      className={classNames(
        'pointer-events-none absolute -inset-[16px] rounded-full opacity-[0.12]',
        tone === 'red' ? 'bg-[#d93025]' : 'bg-[#387440]'
      )}
    />
    <span
      aria-hidden="true"
      className={classNames(
        'pointer-events-none absolute -inset-[7px] rounded-full border-[3px] border-solid',
        tone === 'red' ? 'border-[#d93025]' : 'border-[#387440]'
      )}
    />
  </>
);

const VoiceCallCluster = ({
  userName = 'Emma',
  label,
  listening = false,
  compactLabel = false,
  buddySpeaking = false,
  level = null,
  muted = false,
  autoFocusMic = false,
  status = '',
  onToggleMute,
  onHangUp,
  onOpenSettings,
}) => (
  <div className="relative flex flex-col items-center gap-[24px]">
    <div className="flex flex-col items-center gap-[22px]">
      <div className="relative flex items-center">
        {listening ? (
          <span className="absolute -top-[30px] left-1/2 -translate-x-1/2">
            <ListeningWaveform level={level} />
          </span>
        ) : null}
        <span className="relative z-[1] shrink-0">
          {buddySpeaking ? <Halo tone="green" /> : null}
          <CareerBuddyVoiceAvatar size={100} />
        </span>
        <span className="relative z-[2] ml-[-12px] shrink-0" aria-label={userName}>
          {listening ? <Halo tone="red" /> : null}
          <AvatarPreview size={100} badgeBg="voice" />
        </span>
      </div>
      <p
        className={classNames(
          'm-0 font-sans font-medium text-[#1c2a21]',
          compactLabel
            ? 'text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-[1.18]'
            : 'text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.19]'
        )}
      >
        {label}
      </p>
      {status ? (
        <p
          className="m-0 max-w-[420px] px-4 text-center font-sans text-[15px] text-[#595959]"
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
    </div>

    <div className="mt-[clamp(1rem,2.3vw,2.5rem)] flex items-center gap-[22px]">
      <Button
        type="button"
        variant="icon"
        size="lg"
        data-autofocus={autoFocusMic ? '' : undefined}
        aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
        aria-pressed={muted}
        onClick={onToggleMute}
        className={classNames(
          listening ? '!bg-[#d93025] !text-white hover:!bg-[#d93025]' : '!bg-[#e6e6e6]',
          muted && 'opacity-50'
        )}
      >
        <ChatMicIcon className="size-[27px]" />
      </Button>
      <Button
        type="button"
        variant="icon"
        size="lg"
        aria-label="End voice call"
        onClick={onHangUp}
        className="!bg-[#e6e6e6]"
      >
        <ChatVoiceCloseIcon className="size-[18px]" />
      </Button>
    </div>

    <Button
      type="button"
      variant="ghost-icon"
      size="md"
      aria-label="Voice settings"
      onClick={onOpenSettings}
      className="!size-10 max-lg:!size-11"
    >
      <ChatSettingsSlidersIcon className="size-[18px]" />
    </Button>
  </div>
);

export default VoiceCallCluster;
