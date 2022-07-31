import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livesIn: String,
    country: String,
    worksAt: String,
    relationship: String,
    followers: [],
    following: [],
  },
  // it gives CreatedAt and updatedAt time properties by default,so that we dont have to do "createdAt":Date.now()
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
