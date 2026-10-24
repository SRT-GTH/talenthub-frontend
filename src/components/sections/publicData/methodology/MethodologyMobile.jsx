import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  METHODOLOGY_DEFINITIONS,
  METHODOLOGY_META,
  METHODOLOGY_SECTIONS as S,
  METHODOLOGY_TOC,
} from './data/methodologyData.js';

const log = debug('MethodologyMobile');

/*
 * MethodologyMobile — Figma 8.7.1b "Methodology · Mobile" (8508:503), shown below md. Title 26/31, one line, the "Jump to: <section> ▾"
 * selector (a native <select> laid over the drawn control, so the system picker opens), three short sections (18/21 headings, 15/23 text)
 * and the definitions as an accordion card (r16): "Placement ▸" collapsed, "Validated skill ▾" open as drawn; the term row is a button
 * (aria-expanded). The phone frame draws no "How we count", "Known limitations" or questions card: they stay desktop / tablet only.
 */

const JUMP_ITEMS = METHODOLOGY_TOC.filter((t) => !['count', 'limits', 'changes'].includes(t.id));

const MethodologyMobile = () => {
  const [jump, setJump] = useState('privacy');
  const [openDef, setOpenDef] = useState('validated-skill');
  const current = JUMP_ITEMS.find((t) => t.id === jump);

  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[20px] pb-[24px] md:hidden">
      <div className="flex flex-col gap-[4px]">
        <h1 className="m-0 font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21]">
          {METHODOLOGY_META.title}
        </h1>
        <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
          {METHODOLOGY_META.introShort}
        </p>
      </div>
      <label className="relative flex min-h-[43px] items-center justify-between gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] font-sans focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
        <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          Jump to: {current?.label}
        </span>
        <span aria-hidden="true" className="text-[12px] leading-[14px] font-bold text-[#595959]">
          ▾
        </span>
        <select
          aria-label="Jump to section"
          value={jump}
          onChange={(e) => {
            const id = e.target.value;
            log('jump', id);
            setJump(id);
            document
              .getElementById(`m-${id}`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          {JUMP_ITEMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      {[
        { id: 'sources', title: S.sources.title, text: S.sources.short },
        { id: 'privacy', title: S.privacy.title, text: S.privacy.short },
        { id: 'fresh', title: S.fresh.title, text: S.fresh.short },
      ].map((s) => (
        <section key={s.id} id={`m-${s.id}`} className="flex scroll-mt-[76px] flex-col gap-[6px]">
          <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
            {s.title}
          </h3>
          <p className="m-0 font-sans text-[15px] leading-[23px] text-[#1c2a21]">{s.text}</p>
        </section>
      ))}
      <section id="m-definitions" aria-label={S.definitions.title} className="scroll-mt-[76px]">
        <ul className="m-0 list-none overflow-hidden rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-0 shadow-[0_5px_17px_rgba(0,0,0,0.04)]">
          {METHODOLOGY_DEFINITIONS.map((d, i) => {
            const open = openDef === d.id;
            return (
              <li
                key={d.id}
                className={classNames(
                  'font-sans',
                  i > 0 && 'border-t border-solid border-[#e7e7e7]'
                )}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`def-${d.id}`}
                  onClick={() => setOpenDef(open ? null : d.id)}
                  className="flex min-h-[47px] w-full cursor-pointer items-center bg-transparent px-[16px] py-[14px] text-left text-[15px] leading-[18px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {d.term} {open ? '▾' : '▸'}
                </button>
                {open && (
                  <p
                    id={`def-${d.id}`}
                    className="m-0 px-[16px] pb-[14px] text-[14px] leading-[20px] text-[#595959]"
                  >
                    {d.body}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default MethodologyMobile;
