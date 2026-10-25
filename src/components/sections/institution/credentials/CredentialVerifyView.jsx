import { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { RecordsIconArrowr } from '../records/recordsIcons.jsx';
import {
  CredentialsIconCheckcircle30,
  CredentialsIconError30,
  CredentialsIconSearch,
  CredentialsIconShield,
} from './credentialsIcons.jsx';
import {
  VERIFY_CHECKED_AT,
  VERIFY_ISSUED_BY,
  VERIFY_POINTS,
  VERIFY_RECORDS,
} from './data/credentialsData.js';

const log = debug('CredentialVerifyView');

/*
 * CredentialVerifyView — the public "Verify a credential" page (Figma 11.2.4i Valid 8744:437743, 11.2.4j Revoked 8744:437962), drawn inside the Theme 8 public chrome (PublicDataFrame, "Directory").
 * Breadcrumb · title 36/43 · sentence · the check form · the result card (status banner, seven detail rows, "Checked …" footer) · three "how it works" tiles.
 * Which record shows: ?state=valid|revoked wins; otherwise the number in the URL (…00203 is the revoked sample, …00297 the valid one); any other id shows the valid sample (⚠️ ASSUMPTION: the
 * frames draw no "not found" state, so there is none: the form just checks again). "Check credential" goes to /institution/verify/<number>.
 * Props: credentialId (route param), state (?state).
 */
const BANNERS = {
  valid: {
    bg: 'bg-[#ebf1ec]',
    Icon: CredentialsIconCheckcircle30,
    iconTone: 'text-[#387440]',
    title: 'Valid credential',
    titleTone: 'text-[#387440]',
    sentence: 'Signed by a verified institution and unchanged since it was issued.',
  },
  revoked: {
    bg: 'bg-[#f9ebea]',
    Icon: CredentialsIconError30,
    iconTone: 'text-[#c0392b]',
    title: 'Revoked credential',
    titleTone: 'text-[#c0392b]',
    sentence: 'Savannah Hills SHS revoked this on 18 Oct 2026. Don’t accept it as proof.',
  },
};

const resolve = (credentialId, state) => {
  if (state === 'revoked' || state === 'valid') return state;
  return /00203$/.test(credentialId ?? '') ? 'revoked' : 'valid';
};

const CredentialVerifyView = ({ credentialId, state }) => {
  const navigate = useNavigate();
  const inputId = useId();
  const outcome = resolve(credentialId, state);
  const record = VERIFY_RECORDS[outcome];
  const banner = BANNERS[outcome];
  const BannerIcon = banner.Icon;
  const [text, setText] = useState(record.number);

  useEffect(() => {
    log('mount', { credentialId, outcome });
    setText(VERIFY_RECORDS[outcome].number);
  }, [credentialId, outcome]);

  const rows =
    outcome === 'valid'
      ? [
          ['Holder', record.holder],
          ['Credential', record.credential],
          ['Credential ID', record.credentialId],
          ['Issued by', VERIFY_ISSUED_BY],
          ['Issued', record.issued],
          ['Signed by', record.signedBy],
          ['Signature', record.signature],
        ]
      : [
          ['Holder', record.holder],
          ['Credential', record.credential],
          ['Credential ID', record.credentialId],
          ['Issued by', VERIFY_ISSUED_BY],
          ['Issued', record.issued],
          ['Revoked', record.revoked, 'text-[#c0392b]'],
          ['Reason', record.reason],
        ];

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    log('check', value);
    if (value) navigate(`/institution/verify/${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-col gap-[24px] px-[clamp(16px,2.8vw,40px)] pt-[24px] pb-[48px] font-sans">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-[8px] text-[14px] leading-[17px]"
      >
        <Link to="/data" className="font-semibold text-[#387440] no-underline">
          gth.com
        </Link>
        <span aria-hidden="true" className="text-[#595959]">
          ›
        </span>
        <span aria-current="page" className="font-semibold text-[#387440]">
          Verify a credential
        </span>
      </nav>
      <header className="flex max-w-[760px] flex-col gap-[6px]">
        <h1 className="m-0 text-[30px] leading-[36px] font-semibold text-[#1c2a21] md:text-[36px] md:leading-[43px]">
          Verify a credential
        </h1>
        <p className="m-0 text-[15px] leading-[18px] text-[#575755]">
          Enter the ID printed on the certificate, or scan its QR code. Checking is free and doesn’t
          need an account.
        </p>
      </header>
      <form onSubmit={submit} className="flex max-w-[702px] flex-wrap gap-[12px]">
        <label
          htmlFor={inputId}
          className="flex h-[48px] min-w-[220px] flex-1 items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[16px] focus-within:outline-2 focus-within:outline-[#387440]"
        >
          <span className="sr-only">Credential ID</span>
          <CredentialsIconSearch className="size-[18px] shrink-0 text-[#575755]" />
          <input
            id={inputId}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21] outline-none"
          />
        </label>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="!text-[14px] !font-semibold"
          rightIcon={<RecordsIconArrowr className="size-[20px]" />}
        >
          Check credential
        </Button>
      </form>
      <section
        aria-label={banner.title}
        className="max-w-[900px] overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white"
      >
        <div
          className={`flex items-center gap-[14px] px-[clamp(16px,2vw,28px)] py-[20px] ${banner.bg}`}
        >
          <BannerIcon className={`size-[30px] shrink-0 ${banner.iconTone}`} />
          <div className="flex min-w-0 flex-col gap-[4px]">
            <h2 className={`m-0 text-[22px] leading-[26px] font-semibold ${banner.titleTone}`}>
              {banner.title}
            </h2>
            <p className="m-0 text-[14px] leading-[17px] text-[#1c2a21]">{banner.sentence}</p>
          </div>
        </div>
        <dl className="m-0 px-[clamp(16px,2vw,28px)] pt-[8px] pb-[20px]">
          {rows.map(([label, value, tone]) => (
            <div
              key={label}
              className="flex flex-col gap-[4px] py-[14px] sm:flex-row sm:gap-[16px]"
            >
              <dt className="text-[14px] leading-[17px] font-medium text-[#575755] sm:w-[180px] sm:shrink-0">
                {label}
              </dt>
              <dd
                className={`m-0 min-w-0 flex-1 text-[15px] leading-[18px] font-semibold ${tone ?? 'text-[#1c2a21]'}`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="m-0 flex items-start gap-[10px] px-[clamp(16px,2vw,28px)] pt-[16px] pb-[20px] text-[13px] leading-[16px] text-[#575755]">
          <CredentialsIconShield className="size-[16px] shrink-0 text-[#575755]" />
          <span>
            {VERIFY_CHECKED_AT} This page shows only what the holder shares. Report a problem →
          </span>
        </p>
      </section>
      <ul className="m-0 grid max-w-[906px] list-none grid-cols-1 gap-[24px] p-0 md:grid-cols-3">
        {VERIFY_POINTS.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-[6px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[20px]"
          >
            <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">{p.title}</p>
            <p className="m-0 text-[13px] leading-[16px] text-[#575755]">{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CredentialVerifyView;
