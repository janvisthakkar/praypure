import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Crucial for fade effect

import { AMAZON_SHOP } from '../data/shop';
import './HeroCarousel.css';

const FALLBACK_SLIDES = [
  {
    title: 'Authentic Cow Dung Incense',
    subtitle: 'Handcrafted using pure indigenous Cow Dung for spiritual purification',
    image: '/assets/images/hero_incense_burning_1764862235560.webp',
    amazonLink: AMAZON_SHOP,
  },
];

const resolveSlideImage = (src = '') => {
  if (src.startsWith('/assets/') && src.endsWith('.png')) {
    return src.replace(/\.png$/i, '.webp');
  }
  return src;
};

const HeroCarousel = () => {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/content/hero`);
        if (response.data.success && response.data.data?.length) {
          setSlides(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      }
    };
    fetchSlides();
  }, []);

  if (slides.length === 0) {
    return <div className="hero-skeleton skeleton" />;
  }

  return (
    <section className="hero-banner">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
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
              <img
                src={resolveSlideImage(slide.image)}
                alt={slide.title}
                className="slide-image"
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "low"}
                onError={(event) => {
                  if (slide.image && event.currentTarget.src !== slide.image) {
                    event.currentTarget.src = slide.image.replace(/\.webp$/i, '.png');
                  }
                }}
              />
            </div>

            <div className="banner-overlay" />

            <div className="container">
              <div className="banner-content">
                <h1 className="banner-title">{slide.title}</h1>
                <p className="banner-subtitle">{slide.subtitle}</p>

                <div className="banner-actions">
                  <Link to="/incense" className="btn btn-amazon">Explore the collection</Link>
                  {slide.amazonLink && (
                    <a href={slide.amazonLink} target="_blank" rel="noopener noreferrer" className="btn btn-flipkart">
                      Shop on Amazon
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
