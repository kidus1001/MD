import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './Config/db.js';
import authRoute from './Routes/authRoute.js';
// import authRoute from './Routes/authRoute.js';

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./Config/db");


// dotenv.config(); //This middleware is used to load environment variables from a .env file into process.env. It allows you to keep sensitive information, such as database credentials and API keys, separate from your codebase and easily configurable for different environments (e.g., development, testing, production).

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //This middleware is used to parse the incoming request body and make it available in the req.body object. The extended option allows for parsing of nested objects and arrays in the request body.


app.use('/api/auth', authRoute);

app.get ('/', (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});