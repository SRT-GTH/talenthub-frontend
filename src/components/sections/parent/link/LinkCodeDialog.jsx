import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import LinkCodeBoxes from './LinkCodeBoxes.jsx';
import LinkDialogShell, { LinkDialogClose } from './LinkDialogShell.jsx';
import RelationChips from './RelationChips.jsx';
import spotWard from '../../../../assets/parent/spot-ward.svg';
import shieldRed from '../../../../assets/parent/link-shield-red.svg';
import infoAmber from '../../../../assets/parent/link-info-amber.svg';
import { CODE_COPY, CODE_LENGTH, CODE_RELATIONS } from './data/linkWardData.js';

const log = debug('LinkCodeDialog');

/*
 * LinkCodeDialog — "Enter your link code" (Figma PW-07b 10052:530, PW-07e 10077:18651, PW-07f 10077:18999): 520 wide, r24, p28, gap20. Spot · Ward 80 + close 36, 24/600 title, 14/20 body, the six code boxes,
 * (error / expired only) a callout, the Relationship chips (five), then Cancel (secondary) + the primary action. variant: 'entry' ("Link ward"), 'error' (red callout, "Try again"), 'expired' (amber callout, "Enter a new code").
 * Props: variant, code, rel, onCodeChange, onRelChange, onSubmit, onRetry, onClose.
 * The primary action of 'error' / 'expired' clears the boxes and returns to 'entry' (onRetry). On 'entry' it needs all 6 characters, otherwise it only logs.
 */
const CALLOUTS = {
  error: {
    copy: CODE_COPY.error,
    icon: shieldRed,
    box: 'border-danger/25 bg-[#fcece9]',
    title: 'text-danger',
    body: 'text-[#1c2a21] opacity-85',
  },
  expired: {
    copy: CODE_COPY.expired,
    icon: infoAmber,
    box: 'border-[#a0700a]/25 bg-[#fdf5e0]',
    title: 'text-[#a0700a]',
    body: 'text-[#1c2a21] opacity-85',
  },
};

const LinkCodeDialog = ({
  variant = 'entry',
  code,
  rel,
  onCodeChange,
  onRelChange,
  onSubmit,
  onRetry,
  onClose,
}) => {
  const callout = CALLOUTS[variant];
  const action =
    variant === 'error'
      ? CODE_COPY.retry
      : variant === 'expired'
        ? CODE_COPY.newCode
        : CODE_COPY.submit;
  log('render', { variant, length: code.length });

  const handlePrimary = () => {
    if (variant !== 'entry') {
      log('retry from', variant);
      onRetry?.();
      return;
    }
    if (code.length < CODE_LENGTH) {
      log('submit ignored: code incomplete', { length: code.length });
      return;
    }
    onSubmit?.();
  };

  return (
    <LinkDialogShell label={CODE_COPY.title} onClose={onClose} focusCard={false}>
      <div className="flex items-start justify-between">
        <img src={spotWard} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
        <LinkDialogClose onClose={onClose} />
      </div>
      <h2 className="m-0 text-[24px] leading-normal font-semibold text-[#1c2a21]">
        {CODE_COPY.title}
      </h2>
      <p className="m-0 text-[14px] leading-[1.45] font-normal text-neutral-darker">
        {CODE_COPY.body}
      </p>
      <LinkCodeBoxes
        value={code}
        onChange={onCodeChange}
        tone={variant === 'error' ? 'error' : 'default'}
        highlight={variant === 'expired' ? 4 : undefined}
      />
      {callout ? (
        <div
          role="alert"
          className={`flex items-start gap-[12px] rounded-[12px] border border-solid px-[16px] py-[14px] ${callout.box}`}
        >
          <img
            src={callout.icon}
            alt=""
            aria-hidden="true"
            className="mt-px size-[18px] shrink-0"
          />
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className={`m-0 text-[14px] leading-normal font-semibold ${callout.title}`}>
              {callout.copy.title}
            </p>
            <p className={`m-0 text-[13px] leading-normal font-normal ${callout.body}`}>
              {callout.copy.body}
            </p>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-[20px]">
        <p className="m-0 text-[13px] leading-normal font-semibold text-[#1c2a21]">
          {CODE_COPY.relationLabel}
        </p>
        <RelationChips items={CODE_RELATIONS} value={rel} onChange={onRelChange} />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onClose}>
          {CODE_COPY.cancel}
        </ParentButton>
        <ParentButton onClick={handlePrimary}>{action}</ParentButton>
      </div>
    </LinkDialogShell>
  );
};

export default LinkCodeDialog;
