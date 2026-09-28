import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Create JWT helper
function signToken(userId, email) {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
}

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const user = await User.create({
      name,
      email,
      password_hash: password,
      email_verified: true,
      verification_token: null,
      verification_expires: null,
    });

    const token = signToken(user._id, user.email);

    return res.status(201).json({
      success: true,
      message: "Account created",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        email_verified: true,
        preferences: user.preferences,
        createdAt: user.createdAt,
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

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // NOTE: email verification check REMOVED — everyone can log in

    const token = signToken(user._id, user.email);

    return res.status(200).json({
      success: true,
      message: "Logged in",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// GET /api/auth/profile
export async function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      email_verified: req.user.email_verified,
      preferences: req.user.preferences,
      createdAt: req.user.createdAt,
    },
  });
}

// PUT /api/auth/profile
export async function updateProfile(req, res) {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.name = name;

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
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Legacy verifyEmail — kept but no longer called from the register flow
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }

    const user = await User.findOne({ verification_token: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!user.email_verified) {
      user.email_verified = true;
      user.verification_expires = null;
      await user.save();
    }

    const authToken = signToken(user._id, user.email);

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
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}
