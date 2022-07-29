import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../Models/userModel.js";

// Registering a new user
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const saltRound = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRound);
  //hash(encrypt) the password and use this hashed password as the value of password

  // in new user is object of everthing entered by user(ie. req.body) but update the password entered with the converted hased password
  const newUser = new UserModel({
    ...req.body,
    password: hashedPassword,
  });

  try {
    const oldUser = await UserModel.findOne({ username: username });
    if (oldUser) {
      res.status(400).json({ message: "this username is already registered!" });
    }

    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// log in the user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if user exists , ie if username entered by user is present in our database formed by UserModel
    const user = await UserModel.findOne({ username: username });

    if (user) {
      // if user is found, ie if username matches then check if his entered password matches to that found user's password
      const validity = await bcrypt.compare(password, user.password);

      if (validity) {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({ user, token });
      } else {
        res.status(400).json("Wrong Password!");
      }
    } else {
      //if user is not found, ie username entered by user is not in our database
      res.status(404).json("User doesnot exist.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
