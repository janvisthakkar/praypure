const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Load env from backend root

const HeroSlide = require('../models/HeroSlide');
const HomeSection = require('../models/HomeSection');
const Offer = require('../models/Offer');
const Testimonial = require('../models/Testimonial');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const seedContent = async () => {
    try {
        await connectDB();
        console.log('Database Connected');

        // 1. Clear existing data
        await HeroSlide.deleteMany({});
        await HomeSection.deleteMany({});
        await Offer.deleteMany({});
        await Testimonial.deleteMany({});
        await Admin.deleteMany({});
        console.log('Cleared existing content');

        // 2. Seed Hero Slides
        const heroSlides = [
            {
                title: "Pure Essence, Divine Fragrance",
                subtitle: "Experience the authentic aroma of traditional Indian incense",
                image: "/assets/images/hero_incense_burning_1764862235560.png",
                amazonLink: "https://www.amazon.in/s?k=praypure",
                flipkartLink: "https://www.flipkart.com/search?q=praypure",
                order: 1
            },
            {
                title: "Traditional Craftsmanship",
                subtitle: "Handcrafted with love and traditional methods",
                image: "/assets/images/hero_traditional_making_1764862269417.png",
                amazonLink: "https://www.amazon.in/s?k=praypure",
                flipkartLink: "https://www.flipkart.com/search?q=praypure",
                order: 2
            },
            {
                title: "100% Natural Ingredients",
                subtitle: "Pure, organic fragrances for your spiritual journey",
                image: "/assets/images/hero_natural_ingredients_1764862303355.png",
                amazonLink: "https://www.amazon.in/s?k=praypure",
                flipkartLink: "https://www.flipkart.com/search?q=praypure",
                order: 3
            }
        ];
        await HeroSlide.insertMany(heroSlides);
        console.log('Seeded Hero Slides');

        // 3. Seed Home Sections (Collection)
        const collectionSections = [
            {
                sectionType: 'collection',
                title: "Incense Sticks",
                description: "Traditional hand-rolled incense sticks with authentic fragrances",
                image: "/assets/images/collection_incense_sticks_1764862333586.png",
                link: "/incense-sticks",
                order: 1
            },
            {
                sectionType: 'collection',
                title: "Dhoop Sticks",
                description: "Premium dhoop for creating a spiritual ambiance",
                image: "/assets/images/collection_dhoop_sticks_1764862353813.png",
                link: "/dhoop-sticks",
                order: 2
            },
            {
                sectionType: 'collection',
                title: "Dhoop Cones",
                description: "Convenient cone-shaped dhoop for easy use",
                image: "/assets/images/collection_dhoop_cones_1764862379070.png",
                link: "/dhoop-cones",
                order: 3
            },
            {
                sectionType: 'collection',
                title: "Havan Cups",
                description: "Sacred havan essentials for rituals",
                image: "/assets/images/collection_havan_cups_1764862408665.png",
                link: "/havan-cups",
                order: 4
            }
        ];
        await HomeSection.insertMany(collectionSections);
        console.log('Seeded Collection Sections');

        // 4. Seed Home Sections (Why Us Features)
        const featureSections = [
            {
                sectionType: 'feature',
                title: "100% Natural",
                description: "Pure, organic ingredients sourced from trusted suppliers across India",
                icon: "🌿",
                order: 1
            },
            {
                sectionType: 'feature',
                title: "Premium Quality",
                description: "Handcrafted with traditional methods and meticulous care",
                icon: "✨",
                order: 2
            },
            {
                sectionType: 'feature',
                title: "Fast Delivery",
                description: "Quick and secure shipping across India with care",
                icon: "🚚",
                order: 3
            },
            {
                sectionType: 'feature',
                title: "Authentic Fragrance",
                description: "Time-tested recipes passed down through generations",
                icon: "💎",
                order: 4
            }
        ];
        await HomeSection.insertMany(featureSections);
        console.log('Seeded Feature Sections');

        // 5. Seed Offers
        const offers = [
            { label: "10% OFF", couponCode: "WELCOME10", value: 10, probability: 20 },
            { label: "Free Shipping", couponCode: "FREESHIP", value: 0, probability: 20 },
            { label: "Buy 1 Get 1", couponCode: "BOGO", value: 50, probability: 5 },
            { label: "5% OFF", couponCode: "SAVE5", value: 5, probability: 30 },
            { label: "Mystery Gift", couponCode: "MYSTERY", value: 0, probability: 5 },
            { label: "Try Again", couponCode: null, value: 0, probability: 20 }
        ];
        await Offer.insertMany(offers);
        console.log('Seeded Offers');

        // 6. Seed Testimonials
        const testimonials = [
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
                rating: 5
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
        ];
        // 7. Seed Products
        const Product = require('../models/Product');
        await Product.deleteMany({});

        const products = [
            // Incense Sticks
            {
                name: 'Sandalwood Incense Sticks',
                description: 'Premium sandalwood fragrance for peace and meditation.',
                price: 150,
                mrp: 199,
                category: 'Incense Sticks',
                image: '/assets/images/collection_incense_sticks_1764862333586.png',
                fragrance: 'Sandalwood',
                isNew: true,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            {
                name: 'Rose Incense Sticks',
                description: 'Sweet and floral rose scent for a romantic ambiance.',
                price: 120,
                mrp: 180,
                category: 'Incense Sticks',
                image: '/assets/images/collection_incense_sticks_1764862333586.png',
                fragrance: 'Rose',
                isNew: false,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            {
                name: 'Jasmine Incense Sticks',
                description: 'Calming jasmine aroma for stress relief.',
                price: 130,
                mrp: 175,
                category: 'Incense Sticks',
                image: '/assets/images/collection_incense_sticks_1764862333586.png',
                fragrance: 'Jasmine',
                isNew: false,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            // Dhoop Sticks
            {
                name: 'Sandalwood Dhoop Sticks',
                description: 'Pure sandalwood dhoop for daily puja.',
                price: 180,
                mrp: 250,
                category: 'Dhoop Sticks',
                image: '/assets/images/collection_dhoop_sticks_1764862353813.png',
                fragrance: 'Sandalwood',
                isNew: true,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            {
                name: 'Rose Dhoop Sticks',
                description: 'Aromatic rose dhoop sticks.',
                price: 160,
                mrp: 220,
                category: 'Dhoop Sticks',
                image: '/assets/images/collection_dhoop_sticks_1764862353813.png',
                fragrance: 'Rose',
                isNew: false,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            // Dhoop Cones
            {
                name: 'Sandalwood Dhoop Cones',
                description: 'Long lasting sandalwood cones.',
                price: 200,
                mrp: 280,
                category: 'Dhoop Cones',
                image: '/assets/images/collection_dhoop_cones_1764862379070.png',
                fragrance: 'Sandalwood',
                isNew: true,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            {
                name: 'Jasmine Dhoop Cones',
                description: 'Refreshing jasmine cones.',
                price: 190,
                mrp: 260,
                category: 'Dhoop Cones',
                image: '/assets/images/collection_dhoop_cones_1764862379070.png',
                fragrance: 'Jasmine',
                isNew: false,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            // Havan Cups
            {
                name: 'Traditional Havan Cups',
                description: 'Cow dung havan cups with samagri.',
                price: 250,
                mrp: 350,
                category: 'Havan Cups',
                image: '/assets/images/collection_havan_cups_1764862408665.png',
                fragrance: 'Traditional',
                isNew: true,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            },
            {
                name: 'Premium Havan Cups',
                description: 'Large size premium havan cups.',
                price: 350,
                mrp: 499,
                category: 'Havan Cups',
                image: '/assets/images/collection_havan_cups_1764862408665.png',
                fragrance: 'Premium',
                isNew: false,
                amazonLink: 'https://amazon.in',
                flipkartLink: 'https://flipkart.com',
                stock: 100
            }
        ];
        await Product.insertMany(products);
        console.log('Seeded Products');

        // 8. Seed Testimonials (Adding back after accidental deletion)
        await Testimonial.insertMany(testimonials);
        console.log('Seeded Testimonials');

        // 9. Seed Admin
        const adminData = {
            username: 'admin',
            email: 'admin@praypure.com',
            password: 'adminpassword123',
            role: 'superadmin'
        };
        await Admin.create(adminData);
        console.log('Seeded Admin User: admin@praypure.com / adminpassword123');

        console.log('Database Seeding Completed Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedContent();
