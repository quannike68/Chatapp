import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import asyncHandler from "express-async-handler";

export const protectRoute = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Not authorized, please log in" });
    }

    const response = await fetch("http://localhost:5001/api/auth/refresh", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${req.cookies?.refreshToken}`,
      },
    });

    const data = await response.json();
    console.log("data", data);

    if (!response.ok) {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }

    token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Failed to refresh token" });
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token. Try logging in again" });
  }
});
