import sendVerificationEmail from "../Services/email.js";
import User from "../Models/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password_hash: password, // raw — the model's pre-save hook hashes it
      email_verified: false,
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    });

    sendVerificationEmail(user.email, user.name, verificationToken).catch(
      (err) => console.error("Verification email failed:", err),
    );

    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email to verify.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    const user = await User.findOne({ verification_token: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Expiry check — only relevant if not yet verified
    if (
      !user.email_verified &&
      user.verification_expires &&
      user.verification_expires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "This verification link has expired",
      });
    }

    // Flip the flag if not already flipped
    if (!user.email_verified) {
      user.email_verified = true;
      user.verification_expires = null;
      await user.save();
    }

    // Issue a JWT for both first-time and repeat verifications
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    return res.json({
      success: true,
      message: "Email verified",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password_hash");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      email_verified: user.email_verified,
      createdAt: req.user.createdAt,
    },
  });
}

export async function updateProfile(req, res) {
  try {
    const { name, email, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.name = name;

    if (email !== undefined && email !== user.email) {
      const exists = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "That email is already in use",
        });
      }
      user.email = email;
    }

    if (preferences) {
      if (preferences.accidental !== undefined) {
        user.preferences.accidental = preferences.accidental;
      }
      if (preferences.theme !== undefined) {
        user.preferences.theme = preferences.theme;
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
