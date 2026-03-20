import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import './TestimonialCarousel.css';

const TestimonialCarousel = () => {
    const [testimonials, setTestimonials] = useState([]);

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/testimonials`);
                setTestimonials(response.data.data || []);
            } catch (error) {
                // Fallback to default testimonials
                setTestimonials([
                    {
                        name: "Priya Sharma",
                        location: "Mumbai, Maharashtra",
                        text: "The fragrance is absolutely divine! Best incense sticks I've ever used. The quality is exceptional and the aroma lasts for hours.",
                        rating: 5
                    },
                    {
                        name: "Rajesh Kumar",
                        location: "Delhi, NCR",
                        text: "Authentic quality and fast delivery. Highly recommended! Praypure has become my go-to brand for all spiritual needs.",
                        rating: 4.5
                    },
                    {
                        name: "Anjali Patel",
                        location: "Ahmedabad, Gujarat",
                        text: "The dhoop cones are perfect for my daily prayers. The fragrance is pure and the packaging is beautiful. Love it!",
                        rating: 5
                    },
                    {
                        name: "Vikram Singh",
                        location: "Jaipur, Rajasthan",
                        text: "I love the Havan cups. They are so easy to use and smell exactly like a traditional havan. Very spiritual experience.",
                        rating: 5
                    },
                    {
                        name: "Meera Reddy",
                        location: "Hyderabad, Telangana",
                        text: "The packaging is premium and the products are natural. I can feel the difference from other brands. Will buy again.",
                        rating: 4
                    },
                    {
                        name: "Suresh Menon",
                        location: "Kochi, Kerala",
                        text: "Excellent service and genuine products. The sandalwood incense is my favorite. It brings peace to my home.",
                        rating: 5
                    }
                ]);
            }
        };
        fetchTestimonials();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} />);
        }

        return stars;
    };

    return (
        <section className="section testimonials">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">What Our Customers Say</h2>
                    <p className="section-subtitle">Trusted by thousands of satisfied customers</p>
                </div>
            </div>

            <div className="testimonial-wrapper">
                <div className="swiper-button-prev custom-prev"></div>
                <div className="swiper-button-next custom-next"></div>

                <div className="container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            prevEl: '.custom-prev',
                            nextEl: '.custom-next',
                        }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            }
                        }}
                        className="testimonialsSwiper"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="testimonial-card">
                                    <div className="stars">{renderStars(testimonial.rating || 5)}</div>
                                    <p className="testimonial-text">"{testimonial.text}"</p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">
                                            <span>{testimonial.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="author-name">{testimonial.name}</p>
                                            <p className="author-location">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TestimonialCarousel;