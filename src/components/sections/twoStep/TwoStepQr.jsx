import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('TwoStepQr');

/*
 * TwoStepQr — the authenticator app's QR code, drawn in the browser from the otpauth:// URI (the `qrcode` package, loaded only when
 * this shows). The URI holds the secret key, so it never leaves the page: no image service, no logging.
 * Props: uri, size (px, default 196).
 */

const TwoStepQr = ({ uri, size = 196 }) => {
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setSvg('');
    setFailed(false);
    import('qrcode')
      .then((mod) =>
        (mod.default || mod).toString(uri, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
      )
      .then((out) => alive && setSvg(out))
      .catch((err) => {
        log.error('qr not drawn:', err?.message);
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [uri]);

  if (failed) {
    return (
      <p className="m-0 max-w-[220px] text-center font-sans text-[13px] leading-[18px] text-[#595959]">
        The QR code didn’t load. Type the key below into your app instead.
      </p>
    );
  }
  return (
    <div
      role="img"
      aria-label="QR code to scan with your authenticator app"
      className="grid place-items-center rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[10px]"
      style={{ width: size + 20, height: size + 20 }}
    >
      {svg ? (
        // Generated locally by the qrcode package from the URI: plain SVG markup, no scripts.
        <div
          className="[&>svg]:block [&>svg]:size-full"
          style={{ width: size, height: size }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <span className="font-sans text-[12px] text-[#959592]">Loading…</span>
      )}
    </div>
  );
};

export default TwoStepQr;
