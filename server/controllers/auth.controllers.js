import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config();

export const register = async (req, res) => {
  const { name ,email , password ,role } = req.body;

  if (!name || !email || !password || !role) {
    return res.json({ success: false, message: "Fill out all the details " });
  }

  try {
    const existingUser = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    

    if (existingUser) {
      return res.json({ success: false, message: "Email already registered " });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'fallback_secret_key_for_development', {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({ success: true, message: " registered successfully", data: newUser });
  } catch (error) {
    res.json({ success: false, message: `From auth : ${error.message}` });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const passCheck = await bcrypt.compare(password, existingUser.password);

    if (!passCheck) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({ success: true, message: "Login successfull", data: { user: existingUser } });
  } catch (error) {
    res.json({ success: false, message: "Login failed" });
  }
};

export const logout = (req, res) => {

  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

     res.json({ success: true, message: "Logged Out" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const sendData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "No token found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};