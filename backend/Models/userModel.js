import mongoose from "mongoose"; //Mongoose is a library used to interact with MongoDB in a more structured way. It allows us to define schemas and models for our data.

import bcrypt from "bcryptjs"; //bcryptjs is a library used to hash passwords. It provides a way to securely store passwords in the database.

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true, //this is used to remove any whitespace from the beginning and end of the string
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true, //this is used to ensure that the email is unique in the database
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, //this is a regular expression used to validate the email format. So this is how deeply it works character by character. /^ - start of the string, \w+ - one or more word characters (letters, digits, or underscores), ([\.-]?\w+)* - zero or more occurrences of a dot or hyphen followed by one or more word characters, @ - the at symbol, \w+ - one or more word characters, ([\.-]?\w+)* - zero or more occurrences of a dot or hyphen followed by one or more word characters, (\.\w{2,3})+ - one or more occurrences of a dot followed by two or three word characters (for the domain extension), $/ - end of the string
      "Please add a valid email",
    ],
  },
  password_hash: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6, //this is used to ensure that the password is at least 6 characters long
    select: false, //this is used to ensure that the password is not returned when querying the database
  },
  createdAt: {
    type: Date,
    default: Date.now, //this is used to set the default value of the createdAt field to the current date and time
  },
  email_verified: { type: Boolean, default: false },
  verification_token: { type: String, default: null },
  verification_expires: { type: Date, default: null },
  preferences: {
    accidental: { type: String, enum: ["sharp", "flat"], default: "sharp" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
});

UserSchema.pre("save", async function (next) {
  //this is a pre-save hook that is called before saving a user to the database. It is used to hash the password before saving it to the database.
  if (!this.isModified("password_hash")) {
    //this is used to check if the password has been modified. If it has not been modified, we do not need to hash it again. So this is how it works: if the password has not been modified, we call the next() function to move on to the next middleware. If the password has been modified, we hash it using bcrypt and then call the next() function.
    return;
  }
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash); //Returns true if the entered password matches the hashed password stored in the database, otherwise returns false.
};

export default mongoose.model("User", UserSchema);
