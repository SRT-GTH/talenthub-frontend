import { useEffect } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { CONFIRM_JOB_POST } from './jobPostFormData.js';
import { ArrowRightIcon, EditPencilIcon } from '../../shared/assets.jsx';

const log = debug('ConfirmJobPostModal');

/*
 * ConfirmJobPostModal — Figma 5132:72890 / 72893 / 72894 / 72896 / 72897.
 * Nested confirm after "Post Job". No close (X) — dismiss only via
 * "Go back and edit" or overlay click / Escape.
 */
const ConfirmJobPostModal = ({ open, onClose, onConfirm }) => {
  useEffect(() => {
    if (open) log('mount', { open: true });
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="md"
      ariaLabel={CONFIRM_JOB_POST.title}
      showClose={false}
      className="!bg-[rgba(17,17,17,0.7)] !backdrop-blur-none"
      contentClassName="!max-w-[528px] !rounded-[24px] !overflow-hidden"
    >
      {/* Figma pad 48×64; title 36px Instrument Serif; body 16/24 #575755; CTA gap 36 then 8. */}
      <div className="flex flex-col items-center gap-[36px] px-[48px] py-[64px] text-center">
        <div className="flex w-full flex-col items-center gap-[10px]">
          <h2 className="font-display text-[36px] font-normal leading-[1.3] text-[#111]">
            {CONFIRM_JOB_POST.title}
          </h2>
          <p className="max-w-[432px] font-sans text-[16px] font-normal leading-6 text-[#575755]">
            {CONFIRM_JOB_POST.body}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-[8px]">
          <Button
            type="button"
            variant="primary"
            size="sm"
            rightIcon={<ArrowRightIcon />}
            onClick={() => {
              log('branch', { confirmPost: true });
              onConfirm?.();
            }}
          >
            {CONFIRM_JOB_POST.confirm}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            rightIcon={<EditPencilIcon className="size-[11px]" />}
            onClick={() => {
              log('branch', { goBackEdit: true });
              onClose?.();
            }}
            className="!rounded-[14px] !gap-[6px]"
          >
            {CONFIRM_JOB_POST.edit}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmJobPostModal;
