import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { isCopyPreview, loadCopyBundle } from './copy/copyBundle.js';
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
