import React, { useState, useEffect } from 'react';
import {
  initializeAOS,
  initializeGLightbox,
  initializePureCounter,
  initializeSwiper,
  setupScrollToTop,
  setupMobileNavToggle,
  setupNavMenuScrollspy
} from './utils/initializers';
import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import 'glightbox/dist/css/glightbox.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './assets/fontawesome-free/css/all.min.css';
import './assets/bootstrap-icons/bootstrap-icons.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from './components/Alert';
import Login from './components/Login';
import Register from './components/Register';
import Account from "./components/Account";
import HeroSection from './components/HeroSection';
import About from './components/About';
import Contact from './components/Contact';
import Doctors from './components/Doctors';
import Faq from './components/Faq';
import Gallery from './components/Gallery';
import ServicesSection from './components/ServicesSection';
import XrayService from './components/XrayService';

function App() {
  const [view, setView] = useState("home");
  const [language, setLanguage] = useState('en');
  const [isLogged, setIsLogged] = useState(false);

  const toggleLoginState = () => setIsLogged(!isLogged);
  const toggleForm = (formName) => setView(formName);

  useEffect(() => {
    initializeAOS();
    initializeGLightbox();
    initializePureCounter();
    initializeSwiper();
    setupScrollToTop();
    setupMobileNavToggle();
    setupNavMenuScrollspy();

    return () => {
      document.removeEventListener('scroll', setupNavMenuScrollspy);
    };
  }, []);

  const renderView = () => {
    switch (view) {
      case "login":
        return <Login setView={setView} setIsLogged={setIsLogged} language={language} />;
      case "register":
        return <Register setView={setView} language={language} />;
      case "xrayService":
        return isLogged ? <XrayService setView={setView} language={language}/> : <Alert setView={setView} language={language}/>;
      case "account":
        return <Account setView={setView} setIsLogged={setIsLogged} language={language}/>;
      case "Alert":
        return <Alert setView={setView} language={language} />;
      case "home":
      default:
        return (
          <div>
            <main className="main">
              <Header setView={setView} isLogged={isLogged} setIsLogged={setIsLogged} setLanguage={setLanguage} language={language} />
              <HeroSection setView={setView} language={language} />
              <About language={language}/>
              <ServicesSection language={language}/>
              <Doctors language={language}/>
              <Gallery language={language}/>
              <Faq language={language}/>
              <Contact isLogged={isLogged} setView={setView} language={language}/>
            </main>
            <Footer language={language}/>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;
