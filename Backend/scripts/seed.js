require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pm_db';

(async () => {
  try {
    await connectDB(MONGO_URI);

    // Clean DB collections (use cautiously)
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    const email = 'test@example.com';
    const plainPassword = 'Test@123';

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);

    const user = new User({ email, password: hashed, name: 'Test User' });
    await user.save();
    console.log('User created:', user.email, 'pwd:', plainPassword);

    const projectsData = [
      { title: 'Website Revamp', description: 'Redesign and update website UI', status: 'active' },
      { title: 'Mobile App MVP', description: 'Build MVP for mobile app', status: 'active' }
    ];

    for (const p of projectsData) {
      const project = new Project({ ...p, owner: user._id });
      await project.save();
      console.log('Project created:', project.title);

      const tasks = [
        { title: `${project.title} - Setup`, description: 'Initial setup', status: 'todo', dueDate: new Date(Date.now() + 7*24*60*60*1000) },
        { title: `${project.title} - Development`, description: 'Main work', status: 'in-progress', dueDate: new Date(Date.now() + 14*24*60*60*1000) },
        { title: `${project.title} - QA`, description: 'Testing and fix', status: 'todo', dueDate: new Date(Date.now() + 21*24*60*60*1000) }
      ];

      for (const t of tasks) {
        const task = new Task({ ...t, project: project._id });
        await task.save();
        console.log('  Task created:', task.title);
      }
    }

    console.log('Seeding finished. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
