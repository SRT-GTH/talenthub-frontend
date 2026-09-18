import { useEffect, useRef, useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { CREATE_POST_COPY, CREATE_POST_TYPES } from './communityData.js';

const log = debug('CreatePostModal');

/*
 * CreatePostModal — Figma frame 7025:88607, modal card 7025:89210.
 *
 * Card: white, r24, px32 py28, shadow
 *   0 40px 100px rgba(0,0,0,.25), 0 4px 0 rgba(0,0,0,.13)
 * Close: 28px #ebf1ec puck top-right — supplied by this card, so Modal's own
 * X is suppressed with `showClose={false}`.
 *
 * NB Figma's type chips here are SINGULAR ("Achievement", "Question") while
 * the feed filter chips are plural ("Achievements", "Questions"). Both sets
 * are reproduced verbatim from their own nodes rather than unified.
 *
 * "Links" section: label + a shelf "＋ Add" button (7025:89235). Figma never
 * shows what an added link row looks like, so pressing Add appends a plain
 * URL input styled like the body field and logs the branch — nothing about
 * the row's appearance is invented beyond reusing the field Figma does show.
 */

const SUBMIT_LABEL_GRADIENT = 'linear-gradient(188.38deg, #fef1e7 0%, #e8f2ed 20.192%)';
const CHIP_LABEL_GRADIENT = 'linear-gradient(193.15deg, #fef1e7 0%, #e8f2ed 20.192%)';

const ShelfButton = ({ children, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'flex items-center justify-center gap-[4px] rounded-[14px] border-b-2 border-l-2 border-r-2 border-t border-[rgba(17,17,17,0.3)] bg-white px-[18px] py-[10px] drop-shadow-[0px_4px_0px_rgba(17,17,17,0.25)] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_rgba(17,17,17,0.25)]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      className
    )}
  >
    {children}
  </button>
);

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState(CREATE_POST_TYPES[0]);
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState([]);
  const [links, setLinks] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    log('mount', { defaultType: CREATE_POST_TYPES[0], maxLength: CREATE_POST_COPY.maxLength });
    setType(CREATE_POST_TYPES[0]);
    setBody('');
    setPhotos([]);
    setLinks([]);
    setDragOver(false);
  }, [isOpen]);

  const handleFiles = (fileList) => {
    const picked = Array.from(fileList ?? []);
    if (!picked.length) {
      log('branch: file selection produced no files');
      return;
    }
    log(
      'photos selected:',
      picked.length,
      picked.map((file) => file.name)
    );
    setPhotos((current) => [...current, ...picked]);
  };

  const handleSubmit = () => {
    if (!body.trim()) {
      log('branch: post submit blocked — empty body');
      return;
    }
    const payload = {
      type,
      body: body.trim(),
      photoCount: photos.length,
      links: links.filter(Boolean),
    };
    log('post submitted:', payload);
    onSubmit?.(payload);
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showClose={false}
      ariaLabel={CREATE_POST_COPY.title}
      contentClassName="!rounded-[24px] !shadow-[0px_40px_100px_0px_rgba(0,0,0,0.25),0px_4px_0px_0px_rgba(0,0,0,0.13)]"
    >
      <div className="relative flex flex-col items-start gap-[24px] px-[32px] py-[28px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[14px] top-[11px] inline-flex size-[28px] items-center justify-center rounded-[20px] bg-brand-green-light transition-colors hover:bg-brand-green-light-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <CommunityIcon src={icons.modalClose} size={16} />
        </button>

        <div className="flex flex-col items-start gap-[4px]">
          <h2 className="font-display text-[32px] text-black">{CREATE_POST_COPY.title}</h2>
          <p className="font-sans text-[14px] text-[#595959]">
            {CREATE_POST_COPY.postingToLead}
            <span className="font-medium text-brand-green">{CREATE_POST_COPY.postingToTarget}</span>
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-[14px]">
          {/* Type chips */}
          <div
            className="flex flex-wrap items-center gap-[10px]"
            role="group"
            aria-label="Post type"
          >
            {CREATE_POST_TYPES.map((item) => {
              const active = item === type;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    log('post type selected:', item);
                    setType(item);
                  }}
                  className={classNames(
                    'flex flex-col items-center justify-center rounded-[100px] border border-brand-green-light-hover px-[12px] py-[6px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.06)] transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    active ? 'bg-brand-green' : 'bg-white hover:bg-brand-green-light'
                  )}
                >
                  <span
                    className={classNames(
                      'whitespace-nowrap font-sans text-[12.5px] font-medium leading-5 tracking-[0.2px]',
                      active ? 'bg-clip-text text-transparent' : 'text-[#737373]'
                    )}
                    style={active ? { backgroundImage: CHIP_LABEL_GRADIENT } : undefined}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Body */}
          <label className="flex h-[179px] w-full items-start gap-[8px] overflow-hidden rounded-[10px] border border-[#ccc] bg-white px-[16px] py-[13px] shadow-[0px_2.5px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active">
            <span className="sr-only">{CREATE_POST_COPY.placeholder}</span>
            <textarea
              value={body}
              maxLength={CREATE_POST_COPY.maxLength}
              placeholder={CREATE_POST_COPY.placeholder}
              onChange={(event) => setBody(event.target.value)}
              className="size-full resize-none bg-transparent font-sans text-[14px] leading-5 tracking-[0.2px] text-black outline-none placeholder:text-[#999]"
            />
          </label>

          {/* Upload dropzone */}
          <div
            onDragOver={(event) => {
              event.preventDefault();
              if (!dragOver) {
                log('branch: dragover → dropzone hover state');
                setDragOver(true);
              }
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              log('branch: files dropped on dropzone');
              handleFiles(event.dataTransfer?.files);
            }}
            className={classNames(
              'flex w-full items-center justify-center gap-[10px] rounded-[16px] border border-dashed border-[#bfbfbf] py-[24px] transition-colors',
              dragOver ? 'bg-brand-green-light' : 'bg-[#f8f8f8]'
            )}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-[10px] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.images} size={20} />
              <span className="flex flex-col items-start justify-center gap-[2px] text-left">
                <span className="whitespace-nowrap font-sans text-[15px] font-medium text-neutral-darker">
                  {CREATE_POST_COPY.uploadTitle}
                </span>
                <span className="whitespace-nowrap font-sans text-[12px] text-neutral-dark-hover">
                  {CREATE_POST_COPY.uploadHint}
                </span>
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </div>

          {photos.length > 0 && (
            <ul className="flex w-full flex-wrap gap-[8px]">
              {photos.map((file) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="rounded-[8px] bg-neutral px-[10px] py-[6px] font-sans text-[12px] text-[#595959]"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          )}

          {/* Links */}
          <div className="flex w-full flex-col items-start gap-[14px]">
            <div className="flex w-full items-center justify-between overflow-hidden pr-[8px]">
              <span className="whitespace-nowrap font-sans text-[14px] font-medium text-black">
                {CREATE_POST_COPY.linksLabel}
              </span>
            </div>

            {links.map((link, index) => (
              <label
                key={`link-${index}`}
                className="flex w-full items-center overflow-hidden rounded-[10px] border border-[#ccc] bg-white px-[16px] py-[13px] shadow-[0px_2.5px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active"
              >
                <span className="sr-only">{`Link ${index + 1}`}</span>
                <input
                  type="url"
                  value={link}
                  onChange={(event) => {
                    const next = [...links];
                    next[index] = event.target.value;
                    setLinks(next);
                  }}
                  className="w-full bg-transparent font-sans text-[14px] leading-5 tracking-[0.2px] text-black outline-none placeholder:text-[#999]"
                />
              </label>
            ))}

            <ShelfButton
              onClick={() => {
                log('link row added — total now', links.length + 1);
                setLinks((current) => [...current, '']);
              }}
            >
              <CommunityIcon src={icons.addLine} size={16} />
              <span className="whitespace-nowrap font-sans text-[14px] font-semibold tracking-[0.1px] text-black">
                {CREATE_POST_COPY.addLabel}
              </span>
            </ShelfButton>
          </div>

          {/* Footer */}
          <div className="flex w-full items-center justify-between bg-white">
            <span className="whitespace-nowrap font-sans text-[11px] text-[#bfbfbf]">
              {`${body.length} / ${CREATE_POST_COPY.maxLength}`}
            </span>
            <div className="flex items-start gap-[12px] bg-white">
              <ShelfButton onClick={onClose}>
                <span className="whitespace-nowrap font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black">
                  {CREATE_POST_COPY.cancelLabel}
                </span>
              </ShelfButton>
              <button
                type="button"
                onClick={handleSubmit}
                /* Figma renders this at full brand-green with an empty
                   textarea (7025:89246), so it is not visually dimmed — the
                   empty case is guarded in handleSubmit. */
                aria-disabled={!body.trim() || undefined}
                className={classNames(
                  'flex items-center justify-center gap-[8px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[18px] py-[10px] drop-shadow-[0px_4px_0px_#224626] transition-transform',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  'active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626]'
                )}
              >
                <span
                  className="whitespace-nowrap bg-clip-text font-sans text-[14px] font-bold leading-6 tracking-[0.1px] text-transparent"
                  style={{ backgroundImage: SUBMIT_LABEL_GRADIENT }}
                >
                  {CREATE_POST_COPY.submitLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
