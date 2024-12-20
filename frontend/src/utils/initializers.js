import AOS from 'aos';
import GLightbox from 'glightbox';
import PureCounter from '@srexi/purecounterjs';
import Swiper from 'swiper';

// Initialize AOS (Animate On Scroll) library
export const initializeAOS = () => {
  AOS.init({
    duration: 600, // Animation duration
    easing: 'ease-in-out', // Animation easing
    once: true, // Whether animation should happen only once
    mirror: false, // Whether elements should animate out while scrolling past them
  });
};

// Initialize GLightbox library for lightbox functionality
export const initializeGLightbox = () => {
  GLightbox({ selector: '.glightbox' });
};

// Initialize PureCounter library for animated counters
export const initializePureCounter = () => {
  new PureCounter();
};

// Initialize Swiper library for carousels/sliders
export const initializeSwiper = () => {
  document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
    const config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
    new Swiper(swiperElement, config);
  });
};

// Setup scroll-to-top button functionality
export const setupScrollToTop = () => {
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// Setup mobile navigation toggle functionality
export const setupMobileNavToggle = () => {
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    });
  }
};

// Setup scrollspy for navigation menu
export const setupNavMenuScrollspy = () => {
  const navmenulinks = document.querySelectorAll('.navmenu a');
  navmenulinks.forEach(navmenulink => {
    if (!navmenulink.hash) return;
    const section = document.querySelector(navmenulink.hash);
    if (!section) return;
    const position = window.scrollY + 200;
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
      navmenulink.classList.add('active');
    } else {
      navmenulink.classList.remove('active');
    }
  });
};