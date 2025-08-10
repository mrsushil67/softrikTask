const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const projectId = req.params.projectId;
  try {
    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = new Task({
      project: projectId,
      title,
      description,
      status: status || 'todo',
      dueDate: dueDate || null
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getTasksForProject = async (req, res) => {
  const projectId = req.params.projectId;
  const { status } = req.query; // optional filter
  try {
    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const filter = { project: projectId };
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, dueDate } = req.body;
  try {
    let task = await Task.findById(taskId).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (String(task.project.owner) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (String(task.project.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark as deleted instead of removing from DB
    task.deleted = true;
    await task.save();

    res.json({ message: 'Task soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


module.exports = { createTask, getTasksForProject, updateTask, deleteTask };
