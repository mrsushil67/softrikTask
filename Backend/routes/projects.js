const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { createTask } = require('../controllers/taskController');



router.use(auth);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:projectId/tasks', createTask);


module.exports = router;
