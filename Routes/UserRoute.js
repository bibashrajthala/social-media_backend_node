import express from "express";

import {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../Controllers/UserController.js";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("user-route is working");
});

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

export default router;
