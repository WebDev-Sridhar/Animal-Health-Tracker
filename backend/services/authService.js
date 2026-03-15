/**
 * Auth service - business logic for authentication
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");
const AppError = require("../utils/AppError");

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

  if (!phoneVerified) {
    throw new AppError("Phone number must be verified via OTP before registering", 400);
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
    phoneVerified: true,
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

module.exports = {
  register,
  login,
  updateProfile,
  generateToken,
};
