const HeroSlide = require('../models/HeroSlide');
const HomeSection = require('../models/HomeSection');
const Offer = require('../models/Offer');

// Get Active Hero Slides
exports.getHeroSlides = async (req, res) => {
    try {
        const filter = req.query.includeInactive === 'true' ? {} : { isActive: { $ne: false } };
        const slides = await HeroSlide.find(filter).sort({ order: 1 }).populate('updatedBy', 'username');
        res.json({ success: true, count: slides.length, data: slides });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addHeroSlide = async (req, res) => {
    try {
        const slideData = { ...req.body, updatedBy: req.admin.id };
        const slide = await HeroSlide.create(slideData);
        res.status(201).json({ success: true, data: slide });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateHeroSlide = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.admin.id };
        const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('updatedBy', 'username');
        res.json({ success: true, data: slide });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteHeroSlide = async (req, res) => {
    try {
        await HeroSlide.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Slide deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get Active Home Sections (Collection, Features, etc.)
exports.getHomeSections = async (req, res) => {
    try {
        const filter = req.query.includeInactive === 'true' ? {} : { isActive: { $ne: false } };
        const sections = await HomeSection.find(filter).sort({ order: 1 }).populate('updatedBy', 'username');
        res.json({ success: true, count: sections.length, data: sections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addHomeSection = async (req, res) => {
    try {
        const sectionData = { ...req.body, updatedBy: req.admin.id };
        const section = await HomeSection.create(sectionData);
        res.status(201).json({ success: true, data: section });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateHomeSection = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.admin.id };
        const section = await HomeSection.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('updatedBy', 'username');
        res.json({ success: true, data: section });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteHomeSection = async (req, res) => {
    try {
        await HomeSection.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Section deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get Active Offers (Wheel)
exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true });
        // Optional: We might want to shuffle or handle probability on backend, 
        // but for now sending all active offers is fine.
        res.json({ success: true, count: offers.length, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Instagram Feed
exports.getInstagramFeed = async (req, res) => {
    try {
        const token = process.env.INSTAGRAM_ACCESS_TOKEN;
        if (!token) {
            // Return mock data if no token is configured (fail gracefully)
            return res.json({ success: false, message: 'No Instagram token configured', data: [] });
        }

        const axios = require('axios');
        const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${token}&limit=6`);

        res.json({ success: true, count: response.data.data.length, data: response.data.data });
    } catch (error) {
        console.error('Instagram API Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch Instagram feed' });
    }
};
