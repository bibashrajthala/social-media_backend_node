import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const { _id, currentUserIsAdminStatus, password } = req.body;

  // if the user is admin or if he is id entered matches to the user's id in database then only he can update the user
  if (currentUserIsAdminStatus || id === _id) {
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

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user, token });
      // console.log("user is updated");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json("Access Denied! You can only edit your own profile.");
  }
};

// deleting a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId, currentUserIsAdminStatus } = req.body;

  if (currentUserIsAdminStatus || id === currentUserId) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User account deleted!");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can only delete your own profile.");
  }
};

// follow another user
export const followUser = async (req, res) => {
  const { id } = req.params; // pass and take id of user you want to follow from params
  const { currentUserId } = req.body; // you id will be entered

  if (id === currentUserId) {
    // you cant follow your own profile ie if user to follow and user who is following is same the dont allow to follow, else allow to follow
    res.status(403).json("Action Forbidden! You cant follow your own profile.");
  } else {
    try {
      const followUser = await UserModel.findById(id); // user to follow
      const followingUser = await UserModel.findById(currentUserId); // user who is following the followUser

      //if Bibash want to follow Ram, then Ram followers array should not already contain Bibash'id,if it doesnot contain then let Bibash allow to follow Ram , otherwise dont allow him as he has alreday  followed Ram
      if (!followUser.followers.includes(currentUserId)) {
        // when bibash follow ram, rams followers list(array) should contain bibash, and bibash's following list(array) should contain ram's id,so push them accordingly.
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed.");
      } else {
        res.status(403).json("Access Denied! You already followed this user.");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// unfollow another user
export const unfollowUser = async (req, res) => {
  const { id } = req.params; // pass and take id of user you want to follow from params
  const { currentUserId } = req.body; // you id will be entered

  if (id === currentUserId) {
    // you cant follow your own profile ie if user to follow and user who is following is same the dont allow to follow, else allow to follow
    res
      .status(403)
      .json("Action Forbidden! You cant unfollow your own profile.");
  } else {
    try {
      const followUser = await UserModel.findById(id); // user to follow
      const followingUser = await UserModel.findById(currentUserId); // user who is following the followUser

      //if Bibash want to unfollow Ram, then Ram followers array should already contain Bibash'id,if it contain then let Bibash allow to unfollow Ram , otherwise dont allow him as he has to first follow Ram in order to unfollow Ram
      if (followUser.followers.includes(currentUserId)) {
        // when bibash unfollow ram, rams followers list(array) should remove bibash's id, and bibash's following list(array) should remove ram's id,so pull them out of array accordingly.
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User Unfollowed.");
      } else {
        res.status(403).json("Access Denied! User is not followed by you.");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
