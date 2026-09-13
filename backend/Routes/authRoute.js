import { register, verifyEmail, login, getProfile } from '../Controllers/authController.js';
import express from 'express';
import protect from "../Middleware/auth.js"; //protect is a middleware that protects routes from unauthorized access by verifying the JWT token.

const router = express.Router(); //Router is a middleware that allows us to create routes for our application.

router.post('/register', register);
router.post ('/login', login);
router.get('/profile', protect, getProfile);
router.get ('/verify-email', verifyEmail)

export default router; //Export the router to be used in other files