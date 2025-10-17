import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const register = async (req, res) => {
  const { name,email, password,role } = req.body;

  if (!name || !email || !password || !role) {
    return res.json({ success: false, message: "Fill out all the details " });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "Email already registered " });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({ success: true, message: " registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
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
      { id: existingUser._id },
      process.env.JWT_SECRET,
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

    res.json({ success: true, message: "Login successfull" });
  } catch (error) {
    res.json({ success: false, message: "Invalid Password" });
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
