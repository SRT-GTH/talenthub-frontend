import { useState } from 'react';

/*
 * An <img> that shows `fallback` instead when there is no src or the file can't be loaded (deleted from storage,
 * offline, blocked). 2026-11-01: a missing portfolio cover or profile photo showed the browser's broken-image icon.
 */
const FallbackImage = ({ src, fallback = null, alt = '', ...rest }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) return fallback;
  return <img src={src} alt={alt} onError={() => setFailedSrc(src)} {...rest} />;
};

export default FallbackImage;
