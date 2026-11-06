import { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, verifyCredential } from '../../../../services/institutionPortal.api.js';
import Button from '../../../ui/Button.jsx';
import { RecordsIconArrowr } from '../records/recordsIcons.jsx';
import {
  CredentialsIconCheckcircle30,
  CredentialsIconError30,
  CredentialsIconSearch,
  CredentialsIconShield,
} from './credentialsIcons.jsx';
import { VERIFY_POINTS } from './data/credentialsData.js';

const log = debug('CredentialVerifyView');

/*
 * CredentialVerifyView — the public "Verify a credential" page (Figma 11.2.4i Valid 8744:437743, 11.2.4j Revoked 8744:437962), inside the Theme 8 public chrome.
 * Breadcrumb · title · sentence · the check form · the result card (status banner, detail rows, "Checked …" footer) · three "how it works" tiles.
 * Live: GET /api/verify/:number (no sign-in). An unknown number shows "No credential with that ID" (not drawn; same card in grey).
 * /institution/verify (no number) shows only the form. Props: credentialId (the number from the URL).
 */
const BANNERS = {
  valid: {
    bg: 'bg-[#ebf1ec]',
    Icon: CredentialsIconCheckcircle30,
    iconTone: 'text-[#387440]',
    title: 'Valid credential',
    titleTone: 'text-[#387440]',
  },
  revoked: {
    bg: 'bg-[#f9ebea]',
    Icon: CredentialsIconError30,
    iconTone: 'text-[#c0392b]',
    title: 'Revoked credential',
    titleTone: 'text-[#c0392b]',
  },
  'not-found': {
    bg: 'bg-[#f3f3ef]',
    Icon: CredentialsIconError30,
    iconTone: 'text-[#595959]',
    title: 'No credential with that ID',
    titleTone: 'text-[#1c2a21]',
  },
};

const CredentialVerifyView = ({ credentialId }) => {
  const navigate = useNavigate();
  const inputId = useId();
  const [text, setText] = useState(credentialId ?? '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setText(credentialId ?? '');
    setResult(null);
    setError('');
    if (!credentialId) return undefined;
    let live = true;
    log('check', credentialId);
    verifyCredential(credentialId)
      .then((r) => live && setResult(r))
      .catch((err) => live && setError(apiMessage(err)));
    return () => {
      live = false;
    };
  }, [credentialId]);

  const banner = result ? (BANNERS[result.status] ?? BANNERS['not-found']) : null;
  const BannerIcon = banner?.Icon;
  const issuedBy = result?.issuer?.verifiedLine ?? '';
  const sentence = !result
    ? ''
    : result.status === 'valid'
      ? 'Signed by a verified institution and unchanged since it was issued.'
      : result.status === 'revoked'
        ? `${result.issuer?.short ?? 'The school'} revoked this on ${String(result.revoked).split(' · ')[0]}. Don’t accept it as proof.`
        : `Check the ID on the certificate and try again. IDs look like GTH-CR-0412-00297.`;

  const rows = !result
    ? []
    : result.status === 'valid'
      ? [
          ['Holder', result.holder],
          ['Credential', result.credential],
          ['Credential ID', result.credentialId],
          ['Issued by', issuedBy],
          ['Issued', result.issued],
          ['Signed by', result.signedBy],
          ['Signature', result.signature],
        ]
      : result.status === 'revoked'
        ? [
            ['Holder', result.holder],
            ['Credential', result.credential],
            ['Credential ID', result.credentialId],
            ['Issued by', issuedBy],
            ['Issued', result.issued],
            ['Revoked', result.revoked, 'text-[#c0392b]'],
            ['Reason', result.reason],
          ]
        : [['You entered', result.number]];

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
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
          Enter the ID printed on the certificate. Checking is free and doesn’t need an account.
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
            placeholder="GTH-CR-0000-00000"
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
      {error ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      {credentialId && !result && !error ? (
        <p className="m-0 text-[14px] text-[#737373]" role="status">
          Checking {credentialId}…
        </p>
      ) : null}
      {result ? (
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
              <p className="m-0 text-[14px] leading-[17px] text-[#1c2a21]">{sentence}</p>
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
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>
          {result.checkedAt ? (
            <p className="m-0 flex items-start gap-[10px] px-[clamp(16px,2vw,28px)] pt-[16px] pb-[20px] text-[13px] leading-[16px] text-[#575755]">
              <CredentialsIconShield className="size-[16px] shrink-0 text-[#575755]" />
              <span>
                {result.checkedAt} This page shows only what the certificate carries, nothing else
                about the holder.
              </span>
            </p>
          ) : null}
        </section>
      ) : null}
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
