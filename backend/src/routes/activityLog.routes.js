const express    = require('express');
const router     = express.Router();
const { getLogs, clearLogs } = require('../controllers/activityLog.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/',    protect, getLogs);
router.delete('/', protect, clearLogs);

module.exports = router;