import bcrypt from "bcrypt";

import UserModel from "../Models/userModel.js";

// get a user
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    // console.log("hello");

    // when user is found, ie id of url params and our database matches
    if (user) {
      // even when user is found , we dont want to get password (it can be vulnerable), ie we only want to send every other details expcept passowrd so, we destructured the user's doc(object) we found and send all except password
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("User doesnot exists!");
    }
  } catch (error) {
    res.status(404).json("User doesnot exists!");
    console.log("error:", error.message);
  }
};

// edit / update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId, currentUserIsAdminStatus, password } = req.body;

  // if the user is admin or if he is id entered matches to the user's id in database then only he can update the user
  if (currentUserIsAdminStatus || id === currentUserId) {
    try {
      // user also wants to update password we need to hash that password before updating, so before updating our databse we hashed it and assigned it to req.body.password because we are updating to the req.body object(ie to what user entered)
      if (password) {
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);
        req.body.password = hashedPassword;
      }

      // find the user with id in params and update it with what user entered , update database to the new data=> new:true
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
      // console.log("user is updated");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access Denied! You can only edit your own account.");
  }
};
