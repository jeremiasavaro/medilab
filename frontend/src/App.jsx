import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/about';
import Appointment from './components/appointment';
import Contact from './components/contact';
import Doctors from './components/doctors';
import Faq from './components/faq';
import Footer from './components/footer';
import Gallery from './components/gallery';
import HeroSection from './components/heroSection';
import ServicesSection from './components/servicesSection';
import AOS from 'aos';
import GLightbox from 'glightbox';
import PureCounter from '@srexi/purecounterjs';
import Swiper from 'swiper';
import './assets/styles.css';
import 'aos/dist/aos.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'glightbox/dist/css/glightbox.min.css'
import 'swiper/swiper-bundle.min.css'
import './assets/fontawesome-free/css/all.min.css'
import './assets/bootstrap-icons/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'aos/dist/aos'
import 'glightbox/dist/js/glightbox.min'
import '@srexi/purecounterjs/dist/purecounter_vanilla'
import 'swiper/swiper-bundle.min'

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin); // Alterna entre mostrar Login y Register
  };

  //Efectos para la página principal
  useEffect(() => {

    const toggleScrolled = () => {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    };

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const mobileNavToogle = () => {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    };
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }

    const scrollTop = document.querySelector('.scroll-top');
    const toggleScrollTop = () => {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    };
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    GLightbox({
      selector: '.glightbox'
    });

    new PureCounter();

    const initSwiper = () => {
      document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
        let config = JSON.parse(
          swiperElement.querySelector(".swiper-config").innerHTML.trim()
        );

        new Swiper(swiperElement, config);
      });
    };
    window.addEventListener("load", initSwiper);

    window.addEventListener('load', function (e) {
      if (window.location.hash) {
        if (document.querySelector(window.location.hash)) {
          setTimeout(() => {
            let section = document.querySelector(window.location.hash);
            let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    });

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
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);

    //Limpiamos acá para evitar fuga d ememoria
    return () => {
      document.removeEventListener('scroll', toggleScrolled);
      mobileNavToggleBtn.removeEventListener('click', mobileNavToogle);
      document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.removeEventListener('click', function (e) { });
      });
      window.removeEventListener('load', toggleScrollTop);
      window.removeEventListener('scroll', toggleScrollTop);
      window.removeEventListener('load', initSwiper);
      window.removeEventListener('load', navmenuScrollspy);
      document.removeEventListener('scroll', navmenuScrollspy);
    };
  }, []);

  return (
    <div className="App">
      {showLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Register toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default App;
