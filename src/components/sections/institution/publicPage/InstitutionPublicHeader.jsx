import Button from '../../../ui/Button.jsx';
import InstitutionButton from '../InstitutionButton.jsx';

/*
 * InstitutionPublicHeader — "header" card of Figma 11.6.1h (8746:1722): r24, 1px #e7e7e7, p28; 96 monogram (#387440, r14, Bricolage 26), type pill (#faf4e8 / #785910),
 * name 32/38 Bricolage 600, about 16/24, "Visit website ↗" + "Contact the school". Props: institution (PUBLIC_INSTITUTION).
 * ⚠️ ASSUMPTION: Visit website opens the school site in a new tab, Contact the school opens a mailto to the contact email (registrar address).
 */
const InstitutionPublicHeader = ({ institution }) => (
  <div className="flex flex-col gap-[24px] rounded-[24px] border border-[#e7e7e7] bg-white p-[clamp(18px,1.62vw,28px)] shadow-[0_5px_17px_rgba(0,0,0,0.04)] md:flex-row md:items-center">
    <span
      aria-hidden="true"
      className="flex size-[96px] shrink-0 items-center justify-center rounded-[14px] bg-[#387440] font-heading text-[26px] leading-[31px] font-semibold tracking-[-0.26px] text-white"
    >
      {institution.monogram}
    </span>
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
      <span className="rounded-full bg-[#faf4e8] px-[10px] py-[4px] text-[12px] leading-[14px] font-semibold text-[#785910]">
        {institution.type}
      </span>
      <h2 className="m-0 font-heading text-[clamp(24px,1.85vw,32px)] leading-[1.2] font-semibold tracking-[-0.32px] text-[#1c2a21]">
        {institution.name}
      </h2>
      <p className="m-0 text-[16px] leading-[24px] text-[#595959]">{institution.about}</p>
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-[12px]">
      <InstitutionButton
        size="md"
        className="!h-[48px] !px-[22px] !text-[16px] !font-bold"
        onClick={() => window.open(institution.website, '_blank', 'noopener,noreferrer')}
      >
        Visit website ↗
      </InstitutionButton>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          window.location.href = `mailto:${institution.contactEmail}`;
        }}
      >
        Contact the school
      </Button>
    </div>
  </div>
);

export default InstitutionPublicHeader;
