import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_KEY;
const authMiddleWare = async (req, res, next) => {
  try {
    // take the token from the header's authorization
    // const {bearer,token} = req.headers.authorization.split(" ") // or
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (token) {
      // only if token is present then verify
      const decoded = jwt.verify(token, secretKey); // verify token based on our secret key
      console.log(decoded);
      req.body._id = decoded?.id; // some requests should be allowed only when decoded id is equal to user id,which is only possible when token is verified so replace user's id with decoded id and, for verified token it will still work and if not verified it will give error
    }
    next(); // go to next function of the route
  } catch (error) {
    console.log(error);
  }
};

export default authMiddleWare;
