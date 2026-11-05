import MediaButton from './MediaButton.jsx';
import MediaDialogShell from './MediaDialogShell.jsx';
import { MediaWarning16Icon, MediaWarning21Icon } from './MediaIcons.jsx';

/*
 * MediaRefusedDialog — "2 files couldn’t be uploaded" (Figma 7.8.9d): red tile + warning icon, one #f9ebea@.5 row (r12, p12) per refused file with its name
 * (14/600) and the reason (13/500 #c0392b), "Nothing else was changed. You can try again with a different file.", then Close / "Choose other files".
 * ⚠️ ASSUMPTION: the title says "1 file couldn’t be uploaded" for a single file. Props: files [{ name, message }], onClose, onChooseOther.
 */
const MediaRefusedDialog = ({ files, onClose, onChooseOther }) => (
  <MediaDialogShell
    title={
      files.length === 1
        ? '1 file couldn’t be uploaded'
        : `${files.length} files couldn’t be uploaded`
    }
    icon={<MediaWarning21Icon className="size-[21px] text-[#c0392b]" />}
    tone="red"
    onClose={onClose}
  >
    <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
      {files.map((f) => (
        <li
          key={f.name}
          className="flex items-start gap-[10px] rounded-[12px] bg-[#f9ebea]/50 p-[12px]"
        >
          <MediaWarning16Icon className="mt-px size-[16px] shrink-0 text-[#c0392b]" />
          <div className="flex min-w-0 flex-col gap-[2px]">
            <span className="truncate text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {f.name}
            </span>
            <span role="alert" className="text-[13px] leading-[18px] font-medium text-[#c0392b]">
              {f.message}
            </span>
          </div>
        </li>
      ))}
    </ul>
    <p className="m-0 text-[13.5px] leading-[16px] text-[#575755]">
      Nothing else was changed. You can try again with a different file.
    </p>
    <div className="flex gap-[12px] max-sm:flex-col-reverse">
      <MediaButton variant="secondary" className="flex-1" onClick={onClose}>
        Close
      </MediaButton>
      <MediaButton className="flex-1" onClick={onChooseOther}>
        Choose other files
      </MediaButton>
    </div>
  </MediaDialogShell>
);

export default MediaRefusedDialog;
