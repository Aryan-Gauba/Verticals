const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.post('/:id/log', habitController.logHabit);
router.delete('/:id', habitController.deleteHabit);

module.exports = router;