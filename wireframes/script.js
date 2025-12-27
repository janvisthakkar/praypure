// Initialize Hero Carousel
const heroSwiper = new Swiper('.heroSwiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    }
});

// Initialize Testimonials Carousel
const testimonialsSwiper = new Swiper('.testimonialsSwiper', {
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// Subscribe Form Handler
document.getElementById('subscribeForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('.email-input').value;
    // TODO: Send to backend API
    alert('Thank you for subscribing! We will keep you updated.');
    this.reset();
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle?.addEventListener('click', function() {
    navMenu?.classList.toggle('mobile-active');
    this.classList.toggle('active');
});