import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Brand fonts, self-hosted (npm @fontsource-variable): Bricolage Grotesque (wght + opsz), Instrument Sans, Raleway. SF Pro Rounded is bundled in styles/parent.css.
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource-variable/raleway/wght.css';
import './index.css';
import App from './App.jsx';
import { faroEnabled, initFaro } from './observability/faro.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Real-user monitoring (Grafana Faro): only when VITE_FARO_URL is set, loaded after first render.
if (faroEnabled()) initFaro();
