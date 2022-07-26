import express from "express";

import { getUser } from "../Controllers/UserController.js";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("user-route is working");
});

router.get("/:id", getUser);

export default router;
