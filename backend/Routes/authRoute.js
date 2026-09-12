import { register, verifyEmail, login, getProfile } from '../Controllers/authController.js';
import express from 'express';

const router = express.Router(); //Router is a middleware that allows us to create routes for our application.
// import jwt from "jsonwebtoken"; //jsonwebtoken is a library that allows us to create and verify JSON Web Tokens (JWTs) for authentication and authorization.
// import User from "../Models/userModel"; //User is a model that represents the user collection in the database.
import protect from "../Middleware/auth.js"; //protect is a middleware that protects routes from unauthorized access by verifying the JWT token.


router.post('/register', register);
router.get ('/verify-email', verifyEmail)
router.post ('/login', login);
router.get('profile', protect, getProfile);


export default router; //Export the router to be used in other files