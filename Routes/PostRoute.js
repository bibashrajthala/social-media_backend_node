import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likeAndUnlikePost,
  getTimelinePosts,
} from "../Controllers/PostController.js";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Post-route is running");
});

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likeAndUnlikePost);
router.get("/:userId/timeline", getTimelinePosts);

export default router;
