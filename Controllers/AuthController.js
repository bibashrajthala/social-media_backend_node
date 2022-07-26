import bcrypt from "bcrypt";

import UserModel from "../Models/userModel.js";

// Registering a new user
export const registerUser = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const saltRound = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRound);

  const newUser = new UserModel({
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });

  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
