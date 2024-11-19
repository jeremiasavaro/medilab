import React, { useState, useEffect } from 'react';
import pic1 from "../assets/img/gallery/gallery-1.jpg";
import pic2 from "../assets/img/gallery/gallery-2.jpg";
import pic3 from "../assets/img/gallery/gallery-3.jpg";
import pic4 from "../assets/img/gallery/gallery-4.jpg";
import pic5 from "../assets/img/gallery/gallery-5.jpg";
import pic6 from "../assets/img/gallery/gallery-6.jpg";
import pic7 from "../assets/img/gallery/gallery-7.jpg";
import pic8 from "../assets/img/gallery/gallery-8.jpg";
import galleryData from '../assets/components-data/galleryData.json';

// Array of gallery images
const galleryImages = [
  { src: pic1 },
  { src: pic2 },
  { src: pic3 },
  { src: pic4 },
  { src: pic5 },
  { src: pic6 },
  { src: pic7 },
  { src: pic8 }
];

const Gallery = ({ language }) => {
  // State to hold the content based on the selected language
  const [content, setContent] = useState(galleryData[language]);

  // Update content when language changes
  useEffect(() => {
    setContent(galleryData[language]);
  }, [language]);

  return (
    <section id="gallery" className="gallery section">
      <div className="container section-title" data-aos="fade-up">
        {/* Section title and introduction */}
        <h2>{content.sectionTitle}</h2>
        <p>{content.sectionIntroduction}</p>
      </div>
      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-0">
          {/* Display gallery images */}
          {galleryImages.map((image, index) => (
            <div className="col-lg-3 col-md-4" key={index}>
              <div className="gallery-item">
                <a href={image.src} className="glightbox" data-gallery="images-gallery">
                  <img src={image.src} alt="" className="img-fluid" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;