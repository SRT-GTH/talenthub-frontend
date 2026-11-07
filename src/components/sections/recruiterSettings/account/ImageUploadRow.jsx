import { useRef } from 'react';
import Button from '../../../ui/Button.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ImageUploadRow');

/*
 * ImageUploadRow - the 72px round picture + title + description + outlined upload button (Figma "Logo" frames 10161:77540 "Profile Photo" and 10161:77836 "Company logo").
 * The button opens a hidden file input; the chosen image replaces the picture at once (mock: an object URL, nothing is uploaded).
 * Props: src, alt, title, description, buttonLabel, imageClassName (photo = soft shadow, logo = #f2f2f2 hairline), onChange(objectUrl).
 */
const DIALOG_BUTTON = '!h-[40px] !py-0 max-sm:w-full';

/* PickImageButton - the outlined button + the hidden file input behind it (mock: the chosen file becomes an object URL, nothing is uploaded). `height` = the Figma button height class. */
export const PickImageButton = ({ label, onPick, className = DIALOG_BUTTON }) => {
  const inputRef = useRef(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          log('picked', { type: file.type, size: file.size });
          onPick?.(URL.createObjectURL(file));
          event.target.value = '';
        }}
      />
      <Button variant="tertiary" className={className} onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
    </>
  );
};

const ImageUploadRow = ({
  src,
  alt,
  title,
  description,
  buttonLabel,
  imageClassName,
  onChange,
}) => (
  <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[12px]">
    <img
      src={src}
      alt={alt}
      width={72}
      height={72}
      className={classNames('size-[72px] shrink-0 rounded-full object-cover', imageClassName)}
    />
    <div className="flex min-w-[160px] flex-1 flex-col gap-[4px]">
      <p className="m-0 font-sans text-[16px] leading-[28px] font-medium tracking-[0.2px] text-[#111]">
        {title}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
        {description}
      </p>
    </div>
    <PickImageButton label={buttonLabel} onPick={onChange} />
  </div>
);

export default ImageUploadRow;
