import '../styles/error-page.css';

function Page404() {
  return (
    <div className="App">
      <main className="Page404-container">
        <h1 className="Page404-text">Tanuki</h1>
        <h2 className="Page404-text">Link not found</h2>
        <p className="Page404-text">Please check the link and try again.</p>
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
}

export default Page404;
