import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Crucial for fade effect

import './HeroCarousel.css';

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/content/hero`);
        if (response.data.success) {
          setSlides(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      }
    };
    fetchSlides();
  }, []);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="hero-banner">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        speed={1500} // Slower speed to make fade more noticeable
        allowTouchMove={false} // Disable touch dragging to enforce fade transition feel
        className="heroSwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="banner-image">
              {/* Use standard img tag, managed by CSS for object-fit */}
              <img src={slide.image} alt={slide.title} className="slide-image" />
            </div>

            <div className="banner-overlay" />

            <div className="container">
              <div className="banner-content">
                <h1 className="banner-title">{slide.title}</h1>
                <p className="banner-subtitle">{slide.subtitle}</p>

                <div className="banner-actions">
                  {slide.amazonLink && (
                    <a href={slide.amazonLink} target="_blank" rel="noopener noreferrer" className="btn btn-amazon">
                      Shop on Amazon
                    </a>
                  )}
                  {slide.flipkartLink && (
                    <a href={slide.flipkartLink} target="_blank" rel="noopener noreferrer" className="btn btn-flipkart">
                      Shop on Flipkart
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroCarousel;
