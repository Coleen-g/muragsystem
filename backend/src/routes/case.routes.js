const express    = require('express');
const router     = express.Router();
const caseController = require('../controllers/case.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { uploadCase } = require('../config/cloudinary');

// ── Staff/Admin routes
router.get('/',           protect, caseController.getAllCases);
router.get('/stats',      protect, caseController.getCaseStats);
router.get('/trend',      protect, caseController.getCaseTrend);

// ── Mobile route — must come BEFORE /:id
router.get('/my',         protect, caseController.getMyCases);

// ── CRUD with optional file upload
router.post('/',          protect, uploadCase.single('document'), caseController.createCase);
router.get('/:id',        protect, caseController.getCaseById);
router.put('/:id',        protect, uploadCase.single('document'), caseController.updateCase);
router.delete('/:id',     protect, caseController.deleteCase);

module.exports = router;