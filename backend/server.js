const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //This middleware is used to parse the incoming request body and make it available in the req.body object. The extended option allows for parsing of nested objects and arrays in the request body.

app.use('/api/auth', require('./Routes/authRoute')); //This middleware is used to handle the routes for authentication. It will handle the routes for registration and login.

app.get ('/', (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});