const express = require("express"); //express is a web framework for Node.js that allows us to create web applications and APIs easily.
const router = express.Router(); //Router is a middleware that allows us to create routes for our application.
const jwt = require("jsonwebtoken"); //jsonwebtoken is a library that allows us to create and verify JSON Web Tokens (JWTs) for authentication and authorization.
const User = require("../Models/userModel"); //User is a model that represents the user collection in the database.


router.post ('/register', async (requestAnimationFrame, res) => {
    try {
        const {name,email,password} = req.body; //Get the name, email and password from the request body

        if (!name || !email || !password) { //Check if the name, email and password are present in the request body
            return res.status(400).json ({
                success: false,
                message: "Please provide name, email and password"
            })
        }

        const userExists = await User.findOne({email}); //Check if the user already exists in the database

        if (userExists) { //If the user already exists, return an error message
            return res.status(400).json ({
                success: false,
                message: "User already exists with this email",
            })
        }
        const user = await User.create ({
            name, email, password
        });

        const token = jwt.sign ( //Used to create a new token
            {id: user._id, email: user.email}, //Payload of the token, which contains the user id
            process.env.JWT_SECRET, //Secret key used to sign the token
            {expiresIn: "3d"} //Expiration time of the token
        )
        res.status(201).json ({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json ({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});



router.post ('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status (400).json ({
                success: false,
                message: "Please provide email and password"
            })
        }

        const user = await User.findOne({email}); //Check if the user exists in the database

        if (!user) {
            return res.status(400).json ({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign (
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        )
        res.status(200).json ({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json ({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
})



router.get ('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.User._id).select('-password'); //Find the user in the database using the id from the token and select all fields except the password
        res.json ({
            success: true,
            user,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json ({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router; //Export the router to be used in other files