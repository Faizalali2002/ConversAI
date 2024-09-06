import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password length should be at least 6 characters"],
    },
    customerId: {
      type: String,
      default: "",
    },
    subscription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Pre-save middleware for hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Instance method to generate JWT and set refresh token in cookies
userSchema.methods.getSignedToken = function (res) {
  const accessToken = jwt.sign(
    { id: this._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
  );

  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_EXPIREIN }
  );

  // Set refresh token as an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    maxAge: 86400 * 7000, // 7 days in milliseconds
    httpOnly: true,
  });

  return accessToken;
};

export default mongoose.model("User", userSchema);
