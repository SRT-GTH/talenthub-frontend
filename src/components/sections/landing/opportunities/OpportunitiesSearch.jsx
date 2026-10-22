import { HERO, TYPES } from './OpportunitiesData.js';
import { ArrowRightGlyph, PinGlyph, SearchGlyph } from './OpportunitiesIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('OpportunitiesSearch');

const CARD_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';

const Field = ({ icon, value, onChange, placeholder, label, className }) => (
  <label
    className={classNames(
      'flex min-w-0 items-center gap-[10px] rounded-[14px] bg-[#f7f8f4] px-[14px] py-3',
      className
    )}
  >
    <span className="size-[18px] shrink-0 text-[#595959]">{icon}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[16px] leading-[19px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
    />
  </label>
);

/*
 * Hero search block (Figma "Frame 134" 7797:28438 / mobile 7815:305782): search bar (query + location + Search button) and the
 * type chips with counts. Desktop: one row, 74px bar; tablet/mobile (<1280): fields stacked, full-width button.
 * State lives in the URL via `update` (see useOpportunitiesParams).
 */
const OpportunitiesSearch = ({ state, update }) => {
  log('render', { q: state.q, loc: state.loc, type: state.type });
  return (
    <div className="mt-[18px] flex w-full flex-col gap-6 min-[1700px]:w-[1040px]">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          log('search submit', { q: state.q, loc: state.loc });
        }}
        className={classNames(
          'flex flex-col gap-3 rounded-[24px] border-[1.4px] border-[#1c2a21]/[0.32] bg-white py-[10px] pl-5 pr-[10px] xl:flex-row xl:items-center xl:gap-[10px]',
          CARD_SHADOW
        )}
      >
        <Field
          icon={<SearchGlyph />}
          value={state.q}
          onChange={(v) => update({ q: v })}
          placeholder={HERO.queryPlaceholder}
          label={HERO.queryPlaceholder}
          className="xl:flex-[470]"
        />
        <Field
          icon={<PinGlyph />}
          value={state.loc}
          onChange={(v) => update({ loc: v })}
          placeholder={HERO.locationPlaceholder}
          label={HERO.locationPlaceholder}
          className="xl:flex-[300]"
        />
        <span aria-hidden="true" className="hidden xl:block xl:flex-[131]" />
        <button
          type="submit"
          className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-[10px] border-2 border-[#2a5730] bg-[#387440] px-5 font-sans text-[16px] font-bold tracking-[0.1px] text-[#fef1e7] shadow-[0_4px_0_#224626] xl:px-7"
        >
          {HERO.searchLabel}
          <span className="size-5 shrink-0 text-white">
            <ArrowRightGlyph />
          </span>
        </button>
      </form>
      <div
        role="group"
        aria-label="Opportunity type"
        className="flex flex-wrap gap-2 xl:max-w-[950px]"
      >
        {TYPES.map((t) => {
          const active = state.type === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => update({ type: t.id })}
              className={classNames(
                'inline-flex h-9 cursor-pointer items-center gap-[6px] rounded-full border-[1.5px] px-[14px] font-sans text-[14px] font-semibold',
                active
                  ? 'border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]'
                  : 'border-white/35 bg-white/10 text-white'
              )}
            >
              {t.label}
              <span
                className={classNames(
                  'text-[12px] font-bold',
                  active ? 'text-[#785910]' : 'text-[#ffd86b]'
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunitiesSearch;
