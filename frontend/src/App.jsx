import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Account from "./components/account";
import AOS from 'aos';
import GLightbox from 'glightbox';
import PureCounter from '@srexi/purecounterjs';
import Swiper, { Navigation, Pagination } from 'swiper';
import About from './components/about';
import Contact from './components/contact';
import Doctors from './components/doctors';
import Faq from './components/faq';
import Footer from './components/footer';
import Gallery from './components/gallery';
import HeroSection from './components/heroSection';
import ServicesSection from './components/servicesSection';
import XrayService from './components/XrayService';
import Header from "./components/header";
import Alert from './components/Alert';
import './assets/css/styles.css';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'glightbox/dist/css/glightbox.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './assets/fontawesome-free/css/all.min.css';
import './assets/bootstrap-icons/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'aos/dist/aos';
import 'glightbox/dist/js/glightbox.min';
import '@srexi/purecounterjs/dist/purecounter_vanilla';

function App() {
  const [view, setView] = useState("home");
  const [language, setLanguage] = useState('en');

  const toggleForm = (formName) => {
    setView(formName);
  };

  const [isLoged, setIsLoged] = useState(false);

  const toggleLoginState = () => {
    setIsLoged(!isLoged);
  };

  useEffect(() => {
    window.onload = function() {
      const toggleScrolled = () => {
        const selectBody = document.querySelector('body');
        const selectHeader = document.querySelector('#header');

        // Verifica si selectHeader existe
        if (selectHeader && (selectHeader.classList.contains('scroll-up-sticky') || selectHeader.classList.contains('sticky-top') || selectHeader.classList.contains('fixed-top'))) {
          window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
        }
      };

      document.addEventListener('scroll', toggleScrolled);

      const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
      if (mobileNavToggleBtn) {
        const mobileNavToogle = () => {
          document.querySelector('body').classList.toggle('mobile-nav-active');
          mobileNavToggleBtn.classList.toggle('bi-list');
          mobileNavToggleBtn.classList.toggle('bi-x');
        };
        mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
      }

      const preloader = document.querySelector('#preloader');
      if (preloader) {
        preloader.remove();
      }

      const scrollTop = document.querySelector('.scroll-top');
      if (scrollTop) {
        scrollTop.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
      }

      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });

      GLightbox({
        selector: '.glightbox',
      });

      new PureCounter();

      const initSwiper = () => {
        document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
          let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());

          new Swiper(swiperElement, config);
        });
      };
      initSwiper();

      if (window.location.hash) {
        if (document.querySelector(window.location.hash)) {
          setTimeout(() => {
            let section = document.querySelector(window.location.hash);
            let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth',
            });
          }, 100);
        }
      }

      const navmenuScrollspy = () => {
        let navmenulinks = document.querySelectorAll('.navmenu a');

        navmenulinks.forEach(navmenulink => {
          if (!navmenulink.hash) return;
          let section = document.querySelector(navmenulink.hash);
          if (!section) return;
          let position = window.scrollY + 200;
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
            navmenulink.classList.add('active');
          } else {
            navmenulink.classList.remove('active');
          }
        });
      };
      navmenuScrollspy();

      document.addEventListener('scroll', navmenuScrollspy);
    };

    return () => {
      window.onload = null;
    };
  }, []);

  return (
    <div className="App">
        {(() => {
          if (view === "login") {
            return <Login setView={setView} setIsLoged={setIsLoged} language={language} />;
          } 
          if (view === "register") {
            return <Register setView={setView} language={language} />;
          } 
          if (view === "xrayService") {
            if (isLoged) {
              return <XrayService setView={setView} />;
            } else {
              return <Alert setView={setView} language={language}/>;

            }
          } 
          if (view === "account") {
            return <Account setView={setView} setIsLoged={setIsLoged} language={language}/>;
          } 
          if (view === "Alert") {
            return <Alert setView={setView} language={language} />;
          }
          if (view === "home") {
            return (
              <div>
                <main className="main">
                  <Header setView={setView} isLoged={isLoged} setIsLoged={setIsLoged} setLanguage={setLanguage} language={language} />  {/*Añadir el setLanguage, y añadir un boton que en onClick le cambia el valor*/}
                  <HeroSection setView={setView} language={language} />
                  <About language={language}/>  {/*Hacer esto para todos los componentes!!*/}
                  <ServicesSection language={language}/>
                  <Doctors />
                  <Gallery />
                  <Faq language={language}/>
                  <Contact isLoged={isLoged} setIsLoged={setIsLoged} setView={setView} language={language}/>
                </main>
                <Footer language={language}/>
    
                <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
                  <i className="bi bi-arrow-up-short"></i>
                </a>
              </div>
            );
          }
        })()}
      </div>
  );

}

export default App;
