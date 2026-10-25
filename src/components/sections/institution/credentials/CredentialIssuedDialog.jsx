import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import {
  CredentialsIconBigtick,
  CredentialsIconChat,
  CredentialsIconClock13,
  CredentialsIconSend,
  CredentialsIconSpark15,
} from './credentialsIcons.jsx';

const log = debug('CredentialIssuedDialog');

/* Figma confetti: 14x6 rects (r2) rotated, positions relative to the green band; colours in drawing order. */
const CONFETTI = [
  { x: 40.6, y: 27.2, r: 20, c: '#ffd86b' },
  { x: 87.6, y: 163.1, r: -30, c: '#ffffff' },
  { x: 470.3, y: 24.8, r: 40, c: '#ffffff' },
  { x: 498.5, y: 151.7, r: -15, c: '#ffd86b' },
  { x: 179.1, y: 162.6, r: 60, c: '#ebf1ec' },
  { x: 350.4, y: 169.2, r: 10, c: '#ffd86b' },
  { x: 16.3, y: 123.8, r: -40, c: '#ebf1ec' },
  { x: 520.6, y: 86.7, r: 25, c: '#ebf1ec' },
];

const NEXT = [
  { id: 'key', icon: CredentialsIconClock13, label: 'Signed with your institution key' },
  { id: 'verify', icon: CredentialsIconChat, label: 'Checkable at gth.com/verify' },
  { id: 'log', icon: CredentialsIconSpark15, label: 'Logged under your name' },
];

/*
 * CredentialIssuedDialog — "Credential issued!" (Figma 11.2.4d 8593:390861, modal 8593:391249, 560 wide) over the preview page: green celebration band (200) with the gold tick disc, the
 * "Signed" sticker and eight confetti chips, the title 34/41, the sentence, three "what next" rows, then "Back to credentials" and "Issue another".
 * Props: firstName, pronoun ("her"), onBack(), onAnother().
 */
const CredentialIssuedDialog = ({ firstName, possessive, onBack, onAnother }) => {
  useEffect(() => {
    log('open');
  }, []);

  return (
    <AgencyDialogShell
      title="Credential issued"
      onClose={onBack}
      scrim="bg-[#1c2a21]/45"
      describedBy="credential-issued-desc"
    >
      <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[28px] border border-solid border-[#1c2a21]/10 bg-[#fffefc] font-sans shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06),0_40px_100px_rgba(0,0,0,0.2)]">
        <div aria-hidden="true" className="relative h-[200px] bg-[#387440]">
          <span className="absolute top-[45px] left-1/2 flex size-[110px] -translate-x-1/2 items-center justify-center rounded-full border border-solid border-[#1c2a21]/10 bg-[#ffd86b] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]">
            <CredentialsIconBigtick className="size-[52px] text-[#1c2a21]" />
          </span>
          <span className="absolute top-[41px] left-[calc(50%+77px)] max-sm:right-[12px] max-sm:left-auto inline-flex h-[29px] items-center gap-[6px] rounded-full border border-solid border-[#1c2a21]/12 bg-white pr-[12px] pl-[10px] text-[12.5px] leading-[15px] font-bold text-[#1c2a21]">
            <CredentialsIconSend className="size-[14px]" />
            Signed
          </span>
          <span className="max-sm:hidden">
            {CONFETTI.map((c) => (
              <span
                key={`${c.x}-${c.y}`}
                className="absolute rounded-[2px] border border-solid border-[#1c2a21]/12"
                style={{
                  left: c.x,
                  top: c.y,
                  width: 14,
                  height: 6,
                  background: c.c,
                  transform: `rotate(${c.r}deg)`,
                }}
              />
            ))}
          </span>
        </div>
        <div className="flex flex-col gap-[12px] px-[clamp(20px,2.2vw,30px)] pt-[24px] pb-[26px]">
          <h2 className="m-0 text-center text-[28px] leading-[34px] font-semibold text-[#1c2a21] md:text-[34px] md:leading-[41px]">
            Credential issued!
          </h2>
          <p
            id="credential-issued-desc"
            className="m-0 text-center text-[15px] leading-[21px] text-[#595959]"
          >
            {firstName} gets an email and sees it on {possessive} profile now.
          </p>
          <ul className="m-0 flex list-none flex-col gap-[4px] rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-0">
            {NEXT.map((n, i) => {
              const Icon = n.icon;
              return (
                <li
                  key={n.id}
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] ${
                    i > 0 ? 'border-0 border-t border-solid border-[#e1eae2]' : ''
                  }`}
                >
                  <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec]">
                    <Icon className="size-[15px] text-[#387440]" />
                  </span>
                  <span className="text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                    {n.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-[10px] pt-[6px]">
            <Button
              variant="tertiary"
              size="lg"
              className="min-w-[140px] flex-1"
              data-autofocus=""
              onClick={onBack}
            >
              Back to credentials
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="min-w-[140px] flex-1"
              onClick={onAnother}
            >
              Issue another
            </Button>
          </div>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default CredentialIssuedDialog;
