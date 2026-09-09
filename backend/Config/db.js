const mongoose = require ('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MongoDB_URI, {
            useNewUrlParser: true, //To prevent deprecattion warnings,
            useUnifiedTopology: true, //To prevent deprecation warnings.
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); //1 -> App closed due to uncaught error
                         //0 -> App closed successfully on purpose
    }
};

module.exports = connectDB; //To expose the function to the rest of the project. So that it can be used in other files.