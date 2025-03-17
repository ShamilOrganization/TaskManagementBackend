const Task = require('../models/Task');

const createTask = async (req, res) => {
    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json(task);
};

const getTasks = async (req, res) => {
    const tasks = req.user.role === 'admin' ? await Task.find() : await Task.find({ user: req.user._id });
    res.json(tasks);
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    await task.remove();
    res.json({ message: 'Task deleted' });
};

module.exports = { createTask, getTasks, deleteTask };