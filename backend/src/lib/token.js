import jwt from "jsonwebtoken";
import RefreshToken from "../model/refreshToken.model.js";


export const createToken = async(res, userId) => {
  const accsessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });
  
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  
  await RefreshToken.findOneAndUpdate(
    { userId },
    { token: refreshToken , expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)},
    { upsert: true , new : true}
  )

  res.cookie("token", accsessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

};

