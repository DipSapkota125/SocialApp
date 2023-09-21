import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "fullName must be required!"],
    },
    mobile_No: {
      type: Number,
      required: [true, "mobile_No is required!"],
    },
    email: {
      type: String,
      required: [true, "Please Enter a email"],
      unique: [true, "email already exists!"],
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    bio: {
      type: String,
    },
    avatar: {
      url: {
        type: String,
      },
    },
    password: {
      type: String,
      required: [true, "Please Enter a password"],
      minlength: [8, "password must be 8 characters long"],
      select: false,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
  },
  { timestamps: true }
);

//hashedPassword
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//generateToken
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

//comparePassword
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//resetPasswordToken
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//for otp date expire(mongodb bata afai 5 min ma otp afai gayab)
// userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

const User = new mongoose.model("User", userSchema);
export default User;
