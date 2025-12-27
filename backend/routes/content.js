const express = require('express');
const router = express.Router();
const {
    getHeroSlides,
    getHomeSections,
    getOffers,
    getInstagramFeed,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    addHomeSection,
    updateHomeSection,
    deleteHomeSection
} = require('../controllers/contentController');
const { verifyToken } = require('../controllers/authController');

router.get('/hero', getHeroSlides);
router.post('/hero', verifyToken, addHeroSlide);
router.put('/hero/:id', verifyToken, updateHeroSlide);
router.delete('/hero/:id', verifyToken, deleteHeroSlide);

router.get('/sections', getHomeSections);
router.post('/sections', verifyToken, addHomeSection);
router.put('/sections/:id', verifyToken, updateHomeSection);
router.delete('/sections/:id', verifyToken, deleteHomeSection);



router.get('/offers', getOffers);
router.get('/instagram', getInstagramFeed);

module.exports = router;
