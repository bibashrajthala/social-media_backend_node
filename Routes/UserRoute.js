import express from "express";

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../Controllers/UserController.js";
import authMiddleWare from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// router.get("/", (_, res) => {
//   res.send("user-route is working");
// });

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", authMiddleWare, updateUser);
router.delete("/:id", authMiddleWare, deleteUser);
router.put("/:id/follow", authMiddleWare, followUser);
router.put("/:id/unfollow", authMiddleWare, unfollowUser);

export default router;
