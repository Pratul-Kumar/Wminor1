const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// MongoDB connection
// mongoose.connect("mongodb://localhost:27017/yourdb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("MongoDB connected successfully");
// }).catch((error) => {
//   console.log("Error connecting to MongoDB", error);
// });

// User Schema
const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    profilePic: {
      type: String,
      //default: "0c7bba6cece54073fc486d84fe25297d.jpg",
    },
    about: { type: String, default: "Hey there, I am using WhatsApp" },
    socketId: { type: String, default: "" },
    jwttoken: { type: String },
  },
  { timestamps: true }
);

// Hashing password before saving the user
userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Comparing entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// User Model
const User = mongoose.model("User", userSchema);

// Function to create a user
async function createUser(userName, email, password) {
  
  try {
    console.log("Creating user...");
    const user = new User({
      userName,
      email,
      password,
    });

    // Save user to the database
    await user.save();
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

// Example usage of createUser function
// createUser("JohnDoe", "johndoe@example.com", "password123");
module.exports=User