import { useEffect } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { useAdminToast } from '../../useAdminData.js';
import { useCopyKv } from '../useCopyKv.js';
import { MediaInfoIcon } from '../media/MediaIcons.jsx';
import { MEDIA_ASSETS } from '../media/mediaLibraryData.js';
import { mediaCounts } from '../media/mediaLibraryModel.js';

const log = debug('MediaStorageSettings');

/*
 * MediaStorageSettings — Platform Admin 7.8.9n "Settings → Integrations · media storage" (Super Admin, `/admin/media/storage?role=super`; area `media`).
 * Title "Settings" + "Integrations · media storage", one card "Media storage": Cloudinary (In use, selected 2px #387440 on #ebf1ec@.5, toggle on) and Amazon S3 (Ready,
 * toggle off) and the amber note "Changing storage affects new uploads only. Files already in the library stay where they are."
 * The choice is kept in useCopyKv('media.storage'); switching makes the other provider "Ready" (one provider is always in use). The file count is the live library total.
 * ⚠️ ASSUMPTION: only a Super Admin can switch (other roles see the toggles disabled); the "In use / Ready" captions of the OTHER state (S3 in use, Cloudinary ready)
 * are invented in the voice of the drawn ones; turning the provider that is in use off explains that another one has to be switched on instead (a toast).
 * ⚠️ The Settings tab strip is not drawn in the frame; this screen is reached by the Settings → Integrations tab linking to it (request to the lead).
 * Figma flaw kept: the frame's sidebar highlights Settings; here the chrome highlights "Media library" because the path starts with /admin/media.
 */
const PROVIDERS = [
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    on: (n) => `In use for new uploads · ${n} files · optimised WebP and AVIF copies`,
    off: 'Ready for later · optimised WebP and AVIF copies',
  },
  {
    id: 's3',
    name: 'Amazon S3',
    on: (n) =>
      `In use for new uploads · ${n} files · files are private and served through GTH links`,
    off: 'Ready for later · files are private and served through GTH links',
  },
];

const Toggle = ({ on, label, disabled, onClick }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    aria-disabled={disabled || undefined}
    onClick={onClick}
    className={classNames(
      'relative inline-flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border border-solid border-[#1c2a21]/12 p-[2px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] motion-reduce:transition-none',
      on ? 'justify-end bg-[#387440]' : 'justify-start bg-[#e7e7e7]',
      disabled && 'cursor-not-allowed opacity-60'
    )}
  >
    <span className="size-[20px] rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-white" />
  </button>
);

const MediaStorageSettings = ({ session }) => {
  const [active, setActive] = useCopyKv('media.storage', 'cloudinary');
  const [assets] = useCopyKv('media.assets', MEDIA_ASSETS);
  const [toastEl, toast] = useAdminToast();
  const canSwitch = session.role === 'super';
  const c = mediaCounts(assets);
  const files = c.images + c.documents;

  useEffect(() => {
    log('mount', { active, files, canSwitch, role: session.role });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (id) => {
    if (!canSwitch) {
      toast(
        'Only a Super Admin can change storage',
        'Ask a Super Admin to switch the provider.',
        'error'
      );
      return;
    }
    if (id === active) {
      log('turning off the provider in use is not possible');
      toast('One provider has to be in use', 'Switch the other provider on to change storage.');
      return;
    }
    log('storage switched', id);
    setActive(id);
    toast(
      'Storage changed',
      'New uploads go to the new provider. Existing files stay where they are.'
    );
  };

  return (
    <div className="flex flex-col gap-[24px] pt-[4px] lg:pt-[16px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,4.5vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Settings
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959]">
          Integrations · media storage
        </p>
      </header>
      <section
        aria-labelledby="media-storage-title"
        className="flex flex-col gap-[16px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,3vw,24px)] font-sans"
      >
        <h2
          id="media-storage-title"
          className="m-0 text-[19px] leading-[23px] font-semibold text-[#1c2a21]"
        >
          Media storage
        </h2>
        <p className="m-0 text-[14px] leading-[21px] text-[#575755]">
          Where uploaded images and PDFs are kept. Switching never changes how the media library
          works, and links on pages keep working.
        </p>
        {PROVIDERS.map((p) => {
          const on = p.id === active;
          return (
            <div
              key={p.id}
              data-provider={p.id}
              data-active={on}
              className={classNames(
                'flex items-center gap-[14px] rounded-[14px] p-[18px]',
                on
                  ? 'border-2 border-solid border-[#387440] bg-[#ebf1ec]/50 p-[17px]'
                  : 'border border-solid border-[#e7e7e7] bg-white'
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                    {p.name}
                  </span>
                  <span
                    className={classNames(
                      'inline-flex min-h-[32px] items-center rounded-full px-[14px] text-[13px] leading-[16px] font-semibold',
                      on ? 'bg-[#eaf3ec] text-[#27522e]' : 'bg-[#f4f7f5] text-[#5f6b63]'
                    )}
                  >
                    {on ? 'In use' : 'Ready'}
                  </span>
                </div>
                <span className="text-[13px] leading-[16px] text-[#575755]">
                  {on ? p.on(files) : p.off}
                </span>
              </div>
              <Toggle
                on={on}
                label={`${p.name}${on ? ', in use' : ''}`}
                disabled={!canSwitch}
                onClick={() => choose(p.id)}
              />
            </div>
          );
        })}
        <div
          role="note"
          className="flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] text-[14px] leading-[20px] font-medium text-[#463409]"
        >
          <MediaInfoIcon className="size-[18px] shrink-0" />
          Changing storage affects new uploads only. Files already in the library stay where they
          are.
        </div>
      </section>
      {toastEl}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.9n',
    area: 'media',
    priority: 10,
    match: (ctx) => ctx.segments[0] === 'storage',
    Component: MediaStorageSettings,
  },
];

export default MediaStorageSettings;
