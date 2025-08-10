const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createTask, getTasksForProject, updateTask, deleteTask } = require('../controllers/taskController');

router.use(auth);

// create task for project
router.post('/project/:projectId', createTask);

// get tasks for a project (optional ?status=todo)
router.get('/project/:projectId', getTasksForProject);

// update/delete task by task id
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
