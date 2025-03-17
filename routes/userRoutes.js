const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', protect, isAdmin, getAllUsers);
module.exports = router;