import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { logger } from "../utils/logger";

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Log the incoming request data
    logger.info("Registration attempt:", { name, email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    // Create user document
    const userData = {
      name,
      email,
      password,
      role: "citizen", // Explicitly set the role
    };

    // Log the user data being created
    logger.info("Creating new user with data:", {
      ...userData,
      password: "[REDACTED]",
    });

    // Create and save user
    const user = await User.create(userData);
    logger.info("User created successfully:", { userId: user._id });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    // Enhanced error logging
    logger.error("Error in register:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Send more detailed error response
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
      details: error.name === "ValidationError" ? error.errors : undefined,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Error in login:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
