import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import {
  CredentialsIconGrad16,
  CredentialsIconInfo,
  CredentialsIconPin16,
  CredentialsIconSpark,
} from './credentialsIcons.jsx';
import { RecordsIconCheck11, RecordsIconClock } from '../records/recordsIcons.jsx';
import { ISSUER } from './data/credentialsData.js';

/*
 * CertificateSideRail — the right column of the certificate page (Figma 11.2.4c "right column" 8593:390409, 380 wide, gap 16):
 *   the green "SIGNATURE" card (Valid sticker, "Signed" 64/70, the key sentence, three rows Credential ID · Signed on · Status, "How signing works"),
 *   the amber "Anyone can check it" card (Public sticker, sentence, Copy verify link · Download PDF) and the "ISSUED BY" card (monogram + verified badge, name, role, second signatory).
 * ⚠️ ASSUMPTIONS: "How signing works", "Download PDF" and the report link have no destination in the frames and stay inert; "Copy verify link" copies the public verify URL.
 * Props: cert ({ number, signedOn, status, firstName, signerName, secondName }), onCopy().
 */
const ROWS = [
  { id: 'id', label: 'Credential ID', icon: CredentialsIconSpark },
  { id: 'on', label: 'Signed on', icon: CredentialsIconGrad16 },
  { id: 'status', label: 'Status', icon: CredentialsIconPin16 },
];

const CertificateSideRail = ({ cert, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const values = { id: cert.number, on: cert.signedOn, status: cert.status };
  const copy = () => {
    onCopy();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col gap-[16px] font-sans">
      <section
        aria-label="Signature"
        className="flex flex-col gap-[12px] rounded-[26px] border border-solid border-[#1c2a21]/10 bg-[#387440] p-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-between gap-[8px]">
          <p className="m-0 text-[12px] leading-[14px] font-bold text-[#c1d4c4]">SIGNATURE</p>
          <span className="inline-flex h-[22px] items-center rounded-full bg-[#ebf1ec] px-[10px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
            {cert.status}
          </span>
        </div>
        <p className="m-0 text-[48px] leading-[56px] font-semibold text-white md:text-[64px] md:leading-[70px]">
          Signed
        </p>
        <p className="m-0 text-[14px] leading-[20px] text-[#e1eae2]">
          Signed with Savannah Hills SHS’s institution key on issue.
        </p>
        <dl className="m-0 flex flex-col rounded-[16px] bg-white/10 px-[14px] py-[4px]">
          {ROWS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.id} className="flex items-center gap-[10px] py-[10px]">
                <Icon className="size-[16px] shrink-0 text-[#c1d4c4]" />
                <dt className="flex-1 text-[14px] leading-[17px] font-medium text-white">
                  {r.label}
                </dt>
                <dd className="m-0 text-right text-[14px] leading-[17px] font-semibold text-[#ffd86b]">
                  {values[r.id]}
                </dd>
              </div>
            );
          })}
        </dl>
        <div>
          <span className="inline-flex h-[29px] items-center gap-[6px] rounded-full border border-solid border-[#1c2a21]/12 bg-white pr-[12px] pl-[10px] text-[12.5px] leading-[15px] font-bold text-[#1c2a21]">
            <CredentialsIconInfo className="size-[14px]" />
            How signing works
          </span>
        </div>
      </section>
      <section
        aria-label="Anyone can check it"
        className="flex flex-col gap-[10px] rounded-[22px] border border-solid border-[#c8951a] bg-[#faf4e8] p-[20px]"
      >
        <div className="flex items-center gap-[8px]">
          <h2 className="m-0 text-[19px] leading-[24px] font-semibold text-[#1c2a21]">
            Anyone can check it
          </h2>
          <span className="inline-flex h-[21px] items-center rounded-full bg-[#ebf1ec] px-[10px] text-[11px] max-lg:text-[12px] leading-[13px] font-bold text-[#1f4a2b]">
            Public
          </span>
        </div>
        <p className="m-0 text-[13.5px] leading-[19px] text-[#595959]">
          Employers and universities enter the ID at gth.com/verify. They never see {cert.firstName}
          ’s other data.
        </p>
        <div className="flex flex-wrap gap-[8px] pt-[6px]">
          <Button variant="tertiary" size="sm" className="min-w-[110px] flex-1" onClick={copy}>
            {copied ? 'Copied' : 'Copy verify link'}
          </Button>
          <Button variant="tertiary" size="sm" className="min-w-[110px] flex-1">
            Download PDF
          </Button>
        </div>
      </section>
      <section
        aria-label="Issued by"
        className="flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[20px]"
      >
        <p className="m-0 text-[12px] leading-[14px] font-bold text-[#737373]">ISSUED BY</p>
        <div className="flex items-center gap-[12px]">
          <span className="relative flex size-[48px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-[17px] leading-[20px] font-semibold text-white">
            IA
            <span className="absolute -right-[2px] -bottom-[2px] flex size-[18px] items-center justify-center rounded-full border-2 border-solid border-white bg-[#224626]">
              <RecordsIconCheck11 className="size-[10px] text-white" />
            </span>
          </span>
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {cert.signerName}
            </p>
            <p className="m-0 text-[12.5px] leading-[15px] text-[#737373]">{ISSUER.signerRole}</p>
          </div>
        </div>
        <p className="m-0 inline-flex w-fit items-center gap-[6px] rounded-full bg-[#f8f8f4] px-[10px] py-[6px] text-[12.5px] leading-[15px] font-medium text-[#595959]">
          <RecordsIconClock className="size-[13px] shrink-0" />
          Second signatory: {cert.secondName}
        </p>
      </section>
    </div>
  );
};

export default CertificateSideRail;
