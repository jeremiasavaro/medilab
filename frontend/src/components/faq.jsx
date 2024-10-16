import React, { useState } from 'react';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is this service about?",
      answer: "This service allows you to upload a chest X-ray image and receive a diagnosis indicating whether you have a pulmonary disease, such as pneumonia, using artificial intelligence."
    },
    {
      question: "How do I upload an X-ray image?",
      answer: "You can upload an X-ray image by navigating to the X-Ray Service section of our website and selecting the image file from your device. Make sure the image is clear and in the correct format."
    },
    {
      question: "What formats are supported for the X-ray image?",
      answer: "We support common image formats such as JPEG and PNG. Ensure that the image is of high quality for accurate diagnosis."
    },
    {
      question: "How accurate is the AI diagnosis?",
      answer: "Our AI model is trained on a large dataset of chest X-ray images and has a high accuracy rate. However, it is important to consult with a medical professional for a definitive diagnosis."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. Your uploaded images and personal information are encrypted and stored securely."
    },
    {
      question: "How long does it take to get the diagnosis?",
      answer: "The AI analysis is quick, and you should receive your diagnosis within a few seconds after uploading the image."
    },
    {
      question: "Can I trust the AI diagnosis?",
      answer: "While our AI provides a reliable preliminary diagnosis, it is always recommended to follow up with a healthcare provider for a comprehensive evaluation."
    }
  ];

  return (
    <section id="faq" className="faq section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Frequently Asked Questions</h2>
        <p></p>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div className="faq-container">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? 'faq-active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <h3>{item.question}</h3>
                  {activeIndex === index && (
                    <div className="faq-content">
                      <p>{item.answer}</p>
                    </div>
                  )}
                  <i className="faq-toggle bi bi-chevron-right"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;