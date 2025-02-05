import React, {useEffect, fetchData, useContext, useState} from 'react'
import logo from './logo.svg';
import './App.css';
import qrBase64 from './qr-code-base'

function App() {

  const [originalLink, setOriginalLink] = useState("https://antares.ninja/");
  const [shortedLink, setShortedLink] = useState("https://tanuki.click/z8HSYsk");
  const [loading, setLoading] = useState(true);

  const generateLink = () => {
    alert("Great Shot!");
    setOriginalLink("textArea");
    setShortedLink("Modified!");
    //window.location.reload(false);
  }
  //<button className="App-button" onClick={generateLink}>Generate</button>        
  //<textarea className="App-text-area" placeholder="Add a new link here" id="textArea"/>
  //<button className="App-button" type="submit">Generate</button>

  useEffect(() => {
    /*axios.get(configs.book+window.location.pathname.substring(6))
      .then(response => {
        setBook(response.data); 
        setLoadingBook(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoadingBook(false);
      });

    axios.get(configs.cover+window.location.pathname.substring(6))
      .then(response => {
        setBgImage(response.data);        
        console.log(bgImage.toString);
        setLoadingCover(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoadingCover(false);
      });*/
      if (window.location.pathname.substring(1)){
        setOriginalLink(window.location.pathname.substring(1));
      }
      setLoading(false);
  }, []);
  
  


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><h1 className="text-3xl font-bold text-gray-600">Loading...</h1></div>;
  }

  return (
    <div className="App">
      <header className="App-header">

        <h2>Tanuki </h2>
        <h3> Your Qrcode generator and link shortner</h3>
        

        <form action={generateLink}>
              <input className="App-text-area" name="query" />
              
        </form>


        
       <img src={qrBase64} className="App-qr-code" alt="logo" />

        <br/>

        <div class="App-original-link">Original link: {originalLink}</div>
        <div class="App-shorted-link">Shortened link: {shortedLink}</div>
        <br/>

      
      
      <br/> 
        <a
          className="App-link"
          href="https://antares.ninja"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project Tanuki - Antares Ninja
        </a>
      </header>
    </div>
  );
}

export default App;
