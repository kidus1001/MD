const jwt = require ('jsonwebtoken'); //Used to verify the token

const User = require ('../Models/userModel'); //Used to find the user in the database

const auth = async (req, res, next) => { //Parameters used to get the token from the request header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { //Check if the token is present in the request header
        try {
            token = req.headers.authorization.split(' ')[1]; //Get the token from the request header coz token is in the format of "Bearer token"

            const decoded = jwt.verify (token, process.env.JWT_SECRET); //Verify the token using the secret key, Should I put anything in .env as JWT`_SECRET? Answer is yes, you should put a secret key in your .env file as JWT_SECRET. This key is used to sign and verify the JWT tokens. It should be a long, random string that is kept secret and not shared publicly. Hopw many characters? Itr s recommended to use at least 32 characters for the secret key, but the longer the better. You can use a combination of letters, numbers, and special characters to make it more secure. Can I generate it randomly? Yes, you can generate a random string using a password generator or a random string generator. Just make sure to keep it secret and not share it publicly. Why is it needed though? Because the secret key is used to sign and verify the JWT tokens, it ensures that the token has not been tampered with and is valid. If someone were to obtain the secret key, they could create their own valid tokens and gain unauthorized access to your application. Therefore, it is important to keep the secret key secure and not share it publicly.
            req.User = await User.fimdById(decoded.id).select('-password'); //Find the user in the database using the decoded id from the token and select all fields except the password
            if (!req.User) { //Check if the user is found in the database
                return res.status(401).json({message: "Not authorized, user not found"});
            }
            next(); //If the user is found, call the next middleware function
        } 
        
        catch (error) {
            console.error(error);
            return res.status(401).json({message: "Not authorized, token failed"});
        }
    }

    if (!token) { //Check if the token is not present in the request header
        return res.status(401).json({message: "Not authorized, no token"});
    }
};

module.exports = auth;