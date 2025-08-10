const Project = require('../models/Project');
const Task = require('../models/Task');

const createProject = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const project = new Project({
      owner: req.user._id,
      title,
      description,
      status: status || 'active'
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const tasks = await Task.find({
      project: req.params.id,
      deleted: false
    });

    res.json({
      project,
      tasks
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updateProject = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    let project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.status = status ?? project.status;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Task.deleteMany({ project: project._id });

    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
