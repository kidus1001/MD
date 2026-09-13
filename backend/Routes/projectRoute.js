import { FetchProjects, CreateProject, fetchProject, UpdateProject, DeleteProject, } from '../Controllers/projectController.js';
import express from 'express';
import protect from "../Middleware/auth.js"; //protect is a middleware that protects routes from unauthorized access by verifying the JWT token.

const router = express.Router(); //Router is a middleware that allows us to create routes for our application.

router.get('/projects', protect, FetchProjects);
router.post ('/projects', protect, CreateProject);
router.get('/projects:id', protect, fetchProject);
router.put ('/projects:id', protect, UpdateProject);
router.delete ('projects:id', protect, DeleteProject);

export default router; //Export the router to be used in other files