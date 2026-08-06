import React, { useEffect, useState } from 'react';
import './App.css';
import QRGenerator from './components/QRGenerator';
import Page404 from './pages/404';
import Page500 from './pages/page500';
import axios from 'axios';
import { API_BASE_URL, BASE_URL } from './config';

/**
 * App shell: decides which view to render based on the current path.
 *
 * - "/"  -> QR generator (main view)
 * - other paths are treated as short links and looked up via the API.
 *   On success the user is redirected to the destination URL. On failure the
 *   404 page is shown. The redirect is intentionally kept client-side for now;
 *   move it to server/edge redirects (301/302) for SEO correctness.
 */
function App() {
  const [loading, setLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [show404, setShow404] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const isHome = path === '/' || path === '';

    if (isHome) {
      setShowMain(true);
    } else {
      const shortPath = path.replace(/^\/+/, '');
      axios
        .post(`${API_BASE_URL}getUrl`, `${BASE_URL}${shortPath}`, {
          headers: { 'Content-Type': 'text/plain' },
        })
        .then((response) => {
          if (response.data.desiredUrl) {
            window.location.replace(response.data.desiredUrl);
          } else {
            setShow404(true);
          }
        })
        .catch(() => setShow404(true));
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="App-loading">
        <h1 className="App-loading-text">Loading...</h1>
      </div>
    );
  }

  if (showMain) {
    return <QRGenerator />;
  }

  if (show404) {
    return (
      <div className="App">
        <Page404 />
      </div>
    );
  }

  return (
    <div className="App">
      <Page500 />
    </div>
  );
}

export default App;
