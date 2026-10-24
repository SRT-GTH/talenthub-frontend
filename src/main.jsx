import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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
