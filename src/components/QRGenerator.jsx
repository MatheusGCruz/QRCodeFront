import React, { useState } from 'react';
import useShortLink from '../hooks/useShortLink';

const QRGenerator = () => {
  const [desiredUrl, setDesiredUrl] = useState('');
  const { originalLink, shortLink, qrImage, error, isGenerating, generateLink } = useShortLink();

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = desiredUrl.trim();
    if (url) {
      generateLink(url);
    }
  };

  return (
    <div className="App">
      <main className="App-main">
        <h1 className="App-title">Tanuki</h1>
        <h2 className="App-subtitle">Your QR code generator and link shortener</h2>

        <form className="App-form" onSubmit={handleSubmit}>
          <label className="App-form-label" htmlFor="desired-url">
            Enter the link you want to shorten
          </label>
          <input
            id="desired-url"
            className="App-text-area"
            name="desiredUrl"
            type="url"
            placeholder="https://example.com"
            value={desiredUrl}
            onChange={(event) => setDesiredUrl(event.target.value)}
          />
          <button
            className="App-button"
            type="submit"
            disabled={isGenerating || !desiredUrl.trim()}
          >
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>
        </form>

        {error && (
          <p className="App-error" role="alert">
            {error}
          </p>
        )}

        <a
          className="App-qr-download"
          href={qrImage}
          download="tanuki-qrcode.png"
          aria-label="Download QR code image"
        >
          <img src={qrImage} className="App-qr-code" alt={`QR code for ${originalLink}`} />
        </a>

        <div className="App-link-results">
          <p className="App-link-line">
            Original link: <span className="App-original-link">{originalLink}</span>
          </p>
          <p className="App-link-line">
            Shortened link: <span className="App-shorted-link">{shortLink}</span>
          </p>
        </div>

        <a
          className="App-link"
          href="https://antares.ninja"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project Tanuki - Antares Ninja
        </a>
      </main>
    </div>
  );
};

export default QRGenerator;
