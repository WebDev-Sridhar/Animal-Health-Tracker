/**
 * Auth service - business logic for authentication
 */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const config = require("../config");
const AppError = require("../utils/AppError");

const sendResetEmail = async (to, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.email.user, pass: config.email.pass },
  });
  await transporter.sendMail({
    from: `OurPetCare <${config.email.from}>`,
    to,
    subject: "Password Reset Request — OurPetCare",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#3d8c78">Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#3d8c78;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px">This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

const register = async (data) => {
  const { name, email, password, role, zone, phone, phoneVerified } = data;

  if (!name || !email || !password) {
    throw new AppError("Please provide name, email and password", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "public",
    zone,
    phone,
    phoneVerified: phoneVerified === true,
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      zone: user.zone,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
    },
    token,
  };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      zone: user.zone,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
    },
    token,
  };
};

const updateProfile = async (userId, data) => {
  const allowedFields = ["name", "phone", "zone", "phoneVerified"];
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  await user.save();
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    zone: user.zone,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    createdAt: user.createdAt,
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError("No account found with that email address", 404);

  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.clientUrl}/reset-password/${token}`;
  try {
    await sendResetEmail(user.email, resetUrl);
  } catch (err) {
    console.error("[ForgotPassword] Email send failed:", err.message, err.code, err.response);
    console.error("[ForgotPassword] EMAIL_USER:", config.email.user, "| EMAIL_PASS set:", !!config.email.pass);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(`Failed to send reset email: ${err.message}`, 500);
  }
};

const resetPassword = async (token, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new AppError("Reset link is invalid or has expired", 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwtToken = generateToken(user._id);
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: jwtToken,
  };
};

module.exports = {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
  generateToken,
};
