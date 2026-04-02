import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "fs_session";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const COOKIE_MAX_AGE = Number(process.env.JWT_COOKIE_MAX_AGE_MS) || 3_600_000;
const COOKIE_SECURE = process.env.JWT_COOKIE_SECURE === "true";
const COOKIE_SAMESITE =
  (process.env.JWT_COOKIE_SAMESITE as "strict" | "lax" | "none") || "strict";

function signToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function setTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

// POST /auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  user.lastLogin = new Date();
  await user.save({ validateModifiedOnly: true });

  const token = signToken(String(user._id), user.role);
  setTokenCookie(res, token);

  return res.status(200).json({
    success: true,
    token, // for Postman / API clients that can't use cookies
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    },
  });
});

// POST /auth/logout
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

// GET /auth/me
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.sub);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({ success: true, user });
});

// POST /auth/forgot-password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const SAFE_RESPONSE = {
      success: true,
      message: "If that email exists, a reset link has been sent.",
    };

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(SAFE_RESPONSE);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    // TODO: send email with rawToken via your email provider
    // Reset URL would be: `${process.env.ADMIN_URL}/reset-password?token=${rawToken}`
    console.log(`[forgot-password] reset token for ${email}: ${rawToken}`);

    return res.status(200).json(SAFE_RESPONSE);
  }
);

// POST /auth/reset-password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token: rawToken, password } = req.body;

    if (!rawToken || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Token and password are required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = signToken(String(user._id), user.role);
    setTokenCookie(res, token);

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  }
);

// POST /auth/users  (admin only)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  return res.status(201).json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /auth/users  (admin, manager)
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().select(
    "-resetPasswordToken -resetPasswordExpires"
  );
  return res.status(200).json({ success: true, users });
});

// GET /auth/users/:id  (admin, manager)
export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select(
      "-resetPasswordToken -resetPasswordExpires"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  }
);

// PATCH /auth/users/:id  (admin only)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isActive },
    { new: true, runValidators: true }
  ).select("-resetPasswordToken -resetPasswordExpires");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({ success: true, user });
});

// DELETE /auth/users/:id  (admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "User deleted successfully" });
});
