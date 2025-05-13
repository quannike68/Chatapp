import asyncHandler from "express-async-handler";
import User from "../model/user.model.js";
import { createToken } from "../lib/token.js";
import cloudinary from "../lib/cloudinary.js";
import RefreshToken from "../model/refreshToken.model.js";
import jwt from "jsonwebtoken";

const signup = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const refreshTokens = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401);
    throw new Error("Access denied, token missing");
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(
      storedToken.token,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      token: newAccessToken,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    res.status(401);
    throw new Error("Access denied, token missing");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    await createToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      message: "Login Successful",
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0),
    });
    res
      .status(200)
      .json({ message: "Logged out successfully", status: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "error" });
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      res.status(400);
      throw new Error("Profile picture is required");
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    throw new Error(error.message);
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500);
    throw new Error("Server Error (checkAuth)");
  }
});

export { signup, login, logout, updateProfile, checkAuth, refreshTokens };
