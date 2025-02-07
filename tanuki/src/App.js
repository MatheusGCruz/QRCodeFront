import React, {useEffect, fetchData, useContext, useState} from 'react'
import './App.css';
import qrBase64 from './qr-code-base'
import Page404 from './pages/404.jsx'
import Page500 from './pages/page500.jsx'
import useConfigs from './functions/Config';
import axios from "axios";

function App() {

  const [originalLink, setOriginalLink] = useState("https://antares.ninja/");
  const [shortedLink, setShortedLink] = useState("https://tanuki.click/z8HSYsk");
  const [loading, setLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [show404, setShow404] = useState(false);
  const configs = useConfigs();
  const [base64Image, setBase64Image] = useState(qrBase64);
  const [setDesiredUrl, setsetDesiredUrl] = useState('');


  const generateLink = async () => {
    try {
      const response = await axios.post(configs.tanukiApi+"generateQrCode", setDesiredUrl, {
        headers: {'Content-Type': 'text/plain'}
      })
      console.log('Response:', response.data);
      
      if (response.status === 200) {
        if(response.data.desiredUrl){            
          setOriginalLink(response.data.desiredUrl);
          setShortedLink(response.data.pinCode);
          setBase64Image("data:image/png;base64, "+response.data.base64);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Great Shot!");
          setOriginalLink("Error when generating link");
          setShortedLink("Error when generating link");
    }
  };

  const downloadBase64Image = () => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = 'tanuki-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  useEffect(() => {

      if (window.location.pathname.substring(0)){
        let subdir = window.location.pathname.substring(0);
        if (!subdir || subdir == "/") {
          setShowMain(true);
        }
        else{
          axios.post(configs.tanukiApi+"getUrl", configs.tanukiBaseUrl+window.location.pathname.substring(1), {
            headers: {
              'Content-Type': 'text/plain'
            }
          })
              .then(response => {
                if(response.data.desiredUrl){
                  setOriginalLink(response.data.desiredUrl);
                  setShortedLink(configs.tanukiBaseUrl+window.location.pathname.substring(1));
                  setShowMain(true);
                  window.location.href = response.data.desiredUrl;
                }
                setShow404(true);
          })
              .catch(error => {
              console.error("Error fetching data:", error);
              setShow404(true);
          });

        }
      }
      else{
        setShowMain(true);
      }
      setLoading(false);
  }, []);
  
  


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><h1 className="text-3xl font-bold text-gray-600">Loading...</h1></div>;
  }

  else if (showMain) {
    return     <div className="App">
    <header className="App-header">

      <h2>Tanuki </h2>
      <h3> Your Qrcode generator and link shortner</h3>       
      <form action={generateLink}>
            <input className="App-text-area" name="query" onChange={(e) => setsetDesiredUrl(e.target.value)}/>              
      </form>      
      <a href={base64Image} download="tanuki-qrcode.png">
     <img  src={base64Image} className="App-qr-code" alt="logo" onClick={downloadBase64Image}/></a>  

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
  }
  else if(show404){
    return (
      <div className="App">
        <Page404/>
      </div>
      );
  }

  else{
    return (
      <div className="App">
        <Page500/>
      </div>
      );
  }

}

export default App;
