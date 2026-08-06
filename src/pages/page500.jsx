import '../styles/error-page.css';

function Page500() {
  return (
    <div className="App">
      <main className="Page500-container">
        <h1 className="Page500-text">Tanuki</h1>
        <h2 className="Page500-text">Site under maintenance</h2>
        <p className="Page500-text">Please check again later.</p>
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

export default Page500;
