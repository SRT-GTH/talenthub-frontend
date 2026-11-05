import SectionOutline from './SectionOutline.jsx';

/*
 * MockGenericSection — any section without its own drawn mock page (Features, Made for Ghana, Footer, portal sections ...): the site nav above it and one
 * outlined card that lists the section's fields. ⚠️ ASSUMPTION: Figma draws the mock page of the Home hero, How it works and the FAQ only.
 * Props: meta (sectionMeta), t(key), outline (SectionOutline props).
 */
const MockGenericSection = ({ meta, t, outline }) => (
  <SectionOutline label={meta.label} name={`${meta.label} section`} {...outline}>
    <div className="flex flex-col gap-[14px] px-[40px] py-[28px]">
      <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
        {meta.label}
      </h2>
      {meta.fields.map((f) => (
        <p key={f.key} className="m-0 font-sans text-[16px] leading-[24px] text-[#575755]">
          {t(f.key)}
        </p>
      ))}
    </div>
  </SectionOutline>
);

export default MockGenericSection;
