import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  HelpModalCloseIcon,
  InviteEmailIcon,
  InviteFriendsJoinedIcon,
  InviteMoreShareIcon,
  InviteSmsIcon,
  InviteUserPlusIcon,
  InviteWhatsappIcon,
} from '../../shared/assets.jsx';
import { DIALOG_CARD, FOCUS_RING, HEADING, HelpButton, HelpModal } from './helpUi.jsx';
import { INVITE } from './helpData.js';

const log = debug('InviteFriendDialog');

/*
 * InviteFriendDialog — IV-01 "Invite a friend" (Playful 7857:13517 / Focused 8110:39766, modal 7857:14588 /
 * 8110:40427). Opened by `?dialog=invite` (mounted by TalentShellOverlays). Local mock: "Copy link" writes the
 * link to the clipboard, the share tiles open the matching share intent. Copy differs per style (Focused
 * "pts", Playful "XP") — both are in the DOM, one is `display:none` via the `playful:` variant.
 *
 * Props (all optional): `settings` ({ update }) or `onClose`; otherwise closes by editing the URL itself.
 */
const SHARE = [
  { label: INVITE.share[0], Icon: InviteWhatsappIcon },
  { label: INVITE.share[1], Icon: InviteEmailIcon },
  { label: INVITE.share[2], Icon: InviteSmsIcon },
  { label: INVITE.share[3], Icon: InviteMoreShareIcon },
];

const LINK = `https://${INVITE.link}`;
const MESSAGE = `Join me on Ghana Talent Hub: ${LINK}`;

const shareHref = (label) => {
  if (label === 'WhatsApp') return `https://wa.me/?text=${encodeURIComponent(MESSAGE)}`;
  if (label === 'Email')
    return `mailto:?subject=${encodeURIComponent('Ghana Talent Hub')}&body=${encodeURIComponent(MESSAGE)}`;
  if (label === 'SMS') return `sms:?&body=${encodeURIComponent(MESSAGE)}`;
  return null;
};

const Unit = () => (
  <>
    <span className="playful:hidden">{INVITE.unitFocused}</span>
    <span className="hidden playful:inline">{INVITE.unitPlayful}</span>
  </>
);

const InviteFriendDialog = ({ settings, onClose }) => {
  const uid = useId();
  const [params, setParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  log('mount');

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const close = () => {
    log('close');
    if (onClose) onClose();
    else if (settings?.update) settings.update({ dialog: null });
    else {
      const next = new URLSearchParams(params);
      next.delete('dialog');
      setParams(next, { replace: true });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(LINK);
      log('link copied');
    } catch (err) {
      log.error('clipboard unavailable', err);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const share = async (label) => {
    log('share', label);
    if (label === 'More' && navigator.share) {
      try {
        await navigator.share({ title: 'Ghana Talent Hub', text: MESSAGE, url: LINK });
      } catch (err) {
        log('share dismissed', err?.name);
      }
      return;
    }
    const href = shareHref(label);
    if (href) window.open(href, '_blank', 'noopener');
    else copy();
  };

  return (
    <HelpModal
      onClose={close}
      labelledBy={`${uid}-title`}
      scrim="rgba(28,42,33,0.55)"
      cardClassName="max-w-[540px]"
    >
      <div className={classNames(DIALOG_CARD, 'flex flex-col gap-[16px] p-[clamp(18px,2vw,28px)]')}>
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#387440] playful:bg-[#ebf1ec]">
            <InviteUserPlusIcon className="size-[21px]" />
          </span>
          <h2
            id={`${uid}-title`}
            className={classNames(
              'm-0 min-w-0 flex-1 text-[24px] leading-[1.2] tracking-[-0.24px] text-[#1c2a21]',
              HEADING
            )}
          >
            {INVITE.title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={classNames(
              'flex shrink-0 cursor-pointer items-start rounded-full bg-[#f8f8f4] p-[6px]',
              FOCUS_RING
            )}
          >
            <HelpModalCloseIcon className="size-[18px]" />
          </button>
        </div>

        <p className="m-0 font-sans text-[15px] leading-[1.45] text-[#1c2a21]">
          {INVITE.bodyPre}
          <Unit />
          {INVITE.bodyPost}
        </p>

        <div className="flex items-center gap-[10px] rounded-[14px] bg-[#f8f8f4] py-[6px] pl-[16px] pr-[6px]">
          <span className="min-w-0 flex-1 truncate font-mono text-[15px] leading-[1.2] text-[#1c2a21]">
            {INVITE.link}
          </span>
          <HelpButton
            tone="primary"
            size="lg"
            className="!h-auto py-[12px] !text-[16px]"
            onClick={copy}
          >
            {INVITE.copy}
          </HelpButton>
          <span role="status" className="sr-only">
            {copied ? 'Link copied' : ''}
          </span>
        </div>

        <div className="flex gap-[10px]">
          {SHARE.map((item) => {
            const { label } = item;
            const Icon = item.Icon;
            return (
              <button
                key={label}
                type="button"
                onClick={() => share(label)}
                className={classNames(
                  'flex min-w-px flex-1 cursor-pointer flex-col items-center gap-[6px] rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)] bg-white py-[14px] playful:border-[rgba(28,42,33,0.15)]',
                  FOCUS_RING
                )}
              >
                <Icon className="size-[22px]" />
                <span className="font-sans text-[13px] font-semibold leading-[1.2] text-[#1c2a21]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-[10px] rounded-[14px] bg-[#ebf1ec] p-[14px]">
          <InviteFriendsJoinedIcon className="size-[18px] shrink-0" />
          <p className="m-0 min-w-0 flex-1 font-sans text-[14px] font-semibold leading-[1.2] text-[#2a5730]">
            {INVITE.statsPre}
            <Unit />
            {INVITE.statsPost}
          </p>
        </div>
      </div>
    </HelpModal>
  );
};

export default InviteFriendDialog;
