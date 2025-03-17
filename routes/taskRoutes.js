const express = require('express');
const { createTask, getTasks, deleteTask } = require('../controllers/taskController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.delete('/:id', protect, deleteTask);
module.exports = router;