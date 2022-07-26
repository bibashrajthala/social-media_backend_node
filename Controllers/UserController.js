import UserModel from "../Models/userModel.js";

// get a user
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    console.log("hello");

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
