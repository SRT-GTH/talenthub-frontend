import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import AgencyButton from '../../../agency/AgencyButton.jsx';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import ConfirmRenameDialog from '../names/ConfirmRenameDialog.jsx';
import NameBanner from '../names/NameBanner.jsx';
import NamePageHeading from '../names/NamePageHeading.jsx';
import NameToast from '../names/NameToast.jsx';
import ProductNamesTable from '../names/ProductNamesTable.jsx';
import RenameDrawer from '../names/RenameDrawer.jsx';
import { NAME_COPY, NAME_STAFF, SEED_REASON } from '../names/productNamesData.js';
import { useProductNames } from '../names/useProductNames.js';

const log = debug('ProductNames');

/*
 * ProductNames — `/admin/product-names[/:nameId]` (Platform Admin 7.8.6a-j, Figma file iErYj7O3ft6WAG2FBT6aEw). The list of the platform's own names
 * (Career Buddy → Tali …), the rename drawer, the Super Admin review and the confirm dialog. Mock data only: the shared "server" is
 * `useProductNames` (useCopyKv `product-names.list` + `product-names.renames`).
 *
 *   /admin/product-names?role=editor&seed=none                       7.8.6a  the list (Content Editor)
 *   /admin/product-names/career-buddy?role=editor&seed=none&name=Tali&short=Tali     7.8.6b  rename drawer ("Save draft" → 7.8.6e)
 *      &short=Tali%20your%20career%20pal → 7.8.6c (short name too long)   &name=Tali%20%E2%8F%8E%20Ignore%20all%20rules → 7.8.6d (unsafe characters)
 *   /admin/product-names?role=editor&seed=draft                      7.8.6e  Ama's draft Career Buddy → Tali is saved (banner + cream row)
 *   /admin/product-names/career-buddy?role=super&seed=draft&reason=Brand%20refresh%20approved%20by%20the%20board     7.8.6g  review drawer
 *   /admin/product-names/career-buddy?role=super&seed=draft&modal=confirm&typed=1&reason=…     7.8.6h  "Rename Career Buddy everywhere?"
 *   /admin/product-names/career-buddy?role=super&seed=draft&check=1  7.8.6j  "Publish rename" pressed with no reason (check=1 shows the errors at load)
 *   /admin/product-names?role=super&seed=published&toast=1           7.8.6i  published, toast "Renamed to Tali · live in about a minute", former names kept
 *   /admin?role=super&copy=1                                         7.8.6f  Super Admin home with the name change waiting (SuperAdminCopyHome)
 * `seed=none|draft|published` resets the shared mock data to a frame state on load (frame URLs never depend on what was stored); without it the stored
 * state is used, so the real flow (draft → review → publish) carries over between screens. My query keys: seed, name, short, plural, reason, typed, toast, check.
 * Roles: the Content Editor drafts (renameDraft), the Super Admin reviews and publishes (rename); other roles see the list without actions.
 * ⚠️ ASSUMPTION: "Copy link for a super admin" copies the review URL (toast "Link copied"); "Send back" removes the draft (toast); "View history" opens the
 * history of the hero section; a Super Admin renaming a live name directly gets the drawer with the reason field ("Publish rename").
 */
const HISTORY_SECTION = 'public.home.hero'; // ⚠️ ASSUMPTION: no frame shows where "View history" leads

