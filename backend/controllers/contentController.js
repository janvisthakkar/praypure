const HeroSlide = require('../models/HeroSlide');
const HomeSection = require('../models/HomeSection');
const Offer = require('../models/Offer');
const InstagramPost = require('../models/InstagramPost');

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

// Get Instagram Feed (Local Database)
exports.getInstagramFeed = async (req, res) => {
    try {
        const filter = req.query.includeInactive === 'true' ? {} : { isActive: { $ne: false } };
        const posts = await InstagramPost.find(filter).sort({ order: 1 }).populate('updatedBy', 'username');
        res.json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addInstagramPost = async (req, res) => {
    try {
        const postData = { ...req.body, updatedBy: req.admin.id };
        const post = await InstagramPost.create(postData);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateInstagramPost = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.admin.id };
        const post = await InstagramPost.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('updatedBy', 'username');
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteInstagramPost = async (req, res) => {
    try {
        await InstagramPost.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Instagram post deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
