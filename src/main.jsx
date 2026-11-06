import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Brand fonts, self-hosted (npm @fontsource-variable): Bricolage Grotesque (wght + opsz), Instrument Sans, Raleway. SF Pro Rounded is bundled in styles/parent.css.
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource-variable/raleway/wght.css';
import './index.css';
import App from './App.jsx';
import { isCopyPreview, loadCopyBundle } from './copy/copyBundle.js';
import { startAutoCopy } from './copy/portals/autoPortalsRuntime.js';
import { faroEnabled, initFaro } from './observability/faro.js';

const render = () =>
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

// Site copy → Preview (`?copyPreview=`): the page renders once the draft copy is in, so it never shows the published text first.
if (isCopyPreview()) loadCopyBundle().finally(render);
else {
  render();
  loadCopyBundle();
}

// Real-user monitoring (Grafana Faro): only when VITE_FARO_URL is set, loaded after first render.
if (faroEnabled()) initFaro();

// Site copy: portal data files with published text are loaded and bound (copy/portals/autoPortalsRuntime.js).
startAutoCopy();