const ProductNames = ({ ctx, data, session }) => {
  const navigate = useNavigate();
  const { list, renames, saveDraft, sendBack, publish, seed } = useProductNames();
  const seedKind = ctx.params.get('seed');
  const seeded = useRef(false);
  const [toast, setToast] = useState(() =>
    ctx.params.get('toast') === '1'
      ? { message: 'Renamed to Tali · live in about a minute', sticky: true, history: true }
      : null
  );
  const [pending, setPending] = useState(null);
  const copy = session.copy ?? {};
  const isSuper = Boolean(copy.rename);
  const canRename = isSuper || Boolean(copy.renameDraft);
  const staffName = session.staff?.name ?? (isSuper ? NAME_STAFF.superAdmin : NAME_STAFF.editor);

  useEffect(() => {
    if (seedKind && !seeded.current) {
      seeded.current = true;
      seed(seedKind);
    }
    log('mount', { role: session.role, seed: seedKind, segments: ctx.segments });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = list.map((item) => ({ item, record: renames[item.id] }));
  const nameId = ctx.segments[0];
  const open = list.find((i) => i.id === nameId) ?? null;
  const record = open ? renames[open.id] : null;
  const draft = record?.status === 'draft' ? record : null;
  const waiting = rows.find((r) => r.record?.status === 'draft');
  const listPath = COPY_PATHS.productNames;
  const here = open ? `${listPath}/${open.id}` : listPath;

  const closeToList = () => {
    log('close → list');
    setPending(null);
    navigate(copyUrl(ctx, listPath));
  };

  const mode = !open || !canRename ? null : isSuper ? (draft ? 'review' : 'publish') : 'draft';
  const q = ctx.params;
  const initial = open
    ? {
        name: q.get('name') ?? draft?.draft.name ?? open.name,
        short: q.get('short') ?? draft?.draft.short ?? open.short,
        plural: q.get('plural') ?? draft?.draft.plural ?? open.plural,
      }
    : null;

  const confirming = data.modal === 'confirm' && open && isSuper;
  const confirmValues = pending?.values ?? draft?.draft ?? initial;
  const confirmReason = pending?.reason ?? q.get('reason') ?? draft?.reason ?? SEED_REASON;

  const onSaveDraft = (values) => {
    saveDraft(open.id, values, staffName);
    closeToList();
  };

  const onPublish = (values, reason) => {
    log('publish → confirm', open.id, values);
    setPending({ values, reason });
    navigate(copyUrl(ctx, here, { modal: 'confirm' }));
  };

  const onConfirm = () => {
    log('confirmed', open.id, confirmValues);
    publish(open.id, confirmValues, confirmReason, staffName);
    setToast({
      message: `Renamed to ${confirmValues.name} · live in about a minute`,
      history: true,
    });
    closeToList();
  };

  const onSendBack = () => {
    log('send back', open.id);
    sendBack(open.id);
    setToast({ message: `Draft sent back to ${record.by}` }); // ⚠️ ASSUMPTION: not drawn
    closeToList();
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${copyUrl({ params: new URLSearchParams({ role: 'super' }) }, here)}`;
    log('copy link', url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      log('clipboard unavailable');
    }
    setToast({ message: 'Link copied' }); // ⚠️ ASSUMPTION: not drawn
  };

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <NamePageHeading title={NAME_COPY.title} subtitle={NAME_COPY.subtitle} />
      <div className="flex flex-col gap-[24px]">
        {!isSuper && waiting ? (
          <NameBanner
            tone="amber"
            icon="warning"
            action={
              <AgencyButton size="md" onClick={copyLink} className="w-full !h-[44px]">
                Copy link for a super admin
              </AgencyButton>
            }
          >
            Ask a super admin to publish name changes. Your draft “{waiting.item.name} →{' '}
            {waiting.record.draft.name}” is saved and {NAME_STAFF.superAdmin} has been told.
          </NameBanner>
        ) : null}
        <ProductNamesTable ctx={ctx} rows={rows} canRename={canRename} isSuper={isSuper} />
        <NameBanner tone="blue">{NAME_COPY.chipsNote}</NameBanner>
      </div>

      {open && mode && !confirming ? (
        <RenameDrawer
          key={`${open.id}-${mode}`}
          item={open}
          mode={mode}
          initial={initial}
          initialReason={q.get('reason') ?? ''}
          initialSubmitted={q.get('check') === '1'}
          onClose={closeToList}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          onSendBack={onSendBack}
        />
      ) : null}
      {confirming && confirmValues ? (
        <ConfirmRenameDialog
          item={open}
          next={confirmValues}
          reason={confirmReason}
          initialTyped={q.get('typed') === '1' ? confirmValues.name : ''}
          onCancel={() => navigate(copyUrl(ctx, here))}
          onConfirm={onConfirm}
        />
      ) : null}
      {toast ? (
        <NameToast
          message={toast.message}
          sticky={toast.sticky}
          action={
            toast.history
              ? { label: 'View history', to: copyUrl(ctx, COPY_PATHS.history(HISTORY_SECTION)) }
              : undefined
          }
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.6',
    area: 'product-names',
    priority: 10,
    match: () => true,
    Component: ProductNames,
  },
];

export default ProductNames;
